import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/articles',
      name: 'articles-home',
      component: () => import('@/views/ArticlesHome.vue')
    },
    {
      path: '/articles/:articleSlug',
      name: 'article',
      component: () => import('@/views/ArticlesArticle.vue')
    }
  ]
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
