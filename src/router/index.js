// import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import { setMeta, setPageMetaTitle } from '../assets/helpers'

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

// const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
//   routes
// })

// router.afterEach(() => {
//   window.scrollTo(0, 0)
// })

// router.beforeEach(async (to, from, next) => {
//   if (!to.params.articleSlug) {
//     setPageMetaTitle('Ricardo Delgado || Senior Frontend Web Developer')
//     setMeta('description', 'Senior Frontend Web Developer')
//     setMeta('keywords', 'vuejs,reactjs,nextjs,frontend,software,web applications')
//     setMeta('og:description', 'Senior Frontend Web Developer')
//     setMeta('og:title', 'Senior Frontend Web Developer', 'property')
//     setMeta('og:type', 'article', 'property')

//     next()
//   } else {
//     const toArticle = await import(`../assets/articles/${to.params.articleSlug}.md`)
  
//     const title = toArticle.attributes.title
//     const description = toArticle.attributes.description
//     const tags = toArticle.attributes.tags
  
//     setPageMetaTitle(title)
//     setMeta('description', description)
//     setMeta('keywords', tags)
//     setMeta('og:description', description)
//     setMeta('og:title', title, 'property')
//     setMeta('og:type', 'article', 'property')
  
//     next()
//   }

// })

export {
  // router,
  routes
} 
