# Handoff — GRILL THE SPEC AMENDMENT (1v1 duel pivot)

Date: 2026-07-24. Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`.
Prior session: ran the full duel-pivot documentation cascade (2 commits,
`6ce8895` anchor + `53e75d8` Projection/reseal/proposal). This session's job is
ONE thing: **grill the user on the SPEC amendment proposal before it is applied.**
The user has fixed on grilling; they chose a fresh session for clean context +
author-distance (the prior agent wrote the draft).

## The job

Run the **`grilling` skill** with the user as defender. Target = the SPEC
amendment proposal `docs/features/capital/SPEC-AMENDMENT-DRAFT-duel-pivot.md`
(11 contradictions + 4 sharpenings, each `current → proposed`). Stress-test it,
then — only on the user's seal — apply the approved items to `SPEC.md` verbatim,
stamp the draft SEALED, and pay the SPEC SYNC-DEBT row.

**Grilling is adversarial** — the skill suspends the soft register. Surface the
transition before entering, return to default after (global CLAUDE.md § Skills).

## The framing that makes this grill legitimate (read carefully)

- **SPEC is Direction; it is NOT bound by gate seals.** The documentation-law
  conflict rule exempts SPEC ("direction is not outrun by seals"). So this grill
  MAY push UP into the pivot's identity claims — it is not confined to "did the
  wording transcribe the gates faithfully." Identity-level pushback is the point.
- **BUT the six design gates ARE sealed** (capital, fall, draw/timeout, crisis,
  match-arc, turn structure — ledger, user-sealed one node at a time). The grill
  does not casually re-open them; it tests whether the SPEC-level *identity
  claims* are honest and wise. If the grill genuinely cracks a gate, that is a
  real finding (SPEC sits above gates) — but the bar is high, and the default is
  that the gates hold.
- **Tier-3 discipline:** never drift SPEC. Proposal → user seals item by item →
  apply verbatim in one batch. Mirror the crisis-ending amendment's flow
  (`docs/features/match-arc/SPEC-AMENDMENT-DRAFT-crisis-ending.md` was applied
  that way).

## Read order

1. `SPEC.md` — the current text being amended (esp. § Goal, § Core Gameplay
   Promise, § Core Design Principles #2/#5/#8, § Positioning and Fun Pillars,
   § Match structure, the "Resolved / Domination victory / How a match ends"
   blocks, § Phase 2 diplomacy).
2. `docs/features/capital/SPEC-AMENDMENT-DRAFT-duel-pivot.md` — the proposal
   (C1–C11 + S1–S4).
3. `docs/adr/0042-duel-victory-capital-fall.md` — the anchor: what the pivot
   sealed and why (supersession reasoning).
4. `.scratch/l3-playable-seam/duel-pivot-premises.md` + `duel-pivot-draft-ledger.md`
   — the sealed gate decisions the SPEC is transcribing (P1/P2/P3 + gates 1–6).
5. Memory `terrain-game-duel-pivot` (carries the cascade-landed state).

## Adversary's opening threads (seed the grill — do NOT hand these to the user as a checklist; use them to attack)

These are the proposal's soft spots the prior author already suspects. A real
grill will find more.

1. **"Anti-fizzle is structural" as SPEC identity (C3/#5, C10).** The proposal
   writes into SPEC that stalemate is "prevented structurally." But the ledger
   (D3.2) sealed this at **L0/L1** and explicitly DEFERRED any forced-termination
   device behind L3 measurement. Is it honest to assert an unproven mechanism as
   *identity* (the always-true layer)? Or should #5 assert only "capital fall is
   the sole terminus" and leave anti-fizzle to a lower layer until L3 proves it?
2. **"Sole win condition" — is it too absolute?** Human resignation / concession
   exists in any duel. ADR 0036's stamp deferred "whether a will-based concession
   survives as a duel affordance." Does SPEC's "nothing but capital fall names a
   winner" contradict a resign button? Is concession = conceding the capital, or
   a separate terminus SPEC must name?
3. **"diplomacy" in Goal + Promise (C11 under-scoped?).** § Goal line 6 and
   § Promise line 17 both list **diplomacy** as a core combine-input. In a
   two-realm duel there is no third party to ally with or betray — "diplomacy"
   collapses to reading the single opponent. C11 only re-scopes Phase 2; it does
   NOT touch the Goal/Promise "diplomacy" mentions. Is that a missed contradiction?
   Should "diplomacy" be struck or reframed at the top of the spec?
4. **Committing the BM into SPEC (S2).** S2 proposes adding "chess.com-shaped
   competitive product (free core loop + judgment-coach subscription)" to
   Positioning. But premises P2 **parked the BM** ("subscription BM stays
   PARKED, does not enter this draft"). Does naming the BM in SPEC over-commit an
   explicitly-parked decision? Should Positioning stay BM-agnostic and say only
   "1v1 head-to-head"?
5. **Is it still a "Civilization-depth world"? (S2 / Positioning).** The Civ-depth
   framing was built for a 4–6-realm multipolar map. On a two-realm duel board,
   is "Civilization-depth *world*" still true, or is the positioning now closer
   to a terrain-rich 1v1 wargame? Does the LoL-shaped hand survive the shrink to
   two players?
6. **"Full partition / no expand-into-empty-land" for 2 realms (C4).** With
   exactly two realms the "fully partitioned from turn 1" property is trivial.
   Does the clause still earn its place, or is it multipolar residue?
7. **The Fun Pillars were not touched.** The proposal amends structure/ending but
   leaves the four Fun Pillars (§ Positioning) unedited — "anti-snowball,"
   "coalition"-flavored framing may leak there. Grill whether they survive 1v1
   intact or need their own re-cut (the proposal implicitly claims they survive).

## After the grill (apply-phase, on user seal only)

1. Apply approved items to `SPEC.md` verbatim (Tier-3, one batch).
2. Stamp the draft header SEALED (date + "applied to SPEC.md").
3. Doc-sync any downstream change the grill produced (if the grill re-cut a
   claim, DOMAIN_MAP/DESIGN/capital may need a follow-up stamp — check).
4. Pay the SYNC-DEBT row **"SPEC amendment PROPOSAL pending — Tier-3"** (strike
   to Paid). If the grill changed anything upstream, patch term-inventory +
   `npm run lint:docs` + regenerate QUICKREF (same-session freshness).
5. **L3 Wayfinder gate 08 is unblocked** once SPEC lands — that is the step
   AFTER this, not part of it.

## Session mechanics

- Voice: Korean 존댓말 (해요체); artifacts neutral professional English.
  Grilling suspends the soft register — announce the switch, restore after.
- `/usr/bin/git`; bare `git log` unreliable (parallel worktree) — use
  `rev-parse` / `show -s`. Docs/seal commits go directly to `main` (repo
  convention — see the cascade commits).
- The prior session's cascade is complete and lint-clean (0 blocking). Working
  tree has unrelated pre-existing landing edits (css/landing.css, game.html,
  index.html, js/landing.js) — NOT part of this work; leave them.
- `npm run lint:docs` = the governance audit (5 advisory ledgerCurrency findings
  are known heuristic noise, already triaged spurious — ignore).
