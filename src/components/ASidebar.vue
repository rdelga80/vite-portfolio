<script>
export default {
  name: 'ASidebar'
}
</script>

<script setup>
  import ArticleLoader from './ArticleLoader.vue'
import { getArticles } from '@/assets/helpers.js'

const articles = getArticles(5)
</script>

<template>
  <aside class="sidebar">
    Ricardo Delgado

    <div class="articles">
      <h4 class="articles-title">
        Recent Articles
      </h4>

      <div v-for="(article, index) in articles" :key="index">
        <ArticleLoader :article-slug="article" short />
      </div>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.articles {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.articles-title {
  margin: 0;
}

.sidebar {
  opacity: 1;
}
</style>
