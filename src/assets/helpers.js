import sanitizeHtml from 'sanitize-html'

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

export const setMeta = (metaKey, value) => {
  if (!window) {
    return
  }

  try {
    const meta = document.querySelector(`meta[name="${metaKey}"]`)

    meta.setAttribute('content', sanitizeHtml(value, {
      allowedTags: []
    }))
  } catch (e) {
    console.warn(e)
  }
}

export const setPageMetaTitle = (title) => {
  if (!window) {
    return
  }

  document.title = `${title} || Ricardo Delgado Web Dev`
}
