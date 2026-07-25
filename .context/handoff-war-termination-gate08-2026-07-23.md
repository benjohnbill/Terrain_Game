# Handoff — War-termination pass → gate 08 (the long pole)

Date: 2026-07-23
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`
HEAD at handoff: `54490ba` (confirm with `/usr/bin/git rev-parse --short HEAD`
— bare `git log` is unreliable here; parallel worktree).

You are picking up the L3 Wayfinder **after gate 07 sealed** (2026-07-23). Gates
01–07 are resolved. The next stage is **not another read-layer gate** — it is the
**war-termination pass**, the out-of-band long pole that every remaining gate sits
behind. Start at `.scratch/l3-playable-seam/map.md` § "Gate re-cut" →
"Out-of-band (not a gate) — the war-termination pass."

## Loose ends from the gate-07 seal session (clear these first)

The gate-07 doc-sync batch is **written but UNCOMMITTED** (worktree also carries
the user's unrelated landing-redesign work — stage only by explicit path; never
commit landing files or `docs/teach/`, which is Sanctuary). `npm run lint:docs`
was 0 blocking after the batch.

1. **Commit the gate-07 seal batch** (user's call — propose, don't auto-run).
   Files: `.scratch/l3-playable-seam/issues/03-define-viewer-knowledge-contract.md`,
   `…/issues/07-prototype-map-fog-presentation.md`, `…/map.md`,
   `docs/GLOSSARY-QUICKREF.md`, `docs/SYNC-DEBT.md`,
   `docs/features/fog-of-war-discovery/INDEX.md`,
   `docs/features/fog-of-war-discovery/RULINGS.md`,
   `docs/superpowers/specs/2026-07-23-gate07-turn-loop-prototype.md`.
2. **Tier-3 decision pending (user-scope):** promote the recurring **casual /
   entrance-design principle** ("info summoned by the commit decision, calm at
   rest, never spread-everything") to a `DESIGN.md` / `DOMAIN_MAP.md` Design
   Principle. Recorded as a proposal in `docs/SYNC-DEBT.md` (gate-07 row d).
3. **Deferred (recorded):** throwaway-branch capture of the prototype
   `mockup/combat-calc/turn-loop-prototype.html` — the user keeps iterating on it
   in play; it stays **untracked** in the worktree. Capture to a throwaway branch
   out of main when iteration settles (`docs/SYNC-DEBT.md` gate-07 row a).
4. **Recon economy NUMBERS stay candidate** (`docs/features/fog-of-war-discovery/RULINGS.md`
   ② + memory `terrain-game-recon-fog-economy.md`) — do not seal them in the
   war pass; they are gated on the map scale-up pass / playtest.

## What gate 07 sealed (so you don't re-open it)

Live user reaction on the throwaway turn-loop prototype sealed the **read-layer
presentation contract + commit-first interaction skeleton + coupled continuous
camera (연속 줌) navigation** (ticket § Answer; `fog-of-war-discovery/RULINGS.md`
②). The interaction is fun/legible in the right ORDER. **That is not evidence
the war is decisive** — the two must not be conflated (spec § Out of Scope). The
prototype used AUTHORED outcomes; no combat arithmetic was tested.

## The next stage — war-termination pass (read first, do not re-derive)

**Frame.** This is the WAR SYSTEM (decisiveness), upstream of everything. It is
**not** a crisis dial, **not** a UI question, **not** gate 07's descendant.
DESIGN-RISKS **R14** is the pivot (crisis pass, 2026-07-13): with crisis OFF the
main arc annihilates ~0, ~77% of wars stall → blank-slate peace, and the SPEC's
"mad-movie" spectacle never fires — so the tie/spectacle problem lives in the
**war system**, and crisis is only a backstop. This pass attacks that.

**The concrete task list** (from `map.md` § Gate re-cut "Out-of-band"):

- Read **metric 5** — `npm run metrics:fizzle` (the read that
  `docs/features/war-model-build/INDEX.md` explicitly parked for the user).
- **Split the ~77% stall into causes** (memory correction, war-model-build): the
  stall timer is NOT the only path to a 0% (annihilation) box — ~77% is a
  MIXTURE; decompose by cause before comparing. Split the **dial residue**
  (~35.7%, named 가안 constants → the registered magnitude pass) from the
  **mechanism residue** (~18.6% → needs an owner).
- Decide whether **ADR 0030** (패권 결정점 / hegemony victory) **ports into `js/`**
  or is **waived** for the slice.
- **Amend ADR 0038** (war-ending composite) — it is L0, falsified by its own
  pre-registered metric 5, currently unamended (follow the ADR supersession
  protocol; a win-condition/cross-feature change → mandatory ADR).
- **Correct R14's "Answered" stamp** (Working layer — it overclaims).
- Design direction floated (crisis pass memory): stall → blank-slate peace +
  **bot war-appetite grill** (why bots don't press a won war). This is a design
  GRILL pass, likely with no ticket yet — you may need to create a tracker/pass
  (compare the crisis-design pass shape).

**Entry points:**
- `.scratch/l3-playable-seam/map.md` § "Gate re-cut" (out-of-band + reduced 08).
- `.scratch/l3-playable-seam/audit/SYNTHESIS.md` (the 2026-07-17 gate audit).
- `docs/features/war-model-build/INDEX.md` (metric 5 parked note).
- `docs/DESIGN-RISKS.md` R14; ADR 0030, ADR 0038.
- Prior handoffs: `.context/handoff-slice2-ticket10-2026-07-16.md` (fizzle
  re-read; crisis overlay ON/OFF decision required before the loop),
  `.context/handoff-war-model-build-2026-07-13.md`.
- Memory: `terrain-game-crisis-design-pass` (R14 pivot), `terrain-game-war-model-build`
  (tickets 01–09 landed; 10 fizzle re-read + 11 stall-timer retirement pending).

**Then gate 08.** `map.md`: "Gate 08 cannot close without it"; "08 → 09/10/11/12
all sit behind it." Gate 08's ticket is `.scratch/l3-playable-seam/issues/08-*.md`
— blocked behind this pass. Do not grill gate 08 before the war-termination pass
gives it something decisive to close on.

## Read order (AGENTS.md) + method

1. `SPEC.md` · `DESIGN.md` · `DOMAIN_MAP.md` · the ADRs that bound the task
   (0030, 0038, and the war-model chain) — read the ones that BOUND it, not just
   recent ones.
2. `.scratch/l3-playable-seam/map.md` (front door) + ledger + audit SYNTHESIS.
3. `docs/features/war-model-build/` + the slice-2 spec.
4. Method: `grilling` + `domain-modeling`, **one question at a time**; the user
   seals every gate (neither rule was overridden). Measurement before assertion
   (`npm run metrics:fizzle`, `npm test`).

## Session mechanics / safety (still bite)

- User viewport **1591 px**; L3 targets desktop/native.
- `/usr/bin/git`; worktree carries the landing-redesign work — stage only by
  explicit path. `docs/teach/` is Sanctuary (do not touch).
- Verification: `npm test`, `npm run lint:docs` (0 blocking at this handoff).
- Static server `python3 -m http.server 8007` may still be up (background task);
  the gate-07 prototype lives at
  `http://localhost:8007/mockup/combat-calc/turn-loop-prototype.html` if the
  user wants to keep feeling it.
- Conversational voice: Korean 존댓말 (해요체); artifacts neutral professional
  English.

## What NOT to do

- Do not re-open gate 07 (sealed; revisable in play, but not this pass's job).
- Do not seal recon economy NUMBERS or the showdown reveal scope here.
- Do not conflate "the interface is fun" (gate 07) with "the war is decisive"
  (this pass / gate 08).
- Do not commit the landing-redesign changes or `docs/teach/`.
