import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import mdPlugin from 'vite-plugin-markdown'
import GlobPlugin from 'vite-plugin-glob'

const srcPath = new URL('./src', import.meta.url)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mdPlugin({ mode: ['vue', 'html'] }), GlobPlugin()],
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
  }
})
