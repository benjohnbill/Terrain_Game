# Working-spec authority — name the pattern or re-point the tickets?

Type: grilling
Status: resolved — re-grilled 2026-07-16 (designation legalized without freeze; law clause user-sealed, application batched Tier-3)

> ## ⚠ REOPENED — the premise correction stands; the invariant bolted onto it
> ## does not
>
> `docs/audits/2026-07-15-doc-structure-review.md` (C-2, fact-check rows 1/2/22/24).
>
> **What survives**: the premise correction is verified TRUE against
> `war-model-build/RULINGS.md:83-92`. WM-② carries the seal at Record layer and
> *designates* the spec as its body; the spec's `Status: DESIGN SEALED` is a
> stamp, not a second seal; the tickets citing the spec cite the ruling
> transitively. That diagnosis is sound and should be carried into the re-grill.
>
> **What is refuted — the freeze invariant, on its own evidence**:
> - The Answer claims "the slice-2 spec **has not been edited since its
>   2026-07-14 seal**" and that the §2 ground/ash disagreement "was **registered
>   as a debt, not patched into the spec**". Both are **FALSE**. Commit
>   **79d25e3** (2026-07-15 **07:01:50**, +11/−3) patched that exact paragraph
>   into the spec — "Recovery — a child of supply **and ground**" — and moved the
>   debt to **Paid** (`SYNC-DEBT` now reads "the design spec §2 recovery
>   paragraph **now records** recovery = supply × ground-recovery factor").
>   `RULINGS.md` was untouched; the commit says "no new seal".
> - The map records ticket 04 resolved at ~06:58. **The invariant was violated
>   three minutes after it was written**, by routine doc-sync, in the exact case
>   cited as proof it doesn't happen. Reopen condition (a) — "a designated text
>   is modified without a ruling" — **has already fired**; the ruling was born in
>   its own reopen state, and 79d25e3 (already on main) would be retroactively
>   illegal.
> - The invariant claims to "name what the repo does". It measurably names what
>   the repo does **not** do: the build's per-ticket doc-sync rhythm patches the
>   spec as normal operation, and three open rulings (pump-reset, bleed-ordering,
>   delaying-defense bands) plus a queued magnitude pass all point at that text.
> - Reopen condition (b) — "two rulings designate the same text" — fires **by
>   construction**: one spec (§0–§13) serves slice-2 tickets 01–10, and WM-③
>   would plausibly designate the same text.
> - **"Not a new category" is overclaimed.** Law :45-46 says `research/*.md` is
>   "never normative on their own" — full stop, no designation exception.
>   Designation makes a Working text normative by reference and adds an
>   invariant: that is a new mechanism, and calling it an extension understates a
>   Tier-3 change (which also weakens the ADR-trigger dismissal below).
> - **The ticket raised the mandatory-ADR trigger in its Constraints and dropped
>   it** in its Handoff — no ADR, no reasoned dismissal. That is the F-06/07/08
>   joint the law was amended to close.
> - Citation fixes for the re-grill: the `research/` clause is at **:45-46**
>   (not 44, post-e35caf8); the WM-② blockquote renders an unbolded source line
>   as bold.
>
> **Re-grill needs**: given that designated texts ARE edited in normal operation,
> either drop the freeze invariant and find a different protection (versioned
> designation? designate a § range? seal-at-commit?), or accept designation
> without freeze and say what protects the ruling's meaning. Q2 (dial-sheet home
> → magnitude pass) and Q3 (no "repayment" — the seal was always at RULINGS) are
> unaffected and may be carried forward.

## Question

Implementation tickets cite Working-layer design specs as authoritative —
`.scratch/war-model-slice2/issues/01-fatigue-core.md`: "Authoritative design:
slice-2 design spec §2" — while the law says Working-layer content is
"consult for context, CURRENT truth lives in the seal chain, not here", and the
registry stamps those very specs "not current truth". Yet the spec carries
"DESIGN SEALED" status with L-trust stamps, and the whole slice-1/slice-2 build
methodology runs on exactly this pattern. The law has no name for it.

Sub-questions:

1. **Legalize or redirect?** (a) Name the pattern lawfully — e.g., "a sealed
   design spec is the authoritative build reference for its build slice until
   the first doc-sync mints Production truth; the seal chain then supersedes
   it." (b) Or require tickets to cite Production docs, forcing dial/model
   homes to exist before build starts.
2. **Seal-in-Working conflict** — the conflict rule says a dated seal in a
   *Production* doc is truth; slice-2's seals live in a *Working* spec. Is a
   sealed Working spec a fourth seal surface, or a temporary loan that MUST be
   repaid at doc-sync (and is the repayment duty written anywhere)?
3. **Slice-2 dial sheet home** — the dial sheet lives in spec §2;
   `docs/features/war-model-build/` has GLOSSARY/RULINGS/REQUIREMENTS but no
   owning model doc (MAGNITUDE-class), while the law requires "every feature's
   dials live in ONE owning model doc". Create `war-model-build`'s model doc
   now, at first doc-sync, or fold into REQUIREMENTS?

## Constraints

- Mandatory-ADR trigger may apply: this is a cross-feature model pattern
  (slice methodology spans features), so a decision here may owe an ADR in the
  same batch.
- Do not disturb the slice-2 build in flight — ticket 03 of that effort is
  next; whatever is decided applies at that effort's doc-sync, not
  retroactively mid-build.

## Output

Ruling + (likely) law-amendment or ADR draft (user seals) + concrete
disposition for the slice-2 dial sheet.

## Evidence

`research/inventory-schema-survey.md` (§C registry role strings) ·
`research/design-history-survey.md` (conflict rule, seal mechanics) · live
example: `.scratch/war-model-slice2/issues/01-fatigue-core.md:15`.

## Answer (2026-07-16 — re-grilled after the 2026-07-15 reopen; law clause user-sealed)

The 2026-07-15 reopen (block above) is addressed. The premise correction is
**carried forward unchanged**; the freeze invariant is **retired**; a lighter,
precedent-riding rule replaces it. Four decisions, one user-sealed law clause.
Full rationale + rejected alternatives: `docs/audits/2026-07-16-designation-ruling.md`.

### Carried forward (verified TRUE, untouched by the re-grill)

WM-② (`war-model-build/RULINGS.md:83-92`) carries the seal — status word +
date + verdict source — at a Record-layer birthplace, and **designates** the
slice-2 spec as its authoritative body. The seal chain is one-surfaced: the
spec's own `SEALED` header is a stamp, not a second seal; the tickets citing
"slice-2 design spec §N" cite WM-② transitively. The thing needing a name: a
Record-layer ruling names a Working-layer text as its body, so a seal's
detailed *content* lives in a Working file.

### Q1 — how to read the 79d25e3 spec edit → (a) legitimate refinement

Adding the ground-recovery factor to spec §2 (`79d25e3`, 3 min after the
original ruling) was **recording a refinement already decided** through ticket
06's implementation + 2-axis review + merge, consistent with ADR 0014, and it
**preserved the sealed two-ledger firewall** (the actual WM-② invariant) while
refining a 가안 dial the seal had left open. Reconciliation, not a
decision-change. **Consequence: the freeze invariant is simply wrong** —
legitimate edits to a designated body happen in normal operation, and the law
must permit them.

### Q2 — what protects the ruling's meaning without freeze → (A) ride the existing machinery

Designation without freeze. A designated text is a **living** text. Edits
split the way every doc's edits already do:
- **reconciliation / dial-refinement inside the sealed envelope** → ordinary
  doc-sync (inline provenance + commit); no ruling. (79d25e3 is this.)
- **a change that contradicts a sealed decision** (a ruling summary bullet or a
  sealed invariant) → a decision-change: because the designated text is the
  ruling's body, it triggers the **existing seal-amends duty on the designating
  ruling** (stamp + one-line delta; a SYNC-DEBT row if unfinishable in-session).

Nothing new is invented. The SSOT for the sealed decisions is the **ruling's
summary** (WM-②'s "What is sealed" bullets); the designated text holds the
detailed expression + provisional (가안/HELD) dials the summary does not, and
that detail is **transitional** — it graduates into the owning model doc.
Rejected: freeze (Q1); versioned/seal-at-commit and §-range designation (add
bookkeeping/marking for a problem the existing machinery already covers);
promote-to-Production and ruling-absorbs-the-25KB-body (retained from the
original ticket's rejection list).

Residual risk, stated honestly: the reconciliation-vs-decision-change judgment
is **semantic (M-01 class), not mechanizable**. It is the same judgment every
doc edit already runs on; designation extends the existing guard to the body,
it does not worsen the risk.

### Q3 — Record-layer home for this decision → (B) law text + docs/audits, no ADR

Designation is a **Law-layer** mechanism, not a game/architecture decision.
The law records its own mechanisms via an inline adoption tag + `docs/audits/`
detail — even the ADR-related duties themselves (seal-amends `:84`,
mandatory-ADR trigger `:90`) were adopted that way, not as ADRs; the ADR
corpus (0025–0038) is entirely game/architecture. Recording a Law-layer rule
in a Record-layer ADR inverts the altitude. **No ADR; reasoned dismissal
recorded** — the mandatory-ADR trigger targets win-condition / cross-feature
**game** models / SPEC direction, and designation is none. Durable why-record:
`docs/audits/2026-07-16-designation-ruling.md` (fixes C-4 for this ruling — the
why lives in tracked `docs/audits/`, not disposable `.scratch/`).

### Q4 — reopen condition → one only: recurring silent decision-drift

The original two reopen conditions were bolted to freeze and **fired by
construction** (any edit; the normal multi-ticket build). Replaced:
- **(a) recurring silent decision-drift** — if designated bodies **repeatedly**
  drift a sealed decision without the amend (the Q2 judgment proving unreliable
  in practice), revisit toward a bright-line or a check. One instance is a fix
  (amend/SYNC-DEBT), not a reopen (**emergence-limit**). Semantic (M-01),
  **deliberately not mechanized** — no lint/inventory field for it.
- **(b) non-graduation is NOT a reopen condition** — it is SYNC-DEBT's job
  (per-instance graduation is a tracked row; a growing pile is the signal).
  A reopen tripwire here would re-implement SYNC-DEBT in a different form.
- **Old (b) "two rulings designate one text" is retired** — it is the normal
  build pattern (one spec serves slice-2 tickets 01–10), not a failure.

### Carry-forwards (unaffected by the re-grill)

- **Dial-sheet home (original Q2):** the first magnitude pass on
  `war-model-build` builds its owning model doc and migrates the spec §2 dial
  sheet out — now simply an instance of the designation graduation clause.
  Tracked as a SYNC-DEBT row.
- **"Repayment" (original Q3):** dissolved — no loan; the seal was always at
  RULINGS, the spec is a body. §-level promotion into Production/Projection is
  ritual duty 2's ordinary obligation, not a debt peculiar to this pattern.

### User-sealed law clause (Tier-3, 2026-07-16)

Insert as a new `## Designation — a ruling's body in a Working text` section in
`.claude/rules/documentation-law.md`, after the Mandatory-ADR-trigger clause
(`:94`) and before `## Vocabulary Law`:

```markdown
## Designation — a ruling's body in a Working text

(adopted 2026-07-16, doc-structure re-grill; rationale
`docs/audits/2026-07-16-designation-ruling.md`)

A Record-layer ruling MAY **designate** a Working-layer text — e.g. a
design spec under a feature's `specs/` — as its **authoritative design
text**: the ruling's detailed body. This extends the `research/*.md`
precedent above one size up: an undesignated spec is non-normative
working scratch; a designated one is authoritative-by-reference for its
detail, on the strength of the ruling that names it. The ruling carries
the sealed decisions **in summary** (+ rejected alternatives); the
designated text holds their detailed expression and the provisional
(가안/HELD) dials the summary does not. The **seal stays one-surfaced** —
it is at the ruling; the designated text's own `SEALED` header is a
stamp, not a second seal.

A designated text is **not frozen**. **Reconciliation / dial-refinement
inside the sealed envelope** — recording what an implementation ticket
landed, or refining a 가안 dial that contradicts no sealed decision — is
ordinary doc-sync: inline provenance + commit, no new ruling. An edit
that **contradicts a sealed decision** (a ruling summary bullet or a
sealed invariant) is a decision-change: because the designated text is
the ruling's body, it triggers the **seal-amends duty on the designating
ruling** (stamp + one-line delta, user seals; a `docs/SYNC-DEBT.md` row
if unfinishable in-session). The detail is **transitional** — its owning
model doc graduates it out (per the model-doc rule above), tracked as a
SYNC-DEBT row; the text is disposable only after graduation.

**Reopen:** if designated bodies **repeatedly** drift a sealed decision
without the amend (the reconciliation-vs-decision-change judgment proving
unreliable in practice), revisit this rule toward a bright-line or a
check — one instance is a fix, not a reopen (emergence-limit). This drift
is **semantic (M-01 class) and deliberately not mechanized**: add no lint
or inventory field for it.
```

### Handoff

- **Law application (Tier-3, user-sealed 2026-07-16):** the clause above.
  Recorded as a pending row in `docs/SYNC-DEBT.md`. The original "batch with
  ticket 03" target is now conditional on ticket 09, so designation may land in
  its own seal or an unblocked doc-sync batch — sequencing left to the user.
- **`docs/audits/2026-07-16-designation-ruling.md`** — durable why-record
  (created this session).
- **Registry role-string honesty fix → tickets 08/12:** designated specs get
  "design spec; non-normative alone, authoritative where a ruling designates it
  (see that ruling)"; not a layer change (they stay Working).
- **SYNC-DEBT row (new):** war-model-build dial-sheet graduation.
- **Map fog (new):** why-record hierarchy (ADR↔RULINGS↔audits scattering) →
  Not-yet-specified, ticket 11 / C-4 orbit.
