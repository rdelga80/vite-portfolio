export const getSlug = url => url.split('/').at(-1).replace('.md', '')

export const getArticles = sliceLength => {
  const articlesByGlob = import.meta.importGlob('../assets/articles/**.md')

  const articleTitles = Object
    .keys(articlesByGlob)

  return articleTitles
    .reverse()
    .slice(0, sliceLength || articleTitles.length)
    .map(glob => getSlug(glob))
}
