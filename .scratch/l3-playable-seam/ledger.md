# L3 Playable Seam — Decision Ledger

**Layer:** Working (audit artifact — not a seal)
**Date:** 2026-07-17
**Purpose:** Assembled from resolved Wayfinder gates 01/02/03/04 for the gate-audit
sweep; a single grounded baseline of already-decided constraints so downstream
per-gate audits (05–12) compare against ONE source instead of each re-deriving
"what's decided." Not a seal — evidence for the user's grooming.

## How to read this

- **Seal status column** distinguishes three kinds of authority:
  - `resolved-ticket (working-layer)` — the gate ticket's own decision. The
    ticket cites a user quote as verdict source and stays authoritative in
    `.scratch/`, but it is Working-layer evidence, not a Production seal, and no
    domain term is sealed by it (term registration is deferred to gate 12).
  - `SEALED/AGREED + date` — the gate *cites* a genuine Production seal
    (GLOSSARY row, ADR). These were spot-verified in this pass and are marked
    as such.
  - `[INFERENCE]` — my own read, not stated as a decision by the ticket.
- **Cascade hint** names the open gate(s) 05–12 a constraint pre-answers,
  narrows, or constrains, with a one-clause why. Open gates:
  05 build/module/test topology · 06 authored-world input · 07 map/fog
  presentation prototype · 08 first playable vertical slice · 09 migration/adapter
  ladder · 10 verification/acceptance gates · 11 cutover/legacy retirement ·
  12 spec partition/ADR promotion.
- Read the "Contradictions / staleness noticed" section before trusting any row
  that touches war-model settledness or the intel.js line citations.

---

## Gate 01 — Migration topology (parallel-strangler)

Source: `.scratch/l3-playable-seam/issues/01-choose-migration-topology.md`.
Decision source: user agreement 2026-07-16 ("응, 나도 동의.").

> **AMENDED 2026-07-17 by ADR 0041 — read before using any C01 row.** The
> marketing landing and the game runtime are isolated environments: Firebase
> hosts the landing only, the L3 game does not ship as a statically-hosted web
> page, and its destination is a native shell. `js/`/`tests/`/the L2 harnesses
> are a **reference archive**, not a migration source. Effect on the rows below:
> **C01.5 VOID** (L3 never assumes the public `game.html` role; that role belongs
> to a separate environment, and HEAD has no `game.html` — the route is `/game`).
> **C01.6 VOID as stated** (static-artifact rollback is the wrong axis).
> **C01.2 / C01.4 RE-SCOPE** (the comparator holds no sealed war model — the
> route loads none of the eight slice-2 modules — and 38 unseeded
> `Math.random()` sites make equivalent-seed parity unreachable without
> modifying the preserved artifact). **C01.7 CORRECTED** (retirement is not a
> data-loss operation: `game.html` is byte-for-byte `HEAD:index.html`).
> **C01.1 / C01.3 stand.** See `audit/SYNTHESIS.md` Finding A and ADR 0041.

| # | Constraint | Citation | Seal status | Cascade hint |
|---|---|---|---|---|
| C01.1 | Use a parallel-strangler topology: build the React+Vite+TS/TSX L3 app **beside** `game.html`, not converted in place. | 01:16–22 | resolved-ticket 2026-07-16 | **05** (two entry points must coexist in the build), **09** (strangler is the migration shape), **11** (defines what cutover promotes). |
| C01.2 | Preserve the public `game.html` play path as the legacy **comparison route** until L3 passes its named parity and cutover gates. | 01:18–19 | resolved-ticket 2026-07-16 | **09/10** (parity evidence needs the comparator live), **11** (retirement can't precede those gates). |
| C01.3 | The two paths must **not share authoritative state ownership**. | 01:20–22 | resolved-ticket 2026-07-16 | **05** (module boundaries keep state private per path), **09** (adapters may bridge behavior, never state). |
| C01.4 | Keep an explicit comparison path so legacy and L3 can be exercised independently against **equivalent fixtures and seeds**. | 01:23–24 | resolved-ticket 2026-07-16 | **10** (parity harness runs both over shared fixtures+seeds), **09**. |
| C01.5 | At promotion, the accepted L3 build **assumes the public `game.html` role** so the external landing-page contract stays stable. | 01:25–26 | resolved-ticket 2026-07-16 | **11** (cutover = L3 takes the public path), **05** (final artifact must be able to occupy that route). |
| C01.6 | Roll back by **restoring a previously verified static-hosting artifact**, not by a permanent dual-runtime feature flag. | 01:27–28 | resolved-ticket 2026-07-16 | **11** (rollback mechanism), **05** (versioned static artifacts must be a build output). |
| C01.7 | After promotion, retain a non-default legacy route only for a **bounded rollback window** named by the cutover spec; remove it and its temporary adapters at the retirement gate. Two permanent playable implementations are **not** an accepted end state. | 01:29–32 | resolved-ticket 2026-07-16 | **11** (retirement gate + window), **09** (every adapter inherits a retirement gate). |

---

## Gate 02 — Game Runtime authority and interface

Source: `.scratch/l3-playable-seam/issues/02-define-game-runtime-authority.md`.
Decision source: user agreement 2026-07-16 (§1/§3/§4/§5 quotes at 02:175–177).

| # | Constraint | Citation | Seal status | Cascade hint |
|---|---|---|---|---|
| C02.1 | A stateful **Game Runtime privately owns authoritative match state**; no caller (React, renderer, bots, Node tests) ever receives a reference to it. | 02:16–24 | resolved-ticket 2026-07-16 | **05** (the single external module seam), **08** (slice is built on it), **09** (the port target), **10** (contract tests hit this seam). |
| C02.2 | Every caller enters the same narrow door and receives only a **viewer-specific projection** in which forbidden values are **absent**, not present-and-concealed. | 02:24–31 | resolved-ticket 2026-07-16 | **07** (renderer consumes projection only), **10** (projection tests assert absence, not CSS-hiding), **03** builds on this. |
| C02.3 | Blur is applied **once, at the projection seam**; no downstream surface re-derives an estimate from truth. | 02:45–60 | resolved-ticket 2026-07-16 | **07** (map/fog layer must not re-blur), **10** (single-blur non-leak test), **03** (its invariant #2). |
| C02.4 | **Command preview is a pure module outside the Runtime**: `preview(view, intent) -> PreviewCard`, importing shared rule modules; not a Runtime method, not React-owned. | 02:63–82, 141–150 | resolved-ticket 2026-07-16 | **05** (a distinct pure module in the topology), **07** (preview refreshes with fog), **08** (slice uses it). |
| C02.5 | **Bots are ordinary callers**: `decideBotIntent(view, seed) -> Intent` from the bot's own projection via the same preview module; the intent is submitted through the same door as a human's. | 02:84–88, 141–150 | resolved-ticket 2026-07-16 | **08** (bot flow), **10** (a bot completing a match is the seam self-check), no second rules engine. |
| C02.6 | **Turn order is a Runtime rule**: the Runtime knows the current actor and rejects an out-of-turn intent. | 02:89–92 | resolved-ticket 2026-07-16 | **08** (turn flow), **10** (out-of-turn rejection contract test). |
| C02.7 | **Pacing is presentation and stays outside**; the Runtime resolves and returns immediately and never sleeps (measured 1.17 ms / whole match). | 02:92–93, 106–114 | resolved-ticket 2026-07-16 | **08** (bot dwell is a UI dial, not compute), **07** (no async renderer coupling needed), **10**. |
| C02.8 | The **initial interface is exactly** `currentActor -> ActorId`, `view(viewerId) -> MatchView`, `submit(intent) -> GameEvent[]`; nothing further is added by default. | 02:138–150 | resolved-ticket 2026-07-16 | **05** (fixes the seam surface), **08**, **10** (contract tests cover exactly this). |
| C02.9 | **No subscription API** — callers pump; `submit` returns the events. | 02:152–155 | resolved-ticket 2026-07-16 | **05/10** (no push lifecycle to build or test); spec US54. |
| C02.10 | **Seed and clock are injected**; rules read neither `Date.now()` nor `Math.random()`. | 02:156–158 | resolved-ticket 2026-07-16 (basis ADR 0040) | **10** (deterministic replay from equal inputs), **06** (authored-world determinism), **08**. |
| C02.11 | An **invalid intent is rejected without a state transition** and with a reportable reason. | 02:159–161 | resolved-ticket 2026-07-16 (spec US16) | **10** (no-transition rejection contract test), **08** (player-facing reason). |
| C02.12 | **Serialization**: a match is reproducible from `(authored-world identity, seed, ordered intent log)` — that triple is the canonical durable form. Events are presentation output (schema free to change). **No snapshot API in v1.** | 02:116–135 | resolved-ticket 2026-07-16 | **06** (authored-world identity is one leg of the triple), **10** (replay-from-intents test), **11** (no snapshot schema to migrate), **08**. |
| C02.13 | Internal decomposition (pure transitions behind a thin state-owning shell) is an **internal seam**, not a caller contract. | 02:162–163 | resolved-ticket 2026-07-16 | **05/09** (implementation freedom during the port; tests must not assert internal composition — Testing Decisions). |
| C02.14 | Scope boundary: this gate fixes only that a projection exists, is the blur seam, and holds no truth — **not** which categories it carries (owned by 03); interface type **names are provisional** and no domain term is sealed here. | 02:165–173 | resolved-ticket 2026-07-16 | **12** (term registration follows the audit + gate 12), **03** (owns the category matrix). |

---

## Gate 03 — Viewer knowledge contract (Standard Fog)

Source: `.scratch/l3-playable-seam/issues/03-define-viewer-knowledge-contract.md`.
Decision source: user seal 2026-07-17. The matrix (§4) and §1/§3 are user-sealed;
the invariants (§5) are declared consequences of gate 02, not new decisions.

| # | Constraint | Citation | Seal status | Cascade hint |
|---|---|---|---|---|
| C03.1 | **Current political control is PUBLIC from turn 0 at every confidence level** — control is not placed under `informationConfidence` at all (has no confidence channel). | 03:119–138 | resolved-ticket 2026-07-17 (user seal) | **07** (map color/political read is public), **08** (legal target identity without a reveal rule), **06** (authored world exposes control publicly). |
| C03.2 | The **§4 knowledge matrix** grades every fact into: Public / Exact(own) / Estimate band `[0.45,0.90]` / derived band / last-seen+reach cone / categorical / absent. | 03:240–251 | resolved-ticket 2026-07-17 (user-sealed matrix) | **07** (each grade is a distinct presentation treatment), **10** (per-grade projection tests), **06**. |
| C03.3 | **Enemy substance and fatigue** appear only as estimate bands over `[0.45, 0.90]`. | 03:247 | resolved-ticket 2026-07-17; band model = Slice 2 information ladder (SEALED, spec 2026-07-14) | **07/10**. |
| C03.4 | **Own realm is exact** (substance, fatigue, position, treasury, register, action capacity, commit pool) — no fog on self. | 03:246 | resolved-ticket 2026-07-17 (Slice 2 D1) | **07** (own panels show exact), **08**, **10** (presence assertions). |
| C03.5 | **Civilian register** (pool − serving), **동원 강도** (serving ÷ pool), and **판세** (incl. treasury uncertainty) are **derived bands with zero new dials** — each is a public term combined with an already-banded one. | 03:180–196, 248 | resolved-ticket 2026-07-17, resting on GLOSSARY seals (see C03.12) | **07** (derived meters), **10**, **12** (existing terms, not new coinage). |
| C03.6 | **Enemy treasury is ABSENT from the projection** — no number, band, or display convention. Its uncertainty survives **only as 판세 band width**. | 03:197–238, 251 | resolved-ticket 2026-07-17 (user seal); rests on 패권 결정점 seal (AGREED 2026-07-04) | **07** (no treasury field to render), **10** (test its absence), **08**. |
| C03.7 | **Enemy field-army position** = last-seen fix + age + deterministic reach cone; **border alarm** = existence + heading only (no magnitude/posture). | 03:249–250 | resolved-ticket 2026-07-17 (Slice 2 도달 원뿔 / 국경 경보) | **07** (reach-cone + alarm rendering), **08**, **10**. |
| C03.8 | **Enemy standing posture and current commit allocation are ABSENT** (categorical, 깜깜이 시장) until post-resolution reporting. | 03:108–109, 251 | resolved-ticket 2026-07-17 (Slice 2) | **07/08/10** (must remain unreachable pre-resolution). |
| C03.9 | **Seven non-leak invariants** bind every projection: (1) forbidden values absent, not concealed; (2) blur exactly once; (3) preview consumes projection only; (4) no `estimate \|\| truth` fallback; (5) missing confidence → floor band `0.45`, never truth; (6) bands never collapse (ceiling `0.90`, residual sliver); (7) bands true-containing, midpoint ≠ truth. | 03:254–270 | resolved-ticket 2026-07-17 (declared consequences of gate 02) | **10** (these ARE the information non-leak acceptance tests), **07**, **08**. |
| C03.10 | The confidence interval `[0, 0.45)` is **permanently dead**; `DECAY_FLOOR = 0.45` is the authoritative bottom of the scale (now sealed, not an unimplemented widening instruction). | 03:151–161 | resolved-ticket 2026-07-17; live code verified (`js/intel.js:17`, value exact) | **07** (no sub-0.45 render state), **10**, **06** (world init confidence). |
| C03.11 | The build must **not inherit** the three named leaks in `js/command-preview.js` (`:102–103` true zero-width band on null confidence; `:104` blur-at-read-time; `:78`/`:155–156` truth-derived forecast beside banded fields). | 03:272–287 | resolved-ticket 2026-07-17 (cited as concrete shape of invariants 1/4/5) | **09** (the port must re-implement, not translate, this shape), **10** (leak regression), **08**. |
| C03.12 | **Land-derived economy is public**: `register pool = registerPerPop × Σ populationValue` is computable from public control+terrain; only `serving` (the draw) is hidden — fog RULING ① applied to people. | 03:164–196, 245 | SEALED chain: 징집 명부 AGREED 2026-07-04 (re-founded MT-②) · capLandFrac=1 SEALED 2026-07-11 AB-② · fog RULING ① SEALED 2026-07-08 (all verified in this pass) | **06** (authored world must publish land value/yield/register pool), **07**, **10**. |

---

## Gate 04 — Toolchain coexistence (research, not policy)

Source: `.scratch/l3-playable-seam/issues/04-research-toolchain-coexistence.md`
(+ `research/toolchain-coexistence.md`). Research evidence — records constraints
and failure modes; leaves all topology/policy choices open.

| # | Constraint | Citation | Seal status | Cascade hint |
|---|---|---|---|---|
| C04.1 | The **root CommonJS package can remain intact** while a nested or explicitly-rooted Vite React-TS app runs beside it — no root `"type":"module"` flip required. | 04:21–24 | resolved-research 2026-07-16 | **05** (this is the primary input to the build/module topology choice). |
| C04.2 | Runtime `.js` needs a **nearer `"type":"module"` package boundary**, or the runtime uses `.mjs` / an ESM bundle. | 04:22–24 | resolved-research 2026-07-16 | **05** (ESM boundary placement). |
| C04.3 | **Vite transpilation requires a separate TypeScript check** — transpile ≠ typecheck. | 04:24–26 | resolved-research 2026-07-16 | **05** (a distinct typecheck command), **10** (typecheck is an explicit acceptance gate). |
| C04.4 | Current CommonJS **Node tests can dynamically import emitted ESM**. | 04:26–27 | resolved-research 2026-07-16 | **05** (test wiring), **10** (Node side of emitted-output parity). |
| C04.5 | Unchanged legacy files can be **copied via Vite public assets or a separate assembly stage**; Firebase can deploy the combined static directory. | 04:27–30 | resolved-research 2026-07-16 | **05** (asset pass-through), **11** (static hosting), **01** (keeps `game.html` deployable). |
| C04.6 | The build must have **one owner for cleaning/assembling `dist`**. | 04:29–30 | resolved-research 2026-07-16 | **05** (artifact ownership), **11** (deploy assembly); matches spec deployer US47. |
| C04.7 | **Exact browser/Node parity requires both hosts to execute the same emitted ESM** over their real loaders. | 04:29–31 | resolved-research 2026-07-16 | **10** (emitted-output parity tests — source-in-one-host ≠ parity), **05**. |
| C04.8 | The report's open Record/Working TypeScript-source mismatch was **resolved upward by ADR 0040 (2026-07-16)**: canonical L3 source = TS/TSX, browser+Node execute emitted ESM JS. Technical findings unchanged. | 04:34–38 | resolved-comment 2026-07-16 (ADR 0040) | **12** (one resolved decision already promoted to an ADR — informs the promotion scan), **05**. |

---

## Contradictions / staleness noticed

**S1 — R14 "Answered" vs. the war-model-build build evidence (the named example, CONFIRMED and central).**
`docs/DESIGN-RISKS.md` R14 is stamped **"Answered 2026-07-13 (four-survey synthesis → ADR 0037)"** but remains status 🟡 and is still an **unchecked open Next-action** ("Closes when the build implements the sealed model"; DESIGN-RISKS.md line 30 + the `[ ]` R14 item). The `docs/features/war-model-build/INDEX.md` evidence contradicts the implied closure: the build **is now complete** — tickets **01–11 all landed**, and git HEAD confirms `edd0325 "Merge: war-model slice-2 ticket 11 — stall-timer retirement"` — yet the INDEX states **"The build is complete; the seal decision is not made,"** with no-material-outcome only **80.7% → 68.7%**, the fizzle **surviving renamed**, and a **new** mechanism gap: **~18.6% of wars now simply never end** (ADR 0038's composite fires none of 격멸/수도/정착). So R14's prediction ("closes when the build lands") is falsified by the build's own measurement, and DESIGN-RISKS has not been updated. Treat R14's "Answered" as *diagnosis answered, risk not closed*. This bears directly on the spec's **"Settled-war eligibility"** constraint and gates **08** (a decisive-war path may not actually exist to build the first slice on) and **10** (acceptance cannot assume the fizzle is fixed).

**S2 — Issue 02 §5 cites tickets that have since landed (citation drift, constraint intact).**
Issue 02 (resolved 2026-07-16) justifies "no snapshot API / schemas unfrozen" by pointing to "open R14 war-decisiveness pass; **slice-2 tickets 10–11**" as still in flight (02:130). As of git HEAD those tickets have **landed** (INDEX: "01–11 ALL LANDED"; ticket-11 merge `edd0325`). The **underlying premise survives** — the war model is built but *not sealed* ("seal decision is not made"), so "freeze nothing now" still holds and constraint **C02.12 stands**. Flag as stale citation only; do not re-derive the snapshot decision from the ticket-status wording.

**S3 — Issue 03's `js/intel.js` line numbers drift ~6 lines; every VALUE is exact.**
Issue 03 cites `js/intel.js:61` for the `[DECAY_FLOOR, MAX_CONFIDENCE]` clamp (actual clamp is ~line 63, inside `_uncertainty`) and `:81` for `estimateRange(...)` (actual signature ~line 87). Verified in this pass: `DECAY_FLOOR = 0.45` (line 17), `MAX_CONFIDENCE = 0.9` (line 18), and `estimateRange` behavior all match issue 03's claims exactly. This is line-number drift, **not** a substantive contradiction — C03.10/C03.12 are grounded. Noted so downstream audits don't re-chase the offset.

---

## Things that surprised me (≤3)

1. **The spec's "known R14 placeholders" framing is already partly obsolete.** The named placeholders (stall timer, per-front uniform defense, siege conveyor) were physically **deleted/replaced** by the slice-2 build — yet the desired decisive climax still doesn't emerge and ~18.6% of wars never end. The R14 risk shifted from *"placeholders exist"* to *"the sealed model was built and still fizzles,"* which is a harder problem for gate 08 than the spec's language implies.
2. **Issue 03 builds a large 7-grade knowledge matrix with genuinely ZERO new dials** by leaning entirely on pre-existing, verified GLOSSARY seals; the only truly new decisions are §1 (control is public) and §3 (treasury absent → survives as 판세 band width). Strong single-definition discipline.
3. **Gate 04 already produced one ADR promotion** (0040) via its Comments block — a live data point for gate 12's promotion scan, before that scan has even opened.
