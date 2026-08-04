---
type: task
status: open
blocked_by: [03]
---

# 04 — Build the Commit-First UI Shell

> **Migrated to front matter 2026-08-03** (ticket 14 R3). The old
> header lines carried prose that the schema moves off the status line:
>
> - **blocked-by line was:** 03 — Close the Simultaneous Commit-and-Reveal Turn Loop.

**What to build:** The interaction shell gate 07 sealed on a live prototype, in
React over the Runtime: a thin top strip, the map filling a calm middle, and the
commit bar as the hero and the entrance. Information is **summoned by the commit
decision**, not always painted. Every later ticket plugs its surface into this
shell instead of inventing one.

**Code answering that description is already on `main`, and it did not arrive
through this ticket** (recorded 2026-08-04). The 2026-08-03 landing/submission
lane built a commit-first shell over the real Runtime — `game/src/ui/DemoShell.tsx`
(717 lines), `game/src/ui/shell.css`, and a reworked `game/src/ui/App.tsx` —
committed at `45170fd` and merged at `9a17cb3`. It was written under a same-day
submission deadline and has not had this repo's two-axis review.

**RULED 2026-08-05 (user grill): this ticket MERGES. It neither adopts that code
as its deliverable nor discards it.** Measured before ruling, and the measurement
is why the binary question had no good answer: **neither file is a superset of the
other.** `DemoShell.tsx` carries the sealed flow (커밋량 → 행동 → 세부 → 빛남 →
지목), the LEFT/RIGHT bands, and a reconnaissance stand-in; it carries **none** of
recruitment (0 references against `App.tsx`'s 34), field-army division and merge,
garrisons, the battle card, or forced march as a choice. `App.tsx` carries every
one of those and none of the flow, and declares itself a probe in three places —
`TurnStrip` says outright that it *"is meant to be deleted"*. So this ticket
builds one shell on `DemoShell.tsx`'s flow skeleton with `App.tsx`'s mechanical
surface brought into it, and closes the second Vite entry (`game/demo.html`).

Two duties ride with that ruling:

- **A seam audit is the first act, not the last.** The merged code has not had
  this repo's two-axis review, and the question it must answer is not "is this
  good code" but **"can tickets 09–13 plug into this shape"** — the failure
  `docs/SYNC-DEBT.md` named as the expensive and hard-to-see one. Play cannot
  answer it: play surfaces a wrong feel, not a seam in the wrong place.
- **Three self-declaring comments become false on adoption and are corrected in
  the same batch** — `DemoShell.tsx`'s header (*"not build ticket 04 … this claims
  none of it"*), `App.tsx`'s header, and `TurnStrip`'s. A comment whose reason has
  expired while its conclusion stands is a defect by this repo's own law
  (`AGENTS.md` § Reasons are load-bearing), and these are load-bearing: they are
  what a cold reader uses to decide which file is authoritative.

*(This paragraph read "the front matter is **not** wrong … `status` answers only
whether this can be picked up, and it still cannot — Part 2 **#13** is still
open" for the few hours between the scoping ruling and #13's closure the same
session. Both halves were true when written and the second expired within the
batch; it is corrected here rather than deleted, because the reasoning it records
is what kept `status` honest while the scoping question was live.)*
**#13 closed later the same day (ADR 0053) and `status` moved to `open`.**
The principle stands and is why the front matter never needed "correcting":
`status` answers only whether the ticket can be picked up, and outcomes and
history belong in the body — which is where this paragraph sits
(`docs/agents/issue-tracker.md` § Ticket front matter).

**Design decisions this ticket now carries — ADR 0052 (2026-08-05).** The same
grill separated the player's two decision axes: commitment is a multiplier
(saturating at ×2, M2) decided in the commit bar, and **force is substance
allocated on the map**, which had no surface at all before. Read the ADR; the
three consequences that land as acceptance items below are the verb test, the
drag discriminator, and recruitment's promotion to a verb. Note also what the ADR
makes reachable: a player directing part of a field army toward their own ground
is garrison reinforcement, and **garrison → field is HELD** pending a user ruling
on the wear ledger (`docs/SYNC-DEBT.md`) — so that surface is one-way today.

Specification gates: **all resolved.** Wayfinder 03 and 07 were already; 10
closed 2026-08-02 (it owns every acceptance threshold); 12 closed 2026-08-03.
Gate 12's partition, in one line: **no new integration feature home** — the
Production homes are the existing feature birthplaces, plus ADR 0049 for the
Runtime authority and projection boundary. ~~What still holds this ticket at
`needs-info` is `DECISIONS-OWED.md` Part 2 **#13** (the 판세 in-play surface),
not a gate.~~ **#13 closed 2026-08-05 (ADR 0053), and nothing else held this
ticket: `blocked_by: [03]` was already satisfied. Status moved to `open` in the
same batch — this ticket is takeable.**

Contract (interim pointers): gate 07 § Answer (commit-first skeleton
커밋량 → 행동 소환 → 세부 → 가능 지역 빛남 → 지목; commit bar as entrance;
visible turn-loop closure showdown → world update → N+1; **coupled continuous
camera**, wheel + drag; casual three-zone layout; renderer stays SVG,
measurement-gated); duel-pivot ledger Gate 6 (confirm card retired → inline 확정;
free target exploration before 확정; commit-notch retrospection with inline
취소); gate 03 § Answer (the seven-grade viewer matrix and its encodings);
`docs/DISPLAY-DEBT.md`.

**The conflict this ticket was told to route is RESOLVED — ADR 0053
(2026-08-05, user grill).** Gate 07 had encoded 판세 as a match-level mini-meter
while Gate 6 fork A dropped the in-play strategic bar, and fog `RULINGS.md` ④
decision 6 turned out to be the whole of the disagreement, exactly as the note
below guessed: an **evidence** surface is not a **verdict** surface, and the two
seals were never talking about the same object.

Ruled: **no in-play 판세 meter.** What rests in the top strip is **coverage —
how much of the opponent's ground this viewer has observed** — which is legal
there because it reports the viewer's own epistemic state rather than a position
on the match. The evidence contrast of ④ decision 6 is **summoned** from that
band and closes again. Read ADR 0053 for the reasons; they are not restated here.

**One thing left this ticket when #13 closed, and it is registered rather than
carried:** gate 03 C03.6 routed enemy-treasury uncertainty through "판세 band
width", and there is no 판세 band. `docs/SYNC-DEBT.md` holds the question. **It
does not block the build** — both live readings agree that no treasury figure and
no treasury-specific band is ever published, so the shell is buildable either way.

> *(Retained for the record — the 2026-08-03 note that turned out to be right.)*
> **New input to #13, registered 2026-08-03 — fog `RULINGS.md` ④ decision 6.** The
> fog grill named a distinction the two conflicting seals appear to have been
> talking past: an **evidence surface** is not a **verdict surface**. Gate 6's
> prohibition is on an in-play strategic verdict and a live coach read; laying out
> the materials a player reasons from — the aggregated sector side, the force
> contacts refused a total, and the viewer's coverage — asserts no position and
> falls outside it. Ruling ④ seals *what* the surface must and must not do — four
> clauses, at its birthplace and deliberately not copied here — and does **not**
> place it, because placement is this ticket's blocker and not fog's to take.
> Whoever rules #13 should read ④ decision 6 first; it may be the whole of the
> disagreement.

- [ ] The three-zone layout renders: thin top strip, map-filled middle, commit-bar hero; the resting screen is calm rather than dashboard-dense.
- [ ] The commit flow runs 커밋량 → 행동 소환 → 세부 → 가능 지역 빛남 → 지목 with the commit bar as the entrance; detail panels appear on the commit decision and are not permanently painted.
- [ ] Before 확정 the player may freely re-click eligible sectors with no lock on first click; 확정 is an inline lightweight confirmation in the commit bar, not a modal card.
- [ ] After 확정, clicking a committed order's commit notches re-shows that order and offers an inline 취소 that returns its 행동력 to the stack for the same turn.
- [ ] Navigation is one coupled continuous camera — wheel zoom plus drag pan — with no discrete semantic-zoom levels.
- [ ] Turn closure is visible: 턴 종료 → reveal → event tray → the changed world reads as the next turn's opening information state.
- [ ] The renderer stays SVG; any escalation is gated on a measurement, not on ambition (ADR 0028).
- [ ] React and the renderer receive only viewer projections; no rule, threshold, or authoritative field is computed or held in the view.
- [ ] **A sector reading and a force marker are unmistakable for one another** (fog `RULINGS.md` ④ decision 5): the sector card is anchored to its sector and blurs in its figure; the force marker is anchored to a hex, floats free of any sector, and blurs in its position as its cone grows. A player must not be able to read a force's count as a property of the sector under it — if they can, the evidence contrast of ④ decision 6 reads as a defect rather than as the tension it is. Verified with a human in the browser, not asserted from tests.
- [ ] Browser verification covers the agreed viewport and records it; visual behavior is not claimed from Node tests.
- [ ] Any deliberately deferred visual work is registered in `docs/DISPLAY-DEBT.md` rather than left implicit.

*Added 2026-08-05 by the merge ruling and ADR 0052:*

- [ ] **One shell, not two.** The build leaves a single play surface: `DemoShell.tsx`'s flow skeleton carrying `App.tsx`'s mechanical surface, with `game/demo.html` and its Vite entry removed. The Playwright browser suite drives the surviving entry — today it drives `index.html` only, so a shell adopted without moving those specs would be the one shell nothing tests.
- [ ] **The seam audit ran before the merge was built on**, and its question was whether tickets 09–13 can plug into this shape — recorded, not asserted.
- [ ] **The three self-declaring comments are corrected** (`DemoShell.tsx` header, `App.tsx` header, `TurnStrip`), so no file still says it is not this ticket's while being it.
- [ ] **The verb test holds** (ADR 0052 decision 4): every order that spends commitment enters through the commit bar, and every order that does not, does not. Recruitment is a commit-bar verb; division, merge and forced march are not. A reviewer can check this against the Runtime — only `allocate-commitment` and `allocate-recruitment` write the allocation map.
- [ ] **Recruitment runs as a commit-bar verb**, and the reads `docs/DISPLAY-DEBT.md` owes the recruit card land with it: the mobilization-intensity meter with its named zone, the exact quoted bill before 확정, and the M10 leak preview. Its DISPLAY-DEBT row is paid or re-cut in the same batch, not left standing beside a built surface.
- [ ] **Force is allocated on the map** (ADR 0052 decisions 1–2): an own field army is directed by dragging from it to a destination, divisions persist as independent field armies across turns, and the arrow reads before it is released.
- [ ] **Drag is disambiguated by its origin** (ADR 0052 decision 3): drag on empty map pans the camera, drag from an own force issues an order. Gate 07's coupled continuous camera is otherwise untouched, and this is verified with a human in the browser — a pointer-target rule is exactly what a Node test cannot see.

*Inherited from build ticket 08 on 2026-08-05, when that ticket resolved:*

- [ ] **The defensive reading surface mirrors the offensive one** rather than being a separate one-off panel. Ticket 08 built the material a mirror is made from and no UI at all — one `IntelligenceView` serves both the attacking and the defending read, and `alarms` is the defender's free floor (border alarm gives existence and direction inside the defender's own ring; paid response stays a separate purchase). Placing that mirror is this ticket's, which is why 08 could not satisfy it and did not try.
- [ ] **Garrison reinforcement is honest about being one-way.** Field → garrison is landed; garrison → field is unwired and HELD. The surface does not offer the return trip, and does not imply it is available.
- [ ] **축성 stays a facade and says so.** Its unit price is a design blank (FG-M①, R2), so it cannot be a verb under the verb test; the shell must not invent a price to make the row look complete.

*Added 2026-08-05 by ADR 0053 (Part 2 #13's closure):*

- [ ] **No in-play 판세 meter exists anywhere in the shell.** Nothing states who is ahead at match level while the match runs. A reviewer can check this by asking of every resident element: is this the viewer's own epistemic state, or a position on the match? The second kind does not ship.
- [ ] **The top strip carries a coverage band** — how much of the opponent's ground this viewer has observed — and it is the only match-level resident. It reports width, never a centre, the way gate 07 requires a sector band's width to be felt.
- [ ] **The evidence contrast is summoned from that band and closes again**, honouring all four clauses of fog `RULINGS.md` ④ decision 6 at their birthplace: no published "unaccounted N"; the sector side aggregated; the force side **refused a total** with the refusal visible as a dated list rather than a sum; coverage shown beside. It is evidence, and nothing in it asserts a position.
- [ ] **Coverage's own definition is settled before it is rendered** — a percentage of *what* (sectors held, sectors visible, land value, register?) is a magnitude question owed to `docs/features/fog-of-war-discovery/`, and it is not a new dial if it reads off a quantity that already exists. The shell must not mint the definition by picking whatever was convenient to compute.
- [ ] **No treasury figure and no treasury-specific band is published**, whichever way the gate 03 C03.6 question in `docs/SYNC-DEBT.md` is later ruled. Both live readings agree on this, which is why it does not block.

*Placements ruled 2026-08-05 (user), by the residency rule: **what rests on screen must be a question, never an answer.** These are the mechanics `App.tsx` holds that the merge brings across; each needed a home and none had one in this ticket or in gate 07.*

- [ ] **The battle card arrives on its own at turn closure** — the one deliberate exception, because a result is a notification and making the player go and ask for it is the wrong shape. It keeps `App.tsx`'s reading order (ground first — terrain, crossing, fortification, defence method — then the two commitments), which is what makes "I poured more and still lost" legible.
- [ ] **Garrisons are summoned by clicking their sector.** Own information, so it may rest without leaking anything; it does not rest anyway, because it is an answer nobody asked for.
- [ ] **The economy is summoned from the commit bar** (treasury, income, register, 동원 강도). Its DISPLAY-DEBT row (*Economy-legibility surface*) stays parked and is not silently discharged by rendering the numbers — a read of *where 생산 comes from and goes* is what that row owes, and a figure strip is not it.
- [ ] **Mobilization signals live inside the summoned evidence surface**, not on their own. ADR 0053 gave them a home when it placed the coverage band, and gate 07 already encoded 동원 강도 as a sector-bound band summoned on command — the two agree.
- [ ] **The seat bar rests** — the second deliberate exception. Whose seat it is, what that seat owes, and the hand-off are load-bearing in hot-seat play: `App.tsx` added it because a player who locked realm-a had nothing on screen telling them they were also realm-b. It is not a claim about the match, so the residency rule does not exclude it.
- [ ] **Every own field army reads its current position, and one under orders reads its destination and turns remaining.** Carried forward, not newly decided: this is build ticket 06a's accepted acceptance item, which discharged itself as *"Legibility only; ticket 04 owns the real shell"* and has had nowhere to land since. ADR 0052 fixes where — force lives on the map, so the marker carries it — but the *read* is 06a's requirement and survives whatever the marker ends up looking like.
- [ ] **Forced march rides as a modifier on the march order it belongs to** (ADR 0052 decision 4) — not its own verb, and not a global setting that silently applies to every order in the turn. It pays fatigue rather than commitment, which is why the verb test excludes it. **The widget is deliberately unruled**: which surface carries the toggle — the drag arrow, the 세부 step, or a per-order control after 지목 — answers to a running screen, the same disposition ticket 09 takes to its own visual treatment. Bring it to the user on the live shell; do not settle it on paper here.
