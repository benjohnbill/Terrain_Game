# Part 2 conflict dossier — evidence for the remaining seal-conflict rulings

Assembled 2026-08-05 against `main` @ `4287547`, for `DECISIONS-OWED.md` Part 2
rows **#2, #7, #8, #9, #12**.

**This document is evidence, not authority, and it contains no proposals.** It
records, per row: what each document says verbatim, which is newer by git
history, what cites what, and what the seal chain already constrains. Every
judgment is the user's. RESEARCH layer — an input to a seal, never normative on
its own.

**Why it exists.** All six remaining `l3-playable-build` tickets are
`needs-info`, and every one waits on a decision rather than on implementation
capacity. There is one user, and `docs/agents/issue-tracker.md` allows one
`grilling` ticket per session, so the grills cannot be parallelised. The reading
that precedes them can. This pass does the archaeology so a grill session is
judgment-only.

**Rows closed since assembly, same day.** **#2** — Encirclement threshold, ruled
2.2 as a mis-citation, sealed at `combat-formula/MAGNITUDE.md` M7. **#9** — the
abandonment column comes out, sealed at `combat-formula/MATCHUP.md` § The cede
rule. **#8** — dissolved by #9 rather than adjudicated. **Live: #7 and #12.** This
file stays as the evidence those rulings were made against; it is not amended to
speak as their record, and one of its measured facts is corrected in place below
(row #9, the scorched-string count).

## What this dossier does not cover

| Row | Why not |
|---|---|
| #1, #4, #5, #6 | Closed 2026-08-03 by the fog grill. |
| **#3** — commit marker on the eval bar | **Closed 2026-08-05 by ADR 0052**, during the assembly of this dossier. |
| #10, #11, #14, #15, #16 | Closed. |
| **#13** — 판세 in-play surface | Ticket 04's, and being ruled by the concurrent session that produced ADR 0052. |
| #17 — simultaneous double capital fall | Pinned by the user 2026-08-01; refusal is implemented and tested. |

## Assembly conditions, recorded because they bound what is below

A concurrent session was editing this repository's **main worktree** while this
dossier was assembled, with six files uncommitted: `docs/adr/0052-*.md` (new),
`docs/adr/README.md`, `DECISIONS-OWED.md`,
`issues/04-build-the-commit-first-ui-shell.md`, `issues/09-build-the-eval-bar.md`,
`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`, and
`.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md`.

Two consequences carried into the rows below:

- Row **#3** was `open` when this pass began and `closed` before it ended. The
  row table above records the state at assembly.
- Row **#2**'s ledger side lives in a file that was being edited.

This dossier was written in a separate worktree for that reason.

**Discharged.** That session committed as **`68d1e1f`** (*docs(design): rule
ticket 04's scope, and separate commitment from force*) before this dossier was
finished. Its ledger hunk lands at ~line 437 (the two-bar clause) and does not
touch line 420, so row #2's quotation below is **verified intact at `68d1e1f`**
and is citable there rather than against a moving file. Ticket 04's scoping call
was ruled in the same commit — the ticket **merges** the two shells rather than
adopting or discarding either — and 04 nonetheless remains `needs-info`, because
Part 2 **#13** is still open. The frontier is therefore unchanged by that commit:
ticket 08 takeable, the other six `needs-info`.

---

## Row #2 — Encirclement threshold · tickets 09, 10, 11

**The question as filed:** `MAGNITUDE.md` M7 says **2.2**; the duel-pivot ledger
says **~1.92**, which is the rout-onset figure rather than the threshold.

### Side A — `docs/features/combat-formula/MAGNITUDE.md:404` (M7 table)

> | Encirclement & Annihilation | 2.2 | Only threshold above rout onset (R≈1.92): success arithmetically implies rout, and isolation implies blocked escape — annihilation from the numbers. 항복 수확 discounts winner blood (M6) |

- Last touched **2026-07-03**, `ca213ec` (*combat-formula magnitude pass M1–M11 +
  M12 draft*).
- Layer: **Production**. Per the documentation law's model-doc rule, resolution
  dials live in `combat-formula/MAGNITUDE.md` — this is the owning doc for this
  number.

### Side B — `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md:420`

> (3) operation-plan THRESHOLD needles (신중 압박 ~1.1, 포위 섬멸 ~1.92 = 가안) make the catalog self-teaching (no tutorial).

- Last touched **2026-07-24**, `12cf032` (*close duel-pivot gate 6 — all six
  design gates sealed*). **Newer by 21 days.**
- Layer: **Working** (`.scratch/`).
- Position in its own document: the line is premise **(3)** of the Gate 6 EVAL
  BAR resolution — the clause sealing the in-play tactical bar. Its grammatical
  subject is *which needles the bar draws*, inside a sentence whose predicate is
  "make the catalog self-teaching". It is marked **`= 가안`** in its own text.

### What cites what

- The ledger line pairs 포위 섬멸 with **신중 압박 ~1.1**, which matches M7's
  Deliberate Pressure threshold (1.1) exactly. The ledger was reading M7's table.
- The string **`R≈1.92`** occurs in M7 in the Encirclement row's own note, and in
  M7's D4 discussion at `MAGNITUDE.md:182–183` ("places the rout onset at
  R ≈ 1.92"). It also occurs in M7's Swift Seizure row: "1.5–1.92 = thin take,
  ≥1.92 = shattering take".
- `MATCHUP.md`'s Encirclement row resolves through "isolation gate + D10 cliff".

### What the seal chain already constrains

- M7's note makes 2.2's **position relative to 1.92 load-bearing**: "**Only**
  threshold above rout onset (R≈1.92): success arithmetically implies rout". At
  1.92 the row sits *at* rout onset rather than above it, and the stated
  derivation no longer follows from the stated reason.
- M7 § Toxic band lists **threshold-normalized curves as a rejected fix**,
  because they "scatter rout onset per-plan — destroys Encirclement's above-cliff
  placement". Encirclement's above-cliff placement is named as a thing to protect.
- M7 header: thresholds "price only the method's required superiority", and are
  "scoring lines at resolution, never availability gates".
- Documentation law: "Each feature's dials live in ONE owning model doc … Never
  restate a number outside its owning doc."

### Ticket span

**Three tickets, which is why the handoff calls this the bundle's first item.**
09 draws the needles on the bar; 10 selects among plans by threshold; 11 resolves
the Encirclement row of the matchup matrix.

---

## Row #7 — Plan effect axes · ticket 10

**The question as filed:** ADR 0024 specifies a per-axis magnitude and
*explicitly* rejects a primary/secondary classification; `CATALOG.md` uses
`core` / `secondary` / `none` for all twelve plans.

### Side A — `docs/adr/0024-…:117–120`

> - `effectAxes` — a magnitude per operation effect axis (the six axes above),
>   expressing how strongly the plan works each axis. This is a per-axis magnitude,
>   not a primary/secondary classification: a plan that shifts control moderately
>   while cutting routes strongly is `{controlShift: mid, routeDisruption: high}`,
>   which also avoids arbitrary "is this primary or secondary" authoring calls.

- Last touched **2026-07-02**, `748cd17`. Layer: **Record** (accepted ADR).

### Side B — `docs/features/operation-plan-catalog/CATALOG.md:24`

> Shape notation: `core` / `secondary` / `none` per axis.

- Last touched **2026-07-02**, `898d292` (*author operation-plan catalog seed
  content — 12-plan shape pass*). Layer: **Production**. Used by all twelve plans.

### A third document, newer than both, that names both vocabularies

`docs/features/combat-formula/MAGNITUDE.md` **M8**, 2026-07-03, `ca213ec` — one
day newer than either side:

> Unit system (user-confirmed): `controlShift` and `garrisonDamage` carry NO dials
> … **Their core/secondary shapes remain as identity metadata for fit ranking and
> claim blocks.** Plans carry NO attack-power multipliers — same army, same power;
> method changes requirements (threshold), engagement rules (verbs), and outputs
> (stamps).

This is the newest statement bearing on the row, it is stamped
**user-confirmed**, and it assigns `core`/`secondary` a role — *identity metadata
for fit ranking and claim blocks* — distinct from magnitude.

### What cites what

- ADR 0024 says plan-to-sector fit is "derived at runtime by matching its
  `effectAxes` magnitudes against the target sector's value profile, so the
  recommendation ranking already surfaces fit".
- M8 says `core`/`secondary` serves "**fit ranking** and claim blocks".
- The two sentences name the same function with two vocabularies.

### What the seal chain already constrains

- ADR 0024 **defers magnitude by its own text**: "It deliberately does not fix
  *how strongly* a given capacity commitment converts into applied effect
  magnitude; that commitment → effect-size formula is combat balancing and is
  defined in the numeric combat pass, not here." The numeric combat pass is the
  one that produced M8.
- **No ADR stamps 0024 as amended or superseded.** If the row resolves by ruling
  that M8 amended it, the ADR supersession protocol and the seal-amends-ADR duty
  both apply in the same batch.

---

## Row #8 — Matchup filled-cell count · ticket 11

**The question as filed:** prose says 15 of 21 cells are empty and INDEX says 6
authored; the table renders 12 filled and 9 empty.

### Side A — the prose, `MATCHUP.md:85–87`

> Cells record deviations from `engage`-everything; an empty cell means the plain
> D6 formula runs — 15 of 21 cells are empty by design (sparse principle). Status
> marks: ✅ user-confirmed shape; ◻ proposed, pending.

### Side A′ — `docs/features/combat-formula/INDEX.md:38`

> matchup matrix shaped 21/21 (6 authored cells + 15 derived-by-design; `MATCHUP.md`)

Note the word: **"derived-by-design"**, not "empty".

### Side B — the table itself, counted at assembly

| attack plan | Stronghold | Delaying | Str. Abandonment | marked |
|---|---|---|---|---|
| Swift Seizure | — | ✅ `refuse` | ✅ `refuse` | 2 |
| Deliberate Pressure | — | — | ✅ `refuse` | 1 |
| Flanking Breakthrough | ✅ `discount fortification` | ✅ `discount escape` | ✅ `refuse` | 3 |
| Raid | ✅ `bypass fortification` | — | ✅ `refuse` | 2 |
| Supply Interdiction | — | — | ✅ `refuse` | 1 |
| Encirclement & Annihilation | — | ✅ `bypass escape` | ✅ `bypass escape` | 2 |
| Crossing / Landing | — | — | ✅ `refuse` | 1 |
| **total** | **2** | **3** | **7** | **12** |

**12 marked, 9 em-dash, 21 total.**

### Git history does not separate the two sides

Prose (`MATCHUP.md:86`), table (`MATCHUP.md:96`) and the INDEX line
(`INDEX.md:38`) were **all last touched by the same commit**, `1528575`,
**2026-07-03** (*combat-formula structural pass D1–D11*). This is an internal
inconsistency inside one authoring pass, not drift between two dates. No
"which is newer" answer is available here.

### The arithmetic reconciles exactly under one reading

Of the 12 marked cells, **six read plain `refuse` with no further terms** — Swift,
Deliberate, Flanking, Raid, Supply Interdiction and Crossing, all against
Strategic Abandonment. The seventh cell in that column (Encirclement) reads
`bypass escape`, not plain `refuse`.

- Counting those six as **derived rather than authored** gives **6 authored / 15
  derived** — the prose's and INDEX's exact numbers.
- Counting a ✅ mark as **filled** gives **12 / 9** — the row's numbers.

Textual support exists on both sides, and neither reading is unsupported:

| Reading | Its support in the document |
|---|---|
| 6 / 15 (plain `refuse` is derived) | INDEX's word is "derived-by-design", not "empty". The legend defines ✅ as "user-confirmed **shape**" — a status mark, not an authorship mark. |
| 12 / 9 (✅ means filled) | "an empty cell means the plain D6 formula runs" — a `refuse` cell does **not** run the plain D6 formula. |

### Coupling to row #9

The six cells that decide this count are the six that row #9 asks whether the
column should exist at all. **Ruling #9 first changes #8's arithmetic; ruling #8
first does not change #9's question.** If the Strategic Abandonment column comes
out, the matrix becomes 7×2 = 14 cells with 5 marked and 9 em-dash.

---

## Row #9 — the matrix's third defence column · ticket 11

**The question as filed:** `MATCHUP.md` carries a "Strategic Abandonment" defence
column against which six cells resolve `refuse`; `CATALOG.md` says "Abandonment is
a declaration, not a plan."

### Side A — `MATCHUP.md:82–83, 88`

> Rows: the 7 attack plans. Columns: the 3 defense plans (non-combat plans do not
> contest; an undefended/unattended sector defends at baseline lever ×1).

and the column header itself: `| attack \ defense | Stronghold Defense | Delaying
Defense | Strategic Abandonment |`

- Last touched **2026-07-03**, `1528575`. Layer: **Production**.

### Side B — `CATALOG.md:723–737`

> ### Strategic Abandonment (전략적 포기) + Scorched Earth (청야 소각) — shape COMPLETE
>
> **Two-tier structure (user-confirmed 2026-07-02).** Abandonment's value is
> *saving the action*, so a turn-consuming abandonment plan would be a
> self-contradiction. The card therefore splits:
>
> - **Abandonment is a declaration, not a plan.** Free — the command card's
>   explicit "cede this sector" acknowledgment. Zero commitment is locked and the
>   primary action stays free for elsewhere …
> - **Scorched Earth (청야 소각) is the real plan.** Burning is work; it consumes
>   the turn.

- Last touched **2026-07-02**, `898d292`. Layer: **Production**. Carries a
  **user-confirmed** stamp; the MATCHUP column does not.

### Which is newer

**MATCHUP (2026-07-03) is one day newer than CATALOG (2026-07-02)** — so on date
alone the column post-dates the two-tier ruling. Against that, the CATALOG clause
carries an explicit user confirmation and the column carries none.

### Measured facts

- **`Scorched Earth` / `청야` appear 0 times in `MATCHUP.md`** (6 times in
  `CATALOG.md`). The matrix carries the tier CATALOG calls a *declaration* and
  omits entirely the tier CATALOG calls *the real plan*.

  > **Corrected 2026-08-05 (the grill that closed this row). The string count is
  > right and the sentence it supports is misleading.** `MATCHUP.md` references
  > the scorched tier twice by concept — "scorched variant leaves nothing to loot
  > (derived)" in the Raid × Abandonment cell, and "scorch to lure" in the
  > escape-hunting family's Moscow-trap chain. So the matrix was **not unaware**
  > of the second tier; it knew both and gave a column only to the declaration.
  > That is a weaker version of this bullet's argument and a stronger version of
  > the row's: an author who knew the two-tier split still drew one column, which
  > points at the column being a habit rather than a ruling. Searching for
  > canonical names alone is what produced the misleading form — the vocabulary
  > filter of the survey-silence guard, exactly.
- **The matrix's own cell text uses CATALOG's word.** The Encirclement ×
  Abandonment cell reads: "✅ `bypass escape` (isolated: **the abandonment
  declaration itself is impossible**)".

### What the seal chain already constrains

- `MATCHUP.md`'s own column note: "**non-combat plans do not contest**".
  Abandonment locks zero commitment and consumes no action.
- `MATCHUP.md` § Confirmed: the escape-hunting family (2026-07-03) treats
  Abandonment as one of the two refusing defences that sell escape — "The escape a
  refusing defense sells (Delaying Defense, Strategic Abandonment: 'the force gets
  away') is a **default, not a guarantee**" — and names the counterweight it
  exists to provide: "without it, refusal plans are risk-free and over-selected".
  Whatever replaces the column must keep that counterweight somewhere.
- `CATALOG.md:591` and `:641` treat Abandonment as a live option in the defence
  comparison ("Delaying sells it slowly, Abandonment cedes it outright"), so
  CATALOG does not treat it as absent — only as not-a-plan.

---

## Row #12 — Bot decisiveness ladder · ticket 12

**The question as filed:** `tactical-plan-ai` RULINGS ranks vassalization as the
top rung; ADR 0042 retired settlement as a terminus entirely.

### Side A — `docs/features/tactical-plan-ai/RULINGS.md:16–22`

> | Rung | Meaning | Plans |
> | 5 Vassalization (속국화) | surrender harvest folds the opponent | Encirclement |
> | 4 Annihilation (섬멸) | enemy field army destroyed, cannot rise | Flanking |
> | 3 Advance (전진 = occupation) | take ground | Swift, Crossing …, SI … |
> | 2 Erosion (침식) | grind the walls for a later turn | DP |
> | 1 Loot (약탈) | blood without folding the board | Raid |

### Side B — ADR 0042 (the duel pivot) retired the settlement terminus

### This row differs in kind from #2, #7, #8 and #9

**The birthplace has already stamped itself**, at `RULINGS.md:171–175`:

> **Consequence for ruling ①.** The decisiveness ladder's top rungs
> (vassalization, annihilation) are multipolar-era objectives that ADR 0042
> retired with the settlement terminus. Re-cutting the ladder for a
> single-terminus duel is **open**, registered in `docs/SYNC-DEBT.md`; this ruling
> does not settle it.

So this is not two documents unaware of each other. The conflict is
**acknowledged at its birthplace and deliberately left open**. What is owed is the
re-cut, not the discovery — which is why it does not bundle with the four
archaeology rows above.

One detail the Part 2 row does not carry: the birthplace stamp names **two**
rungs as multipolar-era (vassalization *and* annihilation), while the Part 2 row
names only vassalization.

### What the seal chain already constrains

- The ladder is **ordinal, not scalar**: "Among *eligible* plans whose judged R
  clears the plan threshold, pick the highest rung; break ties within a rung by
  judged margin (R − threshold)."
- Raw margin maximization is **rejected** as objective, by name: "DP's low
  threshold 1.1 would always win — reproduces the grinding freeze as 'judgment'".
  A re-cut that collapses the ladder toward margin re-opens a rejected option.
- Rung 5's plan is **Encirclement**, whose threshold is row #2's open question, and
  rung 3 names Swift and Crossing, whose thresholds M7 also owns. **Row #2 is
  upstream of this one.**

---

## Reading order the evidence suggests

Stated as a property of the evidence, not as a recommendation about sessions:

- **#2 is upstream of #12** (rung plans are threshold-gated) and touches 09/10/11.
- **#9 is upstream of #8** (the column's existence sets the count).
- **#7 has a candidate resolvent already in the chain** (M8, newer than both
  sides, naming both vocabularies) — the reading to check first is whether M8
  amended ADR 0024, which is a Record-layer question with a stamping duty
  attached.
- **#12 needs no archaeology** — its birthplace already recorded the conflict and
  left it open.
