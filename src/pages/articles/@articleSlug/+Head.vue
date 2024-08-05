<script setup>
import { useData } from 'vike-vue/useData'

const { attributes } = useData()
</script>

<template>
  <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
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
