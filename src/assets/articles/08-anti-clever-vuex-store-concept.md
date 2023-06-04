---
title: Anti-Clever - Pt. 3 Vuex Store as a Concept, not a Utility
description: For VueJS there's often times a lingering question on how to structure components and how they can access their data.
tags: vuejs,methology,programming,anticlever
date: January 3, 2022
---

Anti-Clever TOC
* Part 1: [Introduction](/articles/04-anti-clever-front-end-programming-methodology)
* Part 2: [Flattening Component Structure](/articles/05-anti-clever-component-structure)
* Part 3: Vuex Store as a Concept, not a Utility (active)

---

Docs: [Vuex Documentation](https://vuex.vuejs.org/)

State Management is one of the most elusive topics for most developers to wrap their head around, and, quite frankly, one of concepts that when done wrong leads to messy, complicated, and hard to understand code.

There's two main parts to this topic - the first, which is a more basic issue, is around the concept of _props drilling_ and the misuse of passing data around one's app. I'd argue this should be a fundamental question for any person hiring a Vue developer; whether that developer knows the flaws of the props/emit cycle, and what state management actually means, which was covered in [Part 2](/articles/anti-clever-component-structure).

The second issue, which is a more nuanced, has to deal with management the conceptual organization of state, which also connects to app architectural organization. While I had a lot of these ideas on my own, I highly recommend [Thomas Findlay's Vue - Road To Enterprise](https://theroadtoenterprise.com/), which really elevates a lot of these principals around conceptual versus utility driven architecture.

### Vuex As A Utility

This structure of store organization aligns with the structure of the app's pages.

Let's take the example of a messaging app, which has a page structure like this:

```html
+ components
  - Sidebar.vue
  - Footer.vue
  - Card.vue
+ pages
  + dashboard
    + inbox
      - index.vue
    + outbox
      - index.vue
    - index.vue
  + about
    - index.vue
  + index.vue
```

This app features four pages: `dashboard`, `inbox`, `outbox`, and `about`. Additionally, there are three components, two for layout: `sidebar` and `footer`, and a UI component for a `card`.

The typical Vuex implementation for this type of app, pretty closely aligns with this page structure:

```
+ store
  + dashboard
    - index.js
    - inbox.js
    - outbox.js
```

Pretty straight forward, right?

Here's where the **Anti-Clever** model comes into play.

Let's take a deeper look at the inbox and outbox store files.

More than likely these two files are calling the same API endpoint, let's just call it `messages`. The `messages` endpoint receives a query based on the desired type of message, either `inbox` or `outbox`.

Sometimes, when a frontend is overburdened due to a poor API response model, the `messages` endpoint may return a dump of messages where the frontend is forced to handle filtering the returned data. I would mostly recommend pushing back on backend developers to add a robust filtering system at the point of delivery, leaving the frontend to be as dumb as possible.

But in certain cases where that can't be done, or there's a desire to save on API calls for financial, or non-technical, reasons, the **Anti-Clever** mentality also holds true, and if anything makes this approach a bit clearer.

Within the `inbox` and `outbox` store files, there are two separate calls to the `messages` API, passing the proper payload to return inbox or outbox messages. This causes there to be two places in which the `messages` API call needs to be maintained.

For two calls, this may not be a big deal, but imagine there's 100 places where this needs to be maintained, and your backend developer just decided to add a required parameter that needs to be refactored in 100 places.

Yikes. Ctrl+Shift+F for a couple of days.

#### Abstracting as a Band-Aid to A Broken Foundation

Just like a house built on a poor foundation, organizing Vuex as a Utility leads to further bad decisions made to solve the problems that arise.

Typically, to solve the duplicitous issue with `inbox` and `outbox` the logic of the `messages` API call will be abstracted out, and a helper asset (or even worse a mixin) will be created to handle the call and response of the API.

```
+ assets
  + js
    - apis.js
+ store
  + dashboard
    - index.js
    - inbox.js
    - outbox.js
```

And within that `apis.js` file is a function that would look something like:

```js
const fetchMessages = (type) => {
  return axios.get('messages')
    .then(({ data }) => {
      return data?.messages || ''
    })
}
```

This appears to be cleaner calls within `inbox` and `outbox` where rather than two separate calls need to be maintained, there's one.

We're all good, right?

This is the solution that most guiltily violates **Anti-Clever** principals. This leads down a very long road of pain based on the next question: _**what if inbox needs to handle the message data differently than outbox?**_

The ramifications hurt so bad.

The reason why this can go off the rails so quickly is the _distance_ that lives between what `inbox` is asking, and what `messages` is doing. The utility between the two concepts is vast, because in reality `inbox` is wanting to do something totally different than what `messages` is providing.

This is why our simple `apis.js` helper asset very quickly turns into:

```js
const fetchMessages = (type, model) => {
  return axios.get('messages', {
    data: {
      type
    }
  })
    .then(({ data }) => {
      let messages

      if (type === `inbox`) {
        messages = data.messages.filter(id => startsWith(id, 'inbox-new'))
      }

      if (type === `outbox`) {
        messages = data.messages.filter(id => !includes(id, '-'))
      }

      if (model === 'warning') {
        messages = warningStyle(messages)
      }

      if (model === 'greeting') {
        messages = greetingStyle(messages)
      }

      return messages
    })
}
```

And then in each of the store files, it becomes something like (example only for the `inbox` store file):

```js
export const state = {
  messages: []
}

export const actions = {
  fetchInboxMessages({ commit }) {
    inboxMessage = fetchMessages('inbox', 'greeting')

    commit('SET_INBOX_MESSAGES', inboxMessage)
  }
}

export const mutations = {
  SET_INBOX_MESSAGES(state, message) {
    state.messages = messages
  }
}
```

And the spaghetti has begun.

If you're trying to debug a component and there's an issue arising from `state.inbox.messages`, you have to take three steps to even begin to understand what's happening:

`inbox.js -> apis.js/fetchMessages -> warningStyle`

With all three in totally different files, and areas of your app.

Your mind gets stretched thin with this type of problem. The paths of interpretation mount and mount, and before you know it, a bug fix that should take 5 minutes, now takes 2 days.

The main problem is that the information is too far away from where it's being handled. The human mind is not well suited to understand information like this.

### Vuex Store as a Concept

This entire runaround could have been avoided if the the organization of the store was addressed directly, rather than covering over the issue with building out more and more code.

The question boils down to: _what is actually trying to be accomplished here?_

The false assumption in the previous architecture is that the knowledge covered by `inbox` and `outbox` is the same thing that `message` is trying to cover.

But, in reality, `inbox` and `outbox` are subsections of `message`, not the other way around.

And without leaving too much work to undoing a conceptual puzzle of how to deal with this problem, it's easily diagnosed and solved by aligning your store files with your API calls.

That means, our Vuex store architecture should look something like:

```
+ store
  + messages
    - index.js
  + pages
    + dashboard
```

_Note: I left dashboard there because there are definite use cases to have a Store file attached to a page, but should be separate from conceptual store files._

Then, the file would look something like this:

```js
export const state = {
  messages: []
}

export const getters = {
  getStyledMessages: (state) => (messageStyle) => {
    switch (messageStyle) {
      case 'warningStyle':
        return warningStyle(state.messages)
      case 'greetingStyle':
      default:
        return greetingStyle(state.messages)
    }
  }
}

export const actions = {
  fetchMessages({ commit }, type) => {
    return this.$axios.get('messages', { data: { type }})
      .then(({ data }) => {
        commit('SET_MESSAGES', data?.messages || [])
      })
  }
}

export const mutations = {
  SET_MESSAGES(state, messages) {
    state.messages = messages
  }
}
```

And, in case you're dealing with an endpoint that dumps all the messages without any filtering:

```js
export const state = {
  messages: []
}

export const getters = {
  getMessagesByType: (state) => (messageType) => {
    return state.messages.filter(message => message.type === messageType)
  },
  getStyledMessages: (state, getters) => (messageType, messageStyle) => {
    const messages = getters.getMessagesByType(messageType)

    switch (messageStyle) {
      case 'warningStyle':
        return warningStyle(messages)
      case 'greetingStyle': // for informative purposes
      default:
        return greetingStyle(messages)
    }
  }
}

export const actions = {
  fetchMessages({ commit }, type) => {
    return this.$axios.get('messages')
      .then(({ data }) => {
        commit('SET_MESSAGES', data?.messages || [])
      })
  }
}

export const mutations = {
  SET_MESSAGES(state, messages) {
    state.messages = messages
  }
}
```

This has now changed the dynamic where the majority of the _information_ about `messages` live in the same mental space. Understanding the source of `messages`, how they're being returned, how they're being filtered, and how what is styling them (with only the stylized functions being abstracted), are all living under the same room.

This very directly handles the response from the `messages` API, placing it as a state item, and _then_ attempting to mutate it based on what's needed via getters, or in some cases a function within your component.

Fundamentally, the data should be placed into state undisturbed; this makes it understandable without having to chase down intermediate changes to understand why the output is what it is.

In the same vein, the output is much closer to the mutations that are pertinent to it. Again, allowing debugging to be much closer to the issue, rather than chasing down middle interpretations.

This makes it much easier for any dev to understand what's happening to the `messages` concept, especially for a dev that's looking at the code for the first time, and makes refactoring much simpler because of the lack of interpretation along the way.

This also follows very closely to Test Driven Development mentality (a step I'm skipping in this series, but is fundamental to mentally clarifying code). Each step of the process is clearly differentiated, and most of the interpretation of data is done at the point of response, and not in some middle point that requires following a thread of code to discover where the issue lies.
