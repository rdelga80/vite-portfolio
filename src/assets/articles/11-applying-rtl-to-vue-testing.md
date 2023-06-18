---
title: Applying React Testing Library Methodology to VueJs - Pt. 1
description: How to apply React Testing Library methodologies to Vue Testing Library
tags: testing,rtl,unit testing,tests,how to,guide,react testing library,tdd,test driven domain
date: June 18, 2023
---

In the [last post](/articles/11-applying-rtl-to-vue-testing), I described how React Testing Library's integration style testing can be extremely useful in a Test Driven Design, especially coming from a perspective of integration.

A great example comes from a personal project of mine, creating a bowling scoring app:

![bowling scoring image](https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/bowling-score.jpg?alt=media&token=bd6411d0-669a-43af-9ba2-46ffd81ad7b0)

I have another article I'm going to write about bowling apps because I went looking for help from ChatGPT and it couldn't even come close to making the algorithm work! That's just how complicated the logic is for this.

The complexity of calculating bowling scores is due to it's ability to handle future scores, and also needing a different branch of logic for the tenth frame that also can effect the 8th and 9th frames.

For example, in most frames, the score needs to consider up to two frames in the future depending the score that happens in that frame, because a spare will include the score of the next ball thrown in it's score, and a strike will include the scores of the next two balls thrown in it's score.

For example:

```txt
   1     2     3
+-----+-----+-----+
| 9 - | 9 - | 9 - |
+-----+-----+-----+
   9    18    27

   1     2     3
+-----+-----+-----+
| 9 / |  X  | 9 - |
+-----+-----+-----+
  18    37    46

   1     2     3
+-----+-----+-----+
|  X  |  X  |  X  |
+-----+-----+-----+
  30    60    90  ... (assuming strikes through 5th)
```

Approaching this type of problem from a Unit Testing perspective is unfortunately a little bit unclear.

Would you want to test a function that will output a value based on a specific input per frame? Would you then want to input three frames and have it output the score? Or should it only focus on one?

Unfortunately this isn't quite optimal because the scenarios for what to test - initially - don't quite make sense for what's trying to be accomplished.

And truthfully, I think this really exposes the solitary unit tester's achilles heel. Unit testing can be disconnected from what the code is trying to accomplish and a whole suite of tests can be written for a function without actually making it's solution clear.

To open this line of thinking for a second, I think this is indicative of a flaw in a certain type of programmer's mentality, and can find it's way into a codebase and dev team, becoming a problem both from the code perspective but also in the human perspective.

Code is only a tool to serve users. Everything else is either for ego or programming for programming's sake, neither of which lead to good code or a good product.

Taking a step back then, let's approach this app from a human perspective.

I have a set of inputs, my scores per frame, and I expect them to both display in a certain way and also to calculate the score in a certain way.

Rather than solution this problem from a code perspective, let the tests approach the issue from a human perspective.

Taking a scoring input by frame:

```js
const frames = [
  [9,10,undefined],
  [10,undefined,undefined],
  [9,10,undefined],
  [9,10,undefined],
  [10,undefined,undefined],
  [10,undefined,undefined],
  [9,10,undefined],
  [9,10,undefined],
  [10,undefined,undefined],
  [9,10,10]
],
```

I want the display to look like:

```txt
   1     2     3     4     5
+-----+-----+-----+-----+-----+
| 9 / |  X  | 9 / | 9 / |  X  |
|  20 |  40 |  59 |  79 | 108 |
+-----+-----+-----+-----+-----+

   6     7     8     9     10
+-----+-----+-----+-----+-----+
|  X  | 9 / | 9 / |  X  | 9/X |
| 128 | 147 | 167 | 187 | 207 |
+-----+-----+-----+-----+-----+
```

One of the positives (but also possible downside) of the RTL direction of testing is that the concern of your tests are focused on what happens to the user. Whether it's them interacting with a button and something happens on screen or taking an input of data and then displaying it properly, the point is that the tests focus on what it takes to get from point A->Z, the rest doesn't matter, as long as A _gets_ to Z.

I will say, this also is my biggest qualm with the RTL direction of testing as well, something I'll get into in another post. But for now my next post will be to into how to implement this perspective of integration testing within a Vue app using Vue Testing Utils.
