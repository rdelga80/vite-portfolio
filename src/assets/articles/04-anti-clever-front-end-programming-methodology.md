---
title: Anti-Clever - A Programming Methodology to Simplify VueJs Frontend Development
description: VueJS is a powerful tool for Frontend development, but can very easily fall become messy and overcomplicated. Anti-Clever Development hopes to address some of the larger issues in VueJS development to help simplify code.
tags: vuejs,methology,programming,anticlever
date: January 2, 2022
---

Anti-Clever TOC
* Part 1: Introduction (active)
* Part 2: [Flattening Component Structure](/articles/anti-clever-component-structure)
* Part 3: [Vuex Store as a Concept, not a Utility](/articles/anti-clever-vuex-store-concept)

---

## Introduction

"VueJS doesn't scale well."

It's one of those things that's said often about arguably the most powerful frontend framework in modern web development, and anyone who's been part of a large enough Vue project knows exactly what that looks like.

Components grow uncontrollably, code is repeated all over the place, various types of approaches to solving problems are applied across various components, etc.

Not to mention how much that problem is exacerbated by multiple teams working in the same repo, dealing with backend developers who can't decide how to maintain data structures, and the general failings of having to deliver quickly and not perfectly.

Anti-Clever is a combination of concepts rooted in Test Driven Development (TDD), Don't Repeat Yourself (DRY), and my personal experience working in a project that checks all the boxes of complexity.

Anti-Clever emerged naturally while refactoring a very complicated feature that ended up spanning four Vuex store files, and approximately ten component files, all children of a single page file (within the pages folder, not an SPC).

The interconnectedness between all these files made bugfixes painful - everyone knows the the joy of making one change and six more breaks happen. Or, even worse, the backend changes their API data structure, and then you have to spend the next day going from file to file fixing broken keys.

Anti-Clever attempts to provide simplification to VueJS Apps to allow for:
1. Easier testing
2. Faster bug fixes
3. Removing complication from development
4. Providing solid structures for solutions
5. Allowing for simple integration between components and data
6. Clear directives between component file types and others

This is a changing document, so it being published does not necessarily mean that it's the final version. I'll attempt to keep track of any updates or edits, but changes may just be made to the document over time.
