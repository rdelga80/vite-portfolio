---
title: Using Nuxt's New @nuxt/content Module To Launch A New Site
description: Nuxt's new content module makes launching a static website super fast and easy
headerImg: https://firebasestorage.googleapis.com/v0/b/rdelgado-portfolio.appspot.com/o/articles%2Faug-2020%2Fnuxt-content-writing-blog-ssr-static.jpg?alt=media&token=648df5b7-eb59-481e-8956-0dfa2be6c7f2
tags: nuxt,content,blog,vue
---

It was about time I spruced up the old portfolio website, and the timing was perfect as it lined up with Nuxt introducing a new content generation module - [@nuxt/content module](https://content.nuxtjs.org/).

### Adding Content To A Nuxt Project

The setup for the `@nuxt/content` is the same as any other new nuxt project. I prefer using:

`yarn create nuxt-app <project-name>`

Then you can add the module:

`yarn add @nuxt/content`

And in your _nuxt.config.js_ file add:

```json
{
  modules: [
    '@nuxt/content'
  ]
}
```

Additionally, you'll want to make sure your Nuxt app is set to `universal` to have access to `asyncData`, and I'm using `static` page generation.

And that's it for the heavy lifting. This level of simplicity makes it quick and easy to get to the fun part and create your site.

In your nuxt project, you'll now have a new folder called `content`, and within that folder you'll be storing all your posts. I'm going with markdown but there's any number of different file types that Nuxt content can parse including `yaml`, `yml`, `csv`, `json`, `json5`, `xml`.

Each file has a front matter area, which is similar to [dev.to](https://dev.to/)'s input area:

```
---
title: Title
description: Add a description
---
```

Along with built-in properties `dir`, `path`, `slug`, `extension (ex: .md)`, `createdAt`, `updatedAt`, you can also add custom ones, such as tags, which can be used to query content.

### File Structure

Next you'll want to create your file structure to handle loading your pages correctly.

First thing, in the content folder I'm adding a sub-folder for just `articles`, just in case in the future I want to have another content type available for use.

```
- content
  + articles
    - new-articles.md
```

Then in the `pages` directory I'm going to add:

```
- pages
  + articles
    - _slug.vue
    - index.vue
```

Notice that I'm going to leverage Nuxt's built in routing to create a page that accepts the slug as the path name, which is the article's file name. This will help long term with SEO, so make sure you're naming your files with that in mind.

### Retrieving Content

This is where things get really fun.

The power of the Content module is that it adds `$content` to the context.

`$content` is the built-in plugin that allows you to reach files within the content folder.

Basic usage:

```js
async asyncData({ $content }) {
  const docs = await $content('articles').fetch()

  return {
    docs
  }
}
```

By default, `$content` receives two-ish parameters, the first is the path within the content folder, the second are options. The reason I say two-ish parameters is because as you add parameters to the beginning of the call to create a specific file path.

Also, note the use of `asyncData` in this example and within the docs. Something to keep in mind is that `asyncData` is only accessible to files within the pages folder, otherwise if you wanted to use it in another area, such as in a component, you'd have to use the `beforeMount` lifecycle hook using `this.$content`.

### Displaying Content

Another handy bit of functionality that comes with the module is the `<nuxt-content>` component.

Basically, it accepts the returned content from `asyncData` and displays it without any handling.

From the above example, since we returned an array of articles, then your template would look something like:

```html
<nuxt-content
  v-for="doc in docs"
  :document="doc"/>
```

And that's it! Everything translated properly from your content files beautifully on the page.

### Leveraging Content

While a lot of cases will be handled with the basic usage of `$content` here's just a couple of examples on some more things you can do with the content module.

#### Accessing a specific article

Since the content path spreads, you can use the `$context` function coupled with another context element `$params` to retrieve specific articles.

```js
async asyncData({ $content, params }) {
  const doc = await $content('articles', (params.slug || 'index')).fetch()

  return {
    doc
  }
}
```
This allows for an incredibly clean and SEO friendly way to share posts and articles.

#### Creating an articles index page

Some of the other functionalities of `$content` are focused around querying your content files.

Some examples are `only`, `sortBy`, and `limit`, but you can find the complete method listings here: https://content.nuxtjs.org/fetching

To create an articles index page, we're going to aim for a few specific criteria:
- Limited to 5 posts
- Shows only the header, the date, and the description
- Sort by most recent

To accomplish this we can do something like this:

```js
async asyncData({ $content }) {
  const articles = await $content('articles')
    .only(['createdAt', 'title', 'description'])
    .sortBy('createdAt', 'desc')
    .limit(5)
    .fetch()

  return {
    articles
  }
}
```

Then in your template, you can specifically handle the various items:

```html
<div v-for="article in articles">
  <h2>{{ article.title }}</h2>

  <p>{{ article.description }}</p>

  <small>{{ article.createdAt }}</small>
</div>
```

Simple as that.

While using the content module can create simple websites incredibly easily, I can envision some enterprise uses as well.

Looking forward to diving even deeper into @nuxt/content.
