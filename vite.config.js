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
          { language: lang }
        ).value
      }
    }
  }), GlobPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(srcPath)
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
