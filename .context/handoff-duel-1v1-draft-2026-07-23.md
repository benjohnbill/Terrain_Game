# Handoff — start the formal Wayfinder 1v1 draft

Date: 2026-07-23
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`
HEAD at handoff: `430b511` (gate-07 seal commit; confirm with
`/usr/bin/git rev-parse --short HEAD` — bare `git log` is unreliable here,
parallel worktree).

## What the next session does

Open the **formal Wayfinder 1v1 draft** on the already-locked premises. The
1v1 pivot decision is MADE; this session designs the new match frame, it does
not re-litigate the decision. Method: `grilling` + `domain-modeling`, one
question at a time, user seals every gate.

## The decision already made — DO NOT re-open

The game is a **two-realm 1v1 duel; a match is won by capturing the enemy
capital.** Reached 2026-07-23 during the war-termination pass; six independent
lines converged (poker DNA, five research surveys, product constraints, map
measurement, solver-BM cousin, F2P liquidity). Full record:

- **`.scratch/l3-playable-seam/duel-pivot-premises.md`** — the 3 locked premises
  + the blast-radius inventory (appendix). **Read this first.** It is the
  founding document; the draft opens on top of it.
- Memory `terrain-game-duel-pivot` — the pivot, its six converging arguments,
  and the blast radius in one place.

Do not re-argue 1v1 vs multiplayer, vs 3-faction, or capital-fall vs hegemony.
Those are closed (3-faction was rejected as the kingmaking worst case; hegemony
decision point is superseded, not narrowed).

## The ground the draft stands on (premises — see the doc, don't restate)

- **P1 Charter** — 2 realms · victory = capital fall · war = match. Design the
  HOW, never the WHETHER.
- **P2 Boundary** — combat engine FIXED/out of scope (verified
  force-count-independent); opponent-agnostic (PvE/BM parked); **map = parallel
  pass** (design on an abstract board); **scope = the 1v1 match frame**.
- **P3 Governance** — mandatory-ADR trigger; SPEC changes are user-approved
  proposals; victory birthplace = `docs/features/capital/` (CP-①); each gate
  user-sealed.

Grey-zone already resolved into P2: map = parallel, crisis fate = a gate (not a
premise), scope = match frame.

## The draft's gates (its actual design work)

1. **Capital — definition + placement** (likely first). What IS a capital
   (per-province designation? player-chosen "수도 선택"?). The user wants
   capital placement to be a skill/taste expression, WITH a "전진 수도 혜택"
   (forward-capital benefit: offensive pressure vs. exposure — poker-position
   analogy). Existing seed: `docs/features/capital/` CP-① (capital fall = regime
   event; rump state impossible by rule; currently unwired, was P2).
2. **Capital-fall mechanics + early-rush guard** — instant vs siege-gated;
   guard against a turn-3 fog decapitation (AoW4 added siege time for exactly
   this — see research below).
3. **Draw / timeout handling** — Westphalian draw (multi-survivor) is dead in
   1v1; the *problem* it solved needs a fresh answer (komi-style half-point
   tiebreak? attrition close?). In scope per P2.
4. **Crisis fate** — retire vs repurpose the internal-rebellion mechanics
   (CE-①…⑳). The ONE genuine design fork among the "stale" items (the rest is
   mechanical stamping). Crisis code is built + opt-in-off; retiring can leave it
   parked.
5. **Match-arc in a short duel** — what the aging constitution / conscription
   register / match phases mean when war = match, ~15–30 min. (Aging/register
   SURVIVE as realm-internal; their PURPOSE may narrow.)
6. **Turn structure** — async-sequential (chess.com) vs live timer. Possibly
   later / product-adjacent.

## Disposition of stale content — mechanism already clarified (not design work)

- ADR disposition = header-line stamps `Superseded by: ADR-XXXX (date) — <delta>`
  or `Amended by: ADR-XXXX (date) — <delta>`, landed in the SAME batch as the
  seal (documentation law mandates it). **No separate `stale`/`type` field
  exists**; `Amended by` absorbs scope-narrowing notes (the blast-radius survey's
  "stale-stamp" label for 0031/0032 → really `Amended by` scope-notes).
- Append-only: nothing is deleted; "retired" is prose narrative, not a status.
- Note: this would be the repo's **first-ever full `Superseded by`** use (all 41
  ADRs currently use only `Amended by`). 0030 + the crisis stack are the first.
- This is the SEAL BATCH — it executes AFTER the design gates seal. It is not
  re-decided per item; the victory decision determines it.

## The seal batch (the doc cascade — full inventory in the premises-doc appendix)

New victory-condition ADR (mandatory trigger) supersedes 0030/0033 +
0034/0035/0036, amends 0037/0038, amends-scope 0031/0032; SPEC amendment
PROPOSAL (11 contradictions, user seal); DOMAIN_MAP/DESIGN doc-sync (~22 rows);
match-arc reseal at birthplace; lint (`npm run lint:docs`) + QUICKREF regen.
**Combat-survival verified TRUE** — code blast radius is small; the expensive
rework is match-arc + a re-authored 1v1 map (parallel pass).

## Open capture debts from this session (so they are not lost)

- **The five research surveys** (mainline 4X, Paradox, casual/board conquest,
  1v1 head-to-head, the three-player problem) live ONLY in this conversation's
  history — not yet persisted. If the 1v1 seal cites them as evidence, save them
  to a `RESEARCH.md` at the pass's birthplace. Key load-bearing findings:
  Polytopia "Might" = literal capital-fall (casual MP precedent); FFA's three
  pathologies (kingmaking / early-elimination / time-drag) are multiplayer-only;
  fog structurally substitutes for alliance-politics depth; 3-player is the
  kingmaking worst case; capital-fall well-precedented (AoW4/Vic3/CK3) but every
  studio added early-rush friction.
- **Gate-07 loose ends** (from the prior handoff, still parked — NOT this pass's
  job): prototype throwaway-branch capture, recon-economy numbers candidate,
  Tier-3 casual-design-principle promotion proposal. See `docs/SYNC-DEBT.md`
  gate-07 rows.

## Session mechanics / safety

- Gate-07 seal already committed (`430b511`, 8 files by explicit path). The
  premises doc (`.scratch/`, untracked per convention) and memory (outside repo)
  are written; nothing else committed this session.
- Worktree carries the user's **landing-redesign** work + `docs/teach/`
  (Sanctuary). **Stage only by explicit path; never commit those.**
- `/usr/bin/git`; bare `git log` unreliable (parallel worktree) — use
  `rev-parse`/`show -s`.
- User viewport 1591 px; L3 targets desktop/native.
- Conversational voice: Korean 존댓말 (해요체); artifacts neutral professional
  English.
- Until the seal lands, SPEC/DOMAIN_MAP still assert the multi-realm model as
  truth — a large, known sync debt the draft's seal batch pays.

## Suggested skills

- **`grilling`** — the draft's method (one question at a time; user seals).
- **`domain-modeling`** — record terms/decisions at their birthplace as gates
  seal.
- **`prototype`** — if a gate needs a live feel-check (e.g. can capital-fall
  resolve in 15–30 min? does a 1v1 board play?), build a throwaway per the
  gate-07 precedent (`mockup/combat-calc/turn-loop-prototype.html`).
- Reference tracker: `.scratch/l3-playable-seam/` (the Wayfinder front door is
  `map.md`; the 1v1 pivot subsumes its out-of-band war-termination pass).

## Read order for the next agent

1. `.scratch/l3-playable-seam/duel-pivot-premises.md` (premises + blast-radius).
2. Memory `terrain-game-duel-pivot`.
3. `docs/features/capital/` (CP-① — the victory condition's birthplace).
4. AGENTS.md read order for anything the draft touches (SPEC, DESIGN,
   DOMAIN_MAP, the ADRs named above) — but read them knowing the multi-realm
   victory model is being replaced.
