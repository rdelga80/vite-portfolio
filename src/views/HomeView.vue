<script>
import { computed, defineComponent, onBeforeMount, ref } from 'vue'

export default defineComponent({
  name: 'PHome'
})
</script>

<script setup>
const articles = ref([])

onBeforeMount(() => {
  const articlesGlobs = import.meta.importGlob('/articles/**.md')

  Object.keys(articlesGlobs).forEach(async articleUrls => {
    const articleModules = () => import(articleUrls)

    const { attributes, VueComponent } = await articleModules()
    
    articles.value = [
      ...articles.value,
      {
        attributes,
        VueComponent
      }
    ]
  })
})

const articlesInOrder = computed(() => {
  return [...articles.value]
    ?.sort((a, b) => new Date(a.attributes.date) > new Date(b.attributes.date))
    ?.reverse()
})
</script>

<template>
  <div class="home">
    <div v-for="(article, index) in articlesInOrder" :key="index">
      <img :src="article.attributes.headerImg" />

      {{ article.attributes.title }}
      {{ article.attributes.description }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  opacity: 1;
}
</style>
