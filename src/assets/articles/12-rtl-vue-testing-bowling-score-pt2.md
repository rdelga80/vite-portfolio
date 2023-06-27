---
title: Applying React Testing Library Methodology to VueJs - Pt. 2
description: Using RTL and Vue Testing Library to test a Bowling Scores App
tags: testing,rtl,unit testing,tests,how to,guide,react testing library,tdd,test driven domain
date: June 18, 2023
---

In the previous post I wrote about [how to approach a testing in Vue app using the React Testing Library perspective.](/src//assets/articles/11-applying-rtl-to-vue-testing)

This time I'm going to dig more deeply into exactly how to implement this mixed style.

To generate a standard bowling score UI, we're going to do a simple `v-for` loop on a data item for the frames (which we'll figure out later):

```vue
<template>
  <div class="frames">
    <div v-for="frame in frames" :key="frame" class="frame">
      {{ frame }}
    </div>
  </div>
</template>
```

Then on each frame we're going to add a data test key, this will give us a standard reference for each of the frames.

```vue
<div v-for="frame in frames" :key="frame" class="frame" :data-test=`frame-${frame}`>
```

Then the frame can be broken down further:

```vue
<template>
  <div class="frames">
    <div v-for="frame in frames" :key="frame" class="frame" :data-test=`frame-${frame}`>
      <div class="top-row">
        <div class="ball-one" data-test="ball-one">
          {{ frame.ballOne }}
        </div>

        <div class="ball-two" data-test="ball-two">
          {{ frame.ballTwo }}
        </div>
      </div>

      <div class="total-score" data-test="total-score">
        {{ frame.totalScore }}
      </div>
    </div>
  </div>
</template>
```

This structure means that we're going to have an array of objects that look like this:

```javascript
{
  ballOne: string
  ballTwo: string
  totalScore: string
}
```

This is a pretty basic implementation plus it's not accounting for the tenth frame which is a totally different series of tests that I'll leave off so that this article isn't needlessly complicated.

Next is setting up the tests in a way that reflects _the user's journey_, which is the RTL method of testing.

We want our tests to reflect this: _if in the first frame I bowl a 3 in my first ball, and a 3 on my second ball, then I would expect the display in the first frame to be a 3 as the first ball, 3 as the second ball, and with a total score of 6_.

Translating that into our test then:

```javascript
describe('bowling score', () => {
  let component = mount(BowlingScore)

  it('should display a first ball of 3 and a second ball of 3 with a total score of 6 in frame to match the score', () => {
    const firstFrame = component.get('[data-test="frame-1"]')

    expect(firstFrame.get('[data-test="ball-one"]').text()).toBe('3')
    expect(firstFrame.get('[data-test="ball-two"]').text()).toBe('3')
    expect(firstFrame.get('[data-test="total-score"]').text()).toBe('6')
  })
})
```

This really exemplifies the perspective of testing that RTL focuses on, and is outlined by Kent C. Dodd's post [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)

Unlike Unit Tests, this style of Integration Testing gives many layers of testing coverage for something that is much more intuitive.

Think of how this otherwise would be tested via Unit Tests. There would be a test on a mounted hook to make a call for the data, another test to mutate the data into a useable form, then another unit test on if there are any mutations that happen.

But this integration says, "I expect this and there it is."

### Extending Out Tests

It's obvious to see how annoying this can get by having to always type out the frame then the various scores. To combat this, and a mistake I see other devs make often when it comes to testing, is to not treat a test like javascript (even though it clearly is).

The missing layer of the test above is how will this data be populated. It might be from a call to the backend, it might be from something inputted from the user, or maybe even just a prop.

The important thing to remember is that it should reflect a user's experience as close as possible. And for the sake of this example, we're going to say that this data is coming in through props.

Therefore, any change of our data will have to be applied to our tests via `component.setProps`.

Leveraging arrays and looping, one can then writer a helper function for these tests like:

```
const setScores = async (scores) => {
  const formattedScores = scores.map(score => {
    const [ballOne, ballTwo, totalScore] = score

    return {
      ballOne,
      ballTwo,
      totalScore
    }
  })

  component.setProps({ scores: formattedScores })

  await component.vm.$nextTick() // always remember to nextTick any props changes

  scores.forEach((frame, index) => {
    const [ballOne, ballTwo, totalScore] = score

    const thisFrame = component.get(`[data-test="frame-${frame}"]`)
    expect(thisFrame.get('[data-test="ball-one"]').text()).toBe(String(ballOne))
    expect(thisFrame.get('[data-test="ball-two"]').text()).toBe(String(ballTwo))
    expect(thisFrame.get('[data-test="total-score"]').text()).toBe(String(totalScore))
  })  
}

// arrays of ball one, ball two, and total score for all frames
setScores([[1,2,3],[1,2,6],[1,2,9]...])
```

Now your tests are streamlined, and your input can easily match your output. Rather than writing out some overly lengthy `expect` and `toBe` statements, you can just pass in a matrix of scores and be able to update your code as errors arise.
