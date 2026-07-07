# Rulings — Fog of War and Discovery

## ① Wall grade is public information — SEALED 2026-07-08 (user grill, tactical-plan-ai session Q3)

The design spec (2026-07-01, §4) classifies occupant information into
presence / identity / magnitude but never classifies fortification
grade — a genuine gap (verified: zero fort mentions in the spec; no
visibility clause in SPEC.md, DOMAIN_MAP.md, or any ADR).

**Ruling**: fortification grade (fieldworks / walls / fortress /
legendary) is classified with terrain — always visible, at every
confidence level. Physical structures are visible from outside; the
hidden quantity is how many defenders man them, which the magnitude
estimate band already covers.

Rejected alternative: blurring wall grade too ("the fort was harder
than it looked"). Reasons: it makes eligibility/threshold arithmetic
probabilistic (muddying the tactical-plan-ai freeze experiment, whose
design wants all misjudgment concentrated in magnitude), and it
contradicts physical intuition. Revisit candidate as Challenge-fog
flavor only.

First consumer: the L2 bot information model
(`docs/features/tactical-plan-ai/RULINGS.md` ③ — bot sees exactly what
a player sees).
