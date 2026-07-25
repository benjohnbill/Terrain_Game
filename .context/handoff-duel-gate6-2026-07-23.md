# Handoff — 1v1 Duel Wayfinder draft, open Gate 6 (turn structure)

Date: 2026-07-23 (evening). Supersedes `handoff-duel-gate5-2026-07-23.md`
(Gate 5 is now CLOSED).
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`.
HEAD: `430b511` (confirm with `/usr/bin/git rev-parse --short HEAD` — bare
`git log` is unreliable here, parallel worktree). Nothing committed this session;
all output is untracked working notes (the ledger) + this handoff.

## What the next session does

Open **Gate 6 — turn structure** of the 1v1 Duel Wayfinder draft — **the last
design gate.** Method unchanged: `grilling` + `domain-modeling`, one question at
a time, user seals every node, each question carries your recommended answer.
Gates 1–5 are CLOSED; do not re-open them. When Gate 6 seals, the design gates
are complete and the deferred documentation cascade fires (see § After Gate 6).

## Where the work lives — READ THESE, do not restate them

1. **`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`** — the running seal
   ledger. **Read first.** Now carries D1.1–D5.4 (Gate 5 closed this session:
   D5.1–D5.4 + a **standing judgment frame** + a **validation-tier note**), the
   captured forward gates, and the amend flags. Source of truth for what is
   decided.
2. `.scratch/l3-playable-seam/duel-pivot-premises.md` — the 3 locked premises
   (P1 Charter / P2 Boundary / P3 Governance) + the blast-radius / seal-batch
   inventory (appendix) — this is the cascade work-list.
3. Memory `terrain-game-duel-pivot` — the pivot + its six converging arguments.
4. Memory `terrain-game-l3-wayfinder-gate07` — the commit-first interaction
   skeleton + combined camera nav, sealed live in the throwaway prototype
   `mockup/combat-calc/turn-loop-prototype.html`. **This is the closest existing
   artifact to turn structure** — Gate 6 designs the loop that prototype skins.

## State in one line

The game is a **two-realm 1v1 duel; sole win = capturing the enemy capital.**
Design is ~90% through the L3 Wayfinder; this draft IS the "war-termination pass"
resolved at a higher altitude. Implementation is 0/9 build tickets — no L3 code
exists yet. Duel gates: 1–5 CLOSED, **6 (turn structure) is the last one.**

## Gate 5 outcome (this session — context for Gate 6, do not re-litigate)

Pure disposition/re-aim pass, **zero new mechanics** (P2 Boundary held). The four
realm-internal systems were one aging clock for one retired problem (the frozen
world's decision-point trip). Verdicts (full text: ledger D5.1–D5.4 + the Gate 5
CLOSED summary table):

- **The anti-fizzle decay already exists in sealed board-state** — income
  (OG-①) + land-derived force limit (capLandFrac=1, AB-②), locked in by P1
  no-free-healing (aging constitution MT-①). D3.2's decay lives there; no new
  device. This is the reusable structural finding.
- register = LIVE, narrowed to finite-blood-bound + affordability body-min (it is
  a stock; the decay is carried by income+ceiling, not by the register).
- surge/mobilization-intensity = REPURPOSED: pricing LIVE, the pressure /
  aging-clock / crisis-fuel roles RETIRED. **Hard rule carried forward: do NOT
  re-hire the intensity curve for anti-fizzle** (MT-⑤ measured it INERT; D3.2
  explicitly rejected the blinds-clock).

Two frames Gate 5 established that Gate 6 inherits:

- **Standing judgment frame (user):** affirm sealed prior work first (default
  LIVE/inherited), then judge fixes by the user's UX standard in L3 play.
  Divergence needs a concrete in-play UX reason, not speculative redesign.
- **Validation-tier note:** numbers split into (1) ratio/shape = research-grounded,
  pinned now, no play; (2) absolute scale = internally consistent; (3) feel/tempo
  = genuinely L3-only. Ship research-grounded 가안, tune in play. An L1
  decision-grid is the cheap pre-L3 sanity rung (belongs to the numbers pass).

## Gate 6 — what it must decide (turn structure)

The per-turn loop of the 1v1 duel. Likely nodes (shape them in the grill, this is
not a fixed list):

- **Simultaneous vs sequential commitment.** The poker DNA + the sealed fog
  contract (both capitals public, forces dark, D1.2) + "uncertainty duel becomes
  literal" (SPEC #2 sharpening) all point at *simultaneous commit → reveal*, but
  it must be sealed, not assumed. Connects to D1.3 (simultaneous capital
  placement then reveal) — the same shape may govern every turn.
- **Commit budget (행동력) — the turn's action economy.** Already load-bearing:
  D1.5 relocation spends a large amount of it across ~2 turns; slice-2 ticket 04
  built `commit.js` (per-turn regenerated, non-hoardable pool, `pool/allocate/
  renew`). Gate 6 decides the per-turn budget grammar at the MATCH-FRAME level
  (how many actions, what a "turn" contains, phase order) — NOT the combat commit
  lever (M1/M2, fixed by P2 Boundary). Keep the two commit concepts distinct.
- **Phase structure inside a turn** (if any): recruitment / movement / commit /
  reveal / resolution ordering. The gate07 prototype already sequences a
  commit-first interaction; Gate 6 decides the canonical loop it represents.
- **Turn count / match length shape** — the duel is ~15–30 min; how many turns
  that implies, and whether turn length is fixed or player-paced. Numbers are 가안
  per the validation-tier note (feel = L3).

### Hard constraints on Gate 6 (from the sealed frame)

- **P2 Boundary:** combat/operational engine FIXED (slice-1/2, commit LEVER
  M1/M2, fatigue/movement/supply/intel). Gate 6 designs the match-frame turn
  loop ABOVE combat, not the combat commit economy.
- **Map is PARALLEL** — design on the abstract board; do not pull the concrete
  1v1 map into this gate.
- **Consistency with sealed gates:** simultaneous-reveal shape (D1.3), fog
  contract (D1.2 / gate07), mutual-exposure duel (D2.5), 행동력 as the currency
  relocation drains (D1.5).
- Numbers stay 가안 → L3; do not seal tempo values as if measured.

### Inputs to read when the gate opens

- Memory `terrain-game-l3-wayfinder-gate07` + `mockup/combat-calc/turn-loop-
  prototype.html` — the commit-first skeleton + camera nav (the turn loop's
  current visible form).
- `commit.js` (slice-2 ticket 04) + match-arc GLOSSARY 커밋/행동력 rows +
  combat-formula M1/M2 — the commit-budget grammar (reference; combat side is
  fixed).
- Memory `terrain-game-recon-fog-economy` — the recon/fog presentation contract
  that any per-turn information step must stay consistent with.

## After Gate 6 — the deferred cascade (do NOT run before Gate 6 seals)

Inventory in the premises appendix + the ledger's amend flags. In one batch:
new victory ADR (supersedes 0030/0033 + crisis stack 0034/0035/0036; amends
0037/0038; stale-stamps 0031/0032), SPEC amendment PROPOSAL (11 contradictions +
4 sharpenings, user-approved — Tier 3), DOMAIN_MAP/DESIGN doc-sync ~22 rows,
match-arc reseal (stale multi-realm victory machinery), the victory condition's
new birthplace `docs/features/capital/` (CP-② rulings from this draft),
term-inventory patch + `npm run lint:docs` + QUICKREF regen. Until it lands,
SPEC/DOMAIN_MAP still assert the multi-realm model as truth — a large, known,
recorded sync debt the cascade pays.

## What NOT to do

- Do not run the cascade before Gate 6 seals.
- Do not re-open sealed decisions: 1v1 vs multiplayer, capital-fall vs hegemony,
  gates 1–5. 2v2 co-op / Tichu is PARKED as a sub-mode (rejected as main mode).
- Do not re-hire the mobilization-intensity curve for anti-fizzle (D5.4 hard
  rule).
- Do not touch `docs/teach/` (Sanctuary) or the user's landing-redesign work in
  the worktree. Stage only by explicit path; commit nothing unless asked.

## Session mechanics / safety

- Voice: Korean 존댓말 (해요체); artifacts neutral professional English.
- `/usr/bin/git`; bare `git log` unreliable (parallel worktree) — use
  `rev-parse` / `show -s`.
- Update the ledger (`duel-pivot-draft-ledger.md`) as Gate 6 nodes seal — it is
  the compression-safe checkpoint the cascade reads from.
- User viewport ~1591 px; L3 targets desktop/native.

## Suggested skills

- **`grilling`** — the draft's method (one question at a time; user seals).
  Continue in it.
- **`domain-modeling`** — record any repurposed/new turn-structure term at its
  birthplace as Gate 6 seals (match-arc GLOSSARY/RULINGS, or capital/ for
  victory-frame terms).
- **`prototype`** — Gate 6 is the gate most likely to want a live feel-check
  (turn loop, simultaneous-reveal). The gate07 precedent stands: build a throwaway
  in `mockup/combat-calc/`, require live user reaction, do not over-invest.

## Read order for the next agent

1. `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` (all sealed nodes incl.
   Gate 5 + the standing frame + validation-tier note).
2. `.scratch/l3-playable-seam/duel-pivot-premises.md` (P1/P2/P3 + cascade list).
3. Memory `terrain-game-duel-pivot`, then `terrain-game-l3-wayfinder-gate07`.
4. `mockup/combat-calc/turn-loop-prototype.html` — the turn loop's current form.
5. This handoff, then open Gate 6 with the standing judgment frame + the
   simultaneous-reveal consistency lens above.
