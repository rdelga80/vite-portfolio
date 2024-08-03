import pkg from 'lodash'
const { truncate } = pkg

export const getSlug = url => url.split('/').at(-1).replace('.md', '')

export const getArticles = sliceLength => {
  const articlesByGlob = import.meta.glob('../assets/articles/**.md')

  const articleTitles = Object
    .keys(articlesByGlob)
  
  return articleTitles
    .reverse()
    .slice(0, sliceLength || articleTitles.length)
    .map(glob => getSlug(glob))
}

export const getArticle = async (slug) => {
  const article = await import(`../assets/articles/${slug}.md`)

  return article
}

export const articleSlugToLink = (slug) => `/articles/${slug}/`

export const trimSummary = fullText => {
  const hrIndex = fullText.indexOf('<hr')
  
  const textToTruncate = hrIndex > -1
    ? fullText.slice(hrIndex).replace('<hr>', '')
    : fullText

  return truncate(textToTruncate, {
    length: 500,
    separator: ' '
  })
}
