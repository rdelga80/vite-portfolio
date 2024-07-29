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
