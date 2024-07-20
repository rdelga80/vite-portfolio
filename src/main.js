import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router'
import './assets/scss/global.scss'

export const createApp = ViteSSG(
  App,
  { routes }
)
