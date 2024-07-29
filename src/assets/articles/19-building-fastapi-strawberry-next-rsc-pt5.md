---
title: Building a FastAPI + Strawberry (Graphql) Backend with Next.js 13 and React Server Components, Pt. 5 - Structuring React Server Components
description: Building out a backend service using fastAPI + Strawberry graphql, Part 4
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: December 27, 2023
---

* [Part 1 - Setup For Strawberry + FastAPI](/articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1/)
* [Part 2 - Strawberry GraphQL: Queries and Mutations](/articles/16-building-fastapi-strawberry-nextjs-rsc-pt2/)
* [Part 3 - Managing Sessions and Context in Strawberry](/articles/17-building-fastapi-strawberry-nextjs-rsc-pt3/)
* [Part 4 - Switching to the Frontend: Next.js 13 and React Server Components, Pt. 1](/articles/18-building-fastapi-strawberry-nextjs-rsc-pt4/)
* Part 5 - Structuring React Server Components
* [Part 6 - Handling Data Responses with React Server Components](/articles/20-building-fastapi-strawberry-next-rsc-pt6/)

---

Being the loyalist that I am to Apollo GraphQL (so that we can interface with the Strawberry GraphQL backend), we're going to use Apollo with our React Server Components as outlined in this blog post about how to use it's experimental RSC plugin to deal with the `use client`/`use server` dynamic - [How to Use Apollo Client with Next.js 13](https://www.apollographql.com/blog/apollo-client/next-js/how-to-use-apollo-client-with-next-js-13/).

The most important concept to take from this article is that there needs to be _separate_ instances of the Apollo Client to interface separately with server and client components.

For server components, we'll create an Apollo Client that can be imported as `getClient`:

```javascript
// @/lib/apollo/client.ts

export const { getClient } = registerApolloClient(() => {

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: new HttpLink({ uri: 'http://localhost:8008/graphql' })
  })
})
```

Following an example from the Apollo post this is how it can then be used:

```javascript
// app/page.tsx

import { getClient } from "@/lib/apollo/client";

import { gql } from "@apollo/client";

const query = gql`query Now {
    now(id: "1")
}`;

export default async function Page() {
  const { data } = await getClient().query({ query });

  return <main>{data.now}</main>;
}
```

Nothing too surprising there.

Next we create another configuration file for the client side, where instead of importing a function we'll create an Apollo provider wrapper which will allow us to use the various Apollo hooks:

```javascript
// @/lib/apollo/apollo-wrapper.tsx

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )

  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const makeClient = () => {
  const authorization = localStorage.get('authorization') ?? '' // WARNING

  const httpLink = new HttpLink({
    uri: 'http://localhost:8008/graphql',
  })

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: typeof window === "undefined"
      ? ApolloLink.from([
          new SSRMultipartLink({
            stripDefer: true,
          }),
          errorLink.concat(httpLink),
        ])
      : errorLink.concat(httpLink),
  })
}

export function ApolloWrapper({ children }: PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
```

RSCs requiring two separate instantiations of the Apollo Client is the first warning sign of the trouble the React Server Components are about to bring into your life.

You have been warned.

### Handling Authorization

As a frontend developer handling authorization is typically straight forward.

After submitting a user's login credentials, usually an email or username and a password, the backend consumes it, returns an authorization bearer token, that is then attached to any secure API call which the backend uses to validate the security of the calls.

```javascript
// @/app/login/page.tsx

'use client'

import { useMutation } from "@apollo/client"

import { gql } from "@apollo/client"

const LOGIN = gql`mutation Login (
  $email: String!
  $password: String!
) {
    login(
      email: $email
      password: $password
    )
}`;

export default async function Page() {
  const [login] = useMutation(LOGIN, { email, password })

  const handleSubmit = (event) => {
    event.preventDefault()

    const form = new FormData(event.target)

    const email = form.get('email')?.toString()
    const password = form.get('password')?.toString()

    login({ variables: { email, password } })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" />
      <input name="password" />
    </form>
  );
}
```

Remember that the purpose of our login is to retrieve a bearer token, and use it to handle authorization on any subsequent "private" calls.

That means adding an `onCompleted` to the `useMutation` to be able to store the returned token somewhere within the client. Typically I use local storage:

```javascript
// @/app/login/page.tsx

const [login] = useMutation(LOGIN, { email, password }, {
  onCompleted: ({ login }) => {
    localStorage.setItem('authorization', login.accessToken)
  }
})
```

Great, everything looks like it normally does and our client side Apollo Client will be able to grab that token and attach it to it's calls (as seen above).

Next, let's create a wrapper component that will check for that authorization token on the client side called `AuthorizedRoute` and if it's not present then it will punt the user back to the login page, which will be applied like this:

```javascript
<AuthorizedRoute>
  <Dashboard>
<AuthorizedRoute>
```

And to implement it, we'll do this:

```javascript
// @/components/AuthorizedRoute/AuthorizedRoute.tsx

'use client'

export const AuthorizedRoute = ({ children }: PropsWithChildren) => {
  const [authorizationHasLoaded, setAuthorizationHadLoaded] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const authorizationIsPresent = !!localStorage.get('authorization') // WARNING

    if (!authorizationIsPresent) {
      return router.push('/login')
    }

    setAuthorizationHadLoaded(true)
  }, [router])

  if (!authorizationHasLoaded) {
    return null
  }

  return <div>{children}</div>
}
```

This works as expected, but it's not my favorite way of handling authorization. One of my biggest pet peeves of React and react-router-dom as compared to Vue, is that it doesn't have a `beforeEnter` functionality, and the way that React can behave is to land on the private route and then boot a user to the login.

For Next the solution is using `Middleware` - https://nextjs.org/docs/app/building-your-application/routing/middleware.

For our app let's make our middleware like this:

```javascript
// @/middleware.ts // auto imported by Next.js

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
  const bearerToken = localStorage.get('authorization') // WARNING
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/_next")) {
    return NextResponse.next()
  }

  if (!PUBLIC_ROUTES.includes(pathname) && !bearerToken) {
    request.nextUrl.pathname = '/login'

    return NextResponse.redirect(request.nextUrl)
  }

  const response = NextResponse.next({
    headers: {
      authorization: bearerToken
    }
  })

  return response
}
```

But when twe try to run it we get this error: `localStorage is not defined`.

Not only that, but skipping ahead a bit any call made to the server is going to return as unauthorized, or throw the same error, because it can't find the bearer token with a similar error.

When I searched for local storage and RSCs on Google most suggestions online are to add a check for `typeof window !== undefined` but this still doesn't handle our problem, it just makes sure that local storage won't break when trying to access it on the server (since local storage is part of the browser window).

Looking back through [Next's Documentation, the way to solve this problem is with the `cookie` function imported from `next/headers`](https://nextjs.org/docs/app/api-reference/functions/cookies):

> The `cookies` function allows you to read the HTTP incoming request cookies from a Server Component or write outgoing request cookies in a Server Action or Route Handler.

Here's where things get weird with the `server`/`client` boundary (SCB).

Going back to our `Login` component, we might try to implement setting our cookies like this:

```javascript
// @/app/login/page.tsx

import { cookies } from "next/headers"

[...]

const [login] = useMutation(LOGIN, { email, password }, {
  onCompleted: ({ login }) => {
    cookies().set('authorization', login.accessToken)
  }
})
```

But the SCB will quickly teach you a difficult lesson in your new future as a frontend-ish developer.

The `cookies` function is only handled on the server side and will throw an error if used in a client side component.

Enter Server Actions.

As stated in [Next's Documentation for Server Actions and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations):

> Server Actions are asynchronous functions that are executed on the server. They can be used in Server and Client Components to handle form submissions and data mutations in Next.js applications.

Let's handle the returned Auth Token, by creating a new file to contain our Server Actions:

```javascript
// @/server-actions/setBearer.ts

'use server'

import { cookies } from "next/headers"

export async function setBearer(bearer: string) {
  cookies().set('authorization', bearer)
}
```

Then we can apply it to our client component:

```javascript
// @/app/login/page.tsx

const [login] = useMutation(LOGIN, { email, password }, {
  onCompleted: ({ login }) => {
    setBearer(login.accessToken)
  }
})
```

And we can also apply it to our middleware:

```javascript
// @/middleware.ts

const bearerToken = request.cookies.get('authorization')?.value || ''
```

Just to make sure this clear - we can hop in and out of the server and client side like hopscotch. We load a component on the server, render another in the client, and then the client can call back to an action that's on the server.

This is feeling a bit like Alice in Wonderland.

Going back to our Apollo server side instantiation, we can then add auth as such:

```javascript
// @/lib/apollo/client.ts

import { ApolloLink, HttpLink, concat } from "@apollo/client"
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc"
import { NextSSRApolloClient, NextSSRInMemoryCache } from "@apollo/experimental-nextjs-app-support/ssr"
import { cookies } from 'next/headers'

const httpLink = new HttpLink({ uri: 'http://localhost:8008/graphql' })

const authMiddleware = new ApolloLink((operation, forward) => {
  const authorization = cookies().get('authorization')?.value

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization
    }
  }))

  return forward(operation)
})

export const { getClient } = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: concat(authMiddleware, httpLink)
  })
})
```

Even though the SCB is strong it doesn't mean it's impossible to reach back and forth across this barrier.

And while using cookies is a good tool to pass a single value around, like a bearer token, things get even more complicated when attempting to handle returned data while trying not to duplicate API calls.
