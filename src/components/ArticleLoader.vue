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
  short: Boolean,
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
    <router-link v-if="summary" :to="{ name: 'article', params: { articleSlug } }">
      <h2>
        {{ articleAttributes?.title }}
      </h2>
    </router-link>

    <router-link
      v-else-if="short"
      class="short-link"
      :to="{ name: 'article', params: { articleSlug } }">
      {{ articleAttributes?.title }}
    </router-link>

    <h2 v-else>
      {{ articleAttributes?.title }}
    </h2>

    <img v-if="!short" class="image-header" :src="articleAttributes?.headerImg" />

    <div v-if="summary" class="summary">
      <div v-html="articleSummary" />
    </div>

    <component v-else-if="!short" :is="article" />

    <router-link v-if="summary" :to="{ name: 'article', params: { articleSlug } }">
      See More...
    </router-link>
  </article>
</template>

<style lang="scss" scoped>
.image-header {
  max-width: 100%;
}

.short-link {
  font-size: 12px;
  text-decoration: none;
}
</style>
