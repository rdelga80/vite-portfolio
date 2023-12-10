---
title: Building a FastAPI + Strawberry (Graphql) Backend with Next.js 13 and React Server Components, Pt. 4
description: Building out a backend service using fastAPI + Strawberry graphql, Part 4
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: December 20, 2023
---

* [Part 1 - Setup For Strawberry + FastAPI](/articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1)
* [Part 2 - Strawberry GraphQL: Queries and Mutations](/articles/16-building-fastapi-strawberry-nextjs-rsc-pt2)
* [Part 3 - Managing Sessions and Context in Strawberry](/articles/17-building-fastapi-strawberry-nextjs-rsc-pt3)
* Part 4 - Switching to the Frontend: Next.js 13 and React Server Components, Pt. 1

---

I'll be honest, I really started this project hoping to dig much more into FastAPI and Strawberry and add some _Full-stack cred_ to my developer resume. But when I started working on it, instead of opting for my usual Vue3 install, I thought _"hey, might as well try to do a simple frontend using Next.js."_

Like you, I've been seeing React Server Components around the ol' interwebs, and have mostly been terrified about seeing what it was all about, but thought to myself that since this would be a small project where I would barely be interested in UI, that it would be a safe place to try the new paradigm out.

**That was a mistake.**

Overall, learning Strawberry has been a million times easier than RSCs.

There are typically two ways engineers approach new technology - we either hate it or we love it.

To be fair, the engineers who hate new things hate most new things, and the ones that love new things love most new things. I tend to fall in the former and not the latter.

And even though I tend to scare React Server Components seemed pretty interesting.

I've never been a fan of the SSR (Server Side Rendering) solution for frontend frameworks, I just never understood what benefit one would get over using a monolithic app like Laravel or even just PHP (which has become a point of criticism for RSCs, btw).

On the other hand, I've always been a big supporter of SPA (single page applications) because of the fun and tremendous user experience of a web application flipping magically without pages clearing and having to refresh with new content.

But as you may have heard, "SSR is better for SEO" (which is both true and untrue), and drives a lot of innovation for web clients, and tends to push people away from SPA and towards SSR.

RSCs feel like a compromise between these two concepts, so I dove into it for this project.

#### Setting Up the Client

Since my main purpose of this project is implementing Strawberry GraphQL, I wanted to make this as easy as possible, so for the client I'll be using [Next.js](https://nextjs.org/) and [Apollo Graphql](https://www.apollographql.com/docs/react/).

And since the app is going to be using GraphQL, Typescript is an absolute must. For anyone reading this who _doesn't_ use Typescript because they think that it's a overblown and not useful, I would typically agree, but Typescript matched with GraphQL is brilliant. I would really suggest sticking around for a future article where I can dig more into how well these play together.

Typically I am pretty strict about setting a nested Domain application architecture, but [Next.js's folder structure](https://nextjs.org/docs/getting-started/project-structure), just like Vue's or Nuxt's default folder structure, follows a more traditional MVC architecture, where `/pages` are separated from `/components`, etc.

```javascript
/src
  /app
    /route
      + page.tsx
      + layout.tsx
      / [route-id]  # dynamic routes
        + page.tsx
        + layout.tsx
  /components
```

It's important to note that each route by default has it's own `page` and `layout`, which I'll leverage for RSCs.

The other very important note are two tags that in the future you will become very very very familiar with: `use client` and `use server`, which you add to the first line of your React files to signify if the file is to be used on the server (RSC) or client ("normal" components).

I haven't had to this yet, but I _imagine_ it would be easy to migrate a React project to RSCs by just adding `use client` to all the files.

#### RSCs in Practice

This is where the fun really begins.

I was first confronted to the reality of RSCs when I began implementing a login page for the app. Some questions that caused a crisis of understanding:

* When I submit my credentials to the server from the client (`use client`) and I get the bearer token in response, how do the RSC components get access to that response? The same for vice-versa.
* When I get a response of data how do the `use client` components communicate that with the RSCs? And vice-versa.

Obviously, there's a theme here.

RSCs create a whole new layer of solutioning that a frontend dev has never had to deal with before centering around the client vs server component dynamic.

I'm sure that you've seen some version of this drawing around the subject:

![Client Server RSC Boundary](https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/client-server-boundary.png?alt=media&token=3764d462-e7e1-4711-810a-6d578d64957e)

While [Next.js recommends general pattern usage for Client components versus Server components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#when-to-use-server-and-client-components) our implementation is going to be a bit harder because of Apollo.

That leads to this [blog post from Apollo Client where they outline how to use an experimental library to make Apollo calls in RSCs](https://www.apollographql.com/blog/apollo-client/next-js/how-to-use-apollo-client-with-next-js-13/).

And unfortunately, Apollo's solution requires a server side Apollo client and a client side Apollo client, with each of the two clients having their own caches.

_Note: I will happily be proven wrong if I'm misunderstanding this document and that there is a way for the cache to communicate across the Client Boundary, but I haven't found it to be possible._

The majority of my implementation on the frontend is how to use the power of RSCs while saving API calls to the server.

Also, for transparency, I'm less concerned with creating perfect solutions for React than I am for FastAPI and Strawberry. I fully admit that I'm putting much less effort to do things "the right way" for RSCs, and just get a frontend together where I can interact with my backend.
