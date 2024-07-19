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
      <ClientOnly>
        <ArticleLoader :article-slug="articleSlug" summary />
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding-right: 30px;
}
</style>
