<script>
export default {
  name: 'ASidebar'
}
</script>

<script setup>
import ArticleLoader from './ArticleLoader.vue'
import { getArticles } from '@/assets/helpers.js'

const articles = getArticles(5)
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-title">
      <router-link to="/">
        <h1>
          Ricardo Delgado
        </h1>
  
        <div class="sub-title">
            Senior Frontend Web Developer
          </div>
      </router-link>
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

      <div v-for="(article, index) in articles" :key="index">
        <ArticleLoader :article-slug="article" short />
      </div>
    </div>

    <RouterLink to="/articles">
      <h4>All Articles →</h4>
    </RouterLink>
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
