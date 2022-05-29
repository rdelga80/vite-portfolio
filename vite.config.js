import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import mdPlugin from 'vite-plugin-markdown'
import GlobPlugin from 'vite-plugin-glob'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mdPlugin({ mode: 'vue' }), GlobPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
