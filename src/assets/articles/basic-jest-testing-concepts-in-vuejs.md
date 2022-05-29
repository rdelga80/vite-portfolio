---
title: VueJS Testing Basics - Pt. 1
description: A run through of some of the basics for Testing in VueJS with Jest
headerImg: https://firebasestorage.googleapis.com/v0/b/rdelgado-portfolio.appspot.com/o/articles%2Fnov-2020%2Fvuejs-testing-jest-basics.jpg?alt=media&token=be82c8e1-ee7c-4e9c-91ec-2451dc9f7978
tags: vuejs,testing,jest,vuetestutils
---

Vue Testing Basics TOC
* Part 1: Introduction - Basic Setup (active)
* [Part 2: Testing Mentality](/articles/testing-mentality)
* [Part 3: Testing a Single File Component - Computed Properties](/articles/vuejs-testing-single-file-components)

---


Unit Testing in Frontend is like the janitor's role for a dev team. They're kind of gross, really irritating, and most times gets left undone.

There was a reason I set out to specialize in Unit Testing and it's because most devs don't want to do it. In an effort to find a niche to help with job prospects, I stumbled into a really enjoyable aspect of programming that I think has really made me a much better developer.

The point of this article is to approach some vital parts of Testing VueJS that are used repetitively.

In my experience, the hardest part of Unit Testing is learning the difference between it and e2e Testing, but that's for another day.

__What You Need To Know Before Getting Started__

I wouldn't necessarily say that Testing is an advanced topic in Vue, but it certainly helps to know what happens a bit under the hood.

That means knowing about [Lifecycle Diagrams](https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram), [The Vue Options API](https://vuejs.org/v2/api/#Options-Data), [Props](https://vuejs.org/v2/api/?#props), and [Vuex](https://vuex.vuejs.org/).

While knowing about [Jest](https://jestjs.io/) is certainly helpful, you can easily pick it up by building tests. If anything it's also much more important to read the [Vue Testing Utils documentation](https://vue-test-utils.vuejs.org/), as well as [Lachlan Miller's Vue Testing Guide](https://lmiller1990.github.io/vue-testing-handbook/) - which was instrumental in helping me understand testing.

_Note:_ This, and subsequent posts will be for Vue2. It appears as if the next release for `vue-test-utils` will have some breaking changes, and where need be I'll update these posts.

You'll be able to install `jest` while going through the Vue CLI `vue create` prompts.

#### Mounting

Vue Testing comes built in with a few handy utilities to create a test mount to run your tests against:

1. [mount](https://vue-test-utils.vuejs.org/api/#mount)
2. [shallowMount](https://vue-test-utils.vuejs.org/api/#shallowmount)
3. [createLocalVue](https://vue-test-utils.vuejs.org/api/#createlocalvue)

Typically, the top of your test file will contain at least one of these functions:

```js
import { mount, shallowMount, createLocalVue } from '@vue/test-utils`
```

##### mount vs shallowMount

It's hard to explain the difference between `mount` and `shallowMount` without digging into specific code.

In essence `mount` will `mount` your component file along with any children with it. `shallowMount` only mounts that specific component, and will `stub` (create a fake) of any subsequent child components.

While I've heard it recommended to use `mount` in many guides and manuals, I think it can be impractical. A parent component that cascades into several children could be a serious pain when writing tests.

#### Structuring Your Test

There's a few main structural elements to a Test file: `describe`, `it`/`test`, and `beforeEach`.

1. `describe` is used as a larger, enveloping function that will hold smaller, more specific tests. This may be something like a description for the component file you're testing, or in the case of testing a Vuex store file, the `actions`, `mutations`, or `getters`.
2. `it`/`test` is a function for specific tests.
3. `beforeEach` is a function that runs before each `it`/`test` file within a description block. It is vital to learn how and where to use `beforeEach` functions within a test file because there can be some very confusing side effects if things like data, mock store, etc., aren't re-declared before each running of a test.

The file will look something like this:

```js
import { shallowMount } from '@vue/test-utils'
import TestFile from '@/components/TestFile.vue'

describe('Describes the test file you\'re running', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TestFile, { options })
  })

  it('this is a test within the describe block', () => {
    // wrapper will be refreshed on every subsequent test within this describe
  })
})
```

#### Create Wrapper

Another handy tool is `createLocalVue`.

You'll use this function when needing to mount a plugin that is breaking one of your tests, and most importantly will be used when adding mocked `Vuex` functionality to your tests.

```js
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import TestFile from '@/components/TestFile.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Describes the test file you\'re running', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TestFile, {
      localVue,
      store: new Vuex.Store({
        ...
      })
    })
  })

  it('this is a test within the describe block', () => {
    // wrapper will be refreshed on every subsequent test within this describe
  })
})
```

This will be the starting point for the majority of your testing. This _doesn't_ include store files,which will be covered in a section to themselves.
