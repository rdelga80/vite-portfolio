---
title: Anti-Clever - Pt. 1 Flattening Component Structures
description: For VueJS there's often times a lingering question on how to structure components and how they can access their data.
tags: vuejs,methology,programming,anticlever
date: January 1, 2022
---

Anti-Clever TOC
* Part 1: [Introduction](/articles/04-anti-clever-front-end-programming-methodology)
* Part 2: Flattening Component Structure (active)
* Part 3: [Vuex Store as a Concept, not a Utility](/articles/08-anti-clever-vuex-store-concept)

---

One of the biggest benefits of working with VueJS is the built in _component focused_ conceptual framework and the ability to create isolated environments for handling styles and data.

But while the ability to create components is fundamental to VueJS there is a lingering question on how to structure them in a clear and efficient way.

#### The Problem with Props and Emits

I group Props and Emits together because they are the most used and direct ways to pass data back and forth between components.

```
+------------+
|   Parent   |
+------------+
 Emit ↑ ↓ Prop
+------------+
|   Child    |
+------------+
```

Props and emits are typically the first type of data handling that one learns for VueJS, but are also the most abused.

Props in particular become seductive short hands and will inevitably become some version of this:

```
+------------+
|   Parent   | Handles action
+------------+
 Emit ↑ ↓ Prop
+------------+
|   Child    | Intermediary
+------------+
 Emit ↑ ↓ Prop
+------------+
|   Child    | Intermediary
+------------+
 Emit ↑ ↓ Prop
+------------+
|   Child    | Emits action
+------------+
```

This is especially problematic if anything changes with the prop and then each intermediary component needs to be refactored. The chained props becomes burdensome and problematic.

#### Components: Structure and Form

This can be a bit controversial, but using props to pass data between components is basically a warning to reevaluate the usage of the component.

Passing Props tends to turn into a way of sharing data within a component, for example take a possible structure for a Card Component:

```
+------------------+
|      TITLE       |
+------------------+
|                  |
|      AVATAR      |
|                  |
+---------+--------+
|   DATE  | ACTION |
+---------+--------+
```

More than likely this would be done with props that look like this:

```js
props: {
  title: String,
  avatar: String,
  date: String
}
```

While this seems fairly straight-forward, the problems start when building an app where the Card Component isn't directly below the source of data.

For example, imagine if you have a user's page, and within that page you want to display a user component, and within that User component will be the Card component that was just outlined.

```
/Users
  + User
    + Card
```

The page level is where the `v-for` loop will run to mount each User component, then each user will pass that data to the Card component to be displayed:

**Users**:
```html
<User
  v-for="user in users"
  :user="user"/>
```

**User**:
```html
<Card
  :title="user.title"
  :avatar="user.avatar"
  :date="user.date"/>
```

While this is a fine scenario, the real issues pop up when the action within the card emits an action that then needs to be handled by the grandparent (`Users`) of that component.

That changes the code to looks something like this:

**Users**:
```html
<User
  v-for="user in users"
  :user="user"
  @parentAction="grandparentAction"/>
```

**User**:
```html
<Card
  :title="user.title"
  :avatar="user.avatar"
  :date="user.date"
  @childAction="$emit('parentAction')"/>
```

*With grandparentAction most likely being a method within the `Users` page.*

This is a simple example, but the problem can very quickly become out of hand, especially because this line of handling emits and props can easily grow to unmanageable levels.

#### Eventbus as a Bandaid

The usual recommendation is to implement an Eventbus to avoid this problem. I'll spare the details which can be seen in the Vue documentation: https://vuejs.org/v2/api/#Instance-Methods-Events.

While an Eventbus has it's specific usages, it can easily become problematic as an app grows because of global name overlapping.

### Solution: Slots and Shallow Components

In the Anti-Clever model components are limited to a very narrow usage - ***structure and style***.

Before getting into exactly how to implement this, here's a few telltale signs that a component is going to become complex and clever:

1. Using props to pass data into a component
2. Calling "actions" within the component, rather than emitting out all events that happen within it
3. Having specific emitters defined in your component
4. Interpreting events/actions within a component

The way to handle these issues:

1. Data and logic should always be handled in the parent component.
2. (and 3.) Having components parents pass inputs or buttons by leveraging v-slots
4. Since the data is handled in the parent component all events should then also be kept within the parent

Looking back at our Card component, then:

```js
+---------------------+
|<slot name="title"/> |
+---------------------+
|                     |
|<slot name="avatar"/>|
|                     |
+---------------------+
| (footer 1)          |
|<slot name="date"/> |
+---------------------+
| (footer 2)          |
|<slot name="action"> |
+---------------------+
```

Then in implementation:
```vue
<Card>
  <template #title>Title</template>

  <template #avatar>
    <img src="...">
  </template>

  <template #date>1-4-21</template>

  <template #action>
    <button @click="doSomething">
      Button
    </button>
  </template>
</Card>
```

Now the component is shallow and simple to manage. No jumping in and out of components to debug, except when handling styling, since the Card component's main purpose is to create a reusable structure and style.

The case for using props in a component like this is also much more obvious: to change the style or structure of the component, such as wanting a component to have a mobile display, or perhaps wanting to hide the header or define colors or borders, etc.

This is much simpler and easier to manage than expecting a component to handle all sorts of events and actions within it.

Looking back at the Users page example, there's no longer a need to have a grandchild nested component:

```html
<template v-for="user in users">
  <User>
    <template #card>
      <Card>
        <template #title>
          {{ user.name }}
        </template>

        <template #avatar>
          <img :src="user.profileUrl">
        </template>

        <template #date>
          {{ user.created }}
        </template>

        <template #action>
          <button @click="deleteUser(user.id)">
            Delete
          </button>
        </template>
      </Card>
    </template>
  </User>
</template>
```

That's assuming that within the User component there's a slot for `card`.

The biggest take away is that now all the business logic lives within one file, and doesn't rely on emits and props to manage data.
