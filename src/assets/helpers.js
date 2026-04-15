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

  let limitedText = textToTruncate.slice(0, 515)

  const lastTagOpen = limitedText.lastIndexOf('<')
  const lastTagClose = limitedText.lastIndexOf('>')
  if (lastTagOpen > lastTagClose) {
    limitedText = limitedText.slice(0, lastTagOpen)
  }

  const lastIndexOfSpace = limitedText.lastIndexOf(' ')
  limitedText = limitedText.slice(0, lastIndexOfSpace)

  // Re-check: the space trim may have cut inside a tag's attribute value
  const lastTagOpen2 = limitedText.lastIndexOf('<')
  const lastTagClose2 = limitedText.lastIndexOf('>')
  if (lastTagOpen2 > lastTagClose2) {
    limitedText = limitedText.slice(0, lastTagOpen2)
  }

  const openTags = []
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi
  let match
  while ((match = tagPattern.exec(limitedText)) !== null) {
    const isClosing = match[0].startsWith('</')
    const tag = match[1].toLowerCase()
    const isSelfClosing = /\/>$/.test(match[0]) || ['br', 'hr', 'img'].includes(tag)
    if (isSelfClosing) continue
    if (isClosing) {
      const idx = openTags.lastIndexOf(tag)
      if (idx !== -1) openTags.splice(idx, 1)
    } else {
      openTags.push(tag)
    }
  }

  const closingTags = openTags.reverse().map(tag => `</${tag}>`).join('')

  return `${limitedText}...${closingTags}`
}
