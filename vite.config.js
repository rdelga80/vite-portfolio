import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import mdPlugin from 'vite-plugin-markdown'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mdPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
