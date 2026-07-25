# Handoff — L3 Wayfinder Gate 08 (First Playable Vertical Slice), post-pivot

Date: 2026-07-25. Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`.
Prior session landed the 1v1 duel-pivot **SPEC amendment** (adversarial grill +
verbatim apply) and unblocked this gate. Commits: `b04bc9b` (SPEC E1–E12 +
doc-sync) + `9298610` (diplomacy-residue debt + gate-08/map pivot stamps).

This session's job is ONE thing: **run L3 Wayfinder gate 08.**

## The job

Close **gate 08 — "Define the First Playable Vertical Slice"**
(`.scratch/l3-playable-seam/issues/08-define-first-playable-vertical-slice.md`).
It is the **last real grill gate** of the L3 Wayfinder (05/06/07 sealed; 09–12
were demoted/split by the 2026-07-17 audit). Closing it — plus the light 09–12
residue — is the gate before *feature specs → build tickets*.

## Do this FIRST — re-cut the gate against the pivot (do not skip)

The gate issue was drafted **pre-pivot**. Its Decision constraints still
reference the **superseded** war-ending model (ADR 0038 three-channel composite,
the R14 fizzle placeholder, the hegemony/composite win-check). The 1v1 pivot
(ADR 0042) makes **capital fall the sole win condition** and discharges the
war-termination long pole *structurally* (1v1 + mutual-exposure + land-derived
decay). A **pivot-caveat banner is already at the top of the gate-08 issue**
(added last session) stating exactly this, with a read-order add.

Before grilling: **re-cut the gate's constraints and option space against ADR
0042**, mirroring the 2026-07-17 audit's re-cut discipline (do not silently trust
the pre-pivot framing — that is the exact trap the audit caught). The pivot
*sharpens* the slice: the stopping point is now cleanly **"a capital falls."**

## Read order (all by reference — do not restate here)

1. Gate issue + its caveat banner: `.scratch/l3-playable-seam/issues/08-define-first-playable-vertical-slice.md`
2. `.scratch/l3-playable-seam/map.md` — § *Gate re-cut (2026-07-17)*, § *Decisions so far* (05/06/07), and the new *"↳ RESOLVED by pivot"* stamp on the war-termination section.
3. `.scratch/l3-playable-seam/ledger.md` — the 41 sealed constraints (the baseline; consult before treating anything as open).
4. Pivot: `docs/adr/0042-duel-victory-capital-fall.md` + `docs/features/capital/` (CP-②, GLOSSARY/RULINGS).
5. Duel-pivot gates 1–6 (turn structure, EVAL BAR, capital-fall mechanics): `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` + `duel-pivot-premises.md`.
6. Amended `SPEC.md` — Positioning, Principle #5, Match structure, Fun Pillars (landed last session).
7. Gate 07 substrate (the slice's UI/interaction skeleton): `docs/features/fog-of-war-discovery/RULINGS.md` ② + throwaway prototype `mockup/combat-calc/turn-loop-prototype.html` (commit-first skeleton, eval-bar encoding, coupled continuous camera).
8. Memory: `terrain-game-duel-pivot`, `terrain-game-l3-wayfinder-gate07`.

## Gate 08's core question + option space (in the issue — read, don't re-derive)

Which exact player journey proves the authored world + Slice 1–2 war engine +
Standard Fog + React UI + Game Runtime are genuinely *joined* (not scaffolded)?
Fix: match mode, starting state, commands, feedback, turn progression, bot
participation, stopping point. Options in the issue: **A** reconnaissance-first
cycle · **B** settled atomic-combat cycle · **C** full turn/match immediately.
Standing constraints: cross the sealed Runtime seam; functional fog observable
(no dev-disclosure/truth-fallback); no standalone move command
(`DOMAIN_MAP.md:245-255`); no legacy last-faction/70%-hex win-checks
(`js/game.js:448-465`); independently demoable + small for one fresh context.

## Agent's note on how the pivot moves the option space (verify in grill, do not pre-seal)

- The slice **stopping point** is now crisp — a capital falls (or a clean partial
  that still proves the seam), replacing the old composite/hegemony terminus.
- Option **B** (atomic combat) gains a natural terminus (capital sector + guard),
  and the sealed per-sector 4-layer combat still needs implementing against its
  contract for the slice.
- The "must not exercise the R14 placeholder" constraint needs **reinterpretation**:
  the *fizzle* is resolved structurally by the pivot, but that is a match-frame
  fact, not a claim that the war engine is implemented — the slice still depends
  only on war behavior actually built against the accepted model.
- The EVAL BAR (판세) read + commit-first skeleton from gate 07 is the feedback
  organ the slice should exercise.

## After gate 08 (context, not this session's work)

09–12 are demoted/split (see `map.md`): 09 = classification folded into 08's
slice work; 10 = L3 verification-gate judgment (who judges the human rung /
admission-vs-verdict); 11 = archive-freeze residue (ADR 0041 voided most of it);
12 = (a) governance batch [BLOCKED by `doc-structure/issues/10`] + (b) mechanical
ticket re-pointing. Then feature specs → `.scratch/l3-playable-build/` (9 tickets,
`needs-info` until gates close; `README.md` = execution protocol).

## Session mechanics

- **Wayfinder rule** (`map.md` § Notes): `grilling` + `domain-modeling`, **one
  question at a time, user seals every gate** (not overridden). Prototype
  sub-questions use `prototype` + live user reaction.
- **Voice:** Korean 존댓말 (해요체); artifacts neutral professional English.
  Grilling suspends the soft register — announce the switch, restore after.
- **git:** `/usr/bin/git`; bare `git log` unreliable here (use `rev-parse` /
  `show -s`). Docs/seal commits go directly to `main` (repo convention);
  `.scratch/l3-playable-seam/` IS tracked. Leave the unrelated landing edits
  (`css/landing.css`, `game.html`, `index.html`, `js/landing.js`) untouched.
- **Tool gotcha:** `rg` gives **false negatives** on recursive `.`/dir scope in
  this repo (RTK rewrite hook); use coreutils `grep -rn` for existence checks
  (memory `harness-rg-false-negative`).
- **lint:** `npm run lint:docs` (5 `ledgerCurrency` advisories are known noise).
- **doc law:** `DOCUMENTATION-LAW.md` — ticket answers are Working-layer evidence;
  cross-feature architecture decisions promote via the ADR supersession protocol
  when specs are authored.

## Suggested skills

- **`grilling`** — the gate is a grilling ticket (adversarial, one question at a time). Primary tool.
- **`domain-modeling`** — pair with grilling per the map's decision-session rule; also for any term registration.
- **`prototype`** — if the slice definition needs a live sanity-check (option C / full-loop feel), on a throwaway prototype with live user reaction.
- **`doc-audit`** — at close, if the session touched DOMAIN_MAP / GLOSSARY / SYNC-DEBT (documentation-law ritual duty 7).
- **`final-check`** — at session close: coverage audit of everything the user asked for.
