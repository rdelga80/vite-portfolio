---
title: Using Vite Markdown and Glob Plugins to Generate a Simple Blog - Pt. 1 Creating a Post
description: Vite's powerful ecosystem allows to create extremely powerful apps, in this article I'll show how you can use Vite's Markdown and Glob plugins to generate a Blog Homepage and Blog Posts easily.
tags: blog,cms,vite,vuejs
date: June 7, 2022
---

Previously I've written about a similar functionality that's a plugin for Nuxt: [Using Nuxt's New @nuxt/content Module To Launch A New Site](/articles/01-nuxt-content-new-site).

While I love Nuxt's robust ecosystem, there is a growing bevy of issues using their framework^2 that makes it less and less worth using.

To name a few:

1. The delay between the release of Vue3 and Nuxt3 was painfully long. Anyone wanting to upgrade to use Vue3's new features was left wrestling with the composition-api, which didn't always have the easiest installation process.
2. This is specific to the content plugin, but recently there was a lot of dependency warnings over the internal tooling the plugin was using.
3. There is no leveraging of Vite with Nuxt, which is probably the most important technological development for Javascript frameworks in the last few years.

### Implementing Vite's Markdown Plugin

`yarn add -D vite-plugin-markdown`

Then in your `vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdPlugin from 'vite-plugin-markdown'

export default defineConfig({
  plugins: [vue(), mdPlugin({ mode: ['vue', 'html'] })],
})
```

And that's it. Seriously, Vite is a miracle.

Not here that I'm using the modes of `vue` and of `html` so that I can use the exported `VueComponent` while importing but also have access to the pure `html` incase I need a snippet (which you probably will).

The first thing to understand about the Vite Md Plugin is that it allows you to directly import `.md` files and have access to several ways of handling it's contents. From the docs:

```
export { attributes, toc, html, ReactComponent, VueComponent, VueComponentWith }
```

These are all the possible exported data types via the plugin's interpreter.

For example, a typical usage of the plugin would be:

```
<script>
import { attributes, VueComponent } from '@/src/articles/test-article.md'

export default {
  components: { VueComponent }
}
</script>

<template>
  {{ attributes }}
</template>
```

`attributes` being what you define in the header of your post, such as:

```
---
title: Post Title
description: Post Description
headerImg: https://headerImageUrl
tags: tag1,tag2,tag3
---
```

#### Handling Dynamic Articles

Where things get tough is when we're talking about handling dynamic routes and dynamic file imports, but thankfully this isn't that difficult with this plugin. Normally we'd have to deal with Vue's `defineComponentAsync` something along those lines, but the exported `VueComponent` works well.

I setup a fairly straightforward implementation of an Article Loader, but there's definitely much more complicated ways of doing this as well.

First off, my articles will be kept at `src/assets/articles` and to keep them in order I'm going to have a leading `00-` indexing system. But, if you wanted, you could implement a system where you read an articles `created` attribute, or even a modified one. Unfortunately, there's no ability to read a file's physical attributes with Vite Markdown, which means there's no auto detection of created or modified dates, you'll have to add them manually (even though I do think there's a way to find these as well).

Let's create a Vue Component just to load articles called `ArticleLoader.vue`, and first thing is to define a prop for the article slug:

```vue
<script setup>
const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})
</script>
```

Next, we'll handle the dynamic importing of the article:

```vue
<script setup>
const props = ...

onBeforeMount(() => {
  const articleModule = () => import(`../assets/articles/${props.articleSlug}.md`)
  articleModule().then(({ attributes, html, VueComponent }) => {
    // handle article
  })
})
</script>
```

Pretty straightforward, right?

We're importing in the `beforeMount` hook so that the data will populate into the template potentially preventing a break from missing data.

Next, since the import is asynchronous, we can chain a `.then` with our definitions, and then use them to populate out our data.

```vue
<script setup>
const props = ...

const article = shallowRef(undefined)
const articleAttributes = shallowRef(undefined)

onBeforeMount(() => {
  const articleModule = () => import(`../assets/articles/${props.articleSlug}.md`)
  articleModule().then(({ attributes, html, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
  })
})
</script>
```

Then we can add them to our template:

```vue
<template>
  <article class="article">
    <h2>
      {{ articleAttributes.title }}
    </h2>

    <component :is="article" />
  </article>
</template>
```

Note that the `VueComponent` only has the content of your `.md` article, and not anything in the header, hence why you need to separately define `attributes` separately.

Great, now we have a super straight forward article post.

In part 2, I'll go over using Vite's Glob plugin to create a Homepage with post summaries that link to the full post.
