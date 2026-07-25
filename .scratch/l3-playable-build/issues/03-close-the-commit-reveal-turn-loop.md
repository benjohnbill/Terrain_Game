# 03 — Close the Simultaneous Commit-and-Reveal Turn Loop

**What to build:** The spine. Both realms allocate a whole turn's orders in
secret from one non-hoardable 행동력 chip stack, lock, then reveal and resolve
together, and the folded result opens turn N+1. Resolution may be stubbed to a
placeholder outcome in this ticket — what must be real is the loop, the blind
commit, the symmetric reveal, and the budget.

**Blocked by:** 02 — Publish the World Artifact and Partition It Into Two Realms.

Status: resolved

Ready under README § Amendment R6, 2026-07-25: (i) gate 02 is `resolved`;
(ii) the one row that was failing — § 1.3's re-expression — is **sealed by ruling
R8** (`DECISIONS-OWED.md` § R8), the 행동력 stack size is recorded in the repository
(ledger D6.3, 가안 20), and the non-combat unit prices R2 left unset are not
invoked here (recon is ticket 08, 천도 is out of scope).

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

- [x] A turn runs decision ② → payoff ④ → background ⑤ folded into ④'s tail → opening ① of turn N+1, with no separate upkeep screen and no extra click.
- [x] The payoff phase is structurally non-demotable: no code path skips or fast-forwards the reveal.
- [x] Neither realm can observe the other's allocation before both are locked; the projection, preview, and event stream carry no pre-reveal commitment of the opponent.
- [x] 행동력 is one stack regenerated to the same size each turn; unspent budget is discarded at renewal; the sum of a turn's allocations cannot exceed the budget; the same pool funds combat, reconnaissance, relocation, and every other order kind.
- [x] Spreading the stack across fronts measurably thins each front's relative ratio (no per-order-count budget anywhere).
- [x] Resolution applies both revealed plans with **no first-mover asymmetry**: swapping which realm is `realmA` leaves the resulting board and events equivalent under that relabelling.
- [x] The enumerated overlap cases each have a stated symmetric resolution, covered by tests, and the ruling is recorded for promotion at spec authoring.
- [x] Legality lives in the Runtime, expressed for a simultaneous turn: `currentActor` reads as the current **phase** (is the commit window open?), and rejection covers "this realm has already locked this turn" and "the window is closed" rather than an alternating out-of-turn test. Gate 02's guarantee — the Runtime, not the caller, decides legality — holds unchanged; only its expression changes, because gate 02 was sealed a week before the pivot made turns simultaneous. **Sealed by ruling R8** (2026-07-25, user) — this item is no longer a proposal.
- [x] The three tiers are implemented as decision / payoff / background, and the vestigial circled phase numbers (①②④⑤, with no ③ defined anywhere) are dropped rather than back-filled with a phase nobody designed (user ruling 2026-07-25).
- [x] `submit` returns immediately and never sleeps; pacing stays in the UI.
- [x] No standalone move command exists; position changes only as a product of an operation outcome.
- [x] `(worldId, revision, seed, ordered intent log)` replays the same turn sequence in Node and browser.

## Ruling — the resolve order (TL-①), designed in-build per D6.1a

D6.1a sealed the principle (simultaneous, symmetric, no first-mover asymmetry)
and routed the concrete rule into this ticket, against the real board. Enumerated
against `terrain-cradle@r1` under a drawn two-realm partition (56 sectors, 17
edges, `sectorAdjacency` carrying **no** cross-region link, so region-border edges
are the entire contact surface — 4 to 6 of them contested per draw):

| # | Case | Resolution |
|---|---|---|
| 1 | Both realms commit to the same front | **One engagement per front**, entered by both sides' chips at once. No attacker and no defender role, so there is no first blow to award; the reading is a per-side quantity. |
| 2 | Both realms move into the same sector | **Structurally impossible on this board.** The partition covers every sector, so an "empty" sector to converge on does not exist; an owned sector's holder is a party to the front, not a co-entrant. |
| 3 | One realm vacates as the other enters | **Cannot arise yet.** No standalone move command exists (`DOMAIN_MAP.md`); position changes only as a product of an operation outcome, and outcomes resolve inside the same payoff tier. Becomes real when ticket 06 gives an operation a force to move — recorded here so that ticket inherits the enumeration rather than restarting it. |
| 4 | One realm presses two fronts that share a sector | **Real and measured** (`r7_s0` is the door for two region borders). They stay **two fronts**, because a front is an edge and these are two edges. Whether two pressures on one sector merge into a single engagement is a *combat* question and belongs to ticket 06's per-sector adjudication. |

**The rule that covers all four:** fronts resolve in canonical key order, and
nothing consults an actor's identity or anyone's submission order. That, plus
per-side quantities, is what makes the whole turn equivalent under relabelling the
two realms — asserted directly, not argued (`turn-loop.test.js`, the relabelling
and lock-order tests).

**Zero new values.** The rule introduces no threshold, no coefficient, and no
dial. The only number this ticket writes is the 행동력 stack size, which is
ledger D6.3's recorded 가안 20, declared once in `game/src/domain/commitment.ts`.

Owed: promotion into the turn-structure birthplace when it is minted — the same
home R7's visibility rule, R8's legality rule, and the linear-commit grammar are
waiting on (`docs/SYNC-DEBT.md`).

## Comments

### Implementation evidence — 2026-07-25

- Commit: `<this ticket's commit>`
- Production authority: duel-pivot ledger Gate 6 D6.1 / D6.1a / D6.2 / D6.3
  (`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`); Wayfinder gate 02
  § 4–§ 6; rulings R7 and R8 (`DECISIONS-OWED.md`); `DOMAIN_MAP.md` (no standalone
  move command)
- Narrow tests: `npm run test:game` — **94 pass / 0 fail** (26 new in
  `game/tests/turn-loop.test.js`); `npm run test:browser:game` — **14 pass**
  (2 new in `boot.spec.js`, 1 new in `viewer.spec.js`)
- Shared gates: `npm run verify:game` — typecheck / build:runtime / build:viewer /
  test:node / test:browser all **PASS**, parity **PENDING** by design (gate 10 owns
  the threshold; both hosts produced identical projections). Root regression
  `npm test` **479/479**. `npm run lint:docs` 0 blocking, 7 advisory (known
  ledger-currency false positives).
- Browser/runtime check: built viewer at `/dist-viewer/index.html`, world
  `terrain-cradle@r1`, seed `duel-0001` (viewer) and `browser-lane-0001`
  (harness); a human cycles a full turn through the grey-box strip — allocate,
  lock, watch the reveal, land on turn 2 — and an ordered intent log replays to
  the same turn state in Node and in the browser.
- Legacy evidence disposition: none used. 창 산술 (`js/intel.js`) was available as
  the deterministic symmetric precedent and was **not needed** — the overlap cases
  that require it are case 3, which cannot arise until ticket 06.
- Follow-up: the turn-structure birthplace debt (`docs/SYNC-DEBT.md`) now also
  owes TL-① above. Ticket 04 replaces `TurnStrip` in `game/src/ui/App.tsx` with
  gate 07's sealed commit-first shell; it is marked in-file as a probe to delete.

### Deliberate scope notes

- **Resolution is a reading, not an outcome.** Every `front-resolved` event
  carries `outcome: 'pending-operations'` and changes no ownership. Combat is
  ticket 06 and the capital fall is ticket 07; a stub that moved a border would be
  inventing both.
- **`capitalLocked` became `committed`.** R7 is "the general commit-and-reveal
  rule, not a capital-beat special case", and this ticket inherits it — so the
  projection carries one field meaning "realms that have locked the current beat"
  rather than one field per beat. Every ticket-02 assertion survived the rename.
- **The payoff and background tiers are not resting phases.** They take no input
  (D6.2) and the Runtime never sleeps (gate 02 § 4), so a resting payoff phase
  would require a submission to leave it — the extra click D6.2 forbids. The tiers
  are stamped on every event instead, which is what lets a display pace them.
