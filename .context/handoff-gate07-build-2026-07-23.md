# Handoff — Gate 07 build: the turn-loop throwaway prototype

Date: 2026-07-23
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`
HEAD at handoff: `54490ba` (confirm with `/usr/bin/git rev-parse --short HEAD`
— bare `git log` is unreliable here; parallel worktree).

You are picking up the L3 Wayfinder gate 07 crossing session. **The design is
settled and the build spec is written.** Your job is to build the throwaway
interaction prototype the spec describes, then run the live evaluation with the
user. Gate 07 is still OPEN — the prototype resolves it by live reaction; do not
seal it yourself.

## Read first (the spec IS the authority — do not re-derive)

1. `docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md` — **the
   build spec.** Problem/solution, 33 user stories, implementation decisions,
   the 10-step live-evaluation script, out-of-scope. Everything below is a
   pointer into it, not a restatement.
2. `terrain-game-recon-fog-economy.md` (project memory) — the design decisions
   behind the spec (commit-bar spine, three read layers, recon ladder, instant
   recon, detection-vs-measurement, defensive mirror). All candidate/가안,
   unsealed.
3. `.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md`
   § Comments (crossing session, 2026-07-23) — the session record.
4. `.scratch/l3-playable-seam/issues/03-define-viewer-knowledge-contract.md` §4
   (the sealed knowledge matrix) + §5 (the seven non-leak invariants) — the fog
   contract the prototype must honor.

## Frame — do not get wrong (ADR 0041)

This is a **throwaway prototype**, not L3 build source. `js/`, `mockup/`,
`map-gen.js` are the reference archive. The prototype is a single self-contained
HTML file under `mockup/combat-calc/`, named so a reader sees it is a prototype.
v0 (`fog-prototype.html`) is the recorded FAILURE exemplar; v1
(`fog-prototype-v1.html`) is the last iteration — read it for craft precedent
(it already authors viewer-safe fiction directly, draws glance-scale marks, and
has a `?variant=`/`?scene=` toggle pattern), but this is a fresh cut on the
new spec, not an edit of v1.

## Build order (from the spec)

1. **Reuse the authored geometry.** The map SVG is already drawn by
   `map-mockup.html` / `map-gen.js` (CRADLE_MAP: 10 regions / 56 sectors / 292
   hex). Use the 관중(r6)+촉(r8)+중원(r1)+서역(r5) corner for the fixture.
2. **Decoupled navigation FIRST** (`?nav=drill`): click province → L1, click
   sector → L2; camera zoom independent. Get the whole turn flow running end to
   end on this before touching coupled.
3. **The commit bar** (bottom, ~20 slots, free-split, non-bankable) → radial
   (지목→소환) at the map point → matryoshka plan disclosure.
4. **The three wired verbs** (attack / defense / basic recon) feeding the
   **scripted turn-loop reducer** `(projection, allocations) → nextProjection`.
   Outcomes are AUTHORED, not computed — there is no combat formula here.
5. **Turn-end = loop closure:** two-sided showdown (hole-card flip, placeholder
   reveal) → world update (scars/control) → event tray (skip/step) → turn N+1
   with updated bands/scars/mobilization. This closing-the-loop is the point.
6. **Facade actions** (instant recon, fort, recruit, extra plan variations):
   full UI + commit consumption, inert in the reducer.
7. **Coupled navigation SECOND** (`?nav=zoom`): continuous camera zoom whose
   thresholds switch the semantic layer; viewpoint physically lowers. Floating
   bar toggles the two.
8. **DEV placeholder:** supply (보급), hatch + "DEV — NOT IMPLEMENTED" badge.

## The one seam (integrity — do not violate)

Render everything from a **single static viewer-safe projection object**. No
hidden truth anywhere in the page — no DOM attribute, renderer object, tooltip,
debug panel, or CSS-hidden element holds a value the viewer may not see. The
showdown reveal is authored into the fixture's post-resolution projection, not
computed from a hidden pre-resolution truth. Keep map-drawing functions separate
from shell/command/event functions (renderer/shell boundary, ADR 0039) — React
not required in a throwaway file; it is a code-organization discipline.

## What NOT to do

- No combat logic / arithmetic (outcomes authored).
- Do not test or fix R14 war-decisiveness (separate gate-08 pass; a good
  prototype does not answer it — do not conflate "interface is fun" with "war is
  decisive").
- Do not wire instant-recon logic (UI facade only).
- Do not seal the showdown reveal scope (placeholder; gate-08-adjacent).
- Do not seal gate 07. Live evaluation → USER seals.
- Do not touch `docs/teach/` (Sanctuary).

## After the build: live evaluation → seal

Run the spec's 10-step live-evaluation script with the user, once per nav
variant (`drill` then `zoom`). Record their words, the encodings that worked/
were rejected, viewport, SVG responsiveness. Then the user seals gate 07, which
triggers the queued doc-sync batch:

- Formal amendment of issue 03 §4 derived-band grouping (판세 re-leveled
  match-level).
- Promote the recon/fog-economy candidates (project memory) into
  `docs/features/fog-of-war-discovery/` RULINGS/GLOSSARY as they seal.
- The two unruled inventory items (enemy standing-rebel stack visibility;
  showdown reveal scope → deferred gate-08).
- Standard batch: ticket Answer, map.md, spec Implementation Decisions,
  SYNC-DEBT, GLOSSARY-QUICKREF.

Prototype-skill capture: when validated, capture the throwaway to a throwaway
branch out of main and leave a context pointer on gate 07; fold only validated
decisions into sealed docs.

## Uncommitted working state at handoff (nothing lost)

These are in-tree, not committed (branch `main`, HEAD `54490ba`). Commit is the
user's call — the session did not commit because gate 07 is not sealed:

- `?? docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md` (new — the spec)
- `M docs/SYNC-DEBT.md` (spec-home divergence row)
- `M .scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md` (crossing-session Comments + spec pointer)
- Project memory `terrain-game-recon-fog-economy.md` + `MEMORY.md` index row (design decisions)

## Session mechanics / safety (still bite)

- User viewport **1591 px**; L3 targets desktop/native — no responsive lower
  bound in 07.
- Serve `python3 -m http.server 8007` from repo root; **hard-reload after edits**
  (profile caches JS).
- Use `/usr/bin/git`; the worktree carries the user's landing-redesign work —
  stage only gate/prototype files by explicit path. `docs/teach/` is Sanctuary.
- Verification: `npm test` (was 479 green at gate-06 seal), `npm run lint:docs`.
  The prototype is throwaway HTML outside the test suite — it does not add tests
  (prototype skill rule 4).
- Conversational voice: Korean 존댓말 (해요체); artifacts neutral professional
  English.
