# Handoff — L3 Playable Seam Wayfinder (2026-07-16 → Codex session)

Working-layer handoff (untracked). Conversation voice = Korean honorific;
artifacts = neutral professional English.

## Position (one line)

Wayfinder gates **01, 02, 04 are resolved**; **03 and 05–12 are open**. Your job
is to apply three named fixes and bring the open decision tickets from bare
question stubs to grilling-ready decision briefs. **You do not answer the gates.**

## Read this first — the pipeline and your place in it

```
gates closed (USER decisions, one grilling session each)
  → gate 12 partition
    → Production specs under docs/features/
      → implementation tickets
```

The umbrella spec's header carries an explicit implementation-readiness block:
tickets depending on a gate cannot become `ready-for-agent` until that gate's
answer is recorded in its ticket and reflected into the spec. You are working at
the **preparation** of step 1 — not its decision, and not steps 2–4.

**DO:**

- Apply the three fixes in §A.
- For each open gate: sharpen the question, lay out the option space with
  repository evidence cited as `file:line`, name the constraints the sealed
  records already impose, and give a recommendation with its honest cost.
- Leave the decision to the user.

**DO NOT:**

- **Seal any gate.** `Type: grilling` means the answer is the user's. Write the
  options and your recommendation; leave `Status: open`.
- **Author Production specs or implementation tickets.** `docs/features/` has no
  home for this project *by design* — the umbrella spec defers that to gate 12.
  Creating one early pre-empts a user decision.
- **Register or coin domain terms.** The spec states no term or magnitude is
  sealed here; registration follows the documentation audit at gate 12. Interface
  names in ticket 02 are explicitly provisional.
- **Edit `SPEC.md`, `DESIGN.md`, `CLAUDE.md`, or any ADR.** Tier-3 — propose to
  the user instead.
- **Anchor L3 work to war behavior that R14 is scheduled to replace.** See A3.

## Sealed state — context, not open questions

Authoritative records (read them; do not restate them anywhere):

- `docs/adr/0039-react-vite-ui-and-javascript-game-runtime.md` — React + Vite UI
  shell; framework-free Game Runtime seam; renderer on an independent axis; no
  full game engine. Its Decision 3 explicitly defers "the exact API shape" to
  implementation.
- `docs/adr/0040-typescript-first-canonical-l3-source.md` — amends 0039 on source
  language only: TypeScript/TSX is canonical for all new L3 production source;
  browser and Node execute emitted ESM; legacy JavaScript is ported through
  playable vertical slices; no repository-wide mechanical conversion; no legacy
  JavaScript permanently behind a typed facade.
- `.scratch/l3-playable-seam/spec.md` — the Working umbrella spec.
- `.scratch/l3-playable-seam/issues/01-choose-migration-topology.md` — **resolved**:
  parallel-strangler. `game.html` is preserved as a bounded legacy comparison
  route; L3 is built beside it, never converted in place; promotion follows named
  gates; rollback restores a verified static-hosting artifact; two permanent
  playable implementations are not an accepted end state.
- `.scratch/l3-playable-seam/issues/02-define-game-runtime-authority.md` —
  **resolved 2026-07-16**, user-sealed. Read it in full; the summary below is a
  pointer, not a substitute.
- `.scratch/l3-playable-seam/issues/04-research-toolchain-coexistence.md` —
  resolved research evidence (five supported arrangements), not a decision.

Wayfinder 02 in brief — the Runtime privately owns match truth and hands out only
viewer projections; blurring happens once, at the projection seam; command
preview is a pure module *outside* the Runtime taking `(view, intent)`; bots are
ordinary callers while the Runtime enforces turn order and never sleeps; the
authored-world identity plus seed plus ordered intent log is the canonical
durable form, events are presentation output, and no snapshot API ships by
default.

Two facts from that session you will otherwise re-derive:

- **Bot cost is measured, not assumed.** `mockup/combat-calc/tournament.js`,
  200 matches, ladder brain, 5 seats: **1.17 ms per whole match**, ≈21 µs per
  faction-turn. A complete match resolves inside one 60 fps frame. The legacy
  500 ms bot delay (`js/main.js:355,430`) is deliberate pacing at ~23,000× the
  actual computation. Do not propose async or parallel bot execution as a
  performance measure — turn-based bot decisions are causally sequential, and
  there is no latency to remove.
- **The truth-fallback leak class is live in the legacy route.**
  `js/command-preview.js:78,102-104` reads the true defense force and blurs it at
  read time; the resulting card carries `defenseForce`/`forecast` (truth) beside
  `defenseEstimate`/`forecastRange` (blurred); `js/ui.js:156-157` resolves them
  with fallbacks that print truth when a blurred field is missing. Nothing leaks
  today only because the valid path always populates the blurred fields. This is
  the concrete motivation for 02's blur-at-the-seam rule — cite it, do not
  re-discover it.

## A. Three fixes to apply

These come from a cold review of the greenfield/brownfield memo
(`/tmp/l3-greenfield-runtime-cold-review-2026-07-16.md`) whose repository claims
were verified accurate. Each fix is small and load-bearing.

### A1 — Define `port` in gate 09

ADR 0040 Decision 4 says a production module "is ported to TypeScript when its
vertical slice crosses the seam". `port` is ambiguous between *source-level
adaptation* and *clean reimplementation checked against legacy evidence*.

**No ADR amendment is required** — 0040's Context already rejects mechanical
conversion ("Mechanically converting every historical file... would discard their
value as a stable comparison surface"), and Decision 6 sets the retention bar at
"the corresponding canonical TypeScript **behavior** has parity coverage", which
is a behavioral test, not a lineage test. Record the reading in gate 09's ticket:
**port = reimplementation from the authoritative contract, verified against
selected legacy tests and executable models; not source adaptation.**

### A2 — Fix the `movement` command in the umbrella spec

`.scratch/l3-playable-seam/spec.md` User Story 15 lists *"attack, defense,
reconnaissance, **movement**, or other currently supported L3 command"* — putting
movement beside attack as a player-issued command.

This contradicts a sealed Tier-0 rule. `DOMAIN_MAP.md:245-255`, `Position as
product` (✅ AGREED): *"The MVP has no standalone move action and no tracked army
counters... Crossing/landing is an attack plan whose fiction is movement under
fire... Avoid: a generic move order, hex-by-hex marching."*

Rewrite US15 so movement is not a player-issued command. US18's "movement" is
**fine** — it names the movement contract as calculation substrate affecting
resolution, which the sealed rule explicitly preserves ("Hexes keep doing movement
*math*... as calculation substrate"). Change US15 only. Do not touch
`DOMAIN_MAP.md`.

### A3 — Constrain gate 08's first slice to settled behavior

The sealed war model is **still mid-build**. `docs/DESIGN-RISKS.md` R14 records
that L2 measurement found zero annihilations and ~77% of wars ending in a
stall→white-peace fizzle — and that its direction is *sealed* (ADR 0037): the
fizzle is a war-machine **implementation** artifact (per-front uniform defense
where the seal says per-sector 4-layer; a multi-turn siege conveyor contradicting
ADR 0026's atomic resolution; a static declare gate plus a bot stall-exit), not a
property of the sealed war. **R14 closes when the build implements the sealed
model** (`docs/features/war-model-build/`). Slice-2 tickets 01–11 have landed; the
build is not finished.

So the risk is not that dials are moving — it is that some war behavior reachable
from the legacy route today is *known-placeholder* and is being replaced. A first
playable slice aimed at that behavior would produce L3 evidence about code
scheduled for removal.

In gate 08's brief, make "the war behavior this slice depends on is built against
the sealed model, not a known placeholder R14 is scheduled to replace" an explicit
selection criterion, and surface which slice-1/slice-2 behaviors currently
qualify. Note the related trap: the legacy route's win conditions
(`js/game.js:448-465` — last-faction-standing and 70% hex control) are superseded
by ADR 0038's annihilation/capital/settlement complex. Do not let a slice inherit
them. This is a *sequencing* constraint on the option space, not a decision — the
slice choice remains the user's.

## B. Prepare the open gates

Each of these is a `Type: grilling` stub of 400–750 B holding a question and
nothing else. Bring each to a decision brief. Notes on what is specific to each:

- **03 — viewer knowledge contract.** Gate 02 just made this load-bearing in a new
  way: the projection is now *the* blur seam **and** the sole input to command
  preview, so the view must carry everything preview needs — otherwise preview
  cannot run without truth and 02's structural guarantee collapses. Audit
  `buildAttackPreview` for its inputs and surface that requirement in the brief.
  The ticket also names a recorded control-visibility tension; find and cite it.
- **05 — build/test topology.** Consume gate 04's resolved research. The root is
  CommonJS with a `node --test tests/*.test.js` suite (41 files, 471 tests as of
  2026-07-16) that must keep passing throughout.
- **06 — authored world input.** Existing generator/loader/gate artifacts under
  `mockup/combat-calc/` are candidates for production-versus-evidence disposition.
- **07 — map/fog presentation prototype.** A prototype gate needing live user
  evaluation. Gate 02 handed this gate a design question it did not previously
  own: because the Runtime never sleeps, "how long the player waits" is now a free
  UI dial rather than a system constraint — which reopens *how the player learns
  what bots did without being made to wait*. Name it in the brief.
- **08 — first playable vertical slice.** A3 applies here.
- **09 — migration ladder.** A1 applies here.
- **10 — verification gates.** Existing prior art: the Node suite, the browser
  script loader, authored-map gates, combat batteries, Fog/Intel tests.
- **11 — cutover and retirement.** Bounded by gate 01's resolved answer.
- **12 — partition.** Carries three riders the user sealed on 2026-07-16, all
  recorded in `docs/SYNC-DEBT.md`: (a) whether any resolved Wayfinder decision
  promotes to an ADR; (b) if one is minted, it stamps ADR 0039 and corrects
  `DESIGN.md:43` in the same batch — both say the Runtime "exposes resulting
  state", language the sealed direction has moved past; (c) that ADR absorbs the
  recurring principle *a protection that depends on caller discipline is not a
  structural guarantee*, rather than promoting it to a root doc separately.

## How this repository works (Codex-specific)

- **Read order** is defined in `AGENTS.md`. Follow it before substantial work.
- **The documentation law reaches you through the generated block inside
  `AGENTS.md`.** Codex has no external-file auto-import, so the canonical law at
  `.claude/rules/documentation-law.md` is mirrored verbatim into that block. **Do
  not edit the block by hand.** Edit the canonical file and run
  `npm run sync:docs-law`; `node scripts/sync-docs-law.js --check` reports drift
  and is wired into `npm run lint:docs`.
- **doc-audit skill**: `.codex/skills/doc-audit` is a relative symlink to
  `.claude/skills/doc-audit` (single-source). Codex symlink-following has not been
  confirmed from inside a Codex session — if the skill does not resolve, read
  `.claude/skills/doc-audit/SKILL.md` directly and proceed; report the failure.
- `.scratch/` and `.context/` are **untracked by convention**. Ticket files live at
  `.scratch/l3-playable-seam/issues/`; see `docs/agents/issue-tracker.md` and
  `docs/agents/triage-labels.md`.
- Law-layer files (`AGENTS.md`, `CLAUDE.md`, `.claude/rules/documentation-law.md`)
  change only by explicit user decision.

## Verification before handing back

- `npm test` → fail 0 (471 passing as of 2026-07-16).
- `npm run lint:docs` → clean (audit-lint 8 checks, 0 findings; sync-docs-law OK).
- Every gate ticket you touched still reads `Status: open` unless the user sealed
  it in-session.
- No new file under `docs/features/`.
- Any duty you could not pay is recorded in `docs/SYNC-DEBT.md` — an unrecorded
  debt is a law violation; a recorded unpaid one is normal operation.

## These are the user's calls, not yours

Gates 03, 05, 06, 07, 08, 09, 10, 11, 12; any SPEC/DESIGN/ADR edit; whether a
resolved gate promotes to an ADR; the Production partition shape. Bring each a
sharpened question, an evidenced option space, and a recommendation — then stop.
