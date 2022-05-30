<script>
import { onBeforeMount, shallowRef } from 'vue'
export default {
  name: 'ArticleLoader'
}
</script>

<script setup>
const props = defineProps({
  articleSlug: {
    type: String,
    required: true
  }
})

const article = shallowRef(null)
const articleAttributes = shallowRef(null)

onBeforeMount(() => {
  const articleModule = () => import(`../assets/articles/${props.articleSlug}.md`)
  articleModule().then(({ attributes, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
  })
})
</script>

<template>
  <article class="article">
    {{ articleAttributes }}

    <img :src="articleAttributes.headerImg" />

    <component :is="article" />
  </article>
</template>
