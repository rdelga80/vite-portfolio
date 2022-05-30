<script>
export default defineComponent({
  name: 'PHome'
})
</script>

<script setup>
import { defineComponent } from 'vue'
import ArticleLoader from '@/components/ArticleLoader.vue'
import { getArticles } from '@/assets/helpers.js'

const articles = getArticles(5)
</script>

<template>
  <div class="home">
    <div v-for="(articleSlug, index) in articles" :key="index">
      <ArticleLoader :article-slug="articleSlug" summary />
    </div>
  </div>
</template>
