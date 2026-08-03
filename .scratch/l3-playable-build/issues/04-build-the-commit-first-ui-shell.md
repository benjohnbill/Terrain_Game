---
type: task
status: needs-info
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

Specification gates: **all resolved.** Wayfinder 03 and 07 were already; 10
closed 2026-08-02 (it owns every acceptance threshold); 12 closed 2026-08-03.
Gate 12's partition, in one line: **no new integration feature home** — the
Production homes are the existing feature birthplaces, plus ADR 0049 for the
Runtime authority and projection boundary. What still holds this ticket at
`needs-info` is `DECISIONS-OWED.md` Part 2 **#13** (the 판세 in-play surface),
not a gate.

Contract (interim pointers): gate 07 § Answer (commit-first skeleton
커밋량 → 행동 소환 → 세부 → 가능 지역 빛남 → 지목; commit bar as entrance;
visible turn-loop closure showdown → world update → N+1; **coupled continuous
camera**, wheel + drag; casual three-zone layout; renderer stays SVG,
measurement-gated); duel-pivot ledger Gate 6 (confirm card retired → inline 확정;
free target exploration before 확정; commit-notch retrospection with inline
취소); gate 03 § Answer (the seven-grade viewer matrix and its encodings);
`docs/DISPLAY-DEBT.md`.

**Conflict to route, not to resolve here.** Gate 07 encoded the derived-band
grade as **판세 = a match-level mini-meter**, and gate 03 lets treasury
uncertainty survive *only* as 판세 band width. Duel-pivot Gate 6 then sealed
(user, fork A) that the in-play **STRATEGIC 판세 bar is DROPPED** — one in-play
bar, tactical only, with the strategic verdict moved to a post-game coach
excluded from live play. Those two seals conflict over whether a live 판세
surface exists at all, and therefore over where treasury uncertainty shows.
**Do not pick a side inside this ticket.** Build the shell without a live 판세
meter (the later, user-sealed position), and treat the treasury-uncertainty
surface as blocked pending the resolution recorded in `docs/SYNC-DEBT.md`.

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
