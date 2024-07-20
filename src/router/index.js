import HomeView from '../views/HomeView.vue'

const routes = [
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
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

export {
  routes
} 
