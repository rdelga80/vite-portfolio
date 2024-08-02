import { trimSummary } from '@/assets/helpers'

export { data }

async function data(pageContext) {
  const articleSlug = pageContext.routeParams.articleSlug

  const articleModule = await import(`../../../assets/articles/${articleSlug}.md`)

  const { attributes, html } = articleModule
  const summary = trimSummary(html)

  return {
    articleSlug,
    attributes,
    summary
  }
}

