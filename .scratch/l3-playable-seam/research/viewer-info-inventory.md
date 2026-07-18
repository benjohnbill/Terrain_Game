# Viewer-Information Inventory — Gate 07 Working Draft

Date: 2026-07-19
Status: **DRAFT — agent-compiled working inventory for gate 07; not canon.**
Definitions live at their birthplaces; every row is a pointer, never a
restatement. The **L column is a HYPOTHESIS** to be fixed with the user
(matryoshka disclosure model, issue 07 § Comments 2026-07-19).

## Legend

Grades (issue 03 § Answer matrix + the dev grade from issue 07's constraints):
`PUB` public · `OWN` own-exact · `EST` estimate band `[0.45,0.90]` ·
`DRV` derived band (zero new dials) · `LSN` last-seen + reach cone ·
`CAT` categorical (existence-class only) · `ABS` absent from projection
(MUST NOT render as data; render as stable absence copy) ·
`RVL` post-resolution reveal · `DEV` development placeholder.

Altitude (user 3-layer flow, issue 07 § Comments): `①` 형세판단 읽기 ·
`②` 전략 결정 · `③` 전술 실행. Primary listed first.

Cadence: `T` every-turn glance · `S` situational focus · `B` battle-time only.
Tier: `C` casual-first signal · `H` heavy-user depth · `CH` both.

L (disclosure-level hypothesis): `L0` top-level hint · `L1` province view ·
`L2` sector drill · `SC` summoned card · `BP` battle preview.

Pointers: `03` issue 03 Answer · `07C` issue 07 Comments · `spec#n` umbrella
spec user story n · `DD` DISPLAY-DEBT.md row · `GL` match-arc GLOSSARY row ·
`FR①` fog-of-war-discovery RULINGS ① · `A19` ADR 0019 (§A = v5 amendment).

## Inventory

| # | Value | Grade | Alt | Cad | Tier | L (hyp.) | Source |
|---|---|---|---|---|---|---|---|
| 1 | Terrain (per hex/sector) | PUB | ①③ | T | CH | L1 base | 03 §4 |
| 2 | Fortification grade (요새 등급) | PUB | ①③ | T | CH | L1 base | FR① · 03 §4 |
| 3 | Routes · chokes · door widths | PUB | ①② | S | H | L1/L2 | 03 §4 |
| 4 | Diplomatic relationships | PUB | ①② | T | CH | L1 base | 03 §4 |
| 5 | Current political control | PUB | ① | T | C | L1 base | 03 §1 |
| 6 | Land value / yield (per sector) | PUB | ② | S | H | L2 | 03 §2 |
| 7 | Register pool (public term of §2) | PUB | ② | S | H | L2 | 03 §2 |
| 8 | Region/sector identity · seats (수도/도시) | PUB | ① | T | CH | L1 base | 03 §4 |
| 9 | Crisis calendar (onset/stages/turn-35, public) | PUB | ①② | T | CH | L0 milestone + SC | DD:soil-and-crop · GL:위기 아크 |
| 10 | Truce locks + institution status (rungs alive) | PUB | ② | S | H | SC | DD:peacetime-institution · GL:truce lock |
| 11 | Resolution event stream (ordered, skip/step) | PUB | ①③ | T | CH | L0 tray | spec#19/22 · 07 hypotheses |
| 12 | Own substance (병력) | OWN | ①③ | T | CH | L1 | 03 §4 |
| 13 | Own fatigue | OWN | ③① | S | CH | L2/BP | 03 §4 |
| 14 | Own field-army position | OWN | ①③ | T | CH | L1 | 03 §4 |
| 15 | Own treasury | OWN | ② | T | CH | L0 resident stat | 03 §4 |
| 16 | Own civilian register remaining | OWN | ② | S | H | L2/SC | GL:징집 명부 (UI owes) |
| 17 | Own mobilization intensity + named zone | OWN | ②① | T | CH | L1 + SC meter | DD:mob-meter (1) · GL:동원 강도 |
| 18 | Own action capacity / commit pool | OWN | ③ | T | CH | L0 resident stat | 03 §4 |
| 19 | Own projectable mass + floor warning | OWN | ①② | T | CH | L0 alert + SC | DD:projectable-mass · GL:UI-direction |
| 20 | Own economy flows (생산 from/to) | OWN | ② | S | H | SC | DD:economy-legibility |
| 21 | Draft bill quote (exact, pre-confirm) | OWN | ② | S | CH | SC | DD:mob-meter (2) |
| 22 | M10 leak preview (zone band neighbors will see) | OWN | ② | S | H | SC | DD:mob-meter (3) |
| 23 | Own scar / uprising fuel (own sectors) | OWN | ①② | S | H | L2 | DD:soil-and-crop · GL:scar ledger |
| 24 | Own tension band (command card) | OWN | ③ | B | H | BP | DD:command-card IA |
| 25 | Enemy substance (garrison/army) | EST | ①③ | S | CH | L2 + BP | 03 §4 |
| 26 | Enemy fatigue | EST | ③ | B | H | L2/BP | 03 §4 |
| 27 | Per-sector confidence (intel freshness meta) | EST | ① | T | CH | L1 texture + L2 | 03 §5-inv.5 · A19 §A(정찰 lens) |
| 28 | Enemy civilian register (pool − serving) | DRV | ② | S | H | L2 focus detail | 03 §2 · 07C |
| 29 | Enemy mobilization intensity (worst-case → distribution) | DRV | ①② | S | CH | L1 summary → L2 | 03 §2 · 07C (sector-bound) |
| 30 | 판세 (Standing — match-level banded read) | DRV | ① | T | CH | Lens + SC (bar banned) | GL:UI-direction · 07C (isolated) |
| 31 | Enemy scar / fuel intel view | DRV | ② | S | H | L2 | DD:scar-mob-fog-view |
| 32 | Expansion break-even card | DRV | ② | S | H | SC | DD:expansion-break-even |
| 33 | Hollow-province read (front-committed fraction) | DRV | ② | S | H | L2/SC | DD:intent-scout |
| 34 | Acceptance-outlook band (settlement card) | DRV | ② | S | CH | SC | GL:수락 산술 |
| 35 | Hegemony work-list card (what blocks the trip) | DRV | ② | S | H | SC | DD:hegemony-work-list |
| 36 | Growth projection vs neighbors (candidate, unsealed) | DRV | ② | S | H | SC | 07C (idea registered) |
| 37 | Situation-axis outputs (위협/기회/불확실 + leak-through) | DRV | ① | T | C | **L0 core** | A19 §D1/§A |
| 38 | Enemy field-army position (fix + age + reach cone) | LSN | ①③ | T | CH | L1 mark + cone | 03 §4 · spec#7 |
| 39 | Border alarm (existence + heading only) | CAT | ① | T | C | **L0 core** | 03 §4 · spec#8 |
| 40 | Enemy standing posture | ABS | — | — | — | absence copy only | 03 §4 · spec#9 |
| 41 | Enemy commit allocation (→ what-if conditional lines) | ABS | ③ | B | H | BP what-if, never a prediction | 03 §4 · 07C (poker) |
| 42 | Enemy treasury (→ 판세 band width only) | ABS | — | — | — | no surface | 03 §3 |
| 43 | Engagement report (commit/posture at showdown) | RVL | ①③ | B | CH | L0 tray → SC detail | spec#9/19 · 깜깜이 showdown |
| 44 | Dev placeholder notice (self-announcing) | DEV | — | — | — | hatch + badge, all L | spec#25/26 · 07 constraints |

## Gaps and collisions

1. **판세 grouping collision (known, recorded).** Issue 03 §4 groups 판세 with
   the sector-level derived bands; the 2026-07-19 session isolated it as
   match-level (issue 07 § Comments). Issue 03 needs an amendment pointer at
   the gate's doc-sync; until then the two sources diverge.
2. **Enemy standing-rebel stack visibility is unclassified.** DD:soil-and-crop
   wants the crisis readable on the map as a world event ("map-visible
   per-sector rebel stack"), while DD:scar-mob-fog-view routes others' fuel
   through the fog spec (band + confidence). Whether an ENEMY sector's risen
   stack is a public world event or a banded read is not ruled anywhere read
   for this inventory. Needs a ruling before L1/L2 placement.
3. **Showdown reveal scope is unpinned.** spec#9 seals "hidden before
   resolution", and the information ladder makes the engagement the reveal
   event, but no source read here pins WHAT the post-resolution report
   discloses (exact commit lever? a band? posture name?). Row 43 cannot be
   encoded until this is answered — likely build-04-adjacent, flag to gate 08.
4. **Own tension band (row 24) is under-specified** in available sources
   (born in the 2026-07-03 handoff §5; only named in DD:command-card IA).
   Kept as a pointer row; needs its birthplace consulted before design.
5. **DD:중원-visual-centrality carries no information value** — it is a map
   composition debt (seed re-authoring tier), so it has no inventory row.
6. **Confidence presentation has no sealed encoding.** Row 27 is load-bearing
   (it drives band width, 불확실 axis, and the 정찰 lens labels) but its only
   surface precedent is the v5 lens confidence labels; the issue 07 hatch
   texture is a hypothesis. Consistent, but the value deserves an explicit
   encoding decision in the prototype pass.
7. **Mirror channel note (no gap):** M10 leak preview (row 22) implies the
   enemy's mobilization ZONE band is also an incoming channel — covered by
   row 29's banded read; no extra row needed.

## Counts

- By grade: PUB 11 · OWN 13 · EST 3 · DRV 10 · LSN 1 · CAT 1 · ABS 3 · RVL 1 · DEV 1 — **44 values**.
- By primary altitude: ① 15 · ② 10 (excl. ABS/DEV) · ③ 5 · unassigned (ABS/DEV/RVL edge) 4 — several rows serve two altitudes; primary counted.
- L0 hypothesis load: **rows 9, 11, 15, 18, 19, 37, 39, 43** (8 candidates) —
  already more than a "sparse hint layer" comfortably holds; trimming L0 is
  the first decision the disclosure pass must make with the user.
