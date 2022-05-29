---
title: Vuex Plugins and Outlining Complete Components
description: Vuex plugins are a little known feature in Vuex, and implementing them can lead to abstracting concepts that can be burdensome to actions. But this also opens the door for deeper concepts like "complete components" - components that have dedicated store files.
headerImg: https://firebasestorage.googleapis.com/v0/b/rdelgado-portfolio.appspot.com/o/articles%2Fmar-2021%2Fvuex-plugins-components.jpg?alt=media&token=7c47e5cb-06f0-4adb-a71a-3c8605e4dd2a
tags: vuejs,vuex,plugins,components
---

<iframe src="https://codesandbox.io/embed/vuex-plugin-example-twzw9?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="Vuex Plugin Example"
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>

The above codesandbox contains a progression of concepts starting at a simple implementation of a Vuex Plugin, starting at intercepting calls to `actions` and `mutations` which then call `dispatch`es appropriately.

Conceptually the benefit is to abstract simple concepts from complex `action` calls. It also follows a more "domain driven" model, so that all the logic related to a single concept is together rather than spread across the codebase.

This will allow for faster and more direct refactoring, plus a simplicity in conceptual knowledge.

The Vuex documentation on Plugins is (like usual) very good:
* https://vuex.vuejs.org/guide/plugins.html
* https://vuex.vuejs.org/api/#subscribe
* https://vuex.vuejs.org/api/#subscribeaction

<br>

### 1: Implementing a Simple Intercept

The first level of implementing a Vuex plugin is for it to act as a simple interceptor.

We start with the Vue file:

```html
<template>
  <div>
    <p>Loading State First: {{ loadingStatuses.first }}</p>

    <p>
      <button @click="fetchSomething('first')">Fetch First</button>
    </p>

    <p>Loading State Second: {{ loadingStatuses.second }}</p>

    <p>
      <button @click="fetchSomething('second')">Fetch Second</button>
    </p>

    <p>Loading State Third: {{ loadingStatuses.third }}</p>

    <p>
      <button @click="fetchSomething('third')">Fetch Third</button>
    </p>
```

Then in our store file:

```js
state: {
  loadingStatuses: {
    first: false,
    second: false,
    third: false
  },
  values: {
    first: undefined,
    second: undefined,
    third: undefined
  }
}

actions: {
  fetchSomething: ({ commit }, item) =>
    setTimeout(
      () => commit("SET_ITEM_IN_STATE", { item, value: "test" }),
      1000
    ),

  setLoadingStatus: ({ commit }, loadingItemAndValue) =>
      commit("SET_LOADING_STATUS", loadingItemAndValue)
}

mutations: {
  SET_ITEM_IN_STATE: (state, { item, value }) => (state.values[item] = value),

  SET_LOADING_STATUS: (state, { item, isLoading }) =>
      (state.loadingStatuses[item] = isLoading)
}
```

This should look pretty typical to what would normally be written when intertwining loading with a call out to an API endpoint (which is mocked with the `setTimeout` in `fetchSomething`).

But what's missing is `fetchSomething` dispatching `setLoadingStatus` before the call to `true` and after to `false`, which typically looks something like:

```js
fetchSomething: ({ commit, dispatch }, item) => {
  dispatch("setLoadingStatus", { item, true })

  setTimeout(() => {
    commit("SET_ITEM_IN_STATE", { item, value: "test" })

    dispatch("setLoadingStatus", { item, false })
  }, 1000)
},
```

This is where the Vuex plugin comes in. By intercepting calls based on specific hooks, such as an `action` or `mutation`, these loading statuses can abstracted out to a single location.

First is to create a new plugin file, for this example you can see how it's handled in `loadingComponentPlugin.js`, which is imported into your Vuex `index.js` file, then registered on the root `Vuex.Store` as `plugins: [loadingComponentPlugin]`.

Then in the Vuex plugin file, you add this code:

```js
export default (store) => {
  store.subscribeAction(({ type, payload }, state) => {
    if (type === "fetchSomething") {
      console.log({ type, payload });

      store.dispatch("setLoadingStatus", {
        item: payload,
        isLoading: true
      });
    }
  });

  store.subscribe(({ type, payload }, state) => {
    if (type === "SET_ITEM_IN_STATE") {
      console.log({ type, payload });

      store.dispatch("setLoadingStatus", {
        item: payload.item,
        isLoading: false
      });
    }
  });
};
```

The first part of the Vuex plugin is `subscribeAction`, which will catch any action that is called _throughout the app_. `type` refers to the path of the actions, `payload` to what is being called with it, and the final argument `state` being the app's `state`.

The second hook is basically the same thing, except that the subscription is to `mutations`.

As the call on the action is made, a call to set `isLoading` to `true` is called, then as it goes to set the response in state (and therefore the response from the endpoint is complete), it returns `isLoading` to `false`.

While this is a simple example, an `includes` logic could easily be used in the `if` statement, which then would allow this logic to be passed between several different action calls, etc.

### 2: Implementing a Conceptual Store File

The first level in this is very handy for abstracting code, but this started me moving into a direction of abstracting store logic out of page stores, and again more in the "domain" direction.

The next step was creating a store file dedicated to handling the logic of "loading" that was not conceptually connected to a page or even component. Instead it's taking the idea of "loading" and moving it into it's own dedicated area, to be reused where necessary.

For example, let's say there are three different store files that need to handle loading states from API end-point calls. Typical cases will have each one of those pages having their own series of loading state handling for each one of those calls.

Let's just say each page has 3 loading states to handle, that means there's going to be a total of 9 various loading states to manage.

But with this conceptual store concept, those 9 areas that need handling can be reduced to just one.

We can register a new store file called `loading` as this:

```js
state: {
  isLoding: false
},
actions: {
  setLoadingStatus: ({ commit }, isLoading) =>
    commit("SET_LOADING_STATUS", isLoading)
},
mutations: {
  SET_LOADING_STATUS: (state, isLoading) => {
    state.isLoading = isLoading;
  }
}
```

Then a Vuex plugin can be registered like this (that in our example is `itemizedLoadingPlugin):

```js
export default (store) => {
  store.subscribeAction(({ type, payload }, state) => {
    if (type === "fetchSomethingForComponent") {
      store.dispatch("loading/setLoadingStatus", true, { root: true });
    }
  });

  store.subscribe(({ type, payload }, state) => {
    if (type === "SET_ITEM_IN_STATE_FOR_COMPONENT") {
      store.dispatch("loading/setLoadingStatus", false, { root: true });
    }
  });
};
```

This is copied from the codesandbox example, but there's another way to view this.

Let's say you have three files, and each of them need to have _one_ (more on this) loading state to worry about.

Then the Vuex plugin file can be used like this:

```js
const actionsThatTriggerLoading = [
  'fileOne/fetch',
  'fileTwo/fetch',
  'fileThree/fetch'
]

const mutationsThatTriggerLoading = [
  'fileOne/SET_DATA',
  'fileTwo/SET_DATA',
  'fileThree/SET_DATA'
]

export default (store) => {
  store.subscribeAction(({ type, payload }, state) => {
    if (actionsThatTriggerLoading.includes(type)) {
      store.dispatch("loading/setLoadingStatus", true, { root: true });
    }
  });

  store.subscribe(({ type, payload }, state) => {
    if (mutationsThatTriggerLoading.includes(type)) {
      store.dispatch("loading/setLoadingStatus", false, { root: true });
    }
  });
};
```

Then in each of the files that are hooked into the loading state can have a simple `mapState` (or `mapGetters`) that deal with loading:

```js
mapState({
  isLoading: (state) => state.loading.isLoading
})
```
<br>

### 3-a: (Experimental) Multiple Instances in One Page - i.e. Complete Components

As you may have noticed in the previous section, there is an issue when it comes to having _multiple_ loading statuses with a single page.

For example, let's say we have two areas in a page, each making separate calls to fetch data from various API endpoints:

```
+----------------+
|                |
|     CALL 1     |
|                |
+----------------+
|                |
|     CALL 2     |
|                |
+----------------+
```

If both areas are relying on a single `loading` mapState item, then when `CALL 1` is made, then `CALL 2` will fall into a loading state as well as `CALL 1` and vice-versa.

Since the store file is now driven by "domain" there is a possibility of repetition on the "consumer" side.

This is where a "complete component" comes into play. There are two possible solutions to this issue, I'll go in-depth about the first, then point to the other solution that was used by my former frontend lead at Tithely, Aaron Maurice.

First, create a new component, in the example above I named it `loadingComplete`.

```html
<template>
  <div class="loading-complete">
    Loading Complete: {{ loading }}

    <div>{{ loadingState }}</div>
  </div>
</template>
```

`loading` refers to the specific component instance's loading `state`, while `loadingStore` refers to the complete state of the entire state of the `loadingStore` `store` file (this will be apparent in a second).

Then create a `loadingModule` store file, which builds on what was created in the `loading` store in the previous section:

```js
import Vue from "vue";

const defaultState = {
  isLoading: false
};

export const state = {};

export const getters = {
  getThisState: (state) => (uid) => state[uid]
};

export const actions = {
  mountNewLoading: ({ commit }, uid) => {
    commit("CREATE_NEW_INSTANCE", uid);
  },

  setLoading: ({ commit }, { uid, isLoading }) =>
    commit("SET_LOADING", { uid, isLoading })
};

export const mutations = {
  CREATE_NEW_INSTANCE: (state, uid) => Vue.set(state, uid, defaultState),

  SET_LOADING: (state, { uid, isLoading }) => {
    state[uid].isLoading = isLoading;
  }
};
```

First off, notice that there is a `defaultState` variable, which is _not_ merged into `state` on initiation. If you peek ahead to `actions.mountNewLoading` then `mutations.CREATE_NEW_INSTANCE` you'll see the reason why is that there will be a hash registry of `defaultStates` on `state` by a argument called `uid` - a unique identifier.

Looked back at the `loadingComponent` file, you'll see a prop for `uid`:

```js
props: {
  uid: {
    type: String,
    default() {
      return this._uid.toString();
    },
  },
},
```

This leverages Vue's internal component registration id, but could also be a `uuid` or something else to will allow for there to be a uniquely associated identifer with each instance of the component.

Then, we'll use the `mountNewLoading` action to register the new instance in the `mounted()` hook (note: a _uid is not present until after mounted):

```js
mounted() {
  this.mountNewLoading(this.uid);
},

methods: {
  ...mapActions("loadingModule", ["mountNewLoading"]),
```

Returning to the above example with the two calls:

```
+----------------+
|                |
|     CALL 1     |
|                |
+----------------+
|                |
|     CALL 2     |
|                |
+----------------+
```

If you were to use a `v-if="loadingCallOne` and `v-if="loadingCallTwo` type of logic, with the `v-else` referring to the `loadingComponent`, then it would look something like:

```
+---------------------------------+
|                                 |
|    v-if="!loading1" CALL 1/     |
|    v-else LOADING uid-1         |
|                                 |
+---------------------------------+
|                                 |
|    v-if="!loading1" CALL 2/     |
|    v-else LOADING uid-2         |
|                                 |
+---------------------------------+
```

Examining the `loadingModule` store file, the `state` would look something like:

```json
{
  "1": { "isLoading": false },
  "2": { "isLoading": false },
}
```

Looking back at two particular calls in the `loadingModule` store file:

```js
export const actions = {
  setLoading: ({ commit }, { uid, isLoading }) =>
    commit("SET_LOADING", { uid, isLoading })
};

export const mutations = {
  SET_LOADING: (state, { uid, isLoading }) => {
    state[uid].isLoading = isLoading;
  }
};
```

You'll see that the `action` and `mutation` for setting the loading status requires the `uid` to make reference to the specific `state` item in which to change the loading state.

And since each loading state is nested within a unique state item in the state, we can leverage a `getter` to retrieve the `state` of that specific instance:

```js
export const getters = {
  getThisState: (state) => (uid) => state[uid]
};
```

Which in the `loadingComponent` looks like a `computed` property this:

```js
loading() {
  return this.getThisState(this.uid)?.isLoading || false;
},
```

#### __*Referencing a Module Externally*__

Now that the concept of _loading_ is wrapped up in a paired `store` and `component` file, how can these be used externally. For example, currently there is no way on how to inform a Vuex plugin on how which loading states to trigger on the page-level API calls.

Here, we'll introduce the ability to use Vue's built in `$refs` to pass along `uid`s from a components instance.

Within the `loadingComplete` component, we'll introduce a couple of helper methods:

```js
methods: {
  getUid() {
    return this._uid;
  },

  isLoading() {
    return this.loading;
  },
},
```

Then in an external page, in the codesandbox example is `Foo.vue`, we add a `ref` attribute to mounted component, to access the internal methods:

```html
<LoadingComplete ref="loading" />

<p>
  <button @click="getLoadingStateOfModule">
    Fetch Loading State of Module
  </button>
</p>
```

And then use them like so:

```js
getLoadingStateOfModule() {
  const _uid = this.$refs.loading.getUid();

  console.log(this.getThisState(_uid));
},
```

And then being able to retrieve the instances `uid`, it can then be used to call `actions`:

```html
<LoadingComplete ref="loading" />

<p>
  <button @click="handleFetchForModule">Fetch For Module</button>
</p>
```

```js
methods: {
  ...mapActions([
    "fetchSomethingForModule",
  ]),

  handleFetchForModule() {
    const moduleId = this.$refs.loading.getUid();

    this.fetchSomethingForModule(moduleId);
  },
```

Which in the page-level store file looks like:

```js
fetchSomethingForModule: ({ commit }, uid) =>
  setTimeout(
    () =>
      commit("SET_ITEM_IN_STATE_FOR_MODULE", {
        item: "module",
        uid,
        value: "test"
      }),
    1000
```

And then combined with a Vuex plugin:

```js
export default (store) => {
  store.subscribeAction(({ type, payload }, state) => {
    if (type === "fetchSomethingForModule") {
      store.dispatch("loadingModule/setLoading", {
        uid: payload,
        isLoading: true
      });
    }
  });

  store.subscribe(({ type, payload }, state) => {
    if (type === "SET_ITEM_IN_STATE_FOR_MODULE") {
      store.dispatch("loadingModule/setLoading", {
        uid: payload.uid,
        isLoading: false
      });
    }
  });
};
```

### 3-b: (Experimental) Multiple Instances in One Page - i.e. Complete Components - Alternate

Everything is the same in this approach, except how to handle creating the multiple state instances.

Referring back to Vuex's docs, there's another method called `registerModule`: https://vuex.vuejs.org/guide/modules.html#dynamic-module-registration , especially noting the [Module Reuse section](https://vuex.vuejs.org/guide/modules.html#module-reuse).

This method could be cleaner, and leveraging functionality already within Vuex, but conceptually still holds the same on what's trying to be accomplished.
