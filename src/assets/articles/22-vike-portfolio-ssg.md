---
title: Converting My Portfolio to Vike SSG
description: Converting my Portfolio from a Vite-Vue SPA to a Vite-Vue-Vike SSG
tags: vite,vike,static site generation,server side rendering,nuxt
date: August 5, 2024
image: https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/vike-ssg-ssr-vue_588x441.webp?alt=media&token=7868c67a-e8dd-4338-a0f9-551a6b456c67
imageAuthor: Jozsef Hocza
imageAttribution: https://unsplash.com/@hocza
---

It's always bothered me that when I share a post from this site the metadata wasn't dynamic and would be a generic image placeholder and link info (because of the nature of _Single Page Applications (SPA)_).

This isn't the best way to promote my posts and it's also pretty bad for my SEO scores in general, including lighthouse which is becoming an ever increasingly metric used for frontend development -- _to a detriment_ but that's a different post.

I tried some hacky solutions like programmatically adjusting `meta` tags in the `head` on navigation but unfortunately that solution doesn't work for creating links for services like LinkedIn and Facebook but the update happens after landing on the page.

## Static Site Generation (SSG)

The simplest path forward is to migrate to an SSG. I'd always tried to avoid this because of all the weight that comes with using various frameworks so I thought I'd dig in to see what alternatives existed in the Vue ecosystem.

### Nuxt

In Vue-land one can't bring up advanced functionality like SSG or Server Side Rendering (SSR) without mentioning [Nuxt](https://nuxt.com/).

Nuxt, the self-described _Intuitive Vue Framework_, is the industry standard to build out fully robust Vue applications.

Some of it's features:

* Automatic page routing via folder structure
* Automatic component imports
* Robust data retching
* Middleware
* Authorization
* State management
* Content handling via markdown files (similar to this site!)

But most importantly for the purposes of this post, Static Site Generation and Server Side Rendering.

But for my purposes I chose not to go with Nuxt.

One of the major reasons was during the transition from Vue2 and Vue3, Nuxt lagged very far behind on releasing their Vue3 implementation, and that's a price I wouldn't like to pay for in the future.

Otherwise, using Nuxt on this site would be overkill.

For the most part this site operates on one view/layout and 3 different types of pages: home, articles, and single article.

Nuxt just wouldn't be the right solution here.

Plus, why have your own portfolio site if not to experiment with various solutions.

### Vite-SSG

Choosing to go with a lighter weight handling of SSG, I initially tried out [Antfu Collective's Vite SSG library](https://github.com/antfu-collective/vite-ssg).

Vite-SSG stood out due to it's apparently easy implementation, which only needed a slight change to `main.js`:

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

_Example from Antfu's Github_

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

_Example from Antfu's Github_

I was hopeful that this would work but I encountered a few problems with how Vite-SSG interacted with `vite-plugin-markdown`, the plugin I'm using to import markdown files into Vue components to automatically turn them into articles.

With `vite-plugin-markdown` I'm able to import markdown files dynamically by watching route changes:

```javascript
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

Using Vue's ability to dynamically import files is probably my number one reason why I prefer it to React but that's a different article.

Vite-SSG's ability to generate routes was unfortunately not able to take my dynamic page and convert it to static generated routes on build.

This was even after following the instructions for [custom routes to render](https://github.com/antfu-collective/vite-ssg?tab=readme-ov-file#custom-routes-to-render). The routes may have built out the pages but the data didn't update in a way that allowed links to show the correct `metadata` for the articles.

### Vike

I'm not going to lie, this wasn't the first time I'd taken a look at Vike but I'd never tried to implement it because it didn't seem all that friendly.

In retrospect after going through the migration process I would say that their documentation isn't as friendly as I personally would like. Often times they aren't overly explicit with directions and details, so it added some extra time trying to figure out what they're getting at in a particular section of the docs.

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

Out of the box Vike works differently which allows me to make a tweak or two on this functionality.

[Vike recommends not using Vue-Router](https://vike.dev/vue-router) which makes sense for an SSG/SSR site.

This also is important for the eventual page building process that Vite-SSG failed at.

Additionally, Vike has an opinionated structure that directs a developer in more of a Domain-Driven Design, which means that my site architecture will follow a pattern similar to this:

```
/src
  /pages
    +Layout.vue
    +Head.vue
    +title.js
    +data.js
    /index
      +Page.vue
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

Just like with VueRouter that leveraged a `<RouterView>` component but instead using `<slot />`.

#### +Header.vue

A rendering component that renders in the document's `<head>`, which is exactly what I'm looking for.

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
    +Layout.vue
    /index
      +Page.vue
    /articles
      +Page.vue
      /articles/@articleSlug #dynamic route
        +data.js
        +Head.vue
        +onBeforePrerenderStart.js
        +Page.vue
        +route.js
        +title.js
```

Two item's I didn't include above are __+onBeforePrerenderStart.js__ and __+route.js__.

These two files are used to inform Vike on how to handle a dynamically loaded page.

#### +route.js

`+route.js` is very straightforward and just reiterates the dynamic route for Vike, in my case:

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

Now that the static routes are built out, the data will properly be populated to the page in a way that leverages SSG and updates not only `<meta>` tags but also the article's information itself before rendering.

```javascript
import { trimSummary } from '@/assets/helpers'

export { data }

async function data(pageContext) {
  const articleSlug = pageContext.routeParams.articleSlug

  const articleModule = await import(`@/assets/articles/${articleSlug}.md`)

  const { attributes, html } = articleModule
  const summary = html

  return {
    articleSlug,
    attributes,
    summary
  }
}
```

This then becomes usable in `+Page.vue` or `+Head.vue` components:

```javascript
const { articleSlug } = useData()
```

Which is then used to populate out data as needed.

For example, `+Head.vue` becomes:

```vue
<script setup>
import { useData } from 'vike-vue/useData'

const { attributes } = useData()
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" :content="attributes.description" />
  <meta name="keywords" :content="attributes.tags" />
  <meta name="og:description" :content="attributes.description" />
  <meta property="og:title" :content="`Ricardo Delgado - Frontend Developer | ${attributes.title}`" />
  <meta property="og:type" content="article" />
  <meta property="og:image:type" content="image/webp" />
  <meta property="og:image" :content="attributes.image" />
  <meta property="article:published_time" :content="new Date(attributes.date).toLocaleDateString('en-CA')" />
  <meta name="author" content="Ricardo Delgado" />
</template>
```

One thing that I wish could work would be for the `+data.js` helper to pass the `VueComponent` that the `articleModule` returns to the `+Page.vue` component instead of just the article slug (which then re-imports the markdown file on the client side).

But then I think we're tip-toeing into React Server Components and that's a whole different article!

But for now Vike fosters a very simple and easy transition from SPA to SSG, and I'd definitely recommend it for smaller sized projects.

### Adding A Third Party Script

This one was driving me a bit crazy, even to the point where I reached out on the Vike Discord but received an answer that would require using a pretty old GTag library that I wasn't too crazy about.

The solution ended up being fairly simple once I realized that Vike didn't have a solution for this (which seems like it might not be the best) and just added the script myself in the top level `+Layout.vue` file:

```javascript
// adding before mount to attach the script while the app is
// rendering
onBeforeMount(() => {
  // add a guard so that analytics aren't logged on local
  if (import.meta.env.MODE !== 'production') {
    return
  }

  // check to see if the google analytics tag exists, this probably
  // shouldn't be an issue on prod but it's a good safety measure
  // when dynamically adding custom scripts
  const gTagExists = !!document.querySelector('#g-script')

  if (gTagExists) {
    return
  }

  // create script tags as provided by analytics setup assistant
  const gTagScript = document.createElement('script')
  gTagScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX')
  gTagScript.setAttribute('id', 'g-script')

  const gTagScriptConfigId = document.createElement('script')
  gTagScriptConfigId.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-XXXXXXXX');
  `

  // prepend them within the body
  document.body.prepend(gTagScriptConfigId)
  document.body.prepend(gTagScript)
})
```

Voila, Google Analytics added.

I'm not _totally_ sure this will work, but there's only one way to find out.
