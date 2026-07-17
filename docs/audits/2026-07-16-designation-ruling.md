# Designation — a ruling's body in a Working text (2026-07-16)

Governance why-record (Working layer; reports/rationale, not legislation —
documentation-law S13). The normative rule is the `## Designation` clause in
`.claude/rules/documentation-law.md` (user-sealed 2026-07-16); this file holds
the reasoning, the rejected alternatives, and the reopen condition's rationale,
and is the target of that clause's inline adoption tag.

Origin: `.scratch/doc-structure/` ticket 04 ("Working-spec authority"),
re-grilled 2026-07-16 after the 2026-07-15 adversarial review
(`docs/audits/2026-07-15-doc-structure-review.md`, finding C-2) reopened it.

## The pattern

A Record-layer ruling (e.g. `war-model-build/RULINGS.md` WM-②) names a
Working-layer text (the slice-2 design spec under `docs/superpowers/specs/`) as
its **authoritative design text**. The ruling carries the sealed decisions in
summary (WM-②'s "What is sealed" bullets + rejected alternatives); the
designated text carries their detailed expression and the provisional
(가안/HELD) dials the summary does not. Reading the ruling gives the sealed
decision; the designated text is where build-level detail lives until it
graduates into an owning model doc. So the SSOT for the sealed decisions is the
ruling; the spec is the detailed, transitional body it points at.

## Premise correction (verified TRUE)

The original ticket asked whether a sealed Working spec is "a fourth seal
surface". It is not, and never was. `RULINGS.md:83-92` (WM-②) carries the full
seal triad — status word + date + verdict source — at a Record-layer
birthplace, and names the spec as its authoritative design text. The spec's own
`SEALED` header is a stamp recording that a ruling sealed it, not a second seal.
Tickets citing "slice-2 design spec §N" cite WM-② transitively. This diagnosis
survived the reopen intact; only the invariant bolted onto it failed.

## Why NOT freeze (the retired invariant)

The original ruling bolted a freeze invariant onto designation ("a designated
text is frozen at designation; changing it requires a new ruling"). It was
refuted by its own cited evidence:

- Commit `79d25e3` (2026-07-15 07:01:50, +11/−3) patched spec §2 — the exact
  paragraph the ruling cited as proof edits don't happen — **three minutes
  after** the ruling was written, as routine ticket-06 doc-sync. It replaced
  "Recovery — a child of supply" with "a child of supply **and ground**",
  preserving the sealed two-ledger firewall while refining a 가안 dial the seal
  had left open (`fatigue.turnUpkeep` recoveryFactor; consonant with ADR 0014).
  That is legitimate reconciliation of a decision made through ticket 06's
  implementation + 2-axis review + merge — not a decision-change.
- Under freeze, that edit is illegal, and the ruling is born in its own reopen
  state. Freeze would also (1) make the in-flight build's per-ticket doc-sync
  rhythm illegal, (2) impose a fresh ruling on every 가안 re-cut and every one
  of the three open rulings + queued magnitude pass pointed at that text, and
  (3) reinvent the supersession machinery the law already has.

Retired. Designated texts ARE edited in normal operation; the law permits it.

## The two bets designation makes (→ the reopen condition)

1. **doc-sync agents can reliably judge reconciliation vs decision-change**
   (using the mandatory-ADR-trigger criteria). If this fails in practice —
   recurring silent drift of a sealed decision without the amend — the reopen
   condition fires.
2. **detailed truth graduates OUT of the spec** into an owning model doc rather
   than accreting forever. Tracked per-instance by `docs/SYNC-DEBT.md`; a
   growing pile of graduation debts is the signal. This is NOT a separate reopen
   tripwire — that would re-implement SYNC-DEBT in a different form.

## Rejected alternatives

- **Freeze** — see above.
- **Versioned / seal-at-commit designation** — pin the body to a commit hash /
  date; edits produce a visible new version and a drift lint can flag it.
  Rejected: heavy (version bookkeeping on every edit), and it would have flagged
  the legitimate `79d25e3` as drift — solving with machinery a problem the
  existing seal-amends duty already covers.
- **§-range designation** — designate only some sections as authoritative.
  Rejected: adds a per-section marking burden and does not address edits *within*
  the designated range; orthogonal to the real question.
- **Promote designated specs to Production** — needs a re-classification test
  ("which specs are designated?") and mints a rule the `research/*.md`
  precedent already answers. Rejected (carried from the original ticket).
- **Ruling absorbs the ~25 KB body** — copy the spec into `RULINGS.md`.
  Rejected: violates the law's single-definition economics (carried from the
  original ticket).
- **Non-graduation as a reopen condition** — folded into SYNC-DEBT (its job);
  keeping it as a reopen tripwire duplicates an existing mechanism.
- **Old "two rulings designate one text" reopen condition** — retired: it is the
  normal build pattern (one spec, §0–§13, serves slice-2 tickets 01–10; WM-③
  would designate the same text), not a failure.

## Why no ADR (layer altitude)

Designation is a **Law-layer** mechanism. ADR and RULINGS are **Record-layer** —
subordinate to the law. Recording a constitutional rule in a case-law file
inverts the altitude. The law records its own mechanisms via an inline adoption
tag + `docs/audits/` detail: the seal-amends-ADR duty
(`documentation-law.md:84`) and the mandatory-ADR trigger (`:90`) — both
ADR-related — were themselves adopted as law edits with forensics pointers, not
as ADRs. The ADR corpus (0025–0038) is entirely game/architecture; there is no
documentation-process ADR. The mandatory-ADR trigger targets a decision that
changes a win condition, a cross-feature **game** model, or SPEC direction;
designation is none of these. The dismissal is reasoned, not dropped — closing
the F-06/07/08 failure mode (decisions dropping their ADR duty silently).

## The un-mechanization commitment

Reopen condition (a) — silent decision-drift — is semantic: *does a spec edit
contradict the ruling's summary?* That is the M-01 semantic-staleness class the
governance surveys knowingly leave un-mechanized. It stays a human-observed
tripwire; no lint check and no `term-inventory.json` / `doc-registry.json` field
encodes it. Future "let's make this a check" proposals are answered here in
advance: no, by design — a string/enum check cannot judge semantic contradiction,
and pretending it can would manufacture false confidence (the exact failure the
2026-07-15 review found in the sibling tickets).

## Downstream (tracked elsewhere)

- **Registry role-string honesty fix** (tickets 08/12): designated specs get a
  role that says "design spec; non-normative alone, authoritative where a ruling
  designates it (see that ruling)" — not a layer change.
- **Dial-sheet graduation** (`war-model-build`): the first magnitude pass builds
  the owning model doc and migrates spec §2's dial sheet out —
  `docs/SYNC-DEBT.md` row.
- **Law-clause application**: user-sealed 2026-07-16, application pending in
  `docs/SYNC-DEBT.md` (Tier-3 batch).
