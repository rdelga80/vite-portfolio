<script>
import { onBeforeMount, shallowRef } from 'vue'
export default {
  name: 'ArticleLoader'
}
</script>

<script setup>
import { truncate } from 'lodash'

const props = defineProps({
  articleSlug: {
    type: String,
    required: true
  },
  summary: Boolean
})

const article = shallowRef(null)
const articleAttributes = shallowRef(null)
const articleSummary = shallowRef(null)

const trimSummary = fullText => {
  const hrIndex = fullText.indexOf('<hr')
  
  const textToTruncate = hrIndex > -1
    ? fullText.slice(hrIndex).replace('<hr>', '')
    : fullText

  return truncate(textToTruncate, {
    length: 500,
    separator: ' '
  })
}

onBeforeMount(() => {
  const articleModule = () => import(`../assets/articles/${props.articleSlug}.md`)
  articleModule().then(({ attributes, html, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
    articleSummary.value = trimSummary(html)
  })
})
</script>

<template>
  <article class="article">
    {{ articleAttributes }}

    <img :src="articleAttributes?.headerImg" />

    <div v-if="summary" class="summary">
      <div v-html="articleSummary" />
    </div>

    <component v-else :is="article" />
  </article>
</template>
