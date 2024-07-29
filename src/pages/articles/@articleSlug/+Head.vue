<script setup>
import { useData } from 'vike-vue/useData'

const { attributes } = useData()
console.log({ attributes })
</script>

<template>
  <meta name="description" :content="attributes.description" />
  <meta name="keywords" :content="attributes.tags" />
  <meta name="og:description" :content="attributes.description" />
  <meta property="article:published_time" :content="new Date(attributes.date).toLocaleDateString('en-CA')" />
  <meta property="og:title" :content="`Ricardo Delgado - Frontend Developer | ${attributes.title}`" />
  <meta property="og:image" content="https://ricdelgado.com/article-images/nuxt-content-writing-blog-ssr-static.jpg" />
  <meta property="og:image:type" content="image/jpg" />
</template>
