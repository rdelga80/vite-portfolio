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
    <router-link to="/">
      <h1>
        Ricardo Delgado <br />
        <small class="small">
          Senior VueJs Developer
        </small>
      </h1>
    </router-link>

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
  </aside>
</template>

<style lang="scss" scoped>
.methods {
  font-size: 10px;
  margin-bottom: 28px;
}

.details {
  font-size: 12px;
  margin-bottom: 28px;
}

.articles {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}

.articles-title {
  margin: 0;
}

.sidebar {
  opacity: 1;
}

.small {
  font-size: 14px;
}
</style>
