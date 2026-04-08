<script setup>
import { useData } from 'vike-vue/useData'
import ALink from '@/components/ALink.vue'
import { articleSlugToLink } from '@/assets/helpers'

const { articles } = useData()
</script>

<template>
  <article v-for="{ slug, attributes, summary } in articles" :key="slug" class="article">
    <ALink :href="articleSlugToLink(slug)">
      <h2 class="article-title">{{ attributes.title }}</h2>
    </ALink>
    <span class="article-date">{{ attributes.date }}</span>
    <div class="summary">
      <div v-html="summary" />
    </div>
    <div class="more">
      <ALink :href="articleSlugToLink(slug)">Read More...</ALink>
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

.more {
  text-align: right;
}
</style>
