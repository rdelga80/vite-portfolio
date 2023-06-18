<script>
export default {
  components: { ArticleLoader },
  name: 'ArticlesArticle'
}
</script>

<script setup>
import { useRoute } from 'vue-router'
import ArticleLoader from '../components/ArticleLoader.vue'
import { ref, watch } from 'vue'


const route = useRoute()
const articleSlug = ref(route.params.articleSlug)

watch(route, newRoute => {
  articleSlug.value = newRoute.params.articleSlug
})
</script>

<template>
  <section class="article-wrap">
    <ArticleLoader :article-slug="articleSlug" is-page />
  </section>
</template>

<style lang="scss" scoped>
%article-wrap {
  --padding-right: 30px;

  @media (max-width: 600px) {
    --padding-right: 0;
  }
}

.article-wrap {
  @extend %article-wrap;

  padding-right: var(--padding-right);
}
</style>
