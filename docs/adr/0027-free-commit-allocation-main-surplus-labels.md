# ADR 0027: Free Commit Allocation — Main/Surplus Are Magnitude Labels, Not Fixed Action Roles (Amends ADR 0020)

Date: 2026-07-07

Status: Accepted
Amends: ADR 0020 (2026-07-01) — its "the turn's primary action" plus "surplus outlets are the friendly-direction activities" wording is reframed: main/surplus are post-hoc labels by commit magnitude over a freely-split pool, not fixed roles bound to activity types (see § Decision).

## Context

ADR 0020 established the single, no-carryover, divisible action-capacity
pool (20 points/turn) as MVP core. Its language, however, reads as a
*structural role assignment*: "the turn's **primary** action commits a
variable amount" and "**surplus outlets** are the friendly-direction
operation activities (scouting, economy/recovery, defensive build) plus
reserve." That phrasing tags an activity as either the primary (the main
operation, implicitly the battle commit) or a surplus outlet.

The match-tilting recovery-dial grill (2026-07-07) exposed the gap.
Garrison regeneration (M12-1) was the last force-shaping activity still
modeled as automatic/free; folding it into commit-gating forced the
question "is regen a primary or a surplus outlet?" — and that question is
malformed. The user's actual model of the pool is simpler and floating:

> A turn permits ~1–2 actions. Whichever gets the larger commit we *call*
> "main"; the smaller we *call* "surplus." The label is applied by commit
> magnitude after the fact. The activity — an operation plan, a
> recruitment, a repair — carries no intrinsic main/surplus tag. 12:8 was
> found to be a good R-value balance for a 2-action turn, not a fixed rule.

This is consistent with the M1 commitment-horizon lens, which already
frames the turn as free allocation of the liquid pool between today's R
and tomorrow's R; only ADR 0020's own wording lagged.

## Decision

1. **Main/surplus are magnitude labels, not roles.** Every activity —
   battle/operation commit, recruitment, garrison regeneration,
   fortification, economy recovery, scouting, reserve — draws from the one
   20-point pool. The activity given the larger commit that turn is
   "main," the smaller "surplus." The label floats with the numbers; no
   activity type is intrinsically one or the other.

2. **Action count is soft-capped by the M2 knee, not a hard rule.** The
   lever knee (8) makes ~2 above-knee commits the natural turn (e.g.,
   12:8); finer splits (7/7/6…) fall below the knee and buy poor R,
   self-discouraging. There is **no hard maximum-action-count rule.**
   Deliberate fine-slicing — many cheap sub-knee commits — is a
   **legitimate, self-penalizing play**: the player owns the judgment, and
   the knee (not a rule) governs the trade. If any allocation pattern
   proves over-efficient, it is corrected by an L2/L3 balance patch, never
   by a structural gate.

3. **No force-shaping activity is applied without commit (bottom 0).** A
   garrison, a field army, a fortification does not build or re-man itself;
   each requires committed attention from the pool. This closes the
   garrison-regeneration gap: regen ceases to be automatic. The boundary is
   force-shaping *acts* by the nation, not the world's *ambient flows* —
   the already-sealed passive world-pulse (standing usable-recovery floor
   M12-5, confidence decay M12-3, authored attrition M12-4, register death)
   is not a force-shaping act and remains passive.

## Considered Options

- **Keep ADR 0020's fixed-role wording:** rejected — it contradicts the
  actual pool model and manufactured the malformed "regen: primary or
  outlet?" question.
- **Add a hard maximum-action-count rule (e.g., "at most 2 actions"):**
  rejected — redundant with the knee, and it would outlaw legitimate
  breadth plays (three cheap commits against undefended sectors where a low
  R still wins is a valid read of the board, SPEC pillar 2–3 skill).
- **Give garrison regen a small passive floor (local trickle) mirroring
  M12-5's standing +10pp:** rejected for MVP — a fortress re-mans only when
  the nation sends bodies; a passive floor would leak the recovery throttle
  this decision is meant to create. Revisit only if L2 shows the pool
  cannot heal a single-front realm at a reasonable pace.

## Consequences

- ADR 0020's "primary action" / "surplus outlets" language now reads as
  *descriptive of the common 2-action turn*, not a structural assignment.
  ADR 0020's Decision section is unchanged (supersession protocol: no
  silent edit); this ADR carries the reframe and 0020's header is stamped.
- **MT-③ surge draft becomes a plain instance:** "surge" = a large commit
  poured into recruitment, which makes it the turn's main and starves the
  other activities. No special surge mechanism beyond commit magnitude is
  needed; MT-③'s "surge with surplus commit points, starves scouting/
  reserve/building that turn" is exactly this model.
- **Garrison regeneration (M12-1) moves from automatic to commit-gated,
  bottom 0.** The +10%/turn rate becomes the amount purchased per commit
  *where committed*; recovery is now throttled by attention scarcity — a
  multi-front bled realm cannot re-man every shattered garrison. Whether
  this throttle alone converges the frozen world, or a rate re-cut / blinds
  device is still needed, is the match-arc recovery-dial pass's L2
  measurement. This ADR settles the *structure*; the numeric pass owns the
  dials.
- **MT-② two-stocks invariant preserved:** the model is pure allocation of
  the existing 20-point pool — no new stored state.
- Doc-sync owed: DOMAIN_MAP `Action capacity` entry refreshed to the
  floating-label framing; the garrison-regen commit-gating recorded as a
  match-arc recovery-dial ruling that cites this ADR and amends M12-1.
