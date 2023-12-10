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

export const setMeta = (metaKey, value, nameOrProperty = 'name') => {
  if (!window) {
    return
  }

  const meta = document.querySelector(`meta[name="${metaKey}"]`)

  if (meta) {
    meta.setAttribute('content', sanitizeHtml(value, {
      allowedTags: []
    }))
  } else {
    const headTag = document.getElementsByTagName('head')[0]

    const metaTag = document.createElement('meta')

    metaTag.setAttribute(nameOrProperty, metaKey)
    metaTag.setAttribute('content', sanitizeHtml(value, {
      allowedTags: []
    }))

    headTag.appendChild(metaTag)
  }
}

export const setPageMetaTitle = (title) => {
  if (!window) {
    return
  }

  document.title = `${title} || Ricardo Delgado Web Dev`
}
