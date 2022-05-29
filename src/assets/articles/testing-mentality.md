---
title: VueJS Testing Basics - Pt 2
description: VueJS Testing Basics, Pt. 2 - Testing Mentality, Intro to Test Driven Development
headerImg: https://firebasestorage.googleapis.com/v0/b/rdelgado-portfolio.appspot.com/o/articles%2Fnov-2020%2Fvue-testing-basics-methods.jpg?alt=media&token=270a3f8b-80a1-4fae-a2e5-66ac3da575fb
tags: vuejs,testing,jest,unit tests
---

Vue Testing Basics
* [Part 1: Introduction - Basic Setup](/articles/basic-jest-testing-concepts-in-vuejs)
* Part 2: Testing Mentality, Intro to Test Driven Development (active)
* [Part 3: Testing a Single File Component - Computed Properties](/articles/vuejs-testing-single-file-components)

---

It's can be hard to get started with Unit Testing, and I would argue it's because of a fairly simple misunderstanding between unit tests and e2e tests.

When starting to write tests, some people will find that the mental diagram of what they're programming creates a test that goes through too many sequences, and it makes it difficult to create a test that makes much sense of what exactly is happening.

_**Example: I want to test that when I click a button that it displays a message beneath it.**_

This is how a human thinks about testing, and is often where a person will start writing unit tests. The corresponding code in Vue may look something like:

```vue
<template>
  <div>
    <button @click="handleButtonClick">
      Open
    <button>

    <div
      v-if="showMessage"
      class="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
  data: () => ({
    showMessage: false,
    message: ''
  }),
  methods: {
    handleButtonClick() {
      this.showMessage = !this.showMessage
      this.message = 'Show This Message!'
    }
  }
</script>
```

Which would lead to a corresponding test to look like (read [Vue Testing Pt 1](/articles/basic-jest-testing-concepts-in-vuejs) to learn about Vue Testing setup):

```js
it('click button to show message and populate message property', () => {
  wrapper.find('button').trigger('click')

  expect(wrapper.vm.showMessage)
    .toBe(true)
  
  const messageDiv = wrapper.find('message')

  expect(messageDiv.exists())
    .toBe(true)

  expect(messageDiv.text())
    .toBe('Show This Message!')
})
```

While this _feels_ as if it handles the test properly, it's a classic example of over-testing code.

```js
expect(messageDiv.exists())
  .toBe(true)
```

Tests if `v-if` is functioning.

```js
expect(messageDiv.text())
  .toBe('Show This Message!')
```

Tests if Vue is rendering text correctly.

Neither of these two tests are within the scope of your code's unit testing. While the concepts _are_ within the mental range of what you want to be tested, i.e. "is the `messageDiv` visible" and "is the message displaying", the tests are beyond what's actually within the code.

### Unit Testing Conceptually and Test Driven Development

A lot of these testing ambiguities are due to writing tests _after_ the code has been written. Returning to your code and trying to test where you know it's going to end up, rather than attempting to test where the code is going, makes it much more difficult to write testable code.

Test Driven Development solves this method, and makes the entire unit testing mentality clear. It really boils down to breaking your tests into the smallest consumable unit possible, then writing the corresponding code to pass the test.

There's a general aversion to TDD because of how most people write code outside of a TDD framework.

A typical writing flow for most devs will be to write a fair amount of code, and eventually hit a point where they need to refactor what's already been written. They'll go back, rewrite the code, then go back to the point where they were having the issue and continue from where they left off.

This hopping back and forth creates anxiety around TDD because TDD creates extra layers of code and the perception is that going back and refactoring an error in the code will then cascade into a ton of other tests needing to be corrected.

But, that worry is mostly misguided because TDD helps to _prevent_ hopping around your code, and instead forces you to:
1. Slow down,
2. break your code down to be more easily understood,
3. and catch problems before you find them later.

So revisiting the above code, let's rewrite it using TDD.

**Testing The Button**

Focusing on this chunk of code: 

```html
<button @click="handleButtonClick">
  Open
</button>
```

The human mind is tempted to write a test like this:

```js
wrapper.find('button').trigger('click')

expect(handleButtonClickStub)
  .toHaveBeenCalled()
```

_Note: for more info on stubbing methods visit - https://vue-test-utils.vuejs.org/api/wrapper-array/#setmethods - this method is depreciated and not recommended for exactly the reasons stated here_

But why? What is really being tested here? The answer is that you're testing Vue's `v-on` functionality, there's nothing that actually needs to be tested here.

This is a perfect example of over testing, and that you should rather be thinking about testing in terms of code that _you've written_ to insure that it operates the way you want.

**The Test**

This is why the testing mentality is so much more important than writing tests themselves. It pays to remind yourself over and over again to not think of unit tests as e2e tests.

Therefore, the first test you'll want to write is:

```js
it('handleClickButton changes showSummary and sets the message', () => {
  wrapper.vm.handleClickButton()

  expect(wrapper.vm.showSummary)
    .toBe(true)

  expect(wrapper.vm.message)
    .toBe('Show This Message!')
})
```
And that's it.

No concern for what's rendered, no concern for if `v-if` is properly rendering a section. It's the smallest possible steps in what's happening.

Take a look again at the method:

```js
handleClickButton() {
  this.showMessage = !this.showMessage
  this.message = 'Show This Message!'
}
```

`handleClickButton` is just changing the value of `showMessage` and assigning "Show This Message!" to `message`.

Therefore, testing should focus on a single step ahead, not anything beyond that. So even if `handleClickButton` called another method, it would be tempting to test the outcome of that method, but the point is to break it down to a single unit.

This will make your tests concise, but also help prevent any cascading issues. Your tests will pinpoint where the error lays, rather than creating yet another bowl of spaghetti code to untangle.
