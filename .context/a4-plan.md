# A-4 Batch Plan (doc-debt close-out)

Written 2026-07-05. Working-layer execution spine for A-4 — order and
exit criteria ONLY. What is owed lives in `docs/SYNC-DEBT.md`; scope
details live in `.context/handoff-2026-07-05-match-arc-close.md` §A-4.
This file restates nothing; it sequences. Update checkboxes as batches
land. One batch = one commit = one resumable unit.

Ordering rationale (agreed with user 2026-07-05): pointer targets
before pointers (split before slim), clean terrain before new
authoring, mechanical registrations last.

## Batches

- [x] **B0 — this plan.**

- [x] **B1 — GLOSSARY row split** (SYNC-DEBT "Glossary row splitting").
  DONE 2026-07-05. match-arc ruling history (⑧–⑰) → new `RULINGS.md`;
  glossary rows cut to definition + current value + seal stamp with
  ruling-number citations. combat-formula GLOSSARY gained a Status
  column (AGREED / 가안 / candidate). INDEX pointers added both
  features; SYNC-DEBT struck; QUICKREF checked (definitions unchanged,
  only relocated — no term added/removed).

- [x] **B2 — DOMAIN_MAP sync + slim** DONE 2026-07-05. Match Arc
  section slimmed to qualitative + pointer (4 numeric-bloat entries cut,
  matching the Combat Resolution discipline). 5 missing terms added
  (긴급 투입/예비대, 동원 가시성, 항복 수확, 양동 후속타, 기축통화 원칙);
  부대·반도이격·도주 상태 already present. Section-level sync metadata
  added (per-entry judged over-heavy). QUICKREF got the 2 net-new terms.
  **Law-gap surfaced (per B1 precedent):** the single-definition rule
  says "definition moves to Tier-0 after promotion, Tier-1 becomes a
  pointer," but practice + B1 make the feature doc the authoritative
  home and DOMAIN_MAP a Projection *summary*. Resolved on the
  Projection-layer reading (DOMAIN_MAP summarizes; feature doc is
  truth); law wording should be reconciled — deferred to B5/ADR-sweep
  or a standalone law tweak (logged below).

- [x] **B3 — claim blocks ×12** DONE 2026-07-05. Authored into
  `operation-plan-catalog/CATALOG.md` (owning home confirmed: the
  catalog model doc, per plan; schema referenced from combat-formula
  MAGNITUDE § Authoring principle). All 12 blocks = 핵심 이득 / 핵심
  대가 / 반목표 조건 + briefing sentence + off-label cost test, derived
  from sealed material (M7 thresholds, M8 erosion, ADR 0021/0022,
  isolation gate, 항복 수확) — no new numbers invented. **Off-label
  test: all 12 pass (none dominated)** — each plan carries a defining
  zero or a unique core axis, so nothing to recut/flag. Non-combat +
  defense plans priced in their own currencies (information, state-
  removal, ground-kept, time-bought, value-denied), not R/blood —
  user-confirmed as the intended asymmetry. INDEX + CATALOG headers
  updated. No new law-gap (claim block lives in CATALOG, schema in
  MAGNITUDE — schema-vs-content split, already lawful).

- [x] **B4 — sheet-12 spec gaps → canon homes** DONE 2026-07-06.
  Canon home = `docs/features/match-arc/RULINGS.md` §SPEC_GAPS
  disposition (non-numbered decision record): each of the 7 open gaps
  routed to owning feature + B-design phase + harness candidate +
  recommended lean. All seven **defer to B** — no paper rules authored
  (honored the over-authoring warning; these are AI-behavior /
  force-allocation / map-topology, playtest- and B-map-shaped).
  Match-arc-owned: ① war appetite (queue-8, MVP AI req), ③ vassal-attack
  (identity — user-surfaced), ④ settlement initiative, ⑤ white-peace,
  ⑦ truce. Combat-formula/map-owned: ② two-front allocation, ⑧ front
  redraw (both B-map). GLOSSARY queue-8 + combat-formula INDEX Honest
  Gaps cite the record; SYNC-DEBT struck → Paid.

- [x] **B5 — ADR sweep** DONE 2026-07-06 (two commits). Part 1:
  amendment-carrying headers normalized to the law's structured fields
  (0014/0015/0018/0020) + 26-row status index in `docs/adr/README.md`
  with law pointer; plain-Accepted ADRs carry no relationship field
  (index is their normalization surface). Part 2: **ADR 0019 amended in
  place (user-approved)** for the v5 front-sector pass — posture →
  pure annotation lens (overview salience/recommendation retired),
  dissonance → leak-through (LEAK_RATIO 1.5), recommendation → summoned
  work surface, unified 지목→소환→봉인 grammar; reading model unchanged.
  DOMAIN_MAP `Situation judgment` synced (reachable-weakest-link one-liner
  folded into the 방어 lens). **SPEC re-read → already consistent
  (posture = analysis guidance; preset-first floor survives via work
  surface) → no SPEC change** (more honest than forcing a Direction-layer
  edit). README 0019 row + SYNC-DEBT updated.

- [x] **B6 — registration sweep + P2 decisions** DONE 2026-07-06.
  (a) Parking place = new `docs/DISPLAY-DEBT.md` (single docs/ register,
  symmetric with SYNC-DEBT — chosen over per-feature INDEX so the family
  reads as one). 7 display debts registered (projectable-mass legibility,
  expansion break-even, hegemony work-list, intent-scout/hollow-province,
  command-card IA, reachability filter, economy-legibility) — pointers
  to birthplace, design deferred to B. Economy-legibility relocated from
  SYNC-DEBT.
  (b) P2 adoption (user decisions): **L-level seal stamps ADOPTED** —
  codified into documentation-law § seal mechanics (optional stamp,
  going-forward, retrofit optional). **docs:check lint + Working-layer
  sublabels DEFERRED** (user) — moved to a SYNC-DEBT "Deferred" section
  with revisit triggers.
  Law-gap (B6): DISPLAY-DEBT.md is a new tracked ledger → codified into
  the law's Working-layer taxonomy row (sibling of SYNC-DEBT; registers
  point to birthplace, never redefine). **A-4 CLOSED.**

## Law-gap log (per-batch findings for the law)

Findings from the per-batch law-gap check. Codify into
`documentation-law.md` when the batch that owns the fix runs, or as a
standalone tweak.

- **B1:** RULINGS.md file role + RULINGS→ADR promotion ladder →
  CODIFIED into documentation-law.md (2026-07-05).
- **B3:** none. Claim blocks live in CATALOG (Production model doc),
  schema in MAGNITUDE — the schema-vs-content split is already lawful.
- **B4:** none codified. A prototype (Working layer) surfacing spec
  gaps that need canon homes is already covered by the SYNC-DEBT ritual
  (unrecorded debt = violation) and the mechanical-seal definition
  allows dated deferrals. B4 established a *routing* convention —
  "prototype-surfaced spec gaps get a disposition record (owning feature
  + design phase + candidate + lean), not silent carriage in the
  prototype; B-inputs interim-home in the surfacing feature's RULINGS
  until B gets a feature dir." This is a routing choice, not a
  law-level convention; **WATCH, do not codify on first instance**
  (emergence-limit) — promote to law only if a second prototype
  surfaces B-inputs the same way.
- **B5:** none. The ADR supersession protocol already covered header
  stamps; the sweep applied it. The "index is the normalization surface
  for plain-Accepted ADRs" reading is an application of the existing
  anti-noise / always-load economics principle, not a new convention.
- **B6:** CODIFIED. `docs/DISPLAY-DEBT.md` is a new tracked ledger not
  named in the Working-layer taxonomy → added to the law's Working-layer
  row (sibling of SYNC-DEBT.md; debt ledgers are registers that point to
  birthplace, never redefine). L-level stamp convention also codified
  (§ seal mechanics).
- **B2:** the Vocabulary Law single-definition rule reads "Tier 0 after
  promotion — the Tier-1 row then becomes a pointer," which would make
  the feature GLOSSARY a pointer and DOMAIN_MAP the definition home.
  But the Projection layer is defined as "stable *summaries* of sealed
  truth," and B1 made the feature GLOSSARY the rich authoritative home.
  These conflict. Working resolution: DOMAIN_MAP (Projection/Tier-0) is
  a qualitative *summary* + pointer; the feature GLOSSARY/RULINGS is the
  single authoritative definition+value+history home. The law wording
  should be reconciled to say promotion grants a Tier-0 *summary entry*,
  not a definition transfer. → CODIFIED into documentation-law.md
  (2026-07-05): single-definition rule rewritten around "birthplace =
  authoritative"; DOMAIN_MAP is a summary for promoted terms and the
  authoritative home only for project-native terms; promotion adds a
  summary entry, never moves the definition. Reconciles B1 + B2 under
  one principle.

## Standing rules for every batch

- **Law-gap check** (user-directed 2026-07-05): B1–B6 are doc-processing
  work, so each batch may create or rely on a convention the
  auto-loaded law (`documentation-law.md`, AGENTS/CLAUDE.md) does not
  yet state. At each batch end, ask "did this introduce/depend on an
  unstated convention?" and codify it into the law (Tier-2 rules
  update; propose to user if it reshapes the constitution's taxonomy).
  B1 precedent: RULINGS.md file role + RULINGS→ADR promotion ladder.
- Run the documentation-law session-close ritual at each batch end
  (QUICKREF regen only when definitions/seals moved).
- Structure closes autonomously; any number/identity question surfaces
  to the user immediately — never batched silently.
- If a batch outgrows its session, update this file's checkbox state +
  a one-line "stopped at" note under the batch; the next session
  resumes here, not from a rewritten handoff.
