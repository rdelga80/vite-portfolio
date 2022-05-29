---
title: VueJS Testing Basics - Pt 3 - Testing a Single File Component - Computed Properties
description: Testing a Single File Component in VueJS - Methods, Components, Props, and more.
headerImg: https://firebasestorage.googleapis.com/v0/b/rdelgado-portfolio.appspot.com/o/articles%2Fjan-2021%2Fvue-testing-sfc-jest.jpg?alt=media&token=0dbb5481-2c9b-4cf4-b658-c2e74058fb5a
tags: vuejs,testing,jest,components,methods
---

Vue Testing Basics
* [Part 1: Introduction - Basic Setup](/articles/basic-jest-testing-concepts-in-vuejs)
* [Part 2: Testing Mentality, Intro to Test Driven Development](/articles/testing-mentality)
* Part 3: Testing a Single File Component - Computed Properties (active)

---

Now to get into the nitty gritty of testing a Vue SFC file.

I'm going to approach this from a Test Driven Development perspective - it's my opinion that this is by far the most effective way to write code. While it adds a layer of complication, it eventually becomes extremely helpful to writing hyper-fast code.

For this example, we're going to make a fairly simple component to display a User Card.

This will require us building out a page which will make an API call to get the Users, which will then be used to populate the User Card component.

Let's assume that the data structure in the response from the `users` endpoint looks something like this:

```json
{
  'first_name': string,
  'last_name': string,
  'address': {
    'line1': string,
    'line2': string,
    'city': string,
    'state': string,
    'country': string
  },
  'phone': string,
  'avatar': string (url),
  'id': string,
  'organization_id': string
}
```

We're also going to have an array of organizations called from a different endpoint that looks like this:

```json
{
  'name': string,
  'id': string,
  'address': {
    'line1': string,
    'line2': string,
    'city': string,
    'state': string,
    'country': string
  },
}
```

And we want to make the User Card component look something like this:

```html
+------------------------+
|        User Name       |
+------------------------+
|                        |
|      Avatar (Image)    |
|                        |
|         Org Name       |
+------------------------+
|      Address Line 1    |
|      Address Line 2    |
|  City, State  Country  |
+-----------+------------+
|    Edit   |   Delete   |
+-----------+------------+
```

### Getting Started

Normally I would strictly follow TDD and begin testing if the page was mounted correctly, and go from there. But since I'm just focusing on testing Computed properties in this post then it'll only include that.

This guide will hop back and forth between sections, so let's assume that the data on the page level has already been called and populated in the store, and now we're going to make use of it in our component.

Also, I'm going to break the rules of [Anti-Clever programming](/articles/anti-clever-front-end-programming-methodology), and pass the data into the component via props, which we can imagine as something like this:

```js
<UserCard
  v-for="user in users"
  :user="user"/>
```

And then inside the User Card:

```js
export default {
  ...
  props: {
    user: Object
  }
}
```

#### Testing Computed Properties

Computed properties can provide a bit of a problem with testing for VueJS.

Computed properties can best be seen as reactive data properties, which tend to rely on something external to themselves.

A good example is in the "city, state country" line in the middle of the card component.

Often times data isn't quite as fully formed as you want, and you may not be able to count on every data item being complete, depending on how the information is collected - and in this case let's say that addresses can be optional.

Therefore we want to create a Computed property to properly format the city, state, and country line.

First is to setup the Vue test file (review Part 1 of Testing Basics to refresh setting up a testing file):

```js
import UserCard from '@/components/UserCard'

describe('UserCard.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(UserCard, {})
  })
})
```

```js
describe('cityStateCountry', () => {
  test('when city, state, and country are present returns "city, state country"', () => {

  })
})
```

This lays out the first test regarding what the cityStateCountry Computed property hopes to achieve.

Computed properties can be handled in two possible ways:

1. Using `setProps` (or other means) to change the values in the wrapper that are fed into the computed property,
2. Using the `call` function to define a `this` that is local to testing the Computed property.

While the two strategies may appear to be interchangeable, they have appropriate usages.

Basically, strategy one should be your default but there are times when the data that's being used within the Computed property is hard to receive, and that's when strategy two is useful.

Returning to the test, using method one:

```js
describe('cityStateCountry', () => {
  test('when city, state, and country are present returns "city, state country"', () => {
    wrapper.setProps({
      user: {
        address: {
          city: 'New York',
          state: 'NY',
          country: 'US'
        }
      }
    })

    expect(wrapper.vm.cityStateCountry)
      .toBe('New York, NY US')
  })
})
```

In the test I've used `setProps` to set a `user` with the pertinent address data to return the formatted string.

The second testing strategy will be more obvious after we write the passing code in `UserCard`.

```js
export default {
  ...
  computed: {
    cityStateCountry() {
      const { city, state, country } = this.user.address

      return `${city}, ${state} ${country}`
    }
  }
}
```

For example purposes, we can also address this test using the `call` strategy:

```js
describe('cityStateCountry', () => {
  test('when city, state, and country are present returns "city, state country"', () => {
    const cityStateCountry = UserCard.options.computed.cityStateCountry // 1

    const localThis = {
      city: 'New York',
      state: 'NY',
      country: 'US'
    } // 2

    expect(cityStateCountry.call(localThis)) // 3
      .toBe('New York, NY US')
  })
})
```

1. Note that the test is directly against the imported User Card component itself, and not the mounted `wrapper`.
2. We define a "local this", which is any of the `this.` elements that are called within the component.
3. We use `call` with the defined `localThis` and test the output.

The benefit of this strategy is that you have an isolated environment to test against without any possible side effects from externally sourced data.

This is especially useful if the computed property is reliant on asynchronously sourced data, data that comes from other computed properties or methods that rely on libraries or plugins, or other issues along those lines.

Moving forward, I'll only use the `call` strategy if necessary.

The next aspect of testing is, to me, one of the biggest advantages of Test Driven Development - pre-determining any possible wrinkles and issues within code.

With the city, state, and country logic, sometimes there may be an issue of certain aspects of the data is missing, and sometimes the returned data may look something like this (because not all fields are required in the collection form, for example):

```js
{
  city: '',
  state: '',
  country: ''
}
```

And if that does happen, then the current code would return `,`, which is undesirable.

```js
describe('cityStateCountry', () => {
  test('when city, state, and country are present returns "city, state country"', () => {
    wrapper.setProps({
      user: {
        address: {
          city: 'New York',
          state: 'NY',
          country: 'US'
        }
      }
    })

    expect(wrapper.vm.cityStateCountry)
      .toBe('New York, NY US')
  })

  test('when city is not present returns "state country"', () => {
    wrapper.setProps({
      user: {
        address: {
          city: '',
          state: 'NY',
          country: 'US'
        }
      }
    })

    expect(wrapper.vm.cityStateCountry)
      .toBe('NY US')
  })
})
```

Note that this is why we wrapped a set of tests in a `describe`, so that we can address each wrinkle individually without a single test turning into a huge jumble of expects without clarity on why they exist.

Remember that with TDD the point is to write the code that _solves the test_. It is possible to have forseen this issue with writing the first test, and that's fine for something so simple, but TDD is not just a way to type code but a mental framework to assist with writing clearer code.

Most likely when you think about writing code you are thinking in tests first. You lay out a plan that it needs to handle A, B, and C conditions, but by the time you write the code you've already mentally addressed the possible issues.

This probably works the majority of the time. But if you're anything like me, all too often you look at the rendered page and there's some bug that you really don't understand, and then you sit staring intently at what you've written trying to decode where the side effect is arising from.

With TDD you break your mental process down systematically. You address condition A, then test. Condition B, test - did it break A? No. Great. Condition C, test - A breaks but B doesn't.

```js
export default {
  ...
  computed: {
    cityStateCountry() {
      const { city, state, country } = this.user.address

      let cityState = city ? `${city}, ${state}` : state

      return `${cityState} ${country}`
    }
  }
}
```

Then we address the third condition:

```js
test('when city and state is not present returns "country"', () => {
  wrapper.setProps({
    user: {
      address: {
        city: '',
        state: '',
        country: 'US'
      }
    }
  })

  expect(wrapper.vm.cityStateCountry)
    .toBe('US')
})
```


```js
export default {
  ...
  computed: {
    cityStateCountry() {
      const { city, state, country } = this.user.address

      let cityState = city ? `${city}, ${state}` : state

      return cityState ? `${cityState} ${country}` : country
    }
  }
}
```

Which also addresses the final test:

```js
test('when city, state, and country is not present returns ""', () => {
  wrapper.setProps({
    user: {
      address: {
        city: '',
        state: '',
        country: ''
      }
    }
  })

  expect(wrapper.vm.cityStateCountry)
    .toBe('')
})
```

It's this process of systematically breaking down code to _units_ that will make it much faster to digest and write code.
