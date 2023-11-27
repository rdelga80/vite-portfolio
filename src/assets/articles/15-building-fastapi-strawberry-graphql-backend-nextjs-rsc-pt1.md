---
title: Building a fastAPI + Strawberry (Graphql) Backend with NextJs 12 and React Server Components, Pt. 1
description: Building out a backend service using fastAPI + Strawberry graphql, Part 1
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: November 27, 2023
---

I took a bit of time off from my day job for the holidays, so what else am I going to do _but build out a whole gigantic app_. **_WHY NOT??_**

There's a couple of motivations behind this, but the big ones being that since my day job switched tech stacks from Vue and Python to React and Elixir (and Graphql) I've been wanting to make a project that would let me dig into that side of things.

Also, I am always looking to expand my knowledge of my favorite Python backend framework [FastAPI](https://fastapi.tiangolo.com/), and when I saw that FastAPI was recommending a library for a GraphQL backend architecture, I thought this is the time.

[Strawberry](https://strawberry.rocks/) is a super simple and straightforward library that interacts very simply with FastAPI. I'd even say that implementing it is so simple that if you already have a FastAPI REST library already built, you might be able to migrate it over to Strawberry GraphQL with very little effort.

I also say that as a frontend developer blindly feeling my way through implementing a full backend, so don't take my word for it.

For anyone just getting started with FastAPI and is trying to figure out how to get everything setup, including Docker, Postgres, Alembic, Pydantic, and SQLAlchemy, I cannot recommend this series of articles enough by Jeff Astor: [Up and Running with FastAPI](https://www.jeffastor.com/blog/up-and-running-with-fastapi-and-docker).

These articles are my go-to whenever I'm getting a FastAPI project setup. It covers mostly everything, with maybe a bit of tweaking to the Dockerfile for non-root user ownership.

### App Structure (Domain Driven Design)

For FastAPI, non-Strawberry, I tended to have a file structure similar to this:

```
/app
  /domains
    /[domain]
      + controllers
      + models
      + routes
      + schemas
      + utils
```

* _controllers_ - basically any functional that interacts with the database.
* _models_ - models to be used with SQLAlchemy, and define DB table structures and relationships.
* _routes_ - all api endpoints for this particular domain, which are imported into the `/app/core/routes/__init__.py` file.
* _schemas_ - Pydantic schema types to be used in response types and function returns, which also help with clarity of SQL joins, etc.
* _utils_ - functions not related to interacting with the database, but might be used with controllers.

I didn't include it here, but I can definitely see another file type for Errors and/or Exceptions. But since this is just a solo project, I didn't take things that far.

Switching things over to Strawberry really weren't that different:

```
/app
  /domains
    /[domain]
      + resolvers
      + models
      + queries
      + mutations
      + types
      + utils
```

Here's the key differences:

* _controllers_ => _resolvers_ - basically the same concepts.
* _routes_ => _queries_ / _mutations_ - GraphQL uses a single route, typically `/graphql` to handle all incoming calls, but routes each request based on the query or fragment being sent by the client.
* _schemas_ => _types_ - Strawberry provides it's own typing system, which is fundamental to GraphQL, and therefore _schemas_ and Pydantic are no longer needed. But, the concept that they both are trying to solve, typing responses and solving data responses from joins, etc., are handle in basically the same way. If anything, Strawberry is a bit simpler.

Going by this, it does seems like Strawberry is going to be a very simple switch over, considering that the main difference is between routes and queries/mutations.

Next up, setting up some basic queries and mutations.
