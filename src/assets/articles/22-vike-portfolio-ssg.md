---
title: Converting My Portfolio to Vike SSG
description: Converting my Protfolio from a Vite-Vue SPA to a Vite-Vue-Vike SSG
tags: vite,vike,static site generation,server side rendering,nuxt
date: August 1, 2024
image: https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/vike-ssg-ssr-vue_588x441.webp?alt=media&token=7868c67a-e8dd-4338-a0f9-551a6b456c67
imageAuthor: Jozsef Hocza
imageAttribution: https://unsplash.com/@hocza
---

It has always bothered me that when I share a post from this site the metadata was always the same thing and never gave any information for what the actual article was about.

Not only was this not the best way to promote my posts but it's also pretty bad for my lighthouse scores, which have apparently become increasingly important for frontend development.

![Lighthouse Scores for ricdelgado.com as an SPA](https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/article-21%2Flighthouse-rd-spa.png?alt=media&token=d35e89a0-e2b1-4181-b53c-1ec5ed80ef11)

I tried some hacky solutions like programmatically adjusting `meta` tags in the `head` on navigation but unfortunately that solution doesn't work for creating links for services like LinkedIn and Facebook.

## Static Site Generation (SSG)

The simplest path forward is to migrate to an SSG, which was something I'd always tried to avoid because of all the weight that comes with using various frameworks.

### Nuxt

In Vue-land one can't bring up advanced functionality like SSG or Server Side Rendering without mentioning [Nuxt](https://nuxt.com/).

Nuxt, the self-described "Intuitive Vue Framework" is the go to to build out fully robust Vue applications.

Some of it's features:

* Automatic page routing via folder structure
* Automatic component imports
* Robust data retching
* Middleware
* Authorization
* State management
* Content handling on markdown files (similar to this site!)

But most importantly for the purposes of this post, Static Site Generation and Server Side Rendering.

But for my purposes I chose not to go with Nuxt.

One of the major reasons was during the transition from Vue2 and Vue3, Nuxt lagged very far behind on releasing their Vue3 implementation, which is a price I wouldn't like to pay for in the future.

Otherwise, using Nuxt on this site would be overkill.

For the most part this site operates on one view/layout and 3 different types of pages: home, articles, and single article.

Nuxt just wouldn't be the right solution here.

### Vite-SSG

Choosing to go with a lighter weight handling of SSG, I tried out [Antfu Collective's Vite SSG](https://github.com/antfu-collective/vite-ssg).

What mostly stood out to me what that it seemed like it would be easy to implement by only needing to change my `main.js` page to be:

```javascript
// src/main.ts
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'

// `export const createApp` is required instead of the original `createApp(App).mount('#app')`
export const createApp = ViteSSG(
  // the root component
  App,
  // vue-router options
  { routes },
  // function to have custom setups
  ({ app, router, routes, isClient, initialState }) => {
    // install plugins etc.
  },
)
```

After that, updating `meta` tags would be handled by [Unhead's useHead() hook](https://unhead.unjs.io/):

```vue
<template>
  <button @click="count++">Click</button>
</template>

<script setup>
import { useHead } from '@unhead/vue'

useHead({
  title: 'Website Title',
  meta: [
    {
      name: 'description',
      content: 'Website description',
    },
  ],
})
</script>
```

I was hopeful that this would work, but I encountered a few problems with how Vite-SSG interacted with `vite-plugin-markdown`, the plugin I'm using to import markdown files into Vue components to automatically turn them into articles.

With `vite-plugin-markdown` I'm able to import markdown files dynamically by watching route changes, something like this:

```vue
import { shallowRef, watch } from 'vue'

const article = shallowRef(null)
const articleAttributes = shallowRef(null)
const articleSummary = shallowRef(null)

const setArticle = async (articleSlug) => {
  const articleModule = () => import(`../assets/articles/${articleSlug}.md`)
  return articleModule().then(async ({ attributes, html, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
    articleSummary.value = html
  })
}

setArticle(props.articleSlug)

watch(() => props.articleSlug, newSlug => setArticle(newSlug))
```

Using Vue's ability to dynamically import files is probably my number one reason why I prefer ot to React, but that's a different article.

Vite-SSG's ability to generate routes was unfortunately not able to take my dynamic page and convert it to static generated routes on build.

This was even after following the instructions for [custom routes to render](https://github.com/antfu-collective/vite-ssg?tab=readme-ov-file#custom-routes-to-render), which built out the pages but wasn't able to load the data in a way that was able update `metadata` for url readers to garner updated info from.

### Vike

I'm not going to lie, this wasn't the first time I'd taken a look at Vike but I'd never tried to implement it because it didn't seem all that friendly.

In retrospect after going through the migration process I would say that their documentation isn't as friendly as I personally would like. And by like, I mean being overly explicit with directions and details, which I know not every developer needs but can be a tough bar of entry for some.

A year ago I don't think I would've been able to make it through this implementation but it's amazing what a year of developer experience can bring to your toolbelt.

#### Page Structure and Routing

My portfolio has a fairly simple routing structure:

```
/layout (for sidebar)
  /home
  /articles
    /article (dynamic)
```

Previously I would use Vue-Router to grab the slug and dynamically import the markdown article and use Vue's magical dynamic `<component>` helper to render the imported markdown.

Out of the box Vike works different which allows me to make a tweak or two on this functionality.

[Vike recommends not using Vue-Router](https://vike.dev/vue-router) which makes sense for an SSG/SSR site.

This also is important for the eventual page building process that Vite-SSG failed at.

Additionally, Vike has some structure pages that direct a developer in more of a Domain Driven Design direction, which means that my site architecture will follow a pattern similar to this:

```
/src
  /pages
    +Page.vue
    +Layout.vue
    +Head.vue
    +title.js
    +data.js
    /index
      +Page.vue
      +Layout.vue
      +Head.vue
      +title.js
      +data.js
    /subPage # route-based
      +Page.vue
      +Layout.vue
      +Head.vue
      +title.js
      +data.js
```

#### +Page.vue

This is where the rendered page component, aka view in other frameworks, live.

#### +Layout.vue

This is the layout component for this route tree.

As a developer you'll use this like you would use any component in Vue that leveraged a `<RouterView>` component, but instead using `<slot />`.

#### +Header.vue

A rendering component that renders thats in the document's `<head>`, which is exactly what I personally am looking for to update the info for my shareable links.

#### +title.js

A helper function that updates the `<title>` metadata tag on a page.

#### +data.js

Data is essentially a `beforeRender` hook to be used to fetch data for a particular page.

---

With these new tools, the adjustment was simple.

My folder structure is updated to this:

```
/src
  /pages
    /index
    /articles
      /articles/@articleSlug #dynamic route
        +data.js
        +Head.vue
        +onBeforePrerenderStart.js
        +Page.vue
        +route.js
        +title.js
```

I'm only including the files from `/articles/@articleSlug` because they do the heaviest lifting in the app now.

Two item's I didn't include above are __+onBeforePrerenderStart.js__ and __+route.js__.

These two files are what inform Vike on how to handle a dynamically loaded page.

#### +route.js

Is very straightforward and just reiterates the route for Vike, in my case:

```js
export default '/articles/@articleSlug'
```

#### +onBeforePrerenderStart.vue

`onBeforePrerenderStart` is the logic for telling Vike which routes will need be generated as static pages.

One of the tricks I love the most from Vite (not Vike) is it's `import.meta.glob` helper, which is a godsend for anyone wanting to do simple file system work without having to deal with importing `require('fs')`.

```javascript
async function onBeforePrerenderStart() {
  const articles = import.meta.glob('../../../assets/articles/**.md')

  const articleUrls = Object.keys(articles)
    .map(article => `/articles/${article.split('/').at(-1).replace('.md','')}`)
  return articleUrls
}
```

#### +data.js

Now that the static routes are build out, the data will properly be populated to the page in a way that leverages SSG and updates not only `<meta>` tags but also the articles information itself before rendering.

```javascript
import { trimSummary } from '@/assets/helpers'

export { data }

async function data(pageContext) {
  const articleSlug = pageContext.routeParams.articleSlug

  const articleModule = await import(`../../../assets/articles/${articleSlug}.md`)

  const { VueComponent, attributes, html } = articleModule
  const summary = html

  console.log({ VueComponent })
  return {
    VueComponent,
    articleSlug,
    attributes,
    summary
  }
}
```

This then becomes usable in `+Page.vue` component:


