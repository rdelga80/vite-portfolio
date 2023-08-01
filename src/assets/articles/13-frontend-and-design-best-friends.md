---
title: Frontend Devs and Designers Should Be Best Friends
description: Frontend engineers and designers should be in a constant state of collaboration and communication but is this how things typically work out in a large development team
tags: frontend,design,ux,ui,engineering,software teams,software development,collaboration,professional web dev
date: July 30, 2023
---

This should be a match made in heaven, a pair of qualified professionals working hand in hand to create highly functional applications that are beautiful and a dream to use.

In theory it should be the most natural working relationship on a software development team, but as most frontend engineers could attest it rarely works out that way.

Personally, I believe _that designers and frontend engineers should be best friends_. We should have the fun kind of working relationship where we're regularly sending each other cool Slack messages showing off how one brought the other's work to life or the really cool idea that's coming down the line and how it could work technically.

In a way the position of frontend engineer and UX/UI designer should be told halves of the same job. And it's not rare to meet more than one designer whose previous job was holding down both roles in a small startup, and vice versa for many frontend developers.

To me the biggest differentiator between frontend engineers and backend engineers - a love of creativity and beauty, is the foundation of being a great designer. And even though a frontend engineer can handle writing complex algorithms, there is a passion for creating something beautiful that can live, breath, and wow users and solve complex problems.

And yet from my own personal experience as a company ramps up in size, designers become an impediment to a frontend engineer's ability to deliver code quickly, while frontend engineers become a nagging irritation trying to remove a designers freedom of creativity.

### How exactly does this happen?

Let me just be clear that I'm not sure this is necessarily universal but I've seen and heard it often enough that I do think this is a systemic flaw in the modern Agile-centered Scrum-centric software engineering team.

__Over Specialization__

Each employee becomes a specialized version of their role and I don't mean that in a good way. Engineers become more and more focused on engineering, designers become more and more focused on designing.

In a way, specialization is the magic formula behind modern economies. You're better at raising chickens, I'm better at cutting down corn, so you stick to the chickens and I'll stick to the corn, and neither of us are wasting time on the things we're bad at.

But like most black and white abstracted over-intellectualized theories, most people don't want to just raise chickens all the time and it would be incredibly beneficial for them to know how they grow their corn.

Of course the chicken farmer will still buy corn from a specialist but when they go to buy it make more informed decisions and won't be susceptible to other people's poor work.

This dynamic is no different from the relationship of designers and developers, and in my experience in large companies an engineer couldn't tell you a single thing about what it takes to create the design for an application's UX as much as designers are unaware of what the engineer's role entails.

I can't tell you how many times I've heard a designer say, "I have no idea how you do what you do!" like a badge of honor.

It shouldn't be.

The same holds true for any engineer that thinks their job is to receive designs and then translate it into code without any interpretation, or making sure the designs are following design systems and principles (or whatever design strategy your organization chooses to follow).

This also applies to an engineer knowing accessibility, color management, and general design systems. Just as a designer shouldn't be a developer to understand the role of an engineer, an engineer shouldn't be a designer to understand the role to be able to collaborate in an intelligible way.

__Atomic Design__

This is the design system I prefer and demand from designers. It's a totally coherent system and makes the most sense for design to align with frontend development.

If you don't know this is a pretty good short intro to what I'm digging into: [https://atomicdesign.bradfrost.com/chapter-1/#systematic-ui-design](https://atomicdesign.bradfrost.com/chapter-1/#systematic-ui-design)

And from a programmer's perspective this should be very intuitive (unless you oddly aren't modularizing your components, which is a much bigger problem).

I know Figma is all the rage, but for this article I'll reference Adobe XD because it's free and it's the wire framing software I use on my own personal projects. Also, when it comes to Atomic design both systems are geared to easily handle it.

Check out this article from Adobe XD's documentation: [https://helpx.adobe.com/xd/help/work-with-components-xd.html](https://helpx.adobe.com/xd/help/work-with-components-xd.html)

Adobe XD's component organization is straight forward and easily allows you to build components within designs, allowing a designer to think _as an developer_ and how components (or atoms) interact with each other based on their UI.

![component adobe xd](https://helpx.adobe.com/content/dam/help/en/xd/help/components/xd-component-name.jpg.img.jpg)

Of course, just like with development, if a designer isn't modularizing or Atomizing, then these functionalities are pointless anyway.

__Getting Design and Devs on the Same Page__

In an ideal world the designer's work flow would start with them breaking down a design concept into it's smallest atoms, creating them in their asset library, then building upward from there to create the page or feature.

Each time a new component is created developers would get a new ticket, JIRA or otherwise, and then after the new components are created, then the new feature would be implemented.

But like most of the best laid plans this rarely follows a team's process.

One of the major flaws here is that designers are pressured by _the administration_ (that's Product Managers, Scrum Masters, and any other middle or upper management) of a team to not think of their work in this detailed process but instead make a demand for a new feature or functionality to be designed _in completion_.

Starting off on this foot the incentives aren't for a designer to collaborate with a developer but instead to create something they can present to _the administration_ that can then be passed down to engineers.

I'd argue this disconnect is the number one issue keeping developers and design from being best friends but I digress.

While early on in an application's life designers _might_ hold themselves to creating Atomic UI Libraries things falls apart quickly as an application grows and moves from _creating from zero_ to _molding and refactoring_.

Part of this is due to the fact that _no one_, and I mean _no one_, including Frontend, Design, or Backend (more on this in another post) thinks of an application as the totality of __UI Components__, and instead become silo'ed only considering their own needs first.

As developers and designers focus separately on engineering and design there is zero alignment on what something like this means.

__Aligning Components and Atoms__

![Amazon Frontpage Card Component Varieties](https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/amazon-cards-ui-variation.png?alt=media&token=8b063c06-b946-452f-ba5f-c87f7353f622)

This is an extremely simplistic example of what I'm trying to touch on but I think anyone with some experience in web app development or design has dealt with something similar to this.

In this worst of worlds, which also happens to be the most typical way something like this is implemented, this is 3 different components.

Something like, `CategoryCard`, `ProductCard`, `MultiCategoryCard`.

This is the point where you can see clearly that developers don't understand design and that their architecture is going to be impossible to maintain as the codebase starts to have hundreds, if not thousands, of components.

An app that follows Components in a healthy way will architect this to be a single card, while children that handle the specific instances of variety.

```
<ProductCard>
  <MultiCategory v-if="products.length > 1" />

  <AmazonProduct v-if="products.type === 'product'" />

  <SingleCategory v-if="products.length === 1" />
</ProductCard>
```

Not my best work, but again it makes the point, and unfortunately something you've probably seen before.

And even though this kind of gets the point, it still disconnects the design from the code, and will inevitably grow out of control.

This type of architecture forces a disconnect between a designer and the code, breaking the best friends rule.

As much as we'd love for there to be a common language that we all inherently understand, a designer will never be able to automatically look at a feature and design it in the same way that an engineer would, so these types of data specific concepts will inevitably be confusing for a designer, and I don't blame them.

Think of it from their perspective, when they were in their initial meeting with Product, or whoever, and they received their directions for how to design a feature, do you think they're getting it as, "create a reusable card component that can handle various types of children components for different types of cards"?

Of course not, they're being told to make a row that has a card with multiple product categories, a single product, and a single category. Which then gets designed as three separate cards, which then gets developed as three separate cards.

The cycle continues.

__Finding A Common Language__

Of course it would be nice for _the administration_ to be in on this party, but this is about designers and developers being best friends and that means finding a way to communicate with each other in a way that makes sense to both, even if it means disregarding the input of _the administration_.

That means to _focus on the UI to define components in alignment with Atoms_.

There's no need to let _the administration_ see how the sausage is made but that does mean developers and designers taking more responsibility for what they build, reminding _the administration_ that they're meant to __support__ and not dictate (another post on this in the future too).

It means that a developer won't have to ask a designer to understand the difference between a Category Component with one product versus 4, instead it's asking _how many rows and columns do you need in the card_.

Which means your component architecture turns into:

```
<!-- MyCard.vue -->
<Card>
  <CardRow v-for="row in rows">
    <CardCell v-for="cell in row.cells">
      <slot :name="cell" :cell="cell" />
    </CardCell>
  </CardRow>
</Card>

<!-- Used in component -->
<Card :rows="products">
  <template #cell="{ cell }">
    <Product v-if="cell.type === 'Product'" :product="cell" />

    <Image v-if="cell.type === 'Image'" :image="cell" />
  </template>
</Card>
```

This becomes extremely handy when combined with [Anti-Clever Component Architecture](/articles/05-anti-clever-component-structure) .

Which makes it so that even if a designer has to update, change, or create pieces of design, they're not trying to wade into a developers waters too blindly. It's simply, "if something changes the way it looks then let's create a new atom or refactor an already existing atom."

And since the Atoms are fully fleshed out in the UI Library, there also will be a very small amount of guess work for how it will effect other places in the application. (Even though tools like Browserstack's Percy is amazingly helpful for this as well).

Think of another example, a Card has a 4x4 grid of products not categories. Would a designer necessarily understand engineering enough to know that the difference between these two demands wouldn't necessitate a new variant to the card components? Probably not, which is why even focusing on the UI can be confusing and _requires_ that designers and frontend engineers be best friends to explain to each other what things are how and they work.

In this specific case it would save a designer from creating a new Atom, and it would ensure that the engineer would be able to catch a design that could throw off the link between Atomic design and a frontend component library.

Because that's what Best Friends would do.
