<script>
export default {
  name: 'ArticlesHome'
}
</script>

<script setup>
import { getArticles } from '@/assets/helpers.js'
import ArticleLoader from '@/components/ArticleLoader.vue'

const articles = getArticles()
</script>

<template>
  <div class="articles">
    <div v-for="(article, index) in articles" :key="index">
      <ArticleLoader :article-slug="article" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.articles {
  padding-right: 30px;
}
</style>
