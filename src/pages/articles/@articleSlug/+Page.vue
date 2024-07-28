<script setup>
import { getArticle } from '@/assets/helpers'
import { useData } from 'vike-vue/useData'
import { computed, shallowRef, watch, ref } from 'vue'
import { usePageContext } from 'vike-vue/usePageContext'

const { articleSlug } = useData()

const pageContext = usePageContext()
const articleParams = computed(() => pageContext.routeParams.articleSlug)

watch(articleParams, param => {
  setArticle(param)
})

const attributes = ref('')
const setArticle = (slugToGet) => {
  getArticle(slugToGet)
    .then((data) => {
      article.value = data.VueComponent
      attributes.value = data.attributes
    })
}

const article = shallowRef()
setArticle(articleSlug)
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
