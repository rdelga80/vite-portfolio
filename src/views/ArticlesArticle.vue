<script>
export default {
  name: 'ArticlesArticle'
}
</script>

<script setup>
import { onBeforeMount, shallowRef } from 'vue'
import { useRouter } from 'vue-router'

let article = shallowRef(null)
let articleAttributes = shallowRef(null)

onBeforeMount(() => {
  const articleSlug = useRouter().currentRoute.value.params.articleSlug
  const articleModule = () => import(`../assets/articles/${articleSlug}.md`)
  articleModule().then(({ attributes, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
  })
})
</script>

<template>
  {{ articleAttributes }}

  <section class="article">
    <component :is="article" />
  </section>
</template>

<style lang="scss" scoped>
.article {
  opacity: 1;
}
</style>
