---
title: Building a FastAPI + Strawberry (Graphql) Backend with NextJs 12 and React Server Components, Pt. 3
description: Building out a backend service using fastAPI + Strawberry graphql, Part 3
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: December 11, 2023
---

##### Building a FastAPI + Strawberry (Graphql) and NextJS 12 and React Server Components App

* [Part 1 - Setup For Strawberry + FastAPI](/articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1.md)
* [Part 2 - Strawberry GraphQL: Queries and Mutations](/articles/16-building-fastapi-strawberry-nextjs-rsc-pt2)
* Part 3 - Managing Sessions and Context in Strawberry

---

One of the biggest differences that I found between Strawberry and a standard FastAPI REST solution is how to handle a database session.

I posted previous at the thoroughness of [FastAPI's documentation on connecting endpoints and databases](https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-database-tables), and this translates very simply as:

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

`get_db` is especially handy, because it can be passed around your application as a way to interact with your database.

An example being something like:

```python
@router.get('/')
def get_users(db: Session = Depends(get_db)):
  return get_users_db(db)
```

The simplicity of FastAPI's syntax allows you to attach and define context on a route function very easily, defining a dependency and gaining access to it with a single line.

For Strawberry this isn't quite so simple, and I couldn't find an explanation why. My best guess would have to be with the 1:1 direct calls for REST as compared to a GraphQL endpoint which doesn't have quite such a direct 1:1 call, and instead needs to have more of a global definition.

Which is why in our previous post, this direction doesn't work.

### Strawberry and Context

Let's take a step back for a second, and look further into how Strawberry introduces a concept called Schema (which is inherited from GraphQL).

As stated in [Strawberry's documentation on Schema](https://strawberry.rocks/docs/types/schema)
