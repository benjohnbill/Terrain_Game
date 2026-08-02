# Handoff — the five risks ticket 07 surfaced, and closing the gate behind them

Written 2026-08-02, right after L3 build ticket **07 landed and pushed** (merge
`15877c1`, follow-up `01d5f76`). The loop closes: a complete match now runs from setup
to a capital fall.

This session is planned as two phases, in this order:

1. **Take the five risks seriously and act on them**, then close the gate they bear on.
2. **Then take stock** — the user has been away from the workbench and wants to gauge
   how far the project has actually come. § Phase 2 is written for that, and is
   deliberately last so the orientation reflects a repo the session has just corrected
   rather than the one it walked into.

Carries only what is **not** in the repo. Everything else is referenced by path.

> **The single most important fact in this document.** Four of the five risks below
> exist **nowhere in the repository**. They were found by building ticket 07 and were
> reported only in conversation. This project has already learned this lesson once and
> written it down — a decision that lives outside the repo is a decision that gets lost
> (`.scratch/l3-first-match/` post-mortem; memory `terrain-game-l3-first-match-wayfinder`).
> **Registering them is task 0, before any discussion of them begins.** If this session
> does nothing else, do that.

## Start here

1. `AGENTS.md`, then `docs/DESIGN-RISKS.md` — read R14 and R16 as *format models*: they
   show the depth a risk row is expected to carry (measurement, sources, what would
   close it, and an explicit "not now" where that is the answer).
2. `docs/features/capital/RULINGS.md` — **CP-①'s header banners before its body**; five
   of its items are amended and the body still reads as originally sealed. Then CP-②
   (especially items 7, 8, 9), CP-⑤, CP-⑥, CP-⑦.
3. `.scratch/l3-playable-build/DECISIONS-OWED.md` Part 2 **row 17** — the only one of
   the five already registered.
4. `.scratch/l3-playable-build/issues/07-fall-a-capital-and-end-the-match.md`
   § Comments — the implementation evidence and what the two-axis review caught.

## Task 0 — give the four unregistered risks a home

`docs/DESIGN-RISKS.md` is the designated register and the next free id is **R17**.
Risk 4 below is already `DECISIONS-OWED.md` Part 2 row 17 and needs no second home —
cross-reference it rather than duplicating (single-definition rule).

Do this **before** grilling any of them. A grill that runs first and registers second is
exactly how the previous loss happened.

---

## The five risks, in the depth the next session needs

All measurements below were taken against the emitted modules (`game/dist`) on
`terrain-cradle@r1` during ticket 07. The probe scripts were throwaway and are gone;
the numbers are reproduced here so they need not be re-derived, but **re-measure before
sealing anything on them** — that is this repo's standing habit and it has paid twice.

### Risk 1 — CP-② item 8 names the wrong mechanism, and CP-⑤ was cut believing it

**This is the one to do first.** It is not a bug; it is a seal whose stated *reason* is
false, which makes it a trap for the next person who tries to tune the thing it governs.

CP-② item 8 rests the whole early-rush defence on:

> "guard magnitude needs a big (late-game) army"

CP-⑤'s own table contradicts it in the same file: the strongest capital (guard 6,000)
needs 7,500 men, which it labels **83% of a 9,000 opening field army**. So the opening
army suffices — by CP-⑤'s own arithmetic, before any measurement.

Measured live in ticket 07: on seed `turn-0001`, a pop-2.0 capital (guard **5,000**)
falls on **turn 1** to the opening field army at **16 of 20** commitment chips. The
browser lane drives exactly this, so it is reproducible from
`game/tests/browser/capital-fall.spec.js`.

**What actually gates early rush is reach** — how many turns of marching and wear stand
between an army and the seat. That is D1.4's forward/rear fork, and it is healthy. The
problem is only that item 8 credits magnitude for work distance is doing.

**Why it matters practically.** The first playtest that loses a capital early will send
the user to item 8, which will point at the coefficient. Raising 2,500 makes *rear*
capitals unkillable — pushing toward the fizzle R14 exists to warn about — while the
*forward* capital that actually fell still falls, because the enemy army was already
next door. The dial that governs early rush lives in march speed, wear, and map
distance, not in `CAPITAL_GUARD_PER_POP`.

**Candidate outcomes** (the user's call, not the agent's):
- amend item 8's *reasoning* to name reach, leaving its ruling (no hard floor) intact —
  the smallest honest change, and it is a Record-layer stamp, not a redesign;
- decide the turn-1 forward decapitation is D1.4's intended risk and say so explicitly,
  which item 8 half-says already ("a forward capital crackable earlier is D1.4's
  INTENDED risk, not a bug");
- treat it as a genuine balance problem and open the reach dials — but note that would
  be re-opening WB-M① territory.

Note the shape: this is a **seal-consistency** finding, so under the README's four-kind
workflow it is the user's, not the agent's.

### Risk 2 — CP-⑦ refunds the forward capital's risk, most where D1.4 wanted it to hurt

Measured over all 15 legal partitions × 2 seats × every held sector = **840** capital
candidates: **179 (21.3%)**, across **27** distinct sectors, sit on a sector that already
carries an opening 900-man border shield. CP-⑦ (additive) means those seats field the
shield **and** the guard.

The free 900 is worth, as a fraction of the guard it stands beside:

| capital | guard | the free shield is |
|---|---|---|
| `r5_s4`, pop 0.5 | 1,250 | **+72%** |
| `r10_s3`, pop 2.4 | 6,000 | +15% |

**It is inversely proportional to the seat's size.** D1.4's axis is leverage vs variance
— a forward capital buys a free-defended gate at the price of a short decapitation path.
CP-⑦ pays part of that price back, and pays it back hardest at the small fragile forward
seat the fork intends to be the risky choice.

CP-⑦ is not wrong — it follows the seals as written, and the alternative (subsumption)
deletes a sealed shield and adds a second capital/ordinary-city difference CP-② item 7
excludes. This is a **watch item**, not a defect: if the fork measures flat in playtest,
the lever is **where opening shields sit**, not CP-⑦.

Concretely: the shields are seated from the drawn partition's *contested* edges
(`Runtime.#seatSubstance` over `contestedFronts`), so whether a given seat comes with one
is partly the partition draw's accident and partly the player's choice.

### Risk 3 — the guard levies a permanent recruitment tax nobody designed

`serving = field + garrison` prices 동원 강도 (MT-③), and the guard is serving bodies by
CP-① item 2. Measured: the guard occupies **2.3%–11.1%** of a realm's conscription
register, from turn 1, permanently.

So a large capital is *simultaneously* harder to take **and** more expensive to recruit
from, all match. CP-⑤ evaluated only the first half; the second arrived through a channel
nobody was looking at.

**This may well be good.** It hands D1.4 a second axis — small seat = cheap mobilization
plus a fragile throne; large seat = a fortress you pay for in men all game — which is a
better trade than the fork currently has written down. But it is undesigned and
unrecorded, so the question for the user is simply: **feature or accident?** If feature,
it belongs in CP-⑤'s reasoning or a capital GLOSSARY row; if accident, the lever is
whether the guard counts toward `serving`, which touches "register-backed" and therefore
SPEC's permanent-blood-currency line.

### Risk 4 — the simultaneous double fall is the designed climax, not a corner case

**Already registered**: `DECISIONS-OWED.md` Part 2 **row 17**. Do not re-derive it; the
row carries the full statement, both unavailable readings, and what would settle it.

What the row does *not* stress, and this session should weigh: **frequency**. Both
capitals are public from turn 1 (CP-② item 1), turns are simultaneous and blind (D6.1),
and both players read the same board. "He is overextended, now is the moment" is a
*correlated* judgement, not an independent one. This is the mutual-exposure duel CP-②
item 9 calls the heart of the match frame, arriving exactly on schedule.

Today it throws (`capitalFallOf`, `game/src/domain/capital-fall.ts`), by the user's
2026-08-01 ruling to pin rather than invent. A real playtest can reach it, at the
climax.

Note the knock-on: any answer other than "keep refusing" probably touches ticket 07
acceptance item 4's "no draw path", and through it **ADR 0042**. The mandatory-ADR
trigger in the documentation law applies — a decision that changes a win condition
lands with an ADR in the same batch.

### Risk 5 — gate 10's unfilled parity threshold now decides who won

`npm run verify:game` has exited 2 with `parity PENDING` for seven consecutive tickets.
Both hosts currently agree (`d50337ddf67c813b`). The threshold — bit-exact versus
epsilon — is Wayfinder gate 10's to fill and is still empty, so **a divergence between
Node and the browser would fail nothing**.

Until 07 that meant the two hosts might disagree about a number. Now they can disagree
about **whether the match ended and who won**. The risk is unchanged in kind and much
larger in consequence, and ticket 07 is what made it so.

This is the one of the five that is plausibly **"이번 게이트"** — see below.

---

## Which gate is "이번 게이트"? — resolve this first, it is genuinely ambiguous

The user said the session should "actually finish this gate" on the basis of the five
risks. The referent is not certain and the reading changes the session's shape. Ask, or
confirm from the evidence:

- **Wayfinder gate 10** is the strongest candidate. Ticket 07's own handoff closed with
  "gate 10's acceptance thresholds become the critical path, since they gate every
  remaining ticket's pass/fail and ticket 13 cannot be judged without them", and risk 5
  *is* gate 10's residue. `.scratch/l3-playable-build/README.md` § The readiness chain
  records its remaining residue: proof strength, who judges the human rung, what counts
  as a FAIL, and whether 10 is the **admission** gate to L3 playtesting or its
  **verdict**.
- **Against it:** risks 1–3 are capital/win-condition design and feed no Wayfinder gate.
  They would be a capital-feature pass, not a gate closure.
- **A third reading:** "this gate" may mean the build milestone the loop-closing
  represents, in which case the work is the doc-sync and stock-taking of Phase 2 rather
  than a Wayfinder gate at all.

Gates 09, 11 and 12 are also open; 12(a) is **blocked** on
`.scratch/doc-structure/issues/10-audit-run-3.md`, which reads
`⛔ DO NOT EXECUTE`. Do not walk into that without a decision to route around it.

**Recommended framing if the user confirms gate 10:** risks 1 and 5 are its natural
inputs — risk 5 is literally its residue, and risk 1 is a worked example of *why*
thresholds matter, since "the guard is big enough" was believed without a threshold that
would have caught it. Risks 2–4 are then a separate capital pass, sequenced after.

---

## Phase 2 — taking stock after being away

Written as a reading order rather than a summary, because a summary here would be a
fifth copy of what these files already say and would go stale first.

**Where the project actually is, in one line:** the L3 build's walking skeleton is
closed — tickets 01, 02, 03, 05, 06a–06e and 07 are landed, a full match plays from
setup to capital fall, and everything remaining thickens a terminating game.

Read, in this order:

1. `.scratch/l3-playable-build/README.md` — § Current state and the **waiver table** are
   the live frontier record. The table is the truth about what is buildable and why the
   rest is not; each `needs-info` row names the exact value it waits on.
2. `.scratch/l3-playable-build/DECISIONS-OWED.md` — the decision surface. Part 2 is
   seal conflicts; rows 16 and 17 are ticket 07's.
3. `.scratch/l3-playable-seam/map.md` — the Wayfinder, for which design gates remain.
4. `docs/DESIGN-RISKS.md` — the standing warnings, R14 and R16 above all.
5. `docs/SYNC-DEBT.md` — what is owed and unpaid, including 06d's two open items
   (economy re-measurement, and the **HELD** garrison→field posture transfer).

**Two traps when reading old material after a gap**, both of which have bitten this
project:

- **A document's prominence is not its currency.** Anything without a self-declaration
  header is an undated snapshot; ground current state in the seal chain and the ADRs,
  not in front-door prose (`AGENTS.md` § Document Trust).
- **Ticket 07's own header was wrong twice in one day, in both directions.** Status
  lines are the least reliable thing in the tracker. The waiver table's (ii) column and
  the seal chain are more trustworthy than any `Status:` line.

**A specific stale-reading hazard worth naming:** ticket 07's status header history is
preserved as nested blockquotes in the issue file. It reads as three contradictory
statements unless you notice the outer one is current and the inner ones are
deliberately-kept history.

---

## What ticket 07 left behind, for the record

- **Registered, not absorbed:** `DECISIONS-OWED.md` row 17 (risk 4).
- **Unregistered until this session does task 0:** risks 1, 2, 3, 5.
- **One deliberate out-of-scope change**, recorded in the ticket evidence: `.gitignore`'s
  `node_modules` pattern lost its trailing slash. The directory-only pattern let this
  repo's worktree symlink convention slip through and a `git add -A` committed it. Both
  commits were rebuilt so history is clean, but **the same trap exists in any older
  worktree** whose symlink predates the fix.
- **A doc-drift fix worth imitating** (`01d5f76`): `#emptyCapturedShield` had justified
  a design choice with "the capital guard is ticket 07's `needs-info` and unbuilt". That
  reason expired the moment 07 landed. The conclusion held for a better reason (the
  guard is place-bound), and the comment now says so. This repo has been bitten by
  exactly this shape before — `state.ts` carried a comment that "landed hours before ADR
  0044 did, on the same day, and nobody returned".

## Verification baseline

Run these on `main` before changing anything, and do not regress them:

```bash
npm run verify:game   # typecheck / build:runtime / build:viewer / test:node / test:browser / parity
npm test              # root suite
npm run lint:docs     # documentation governance
```

On `main` at `01d5f76`: **Node 257**, **browser 23**, root **562/562**. `verify:game`
exits **2** — every lane PASSes and **parity is PENDING by design** (risk 5); both hosts
produce `d50337ddf67c813b`. **Exit 2 with that summary is the expected green.**
`lint:docs` reports **0 blocking / 13 advisory**; two advisories are verified-spurious
and must stay standing (`conquest damage`, and a `ledger-possibly-paid` matching ticket
07's commit against an unrelated operational-manoeuvre row) — the lint's own guidance is
that a verified-spurious advisory is the correct outcome, not a loose end.

## Tooling notes that cost real time

- **Use `/usr/bin/git`.** A bare `git` here can report another worktree's HEAD.
- **Concurrent sessions share this worktree.** Re-check `rev-parse --abbrev-ref HEAD`
  before committing; before merging, run
  `/usr/bin/git log $(/usr/bin/git merge-base main HEAD)..HEAD --oneline` and confirm
  every commit is yours. `git fetch` before authoring an ADR or a stamp batch — it may
  already exist.
- **`git merge -F -` does not read stdin.** Write the message to a file.
- If a worktree is needed, symlink `node_modules` — and note the `.gitignore` fix above
  now makes that safe.

## Suggested skills

- **`/grilling`** for risks 1–3. They are seal-consistency and design-intent questions,
  not implementation, and the user's stated preference is to be grilled on this kind of
  thing. Per memory `terrain-game-grill-communication-style`: open with the **flow map**
  at the altitude of a game designer, not with the detail, and use game language rather
  than engineering language. "I can't follow this" means the altitude is wrong.
- **`/doc-audit`** after any sealing batch — this session will touch DESIGN-RISKS,
  probably `capital/RULINGS.md`, and possibly an ADR, which is exactly ritual duty 7.
- **`/final-check`** at session close, especially given the two-phase shape: it
  reconstructs every request from the transcript, which is the right instrument when a
  session's second half is orientation rather than production.
- **Not `/implement`.** Nothing here is a claimed ticket. If risk 1 or 5 produces code,
  it is a small change behind a user ruling, not a ticket.
