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

<style lang="scss" scoped>
%home-vars {
  --home-height: 100vh;
  --overflow-vars: hidden scroll;

  @media (max-width: 600px) {
    --home-height: 100%;
    --overflow-vars: hidden visible;
  }
}

.home {
  @extend %home-vars;

  height: var(--home-height);
  overflow: var(--overflow-vars);
  padding-right: 30px;
}
</style>
