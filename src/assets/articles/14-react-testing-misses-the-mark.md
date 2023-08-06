---
title: React Testing Methodologies Misses the Mark
description: React Testing Library and the Integration Testing methodology as outlined by Kent C Dodds eventually causes more confusion in testing than testing methods for VueJS.
tags: testing,frontend,integration,kent c dodds,react,vue,rtl,react testing library
date: August 6, 2023
---

I love testing, and when my day job transitioned to a React stack the fact that React had a novel approach to testing that I hadn't seen in other roles I'd been in was one of the more interesting things that I had to learn.

There's two main things that drive testing in the React ecosystem, the first one being [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro/), which is the React-centric version of Testing Library. RTL focuses on UI elements in testing, which pushes the developer to focus on the user experience to create tests.

This varies from Vue's testing methodologies which focuses more on Unit Testing on the component instance, which I was introduced to in [Edd Yerburgh's Testing Vue.js Application](https://www.simonandschuster.com/books/Testing-Vue-js-Applications/Edd-Yerburgh/9781617295249) which at the time was written for Vue2.

The second major difference is this article by Kent C. Dodds (who also developed RTL which grew out of this article) - [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)

In my short experience in the React ecosystem this article is like the Ten Commandments, any issue I raise about testing will inevitably have a React veteran bending on one knee holding a stone tablet with Kent C. Dodds' picture on it, chanting "Not too Many. Mostly Integration." reverently.

Let me state very clearly that I really dislike when anything is treated as it is above all reproach. I often find myself saying to a certain type of engineer, "we're engineers, we're meant to figure out solutions for things not just do what some article says without thinking about it." And the attitude towards testing can get to that level very quickly.

#### Side Effects

I remember when I was first introduced to this method of testing, I thought to myself, "what if I push a button to submit a form but it will also launch a nuclear missile?" Well, according to this perspective as long as the confirmation UI shows then it's all gucci.

But in a way, this isn't necessarily caught by unit testing either but in my opinion the usefulness in a Unit Test is that it forces the dev to examine the code and the mechanics of what's happening instead of just worrying if the UI shows appropriately.

#### Not Scalable

But things really fall apart, and where they always fall apart, is as a codebase grows to mammoth proportions.

I've seen this direction of testing grow into a file with a handful of tests which are thousands of lines of code while attempting to cover dozens of components that fall on the same page.

It's like a test file for an Admin page, which includes changing settings, uploading files, calling data from the backend, interacting with tabs, inputs, forms, navigation, functions that mutate date, functions that turn data into navigational data, etc, etc. while multiple actions falling in a test with the label "user updates settings."

__*All within one single testing file!*__

This is utter madness but upon questioning the tablet is shown.

Inherently I think anyone would understand how nonsensical this is, but the act of treating a single person's word in software engineering as gospel will always have these kinds of side effects.

#### Not Informative

And even with those issues, my biggest gripe with this methodology is that it is mostly _uninformative_, which I would argue is the __exact__ reason to write tests.

Let me clarify.

When writing Unit Tests one knows exactly what function, or line of code, is being tested. What's wonderful with modern day browsers is that you can even `cmd+click` your way _directly_ to the function you're testing, there's no mystery to it.

This is amazingly helpful when you run a test suite (and if you work in a job like I do then we're talking hundreds of files, thousands of tests, you might even want to go grab a coffee as it runs that's how big we're talking), and when a test breaks, being able to go to the test file, `cmd+click` to _exactly which_ function broke and fix it, saves an enormous amount of time and debugging.

_Side note: I've been in other situations where the functions were absolutely massive and even unit tests could only help so much to catch what was going wrong, but that's the issue of writing testable code and a whole other post. I digress._

For this, the test is __informative__, it tells you exactly where the problem is and if your test is written properly how to solve it.

But in the RTL direction, if something breaks the only information you get is something like "button with name X not found."

And if that button is being called in a component that's a great-great-great-grandchild of a component that is conditionally rendered depending on a certain piece of data being present in your MSW (Mock Service Worker), how would the above error _ever in a million years_ give you any information on that?

#### Combining RTL Integration and Unit Testing

Despite the bashing, I do like the RTL Integration testing method, and even have written about it previously [Borrowing Concepts from React Testing Library to Create a Better Testing Ecosystem](/articles/10-borrowing-from-rtl), [Applying React Testing Library Methodology to VueJs - Pt. 1](/articles/11-applying-rtl-to-vue-testing), and [Applying React Testing Library Methodology to VueJs - Pt. 2](/articles/12-rtl-vue-testing-bowling-score-pt2).

But what's generally lacking is a strategy on how to properly use both RTL Integration and Unit Testing together.

To clarify this issue, to me the Integration tests actually aren't necessarily Integration tests in how they've been grown to be used but rather a form of e2e testing using jest. From this perspective RTL is actually very useful in writing robust e2e tests without needing to fire up a full e2e library like Cypress, Playwright, or Nightwatch.

Also, RTL Integration tests allows a dev to abuse (in a good way) code during e2e tests much more fully and gives more control in e2e testing that I've found painful when using a true e2e library like the ones above.

To put the pieces together a very solid way of writing tests is to create a pairing of Unit and RTL Integration testing.

First, the file structure of the tests should be written in the Unit Testing perspective, so instead of creating a single testing file that encapsulates all the testing for a single page (or feature, or whatever high concept you go by), tests should be organized _specifically_ to the component that is being tested, even though it could also make sense to have one very high level test that would apply to a top-level page component.

```
/features
  /myFeature
    MyFeature.tsx
    MyFeature.test.tsx
    /components
      MyFeatureComponent.tsx
      MyFeatureComponent.test.tsx
```

Taking the example from above, with the unknown button, let's say that it was contained in `MyFeatureComponent`, then the tests for it would live in that component's test file not the greater `MyFeature` one.

Then, within your test file the tests should be paired up. There should be a unit test for a particular scenario that will test a function based on specific inputs paired with the RTL Integration tests that will cover the behavior as a result of it:

```
import { testFunction, MyFeatureComponent } from '@/features/myFeature/components/MyFeatureComponent.tsx'

describe('MyFeatureComponent', () => {
  describe('when action happens', () => {
    it('unit test on test function', () => {
      expect(testFunction(testParams)).toBe(...)
    })

    it('integration test on how it interfaces with UI', () => {
      render(<MyFeatureComponent />)

      ...
    })
  })
})
```

So if behavior _A_ (unit) then it will behave like _this_ (RTL), but if behavior _B_ (unit) then it will behave like this (RTL).

Of course, this is not to be used in _every single_ situation and should be used when a test needs context and information that will be useful later on to other developers if the test fails.
