---
title: Borrowing Concepts from React Testing Library to Create a Better Testing Ecosystem
description: Unit Testing is so passe that it's time to create a new paradigm, code end 2 end testing, it's all the rage.
tags: testing,rtl,unit testing,tests
date: June 4, 2023
---

Well, it was bound to happen, but I've gone and bitten the React apple, and the slithering snake of frontend framework evolution has a solid hold on me. And now that I'm bi-lingual it's time to grab some parts of this new eco-system and apply it across my own programming universe.

I'm going to have a much larger post coming up regarding my descent into the world of React, but I had to take the time to specifically focus on a paradigm that felt very foreign to the Vue world but will be very powerful to borrow.

With Vue I focused pretty intensely on Unit Tests and building my testing philosophy from that direction. But with React, the gold standard is [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), and the gospel according to Kent C Dodds (see [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)).

The tl:dr; is that rather than testing code test the user's experience. The code is... incidental.

For example, let's say you want to test a modal appearing after a button click, the way I would write the test in Vue would be to test the function that the button would call, and if the code would then change the value of whatever `v-if` would create the modal to appear.

But in the React testing direction, you create a userEvent to click the button and then check if the modal is then visible by querying something that would be part of the element, be it text or a testing id attribute.

This is an enormous change from Vue's testing which focuses on methods, computed properties, and functions. One of the things I really appreciated about Vue's testing methodology was basically ignoring things that Vue should _just_ be able to do.

For example, if a button were to change a ref's value from `true` to `false`, on an `@click` event, there's no need to test it, because you should just assume that Vue can _just_ do it.

The reasoning being that Vue has it's own internal testing that maintains that aspect of the code properly and shouldn't be a concern of the developer.

#### Implications of React Integration Testing

What is great about React's testing is that as a developer my testing focus ends up on the User Experience, which is what my focus should _always_ start with.

Another benefit is that as a Vue developer nothing extra is needed to implement this type of testing methodology. Vue Test Utils perfectly handles this testing direction, even though React Testing Library is compatible with Vue, if one wanted to go with that.

Cruising quickly over to the [Vue Test Utils](https://test-utils.vuejs.org/) docs, one can see an API instance like [`find`](https://test-utils.vuejs.org/api/#find), which is a very suitable fill in for the [queries of RTL](https://testing-library.com/docs/react-testing-library/cheatsheet#queries).

Focusing on the User also turns Test Driven Development into a wholly different animal.

TDD for unit tests seems like a test in pedantry, nitpicking the possibilities a _function_ might do with all the odd and weird things that might happen programmatically. _"If I input a 40 million character string into a number input field, then it'll throw an error."_

But instead, your tests turn into an clear focus on what a user's behavior will be while interacting with your app.

I can even attest to how great this direction is while I was creating a scoring app for bowling. Rather than concerning myself with what the scoring algorithm will do logically and programmatically, I instead knew what my inputs would be then would test it against how I wanted it to display.

The input to output was very clear.

#### Two Steps forward Two Steps Back

As the great philosopher Paul Abdul would say, things do have their cost.

In many ways, this dynamic of testing is really useful and can wrap a lot of ticky-tack testing into a single helpful point A leads to point B solution.

But in my head, I have such nightmares of something like this happening:

1. User clicks button
2. Database deletes
3. Display modal

Test - button is clicked, modal displays. _WE GOOD_

The other nagging issue that I've come across with the React testing philosophy is that there is a low amount of information in this testing style to help a developer debug components and functions.

Let's say that the button click is in the parent component of a component tree where six components deep the modal is shown. There is zero information letting a developer know that _on line 51 of the 3rd component there is a hook that mutates state to pass the text of the modal into a store file which is preventing the modal from showing_.

Would that be the fault of the junior dev that was given an impossible JIRA ticket? Absolutely.

But when you have to go clean up that mess, you'll be cursing that test's ambiguity.

A Unit Test, on the other hand, says, "I will test this function, I am wanting it to do exactly this, and I'll tell you if and when it exactly breaks and most likely why."

#### Yin and Yang

While I haven't fully thought out a way to go about this, I think the answer comes down to borrowing something from both.

I think my perfect implementation would be a series of Unit Tests against a complex function, while then writing RTL styles integration tests to check it works properly for the user.

The Unit Tests would inform the dev _where exactly_ in the code the failures were happening, while the Integration tests would cover the actual working behaviors of the app.

Would it be writing more tests? Of course. Will you be extra covered when you slide your JIRA ticket to "complete"? You better believe it.
