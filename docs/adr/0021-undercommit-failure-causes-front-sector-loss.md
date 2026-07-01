# ADR 0021: Under-Commitment Failure Causes Front-Sector Loss

Date: 2026-07-01

Status: Accepted

## Context

ADR 0020 made minimal action-capacity divisibility part of the MVP core: the
player can commit less than the statistical-average recommendation to a primary
action and redirect the surplus. That efficiency loop needs a real downside, or
under-committing becomes a free optimization. Two outcomes were considered for
failed under-commitment: gradual damage to forces/economy, or immediate loss of
the contested front sector.

## Decision

If the player under-commits to a contested defense and the resolution fails, the
contested front sector is lost rather than merely taking gradual damage.

This keeps the turn-based MVP legible and makes deliberate sacrifice a real
strategic choice: commit enough to hold, commit tightly and risk collapse, or
commit zero and intentionally cede the sector to invest the surplus elsewhere.
Scouting and forecast confidence must make the risk skill-piercable rather than
fate-driven; the player should be able to narrow the estimate band before
choosing how much capacity to commit.

## Considered Options

- **Gradual damage only:** rejected — softer, but it blurs the meaning of
  sacrifice and encourages repeated low commits as an expected-value tactic.
- **Immediate front-sector loss:** accepted — sharper, easier to read in a
  simple turn-based game, larger than one hex, smaller than a named province, and
  better aligned with ADR 0020's surplus-redirection loop.

## Consequences

- The commit slider must show the forecast band and information confidence
  clearly enough that failure reads as a chosen risk.
- Scouting becomes the main way to reduce unfairness: higher confidence narrows
  the estimate band and reduces the safety margin needed to hold.
- Sacrifice becomes an explicit tactic: ceding a low-value front sector can be
  correct when the redirected surplus creates a better outcome elsewhere.
- Result reporting should show both the direct sector outcome and the resulting
  province-level summary change, such as "south-bank sector lost" plus
  "Jiangnan Granary: border → split."
