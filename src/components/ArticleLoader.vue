<script>
export default {
  name: 'ArticleLoader'
}
</script>


<script setup>
import { onBeforeMount, shallowRef, watch } from 'vue'
import { truncate } from 'lodash'

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
  
  const textToTruncate = hrIndex > -1
    ? fullText.slice(hrIndex).replace('<hr>', '')
    : fullText

  return truncate(textToTruncate, {
    length: 500,
    separator: ' '
  })
}

watch(() => props.articleSlug, async (newArticleSlug) => {
  await setArticle(newArticleSlug)
})

const setArticle = async (articleSlug) => {
  const articleModule = () => import(`../assets/articles/${articleSlug}.md`)
  return articleModule().then(async ({ attributes, html, VueComponent }) => {
    article.value = VueComponent
    articleAttributes.value = attributes
    articleSummary.value = trimSummary(html)
  })
}

onBeforeMount(async () => {
  await setArticle(props.articleSlug)
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
      <router-link v-if="summary" :to="{ name: 'article', params: { articleSlug } }">
        Read More...
      </router-link>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.article {
  :deep {
    img {
      width: 100%;
    }
    pre {
      white-space: pre-wrap;
    }
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
