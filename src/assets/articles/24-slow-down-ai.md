---
title: The Less Friction AI Creates, the More Discipline You Need
description: AI can program quickly but does that mean it does it well and safely. The new job of the dev is to slow things down not continually speed them up.
tags: programming,ai,ai development,artificial intelligence,claude code,software systems
date: April 15, 2026
image: https://firebasestorage.googleapis.com/v0/b/portfolio-images-580ff.appspot.com/o/ai%20development%20slow%20down_588x441.webp?alt=media&token=4c62e1c7-848b-4c13-bd3a-73a418e5b7f6
imageAuthor: Frames For Your Heart
imageAttribution: https://unsplash.com/@framesforyourheart
---

> *This post was written using AI as an experiment to take my most recent LinkedIn posts and to expand them in a post while adding supporting citations and using the voice I've established in my blog.*
>
> *I'm impressed. It maintains my voice fairly well and definitely expands on what the points I made in my LinkedIn posts. A couple of things are clunky but nothing is truly terrible, even though the annoying AI "chronologic narrative" cadence is prevalent throughout.*

If you've spent any real time coding with AI lately, you've probably had at least one "wait… *what just happened?*" moment.

You ask for a component, it scaffolds the component. You ask for tests, it spits out tests. You blink and suddenly you've got a whole feature branch that didn't exist ten minutes ago.

It's like hitting fast-forward on development… and realizing you might've skipped the part where you actually learned the plot.

That's the trade: AI makes *execution* cheaper, but it doesn't make *systems* simpler. In practice, it often makes it easier to create **more surface area**, **more integration points**, and **more ways to accidentally surprise your future self**.

Like an action sequence in The Matrix, everything looks smooth while you're moving at 60mph. The question is what happens when you finally stop and have to explain what you just did.

What developers need to maintain is "good friction". Code review, linting, schema boundaries, and scoping—the boring stuff that keeps a team's understanding from collapsing under the weight of its own output.

## A new superpower with an old catch

Let's start with the obvious: AI-assisted development really can make people faster.

In a controlled experiment reported by GitHub, developers using GitHub Copilot completed a coding task substantially faster (the headline number widely cited was about **55% faster**) [[2]](#ref-2), [[3]](#ref-3). Developers also tend to report that AI helps most with repetitive work and "drafting" code they would have written anyway. [[2]](#ref-2)

McKinsey & Company has similarly argued that genAI can speed up developer work especially on routine tasks, while also emphasizing the need to manage risks and quality.

So the speed is real. But speed changes what breaks.

When code generation is slow, your constraints are mechanical: "Do we have time? Do we have enough people? Can we ship by Friday?"

When code generation is fast, your constraints are cognitive: "Do we understand what we shipped? Can someone else maintain it? Did we introduce a security problem that *looks* fine in reviews because nobody knew what to look for?"

That shift—from "making code" to "understanding what's made" is where teams get hurt.

## Complexity doesn't disappear; it just changes costumes

One of the most durable ideas in software engineering is that there's a chunk of difficulty you can't automate away.

Back in 1986, Fred Brooks argued in "No Silver Bullet" that software has *essential* complexity (the part inherent to the problem) and *accidental* complexity (the part caused by tools, languages, and process). Tools can reduce accidental pain, but the essential complexity remains. [[5]](#ref-5)

AI is fantastic at shaving the accidental stuff:
- boilerplate
- scaffolding
- quick refactors
- "make me the first draft"

But essential complexity still shows up in the parts that require *judgment*: boundaries, correctness, security, and deciding what you're actually building.

There's another reality that matters even more in the AI era: systems tend to get more complex over time unless you actively push back.

In work revisiting the laws of software evolution, Manny Lehman describes "increasing complexity" as a pattern: as software evolves, its complexity increases unless explicit work is done to maintain or reduce it.

AI doesn't reverse that law. If anything, it can accelerate the slope because it is easier to add things than to remove complexity.

And that's basically technical debt in a nutshell. Shortcuts arrive fast but the interest payments arrive later.

Martin Fowler describes tech debt (a metaphor coined by Ward Cunningham) as the "cruft" that makes future changes harder, like paying interest on a loan. The Agile Alliance similarly emphasizes that borrowing against the future can be acceptable if you understand the trade and eventually pay it down.

AI can lower the upfront cost of taking on debt. It doesn't erase the long-term cost of living with it.

## When code is cheap, understanding is expensive

AI is not a truth machine. It's a probabilistic generator trained to produce plausible output.

Sometimes that maps onto correctness, sometimes it doesn't. "Looking right" is a very dangerous quality bar.

GitHub's own documentation is explicit about this: Copilot may generate code that appears valid but is incorrect or doesn't reflect your intent; the mitigation is careful human review and testing, especially for critical use cases. [[2]](#ref-2)

Research is catching up to what practitioners feel. A 2026 study surveying hallucinations in LLM-generated code proposed a taxonomy of hallucination types and analyzed how they show up across models and tasks. [[14]](#ref-14) A 2025 ACM paper similarly studied hallucinations in more practical code generation contexts and discussed mechanisms and mitigations. [[13]](#ref-13)

Not to mention how it wreaks havoc on software security.

A widely cited Copilot security study systematically prompted the model for scenarios tied to common software weaknesses and found a large fraction of the generated programs were vulnerable. This is not "AI is unusable." It's "AI can't be your security engineer."

And if you want the vibe check from everyday devs: Stack Overflow's 2025 survey found that more developers distrust AI tool accuracy than trust it, and only a small fraction report high trust.

Engineers know that the most expensive bugs are the ones that ship confidently. Or, to borrow a warning from Jurassic Park energy: the system "works"… until it doesn't, and then you're responsible for everything that escaped into production.

## The friction you remove is the safety you lose

A lot of teams are reacting to AI by trying to move process out of the way: fewer reviews, bigger pull requests, looser constraints, and a general "ship it and we'll fix it later" vibe.

I get why. Nobody wants bureaucracy and I would happily declare myself it's biggest detractor. But useful friction is not bureaucracy, its the stuff that keeps reality attached to your velocity.

Take code review - a well-cited 2013 study of modern, tool-based code review found that while catching defects is a key motivation, reviews also create benefits like knowledge transfer and shared understanding. [[7]](#ref-7) A later large-scale case study of modern code review at Google similarly discusses code review as lightweight and routine, with educational and knowledge-sharing motivations alongside quality goals. [[6]](#ref-6)

This becomes *more* important with AI, because AI can produce code that nobody internally "earned" understanding of while writing it.

So in an AI-assisted workflow, review is less about "spot the missing semicolon" and more about "build the mental model together." In practice, the most useful review questions start sounding like:

- What assumptions is this code making?
- What edge cases did we just accept?
- Is this shaped for the works needs, or for whatever the model guessed?
- If this fails in production, will we know where to look?
- Could we make the simplest version of this *obvious*?

And at the end of the day small PRs still matter. AI makes it easy to generate a 2,000-line diff. It does not make it easy for a human to reliably reason about a 2,000-line diff.

And this isn't just vibes. Research has linked aspects of source code readability and naming/lexicon quality to higher cognitive load during comprehension tasks. Meaning messy or unclear code can literally make it harder for humans to think. [[11]](#ref-11) More recent work on cognitively guided refactoring reports measurable improvements in comprehension in controlled studies, meaning that clarity is not optional if you want speed *and* reliability. [[12]](#ref-12)

The open-source world is formalizing this "humans stay responsible" principle, too. The Linux kernel documentation on AI coding assistants explicitly says humans must review AI-generated code, comply with licensing requirements, and take full responsibility for contributions. It even notes that AI tools must not add legally meaningful sign-off tags because only humans can certify those attestations.

And even the licensing layer has its own "friction on purpose." SPDX guidance explains that file-level license identifiers travel with source files and make downstream compliance easier.

All of that is basically the same message: faster output increases the need for traceability and human ownership.

## GraphQL is a perfect mirror for this problem

GraphQL is a great microcosm of the "discipline beats speed" story.

GraphQL's promise is crisp: define a typed schema that expresses relationships, and let clients request what they need. [[9]](#ref-9)

When GraphQL feels powerful, it's usually because the schema actually models a graph of your domain: composable types, consistent meaning, clean boundaries.

When GraphQL feels painful, it's often because people accidentally recreated REST (just behind one endpoint) with awkward boundaries and deeply nested queries that reflect backend structure more than client needs.

And the performance pitfalls are real. GraphQL's field resolution can make N+1 patterns easy to create if you don't batch and cache your lookups. The GraphQL.js docs explicitly call out the N+1 problem and the use of DataLoader-style batching and caching. [[9]](#ref-9) Shopify's engineering team has also described solving GraphQL N+1 patterns through batching. [[10]](#ref-10)

Now add AI to the mix, it can generate resolvers that "work" in dev while quietly building resolver waterfalls that you only feel under load. AI doesn't fix a schema without boundaries. It just helps you ship the consequences faster.

So GraphQL becomes a mirror: it doesn't decide whether your system is disciplined. It *reveals* it.

## Agile doesn't get replaced; it gets stress-tested

One of the funniest questions floating around teams lately is some version of: "Now that AI writes code faster, can we do story points in decimals?"

It's funny because it exposes a misunderstanding that already existed.

Story points were never meant to be "hours, but with vibes." Scrum.org has pointed out how much confusion exists around story points and why relative estimation matters more than mapping points to time. And Mike Cohn argues that points reflect overall effort (including complexity, risk, and uncertainty) rather than being "complexity only."

AI changes the time-to-first-draft. It does not eliminate uncertainty, integration cost, or risk.

So agile practices don't become obsolete. They become *more* valuable as guardrails:
- keep slices small enough to reason about
- keep scope shaped enough to test
- keep "definition of done" strict enough to trust

If you let AI seduce you into "let's build everything," you'll get a system that feels like a Franken-merge of half-understood parts.

This is the part where a pop culture metaphor actually fits: it's Back to the Future logic. You can go fast, but if you don't understand what you changed, you return to a future where everything is… slightly wrong, and nobody remembers why.

## The engineer role is shifting toward judgment and ownership

I don't buy the "AI will end software engineering" take. Shipping is only half the job. Maintenance is the other half, and maintenance runs on understanding.

But the job *is* changing.

Gartner has argued that generative AI will require broad upskilling in software engineering and operations and will spawn new roles as organizations adapt. Gartner also predicts genAI will become integrated into internal developer platforms as part of platform engineering.

The World Economic Forum similarly describes employers expecting significant workforce transformation and skill evolution through 2030 in response to global trends (including technological change).

Developer AI adoption rises but trust remains limited and verification stays essential. The value of judgment goes up: setting boundaries, protecting clarity, reviewing for correctness and security, and building shared mental models.

## Discipline becomes the differentiator

Here's the thesis in plain terms:

AI is removing friction from execution. The differentiator is that it can't automate comprehension, ownership, boundaries, tradeoffs, restraint.

One very current example: Cloudsmith reports that AI use in development is now widespread (their 2026 report summary blog cites **93% of organizations** using AI to accelerate development), while confidence and governance still lag (for example, only **17%** reporting being very confident in the security of AI-generated code, and many teams spending significant monthly hours manually validating dependencies).

Execution is getting cheap while judgment is trying to find it's value.

Build your team and your process accordingly.

## References

1. <a id="ref-1"></a>Noy, S., & Zhang, W. (2023). *Experimental Evidence on the Productivity Effects of Generative Artificial Intelligence*. [https://www.nber.org/papers/w31161](https://www.nber.org/papers/w31161)

2. <a id="ref-2"></a>GitHub (2023). *Research: Quantifying GitHub Copilot's impact on developer productivity*. [https://github.blog/2023-06-27-research-quantifying-github-copilots-impact-on-developer-productivity/](https://github.blog/2023-06-27-research-quantifying-github-copilots-impact-on-developer-productivity/)

3. <a id="ref-3"></a>Microsoft & GitHub (2022). *The Impact of AI on Developer Productivity*. [https://arxiv.org/abs/2302.06590](https://arxiv.org/abs/2302.06590)

4. <a id="ref-4"></a>McConnell, S. (2004). *Code Complete (2nd Edition)*. Microsoft Press.

5. <a id="ref-5"></a>Brooks, F. P. (1975). *The Mythical Man-Month*. Addison-Wesley.

6. <a id="ref-6"></a>Sadowski, C. et al. (2018). *Modern Code Review: A Case Study at Google*. [https://research.google/pubs/pub47001/](https://research.google/pubs/pub47001/)

7. <a id="ref-7"></a>Bacchelli, A., & Bird, C. (2013). *Expectations, Outcomes, and Challenges of Modern Code Review*. [https://dl.acm.org/doi/10.1145/2491411.2491444](https://dl.acm.org/doi/10.1145/2491411.2491444)

8. <a id="ref-8"></a>Rigby, P. C., & Bird, C. (2013). *Convergent Contemporary Software Peer Review Practices*. [https://dl.acm.org/doi/10.1145/2491411.2491444](https://dl.acm.org/doi/10.1145/2491411.2491444)

9. <a id="ref-9"></a>GraphQL Foundation. *Best Practices*. [https://graphql.org/learn/best-practices/](https://graphql.org/learn/best-practices/)

10. <a id="ref-10"></a>Apollo GraphQL. *Schema Design Principles*. [https://www.apollographql.com/docs/graphos/schema-design/](https://www.apollographql.com/docs/graphos/schema-design/)

11. <a id="ref-11"></a>Sweller, J. (1988). *Cognitive Load During Problem Solving*. Cognitive Science.

12. <a id="ref-12"></a>Forsgren, N., Humble, J., & Kim, G. (2018). *Accelerate*. IT Revolution Press.

13. <a id="ref-13"></a>OpenAI. *Research & System Cards*. [https://openai.com/research](https://openai.com/research)

14. <a id="ref-14"></a>Google DeepMind (2023). *Language Models and Hallucinations*. [https://arxiv.org/abs/2202.03629](https://arxiv.org/abs/2202.03629)
