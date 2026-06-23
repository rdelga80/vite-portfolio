---
title: Pure Backend Driven UI
description: Backend Driven UI has been mostly a failed proposition. I’ve seen more than one team attempt to institute it, only for it to work imperfectly and cause more problems than it was worth. But is there a better way to implement Backend Driven UI? Yes, and the answer is doing it more.
tags: frontend development,bff,backend driven ui,ui,design,components,design system
date: April 24, 2026
image: https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/article-25%2Fswiss-army-backend-driven-ui_588x441.webp?alt=media&token=6ad4f068-0e33-4161-b31c-f8a7d8e9ec6f
imageAuthor: Patrick
imageAttribution: https://unsplash.com/@pf91_photography
---

_tl;dr: backend responses should return design components, not data._

There are a couple of white whales I’ve been chasing over my professional career as a frontend engineer. The first is how to keep GraphQL from breaking when the schema is mismatched. The second is to find a way to create a Backend Driven UI system that actually works.

Leaving the first one as my Moby Dick, the second has always felt like one of those theoretical questions that seems completely reasonable until it gets put into practice. Backend Driven UI sounds like it should work. The backend should be able to decide what experience the user receives. Product teams should be able to rearrange and personalize screens without waiting for a full frontend release. Apps should be able to change faster than the deployment cycle of a client. All of that makes sense.

And yet, in practice, Backend Driven UI often becomes a clutter of awfulness before anyone realizes what went wrong. Instead of creating flexibility, it creates a strange new rigidity. Instead of removing frontend complexity, it moves that complexity into a more abstract and less pleasant place. Instead of allowing teams to move faster, it creates a system that requires an enormous amount of discipline just to avoid collapsing under its own cleverness.

I think the reason Backend Driven UI so often fails is that most implementations are not actually driven by UI. They are driven by backend-shaped data.

And that is the core error.

### The Problem With Backend Driven UI

The biggest issue with Backend Driven UI is that it often asks the wrong part of the engineering organization to make the most important decisions about the interface. This is not an insult to backend developers. It's just a recognition that backend developers, by nature of the work, tend to think in tables, joins, services, entities, relationships, and domains. That is exactly what makes them good at backend development.

But UI is not shaped like that. UI is shaped by hierarchy, rhythm, emphasis, density, interaction, composition, constraints, affordance, and reuse. The mental model is different. The concerns are different. The way things should be named is different.

This is where Backend Driven UI tends to go wrong. At first, the response structure might look clean enough. There is a `page`, then maybe `pageChildren`, and for a moment it feels like the backend is describing a flexible screen. But then, very quickly, something like `UserCard` appears. And `UserCard` has `name`, `address`, `avatar`, `email`, `status`, and whatever else the domain says a user should have.

From the backend’s point of view, this is understandable. The backend sees users, orders, addresses, and profiles. It sees the database and the relationships between things. So naturally, when asked to drive the UI, it starts returning the shapes it already knows.

But UI is not data. UI is informed by data, but it should not be shaped like data.

That distinction is the entire thing.

### Data Has No Home Here

For Backend Driven UI to actually work, the backend response cannot gradually drift into the land of domain objects. It cannot start as a generalized page description and then quietly become an API that returns highly specific domain-shaped components.

The backend should not return a `UserCard`. It should return a `Card`. It should not return a `ProductImage`. It should return an `Image`. It should not return a `UserProfileHeader`. It should return layout, text, media, links, actions, slots, and design components.

A **Pure Backend Driven UI** system should speak in the language of the design system, not the language of the database.

This does not mean the backend has no knowledge of the product. Of course it does. The backend still decides what experience should be served. It still knows which user is making the request, what state the product is in, what content needs to be displayed, and what actions are available. But the payload it returns should be expressed as a component tree, not as a domain model that the frontend then has to reinterpret.

Once the response becomes domain-shaped, the frontend starts accumulating domain knowledge again. It starts learning that this kind of entity belongs on this kind of page, under this condition, with this variation, unless some other state is present. At that point, the Backend Driven UI system is no longer really driving the UI. It is just creating a more complicated API with extra steps.

To aim for Pure Backend Driven UI, the response from the endpoint must never casually wander into domain-specific UI contracts. The only possible exception is at the page level, and even there I think a case could be made that the page itself should be treated as another generalized layout component.

The backend can know what it wants to create. But the response should describe that experience through components.

### Over-Engineer Much?

Yes, this might seem like a completely insane proposition. But if the response is supposed to drive the UI, then the response has to actually drive the UI. There cannot be a half-measure where the backend sort of suggests what should happen, and then the frontend interprets that suggestion through a pile of local decisions.

The frontend needs to be able to render the component tree it receives. That does not mean it can render anything in the infinite sense. It can only render components that exist inside the registered design system. But within that registered universe, the pieces should be composable. Components should be able to appear wherever they are valid. They should receive props. They should expose events. They should accept slots. They should be interchangeable where the design system allows them to be interchangeable.

That is when Backend Driven UI becomes interesting. Not when the backend sends `type: "user-card"` and the frontend maps that to a domain-specific component. That is the old mistake wearing a new hat.

Pure BDUI starts when the backend response becomes a component tree.

### Using Vue Over React To Manage Backend Driven UI

For Painters of War, I chose Vue.js. No duh for anyone that knows me.

That was not just because Vue was the first JavaScript framework I learned. It was because Vue has a very powerful tool at its disposal that React does not have in quite the same ergonomic way: `defineAsyncComponent`. This helper function has been one of my quiet obsessions since I discovered it after Vue 3 was released.

I use `defineAsyncComponent` liberally across my apps, especially for versioning components and dynamically importing files without requiring every possible variation to be imported directly into the requesting component. For example, I often use this pattern with `Icon` components. I can create a folder in the same directory as the component, accept the icon name as a prop, and load only the icon that is needed.

The alternative is the kind of thing that slowly makes frontend bundles grotesque. An `Icon` component imports every single icon in the folder, and suddenly the whole thing is bloated for no good reason. The bloat is Harkonnen-like. Baron von Iconnen.

`defineAsyncComponent` is Vue’s secret weapon here because it allows components to be loaded asynchronously without forcing the app to import every possible component up front. That matters a lot for Backend Driven UI. If the backend can send any registered component, the frontend needs a sane way to resolve and load those components without turning the application into a giant eager import machine.

That is fundamentally important to the way I wanted Backend Driven UI to work in Painters of War.

### One Component To Rule Them All

The foundation of Pure Backend Driven UI is that a single renderer needs to be able to render every component the backend is allowed to send. In Painters of War, that component is `BduiRenderer`.

```javascript
import type { BduiNode, BduiRawEvent } from '@painters-of-war/shared'
import { defineComponent, h, type PropType } from 'vue'
import { resolveComponent } from '../../bdui/registry'

export const BduiRenderer = defineComponent({
  name: 'BduiRenderer',
  props: {
    node: {
      type: Object as PropType<BduiNode>,
      required: true
    }
  },
  emits: {
    'component-event': (event: BduiRawEvent) => !!event
  },
  setup(props, { emit }) {
    return () => {
      const component = resolveComponent(props.node.component)

      if (!component) {
        if (import.meta.env.DEV) {
          console.warn(
            `[BduiRenderer] Unknown component: "${props.node.component}"`
          )
        }
        return null
      }

      const listeners: Record<string, (payload: unknown) => void> = {}
      if (props.node.emits) {
        for (const eventName of props.node.emits) {
          const onKey = `on${eventName[0].toUpperCase()}${eventName.slice(1)}`
          listeners[onKey] = (payload: unknown) => {
            emit('component-event', {
              key: props.node.key,
              event: eventName,
              payload
            })
          }
        }
      }

      const slots: Record<
        string,
        () => ReturnType<typeof h> | ReturnType<typeof h>[]
      > = {}
      if (props.node.slots) {
        for (const [slotName, child] of Object.entries(props.node.slots)) {
          if (Array.isArray(child)) {
            slots[slotName] = () =>
              child.map((node, index) =>
                h(BduiRenderer, {
                  key: node.key ?? `${slotName}-${index}`,
                  node,
                  'onComponent-event': (raw: BduiRawEvent) => {
                    emit('component-event', raw)
                  }
                })
              )
          } else {
            slots[slotName] = () =>
              h(BduiRenderer, {
                key: child.key ?? slotName,
                node: child,
                'onComponent-event': (raw: BduiRawEvent) => {
                  emit('component-event', raw)
                }
              })
          }
        }
      }

      return h(
        component,
        { key: props.node.key, ...props.node.props, ...listeners },
        slots
      )
    }
  }
})
```

The component is not especially large, but it is the Swiss Army knife of Painters of War. It receives a node, resolves the component name against a registry, attaches any declared event listeners, recursively renders slots, and returns the component with its props and children.

The real power comes from the registry.

```javascript
const registry = new Map<string, Component>([
  [
    'PImage',
    defineAsyncComponent(() =>
      import('../components/PImage/index').then((m) => m.PImage)
    )
  ],
  [
    'PImageZoomable',
    defineAsyncComponent(() =>
      import('../components/PImageZoomable/index').then((m) => m.PImageZoomable)
    )
  ],
  [
    'PMutedIconTile',
    defineAsyncComponent(() =>
      import('../components/PMutedIconTile/index').then((m) => m.PMutedIconTile)
    )
  ],
  // ... all UI components are registered here
])
```

With this registry in place, every approved design-system component can be rendered anywhere the BDUI renderer is placed. That does not mean chaos. It means the flexibility is constrained by the design system rather than by hardcoded page logic.

The backend does not get to invent random UI. It gets to compose from a known set of components.

That is a very different thing.

### What The Backend Response Looks Like

![BDUI battle page](https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/article-25%2Fbdui-battle_588x441.webp?alt=media&token=522881d0-af73-41b0-8bc7-550320887513)

For example, in the Battle page, the backend can return a response that describes the structure of the interface through components, props, slots, and events.

```javascript
export const battleBduiResponse = {
  root: {
    component: 'BattleContent',
    props: {
      left: {
        callsign: 'M-XXXX'
      },
      right: {
        callsign: 'M-XXXX'
      }
    },
    slots: {
      'card-left': {
        component: 'PImage',
        props: {
          src: 'https://r2.example.com/mini-1.jpg',
          ariaLabel: 'Left painter: paintera'
        },
        key: 'card-left'
      },
      'card-right': {
        component: 'PImage',
        props: {
          src: 'https://r2.example.com/mini-2.jpg',
          ariaLabel: 'Right painter: painterb'
        },
        key: 'card-right'
      },
      'painter-left': {
        component: 'PObfuscateText',
        props: {
          realText: 'paintera',
          href: '/painter/paintera'
        },
        key: 'painter-link-left',
        emits: ['navigate']
      },
      'painter-right': {
        component: 'PObfuscateText',
        props: {
          realText: 'painterb',
          href: '/painter/painterb'
        },
        key: 'painter-link-right',
        emits: ['navigate']
      },
      controls: {
        component: 'BattleControls',
        props: {
          dimensions: [
            {
              dimensionId: 'dim-1',
              dimensionLabel: 'Scrutiny',
              leftLabel: 'Painter A',
              rightLabel: 'Painter B',
              labels: ['Glanced', 'Inspected', 'Dissected']
            },
            {
              dimensionId: 'dim-2',
              dimensionLabel: 'Depth',
              leftLabel: 'Painter A',
              rightLabel: 'Painter B',
              labels: ['Flat', 'Layered', 'Luminous']
            }
          ]
        },
        key: 'battle-controls',
        emits: ['submit', 'change']
      }
    }
  },
  meta: {
    battleId: 'battle-abc-123',
    mini1Id: 'mini-1',
    mini2Id: 'mini-2',
  }
} satisfies BduiResponse
```

The important thing is not that the backend is sending a Battle page. The important thing is that the backend is composing a screen from known components. `BattleContent` provides the layout. `PImage` renders media. `PObfuscateText` handles the painter display. `BattleControls` handles the voting interaction. The renderer does not need to know the product meaning of every piece. It just needs to know how to resolve and render the component tree.

This is where the architecture starts to pay off.

If I want to replace the left and right image displays with carousels, I do not need to add a new conditional branch to the frontend. I can replace `PImage` with `PCarousel` in the response. If I want to support video, the response can use `PVideo`. If I want to show an infographic between rounds, I can compose that into the same slot where an image used to be.

The frontend is not completely unaware. The components still need to exist. The props still need to be valid. The system still needs boundaries. But the page itself becomes far less rigid because the frontend is no longer the only place where composition can happen.

Everything becomes more flexible. Anything that is BDUI-enabled becomes interchangeable within the rules of the design system. That means pages can become more personalized, more contextual, and more responsive to the actual experience the product wants to create.

### Getting The Most Out Of BDUI

The original version of this idea came out of a hackathon where I had created the concept of a customizable feed. The product at the time was more or less a static marketplace, and the idea was to turn it into something closer to a living feed.

Feeds have become the language of the internet. Instagram, Twitter/X, Facebook, TikTok, Reddit, and almost every modern content product have trained users to understand products as streams of changing, personalized, contextual units. But most feeds are still limited in an important way. They mostly repeat one kind of item over and over again. The content changes, but the structure is relatively fixed.

That is fine for many products, but it is also limiting. If the frontend only understands a few domain-specific feed item types, then the feed can only evolve as quickly as those item types evolve. The UI remains tied to product-specific concepts instead of design-system primitives.

Pure BDUI breaks that marriage between domain and design. Once the backend can compose the feed from components instead of domain-specific objects, the feed stops being one thing. For Painters of War it can become a battle, a showcase, an announcement, a ranking shift, a painter spotlight, a tutorial, a voting prompt, a product update, or something else entirely.

This is where Backend Driven UI gets genuinely powerful. It is not just about avoiding frontend releases. It is about making the product itself more expressive.

A traditional frontend tends to encode possibility as code. Pure BDUI moves more of that possibility into data, but not data in the usual backend sense. It becomes design-system-shaped data. It becomes structured intent.

That is the difference.

### The Cost Of Doing It This Way

Of course, there is a cost. Pure Backend Driven UI requires a lot of discipline. It requires naming discipline, component discipline, prop discipline, slot discipline, event discipline, and an almost irritating amount of restraint around domain concepts.

It is very easy for this kind of system to become a mess. In fact, it probably wants to become a mess. The moment someone says, “Let’s just make a specific component for this specific backend entity,” the whole thing starts sliding back toward the same problem BDUI always has.

Even using AI with strict rules, this architecture requires hand holding. AI is very good at generating code, but it is not naturally good at respecting invisible architectural boundaries unless those boundaries are made extremely explicit. It wants to solve the immediate problem. Pure BDUI requires resisting the immediate problem in favor of a system that stays flexible over time.

That is the tradeoff. This approach gives you enormous flexibility, but it demands architectural stamina. It asks you to keep the design system clean. It asks you to avoid easy domain-specific shortcuts. It asks you to build components that are composable instead of convenient.

That is not always easy at scale.

But for Painters of War, it has already been worth it. The product is becoming more flexible with every component that enters the system. The more the interface can be composed from the backend, the more the experience can evolve without turning the frontend into a pile of conditionals.

Pure Backend Driven UI is not about letting the backend own the frontend. That is the wrong framing.

It is about letting the product speak in components.

Once the backend stops returning domain-shaped data and starts returning design-system-shaped intent, the frontend becomes something much more powerful than a collection of pages. It becomes a renderer for possibility.

_If you're a miniature painter visit [Painters of War](https://paintersofwar.com)._
