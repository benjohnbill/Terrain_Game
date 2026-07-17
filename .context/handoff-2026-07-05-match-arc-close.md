# Handoff: Terrain Game — Match-Arc Pass → Paper Close-out (A-1 grill first)

Date written: 2026-07-05, extended 2026-07-06 (A-4 COMPLETE).
Project: /home/benjohnbill/dev/Terrain_Game (branch: main, workspace
CLEAN — A-4 fully committed. B4 3644b1e, B5 b2c7f44 + 11214d9, B6
1a2ff81, INDEX refresh follows. Untracked docs/teach/ and .context/ are
the user's own; leave them alone.)

## ⇢ NEXT SESSION STARTS HERE — B (terrain-cradle map authoring)

**A-4 (doc close-out) is COMPLETE — all six batches B1–B6 landed.** The
paper close-out (A-1→A-4) is done: match-arc core sealed, combat formula
+ economy sealed, all doc debts paid or dispositioned. The next thread
is **B — the playable slice, starting with terrain-cradle map
authoring** (no map, no slice). B carries: the ruling-⑰ seat-sizing
constraints, the 7 SPEC_GAPS deferred to B (`match-arc/RULINGS.md`
§SPEC_GAPS disposition — AI war appetite, two-front allocation,
vassal-attack, settlement initiative, white-peace, truce, front redraw),
the display-debt family (`docs/DISPLAY-DEBT.md`), and the undesigned B
inputs in § B below. Read `.context/a4-plan.md` for the A-4 batch record
(all boxes checked) and its law-gap log.

### A-4 recap (COMPLETE 2026-07-06)

- **B4** — 7 SPEC_GAPS given canon homes: disposition record in
  `match-arc/RULINGS.md` (§SPEC_GAPS disposition), all defer to B; no
  paper rules authored (over-authoring warning honored). Gap ③
  vassal-attack flagged identity → B/playtest.
- **B5** — part 1: ADR header normalization (0014/0015/0018/0020) +
  status index in `docs/adr/README.md`. Part 2: **ADR 0019 amended**
  (user-approved) for v5 front-sector — posture → pure annotation lens
  (overview salience/recommendation retired), dissonance → leak-through
  (LEAK_RATIO 1.5), recommendation → summoned work surface, unified
  지목→소환→봉인 grammar; reading model unchanged. DOMAIN_MAP synced;
  SPEC re-read → already consistent → no SPEC change. **Owed follow-up:
  js/situation.js game-code rework to match the v5 amendment** (front-
  sector-drill deferred item).
- **B6** — `docs/DISPLAY-DEBT.md` register created (7 display debts,
  pointers only, design deferred to B); L-level seal-stamp convention
  ADOPTED into the law; docs:check lint + Working-layer sublabels
  user-DEFERRED. A-4 CLOSED.

## (historical) A-4 batch B4 opener — now done

Done so far (all committed): **B1** glossary row split — match-arc
ruling history ⑧–⑰ moved to new `docs/features/match-arc/RULINGS.md`,
glossary rows cut to definition+value+stamp, combat-formula GLOSSARY
got a Status column; codified the RULINGS file role + RULINGS→ADR
promotion ladder into `documentation-law.md`. **B2** DOMAIN_MAP slim +
sync — Match Arc section cut to qualitative+pointer, 5 missing terms
added; reconciled the single-definition law around "birthplace =
authoritative" (DOMAIN_MAP summarizes, feature doc is truth). **B3**
all 12 operation-plan claim blocks authored in CATALOG.md (off-label
test passed for all — none dominated).

Two governance principles were set this run and belong to every future
doc batch (both in `a4-plan.md`): (1) **per-batch law-gap check** —
each doc batch asks "did I create/rely on a convention the law does
not state?" and codifies it; (2) **birthplace = authoritative** — a
term's full definition lives at the tier where it is worked; every
other surface (DOMAIN_MAP-for-promoted-terms, INDEX, QUICKREF) holds a
summary+pointer, never a copy.

## Where we are

The match-arc thread opened and largely sealed across 2026-07-03/04.
Read these in order — they ARE the session's product; do not trust this
summary over them:

1. `docs/features/match-arc/GLOSSARY.md` — every sealed term: 결정점
   (settlement-negotiation trigger, never auto-end), hegemony check
   (shield-ratio arithmetic: leadership + unassailability, 투사 가능
   질량 membership, 은둔국 조항), 정산 layer (통화 3종 / 도달권 pricing
   / 수락 산술), 모병/인력 풀, frame decisions (full adjacency, realms
   4–6 default 5, small-중원 asymmetry, arc = 2–3 wars as budget), UI
   surface direction, and the open-questions queue.
2. `docs/features/match-arc/STRATEGY-SPACE.md` — 6 winning archetypes;
   standing role: **dial checklist** ("which archetype does this
   kill?") for every future value decision.
3. `docs/features/combat-formula/MAGNITUDE.md` — M12 now CONFIRMED
   (tempo gate met), M13 economy→mass confirmed (single-track 모병
   +10%/turn @100%, finite pool ×1.5, cap 6,000, 부대 = 0.5 yield;
   동원 is a reserved seat — a 75% levy tier was REJECTED as a back-door
   quality tier vs sealed quality=1).
4. `mockup/combat-calc/` — throwaway calculator (PROTOTYPE, not wired
   to game code): `npm run battery` runs 9 sheets; NOTES.md holds the
   day-1 findings. Sheet 7 = war tempo (11 turns), sheet 8 = 23-turn
   one-nation timeline (35–46 min), sheet 9 = M13 validation.

Memory `terrain-game-match-arc-pass` (auto-indexed) compresses the same
state.

## The agreed plan: revised A → B

**A (paper close-out, ~2–3 sessions) then B (playable slice).** Blinds
and loser-experience deliberately WAIT until after B's playtest — they
are playtest-shaped questions. User has agreed to this order.

### A-1 — pending-ruling grill — ✅ COMPLETE (2026-07-05, all 8 sealed)

All eight rulings sealed and committed (5bbfafd; sibling doc-sync in
94ccef0). Verdicts: findings 1-4 in `mockup/combat-calc/NOTES.md` §User
verdicts; ⑤ in GLOSSARY 복속 row (4-line terms incl. chain collapse);
⑥ in MAGNITUDE M9 (50% confirmed, 1 pt = 12.5% province awakening,
province ∧ route-connected); ⑦ in ADR 0015 (0.55 confirmed); ⑧ in
GLOSSARY 정산/정산 통화/수락 산술 rows (3-preset ladder sealed,
composite reach defined, vassalage decoupled — Codex-consulted;
numbers 가안 → sheet 11). Memory `terrain-game-match-arc-pass` has the
full A-1 summary. NEXT SESSION STARTS AT A-2 (sheets 10 + 11 below).
The original queue is kept below for reference only — do not re-rule.

Grill style: one ruling at a time, recommendation first, altitude
before detail. The queue (contexts in `mockup/combat-calc/NOTES.md`
findings 1–4 and GLOSSARY rows):

1. **DP one-click demolition** (start here; recommendation: ACCEPT
   as-sealed). At R ≥ ~1.9 one DP siege turn inflicts 30%+ and routs
   the garrison out of its own fortress; erosion pacing only governs
   R ≈ 1.1–1.7. Recommended reading: overwhelming sieges historically
   ended fast; dress it in display language ("수비대 와해·성 포기").
   Alternative (rejected by me, user may differ): rout-conversion
   exemption for walled garrisons — cost: reopens M4's "rout is
   organizational" interpretation.
2. **Strait-choke absolutism** (명량 sheet): strait 500 × legendary
   2.5 × opposed 0.55 lets ~1–1.5 부대 deny the headline vs 13,300.
   Question: acceptable (removal paths carry counterplay — port
   staging, navy) or is cap + legendary terrain a double-count at
   authored sites? My lean: accept, but authored legendary chokes
   should be RARE and their removal paths mandatory-authored (M11
   already requires this).
3. **Siege blood rate**: DP besieger bleeds 12%÷R^1.4 of his WHOLE army
   per turn (24% of 6,000 to open one fortress) + the inversion (higher
   commit → higher R → LESS siege blood — consistent with the grinding
   firewall). Needs a "felt" yes/no from the user.
4. **Delaying + fortification**: does a delaying defender keep the fort
   multiplier? Battery assumed NO (refusal abandons the works).
5. **Vassal permanence (MVP)**: can a vassal defect before Phase 2
   betrayal exists? Recommend: permanent within the match (one line,
   STRATEGY-SPACE gap 2).
6. **Reserve open dials (M9)**: forced-march 50% (가안); points→units
   ratio (UNDEFINED — how many 부대 does one reserve point order?);
   range = province-bounded vs route-distance.
7. **Opposed strait 0.55** — candidate → confirm or drop to 0.70.
8. **Acceptance personality coefficients** (0.8/1.0/1.2 가안) and
   **settlement preset bundle contents** (관대/표준/최대 composition).

### A-2 — ✅ COMPLETE (2026-07-05 afternoon session, rulings ⑨–⑭)

Sheets 10 (hegemony ledger, trips T22, envelope ✓) and 11 (settlement
acceptance, registered bar passes) built and run; S6 re-run under the
ruling-⑥ schedule validated. Six rulings sealed — full verdicts in
`mockup/combat-calc/NOTES.md` §User verdicts (2026-07-05 run):
⑨ shield mass = field + FACING-front border garrisons (derived per
turn from adjacency); ⑩ choke projection flow 2, floor 1,000;
⑪ regeneration window W=6 (time depth of "irreversible");
⑫ resistance discount 0.6 on continued-war loss; ⑬ lenient =
tempo-peace preset (acceptance-certainty product); ⑭ vassalage priced
in acceptance currency via sovereignty premium — STRUCTURE sealed,
premium value 0.25 stays 가안 gated on sheet 12/playtest.
Also adopted: **Domain Terminology Policy** (AGENTS.md — standard
English identifiers canonical, [조어] tag duty); **test-trust ladder**
L0 hand reasoning / L1 decision grids / L2 match tournament (MISSING) /
L3 playtest. **Vocabulary work COMPLETED same session (01e9e96)**:
Vocabulary Law written into DOMAIN_MAP.md (tier ladder 0/1/2,
single-definition rule, English-canonical naming, promotion rule) —
this pulls the terminology part of A-4 forward; DOMAIN_MAP match-arc
rows synced with the A-2 seals (stale 복속 loser-side phrasing
corrected); `docs/GLOSSARY-QUICKREF.md` generated (regenerate at every
seal batch — a standing session-close duty).
**Documentation & Terminology Law ADOPTED (2f0be30, user-directed 5
points)**: `.claude/rules/documentation-law.md`, auto-loaded via
project CLAUDE.md @import — layer taxonomy (Direction/Projection/
Record/Production/Working/Sanctuary), conflict rule (dated seal wins;
SPEC exempt), ADR supersession protocol (bidirectional stamps), the
consolidated Vocabulary Law, and the SESSION-CLOSE RITUAL (NOTES sync
→ doc-sync batch → INDEX refresh of touched features → QUICKREF
regen → ADR stamps). AGENTS/DESIGN/DOMAIN_MAP cut to pointers.
match-arc/INDEX.md created (was missing). Future sessions MUST run
the ritual at close — combat-formula/INDEX.md refresh is due the next
time that feature is touched.
**Codex governance audit (2026-07-05, session 019f3183…, ~203k
tokens): verdict ADOPT WITH FIXES.** Cheap fixes applied same session
(dial-ownership wording, mechanical seal definition, QUICKREF honesty,
ledger); the retrofit queue (ADR header sweep + index, glossary
definition/ruling split, DOMAIN_MAP slimming + sync metadata, term
lifecycle + aliases, seal registry decision, L-level seal stamps)
lives in **`docs/SYNC-DEBT.md`** — the tracked ledger that is now
ritual duty 6. Work it during A-4 or opportunistically per feature
touch; do NOT let it block sheet 12.

**~~battery sheet 12~~ — ✅ COMPLETE (2026-07-05 evening session,
rulings ⑮–⑰, commits 0c88ac6 + 953a249).** `tournament.js` built
(semi-durable balance rig); 360 seeded matches/world. Sealed: ⑮ cap
growth = the match-closure lever (canon static-cap world 96% timeout —
structure sealed into MAGNITUDE M13, numbers → A-3, sheet-12 re-run
owed at priced values); ⑯ sovereignty premium 0.25 + floor-setter
rider (above 0.25 acceptance saturates; chain-weakening handle =
capital-risk side); ⑰ seat sizing (all-cap start must not satisfy
leadership — B authoring constraint; small/hermit L2 losing record
accepted, L3 watch). Temperament neutrality PASS. **L2 charter
(user-directed) → `docs/features/match-arc/TEST-LADDER.md`**: asymmetric
proof rule, placeholder table (opportunism read=fog/scouting proxy,
idle aggression=blinds proxy), blinds acceptance test (board must move
without the placeholder), archetype pre-screen reading rule;
test-trust ladder promoted to Tier 0. AI war appetite (GLOSSARY queue
8) confirmed LOAD-BEARING; 8 spec gaps → tournament.js §SPEC_GAPS +
SYNC-DEBT entry (need canon homes during A-3/A-4). SYNC-DEBT rider:
the seal-registry decision (SEALS.md yes/no) fell due at this batch —
user has not decided.

**~~A-3~~ — ✅ COMPLETE same day (see §A-3 below; M14 + land-derived
principle + rulings ⑱–㉑). NEXT SESSION OPENER — A-4 (doc debts, §A-4
below)**, which now also holds: the sheet-12 spec gaps needing canon
homes (SYNC-DEBT), the economy-legibility display debt, and the Codex
retrofit queue. After A-4 → B (terrain-cradle map authoring — carries
the ruling-⑰ sizing constraints). Read TEST-LADDER.md before citing
any L2 number.

### (superseded original A-2 spec below — kept for the sheet-10/11 details)

### A-2 (original) — hegemony-check battery sheet

The decision-point formula has NEVER been computed end-to-end: sheet
8's T22 "irreversibility trips" is a hand-written line. Build sheet 10:
a 5-realm full-match ledger (masses, shields, pools, vassalage from
war 1) that computes leadership + unassailability each turn and shows
WHEN the check trips. Validates: the ~1.7 reuse, regeneration-window
length, 투사 floor 1,000, and "unreachable from parity start in a
single war." Extend `mockup/combat-calc/` (prototype skill discipline:
pure engine additions + battery sheet).

Also owed to A-2 (registered 2026-07-05, Codex-consulted spec):
**battery sheet 11 — settlement acceptance.** Generate 30–50 war-end
states (reach value, expected continued loss, capital-in-reach,
remaining coalition mass, turns-to-regenerate); output per preset:
accept/reject, accepted value, expected turns saved, hegemony delta,
archetype benefit. Metrics: preset pick rates, dominated-preset rate
(관대 must beat 표준 EV via turns saved often enough, else relabel it
a tempo-peace preset), temperament acceptance gaps, Maximum-ends-match
frequency. Pass/fail: conciliatory-target Maximum acceptance > 40–50%
= FAIL (lower threshold once capital-in-reach vassalage is included).
Run decoupled comparisons: same claim rate with different fill orders
(claim rate vs currency composition must be separable in the data).
Vassalage pricing (now decoupled from Maximum) is an open input this
sheet must propose. Same batch: re-run S6 under the ruling-⑥ reserve
movement schedule (1 pt = 12.5% province awakening). Archetype watch
in outputs: raid-attrition (관대 over-efficiency turning burning into
quick cash-outs) and vassal-chain (cheap capital-reach vassalage
overpowering).

### A-3 — ✅ COMPLETE (2026-07-05 night session, rulings ⑱–㉑ + M14)

Commits 0e6955b (econ.js + sheet 13) + 87fc5af (doc batch). Sealed:
**M14 thin economy** in MAGNITUDE.md — yield (생산, the 기본 생산량)
unit; income & national cap DERIVED from sector values × usable
(capPerPop 600 re-derives the M13 anchors 6,000/9,000 as computed
values); treasury (배상 lands as cash — spec gap 6 paid); fort prices
(fieldworks 2y+1pr…legendary 30y+8pr, flat blood-EV 27–30명/생산 —
the A-1 fortification-vs-recruitment target and STRATEGY-SPACE #5
both PAID); development (1pr+4y → +0.5/+0.5 once per sector).
**Tier-0 design principle adopted: land-derived state (모든 것은
땅에서 파생된다)** — DOMAIN_MAP §Design Principle, with the
command-pool exception and the muster-geography reserved seat.
Ruling-⑮ re-run duty paid at candidate values (27% closure, spread
intact) — re-run again if M14 numbers move. **A-3 epistemic rider
(user)**: seals accepted while the economy is not yet FELT — numbers
now, L3 revises; economy-legibility UI surface registered in
SYNC-DEBT. Seal registry DECIDED: no SEALS.md (ledger + stamps stay).

### A-4 — doc debts (6-batch plan; spine = `.context/a4-plan.md`)

- ✅ **B1** glossary row split + RULINGS file role + law codification.
- ✅ **B2** DOMAIN_MAP slim + sync (5 terms added) + single-definition
  law reconciled (birthplace = authoritative).
- ✅ **B3** 12 operation-plan claim blocks (CATALOG.md; none dominated).
- ⬜ **B4 (NEXT)** — sheet-12 spec gaps → canon homes. Source list:
  `mockup/combat-calc/tournament.js` §SPEC_GAPS (7 open — indemnity
  spend already paid via M14). Each gap needs a canon home (GLOSSARY
  row / ADR / explicit B-map-requirement row) or a dated deferral.
  Watch: AI war appetite + front redraw likely resolve to B-map
  requirements, not rules — do not over-author.
- ⬜ **B5** — ADR header normalization sweep (27 ADRs, Status/Supersedes/
  Amended-by + status index in `docs/adr/README.md`) + **ADR 0019
  amendment for v5 front-sector — ASK USER FIRST** (carries the v5 doc
  debts: spec update, DOMAIN_MAP reachable-weakest-link one-liner).
  Independent of B4; ctx-heavy (27 files).
- ⬜ **B6** — display-debt registration (the riders below + economy-
  legibility surface — registration only, design is post-B-map) + P2
  adoption decisions (L-level seal stamps, `docs:check` lint,
  Working-layer sublabels — USER DECISIONS). Closes A-4.

Display-debt riders to register in B6 (design deferred post-B-map):

Carried from the 2026-07-03 handoff §5 (recovered by final-check — do
not drop again): **intent-scout display details** (M10's recon/intent
pair, alignment with the fog thread) and **command-card IA session
items** (log-space presentation, readiness branch line, own tension
band display). Both are display-design debts, not dial questions.
User rider on the intent-scout item (2026-07-05, from ruling ⑥): now
that reserve range is province-bounded, province-scale reads matter —
scouting should support estimating what fraction of a province's
stock is committed at the front (the hollow-province read that prices
conquest value: "if most of their province stands in front of me, a
bloody win takes little").
Second user rider (2026-07-05, from ruling ⑨ / A-2 session):
**expansion break-even card** — a fog-banded, summoned estimate of
whether a conquest pays (value side: target pool/yield via reach
arithmetic; cost side: new front length + new neighbors' facing
strength under the facing-front shield reading). Scouting narrows the
band (border strength = stable scoutable target; field-army location =
lucky catch), raising scouting's value beyond map fill. Same family as
the hollow-province read; display-debt, post-B-map. Full verdict text:
mockup/combat-calc/NOTES.md §User verdicts (2026-07-05 run).
Third rider (2026-07-05, from ruling ⑪): **hegemony work-list card** —
when the decision-point check fails, the summoned card names WHICH
realm's open future blocks the trip and the closing means (복속 / pool
destruction / conquest); the system calls for the hegemon's action
instead of predicting it. Also registered: **reachability filter** on
coalition sums (the sealed word "reach" licenses route/distance
attenuation once B's map exists — prototype sums globally).

### B — playable slice (after A)

Starts with terrain-cradle map authoring (no map, no slice). Registered
but undesigned inputs that B will need: AI-vs-AI war behavior (GLOSSARY
queue 8), showdown staging (queue 9 — carries both 매드무비 feel and
ADR 0021 loss-lesson), turn-time budget (the 1.5 vs 2.0 min/turn hinge
— sheet 8: 35 vs 46 min).

## Method notes that worked (keep)

- Worked sheets over isolated numbers; real-history cases when abstract
  tables don't land (삼전도/전연의 맹/시모노세키/임진왜란 결렬 sold the
  settlement pricing).
- Reuse-before-build kept winning: hegemony check reuses the 1.7 shield
  ratio; 배상 reuses raid loot; 투사 floor reuses the raid visibility
  threshold; recruitment reuses the +10% regen grammar. Before any new
  dial, look for an existing one.
- Self-rejection is welcomed: the 동원 75% track was killed by checking
  it against sealed quality=1 — the user responds well to "my own
  proposal fails our own filter."
- Delegation boundary unchanged: structure may close autonomously;
  numbers and identity decisions are the user's. When a user doubt
  arrives ("굳이 필요할까?"), steelman it before defending.
- The user pivots mid-grill to altitude questions (tempo, PVP, fun) —
  follow the pivot, then RETURN to the pending ruling; day-1 findings
  ①–④ went unruled for two days because I didn't re-surface them.

## Conversation mode (unchanged)

Korean 존댓말, 오라버니 (Lotte persona); artifacts neutral English;
grill style — one ruling at a time with recommendation, altitude first;
every reply ends with the two-line closing block (› 한 일 / › 다음).

## Suggested skills

- `grilling` — A-1 is a pure ruling queue.
- `prototype` — for A-2's sheet 10 (extend mockup/combat-calc/, keep
  the throwaway discipline; LOGIC.md branch).
- `claude-mem:mem-search` — past context beyond the memory index.

## Suggested opening move (updated 2026-07-05 after A-1 completion)

Start at A-2 with the `prototype` skill discipline: extend
`mockup/combat-calc/` with sheet 10 (hegemony-check full-match ledger —
validates the ~1.7 reuse and the 1,000 projection floor, both still
observed-not-validated values) and sheet 11 (settlement acceptance —
full Codex-consulted spec in §A-2 above, including the
conciliatory-Maximum ≤40-50% pass bar and decoupled rate-vs-fill
comparisons). Same batch: re-run S6 under the new reserve movement
schedule (1 pt = 12.5% province awakening). Number rulings that fall
out of the sheets go to the user; structure closes autonomously.
