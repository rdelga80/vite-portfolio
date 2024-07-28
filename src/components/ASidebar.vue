<script setup>
import { ref } from 'vue'
import ALink from './ALink.vue'
import { articleSlugToLink, getArticle, getArticles } from '@/assets/helpers.js'

const articles = getArticles(5)

const articleLinks = ref([])

const fetchArticles = () => {
  articles.forEach(async (articleSlug) => {
    const { attributes } = await getArticle(articleSlug)
    const { title } = attributes

    articleLinks.value = [
      ...articleLinks.value,
      {
        link: articleSlugToLink(articleSlug),
        title
      }
    ]
  })
}

fetchArticles()
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-title">
      <ALink href="/">
        <h1>
          Ricardo Delgado
        </h1>
  
        <div class="sub-title">
            Senior Frontend Web Developer
          </div>
      </ALink>
    </div>

    <h6>
      email: ric [at] ricdelgado.com
    </h6>

    <div class="methods">
      <p>
        Test Driven Development (TDD) ⏆ Component Driven Design (CDD) ⏆ Domain Driven Design (DDD)
      </p>

      
    </div>

    <div class="details">
      <p>
        Freelance Projects, Tutoring, Technical Articles, Testing Consultation
      </p>
    </div>

    <div class="articles">
      <h4 class="articles-title">
        Recent Articles
      </h4>

      <ALink class="small" v-for="article in articleLinks" :href="article.link" :key="article.link">
        {{ article.title }}
      </ALink>
    </div>

    <ALink href="/articles">
      <h4>All Articles →</h4>
    </ALink>
  </aside>
</template>

<style lang="scss" scoped>
%sidebar-vars {
  --articles-display: flex;
  --details-display: unset;
  
  @media (max-width: $mobile-breakpoint) {
    --articles-display: none;
    --details-display: none;
  }
}

.sidebar {
  @extend %sidebar-vars;

  opacity: 1;
  height: 100%;
  overflow: hidden scroll;
  padding: 1rem;
}

.sidebar-title h1 {
  @at-root a {
    text-decoration: none;
  }
}

.methods {
  font-size: 10px;
  margin-bottom: 28px;
}

.details {
  display: var(--details-display);
  font-size: 12px;
  margin-bottom: 28px;
}

.articles {
  display: var(--articles-display);
  flex-direction: column;
  row-gap: 20px;
}

.articles-title {
  margin: 0;
}

.small {
  font-size: 14px;
}
</style>
