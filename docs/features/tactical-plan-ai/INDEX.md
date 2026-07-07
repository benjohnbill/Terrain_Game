# Feature: Tactical Plan AI (L2 bot plan judgment)

## Status

Design SEALED (user grill, 2026-07-08). Implementation COMPLETE (TDD:
`mockup/combat-calc/plan-ai.js` pure module + `tournament.js` wiring,
S0 script path untouched; 141 tests green). Battery RUN 2026-07-08
(90,180 matches): **freeze absorption +0.8pp only — the structural
freeze is not a bot-can't-fight artifact; hegemony ADR conclusion
stands.** Full evidence: `research/battery-run-2026-07-08.md`.

## Scope

Replace the L2 harness bot's scripted plan choice (Swift/DP only, fixed
stage script in `mockup/combat-calc/tournament.js warBattle`) with
judgment: given a battle situation, the bot picks the highest-value
eligible plan among all seven (Swift / DP / Raid / SI / Crossing /
Flanking / Encirclement), reading enemy strength through the same
information model a player has (fog estimate ranges).

Attacker-side only this pass. Defender devices (delaying, reserve
awakening) stay dormant — see Ruling ⑥ honesty riders.

## Files

- `RULINGS.md` — the six sealed rulings from the 2026-07-08 grill
  (decision record; authoritative).
- `GLOSSARY.md` — feature terms (decisiveness ladder, disposition dial,
  control-arm names).
- `BATTERY.md` — the sealed L2 measurement design (arms, outcome axes,
  pre-registered comparisons). The basis sheet for interpreting any data
  produced by this battery.

## Why this exists (context)

The freeze autopsy (terrain-fidelity session, 2026-07-08) decomposed the
structural freeze (~80%) and flagged that the bot never uses decisive
plans (Flanking annihilation, Encirclement surrender-harvest) — exactly
the vassalization/board-collapse axis the autopsy said was missing. This
feature tests whether the "structural freeze" is a bot-can't-fight
artifact before committing to the (larger) hegemony ADR. Handoff:
`.context/handoff-2026-07-08-tactical-plan-ai.md`.

## Open questions (parked)

- Defender-side judgment pass (delaying ladder, reserve triggers) — own
  grill; see Ruling ⑥ verdict rule for when it becomes mandatory.
- Commit optimization (fixed 8/14 today) — handoff item ④, separate knob.
- Archetype → disposition assignment for the real game (the D arm sweeps
  all 3⁵ assignments, so the harness needs no assignment decision).
- Scouting-action modeling (confidence is a harness parameter, not an
  earned resource) — future pass.
