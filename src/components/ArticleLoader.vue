<script setup>
import { shallowRef, watch } from 'vue'
import ALink from './ALink.vue'
import { articleSlugToLink } from '@/assets/helpers'

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

  let limitedText = textToTruncate.slice(0, 515)

  const lastTagOpen = limitedText.lastIndexOf('<')
  const lastTagClose = limitedText.lastIndexOf('>')
  if (lastTagOpen > lastTagClose) {
    limitedText = limitedText.slice(0, lastTagOpen)
  }

  const lastIndexOfSpace = limitedText.lastIndexOf(' ')
  limitedText = limitedText.slice(0, lastIndexOfSpace)

  const openTags = []
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  let match
  while ((match = tagPattern.exec(limitedText)) !== null) {
    const isClosing = match[0].startsWith('</')
    const tag = match[1].toLowerCase()
    const isSelfClosing = /\/>$/.test(match[0]) || ['br', 'hr', 'img'].includes(tag)
    if (isSelfClosing) continue
    if (isClosing) {
      const idx = openTags.lastIndexOf(tag)
      if (idx !== -1) openTags.splice(idx, 1)
    } else {
      openTags.push(tag)
    }
  }

  const closingTags = openTags.reverse().map(tag => `</${tag}>`).join('')

  return `${limitedText}...${closingTags}`
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

<style scoped>
.article {
  &:deep(img) {
    width: 100%;
  }
  &:deep(pre) {
    white-space: pre-wrap;
  }
}

.article-title {
  margin-bottom: 0;
}

.article-title a {
  text-decoration: none;
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
