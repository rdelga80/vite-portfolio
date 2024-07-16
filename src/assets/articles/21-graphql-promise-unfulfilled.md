---
title: GraphQL - A Promise Unfulfilled
description: GraphQL is a widely used tool for Frontend Asynchronous behavior especially in React, but has this shift away from RESTful been as good as it's sold?
tags: graphql,react,rest
date: July 13, 2024
---

_**GraphQL seemed like such a great idea when I first learned about it**_

Essentially it's the reinvention of an API endpoint. Instead of hitting a specific API to get back a certain set of data, let's have one endpoint that will return what's requested.

For example instead of an endpoint to retrieve a user's data, typically `/user`, instead pointing to `/graphql` and making requests against that endpoint for what a developer would like returned.

Simplicity at it's finest.

```js
query GetAuthor {
  author {
    name
    dob
  }
}
```

With this query you receive an author, or a list of authors, with only the properties of `name` and `dob` in the response.

It's important to note that the author's `hometown`, `university`, `penName`, etc. could have also been requested but GraphQL is an architecture to simplify API responses while also being more efficient.

Think of the counter example for REST pointing at the API endpoint of `/authors`. No matter what you need as a client developer, you will always get `name`, `dob`, `hometown`, `university`, and `penName`.

While this is a small example and would mostly be inconsequential, think of data responses that return arrays of objects with arrays of more objects, or objects with sub-objects and data properties that number in the hundreds.

Like all complex API endpoints if we only needed simple responses then we'd still be using AJAX and jQuery.

The real power of GraphQL is in the conceptual idea of "graphs", which is where GraphQL derives it's name.

Simply put a Graph is a data item that's connected to some business domain, in this case a `Book` or an `Author`, which should be familiar to anyone who's come across Domain Driven Design.

Graphs are simple to understand, and follow the same pattern as relational databases like SQL or PostgresQL.

One database table stores authors and another table stores books, then using ids the two tables relate to each other and join the items to create a single response.

For example, an `Author`'s books would have ids of 1, 2, 3. The `Book`'s table would store the book's title, publication date, and publisher. Those items shouldn't be stored with the Author's data, therefore the author table would only store those specific book ids, which would then relate to the matching book (connected by that id, which would most likely be a serial number).

GraphQL brings this same logic and applies it to queries and fragments (the schema structures in which Graphql requests data from the backend) because of Graphs:

```js
query GetAuthor {
  author {
    name
    dob
    books {
      title
      publisher
    }
  }
}
```

Using a fragment:

```js
fragment Books on Books {
  id // default property
  title
  publisher
}

query GetAuthor {
  author {
    id // default property
    name
    dob
    books {
      ...Books
    }
  }
}
```

As long as the backend is properly prepared to handle the schema request then the two _graphs_ will be returned, with the id being the connecting point between the two. More on this later. 

### Apollo

In the venn diagram of GraphQL, Apollo might not completely envelop GraphQL but it certainly could.

While GraphQL is a paradigm, Apollo is it's Coca-Cola.

In some previous posts I wrote about [using fastAPI and Strawberry to create a GraphQL backend](../articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1.md), but I reached a technical stopping point because it's not quite fully baked enough for a novice like me to properly get launch robust instance.

Apollo is, for better or worse, the gold standard for creating a GraphQL backend and unfortunately with that comes a lot of baggage.

### Caching

Looking through [Apollo's documentation on caching](https://www.apollographql.com/docs/react/caching/overview/) it's sold as being "highly configurable"; maybe that's true and my gripes might be with specific usages of Apollo's installation but I think that's doubtful.

To keep it simple, Apollo leverages a local cache to be able to store and update data that's been requested by the server. That data is then stored by Apollo's cache by combining the type of the data and it's ID.

For example, in our author example an author with the typename of `Author` and the ID of `123456` get's stored in Apollo's cache with the key of `Author:12345` by default.

_Note: this is determined by the Apollo Client instance file, the configuration can be found here: [https://www.apollographql.com/docs/react/caching/cache-configuration](https://www.apollographql.com/docs/react/caching/cache-configuration)_

Using that key, Apollo creates a hashmap of all the graphs and their corresponding data that are then related to each other by their key, the concept stated above for how Graphql sees the relationship of data as graphs.

```js
'Author:123456': {
  id: '123456'
  name: 'J.D. Salinger',
  books: [
    { __ref: "Book:1" },
    { __ref: "Book:2" },
    { __ref: "Book:3" },
  ]
},
'Book:1': { ... },
'Book:2': { ... },
'Book:3': { ... }
```

When an update happens to that data, whether due to another call to a query that contains that same Graph or from a subscription, Apollo uses that key to update the data.

### Where Apollo Fails

#### A Rigid Cache

Unfortunately, this system doesn't work right when examining the details.

Firstly, this caching system falls apart when you have two items on the same page but, for whatever reason, have two separate data responses.

For example, let's say that we have a `Book` that has two different types of returned data within in the same page, like the item's deeplink. In this example if the book is present on the homepage but appears in the "author" section it will deeplink to the book in the author's page, but if it's in the "reader" section it will deeplink to the book in a reader's page.

The data structure is exactly the same, it's just that this one item will be different.

Apollo's cache isn't able to notice this difference by default, and the data held in the cache will be what always renders. Meaning, whichever item appears first, let's say the "author" deeplink, then all other appearances of the `Book` will always have the "author" deeplink even in the "reader" section.

Or vice versa if the "reader" deeplink appears first.

One might think the correct solution would be bypassing the item in the cache by setting the `fetch-policy` to `no-cache` (since `network-only` still leverages the cache) but then any subscriptions would break.

The correct answer is to hack together a unique cache key using `typePolicies` when establishing `new InMemoryCache({ options })` ([as outlined here in the GraphQL docs](https://www.apollographql.com/docs/react/caching/cache-configuration#customizing-cache-ids)), or using the `dataIdFromObject()` function within `InMemoryCache`'s options.

But for the example above it can be tricky since the differences can be so minimal, and it can be annoying to have to manually track these kind of differences.

#### Schema Failures

This is my white whale.

I have chased a solution to this problem for years and the only solution I've even been able to possibly contemplate have been unbelievably tedious and annoying and involve versioning that I still don't have a firm solution for.

For anyone that hasn't had the pleasure of coming across this issue, in GraphQL if your request schema includes a property that hasn't been implemented on the backend, usually because your frontend schema is deployed before your backend, _your entire frontend application will crash._

This can be horribly stressful and quite troublesome for large organizations and will require immediate attention and rollbacks.

#### Graphql is rest? Rest is graphql? GRAPHQL IS REST?!

Despite all of GraphQL's efforts and complexity, it is still REST and a worse version of it.

_"But Ricardo, it isn't REST because you can request only specific properties in your schema."_

This would be great if we weren't talking about microservices within the same organization and if we weren't dealing with a cache.

This is immediately apparent once trying to request a graph from two different queries with different properties.

Meaning:

```js
query GetAuthor1 {
  author {
    id
    dob
  }
}

query GetAuthor2 {
  author {
    id
    name
  }
}
```

This above example will create issues in Apollo's cache because Apollo won't be able to properly match the graph from the first query to the graph from the second query because the schema doesn't match.

Which means that since most backends within an application are architected to fulfill data requests from the client one for one all requests of that graph inevitably will contain all the properties of the backend schema. Therefore any GraphQL request schema will just be the entire backend provided schema.

Which is just REST, except through a single endpoint, not a series of them.

_And if I'm going to be honest, from the small amount of work I've done with backend, it seems much easier to use a router and deploy separate endpoints than route through GraphQL's single endpoint._

One thing I will say is that if I were going to deploy an API as a Service then GraphQL might be a pretty good way to approach it, which makes sense since GraphQL's roots were formed in Facebook's API needs.

Otherwise, I can safely say that GraphQL wouldn't be a solution I would propose for any future projects.
