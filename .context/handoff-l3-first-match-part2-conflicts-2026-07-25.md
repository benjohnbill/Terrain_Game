# Handoff — L3 first-match Wayfinder: work the Part 2 seal conflicts

Date: 2026-07-25. Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`.
This session re-charted the Wayfinder, swept all thirteen build tickets for the
values they need, and landed five user rulings. This handoff exists because the
context got long, not because anything is unfinished mid-flight.

> **Everything durable is already in the repository.** This file is a thin
> resume-note that points at tracked documents. `.context/` is untracked by
> convention, so nothing here is load-bearing — if you lose this file, read
> `.scratch/l3-first-match/map.md` and you have the session.

## This session's job is done. The next one's job is:

> **Work through the twelve seal-versus-seal conflicts in
> `.scratch/l3-playable-build/DECISIONS-OWED.md` § Part 2, one at a time, with the
> user.** They are the batch that blocks ticket implementation. Each is sharp
> enough to state; none is the agent's to decide.

Two smaller items ride along: **one confirmation owed** (capital-candidate free
choice, § Rulings R3 — recorded as a lean, not a seal) and **one citation fix
owed** (the gate-08 § Answer still names `map-data.js CANONICAL_MAP` as the reuse
basis; ticket 02 is corrected, the gate is not).

## Read order

1. `.scratch/l3-first-match/map.md` — **the front door.** Destination, why it was
   redrawn, the notes that govern how work is done here, what is inherited sealed,
   the fog, and what is out of scope. Read this before anything else; it replaces
   the mental model this handoff would otherwise have to carry.
2. `.scratch/l3-playable-build/DECISIONS-OWED.md` — the user's decision surface.
   § Rulings received (R1–R5) is what was decided today; § Part 1 is what blocks
   the walking skeleton; **§ Part 2 is the next session's work**; Parts 3–4 are
   bulk-approval and not-owed-now.
3. `.scratch/l3-playable-build/README.md` — the runbook: the readiness chain (why
   no ticket can go `ready-for-agent` yet), the wiring-not-systems scope test, the
   design-problem workflow table, and the re-cut history mapping old tickets to new.
4. `.scratch/l3-first-match/SUPERVISION.md` — how the user supervises a build they
   cannot read. Designed and agreed, **not built**; each of the four layers is
   concrete work with an owner named at the bottom.
5. `docs/SYNC-DEBT.md` — nine rows registered or amended today, at the top of § Open.

## What changed today, by commit

- `56674ce` — build tickets re-cut, nine to thirteen, walking-skeleton order with
  the loop closing at ticket 07.
- `01ddf53` — the design-problem workflow locked; 천도 ruled out of scope; recon's
  designed mechanism recorded.
- `1c7ff30` — the demand-driven value sweep published as `DECISIONS-OWED.md`; two
  of my own errors corrected (wrong map source in ticket 02; ticket 10's
  acceptance criterion contradicting ADR 0024).
- `f204487` — user rulings R1–R5 landed.
- this session's final commit — the re-charted map, the supervision design, the
  tactical-plan-ai ruling ⑦ amendment, and two new SYNC-DEBT rows.

## Things that bit this session, and will bite again

- **`grep` and `rg` give false negatives** on recursive searches here. Use
  `/usr/bin/grep -rn "pat" --include='*.md' .` — and quote the glob, zsh expands
  it. Use `/usr/bin/git`; bare `git log` is unreliable across worktrees.
- **Search `docs/superpowers/` before calling anything undecided.** Fifteen specs
  and eighteen plans, Working-layer by the law and absent from `AGENTS.md` § Read
  Order, carrying mechanism detail with no Production home. Reading only the seal
  chain produced false "undecided" verdicts twice today — once on reconnaissance,
  which the user corrected.
- **Read the artifact before asserting about it.** I claimed the cradle map's
  shape twice from the wrong file: first without reading it at all (the user
  caught it last session), then from `map-data.js`, which is C-loop iteration 1
  and superseded by `map-gen.js`. Three feature docs pointed at the right file the
  whole time.
- **A value decided in conversation must reach the repository the same session.**
  The recon unit prices lived only in agent memory — ungit-tracked, invisible to
  Codex, unreadable by the user — while a Production doc cited that memory file as
  its record. That is why this handoff is thin and the tracked documents are not.
- **Six parallel subagents reading large docs hit the session limit.** Three at a
  time with grep-then-read-a-slice instructions worked. Their per-ticket tables
  (LANDED rows with file:line) were distilled into `DECISIONS-OWED.md`; the raw
  tables were not saved and would need re-running — noted as a cost, not a plan.

## Suggested skills

- **`grilling`** — Part 2 is twelve rulings; this is what the skill is for.
- **`domain-modeling`** — if working a conflict mints or renames a term.
- **`doc-audit`** — after any seal batch, per the law's ritual duty 7.
- **`final-check`** — at close, against this handoff's stated job.
