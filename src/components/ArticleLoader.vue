<script setup>
import { shallowRef, watch } from 'vue'
import pkg from 'lodash'
import ALink from './ALink.vue'
import { articleSlugToLink } from '@/assets/helpers'
const { truncate } = pkg

const props = defineProps({
  articleSlug: {
    type: String,
    required: true
  },
  short: Boolean,
  summary: Boolean,
  isPage: Boolean,
})

const article = shallowRef(null)
const articleAttributes = shallowRef(null)
const articleSummary = shallowRef(null)

const trimSummary = fullText => {
  const hrIndex = fullText.indexOf('<hr')
  
  const textToTruncate = hrIndex > -1 && hrIndex < 8000
    ? fullText.slice(hrIndex).replace('<hr>', '')
    : fullText

  return truncate(textToTruncate, {
    length: 500,
    separator: ' '
  })
}

const setArticle = async (articleSlug) => {
  const articleModule = () => import(`@/assets/articles/${articleSlug}.md`)
  return articleModule().then(async ({ attributes, html, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
    articleSummary.value = trimSummary(html)
  })
}

setArticle(props.articleSlug)

watch(() => props.articleSlug, newSlug => setArticle(newSlug))
</script>

<template>
  <article class="article">
    <ALink :href="articleSlugToLink(articleSlug)">
      <h2 class="article-title">
        {{ articleAttributes?.title }}
      </h2>
    </ALink>

    <span v-if="!short" class="article-date">
      {{ articleAttributes?.date }}
    </span>

    <div v-if="summary" class="summary">
      <div v-html="articleSummary" />
    </div>

    <component v-else-if="!short" :is="article" />

    <div v-if="!short && summary" class="tags">
      {{  articleAttributes?.tags }}
    </div>

    <div class="more">
      <ALink v-if="summary" :href="articleSlugToLink(articleSlug)">
        Read More...
      </ALink>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.article {
  :deep(img) {
    width: 100%;
  }
  :deep(pre) {
    white-space: pre-wrap;
  } 
}

.article-title {
  margin-bottom: 0;

  @at-root a {
    text-decoration: none;
  }
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

.tags {
  font-size: 12px;
}

.more {
  text-align: right;
}
</style>
