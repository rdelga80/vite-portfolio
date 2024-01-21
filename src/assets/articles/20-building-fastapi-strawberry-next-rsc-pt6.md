---
title: Building a FastAPI + Strawberry (Graphql) Backend with Next.js 13 and React Server Components, Pt. 6 - Handling Data Responses with React Server Components
description: Building out a backend service using fastAPI + Strawberry graphql, Part 4
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: December 20, 2023
---

* [Part 1 - Setup For Strawberry + FastAPI](/articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1)
* [Part 2 - Strawberry GraphQL: Queries and Mutations](/articles/16-building-fastapi-strawberry-nextjs-rsc-pt2)
* [Part 3 - Managing Sessions and Context in Strawberry](/articles/17-building-fastapi-strawberry-nextjs-rsc-pt3)
* [Part 4 - Switching to the Frontend: Next.js 13 and React Server Components, Pt. 1](/articles/18-building-fastapi-strawberry-nextjs-rsc-pt4)
* [Part 5 - Structuring React Server Components](/articles/19-building-fastapi-strawberry-next-rsc-pt5)
* Part 6 - Handling Data Responses with React Server Components

---

In the last post, I outlined how to instantiate Apollo Client between the server and client components in our application. The important takeaways were that each component type would need it's own Apollo Client instance and also that passing something like a bearer token between the two component types is possible using the `cookie` function as outlined in Next.js's documentation.

Of course, using cookies, or even local storage for that matter, is a very poor way of managing data, and needs a more robust strategy.

Keeping in mind that there is a separate cache for the server and for the client, the implication is that without properly handling this issue could lead to duplicating API calls, which on a large enough application could be incredibly costly.

An example from my current application is handling the user data response, which would return after login.

```javascript
// @/app/d/layout.tsx

export const fetchUser = async () => {
  const { data } = await getClient().query({
    query: FETCH_USER
  })

  return data.user
}

export default async function DashboardLayout({ children }) {
  const user = await fetchUser()

  return (
    <AuthorizedRoute>
      {children}
    </AuthorizedRoute>
  )
}
```

Note that this is in our `layout` file, [remember in the post introducing React Server Components and Next.js 13](/articles/18-building-fastapi-strawberry-nextjs-rsc-pt4), where I said we're going to leverage the `layout` and `page` folder to handle `server` versus `client` components.

Currently this call is on the server, and therefore is in the server side Apollo Client cache.

The question becomes how to effectively also get that data from the server onto the client.

Previously, Apollo would handle this kind of heavy lifting in an application where a dev could access it's cache and use that as a data layer that sits between an excessive amount of calls to the backend while also providing a store of data.

With Vue I've previously used Vuex and Piñia as a type of cache, and this is a fairly standard practice you've also probably come across with a robust enough frontend application.

But this complexity is not inherently solved with React Server Components and the split Apollo instance, and so doing a call like this:

```javascript
const { data } = useQuery(FETCH_USER)
```

Will create another API call to the backend.

And in some ways this is totally fine, and probably preferred if you're working at a large company and want to keep your codebase clean and easy for any level developer to use.

But since we're here trying to push limits I'm going to try a pattern to not only save an API call but also span the Server Client Boundary (SCB).

Thinking back to the division that's created by the SCD it's important to keep in mind that part of that division has to do with how a built component app behaviors and _hydrates_ components.

One pattern that we know is true with RSCs is:

```javascript
export default async function ServerComponent() {
  const data = { ... }

  return <ClientComponent data={data} />
}
```

For this post, this will be our primary method for transferring information. It's clean and it makes sense.

But before you go throwing client components inside all of your server components, keep in mind Next.js's structure:

```javascript
+ route
  + layout
  + page

export default async function Layout({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

export const Page = () => {
  return (
    <div>Page</page>
  )
}
```

Since we want to leverage Next.js's auto folder structure passing data directly from `Layout` to `Page` won't be feasible due to composition.

But let's not throw the baby out with the bath water. Instead, let's take this strategy:

```javascript
export default async function Layout({ children }) {
  const data = fetchData()

  return (
    <DataWrapper data={data}>
      {children}
    </DataWrapper>
  )
}

----

'use client'

export const DataWrapper = ({ children, data }) => {
  return (
    <div>
      {children}
    </div>
  )
}
```

By doing this we've successfully gotten the server data into the client portion of the component. But again, we're left with having to get the data to where we want it to go.

But of course, this is much easier with known strategies.

When discussing it with my team lead earlier this week, he suggested that it could be manually passed into the client side Apollo Client and hydrate the cache to be used from there.

Instead, for my application, I chose to use Context Providers:

```javascript
'use client'

import { DataProvider } from "@/hooks/useDataProvider"

export const DataWrapper = ({ children, data }) => {
  return (
    <DataProvider data={data}>
      {children}
    </DataProvider>
  )
}
```

Also here's a freebee not related to the topic of React Server Components, but this is a pattern I love to use for Context Providers based on this post by [Kent C. Dodds - How To Use React Context Effectively](https://kentcdodds.com/blog/how-to-use-react-context-effectively):

```javascript
// @/hooks/useDataContext.ts

'use client'

import { createContext, useContext, useState } from "react"

const DataContext = createContext(undefined)

const DataProvider = ({ children, data }) => {
  const [data, setData] = useState(data)

  const value = { data, setData }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

const useDataContext = () => {
  const context = useContext(DataContext)

  if (context === undefined) {
    throw new Error('useDataContext must be used within the a DataProvider')
  }

  return context
}

export {
  DataProvider,
  useDataContext
}
```

Which now means that any component within that family of components now has access to the data:

```
+ route // anything in this family
  + layout
  + page
  + sub-route
    + layout
    + page
```

And now we can update our top route page component:

```javascript
'use client'

import { useDataContext } from "@/hooks/useDataContext"

export const Page = () => {
  const { data, setData } = useDataContext()

  return (
    <div>Page</page>
  )
}
```

This dynamic can break down if specific data pieces need to be used across various parts of an application that might not be related to each other, but for a Fantasy Football app, where the structure is inherit to the data (i.e. teams will always be in a team route, user will always be in dashboard, etc) this works just fine.

Otherwise, leveraging a store and/or Apollo's cache would probably be a better solution.

But since these posts are more about setting up a fastAPI and Strawberry, I'm trying to be focused on that even though this slight detour to focus on React Server Components was worth the trip.
