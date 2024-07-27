import { createSSRApp, h } from 'vue'

export { createApp }

function createApp(pageContext) {
  const { Page } = pageContext
  const PageWithLayout = {
    render() {
      return h(Page)
    },
  }
  const app = createSSRApp(PageWithLayout)
  return app
}
