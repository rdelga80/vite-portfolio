// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createApp } from './app'

async function onRenderHtml(pageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  return escapeInject`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="Senior Frontend Web Developer" />
          <meta name="keywords" content="vuejs,reactjs,nextjs,frontend,software,web applications" />
          <meta name="og:description" content="Senior Frontend Web Developer" />
          <meta property="og:type" content="article" />
          <meta property="og:title" content="Ricardo Delgado || Senior Frontend Web Developer" />
          <meta property="og:image" content="https://ricdelgado.com/article-images/nuxt-content-writing-blog-ssr-static.jpg" />
          <meta property="og:image:type" content="image/jpg" />
          <title>Ricardo Delgado || Frontend Dev</title>
        </head>
        <body>
          <div id="app">${dangerouslySkipEscape(appHtml)}</div>
          <script type="module" src="/src/main.js"></script>
        </body>
      </html>
    `
}
