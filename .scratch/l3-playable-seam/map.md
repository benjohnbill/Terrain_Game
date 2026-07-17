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
- **Documentation:** follow `.claude/rules/documentation-law.md`. Ticket answers
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
- **11** — one scalar (is the rollback window one deployed acceptance cycle, or
  zero?) + the archive-vs-delete policy. Its option C is already foreclosed by
  C01.7.

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

**Amendment owed to resolved gate 01** (not a reversal — its constraints assert
facts that are not true): C01.2/C01.4 (the comparator holds no sealed war model
and cannot be seeded — 38 unseeded `Math.random()` sites), C01.5 (written
against the working tree: `game.html` is not in HEAD, and firebase `cleanUrls`
makes the route `/game`), C01.7 (retirement is **not** a data-loss operation —
`game.html` is byte-identical to `HEAD:index.html`).

**Order:** 05 stays next — genuinely open, unblocked, and the war-termination
answer changes nothing about it. Amend its scope per the synthesis (the
audit-lint landmine, the dropped route/mount + Vite `base` question, the
phantom lockfile). Schedule the war-termination pass in parallel or immediately
after; 08 → 09/10/11/12 all sit behind it.

## Decisions so far

<!-- Closed ticket pointers are appended here. Open tickets are discovered by
     scanning the child issue files, not listed on the map. -->

- [Verify Vite, TypeScript, ESM, and Legacy CommonJS Coexistence](issues/04-research-toolchain-coexistence.md) — root CommonJS, a scoped ESM boundary, Vite/static artifact assembly, and exact emitted-output parity can coexist without a root module flip; topology choices remain open ([report](research/toolchain-coexistence.md)).
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
