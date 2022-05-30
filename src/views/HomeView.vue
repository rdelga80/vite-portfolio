<script>
export default defineComponent({
  name: 'PHome'
})
</script>

<script setup>
import { defineComponent } from 'vue'
import ArticleLoader from '@/components/ArticleLoader.vue'

const articlesByGlob = import.meta.importGlob('../assets/articles/**.md')

const articles = Object
  .keys(articlesByGlob)
  .reverse()
  .map(glob => glob.split('/').at(-1).replace('.md', ''))
</script>

<template>
  HOME PAGE

  <router-link to="/articles/testing-mentality">
    Go To mentality
  </router-link>

  <div class="home">
    <div v-for="(articleSlug, index) in articles" :key="index">
      <ArticleLoader :article-slug="articleSlug" summary />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  opacity: 1;
}
</style>
