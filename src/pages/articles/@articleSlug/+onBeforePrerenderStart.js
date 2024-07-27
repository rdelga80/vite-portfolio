export { onBeforePrerenderStart }

async function onBeforePrerenderStart() {
  const articles = import.meta.glob('../../../assets/articles/**.md')

  const articleUrls = Object.keys(articles)
    .map(article => `/articles/${article.split('/').at(-1).replace('.md','')}`)
  return articleUrls
}
