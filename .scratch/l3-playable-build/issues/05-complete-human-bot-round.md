# 05 — Complete a Human–Bot Round

**What to build:** Continue from the human war operation through every bot actor
required to reach the next human decision. Each bot reads only its own viewer
projection, uses the shared preview rules, and submits intent through the same
Runtime seam while the UI explains the resulting events at a readable pace.

**Blocked by:** 04 — Resolve the First Sealed Atomic War Operation.

Status: needs-info

Specification gates: Wayfinder 08, 10, and 12.

- [ ] Every bot receives only the information allowed to its viewer and cannot inspect match truth.
- [ ] Human and bot intents cross the same Runtime seam and are validated under the same actor-order rules.
- [ ] Out-of-turn bot or human intents are rejected without a state transition.
- [ ] The Runtime resolves immediately and never sleeps for presentation pacing.
- [ ] React presents bot events and the changed world clearly enough that the player can explain what happened before the next decision.
- [ ] Equal authored world, seed, and ordered intent log reproduce the same completed round in browser and Node.
