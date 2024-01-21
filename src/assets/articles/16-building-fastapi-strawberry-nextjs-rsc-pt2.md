---
title: Building a FastAPI + Strawberry (Graphql) Backend with Next.js 13 and React Server Components, Pt. 2
description: Queries and Mutations
tags: graphql,fastapi,python,backend,development,server,nextjs,react,react server components
date: December 4, 2023
---

##### Building a FastAPI + Strawberry (Graphql) and NextJS 12 and React Server Components App

* [Part 1 - Setup For Strawberry + FastAPI](/articles/15-building-fastapi-strawberry-graphql-backend-nextjs-rsc-pt1)
* Part 2 - Strawberry GraphQL: Queries and Mutations
* [Part 3 - Managing Sessions and Context in Strawberry](/articles/17-building-fastapi-strawberry-nextjs-rsc-pt3)
* [Part 4 - Switching to the Frontend: Next.js 13 and React Server Components, Pt. 1](/articles/18-building-fastapi-strawberry-nextjs-rsc-pt4)
* [Part 5 - Structuring React Server Components](/articles/19-building-fastapi-strawberry-next-rsc-pt5)
* [Part 6 - Handling Data Responses with React Server Components](/articles/20-building-fastapi-strawberry-next-rsc-pt6)

---

Alright, time to really start digging into this crazy thing.

The app I'm building is a project I've been trying to get up and going _for years_, even before I was a programmer - a Fantasy Football app.

I think this is a really good project for anyone to work on, the concepts and relationships are really simple, and there's a lot of data to mess around with that can be used to build out complex structures.

For years the hardest part of the project was getting actual NFL data, but thankfully I came across an NFL data library for Python that made getting basic data very straightforward and easy: https://github.com/cooperdff/nfl_data_py

### Building A User Domain

Going off the previous post's structure, the Domain for the User will be structured as such:

```
/app
  /domains
    /users
      + resolvers
      + models
      + queries
      + mutations
      + types
      + utils
```

First things first is that we need to create the data table for the user, which will go in the `models` file:

```python
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String

from uuid import uuid4

from ..core.database import Base


class User(Base):
    """
    table for users
    """
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, unique=True, default=uuid4)
    name = Column(String(80))
    email = Column(String(120), index=True)

    class Config:
        orm_mode = True
```

Dang, I love SQLAlchemy, that structure is super clean.

I think this is pretty self-explanatory, but definitely make sure to add this snipped at the end of the table:

```python
class Config:
    orm_mode = True
```

According to [FastAPI's documentation](https://fastapi.tiangolo.com/tutorial/sql-databases/#orms) on ORMs, aka "object-relational mapping", this pattern converts database tables into objects to be used in code.

There are several to use, but FastAPI's docs recommend SQLAlchemy.

This Config setting allows you now to use `User` as an object to interact with Postgres's databases. This is beyond handy.

Now that we've defined our User model, we now need to use [Alembic](https://alembic.sqlalchemy.org/en/latest/) to migrate our database to create our table.

Following Jeff Astor's [Migrating Our Database](https://www.jeffastor.com/blog/pairing-a-postgresql-db-with-your-dockerized-fastapi-app/#migrating-our-database) guide on using Alembic, we can create the `User` table within our data base with some very easy steps he outlines using the command line within your Docker container.

The biggest difference between Astor's guide is that we're going to use `strawberry.ID` to provide our default ID values to our primary id columns:

```python
import strawberry

def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, unique=True, default=strawberry.ID),
        sa.Column('name', sa.String(80)),
        sa.Column('email', sa.String(120), index=True)
    )
    pass
```

The final part of creating `User` is to create a Strawberry type associated with our object:

```python
# domains/users/types.py

import strawberry


@strawberry.type
class User:
    id: strawberry.ID
    name: str
    email: str
```

Any frontend developer that's worked with Apollo and Typescript knows the importance of type declaration for a GraphQL API, and what we see above will become much more important when diving into the frontend of this project.

But for now, feel free to read through [Strawberry's Documentation on Object Types](https://strawberry.rocks/docs/types/object-types).

### Building A Query

Remember, the biggest strength of GraphQL is how it handles a request and response for data, and how it trims out properties that aren't requested specifically by the client.

For example, our `User` response _has the possibility_ of returning `id`, `name`, and `email` but that's _only_ if requested by the client.

For more complex requests that we'll get to later, this functionality becomes extremely powerful for helping keep data requests slim and trim.

Thankfully, though, Strawberry handles this for us, and all we really need to handle is structuring our Queries and Mutations properly.

Let's start with a very simple request, one without variables (aka an input filter in Strawberry), for all of the users in the database.

```python
from typings import List
import strawberry

from domains.users.types import User


@strawberry.type
class UserQuery:
    @strawberry.field
    def users(self) -> List[User]:
        [...]
```

I'm betting that's a lot simpler than you thought.

Just to break it down, we're declaring a strawberry type of UserQuery (incidentally the same type as User), then defining a field on that type for `users` that will then return a list of the type of users.

There's an alternate, and simpler syntax for Queries and fields that you can find in [Strawberry's Docs on Queries](https://strawberry.rocks/docs/general/queries), but I'm preferring to use this syntax because of some functionality I'll get into later.

But if we were choosing to use the simpler syntax it would look like this:

```python
@strawberry.type
class UserQuery:
    users: List[User] = strawberry.field(resolver=[...])
```

The next step is connecting the Query to it's resolver.

Since resolvers and controllers are the same thing the examples outlined in FastAPI's documentation can be applied here.

```python
# domains/users/resolvers.py

from typings import List

from domains.users.types import User as UserType
from domains.users.models import User as UserModel

def get_all_users(db: Session) -> List[UserType]:
    return db.query(UserModel).all()
```

Then plug it into the query:

```python
# domains/users/queries.py

from domains.users.resolvers import get_all_users

@strawberry.type
class UserQuery:
    @strawberry.field
    def users(self) -> List[User]:
        return get_all_users()
```

If anyone is following along at home, you'll find that this query _doesn't_ work. And the reason being the `db: Session` param in `get_all_users`.

I'll address this in the next post, but I'm going to leave it for now, because following [FastAPI's documentation on connecting endpoints and databases](https://fastapi.tiangolo.com/tutorial/sql-databases/#create-the-database-tables) outlines the basics on what this means, but there's a couple of differences using Strawberry that I'll get dive into later.

With your Docker container running, navigate to the exposed Strawberry GraphQL endpoint, for me it's just http://localhost:8008/graphql but your might be different depending on your Docker settings. Strawberry ships with it's own GraphQL playground, and you can test your endpoint with the following query:

```ts
query AllUsers {
  users {
    id
    name
    email
  }
}
```

### Building A Mutation

Thankfully in Strawberry mutations are basically the same structure as a query, but with a couple of minor differences.

Remember in GraphQL that Mutations cover the _C_, _U_, and _D_ portion of CRUD, and do the heavy lifting for your API.

Let's create a mutation to register a new user:

```python
# domains/user/mutations.py

import strawberry

from domains.user.types import User


@strawberry.input
class RegisterUserInput:
    name: str
    email: str
    password: str


@strawberry.type
class UserMutation:
    @strawberry.mutation
    def register_user(self, input: RegisterUserInput) -> User:
        [...]
```

Note that instead of using `@strawberry.field` we're going to use `@strawberry.mutation` in our `UserMutation` type.

I first implemented this using `field` and it seemed to work the same, so I'm not sure if this helps with anything more than internal referencing but it's still good to differentiate mutations from queries.

The other big difference is the `RegisterUserInput` input type.

The input type will help keep the params of the mutation (or query) cleaner and will provide type helping for the client for inputs.

Just like with our query, this mutation now needs to be connected to it's resolver:

```python
# domains/users/resolvers.py

from domains.user.types import User as UserType
from domains.user.models import User as UserModel


def add_user_db(name: str, email: str, db: Session) -> UserType:
    """
    Add a user to db
    """
    user_db: UserModel = UserModel(name=name, email=email)

    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    return user_db
```

```python
# domains/users/mutations.py

from domains.user.resolvers import add_user_db
from domains.user.types import User


@strawberry.type
class UserMutation:
    @strawberry.mutation
    def register_user(self, input: RegisterUserInput) -> User:
      return add_user_db(name=input.name, email=input.email, password=input.password)
```

Again, note that this won't work until the `db` is resolved in the resolver, but for now this is good enough to see the relationship between the resolver and the mutation.

Returning to our GraphQL playground, the mutation can now be handled as such:

```ts
mutation AddUser (
  $name: String!
  $email: String!
  $password: String!
) {
  registerUser (input: {
    name: $name
    email: $email
    password: $password
  }) {
    name
    email
    id
  }
}
```

And in the section below the entry, you'll need to add the variables to be passed into `AddUser` for `$name`, `$email`, and `$password`.

I haven't included it here, but if you notice the password is _obviously_ not stored directly in the `User` database and instead used to create an `Auth` item for this particular user, also outlined in [FastAPI's documentation on security](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/#oauth2-with-password-and-hashing-bearer-with-jwt-tokens) which is extremely thorough.

In the next post I'll dig into connecting up the `db` portion of the resolvers and how to do filtered queries and authentication on calls.
