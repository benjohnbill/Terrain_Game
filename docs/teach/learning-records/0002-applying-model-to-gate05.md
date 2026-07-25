# Applying the four-layer model to a live decision (gate 05)

Date: 2026-07-18
Builds on: [[0001-baseline-stack-literacy]] · Lesson
`lessons/0002-l3-build-topology-applied.html`

## Context

First application of the four-layer model (Lesson 1) to a real, in-flight stack
decision rather than a hypothetical. During a grilling session the learner
sealed six build-topology decisions (D1–D6 in the conversation) for the L3
build, but reported — honestly, mid-grill — that they could not tell **what had
actually been decided**, nor **how any of it connected to the documentation
governance world** (term-inventory.json / audit-lint / write-lint hook / SYNC-DEBT)
they already know. Stack vocabulary (TS, React, Vite, tsc, node:test, Playwright)
was the surface blocker; the deeper one was having no frame that held the build
decisions and the governance machinery in the same picture.

## What was taught

Lesson 2 re-organises the six decisions through two lenses:

1. **The new tools, placed in the four layers.** TypeScript sits at Layer 1 but
   compiles down to JavaScript (never leaves the runtime — not a Godot-style
   rewrite); React fills the empty Layer 2; Vite/tsc/node:test/Playwright fill
   Layer 3; the native shell is Layer 4 background (ADR 0041, deferred).
2. **The six decisions sorted by layer,** with weight. D1/D2/D3/D6 are cheap,
   reversible build plumbing. The only two moves carrying real new weight are
   adding TypeScript at Layer 1 and D5.
3. **A fifth axis the stack model does not draw: governance.** The four-layer
   model answers "how does code get built and shipped"; the governance axis
   answers "do the docs, terms, and code still agree." They are independent, and
   they cross at exactly one point — D5 — and only because ADR 0041 moves the
   canonical code from `js/` to `game/`, so each term's code pointer (and the
   audit-lint scanner) must follow it.

## Non-obvious insight (the unlock)

The learner's felt difficulty — "I can't connect the stack decisions to the
doc-audit/hook world" — was **not a comprehension gap; it was a correct
intuition.** Four of the five decisions genuinely do not connect. Naming the
governance axis as a second, mostly-independent axis, and pointing at D5 as the
single wire between them, is what turned the confusion into a map. Validating the
intuition mattered more than adding facts.

## Zone of proximal development — candidates for next

- Why compiling TypeScript to JavaScript is not a rewrite even though it *feels*
  like new code (the transpile step, in depth). The lesson asserts it; the
  learner has not yet re-derived it.
- What a lockfile is and why two of them cost double (grounds D2, currently taken
  on trust).
- The governance axis as a topic in its own right: how term-inventory, audit-lint,
  and the hook form a system — the learner built it but may not hold it as one
  model.

## Cross-link

[[MISSION.md]] — this lesson is the mission's "make and defend a real stack
decision" objective, exercised for the first time on a live decision.
