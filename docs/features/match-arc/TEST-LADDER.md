# Test-Trust Ladder — Verification Epistemology

Adopted 2026-07-05 (A-2 session); L2 charter user-directed 2026-07-05
(evening session, after sheet 12). This document is the single home of
the ladder and of the L2 charter. `GLOSSARY.md` holds the term row;
`STRATEGY-SPACE.md` and battery NOTES reference this file.

## The ladder

| Rung | Instrument | What it can establish |
|---|---|---|
| L0 | Hand reasoning | The arithmetic is coherent; a worked example behaves |
| L1 | Decision grids (battery sheets 1–11) | ONE decision, computed end-to-end, matches its sealed shape |
| L2 | Match tournament (sheet 12, `tournament.js`) | FREQUENCIES under interacting agents: dominance existence, closure rates, preset usage, ending shapes |
| L3 | Human playtest | Fun, tension, skill expression, actual human choices |

Each rung inherits the ones below: an L2 result that contradicts an L1
grid is a harness bug until proven otherwise.

## L2 charter — what sheet-12-class evidence is and is not

### What L2 is

Deterministic, seeded policy-bot simulation over the sealed arithmetic
(`engine.js` + `match.js` mirrors). Bots act on **true values with
perfect information** — no fog, no estimates, no deception. Its outputs
are **model-derived frequencies, not measurements of play**: the same
epistemic family as simulation-based tuning, not observed data. Every
number that comes out of L2 carries the model's assumptions in.

### Proof power is asymmetric (the standing rule)

1. **Found at L2 = real.** A dominance, an exploit, or a closure
   failure that appears under bot play exists in the arithmetic — a
   human can find it too. This is the evidence class that may justify
   a seal (ruling ⑮ static-cap deadlock; ruling ⑯ premium floor).
2. **Not found at L2 = nothing.** Bot policy quality bounds proof
   power. Absence of dominance is never evidence of balance.
3. **L2-derived values are never final.** L2 evidence can promote a
   가안 to sealed-with-provisional status; every such seal remains
   playtest-provisional by construction. No L2 result closes a
   question that belongs to L3.
4. **Found against a strawman = also nothing.** Rule 2's mirror for a
   mechanic-under-test: a mechanic that SUCCEEDS against an opponent that
   cannot respond to it — a passive defender, a weaker configuration, a
   placeholder — has beaten a strawman. Such a positive can only
   FALSIFY (fail against the easiest target → kill it), never CONFIRM.
   Confirmation requires the opponent's response modeled AND a baseline
   to read the delta: measure minimal→responsive, and read the
   sophisticated result only as a delta off the minimal. Building the
   mechanic and its opponent-response bundled together is a confound —
   isolate, then add. (Sharpened 2026-07-09, force-geography (b) grill:
   the reactive-reserve / (최소)→(정교) discipline, force-geography
   RULINGS FG-④/⑤/⑨.)

### What L2 is blind to, by design

Perfect information removes exactly the layer the human game is made
of: fog misreads, the value of scouting, bluff and deception, timing
reads, blinds pressure, tension, fun. **Every behavior the harness had
to invent to make matches move is a named placeholder for a
human-facing system** and is tracked as such:

| Harness placeholder (`tournament.js`) | Stands in for |
|---|---|
| Opportunism read (pinned army → screen+garrison is the checked shield) | Fog misjudgment + windows read through scouting |
| Idle aggression (at-cap, idle, lower ratio) | Blinds pressure + uncertainty-duel escalation (ADR 0025) |
| Fixed archetype policy dials (§BOT) | Human strategic adaptation |
| Deterministic concession ladder | Negotiation reads, bluffed resolve |

A placeholder is never a seal candidate. When the real system it
stands in for gets designed, its L2 test is: **remove the placeholder,
model the system, and check the board still moves.**

### The negative-space findings (what the freeze taught)

Sheet 12's deterrence freeze — perfect-information bots at parity never
attack — is itself evidence about two undesigned systems:

- **Fog / scouting**: information uncertainty is what generates attack
  opportunities and misjudged wars. L2 proves the sealed arithmetic
  alone does NOT produce wars between healthy peers; war frequency is
  carried by the fog layer. Scouting's product is precisely the thing
  L2 bots get for free (true values) — its price is the band width.
- **Blinds**: the frozen board is the default equilibrium; the blinds'
  design duty is to break it (tax slowness, induce attack). Registered
  L2 acceptance test for the future blinds design: matches must move
  without the idle-aggression placeholder.

### Secondary use — archetype pre-screening

The six STRATEGY-SPACE archetypes can be pre-screened at L2 before any
human validation, with one reading rule: an archetype's L2 failure is a
design smell **only if its identity does not depend on what bots
lack**. Current screen (2026-07-05, A-3-coupled world): snowball /
vassal-chain / interior-lines arithmetically viable (win at L2);
shield-first marginal; free-rider and raid-attrition win 0% — NOT a
failure signal, because their identities (timing reads, burn-then-
strike conversion) live exactly in the placeholder list. Those two are
the standing L3 watch items.

### Why this charter exists

Fixing what L2 claims makes the L3 delta measurable: when human
playtest diverges from L2 frequencies, the divergence localizes to the
placeholder table above — that gap IS the measurement of how far the
system sits from human-felt fun, and which missing system owns it.
