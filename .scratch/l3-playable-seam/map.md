# L3 Playable Seam Wayfinder Map

Label: wayfinder:map
Status: open

## Destination

Produce the settled decision set needed to author implementation-ready specs
for an L3 build in which the authored map and settled Slice 1–2 behavior are
playable through a React + Vite + TypeScript/TSX UI and framework-free
TypeScript Game Runtime, emitted as ESM JavaScript for browser and Node, for
one complete match.

## Notes

- **Workflow:** Wayfinder decisions → feature specs → implementation tickets →
  implementation. This map plans; it does not carry implementation.
- **Tracker:** local Markdown under `.scratch/`, per
  `docs/agents/issue-tracker.md`.
- **Stack already adopted:** React + Vite + TypeScript/TSX. Every new canonical
  L3 production module, including Game Runtime and domain/rule modules, is
  authored in TypeScript/TSX; browser and Node execute emitted ESM JavaScript.
  Existing JavaScript is ported through playable vertical slices and retained
  only until parity and cutover gates permit retirement (ADR 0040). This map
  decides migration shape, not whether to reopen the stack choice.
- **Functional Fog of War is part of L3 completion:** temporary development
  disclosure is allowed only during migration. The completed L3 path must make
  scouting visibly change the estimate band and command preview, and must not
  expose hidden true state to React or the renderer.
- **Architecture discipline:** consult `codebase-design`; the Game Runtime is a
  deep module behind a small interface at the seam. React, DOM, renderer
  objects, browser globals, time, and entropy do not become implicit rule
  dependencies.
- **Decision sessions:** grilling tickets use `grilling` + `domain-modeling`,
  one question at a time. Prototype tickets use `prototype` and require live
  user reaction. The original "never resolve more than one non-research ticket
  per session" pacing limit was overridden by the user 2026-07-16 (finish the
  pre-implementation work); the one-question-at-a-time rule and the
  user-seals-every-gate rule are **not** overridden.
- **Documentation:** follow `DOCUMENTATION-LAW.md`. Ticket answers
  remain Working-layer evidence; accepted cross-feature architecture decisions
  promote through the ADR supersession protocol when specs are authored.
- **Repository safety:** the main worktree contains unrelated in-flight changes.
  Do not rewrite, stash, or commit them as part of a decision ticket. Use
  `/usr/bin/git` when repository history is needed.
- **Working synthesis:** [L3 Playable Seam — Working Umbrella Spec](spec.md)
  captures the approved destination and standing architecture for agent-driven
  Wayfinder closure. It is not the final Production spec partition and does not
  close any open decision ticket.
- **Decision Ledger:** [ledger.md](ledger.md) — the 41 constraints already
  sealed by resolved gates 01/02/03/04, assembled 2026-07-17 as the single
  baseline for gate work. Consult it before treating anything as open.
- **Gate audit (2026-07-17):** every open gate was audited against repository
  evidence by an independent read-only auditor. Findings + the user-accepted
  re-cut: [audit/SYNTHESIS.md](audit/SYNTHESIS.md). The re-cut below supersedes
  the tickets' own framing where they conflict; the tickets keep their evidence
  and option spaces.

## Gate re-cut — user-accepted 2026-07-17

Source: [audit/SYNTHESIS.md](audit/SYNTHESIS.md). The tickets were drafted
2026-07-16 without a repository survey. The audit found **no gate correctly
framed and genuinely open**, and **no gate closeable as-is**. Accepted shape:

**Real decisions (grill):** 05 · 06 · 07 · 08.

**Out-of-band (not a gate) — the war-termination pass.** The long pole, owned
by no gate and absent from every plan. Read metric 5 (`npm run metrics:fizzle`
— the read `docs/features/war-model-build/INDEX.md` explicitly parked for the
user); split the dial residue (~35.7%, named 가안 constants, → the registered
magnitude pass) from the mechanism residue (~18.6%, → needs an owner); decide
whether ADR 0030 (패권 결정점) ports into `js/` or is waived for the slice;
amend ADR 0038 (L0, falsified by its own pre-registered metric 5, unamended);
correct R14's "Answered" stamp (Working layer). **Gate 08 cannot close without
it.**

**Demoted — not grill gates:**

- **09** — pre-answered by ADR 0040 D2/D5/D6 + spec + C01.7. The "adapter
  ladder" frame is inapplicable: the eight port targets have no coupling to
  adapt (~35–40 lines of mechanical edit). Real residue = a **classification**
  (accepted / superseded / incidental), folded into 08's slice work.
- **10** — ~85% restates the spec's Testing Decisions; 27 of 41 ledger
  constraints already name it downstream. Real residue = proof **strength**
  (metamorphic testing), **who judges the human rung and what is a FAIL**, and
  the unasked question: is 10 the **admission** gate to L3 playtesting or the L3
  **verdict**? (`docs/features/match-arc/TEST-LADDER.md` — the source of the
  word "L3" — defines that rung as fun/tension/skill expression; neither ticket
  nor spec cites it.)
- **11** — **re-framed 2026-07-17 by ADR 0041.** Route promotion and hosting
  rollback were most of its content and are now void: the game never occupies
  the public landing route, and static-artifact rollback is the landing page's
  concern. What survives is the archive-freeze question, which ADR 0041 §2
  largely answers (the archive is not deleted; it stops being load-bearing).
  Residue: whether anything is retired at all, and on what evidence.

**Reduced:**

- **07** — the renderer half collapses to **produce a measurement**; the choice
  is already sealed in three places the ticket never cites (spec "no renderer
  escalation by ambition alone", this map's Not-yet-specified, ADR 0028:86-92).
  The prototype survives, and its real job is *does the sealed 7-grade matrix
  read to a human* — note the **derived-band grade (판세 / 동원 강도 / civilian
  register) has no encoding proposal anywhere**.

**Split:**

- **12** — (a) a governance batch (Record/Production/Projection + baselines;
  ~10 duties parked across three trackers; all the judgment) and (b) mechanical
  ticket re-pointing (already specified by
  `.scratch/l3-playable-build/README.md`; no grill needed). **(a) is blocked**:
  its declared precondition is `.scratch/doc-structure/issues/10-audit-run-3.md`,
  which reads `Status: BLOCKED — the gate itself is unsound` / `⛔ DO NOT
  EXECUTE`.

**Amendment to resolved gate 01 — PAID 2026-07-17 by ADR 0041.** Its constraints
asserted facts that are not true. C01.5 and C01.6 are **void**, C01.2/C01.4 are
**re-scoped**, C01.7 is **corrected** (retirement is not a data-loss operation);
C01.1/C01.3 stand. The topology's shape survives — build beside, do not convert
in place — but "strangler" is the wrong name for it: a strangler assumes the old
system's traffic, and a reference archive has no traffic to assume. Stamped in
the ticket, the ledger, and this map.

**Environment isolation (ADR 0041, user-stated 2026-07-17) — reshapes several
gates.** Firebase hosts the **marketing landing only**; the L3 game does not
ship as a statically-hosted web page and its destination is a **native shell**;
`js/`/`tests/`/the L2 harnesses are a **reference archive**, not a build source
or a parity comparator; canonical L3 source occupies **its own directory tree**
(boundary = gate 05's call). This was already half-recorded — ADR 0016 § Decision
has always staged the native-shell wrap — and the Wayfinder simply never cited
it. Likely proximate cause: `AGENTS.md` § Verification opened "This is currently
a static HTML/CSS/JavaScript app," an auto-loaded present-tense fact read as an
architecture statement. Now corrected there.

**Order:** **05 resolved 2026-07-18** — option A (nested `game/` tree), one
root-owned lockfile, the full `:game` command surface with gate 10 owning
thresholds, D5 audit-lint re-aim, and single-emit parity (see § Decisions so
far). **06 is next.** Gate 05's scope had been amended twice over, and both
amendments held at seal time:

- **Freed** by ADR 0041 — the public-route question (Vite `base`, SPA mount,
  the `/game` route from firebase `cleanUrls`) is **moot for the game**. The
  audit's criticism that gate 05 "dropped the route/mount question" is
  **withdrawn**: correctly out of scope.
- **Sharpened** — the audit-lint landmine is now a *designed* fracture, not an
  accident: all 27 sealed terms with a code contract point into `js/*.js`, which
  ADR 0041 names an archive, and `audit-lint.js`'s flat non-recursive `js/` scan
  cannot see the new tree. Registered in `docs/SYNC-DEBT.md`.
- **Still standing** — the phantom lockfile (there is no lockfile, no
  `node_modules`, zero dependencies; React+Vite+TS would be the project's first
  dependency tree) and the ownership collision with gate 10 over who names
  commands.

Schedule the war-termination pass in parallel or immediately after; 08 →
09/10/11/12 all sit behind it.

## Decisions so far

<!-- Closed ticket pointers are appended here. Open tickets are discovered by
     scanning the child issue files, not listed on the map. -->

- [Choose the Build, Module, and Test Topology](issues/05-choose-build-and-test-topology.md) — nested `game/` ESM/TypeScript island beside the CommonJS root (option A); one root-owned lockfile with `game/package.json` a `{"type":"module"}` marker; a seven-command `:game` developer surface where gate 05 owns command names/structure and gate 10 owns pass/fail thresholds (acceptance commands fail `pending` until filled); `node:test` + `@playwright/test` runners with no second unit framework; audit-lint re-aimed to the new tree (recursive + `.ts`, per-term codeRef graduation, `code-contract` stays blocking, `game/` added to write-lint `GOVERNED`) with execution deferred to the first port ticket; and a single-emit Runtime parity contract where Node and browser load the same emitted ESM (threshold owned by gate 10). Resolved 2026-07-18.- [Verify Vite, TypeScript, ESM, and Legacy CommonJS Coexistence](issues/04-research-toolchain-coexistence.md) — root CommonJS, a scoped ESM boundary, Vite/static artifact assembly, and exact emitted-output parity can coexist without a root module flip; topology choices remain open ([report](research/toolchain-coexistence.md)).
- [Preserve or Replace the Legacy Play Path?](issues/01-choose-migration-topology.md) — use a parallel-strangler topology: preserve `game.html` as the bounded legacy comparator while the separate canonical L3 path reaches parity, promote L3 into the stable public play-path role, use static-artifact rollback, and retire the legacy path after its named cutover gate.
- [Define Game Runtime Authority and Its Interface](issues/02-define-game-runtime-authority.md) — the Runtime privately owns match truth; viewer projection is the single blur seam; preview is a pure module outside the Runtime; bots are ordinary callers; turn order stays in the Runtime while pacing stays outside; authored-world identity, seed, and ordered intent log form the canonical durable representation.
- [Define What Each Viewer Can Know](issues/03-define-viewer-knowledge-contract.md) — Standard Fog publishes the land and everything derived from it (terrain, fortification, routes, diplomacy, **current political control**, land value/yield, register pool) and fogs only the mutable draw on it; enemy substance/fatigue are bands, field-army position is last-seen plus reach cone, posture/commit/**treasury** are absent from the projection, and treasury's uncertainty survives only as 판세 band width; civilian register and 동원 강도 fall out as derived bands with zero new dials; seven non-leak invariants and the dead `[0, 0.45)` confidence interval are recorded there.

## Not yet specified

- **Persistence and replay product surface beyond one uninterrupted match.**
  Authored-world identity, seed, and ordered intent log are the canonical
  durable representation, and no snapshot API ships by default. A save/load or
  replay UI and cross-version replay policy remain unsized product work.
- **Renderer upgrade measurements.** Concrete layer-count, pan/zoom, and sprite
  performance thresholds for considering PixiJS depend on the representative
  map/Fog prototype. Until then, renderer replacement remains only a trigger.
- **Long-term information presentation.** Battle-report inference, predictive
  reconnaissance, and richer historical intel depend on the L3 viewer-knowledge
  contract and the first human playtest signal.

## Out of scope

- Slice 3 settlement and Slice 4 defense-mechanic design or implementation;
  the L3 interfaces must leave an extension path, but this effort does not
  legislate those mechanics.
- Final art direction, asset production, animation polish, and a PixiJS upgrade
  without measured renderer pressure.
- PvP, accounts, servers, authoritative networking, and anti-cheat.
- Desktop/native packaging, store integration, and a full game-engine migration.
- A big-bang rewrite of every legacy JavaScript module or test.
- Casual/Challenge Fog profiles, terrain concealment, espionage, deception,
  and predictive-reconnaissance mechanics.
