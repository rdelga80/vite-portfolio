<script setup>
import { getArticle } from '@/assets/helpers'
import { useData } from 'vike-vue/useData'
import { shallowRef } from 'vue'

const { articleSlug, attributes } = useData()

const article = shallowRef()

getArticle(articleSlug)
  .then((data) => {
    article.value = data.VueComponent
  })
</script>

<template>
  <h2>{{ attributes.title }}</h2>

  <section class="article-wrap">
    <component :is="article" />
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
