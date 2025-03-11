---
title: Solving Vue Input Event Typings and A Lesson In Why AI Fear Is Still Ridiculous
description: Vue Input Event is notoriously difficult to type for but along the way a lesson is learned in why AI is not something to be scared about
tags: vue,input,event,typescript,ai,llm
date: March 12, 2025
image: https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/broken-ai_588x441.webp?alt=media&token=157d5ee2-b898-4f1b-9a88-6731d7a50a0e
imageAuthor: Rudi Endresen
imageAttribution: https://unsplash.com/@rudien
---

It only took me a year but I finally figured out how to type a Vue Input component.

Unlike React, Vue doesn't ship with synthetic types for inputs which can cause problems for Typescript.

I turned to everyone's favorite "AI" programmer, Claude, and politely asked for the solution:

```js
<script setup lang="ts">
function handleInput(event: Event) {
 const value = (event.target as HTMLInputElement).value;
}
</script>

<template>
 <input @input="handleInput" />
</template>

```

In my world Typecasting (forcing a type) is never the right answer so I asked Claude to give me an answer for this problem without typecasting the input target value and it couldn't find a suitable answer no matter how much I prodded.

Whatever Claude responded with there were still Type errors and copy pasting back to Claude didn't help, it just kept circling around the same answer as above.

Here's the solution I came up with:

```js
type VueEvent = Event & { target: (EventTarget & { value?: string }) | null };

const handleInput = (e: VueEvent) => {
  model.value = e.target?.value;
};
```

This should be a pretty simple problem for an "AI" disruptor that'll be coming for my job shortly, at least according to every CEO/CTO on LinkedIn. But looking closer into it, why would Claude be unable to determine the answer for my straightforward question?

The reason is this solution doesn't exist on Stack Overflow, Vue's docs, Reddit, or whatever else Anthropic is using to train the LLM.

It's just further proof that the term AI is inaccurate. These are tl:dr; bots, which provide value of their own, but to think they'll be taking over the world anytime soon is pretty ridiculous.
