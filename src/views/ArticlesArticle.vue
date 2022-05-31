<script>
export default {
  components: { ArticleLoader },
  name: 'ArticlesArticle'
}
</script>

<script setup>
import { useRouter } from 'vue-router'
import ArticleLoader from '../components/ArticleLoader.vue'

const articleSlug = useRouter().currentRoute.value.params.articleSlug
</script>

<template>
  <section class="article-wrap">
    <ArticleLoader :article-slug="articleSlug" />
  </section>
</template>

<style lang="scss" scoped>
.article-wrap {
  height: 100vh;
  overflow-y: scroll;
  padding-right: 30px;
}
</style>
