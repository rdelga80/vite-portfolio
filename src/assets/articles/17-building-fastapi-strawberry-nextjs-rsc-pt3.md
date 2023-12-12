---
title: Building a FastAPI + Strawberry (Graphql) Backend with Next.js 13 and React Server Components, Pt. 3
description: Building out a backend service using fastAPI + Strawberry graphql, Part 3
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: December 11, 2023
---

##### Building a FastAPI + Strawberry (Graphql) and NextJS 12 and React Server Components App

* [Part 1 - Setup For Strawberry + FastAPI](/articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1)
* [Part 2 - Strawberry GraphQL: Queries and Mutations](/articles/16-building-fastapi-strawberry-nextjs-rsc-pt2)
* Part 3 - Managing Sessions and Context in Strawberry

---

One of the biggest differences that I've found between Strawberry and a the standard FastAPI REST solution is how to handle a database session.

I posted previous about the thoroughness of [FastAPI's documentation on connecting endpoints and databases](https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-database-tables), and my implementation for it is:

```python
# domains/core/database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from .config import DATABASE_URL

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
  db = SessionLocal()

  try:
    yield db

  finally:
    db.close()
```

`get_db` is especially handy, because it can be passed around your application's routes and controllers as a way to interact with your database thanks to SQLAlchemy's ORM functionality.

An example being something like:

```python
@router.get('/')
def get_users(db: Session = Depends(get_db)):
  return get_users_db(db)
```

The simplicity of FastAPI's syntax allows you to attach and define the database Session dependency on a route function easily, gaining access to it with a single line which can then be passed into a controller like `get_users_db` where you would use that Session to retrieve, update, or delete users.

For Strawberry this isn't quite so simple and I unfortunately couldn't find an explanation why.

My best guess would have to be with the 1:1 direct call for REST endpoints as compared to a GraphQL endpoint which isn't quite direct and instead needs to rely on a global dependency for the single GraphQL endpoint.

This is why in our previous post this direction doesn't work.

### Strawberry and Context

Let's take a step back for a second, and look further into how Strawberry introduces a concept called Schema (which is inherited from GraphQL).

As stated in [Strawberry's documentation on Schema](https://strawberry.rocks/docs/types/schema)

> "Every GraphQL API has a schema and that is used to define all the functionalities for an API. A schema is defined by passing 3 object types: Query, Mutation and Subscription."

Most importantly is how Schema defines all functionalities for a GraphQL API.

This is the powerful difference between GraphQL and REST. In our application this leads us to have to define the Schema as such:

```python
# domains/core/schema.py

from strawberry.fastapi import GraphQLRouter
from strawberry.tools import merge_types

from domains.users.queries import UserQuery
from domains.teams.queries import TeamQuery

from domains.users.mutations import UserMutation
from domains.teams.mutations import TeamMutation


queries = (UserQuery, TeamQuery)
mutations = (UserMutation, TeamMutation)

Query = merge_types('Query', queries)
Mutation = merge_types('Mutation', mutations)

schema = Schema(query=Query, mutation=Mutation)

graphql_app = GraphQLRouter(schema)
```

This will be the base of our GraphQL Schema.

And just like with REST is there a way to inject our Session references into this endpoint?

Thankfully there is thanks to FastAPI! Under the [FastAPI section in Strawberry Integrations, there's a section on context_getter.](https://strawberry.rocks/docs/integrations/fastapi#context_getter):

> The context_getter option allows you to provide a custom context object that can be used in your resolver. context_getter is a FastAPI dependency and can inject other dependencies if you so wish.

We can then add a Session context to our `GraphQLRouter`, like so:

```python
# domains/core/graphql/schema.py

from .context import get_context

[...]

graphql_app = GraphQLRouter(schema, context_getter=get_context)
```

Then we can create this simple `get_context` method:

```python
# domains/core/graphql/context.py

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from ...core.database import get_db


async def get_context(request: Request, db: Session = Depends(get_db)):
    return {
        'db': db,
    }
```

Going back to our previous post, remember that our User query wasn't working because `db` on our resolver was undefined. Previously we could assign it directly in our various REST endpoints and pass it to our controllers, but in converting them to resolvers we no longer have access to this pattern.

Now that the context is set in the Schema, we can now handle it as such:

```python
# domains/users/queries.py

from strawberry.types import Info

from domains.users.resolvers import get_all_users

@strawberry.type
class UserQuery:
    @strawberry.field
    def users(self, info: Info) -> List[User]:
        db = info.context['db']

        return get_all_users(db)
```

Now our database Session can be passed to the resolver. This also makes it easy to reuse all of your REST controllers, and convert them to be used for a Strawberry GraphQL implementation.
