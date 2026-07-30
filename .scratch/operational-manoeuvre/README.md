# Operational Manoeuvre — Wayfinder tracker

Layer: **Working** (local issue-tracker operations). Conventions:
`docs/agents/issue-tracker.md`. Triage labels: `docs/agents/triage-labels.md`.
This tracker points at the seal chain and never restates it.

Opened **2026-07-31**, by user decision, out of the geography-battle grill on ticket
06c's registered gaps. Session record and all measurements:
`.context/record-geography-battle-grill-2026-07-29.md`.

Current state: **opened, not scoped.** No gate exists yet. The design gates are
deliberately not written until they have evidence — see § Ordering.

## Destination

> **Position must mean more than adjacency.**

Today a force's position affects the game in exactly one way: whether it is adjacent
to something it can fight. Everything else that position ought to buy — going around,
going past, cutting off, cutting supply, being cut off — is designed at shape level,
registered as owed, and absent from the board.

The pass ends when a player can *manoeuvre*: when choosing **where** to put an army
is a decision with consequences the rules read, and when a defender's geography can
be defeated by movement rather than only by mass.

## Why one pass and not seven values

Seven registered debts each say "owed: its own pass". That is the signature of a
missing pass, not of seven missing values. They share one sentence — **the
relationship between where a force is and where the fighting is** — and four of them
are already *shape COMPLETE* plans in `operation-plan-catalog/CATALOG.md` with no
board implementation:

| the subject | where it is registered | catalog plan, if any |
|---|---|---|
| going around a door | this session's TC-⑮ / bypass A · B · C taxonomy | **Flanking Breakthrough (우회 돌파)** |
| walking past unopposed | **R14** — interception of a force in transit has no design (2026-07-26) | — |
| cutting supply | **R16** — the supply design pass | **Supply Interdiction (보급 차단)** |
| being cut off | Part 2 **#2** Encirclement threshold; 06c pinned `escape` to a constant; **D10** already designs the isolated-rout multiplier | **Encirclement and Annihilation (포위 섬멸)** |
| forcing a water door | TC-⑬'s surviving crossing column | **Crossing / Landing Securement (도하·상륙 확보)** |
| throttling a choke | TC-⑬'s frontage half, re-pointed here 2026-07-31 | — (D9 / M11 own it) |
| the map's depth | this session's map-resolution row (TC-⑪ froze the grid) | — |

## The three senses of "bypass" — settled vocabulary

Conflating these cost most of a session. They are separate mechanisms with separate
preconditions, and the pass must keep them separate.

| name | meaning | precondition | state |
|---|---|---|---|
| **Bypass A — target substitution** | attack a *different* sector instead | the realms touch at ≥2 sectors | already free; needs no mechanism |
| **Bypass B — approach substitution** | attack the *same* sector from a different neighbouring sector | the *target* has ≥2 reachable neighbours | **deferred here together with frontage** — the *capability* stands; only one implementation of it was retired. Read § Bypass B below before designing against it |
| **Bypass C — transit past** | do not attack it; march past and continue | a route exists | possible today, and **nothing can stop it** (R14) |

D9's `Removability` obligation ("chokes historically fail by **deletion**, not
attrition") means **A and C**. Anopaea was a path *around and behind*, not a different
angle of assault.

Measured on `terrain-cradle@r1`, all 15 legal partitions: contested edges 4–9,
distinct contact sectors **7–16**, partitions with a single contact sector **0** — so
bypass A always exists on this map, as a property of the authoring rather than a
guarantee the rules make. Blocking a door's arcs still reaches the target on
**24/24** doors, but at **0 extra turns on 20/20 land doors** (straits cost 2–3).
**That zero is the defect the pass exists to fix.**

### Bypass B is deferred, not abolished

**Corrected 2026-07-31 by final-check.** An earlier draft of this file called bypass B
"retired" and named its return "this pass's most likely self-inflicted regression".
That reads as a prohibition, and it is **not what the user decided**. Their words, in
the exchange that opened this pass: *"우회 A, 우회 B, 우회 C … 나는 결국 전부 다 구현하고
싶은 거잖아."* All three are wanted.

Two different things carried the one name:

- **(a) the capability** — an attacker *chooses* to enter a sector from a different
  neighbour. **Never retired.** Possible today, and the user wants it to matter.
- **(b) one implementation of it** — arriving by an undoored neighbour *lowers the
  defender's terrain multiplier*. **This** is what TC-⑮ retired, because it let a
  hex-grain fact decide a sector-grain outcome: the detour is free (0 extra turns on
  20/20 land doors) and 100 flanking men moved R from 0.56 to 2.22.

So the accurate state is that **(a) has no consequence in either direction right now** —
free *and* inert. Before TC-⑮ it was free with an enormous effect; now free with none.
Neither is what this pass wants.

**Where (a)'s consequence belongs: frontage, not terrain.** The reading measured during
the grill — the *door-share* reading, which matches M11's own wording
("engaged-**attacker-body** caps") — is:

```
engaged attacking substance = min(force that came through the door, that door's cap)
                            + force that arrived by any other approach
```

Under it, coming round buys a real advantage — escaping the cap — **without touching
the defender's ground**, and it is smooth rather than cliffed: at cap 1,000 against a
900 garrison, 100 flanking men give R 0.81 and 600 give R 1.19, where treating the cap
as an engagement ceiling jumps straight to 2.22.

**Therefore** bypass B's cost and benefit are this pass's to design, inside frontage.
What must not silently return is **(b)** — and even that is reversible through the
amendment protocol with a TC-⑮ stamp, not forbidden.

## Inherited seals — the pass may build on these, not silently revert them

- **ADR 0046** — an engagement is sited wherever a hostile force stands; the approach
  is recorded as a hex arc; commit is keyed per sector; hex is physical, sector is
  decisional.
- **TC-⑮** — a sector's defensive terrain is its own, always. The pass **may** add
  approach-dependence on top of this, but reverting it needs the amendment protocol
  and a TC-⑮ stamp. What that protects is the *terrain* rule; it is **not** a ban on
  bypass B as a capability — see § Bypass B is deferred, not abolished.
- **TC-⑬'s survivors** — the crossing column (river 0.70, strait 0.55 · ADR 0015) and
  reachable-weakest-link **among doors**.
- **D9** — frontage is a cap, never a multiplier, because its impact is unbounded. Not
  abolished; deferred here.
- **D10** — Encirclement's isolated-rout multiplier is already designed; `escape` is a
  named constant awaiting it.
- **WM-⑤** — rout displacement. Fall-back exists; where a *cut-off* force goes does not.
- **R13** — morale is parked, and is not available as a mechanism basis.

## The junction with `.scratch/l3-playable-build/`

Three layers, and only the middle one is a hard dependency.

### 1. Before ticket 10 — one-way: the build plants seams, this pass reads them

The build already uses this pattern: `FULLY_SUPPLIED`, `UNIFORM_QUALITY`,
`OPEN_ESCAPE`, and 06d's `conquest damage` at identity 1.0 are all named constants
whose comments state they are consequences of scope and point at whoever owns the real
answer. What was missing is an **address** for those pointers. `SEAMS.md` in this
directory is that address: a build ticket that plants a seam belonging to this subject
adds a row, and this pass's first act is to read the file.

This inverts the risk — instead of the pass discovering later what the build baked in,
the build declares it at planting time.

### 2. Tickets 10 and 11 — the hard junction

**Tickets 10 (`Select Differentiated Operation Plans`) and 11 (`Resolve Plan-Versus-Plan
Matchups`) are downstream of this pass.** Four of the twelve catalog plans they would
expose *are* this pass's subject, shape-complete and unimplemented. Recorded on both
sides so 10/11 cannot quietly become `ready-for-agent` and fill four plans from
imagination.

This pass's exit criteria must therefore include: **10 and 11 are buildable.**

### 3. Evidence runs one way — build → pass

The **scoping** of this pass (this file, `SEAMS.md`, debt consolidation) is done now.
Its **design gates do not fire until ticket 13** — one complete full-depth match to
capital fall — has produced a match report.

The reason is a lesson this project already paid for: the crisis pass tuned downstream
dials before establishing that the draw problem was upstream in the war system
(`docs/DESIGN-RISKS.md` R14). Designing manoeuvre before anyone has played a match
without it would repeat the shape. A played match is also the only honest source for
"here is where I wanted to manoeuvre and could not".

Upstream dependencies beyond 13: **06d** (ownership — Encirclement's isolation test
reads who holds the neighbours) and **08** (fog — a force in transit must be *seeable*
before intercepting it is a decision).

## Ordering

1. **Now:** this file, `SEAMS.md`, and the debt re-pointing. Done 2026-07-31.
2. **While the build runs:** seam rows accumulate. No design.
3. **After ticket 13's match report:** write the gates, then grill them.
4. **Before tickets 10/11 are claimed:** the pass must have closed.

## Not this pass

- **The map re-authoring itself.** The registered row (intra-sector terrain, TC-⑪'s
  frozen grid) is seed re-authoring tier. This pass may *state what depth it needs*;
  it does not author the map.
- **Frontage's value.** M11's caps are already 가안-sealed. What is owed is the removal
  economy that makes a cap mean something, not the number.
- **Morale** (R13), and **asymmetric terrain** — ground that favours the *attacker*,
  a new axis M5's defender-ward ladder does not have. Parked ideas, recorded in the
  session record.
