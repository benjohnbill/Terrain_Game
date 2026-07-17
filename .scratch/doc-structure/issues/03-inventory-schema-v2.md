# Inventory schema v2 — enum discipline, alias typing, promotion state

Type: grilling
Status: resolved

## Question

Settle `docs/audits/term-inventory.json`'s schema against the drift observed
2026-07-15 — the exact decay class the 2026-07-10 cold review predicted
("enum/schema discipline on incremental patches, which no check enforces").

Items to rule on:

1. **Status enum** — law dictionary is 3-valued
   (`AGREED`/`PROPOSED`/`rejected-recorded` ≡ ✅/❓/⛔). Live data: `SEALED` ×10,
   `AGREED-concept` ×2, `AGREED-structure` ×1, `가안` ×1, `SUPERSEDED` ×1;
   `rejected-recorded` has zero rows ever. FE-4 recurrence. Legalize an
   extended enum (is SEALED a real status distinct from AGREED?) or normalize
   rows back to the dictionary?
2. **Kind domain** — HARVEST §4 defines `mechanism`|`meta`; live data adds
   `mechanic` ×2, `state` ×2, `strategy` ×1 — these rows cannot be
   dictionary-routed (breaks S1 dual-dictionary routing).
3. **Verdict enum leak** — `standard-term` ×2 outside S7's set.
4. **Alias typing** — `aliases` is an untyped grab-bag holding ≥7 relation
   kinds (old names, Korean 구칭, retired names with status smuggled into the
   string — `"dissonance (retired)"` — enum members, instances, code
   identifiers, formula shorthand, cross-doc refs). The 구칭 marker is
   destroyed on ingest (grep 구칭 over the JSON: 0 hits, while birthplace
   GLOSSARYs carry it). Type the relations, or keep the grab-bag and accept
   the loss?
5. **Promotion state** — a term promoted to a Tier-0 DOMAIN_MAP summary is
   byte-indistinguishable from an unpromoted one (the three 2026-07-07
   promotions all sit at tier=1, correctly per the law, but nothing records
   "has a Tier-0 summary entry"). Add a field, or leave promotion state to
   QUICKREF prose?

## Absorbs

SYNC-DEBT "term lifecycle beyond promotion" row (Codex P1, :423 — proposed →
agreed → promoted → renamed → deprecated; "renames are the dangerous case for
agents") and the adjacent alias-field row (Codex P2, de-facto satisfied but
never closed). Resolving this ticket should close or restate both rows.

## Constraints

- S6: rows carry machine-checkable metadata only — never definition text.
- HARVEST two-mode model: `verdict`/`verdictRef` are audit-owned
  (carry-forward or null), never hand-set.
- Whatever schema is chosen must be enforceable by a Layer-0 check
  (`checkBaselineSelf` extension — feeds ticket 09), or it will decay again;
  that is the lesson of FE-4 recurring within 5 days of incremental patching.

## Output

Schema v2 decision + HARVEST §4 amendment draft (user seals) + enum-check spec
feeding ticket 09 + migration plan for off-enum rows feeding ticket 10.

## Evidence

`research/inventory-schema-survey.md` (full schema archaeology, distributions,
verbatim rows) · `research/design-history-survey.md` (S-codes, FE-4, cold
review).

## Answer (2026-07-15)

> **Corrections applied 2026-07-15 after adversarial review**
> (`docs/audits/2026-07-15-doc-structure-review.md`). The measurements below all
> verified exact (260 / 18 off-enum / SEALED ×10 / 39 verdict-null / 235 AGREED /
> 구칭 0-hits / the law self-contradiction, both sides verbatim) — this was the
> cleanest of the six tickets on facts. Three defects, corrected in place:
>
> 1. **Citation (FE-1 class)**: the lifecycle row is at `docs/SYNC-DEBT.md:291-295`,
>    **not** ":423" (which is force-geography terrain-fidelity content). And there
>    is **no "adjacent alias-field row"** — the P2 alias ask is the trailing
>    sentence of the same bullet.
> 2. **"Closes SYNC-DEBT :423" is withdrawn → NARROWED.** A ruling that declares
>    itself "void without ticket 09" cannot close a debt. The row asked for
>    lifecycle states **in the Vocabulary Law** (this ruling *rejects* the enum —
>    soundly, but rejection ≠ satisfaction) and an alias field **in the glossary
>    schema** (this delivers it in the JSON index, a different surface — proven by
>    this ticket's own evidence that 구칭 lives in the GLOSSARYs and not the JSON).
>    Disposition: **restate the row as partially-satisfied-by-v2**, itemising what
>    remains (lifecycle definition in law; `promoted` derivation is "optional, at
>    09's discretion" = undelivered; `SUPERSEDED`→`rejected-recorded` deferred to
>    run #3).
> 3. **The handoff to ticket 09 is incomplete and blocking** — see the reviewers'
>    C-3. Typed aliases break three live readers: `buildNameIndex`/`nameSet`
>    **throw** (lint crashes → write-lint injects a stack trace on every governed
>    edit); `alias-inject findMatches` **throws and is swallowed** (hook dies
>    silently for the session); `checkBaselineSelf` **silently returns clean**
>    (new false negative). 88 rows / 169 strings. Ticket 09 is BLOCKED until this
>    handoff lists every reader and the migration's dual-shape tolerance.
>
> **Unresolved, carried to the re-grill or to 09/10**: `CONFIRMED` is named in the
> law's seal triad but absent from the extended dictionary, so "resolves the law's
> conflict" is half-done (H-?); the `✅` marker hole (`s !== 'PROPOSED'`) means
> `SEALED` **already passed** before this ruling — Q1 fixes a real law conflict but
> buys zero mechanism; and after migration all 260 rows are in-domain and the lint
> is green over data whose seal state is unverified for ~90% of rows (M-14).

**Schema v2 — sealed with one binding condition.** Measured drift at ruling
time: 18 off-enum rows of 260 (status: `SEALED` ×10, `AGREED-concept` ×2,
`AGREED-structure`, `가안`, `SUPERSEDED`; kind: `mechanic` ×2, `state` ×2,
`strategy`), 9 of the 18 born at `force-geography/RULINGS.md`.

### ⚠ Binding condition — the ruling is void without it

**This schema is only valid if ticket 09 implements an enum-enforcing check.**
Not optional hardening: the required completion of this ruling. The evidence
is this repo's own: the cold review flagged the status enum (FE-4) on
2026-07-10, and it had **recurred and worsened within 5 days** — because no
check enforces the domain. The forensics measured the same law elsewhere:
*"Hand-slimming works but decays — the discipline does not survive without a
mechanical check."* A dictionary without a check is a dictionary that drifts
again by next week.

### Q1 — status: `SEALED` is a real value, not drift → EXTEND the dictionary

Register `SEALED` as a fourth status value, defined as the **strong form of
`AGREED`**:

> `AGREED` — the name is settled. `SEALED` — the name is settled **and** its
> ruling carries a dated seal with a verdict source (the seal triad).
> **SEALED implies AGREED.**

Why extend rather than normalize:
- **The law already contradicts itself here.** Seal mechanics names `SEALED` a
  status word ("status word (SEALED/AGREED/CONFIRMED) + date + verdict
  source"); Vocabulary Law's dictionary lists three values that exclude it.
  The inventory is caught between two clauses of one law, forcing two axes
  (term status vs. ruling status) into one field. Extending resolves the
  law's own conflict; normalizing would suppress the symptom.
- **9 of 10 `SEALED` rows come from one birthplace** — consistent authored
  intent, not typos.
- **Normalizing does not remove the pressure** that produced the value, so it
  would re-drift (FE-4's 5-day recurrence is the proof).
- **Rejected — a separate `sealState` field (2 axes, 2 fields):** YAGNI. The
  axes are not independent in practice; all 10 `SEALED` rows mean
  "agreed AND sealed". One field with an implication rule covers it.

Honesty note for run #3: this makes *future* rows precise. It does not tell us
how many of the existing 235 `AGREED` rows in fact carry a seal — that is
audit work, not a schema property.

Remaining status strays (`AGREED-concept` ×2, `AGREED-structure`, `가안`) →
normalize at run #3; `SUPERSEDED` → see Q2.

### Q2 — lifecycle: type the aliases; rename/retire is a property of the NAME

```json
"aliases": [{"name": "dissonance", "rel": "retired"},
            {"name": "인력 풀",     "rel": "구칭"},
            {"name": "manpower pool", "rel": "synonym"}]
```

`rel` domain: `구칭` (pre-rename name) · `retired` · `synonym` · `code`
(code identifier) · `member` (enum member) · `ref` (cross-doc reference).

- **Fixes a live, observed failure.** `aliases` is an untyped grab-bag of ≥7
  relations, and the `구칭` marker is destroyed on ingest (grep `구칭` over the
  JSON: 0 hits, while the birthplace GLOSSARYs carry it). Status smuggles into
  the string: `"dissonance (retired)"`. In THIS session the `alias-inject` hook
  surfaced `"dissonance (retired)" → Leak-through` and
  `"unassailability" → Hegemony decision point` as undifferentiated
  "aliases" — it cannot distinguish "this name is retired, use the canonical"
  from "this is just another way to say it". That is exactly Codex P1's
  warning: *"renames are the dangerous case for agents."*
- **Right axis**: `Leak-through` is a live AGREED term; what retired is the
  *name* `dissonance`, not the concept. So retirement belongs on the alias,
  never on the term's status.
- **`SUPERSEDED` ×1 (Blinds)**: if the concept itself is dead, its home is
  `rejected-recorded` (⛔) — a dictionary value with zero rows to date.
  Confirm at run #3 before moving.
- **Rejected — Codex P1's full lifecycle enum on `status`**
  (`proposed→agreed→promoted→renamed→deprecated`): it would put `SEALED`
  (agreement axis) and `renamed` (name axis) back in one field — re-creating
  the exact collision Q1 just resolved. The lifecycle is satisfied by typed
  aliases (rename/retire) + Q3 (promotion) + status (agreement), each on its
  own axis. **Closes SYNC-DEBT :423** (term lifecycle + alias field, Codex
  P1/P2) — restate it as satisfied-by-v2 rather than leaving it open.

### Q3 — promotion state: DERIVE, do not store

No `promotedTo` field. Promotion is computed: **a `tier=1` term whose
`canonical` also appears as a DOMAIN_MAP header is promoted.**

- `checkHeaderDiff` **already scans every DOMAIN_MAP header** — the fact is a
  by-product of data the lint holds. A field would be a second copy of a
  derivable truth (M-04), hand-patched, and thus drifting by next week.
- The current state is **not a bug**: the three 2026-07-07 promotions sitting
  at `tier=1` is the law working as written ("promotion adds a Tier-0 summary;
  the feature doc stays authoritative"). Only the by-product was missing.
- Bonus: ritual duty 2's promotion scan (pure honor-system today — the duty
  the law records as historically missed) becomes mechanizable with no schema
  change. Optional report line in ticket 09, at 09's discretion.

### Q4 — kind: normalize the typo, queue the judgments

- `mechanic` ×2 → `mechanism`. A typo fix is not a judgment.
- `state` ×2, `strategy` ×1 → **run #3's judging queue** (ticket 10). These
  need a dictionary-routing call (S1: `mechanism`→genre lexicon,
  `meta`→design theory), which is the audit's job, not a grep's. `state` may
  turn out to be an enum member of another term — i.e. row deletion, which is
  precisely HARVEST §2's warned "self-inflicted lint regression" class (run
  #1 nearly dropped map-lore proper nouns by reading literally). The 39
  `verdict: null` rows are already waiting on run #3; three more is free.
- **Ticket 09's check allows `mechanism|meta` only** — the strays surface as
  findings, and the findings ARE the queue.

### Q5 — verdict: do not touch (ownership boundary)

`standard-term` ×2 is almost certainly a `standard-match` typo — and it stays
untouched. HARVEST's two-mode model makes `verdict`/`verdictRef`
**audit-owned: carry-forward or null, never hand-set.** Hand-fixing it would
break the ownership rule while claiming to repair schema discipline.

This establishes the boundary v2 runs on:
**index fields (status, kind, aliases) — patchable by a sealing session;
audit fields (verdict, verdictRef) — the audit only.**
Ticket 09 checks the verdict domain and reports; run #3 re-judges the 2 rows
with the other 39.

### Handoff

- **Ticket 09 (binding)** — enum check over `status`
  (`AGREED|PROPOSED|rejected-recorded|SEALED`), `kind` (`mechanism|meta`),
  `verdict` (S7 set); alias-shape check (`{name, rel}` with `rel` in domain).
  Findings only, never blocking (S13). Also: `alias-inject.js` should consume
  `rel` — strong nudge on `구칭`/`retired`, soft on `synonym` — since it
  imports `normalizeName` from the lint already. Optional: the derived
  promotion report (Q3).
- **Ticket 10 (run #3)** — migrate `mechanic`→`mechanism` and the status
  strays; judge `state`/`strategy`/`SUPERSEDED` + the 2 verdict strays with
  the 39-row queue; migrate `aliases` to typed form, recovering `구칭` markers
  from the birthplace GLOSSARYs (the ingest lost them; the sources still have
  them).
- **HARVEST.md §4 amendment** (user seals): the extended status dictionary with
  the SEALED-implies-AGREED rule, the typed-alias shape, the derive-don't-store
  promotion rule, and the index-vs-audit ownership boundary. Draft with ticket
  10's batch — the amendment and the migration should land together.
- **Law**: Vocabulary Law's status dictionary line needs the fourth value.
  Tier-3, user seal, batched with the HARVEST amendment.
