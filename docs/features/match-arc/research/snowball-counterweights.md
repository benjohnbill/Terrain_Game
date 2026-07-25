# Snowball Counterweights in a Conquest Duel — Survey

Status: RESEARCH (evidence layer — input to seals, never normative on its own)
Date: 2026-07-26
Origin: a by-product of Wayfinder gate C (ADR 0044, ruling R16). The user accepted
snowball as inherent to a conquest game, named three counterweight directions, and
**ruled that designing them now would stretch the session** — asking instead for a
brief survey, confirmation, and then this document.
Purpose: give the deferred counterweight session a starting map — what this project
already has, what it half-has, what the genre and military doctrine offer, and where
there is genuinely nothing to copy.

**This is not a design pass.** No device is adopted here, no value is proposed, and
nothing in this file is citable as a rule. See § 7.

---

## 1. Provenance, stated up front

Two kinds of claim appear below and they are **not** interchangeable:

- **[repo]** — read out of this repository's own seal chain or code during the gate
  C session. Authoritative where it points; the pointer is given.
- **[external]** — game-design commentary or military doctrine from outside the
  project. **Evidence about how others solved a similar problem.** It carries no
  authority here at all, and several items are recorded specifically as approaches
  this project has *excluded*.

Sections 3 and 4 are [repo]. Section 5 is [external].

## 2. The frame — read this before proposing anything

**User ruling, 2026-07-26 (gate C, R16):** snowball is inherent to a conquest game
and the winning side getting stronger is correct. Territory carries its population
and economy, so acquired land pays its taker — that is the direct consequence of the
Tier-0 principle *land-derived state*, not a balance choice.

**Therefore the counterweight is NOT to be found in limiting growth from land.**

> *"이는 영토 점령에 따른 성장 자체를 제한하기보다는 시스템 외적인 별도의 수단으로
> 상쇄하는 것이 맞다고 봅니다."*

The concern being answered is narrower than "snowball": it is that **a player who
gains an early lead for reasons unrelated to skill should not run away with the
match.** Late-game acceleration by a player who earned it is not the problem.

The three directions the user named:

- **(a)** a combat-oriented system that pulls players into fighting;
- **(b)** holding out, then counterattacking into an **Opening** (the sealed
  situation axis);
- **(c)** breadth costing **cognitive load** — as territory grows, attention is
  consumed and the commit-allocation unit coarsens, so the **risk unit grows with
  the realm**.

Most of § 5 fails the frame. It is recorded anyway, because knowing which
well-known answers are excluded is itself useful — otherwise each future session
rediscovers and re-proposes them.

## 3. Already mechanical — the project has more of this than expected  [repo]

| Mechanism | Where | What it does |
|---|---|---|
| **Defence's structural edge** | `MAGNITUDE.md` M5 + M2 | Terrain up to ×2.0 and fortification up to ×2.4 — **×4.8 combined** — are defence-only, while the commit lever is symmetric at ×1.00–×2.00 (M2). At equal commit the defender holds a large asymmetric advantage the attacker must pay for in substance. **The formula being a product is what makes levers cheaper than mass.** |
| **A fixed budget against a growing frontier** | ledger D6.3 (20-chip stack) + gate C measurement | The 행동력 stack does not scale with territory. More land generally means more contested border sectors, and the same 20 chips spread across more fronts. Measured over all 15 legal partitions of `terrain-cradle@r1`: a 1v1 realm has **3–8 border sectors (mean 6)**, and conquest usually grows that count. |
| **The integration lag** | ADR 0022 / ADR 0029 | A fresh capture starts at 50% usable economy and 60% usable population, recovering +10pp per stable turn. Newly taken ground pays little for roughly four turns. |
| **Proportional register succession** | gate C R17 / ADR 0044 | A taker inherits the loser's *accumulated* register share, not the land's nominal value. Conquering a province already bled dry yields correspondingly few bodies. |

**Direction (c) is therefore already half-structural**, through the fixed stack
against a widening frontier — with no new device.

**Two cautions, both material:**

- **It is not monotonic.** Taking a salient can *shorten* a frontier. Conquest does
  not reliably increase the number of fronts a realm must cover, so the fixed-budget
  effect is real but not a dependable brake.
- **The ×4.8 ceiling is a watch item, not settled comfort.** See § 5 on the
  doctrinal 3:1 figure. A defensive advantage that is *too* steep produces a frozen
  board, and this project has met that failure before (the L2 thick-shield freeze,
  decided 21%→7%). That freeze came from garrison *mass* rather than from the
  terrain/fortification multiplier, so this is an adjacent risk rather than the same
  one — but it is the same family of failure.

## 4. Named in the seal chain, defined nowhere  [repo]

**`conquest damage` / `M6 inheritance cost`.** ADR 0029 and the match-arc `정산`
GLOSSARY row both state that settlement territory arrives undamaged "vs conquest
damage + M6 inheritance cost". **No rule and no value anywhere defines either
term.** Its only contrast was settlement, which ADR 0042 retired, so the phrase now
floats with nothing on the other side of it.

This matters here because "**freshly taken ground is weakly held**" is precisely
what directions (a) and (b) want, and the vocabulary for it already exists.

**One tension the deferred session must resolve rather than inherit:** 노화 헌법 P2
(match-arc MT-①) permits permanent damage only through identity acts (초토화), and
초토화 is out of scope by R9. So conquest damage cannot be permanent, which leaves it
acting on recovery *speed* — which is what the ripening lag in § 3 already does. The
overlap is unresolved.

**Isolation already in place:** ticket **06d** builds `conquest damage` as a named
seam at identity 1.0, so a later decision is a **value change rather than a
redesign**. Tracked in `docs/SYNC-DEBT.md`.

## 5. External precedent  [external — no authority here]

### The one strong find: the culminating point of attack

US Army operational doctrine names, exactly, the thing directions (a) and (b)
together describe:

> All offensive operations reach a point — the **culminating point** — when the
> strength of the attacker no longer decisively exceeds that of the defender.
> Continuing to operate beyond that point risks overextension, counterattack, and
> defeat.

And the defensive half:

> The art of the defense is to **hasten the culmination of the attack, recognize its
> advent, and be prepared to go over to the offense when it arrives.**

That second sentence is the user's *존버 → 반격* plan restated in doctrine. It is a
strong 표시어 candidate for the deferred session, and it supplies a *reason* the
counterweight is realistic rather than a balance patch: an offensive that outruns its
own strength is how real campaigns fail.

### The 3:1 rule — a calibration check on § 3's ×4.8

The doctrinal rule of thumb is that an attacker needs roughly **3:1 at the point of
attack**. This project's defence-only ceiling is ×4.8, which is the same family but
**steeper**. Whether ×4.8 is too steep is a real playtest question, and § 3's freeze
caution is the reason to ask it.

### Excluded by the frame — recorded so it is not re-proposed

- **Empire sprawl / administrative capacity** (Stellaris): a realm accrues a sprawl
  value against an administrative capacity, and exceeding it imposes escalating
  penalties on research, production and leader costs. This is the 4X genre's standard
  answer to breadth. **It is a growth tax, which § 2 excludes.**
- **Escalating per-unit costs** (Civ-family city-count scaling, empire upkeep in
  gold): same family, same objection. Commentary favours escalating cost over hard
  caps as the more organic fix — but organic or not, it taxes growth.
- **Alternative victory paths** as a snowball counter: a standard genre answer
  (keep the game close by giving the trailing player a different way to win).
  **Closed to this project by ADR 0042**, which made capital fall the sole win
  condition. This whole branch of precedent is unavailable, and that is worth
  knowing before someone reaches for it.

Sources:
[culminating point (SAMS monograph)](https://cgsc.contentdm.oclc.org/digital/api/collection/p4013coll3/id/1550/download) ·
[defender's advantage in wargame design](http://www.buildingabetterwargame.com/2013/05/asymetrical-scenarios-and-defenders.html) ·
[the snowball and the steamroller (4X design)](http://www.big-game-theory.com/2015/02/the-snowball-and-steamroller.html) ·
[Stellaris empire sprawl](https://gametaco.net/stellaris-empire-sprawl/) ·
[Paradox forum — sprawl and overextension](https://forum.paradoxplaza.com/forum/threads/empire-sprawl-and-overextension-how-it-could-be-changed-to-make-tall-vs-wide-viable.1471429/)

## 6. The gap — where there is nothing to copy

**Direction (c) has essentially no transplantable precedent.** The genre solves
breadth by **taxing** it, and § 2 excludes taxes. The user's framing — make breadth
*risky and attention-hungry* rather than *expensive* — is genuinely unusual.

The nearest honest precedent family is **real-time attention economies**: RTS
multitasking, and vassal/court management in the Crusader Kings family, where
breadth costs the player's own bandwidth rather than a resource. Neither transplants
to a simultaneous-commit turn game with one blind allocation per turn — the whole
point of that turn structure is that the player is *not* racing their own attention.

So (c) is a **design problem, not a lookup.** The survey's honest conclusion is that
the deferred session has real work, and that this is not a shortfall of the survey.

## 7. What this document is not

- **No device is adopted.** Nothing here is a seal, a ruling, or a dial.
- **§ 5 has no authority.** External practice is evidence about other games, and
  three of its items are recorded as *excluded* approaches.
- **§ 3 is not a claim that the problem is solved.** It is an inventory of what
  already exists, so the deferred session does not build what it already has.
- **Do not cite this file as a definition.** Definitions live at birthplaces
  (Vocabulary Law). Where this file names a mechanism, the pointer beside it is
  authoritative and this text is a summary.
- **The deferred session owns the decisions**, per the user's ruling in § 2 and the
  `docs/SYNC-DEBT.md` row that tracks it.
