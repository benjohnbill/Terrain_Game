# L3 Wayfinder Gate Audit — Synthesis

**Layer:** Working (audit artifact — evidence, not a seal)
**Date:** 2026-07-17
**Method:** Decision Ledger (`../ledger.md`, 41 constraints from resolved gates
01/02/03/04) → eight independent read-only per-gate auditors (05–12) → this
synthesis. Auditors reported inline (they were read-only and could not write
their own files); their findings are condensed here.
**Status:** re-cut accepted by the user 2026-07-17 and applied to the tracker
(`../map.md` § Gate re-cut). Findings stand as evidence except where marked.

---

## SUPERSEDED IN PART — read this first (2026-07-17, ADR 0041)

After this audit was written and committed, the user corrected a premise **this
document shares with the gates it audits**: Firebase Hosting serves the
**marketing landing page only**. The L3 game does not ship as a statically-hosted
web page; its destination is a **native shell** (Electron/Tauri, deferred), with
the landing page later carrying download integration. The environments are to be
kept completely isolated. And `js/`, `tests/`, and the L2 harnesses are a
**reference archive** — not a build source, and not a parity comparator.

Recorded as `docs/adr/0041-environment-isolation-and-reference-archive.md`,
which amends ADRs 0016 and 0028.

**What that changes here:**

- **Finding A stands and gets its explanation.** The "inversion" this audit
  found — the population *with* a comparator runs superseded behavior; the
  population *with* accepted behavior has no comparator — was not an anomaly to
  fix. It is what a **reference archive** looks like when it is mistaken for a
  migration source. Gate 01's C01.5/C01.6 are now **void**, C01.2/C01.4
  **re-scoped**, C01.7 **corrected**. The topology's shape survives; the name
  does not (a strangler assumes the old system's traffic; an archive has none).
- **The gate-05 criticism is WITHDRAWN.** This document faulted gate 05 for
  dropping the route/mount + Vite `base` question. That was wrong — the game is
  not web-routed in production, so it was correctly out of scope. Gate 05's
  option space is *freed*, not incomplete.
- **Gate 11 is re-framed, not just demoted.** Route promotion and hosting
  rollback were most of its content and are void.
- **E3 sharpens from landmine to designed fracture.** `js/` is now *declared* an
  archive, so the 27 sealed terms' code contracts point at archived code by
  design, and `audit-lint.js`'s flat `js/`-only scan cannot see the new tree.
  Registered in `docs/SYNC-DEBT.md`.
- **Everything else stands** — Finding B (war/match termination), Finding C
  (gate 12), Finding D (the fog GLOSSARY contradiction), and E1/E2/E4–E9.

**The method lesson is the sharpest thing in this document.** ADR 0016 § Decision
has *always* read: "Stage 2 (trigger: a decision to publish a native/desktop
build): wrap the existing web build with a native shell (e.g., Tauri or
Electron)." The gates never cited it. Neither did this audit — eight independent
auditors and a synthesis all inherited "static web app" without once asking where
the game ships. The likely carrier: `AGENTS.md` § Verification opened *"This is
currently a static HTML/CSS/JavaScript app"* — an auto-loaded, present-tense
statement about the **prototype**, read as an architecture statement about the
**project**. A sweep that checks documents against documents cannot catch a
premise that no document contradicts and every document assumes. Only the user
could. (Now corrected at that surface.)

---

## Headline

**Not one of the eight gates is what its ticket says it is.**

| Verdict | Gates |
|---|---|
| MIS-FRAMED | 06, 08, 09, 10 |
| PARTIALLY-ANSWERED | 05, 07, 11 |
| UNDER-SPECIFIED | 12 |
| genuinely open, correctly framed | **none** |
| already answered, closeable | **none** |

The tickets were drafted 2026-07-16 without a repository survey. The audit's
value is not that they were wrong — it is that the *shape* of the remaining
work is different from the shape the tracker describes.

---

## Finding A — Gate 01's comparator premise is factually false

**Three independent auditors (05, 09, 11) hit this from three angles.** None
was asked to; the prompts named different subjects.

| Evidence | Source | Verified |
|---|---|---|
| `game.html` loads 17 classic scripts and **zero of the eight slice-2 war modules** (battle, fatigue, movement, field-army, commit, board-verbs, bot-exit, window-read) | 05, 09 | both auditors, independently |
| The eight port targets therefore **have no legacy comparator** | 09 | — |
| The comparator's war is `js/combat.js` (2026-06-29) — behavior the spec's *Settled-war eligibility* already declares **ineligible** | 09 | — |
| **38 unseeded `Math.random()` sites** in the legacy path (ai.js 14, main.js 19, game.js 3, combat.js 2) → C01.4's "equivalent fixtures and seeds" is **unachievable** without modifying the comparator gate 01 preserved | 09 | — |
| **`game.html` has never been committed** — not in HEAD, not anywhere in history | 11 | **main session, directly**: `git ls-files --error-unmatch game.html` → no match; `git log --all --diff-filter=A -- game.html` → empty |
| **`game.html` is byte-for-byte identical to `HEAD:index.html`** — it is the committed game under a new name, copied by an uncommitted landing redesign | main session | **directly**: `diff <(git show HEAD:index.html) game.html` → identical |

Composed: gate 01 (resolved 2026-07-16) decided a parallel-strangler topology
resting on "preserve the legacy route as the bounded comparator, retire it
later, git holds the history." That comparator **(a)** does not exist in git
under the name the gate uses, **(b)** does not contain the sealed war model,
and **(c)** cannot be seeded for equivalent-fixture parity.

**The inversion (09's phrasing):** the population *with* a comparator is the
superseded one; the population *with* accepted behavior has no comparator.

### CORRECTION (main session, 2026-07-17) — gate 11's fact is right, its inference is wrong

Gate 11 reasoned: `game.html` was never committed → deleting it at the
retirement gate is **permanent unrecoverable loss** → archive-vs-delete is a
data-loss decision, not a policy preference. **The first synthesis draft of
this document repeated that inference. It is false.**

`game.html` is byte-for-byte `HEAD:index.html` (verified). The legacy play path
**is** in git — under the name `index.html`, throughout history. An uncommitted
in-flight landing redesign is mid-rename:

```
HEAD:     index.html = the game (all of history)
working:  index.html = a landing page (+504/-179, adds landing.js/css refs)
          game.html  = the game (a copy of HEAD:index.html, untracked)
```

**There is no data-loss risk.** The content is recoverable from any commit.

**The real finding survives and is sharper:** gate 01's **C01.5** — "at
promotion, the accepted L3 build **assumes the public `game.html` role** so the
external landing-page contract stays stable" — was written against the
**working tree, not HEAD**. In HEAD there is no `game.html`, and the game's
public route is `/`. The move to `game.html` is uncommitted in-flight work; and
because firebase sets `cleanUrls: true` with a `/game` header rule, the route
it lands on is **`/game`**, not `game.html`. Gate 01 designed a cutover onto a
rename that has not happened, under a filename that is not the route.

**The comparator's identity is in flux** — that, not data loss, is what gate 11
and gate 05 must account for.

**Recommendation withdrawn:** do NOT commit `game.html` in isolation. It is one
slice of a coherent uncommitted change set (index.html rewrite · landing.js ·
landing.css · assets/landing/ · firebase.json · .firebaserc · robots.txt ·
sitemap.xml · build-hosting.js · PRODUCT.md · the strategy-ground landing plan
and design specs · landing_example/). Committing the slice would leave the repo
holding two identical game files (`index.html` at HEAD and `game.html`).
That change set belongs to its owner, whole.

**Still true and still unowned:** a clean checkout of HEAD cannot run
`npm run build:hosting` — the script is untracked and its target `game.html`
does not exist there. Same class of defect as E3 and E9.

---

## Finding B — The real blocker is not in the 01–12 graph

Gate 08's structural finding, stated in its own words: **"08's real blocker is
NOT in the 01–12 graph."** The war-model seal decision and the un-ported
ADR 0030 are owned by **no Wayfinder gate**.

### B1 — the war-end hole (hypothesis confirmed)

- `docs/features/war-model-build/INDEX.md` (2026-07-16): "**The build is
  complete; the seal decision is not made.**" no-material-outcome 80.7% →
  68.7%; the fizzle survived **renamed** — ~35.7% pre-emptive white peace +
  **~18.6% wars that now simply never end**; "ADR 0038's composite fires none
  of 격멸/수도/정착."
- Reproduces in the retired L2 harness after its own retirement (78.8% →
  72.1%) → "**a property of the model, not of one loop.**"
- ADR 0038 is **L0**-trust and pre-registered metric 5 as its own test. Metric
  5 ran and **falsified its Consequence**. The ADR still reads "Accepted
  (sealed 2026-07-14)", unamended (08).
- Two of ADR 0038's three channels are unwired **by its own admission**;
  "the wiring ticket that owns both sides" **does not exist** — the plan was 11
  tickets and 01–11 all landed (08).
- Channel 1 (격멸) needs a loop that does not exist: `resolveEngagement` has
  **no non-test caller** (08, 09; confirmed earlier in-session).

### B2 — the match-end hole (nobody had named this)

Gate 08's ticket says `js/game.js:448-465` `checkVictory()` is superseded
because "ADR 0038 defines the accepted war-ending composite." **Category
error.** `checkVictory()` is a **match**-end rule; ADR 0038 ends **wars**. Its
actual replacement is **ADR 0030 (패권 결정점)** — and ADR 0030 has **zero
implementation in `js/`**; every hegemony/패권/unassailable hit lives in the
**retired** `mockup/combat-calc/` harness.

→ **The only match-ending in `js/` is the one the gate forbids; the accepted
one is un-ported and L3-ineligible.** Spec Mission :50-57 / US23 / US24 have no
eligible foundation today.

### B3 — the deepest finding: the acceptance gate can pass on a broken war

Gate 10, grounded (marked INFERENCE by its auditor; the seals are verified):

- **Crisis arc**: onset turn 25 → **hard end turn 35 = Westphalian draw**
  (match-arc GLOSSARY, AGREED 2026-07-11 — verified in this pass).
- Therefore **every match ends** regardless of whether its **war** resolves.
  Wars ≠ matches.
- L3's acceptance criterion is "one complete match." It is **trivially
  satisfiable via the turn-35 draw**. Gate 07's human check ("finish one match
  and state why it ended") would **PASS** on a fizzled draw: *"it hit the hard
  end."*
- Target invocation for the draw is **< 0.1%** (GLOSSARY:118) — against ~18.6%
  of wars never ending.

**The human acceptance gate can pass on a broken war model.** And
GLOSSARY:118 already registers "**L3 debt: the draw screen's emotional
design**" — if the acceptance match draws, that screen is undesigned.

### B4 — dial vs mechanism: both, separably, and pre-registered by the code

- **DIAL (~35.7%)**: `js/bot-exit.js:309-311` names the lever **in advance** —
  "the lever is the OWN_WINDOW_APPETITE / trajectory 가안 … not the sealed
  acceptance arithmetic." Named constants: `WINDOW_APPETITE = 1.0` (:108),
  `TRAJECTORY_EPSILON = 0.02` (:100 가안), `APPETITE_THRESHOLD = 1.7`
  (window-read.js:83 가안). Owned by the already-registered magnitude/commit-curve
  pass. **Does not block picking a first slice.**
- **MECHANISM (~18.6%)**: INDEX — "nothing closes a stalemate";
  `fizzle.js:321` — "**Retiring a timer does not make a fizzling war decisive
  — it makes it never end.**" **But** measured **crisis OFF**, and
  "unresolved = still running at the envelope" (turn cap) → 18.6% ≠ proven
  non-termination. The known backstop is the crisis arc — **parked, and
  circularly**: INDEX Q3 un-parks it "once decisive war is the default," while
  it is precisely what would close the never-ending residue.

**Meaning for gate 08:** the distinction **narrows** the gate rather than
blocking it. 08 can pick its A-or-B slice today; it **cannot** fix a match
stopping point until ADR 0030 is ported (or explicitly waived for the slice)
and the never-ending residue has an owner.

### B5 — TEST-LADDER: the word "L3" was never checked against its own definition

`docs/features/match-arc/TEST-LADDER.md` is the **source of the word "L3"** in
this entire effort. It defines that rung as **"Fun, tension, skill expression,
actual human choices"** (verified). Gate 10 tests only **comprehension**
(legibility). Neither the ticket nor the umbrella spec cites the ladder — the
ticket has one glancing "the project's L3 ladder" (:124); the spec, zero.

The ladder also **pre-registered an acceptance test for exactly this build**:
"remove the placeholder, model the system, and check the board still moves" ·
"matches must move without the idle-aggression placeholder" · "war frequency is
carried by the fog layer." The L3 seam builds the fog/scouting system those
placeholders stood in for. **Neither ticket nor spec mentions it.**

**Unasked question (10):** is gate 10 the **admission** gate to L3 playtesting,
or the L3 **verdict**? If admission, the ladder's L3 stays open and this
Wayfinder ships a build, not a validated game.

---

## Finding C — Gate 12 is under-specified and its precondition is blocked

- **Its precondition does not run.** Gate 12 declares "the planned
  documentation / terminology audit" without locating it. The repo's match is
  `.scratch/doc-structure/issues/10-audit-run-3.md` — a fourth, untracked
  tracker (10 tickets) whose terminal gate reads: **`Status: BLOCKED — the gate
  itself is unsound`** / **`⛔ DO NOT EXECUTE — and do not trust this ticket's
  gate`** (verified in this pass).
- **Seven duties it will owe are not named in it.** Ticket grep for
  `term`/`glossary`/`quickref`/`inventory`/`vocabulary`/`DOMAIN_MAP` → **zero
  hits**. But C02.14 parked term registration *there*; ritual duty 4
  (QUICKREF regeneration) and duty 7 (term-inventory patch) attach
  automatically; both 2026-07-17 Wayfinder-03 SYNC-DEBT rows are uncited (the
  ticket says "three riders" / "the corresponding row", singular).
- **Proof it predates its own duties:** ticket last touched 2026-07-16
  (`f9bd4f8`); the gate-03 seal and its two debt rows landed 2026-07-17
  (`177f81f`).
- **Orphan risk:** `DESIGN.md:43` ("renders returned game state and events") is
  stale **because of ADR 0040** — owed regardless of whether gate 12 mints an
  ADR. Both SYNC-DEBT:14-42 and the ticket park it **conditionally** ("if an
  ADR is minted"). A no-ADR outcome silently orphans a known-stale Projection
  sentence.
- **Split candidate:** (a) a governance batch — Record/Production/Projection +
  baselines, ~10 parked duties across 3 trackers, all the judgment; (b) ticket
  re-pointing — mechanical, 9 files, already fully specified by
  `.scratch/l3-playable-build/README.md:13-30`'s 6-condition readiness rule.
  (b) does not need a grilling gate.

---

## Finding D — a defect in this session's own gate-03 seal

Caught by the gate-07 auditor, against work sealed hours earlier.

`docs/features/fog-of-war-discovery/GLOSSARY.md` — **Tier-1 birthplace,
AGREED 2026-07-10** — still defines Information confidence as *"a scalar from
**blind (0)** to fully known (1)"*. Gate 03's C03.10 seals `[0, 0.45)` as
**permanently dead** with `DECAY_FLOOR = 0.45` as the authoritative bottom.
**Direct contradiction with the birthplace**, and the main session read that
file earlier the same day without catching it. Under the law the same batch
owed the row a stamp.

Related, from the same auditor: **ADR 0023**'s confidence-gated status
vocabulary ("border-but-uncertain", "occupied-but-poorly-scouted", `threatened`
requires "sufficient information confidence") is Accepted and unretired vs
C03.1. Likely reconcilable — the gating reads as being on enemy reach/force,
not control — but gate 03 never named ADR 0023. **[INFERENCE — needs a look.]**

**Pay with** the fog RULING ② promotion batch already registered in SYNC-DEBT
(2026-07-17), alongside the fog INDEX "position fog" Status-line row.

---

## Finding E — material defects found in passing

| # | Defect | Verified |
|---|---|---|
| E1 | **JSON silently destroys `choke.cap === Infinity`.** 5 of 17 `CRADLE_MAP` edges carry it (open borders, unlimited). `JSON.parse(JSON.stringify(map))` → `cap: null` → loader reads an **open** border as **closed**. Feeds 투사 가능 질량 → the B1/⑰ leadership gate. Gate 06's ticket recommends a "TypeScript/JSON-compatible world artifact" without noting the JSON leg is **fail-silent**. | **main session, directly** (node round-trip) |
| E2 | **Sector count is wrong in two Production docs.** `terrain-cradle/INDEX.md` and `DOMAIN_MAP.md:440` say "10 regions → **55** sectors"; the generator produces **56** and `tests/occupation-geography.test.js:13` asserts 56. Hexes (292) and borders (17) match. | **main session, directly** |
| E3 | **`audit-lint.js` breaks the moment the port starts.** Its source map is a flat, non-recursive `readdirSync(root/js)` filtered to `.js` (:347-350); `checkCodeContract` resolves only `jsFiles[ref] \|\| jsFiles['js/'+ref] \|\| ''` (:130-148). All 27 sealed terms with a code contract point into `js/*.js`. The first module ported to `l3/src/**.ts` → `code-contract-violation` → **`npm run lint:docs` fails** — a mandatory ritual duty (documentation-law:189) **and** a PostToolUse hook. Gate 05 enumerates a 9-command developer path and omits the one command its own decision breaks. | **main session, directly** (mechanism read) |
| E4 | **Phantom lockfile.** Gate 05 says "keep the root package and **lockfile**." There is no lockfile, no `node_modules`, and zero dependencies. React+Vite+TS+a browser runner would be the project's **first-ever dependency tree**, into a stack whose entire verification today is Node built-ins running offline in ~8s. "The honest cost is a small amount of orchestration" understates it. | 05 |
| E5 | **`tests/helpers/load-browser-scripts.js` cannot satisfy C04.7.** An 874-byte `vm` shim: stub `document`, injects Node's **own** Math/Date, `vm.runInContext` = classic scripts only, no ESM, no HTTP/MIME/module loader. It cannot even prove C02.10 (seed/clock injection). The spec claims "static-server browser checks" as prior art: **no** createServer/puppeteer/playwright/jsdom exists anywhere; `AGENTS.md` § Verification is a manual `python3 -m http.server 8007`. The browser-parity gate is **~100% greenfield**. | 05, 10 |
| E6 | **`map-data.js` exports `CANONICAL_MAP`** — the superseded C-loop iteration-1 world, orphaned, never restamped. A file exporting "CANONICAL_MAP" that isn't canonical is exactly gate 06's trap, and it is absent from the ticket's inventory. | 06 |
| E7 | **The strongest fog prior art is built on the retired model.** `mockup/situation-map.html` (51K js + 26K css, 10 SVG layers, browser-verified) renders `st==='unknown'` → murk + `?`, with fixtures carrying `estForceConfidence: 0.12`/`0.30` — **inside the `[0, 0.45)` interval C03.10 killed**. It is a **craft** asset, not a **model** asset; reusing it uncritically re-imports map discovery. Gate 07 also *forbids* `?` while the prior art's headline treatment **is** `?`. | 07 |
| E8 | **The map is not final.** `terrain-cradle/INDEX.md` Open questions still carries a queued seed re-authoring + a user-flagged map-design grill. TC-⑫ (Carve principle, SEALED 2026-07-07) says re-authoring "**scrambles the sealed sector layout**" — exactly the `rN_sN` identifiers gate 06 is asked to declare stable. | 06 |
| E9 | **The documentation law points at an uncommitted script.** `scripts/sync-docs-law.js` is untracked, but the working `package.json` wires it into **`lint:docs`** (`audit-lint.js && sync-docs-law.js --check`) and `sync:docs-law`, and the working `AGENTS.md` instructs agents to run it. HEAD is self-consistent (its `lint:docs` is `audit-lint.js` alone; its AGENTS.md never mentions the script), so this is **entirely in-flight**, not a HEAD defect — but the same class as E3: the governance toolchain depends on files outside the committed tree. Do not commit it here; it is one slice of another session's coherent change set (`sync-docs-law.js` + the `package.json` script entries + the `AGENTS.md` generated block). | main session |

---

## The derivation graph

Composed from all eight auditors' CASCADE-IN/OUT. Resolved gates in **bold**.

```
  [01]──┬─────────────────────────────────────► 05, 09, 11
  [02]──┼─► 05, 07, 08, 09, 10, 12
  [03]──┼─► 06, 07, 08, 09, 10
  [04]──┴─► 05

        05 ──► 06 ──► 07 ──► 08 ──► 09 ──► 10 ──► 11 ──► 12
        │                     ▲                            ▲
        └──► 10, 11, 12       │                            │
                              │                    ┌───────┴────────┐
                    ┌─────────┴──────────┐         │ doc-structure  │
                    │  OUT-OF-BAND       │         │  audit run #3  │
                    │  · war-model seal  │         │  ⛔ BLOCKED    │
                    │    decision        │         └────────────────┘
                    │  · ADR 0030 port   │
                    │  · never-ending    │
                    │    residue owner   │
                    └────────────────────┘
```

**Two facts the graph makes visible:**

1. The chain is **essentially linear** with **08 as the fulcrum** — and 08's
   blocker is *outside the graph*.
2. **12's precondition is outside the graph too**, and it is blocked.

Both terminal dependencies point at work no Wayfinder gate owns.

**Correction owed to the tracker:** gate 12's `Blocked by: 06, 07, 08, 09, 10,
11` **omits 05**, though its body twice depends on it. Gate 10's `Blocked by`
omits **06 and 07**, though its Gate 4 owns 06's subject and its Gate 7 owns
07's.

---

## Proposed re-cut

**Recommendations. The user seals; nothing below is decided.**

### 1. Schedule the out-of-band work — it is the long pole

**A war-termination pass**, outside the Wayfinder. Its content:
read metric 5 (`npm run metrics:fizzle` — the read `war-model-build/INDEX.md`
explicitly parked for the user); split dial (35.7%, named constants, → the
registered magnitude pass) from mechanism (18.6%, → needs an owner); decide
whether ADR 0030 ports into `js/` or is waived for the slice; amend ADR 0038
(L0, falsified by its own pre-registered test, unamended); correct R14's
"Answered" stamp (Working layer, not Projection).

This is what the Wayfinder assumed was done. **08 cannot close without it.**

### 2. Amend gate 01 — do not reverse it

Three of its constraints assert facts that are not true. None of the fixes is a
topology reversal.

- **C01.2 / C01.4** — re-scope honestly: the comparator compares the legacy
  **route**, not the war model, which was never in it. And "equivalent fixtures
  and seeds" is unachievable against a path with 38 unseeded `Math.random()`
  sites unless the comparator itself is modified — which the gate preserved
  precisely to avoid modifying.
- **C01.5** — written against the working tree. `game.html` is not in HEAD; the
  game's committed public route is `/`; the in-flight redesign moves it to
  `/game` (firebase `cleanUrls: true`). Decide against HEAD or against the
  landing work's intended end state, but say which.
- **C01.7** — the retirement step is **not** a data-loss operation (correction
  above). It is an ordinary deletion of content that lives in git history.

**Do not** commit `game.html` in isolation (see the correction). The landing
change set is its owner's to land whole.

### 3. Collapse what is not a decision

| Gate | Now | Proposed |
|---|---|---|
| **09** | grill gate | **Not a gate.** Pre-answered by ADR 0040 D2/D5/D6 + spec:315-336 + C01.7. Real residue = a **classification** exercise (accepted / superseded / incidental), which belongs with 08's slice work. Port cost is **~35-40 lines across 8 files** — the "adapter ladder" frame is inapplicable because the modules have **no coupling to adapt**. |
| **10** | grill gate | **Mostly a write-down.** ~85% restates spec Testing Decisions; 27 of 41 ledger constraints already name it downstream. Real residue = **two questions**: proof *strength* (metamorphic testing is genuinely new) and **who judges the human rung, and what is a FAIL** (solo project: if the builder is the playtester, "without developer explanation" is structurally unsatisfiable — nobody has asked this anywhere). Plus B5's unasked question: admission gate or verdict? |
| **11** | grill gate | **One scalar + one policy.** C01.7 bounds the max, so A-vs-B collapses to "is the window one deployed acceptance cycle, or zero?" The policy is archive-vs-delete — an ordinary policy call, **not** a data-loss decision (correction above). Its option C is already foreclosed by C01.7 and the ticket says so while still listing it. Its real unasked input: **which route/filename is the comparator**, given the identity is mid-rename and uncommitted. |
| **07** | 3-variant renderer pick + presentation | **Renderer half collapses to "produce a measurement."** Sealed in **three places the ticket never cites**: spec:350-353, map.md Not-yet-specified, ADR 0028:86-92. Its Variant C (React draws cells) is already excluded by ADR 0028:78-80. Prototype **survives** — but its real job is "does the 7-grade matrix read to a human," and the **derived-band grade (판세 / 동원 강도 / civilian register) has no encoding proposal anywhere.** |
| **12** | one gate | **Split.** (a) governance batch — needs its blocked precondition resolved first; (b) mechanical re-pointing — already specified by the build README; no grill needed. |

### 4. What genuinely remains for the user

| # | Decision | Notes |
|---|---|---|
| **05** | directory boundary (nested `l3/` vs root-scoped `.mjs`) · bundled vs unbundled emitted graph · browser runner | Real, and unblocked today. **Amend its scope**: the audit-lint landmine (E3), the dropped route/mount + Vite `base` question (firebase `cleanUrls:true` + `/game` header → the public route is `/game`, not `game.html`), the phantom lockfile (E4). Ownership collision with 10 over "who names commands" — spec:419-422 says 10, ticket 10:136-137 hands it back to 05. |
| **06** | graduate the world: export artifact vs port the generator · where authoring lives afterward | Real. **Contaminated by E8** (queued re-authoring would scramble the very IDs it must declare stable) and **E1** (the JSON leg is fail-silent). The "what data shape?" framing is settled — the shape is load-bearing in 12 tests + `js/movement.js:6-7`. |
| **07** | does the sealed matrix read to a human · encode the derived band · produce the renderer measurement | Real, needs the prototype + live reaction. |
| **08** | which operation is the first eligible one · A-vs-B sequencing · bots in slice 1? | **A/B half decidable today.** Stopping point blocked on §1. |
| **out-of-band** | the war-termination pass | The long pole. Not a gate. |

**8 gates → ~4 real grills + 1 out-of-band pass + a pile of write-downs.**

### 5. Recommended order

Unchanged at the head: **05 next.** It is genuinely open, unblocked, and
everything downstream needs it — and the fizzle answer changes nothing about
it. Amend its scope per §4.

**But schedule the war-termination pass in parallel or immediately after.**
It is the long pole, it is not in anyone's plan, and 08 → 09/10/11/12 all sit
behind it.

---

## Method notes

- **Eight auditors, read-only, one baseline.** The Decision Ledger prevented
  eight independent re-derivations of "what's already decided."
- **The convergence is the signal.** Findings A and B were reached by
  auditors who were not asked about them and could not see each other.
- **The sweep caught the sweeper.** Finding D is a defect in work sealed hours
  earlier in the same session, in a file the main session had read that day.
  A grooming pass would not have found it — it was outside the active gate's
  radius.
- **Every load-bearing claim in this document was re-verified by the main
  session directly** (git tracking, audit-lint mechanism, the JSON round-trip,
  sector count, the crisis hard end, the TEST-LADDER definition, the blocked
  audit ticket, the fog GLOSSARY contradiction) — except those marked
  [INFERENCE], which are flagged for a look.
- **One method error, recorded:** the auditors were told to write their reports
  to `audit/gate-XX.md`, but Explore agents are read-only and have no Write
  tool. They returned inline instead. Content preserved here; per-gate files
  were never created.
- **Verification caught two errors in this document's own first draft.** (1) The
  gate-11 data-loss inference, repeated here uncritically and refuted only when
  the main session went to execute the recommendation it produced — the file
  `game.html` was never committed, but its *content* is `HEAD:index.html`.
  (2) The main session's first attempt to check E1 tested the wrong field
  (`edge.cap`, not `edge.choke.cap`) and the wrong container shape (`sectors` is
  an object, not an array); it reported "0 of 17" and would have wrongly cleared
  a real defect. Both cases share a lesson: **an auditor's verified FACT does not
  carry its unverified INFERENCE.** Check the inference separately, and check
  your own check.
