import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import mdPlugin, { Mode } from 'vite-plugin-markdown'
import GlobPlugin from 'vite-plugin-glob'
import hljs from 'highlight.js'

const srcPath = new URL('./src', import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mdPlugin({
    mode: [Mode.VUE, Mode.HTML],
    markdownIt: {
      html: true,
      highlight: (str, lang) => {
        if (!lang) {
          return str
        }

        return hljs.highlight(
          str,
          { language: lang === 'vue' ? 'javascript' : lang }
        ).value
      }
    }
  }), GlobPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(srcPath)
    }
  },
  ssgOptions: {
    includeAllRoutes: true,
    includedRoutes(paths, routes) {
      const getSlug = url => url.split('/').at(-1).replace('.md', '')
      const articlesByGlob = import.meta.importGlob('../assets/articles/**.md')

      const articleTitles = Object
        .keys(articlesByGlob)

      const articles = articleTitles
        .reverse()
        .slice(0, articleTitles.length)
        .map(glob => getSlug(glob))

      return routes.flatMap(async (route) => {
        return route.name === 'article'
          ? articles.map(slug => `/article/${slug}`)
          : route.path
      })
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use '${srcPath}/assets/scss/variables.scss' as *;`
      }
    }
  },
  server: {
    port: 3001
  },
})
