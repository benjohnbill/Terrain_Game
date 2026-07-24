# 03 — Close the Simultaneous Commit-and-Reveal Turn Loop

**What to build:** The spine. Both realms allocate a whole turn's orders in
secret from one non-hoardable 행동력 chip stack, lock, then reveal and resolve
together, and the folded result opens turn N+1. Resolution may be stubbed to a
placeholder outcome in this ticket — what must be real is the loop, the blind
commit, the symmetric reveal, and the budget.

**Blocked by:** 02 — Publish the World Artifact and Partition It Into Two Realms.

Status: needs-info

Specification gates: Wayfinder 02 (resolved), 10, 12.

Contract (interim pointers): duel-pivot ledger Gate 6 — **D6.1** (simultaneous
blind commit → simultaneous reveal and resolution), **D6.1a** (resolve order is
simultaneous and symmetric, no first-mover asymmetry), **D6.2** (three-tier phase
skeleton: decision ② / payoff ④ non-demotable / background ①⑤ auto-folded),
**D6.3** (행동력 = one chip stack, the single currency for every order kind,
regenerated each turn, non-hoardable, Σ ≤ budget); gate 02 § Answer §4–§6
(bots are ordinary callers, turn order is a Runtime rule, the Runtime never
sleeps, the intent log plus seed is canonical); `DOMAIN_MAP.md` (no standalone
move command).

**In-build design — the resolve-order algorithm (D6.1a).** Only the *principle*
is sealed. The concrete case enumeration and adjudication rule (both armies into
the same sector, each striking the other's origin or supply, one vacating as the
other enters) is **its own rule-design pass, and it happens here** — it needs the
real board and the wired engine as inputs. Do not open a pre-build grill for it;
do enumerate the cases against this world artifact, design the symmetric rule,
and record the ruling for promotion. Where the contact point is a battle, the
per-sector atomic combat of ticket 06 adjudicates it, and 창 산술 (slice-2 ticket
08) is the existing deterministic symmetric precedent for movement interception.

**Second seat until ticket 12.** Before the bot exists, the opposing realm is
driven by a scripted ordered intent log — which is the reproducibility contract
itself, not a scaffold to throw away.

- [ ] A turn runs decision ② → payoff ④ → background ⑤ folded into ④'s tail → opening ① of turn N+1, with no separate upkeep screen and no extra click.
- [ ] The payoff phase is structurally non-demotable: no code path skips or fast-forwards the reveal.
- [ ] Neither realm can observe the other's allocation before both are locked; the projection, preview, and event stream carry no pre-reveal commitment of the opponent.
- [ ] 행동력 is one stack regenerated to the same size each turn; unspent budget is discarded at renewal; the sum of a turn's allocations cannot exceed the budget; the same pool funds combat, reconnaissance, relocation, and every other order kind.
- [ ] Spreading the stack across fronts measurably thins each front's relative ratio (no per-order-count budget anywhere).
- [ ] Resolution applies both revealed plans with **no first-mover asymmetry**: swapping which realm is `realmA` leaves the resulting board and events equivalent under that relabelling.
- [ ] The enumerated overlap cases each have a stated symmetric resolution, covered by tests, and the ruling is recorded for promotion at spec authoring.
- [ ] Turn order and legality live in the Runtime; an out-of-turn or stale intent is rejected with a reportable reason and no state transition.
- [ ] `submit` returns immediately and never sleeps; pacing stays in the UI.
- [ ] No standalone move command exists; position changes only as a product of an operation outcome.
- [ ] `(worldId, revision, seed, ordered intent log)` replays the same turn sequence in Node and browser.
