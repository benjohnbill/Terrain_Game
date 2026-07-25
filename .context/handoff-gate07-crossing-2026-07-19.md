# Handoff — Gate 07 act 2: the crossing session

Date: 2026-07-19
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`
HEAD at handoff: `54490ba` (`docs(l3): record gate 07 act 1 …`) — confirm with
`/usr/bin/git log -1` (bare `git log` is unreliable here; parallel worktree).

You are the main session carrying the L3 Wayfinder. **Gate 07 is OPEN, act 1
is complete and recorded.** This session is act 2: one consolidated decision
session ("the crossing session"), then the prototype rebuild and live seal.

## Frame — do not get wrong (ADR 0041)

Marketing landing (Firebase) and the L3 game are isolated environments; the
game does not ship as a static page; `js/`/`tests/`/`mockup/` are a reference
archive, not build source. Canonical L3 source lives in the `game/` tree
(gate 05). Point at `docs/adr/0041-…`, do not restate.

## Read first (act 1's full record — do NOT re-derive)

1. `.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md`
   — **§ Comments is the act-1 session record**: the matryoshka re-aim, the
   derived-band grill outcomes (판세 isolation + seam rider; sector-bound
   mobilization intensity; worst-case+distribution), the deception disposition
   ("the dealer never lies; opponents bluff" + charter sentence), the poker
   correspondence, ignition→amplifier sequencing, research rounds 1–3
   (CK3 / Into the Breach implicit in the deception round / Total War / UoC2),
   the staff-briefings feature candidate (trust weighting = presentation-only,
   user-sealed), the entrance-design principle, and the semantic-zoom vs
   camera-zoom sub-question.
2. `.scratch/l3-playable-seam/research/viewer-info-inventory.md` — the
   44-value inventory (certainty × decision altitude × cadence × tier + L
   hypothesis). Key findings: L0 oversubscribed (8 candidates, only 2 marked
   core: situation axes + border alarm); two unruled items (enemy
   standing-rebel stack visibility public-vs-band; showdown reveal scope).
3. `.scratch/l3-playable-seam/map.md` — gate order and the out-of-band
   war-termination pass (still the gate-08 long pole; untouched by act 1).

## The crossing session — decision order

Run as ONE session, `prototype` skill mechanics (one question at a time, the
user seals every decision):

1. **Entrance design** — group the 44 inventory values into few entrances
   (user principle: the most-used buttons are enter/exit buttons; never
   spread-everything UI). Test the hypothesis that a "staff report" entrance
   consolidates several oversubscribed L0 candidates (event tray, engagement
   reports, crisis milestones).
2. **L0 trim** — decide what survives at the top level (start from the two
   L0-core rows: situation axes 위협/기회/불확실 + border alarm).
3. **Hierarchy fix** — settle L0/L1/L2 placement for the inventory (the L
   column is hypothesis, not decision).
4. **Prototype variant design** — includes the open sub-question: semantic
   zoom COUPLED to a continuous camera (CK3/TW style) vs DECOUPLED click-drill;
   renderer measurement scope must cover pan/zoom + LOD + animated-mark
   pressure (sealed: no renderer escalation by ambition alone).
5. Then rebuild the prototype (v0 `mockup/combat-calc/fog-prototype.html` is a
   recorded FAILURE exemplar — conclusions-first, not raw evidence at top
   level) → run the live evaluation → user seals gate 07.

## At gate 07 seal — doc-sync duties already queued

- Formal amendment of issue 03 §4's derived-band grouping (판세 re-leveled
  match-level; a framing cross-stamp already sits in issue 03).
- Decide the birthplace for presentation rulings (feature doc vs ticket) —
  a gate-12 publication question surfaced in act 1.
- The two unruled inventory items (rebel-stack visibility; showdown reveal
  scope — the latter is gate-08/build-04 adjacent; do not let it grow 07).
- Standard batch: ticket Answer, map.md § Decisions + § Order, spec.md
  Implementation Decisions + renumber, SYNC-DEBT register, selective staging.

## Parked (do not let these leak into 07)

- **Presentation pass** (diorama aesthetic; juice proportional to arc weight;
  scar-as-history rendering; asset-pipeline ownership) — named, parked.
- **Staff briefings design pass** (②-layer seam occupant #1) — registered in
  the ticket; its ENTRANCE is in scope for the crossing session, its BODY is
  not.
- **Map re-authoring / sector scale-up** — linked to a proven attack-EV
  ignition (war-termination pass) first; envelope 30–40 min is the ceiling.
- Archiving/sync cadence automation — separate conversation topic.
- Poker-HUD research round — optional; largely absorbed by the poker
  correspondence + deception disposition.

## Session mechanics / safety (unchanged, still bite)

- User viewport: **1591 px** (`window.innerWidth`); L3 targets desktop/native
  shell — no responsive lower bound in 07.
- Serve `python3 -m http.server 8007` from repo root for any browser check;
  hard-reload after edits (profile caches js).
- The worktree carries the user's landing-redesign work — **stage only gate
  files by explicit path**; `docs/teach/` is Sanctuary; use `/usr/bin/git`.
- Verification: `npm test` (479 green at gate-06 seal), `npm run lint:docs`
  (0 blocking; advisory "possibly-paid" rows include false hits from the
  2026-07-18 snapshot commit message — verify before acting, reports not
  legislation).
- Conversational term alignment: 참모 보고 / staff briefings is an UNREGISTERED
  working name — registration duty fires when it heads to a seal.
