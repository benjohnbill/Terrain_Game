# Handoff — 1v1 Duel Wayfinder, FINISH Gate 6 (turn structure)

Date: 2026-07-24 (early AM). Supersedes `.context/handoff-duel-gate6-2026-07-23.md`.
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`. Nothing committed this
session; all output is untracked working notes (the ledger), edits to the
throwaway prototype, and this handoff.

> Saved to `.context/` (not OS `/tmp`) on purpose: this project keeps handoffs in
> `.context/` (AGENTS.md Working layer), the previous handoff lived here, and `/tmp`
> is tmpfs (wiped on WSL shutdown) so it would not survive to the next session.

## Next session's job

**Finish Gate 6 — turn structure (the LAST design gate).** This session resolved
Gate 6's "showdown 박진감 / eval-bar UI" open thread (validated in prototype, user
satisfied). The remaining Gate 6 nodes to seal — all **argument-settleable** like
earlier gates (no more prototyping strictly required):

- **Turn content / phase order** — what one turn contains and in what order.
- **Commit-budget (행동력) grammar at the MATCH-FRAME level** — per-turn regenerated
  non-hoardable pool already built (`commit.js`, slice-2 ticket 04); the gate decides
  how many actions / the turn's shape ABOVE combat. NOT the combat commit lever
  (M1/M2, fixed by P2).
- **Match length** — turn count, fixed vs player-paced. 가안, feel = L3.
- **D6.1a resolve-order determinism** — the order two simultaneously-revealed plans
  apply to the board (e.g. both armies into the same sector — who arrives first). The
  ABOVE-combat application-order rule; combat resolution itself is fixed (P2).

When Gate 6 fully seals → the design gates are complete and the **deferred doc
cascade fires** (see below).

## Read first — do NOT restate, reference by path

1. **`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`** — THE compression-safe
   record. Gates 1–5 CLOSED; Gate 6 IN PROGRESS. In the Gate 6 section: **D6.1**
   (simultaneous blind commit → reveal) SEALED + rider (PvP timer) + open D6.1a; the
   large **EVAL BAR node** (this session's work — see "This session" below); the
   **standing judgment frame** and **validation-tier note** that Gate 6 inherits.
2. `.scratch/l3-playable-seam/duel-pivot-premises.md` — P1 Charter / P2 Boundary /
   P3 Governance + the cascade blast-radius inventory (the seal work-list).
3. Memories: `terrain-game-duel-pivot`, `terrain-game-l3-wayfinder-gate07`,
   `terrain-game-recon-fog-economy`.
4. `mockup/combat-calc/turn-loop-prototype.html` — the validated turn loop with the
   grafted vertical eval bars. **This is the current visible form of the turn loop.**
   Reference/throwaway per ADR 0041 — NOT L3 build source.

## This session in one line

Opened Gate 6, sealed **D6.1** (simultaneous commit → reveal). The "showdown 박진감"
thread then became the whole session: proved the game's **central bet** — that a
**graphics-free, eval-bar-driven turn loop carries the read + feel WITHOUT
spectacle** — by iterating a vertical two-bar eval system grafted into
`turn-loop-prototype.html`. User SATISFIED → the bet is validated at proto level.
**Every eval-bar / interaction decision is recorded in the ledger's Gate 6 EVAL BAR
node — build on it, don't re-derive.** Headlines (full text in ledger):
- Vertical chess.com-style bar: **white=my advantage / black=enemy / grey=recon
  confidence RANGE** of the **equal-commit** R (no commit info on the bar; witness
  model — band jitters but always contains the truth; recon narrows grey).
- **Two bars:** LEFT = clicked front's R · RIGHT = this action's **AVERAGE across
  eligible fronts** (descriptive comparison baseline, NOT a predicted verdict — the
  killed strategic bar stays killed). Pick action → both = average → click sectors →
  left diverges → find the soft spot.
- **No numeric what-if calculator; no confirm modal** — inline 확정 in the commit bar;
  free target re-click before confirm; post-confirm notch-click re-shows R + 취소.
  Uniform commit→action→(plan)→explore→확정 flow for ALL actions (deferred to build).
- Problem A (users trusting the equal-commit bar and getting reversed by enemy high
  commit) is kept as DEPTH (the poker lesson) — fix by clarity + letting the reveal
  teach, NOT by removing it. Strategic "who's winning the match" verdict → post-game
  COACH (subscription BM, live-excluded = anti-pay-to-win); BM itself stays PARKED.

## Hard constraints on Gate 6 (sealed frame — full text in ledger/premises)

- **P2 Boundary:** combat/operational engine FIXED. Gate 6 designs the match-frame
  loop ABOVE combat.
- **Map is PARALLEL** — abstract board; the concrete 1v1 map is a separate pass.
- **Numbers stay 가안 → L3;** do not seal tempo/counts as if measured.
- **Consistency:** D1.3 simultaneous-reveal, D1.2/gate07 fog, D2.5 mutual-exposure,
  D5.1+P1 anti-fizzle decay. **Do NOT re-hire the mobilization-intensity curve for
  anti-fizzle** (D5.4 hard rule).

## After Gate 6 seals — deferred cascade (do NOT run before)

Inventory in premises appendix + ledger amend flags. One batch: new victory ADR
(supersedes 0030/0033 + crisis stack 0034/0035/0036; amends 0037/0038; stale-stamps
0031/0032), SPEC amendment PROPOSAL (11 contradictions + 4 sharpenings, user-approved,
Tier 3), DOMAIN_MAP/DESIGN doc-sync ~22 rows, match-arc reseal, victory birthplace
`docs/features/capital/` (CP-② rulings), term-inventory patch + `npm run lint:docs` +
QUICKREF regen. Until it lands, SPEC/DOMAIN_MAP still assert the multi-realm model as
truth — a large, known, recorded sync debt.

## What NOT to do

- Do not run the cascade before Gate 6 seals.
- Do not re-open sealed decisions: 1v1 vs multiplayer, capital-fall vs hegemony,
  gates 1–5, or the eval-bar/interaction design just validated. 2v2/Tichu PARKED.
- Do not treat the prototype as L3 build source (ADR 0041 — reference/throwaway).
- `mockup/combat-calc/showdown-eval-prototype.html` is a SUPERSEDED throwaway (the
  standalone v2, replaced by the graft into turn-loop-prototype.html) — ignore or delete.
- Do not touch `docs/teach/` (Sanctuary).

## Session mechanics / safety

- Voice: Korean 존댓말 (해요체); artifacts neutral professional English.
- `/usr/bin/git`; bare `git log` unreliable (parallel worktree) — use `rev-parse`/`show -s`.
- Update the ledger as Gate 6 nodes seal — it is the compression-safe checkpoint the
  cascade reads from.
- User viewport ~1591 px; L3 targets desktop/native.
- The background static server (was on `:8007`) was **taken down** at this session's end.
  To re-serve for a feel-check:
  `python3 -m http.server 8007 --directory /home/benjohnbill/dev/Terrain_Game`
  then `http://localhost:8007/mockup/combat-calc/turn-loop-prototype.html`.

## Suggested skills

- **`grilling`** — the draft's method (one node at a time; user seals; each question
  carries your recommended answer). Continue in it.
- **`domain-modeling`** — record any new/repurposed turn-structure term at its
  birthplace as Gate 6 nodes seal.
- **`prototype`** — available if a remaining node wants a feel-check (base =
  turn-loop-prototype.html), but the remaining nodes are argument-settleable; don't
  over-prototype.

## Read order for the next agent

1. ledger (Gate 6 section + standing frame + validation-tier note)
2. premises (P1/P2/P3 + cascade list)
3. memories (duel-pivot, gate07, recon-fog-economy)
4. this handoff, then open the remaining Gate 6 nodes with the standing judgment
   frame + the constraints above.
