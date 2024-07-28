<script setup>
import ASidebar from '@/components/ASidebar.vue'
import ArticleLoader from '@/components/ArticleLoader.vue'
import { getArticles } from '@/assets/helpers.js'

const articles = getArticles(5)
</script>

<template>
  <div v-for="(articleSlug, index) in articles" :key="index">
    <ArticleLoader :article-slug="articleSlug" summary />
  </div>
</template>
