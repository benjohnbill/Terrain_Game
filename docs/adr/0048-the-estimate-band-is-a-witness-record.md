# ADR 0048: The Estimate Band Is a Witness Record, Not a Blur of the Truth

Date: 2026-08-03

Status: Accepted

Decision source: user grill, 2026-08-03, opened to resolve `DECISIONS-OWED.md`
Part 2 #1, #4, #5 and #6 — the fog band blocking L3 build ticket 08. The full
ruling with its reasons is `docs/features/fog-of-war-discovery/RULINGS.md` ③;
the dials are `docs/features/fog-of-war-discovery/MAGNITUDE.md` FG-M①. This ADR
records the cross-feature decision and does not restate either.

- Relationship:
  - **Amends ADR 0020** § Context: its scouting loop stands, but the sentence
    that carries it states the causation backwards and names a retired constant.
    Stamped there.
  - **Amends ADR 0025** § Decision 3: the no-oracle guardrail stands; the
    constant it names as that guardrail is retired. Stamped there.
  - **Implements 노화 헌법 P3** (`docs/features/match-arc/GLOSSARY.md`, MT-①,
    AGREED 2026-07-07). P3 was sealed for fourteen months of project time and
    never implemented; this ADR is what makes it true rather than aspirational.
  - **Applies ADR 0041 §2.** Two of the four conflicts closed by archive
    doctrine rather than by a ruling — see § Context.
  - **Supersedes** the `confidenceGain` block and the confidence-to-band
    conversion dial of `docs/features/combat-formula/MAGNITUDE.md` M8. Stamped
    there; M8's saturation rule is explicitly retained.
  - Not amended, checked and stated so that the next reader does not re-check:
    **ADR 0019** (불확실 = minimum confidence still computes, because confidence
    remains readable per sector), **ADR 0023** (it never says how confidence is
    produced — only that it is a layer over status, which is unchanged), and
    **ADR 0024** (the `confidenceGain` axis survives; only its dial values move).

## Context

Four rows of `DECISIONS-OWED.md` Part 2 recorded the fog band as blocked on
seal-versus-seal conflicts. Three of the four were not conflicts.

**#1 was one position recorded twice.** 노화 헌법 P3 — *"contact reveals the
immutable layer forever, the mutable layer decays"* — and the duel-pivot ledger's
witness-model seal of 2026-07-23 describe the same model sixteen days apart. What
disagreed with both was `js/intel.js`, which passes the **current** true value
into the band on every read. A reading five turns old therefore follows enemy
reinforcement silently: stale intelligence is never wrong, only vaguer. That is a
live feed losing focus, not a snapshot fading, and it is the opposite of what P3
seals.

**#5 and #6 closed by ADR 0041 §2** rather than by a ruling. The four band
constants and `OWNED_CONFIDENCE` live only in the reference archive and in
Working-layer plans; no Production document carries them. There was never a second
seal to weigh — *"the source of truth [is] the contract, not the file."*
`game/src/projection/project.ts` already holds a realm's own state at Exact.

**#4 reduced to one number** once `DECISIONS-OWED.md` R2's linear-commit grammar
was applied, and that number is now sealed at FG-M①.

Three independent findings then converged on replacing the model rather than
picking a side:

1. **The band was invertible from a single observation.** Its width was
   proportional to the true value while both width and confidence were displayed,
   so the true figure solved out exactly. M8's own conversion inverts identically.
   Neither recorded side named this, and it silently defeated gate 03's
   invariant 6 — a preserved residual sliver is worth nothing beside a width that
   gives the answer.
2. **The gap had been papered over with a false reason.** The slice-2 design spec
   claims aging happens *"per 노화 헌법 P3 (`js/intel.js` scalars exist)"*. The
   scalars exist; they do not implement P3.
3. **A protection the project had already paid for was leaking.** Gate 03 §3
   withheld enemy treasury specifically to preserve the 서지 모병 bluff. A band
   that re-centres on current truth reveals the surge anyway.

## Decision

**A viewer's estimate of a fogged quantity is composed from recorded
observations, and the true value never enters the projection function.**

The unit is the **observation testimony** (관측 증언): one act of observation,
recorded as an honest but vague interval that contains the truth, stamped with the
turn it was taken. Testimonies accumulate rather than replace; each is corrected
forward to the present, using bounds derived from what could have changed since,
before the intersection is taken. An ageing testimony widens rather than becoming
false.

Definitions live at `docs/features/fog-of-war-discovery/GLOSSARY.md`; the nine
sealed decisions and their reasons at that feature's `RULINGS.md` ③; the values at
its `MAGNITUDE.md` FG-M①. This ADR adds no definition and no number.

**Why this is architecture rather than a feature ruling.** It changes what a
projection *is* for every consumer of one: the combat preview, the 판세 read, the
bot (which by contract sees exactly what a player sees), and the commit-first UI
shell. It also converts a stored per-sector scalar into a stored per-viewer
record, which is a Runtime state change rather than a display change.

## Consequences

### What this unblocks

- **`DECISIONS-OWED.md` Part 2 #1, #4, #5 and #6 close**, and Part 3's fog
  sub-batch becomes **void rather than pending** — it was excluded pending #5, and
  #5 resolves by those constants never being ported.
- **L3 build ticket 08 has an authoritative contract** for the first time. Its
  remaining gate is Wayfinder 12 (spec partition), not a seal conflict.

### What it costs

- **The Runtime gains per-viewer observation state.** A scalar per sector becomes
  a list of timestamped intervals per viewer per sector. This is new state, and it
  is the price of P3 being real.
- **The forward-correction envelope must be composed, not dialled.** Its inputs —
  the affordability bound's rate term, the casualty curve, march reach — are all
  sealed, so no new dial is introduced, but whether they compose cleanly into a
  conservative bound is an implementation-time verification. Registered in
  `docs/SYNC-DEBT.md`; if the composition fails, the fallback is a dial and that
  is a new decision, not an implementation choice.
- **Containment becomes a property to preserve rather than one to assume.** Every
  stored interval must be true when taken, and every forward correction must widen
  by at least what could have changed. A correction that widens too little makes
  the dealer lie.

### What it sharpens

- **Intelligence decay becomes land-derived.** A sector the enemy can reinforce
  quickly goes stale faster than a remote one, because the envelope reads reach
  and recruitment rather than a uniform per-turn decay. This is the `land-derived`
  identity proposition reaching the information layer.
- **Trend reading becomes possible at all.** The archive stores no history, so
  "it was this, now it is that" could not be expressed. It now can, and enemy
  reinforcement becomes a readable event — for a player who paid to look twice.
- **Gate 03's invariant set gains its missing member.** All seven invariants guard
  against the truth being *present* in a projection; none guarded against it being
  *recoverable*. Invariant 8 is added in the same batch.
