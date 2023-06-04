<script>
export default {
  name: 'ArticleLoader'
}
</script>

<script setup>
import { onBeforeMount, shallowRef } from 'vue'
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
      <h2 class="article-title">
        {{ articleAttributes?.title }}
      </h2>
    </router-link>

    <router-link
      v-else-if="short"
      class="short-link"
      :to="{ name: 'article', params: { articleSlug } }">
      {{ articleAttributes?.title }}
    </router-link>

    <h2 class="article-title" v-else>
      {{ articleAttributes?.title }}
    </h2>

    <span class="article-date">
      {{ articleAttributes?.date }}
    </span>

    <div v-if="summary" class="summary">
      <div v-html="articleSummary" />
    </div>

    <component v-else-if="!short" :is="article" />

    <div class="more">
      <router-link v-if="summary" :to="{ name: 'article', params: { articleSlug } }">
        Read More...
      </router-link>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.article {
  :deep pre {
    white-space: pre-wrap;
  }
}

.article-title {
  margin-bottom: 0;
}

.article-date {
  font-size: 0.9rem;
  font-style: italic;
}

.image-header {
  max-width: 100%;
}

.short-link {
  font-size: 12px;
  text-decoration: none;
}

.more {
  text-align: right;
}
</style>
