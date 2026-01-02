---
title: Response to Flow-First Coding - Why Your Best Code Happens When You Stop Trying So Hard
description: Responding to Dhruval Makwana's article about entering Flow State and making coding less difficult for better results
tags: developer,programming,flow state,simple coding
date: January 4, 2026
image: https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/article-23%2Fdevelopment-easy-flow-state_588x441.webp?alt=media&token=8d56fd63-c121-4ad0-9cfe-19fd550b71f0
imageAuthor: Pablo Arroyo
imageAttribution: https://unsplash.com/@pablogamedev
---

A friend sent me an article by [Dhruval Makwana titled Flow-First Coding: Why Your Best Code Happens When You Stop Trying So Hard](https://medium.com/@dhruvalmakwana6/vibe-coding-the-quiet-skill-that-separates-good-developers-from-great-ones-3fb92c3125fa) (now deleted), since there's some overlap in my personal coding philosophies.

The piece points in the right direction but it misses the critical point about its core ideas.

When things are wrong in programming it's obvious. They're "muddy" and feel like walking in quicksand. It's normal to step away from one's work to take a walk throughout the day.

I'll spare too much philosophy here but one of the incorrect assumptions about coding is it's STEM-adjacent rather than what it really is: **a form of art**.

Treating coding like pure STEM is the reason why AI struggles with it so much. It can spit out thousands of lines of code but ultimately coding is intertwined with how a person _feels_ and not how many lines can be written.

One of the hardest lessons a Senior developer can pass down to a junior is how to develop a _feel_ of code because it's a matter of _taste_ as much as a matter of _logic_.

This is why reviewing pull requests is almost impossible to teach. How can someone reach inside themselves and transfer the feeling of _code smell_ to another developer? You just have to hope it clicks at some point.

Dhruval recommends five things to enter Flow State as a developer:

1. Kill notifications. Ruthlessly.
2. Decide what “done” means before you start
3. Music without lyrics (or silence)
4. Don’t refactor mid-flow — write a note, move on
5. Stop while you still have energy

These aren’t harmful suggestions, they’re mostly **symptoms** and not causes.

For example, why does someone feel as if killing notifications is a way to help with focus? Because if the code they're working on is "muddy" they'll go looking for distractions.

Any developer knows the feeling of true Flow State. They could have an alarm ringing right next to their ear and it wouldn't distract them from coding. Hours pass by, someone may ask them a question and they'll respond without even noticing.

There is almost nothing that can pull them out of that state when they're in it.

Dhruval, and most developers, treat Flow State as if it's some magical land that a developer can find themselves in if it's 2am fixing a bug (a practice I would strongly recommend against).

Instead Flow State is something that can be created. While the article might propose five preferences for coding circumstances, the real crux is how to set the frame so that a developer can more easily write themselves into Flow State.

### Coding Is Language, Language Is Human

One of my biggest gripes with AI is that it doesn't write code like a human, even when prompted.

It often times feels like reading a jumble of various patterns, solutions, and conventions that lacks the consistency that comes from code written by a single person, or group of people, who fully subscribe to writing a codebase _the same way_.

The essence of making code clear to work with is how easily _it is for other people to understand_. In art there has to be a layer of continuity that allows the viewer to follow the story, scene, etc, without hitting a moment where they need to ask themselves _what's going on here?_

Writing code similarly means that things have to be written in a way that allows a developer to easily track it. The less moments of "why is this here?" the better. What matters is how succinctly the human brain can follow and hold what's happening in the file.

For example, this is exemplified in the difference between props drilling and composition.

```javascript
const PageComponent = () => {
  const { cards } = useGetCards()

  const cardsForDisplay = getCardsForDisplay(cards)

  return cardsForDisplay.map(card => {
    return <Card {...card} />
  })
}

const Card = (card) => {
  const cardHeaderForDisplay = getCardHeaderForDisplay(card.header)
  const {
    showStandardHeader,
    showCardBodyStandard,
    showCardBodyNonStandard
  } = getCardHeaderProperties(card)

  if (showStandardHeader) {
    return (
    <div>
      <CardHeaderStandard {...cardHeaderForDisplay} />
      {showCardBodyStandard
        ? <CardBody {...card.body} />
        : <CardBodyNonStandard {...card.body} />
      }
    </div>
    )
  }

  return (<div>
    <CardHeader {...cardHeaderForDisplay} />
    {showCardBodyStandard
      ? <CardBody {...card.body} />
      : <CardBodyNonStandard {...card.body} />
    }
  </div>)
}

const CardTitle = (header) => {
  return (<div>{header.title}</div>) 
}
```

The title logic is handled in the parent page component but passed to a child, interpreted, passed the card header, and then the finally displayed card title. That's 4 levels of separation between logic and displayed code.

This can quickly get out of hand after introducing different wrinkles like page sections, tabs, drawer components, modals, etc, etc.

The human brain, unless you're a genius 10/10 developer, is not meant to be stretched across this much separation.

Compare that to _code that's written for human consumption_:

```javascript
const PageComponent = () => {
  const { cards } = useGetCards()

  const cardsForDisplay = getCardsForDisplay(cards)

  return cardsForDisplay.map(card => {
    return (
      <Card>
        <Card.Header {...card.header}>
          <Card.Title>{getCardTitle(card)}</Card.Title>
          <Card.Body {...card.body} />
        </Card.Header>
      </Card>
    )
  })
}
```

This brings us back to composition and flattening component structures that I've written about previously in [Anti-Clever - Pt. 2 Flattening Component Structures](http://localhost:3001/articles/05-anti-clever-component-structure/).

All that matters is to keep things readable and simple to follow. The faster and more easily a developer can understand what they're looking at, the better the conditions are to enter Flow State.

### Emergent Development

Another core principle behind writing code in a way that is simple, fast, and understandable is to follow the principles of Emergence.

Emergence describes how complex systems develop properties that don’t exist in their individual parts — properties that appear only when those parts interact.

> The constructionist hypothesis breaks down when confronted with the twin difficulties of scale and complexity. At each level of complexity entirely new properties appear. Psychology is not applied biology, nor is biology applied chemistry. We can now see that the whole becomes not merely more, but very different from the sum of its parts. **- Philip W. Anderson**

In development terms this means that code needs to be broken down to its smallest pieces, and then when assembled need to be treated as their own emergent, and separate, layer away from the previous layer.

This is one of the hardest lessons for a developer to learn because it requires _restraint_. Too many programmers attempt to "eat" their entire solution in one big bite. This is something we've all seen and ends up in massive PRs like this:

![Huge PR](https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/article-23%2Fpr-feature-huge-pr_588x441.webp?alt=media&token=a54445da-b7c7-40e4-813c-52ed2df2f978)

For years I've pushed the idea of 🧠 > 🤚 (brains over fingers). Prioritizing quality code over lines written is fundamentally important to creating Flow State.

More lines equals more confusion. More confusion equals more mud. More mud means less Flow State.

Thinking out the work _before_ typing is what leads to small, concise, and digestible code. And that is exactly what allows for Flow State to emerge naturally.

### Break Everything Down

__*More PRs. More PRs. More PRs.*__

I cannot emphasize this enough. If you want to be a better programmer then break your work down.

Coding is about making code easier for the human mind to consume and that means **MORE PRs**.

Determining where to break down work is an art to itself but in my current work flow this is where I tend to draw my lines:

1. *Schema* - if using GraphQL, but can also be however one generates their data contract.
2. *Smallest components first* - ex. a badge that displays text
3. *Standalone assembled components* - not integrated into any page components
4. *Top level hooks/logic* (optional) - If a lot of data mutation needs to be done then it should be handled here
5. *Assemble Sections* - If there are sections to your top level page do the subsections first while using Feature Flags
6. *Assemble Page* - Assemble sections, queries, hooks into pages

_Data_ => _Atoms_ => _Molecules_ => _Organisms_ => _Pages_

Smaller PRs are easier for you to understand and it makes it infinitely easier for your code reviewers to understand. Faster reviews means faster merges which means more velocity.

### The Prescription

This requires planning and this is where tech workers bite off their noses despite their faces, creating chaos on themselves and their coworkers. One of the hardest things to do is maintaining this mindset in the midst of a PM pushing you to finish a feature on a short deadline.

But putting in the time upfront has _exponential benefits_ over the long term for developing.

It feels weird to think "if I slow things down then I'll be faster" but in this job it is an axiomatic truth.

A developer who plans out their work by breaking it down to smallest pieces then uses those to assemble the next layer will experience a dramatic increase of development speed. This makes coding feel _easy_ instead of "muddy".

_This is how Flow State is created_.
