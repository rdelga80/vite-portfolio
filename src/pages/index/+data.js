import { getArticles, getArticle, trimSummary } from '@/assets/helpers'

export { data }

async function data() {
  const slugs = getArticles(5)

  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const { attributes, html } = await getArticle(slug)
      return {
        slug,
        attributes,
        summary: trimSummary(html),
      }
    })
  )

  return { articles }
}
