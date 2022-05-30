<script>
export default defineComponent({
  name: 'PHome'
})
</script>

<script setup>
import { defineComponent } from 'vue'
import ArticleLoader from '@/components/ArticleLoader.vue'

const articles = [
  'anti-clever-component-structure',
  'anti-clever-front-end-programming-methodology',
  'anti-clever-vuex-store-concept',
  'basic-jest-testing-concepts-in-vuejs',
  'nuxt-content-new-site',
  'testing-mentality',
  'vuejs-testing-single-file-components',
  'vuex-plugins-and-complete-components'
]
</script>

<template>
  HOME PAGE

  <router-link to="/articles/testing-mentality">
    Go To mentality
  </router-link>

  <div class="home">
    <div v-for="(articleSlug, index) in articles" :key="index">
      <ArticleLoader :article-slug="articleSlug" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  opacity: 1;
}
</style>
