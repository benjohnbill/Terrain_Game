# Research — Information Acquisition Mechanisms (intelligence channels for the fog design)

**Date:** 2026-07-14 · **Status:** evidence survey — INPUTS to a seal, never
normative on their own (documentation law, Research layer). All verdicts are
advisory; the user decides.

**Consumer:** war-model-build slice 2 design grill (agenda 1, opportunism
read) — the read's inputs (enemy field-army position, garrison state, fatigue)
are all fog-gated quantities, so the acquisition-channel design bounds what
the read may legally know. Companion survey:
`docs/features/war-model-build/research/fatigue-factors.md`.

---

## 0. Sealed constraints this survey respects (repo, not re-litigated)

- **Terrain class + fortification grade are public** at every confidence
  level — structures are visible from outside; the hidden quantity is how
  many defenders man them (fog RULINGS ①, guardrail G12).
- **Enemy substance = deterministic, true-containing estimate band** that
  scouting narrows and never collapses (fog INDEX ambiguity model; GLOSSARY
  "Estimate band"; residual ceiling + decay keep ownership superior).
- **P3 snapshot information (노화 헌법, match-arc RULINGS):** contact reveals
  the immutable layer (terrain, fort existence, roads) forever; the mutable
  layer (garrison counts, fort tier, **army position**) is snapshotted at
  contact then decays — the band narrows at contact and re-widens over
  turns.
- **Bot sees exactly what a player sees** (tactical-plan-ai RULING ③);
  contact-gating is the AI information model (fog INDEX).
- **Reconnaissance (정찰) plan grammar:** one front sector per pick,
  `confidenceGain` core, commitment slider = narrower band; attack plans
  reveal as a byproduct (`confidenceGain` secondary); an attack also reveals
  the front and the assaulting force to the defender (FG-⑦).
- **Current implementation dials** (`js/intel.js`, harness 가안): scout gain
  +0.25 confidence, decay −0.05/turn unobserved, band half-width 35% of true
  value at full uncertainty, absolute floor so the band never collapses.

## 1. Historical acquisition channels

### 1.1 Resident agent networks — Sunzi 용간 (Use of Spies, ch. 13)

The canonical Warring States taxonomy distinguishes five agent classes:
**local** (inhabitants of a district), **inward** (enemy officials),
**converted** (the enemy's own spies turned), **doomed** (fed false
information so their capture misleads the enemy), and **surviving** (those
who return with news from the enemy camp)
([Sunzi ch. 13](https://suntzusaid.com/book/13),
[marxists.org text](https://www.marxists.org/reference/archive/sun-tzu/works/art-of-war/ch13.htm)).
Two structural lessons: foreknowledge is a **standing network**, not a
one-off action, and the taxonomy has a built-in **deception channel** (the
doomed spy) — historically, espionage and disinformation are one system.

- Reveals: intent, internal politics, garrison/mobilization state (deep).
- Latency: high (courier return); Cost: standing upkeep; Failure: capture,
  and *being fed* (converted/doomed dynamics).

### 1.2 Sengoku covert practice

Daimyō ran intelligence networks (Iga/Kōka shinobi among others) whose
agents traveled as **merchants, itinerant monks, craftsmen, entertainers** —
covers that legitimized presence in hostile domains — to assess topography,
supply lines, and castle layouts; role vocabulary distinguished spy
(kanchō) from scout (teisatsu)
([Brewminate survey](https://brewminate.com/shinobi-warfare-ninjutsu-espionage-sengoku-japan/),
[Wikipedia: Ninja](https://en.wikipedia.org/wiki/Ninja)).
Same shape as 1.1: standing HUMINT + covers, distinct from battlefield
scouting.

### 1.3 Alarm networks — Joseon 봉수 (beacon lines)

Five main beacon lines converged on Seoul; each station carried five
beacons, and the count lit encoded a **five-step threat ladder** (1 평안 /
2 적 출현 / 3 적 접근 / 4 국경 침입 / 5 교전 중). Border-to-capital
transmission completed within roughly a day
([천림산 봉수지, HeritageWiki](http://dh.aks.ac.kr/~heritage/wiki/index.php/%EC%B2%9C%EB%A6%BC%EC%82%B0_%EB%B4%89%EC%88%98%EC%A7%80),
[봉화, 나무위키](https://namu.wiki/w/%EB%B4%89%ED%99%94)).
Design-relevant: an alarm channel is **fast, automatic, and cheap but has a
bandwidth of ~2–3 bits** — it reports existence/approach at a border, never
size or condition. The five-step ladder is itself a legible-band precedent.

### 1.4 Contact-zone scouting — cavalry screens

Napoleonic light cavalry (hussars, chasseurs) performed the dual function:
**see and deny** — reconnaissance and skirmishing ahead of the army while
*screening the army's own size and movements* from enemy eyes
([French Imperial Army, Wikipedia](https://en.wikipedia.org/wiki/French_Imperial_Army_(1804%E2%80%931815))).
Mongol doctrine ran scouts **up to ~110 km ahead and to the flanks** of
dispersed columns, riders covering up to ~100 miles/day, wired into the
**yam relay** (stations every 20–30 miles with fresh horses) so contact
reports reached commanders fast; strategic agents were implanted **years
before** a campaign (Europe: ~10 years before the Poland/Hungary invasion)
([Valor Archive](https://valorarchive.com/mongol-use-of-spies-and-scouts/),
[Warriors & Legends: yam](https://www.warriorsandlegends.com/mongol-warriors/mongol-war-communications/),
[World History Encyclopedia](https://www.worldhistory.org/Mongol_Warfare/)).

- Reveals: position/size/speed **of armies in the contact zone**, at high
  freshness; condition is observable at this range (straggling columns and
  camp state are visible — cf. the forced-march straggling evidence in
  `fatigue-factors.md`).
- Latency: hours–days; Cost: a screening force; Failure: the enemy's
  counter-screen (screens fight screens precisely to deny this channel).

### 1.5 Channel taxonomy (synthesis of 1.1–1.4)

| Channel family | Reveals | Freshness | Bandwidth | Historical twin risk |
|---|---|---|---|---|
| Alarm line (봉수, border watch) | existence + approach at a border | fastest | ~3 bits (threat ladder) | false/missed signal |
| Contact scouting (screens, 척후) | position, size, speed, visible condition — contact zone only | fresh | medium | counter-screening, ambush |
| Resident network (용간, shinobi) | interior state: garrisons, mobilization, intent | slow (courier) | deep | deception, capture |
| Combat itself | ground truth of the engaged force | instant | full, local | paid in blood |

## 2. Game precedents

- **StarCraft — last-seen snapshot.** Explored-then-abandoned areas show
  terrain and buildings **in their last known state** under grey fog;
  structures cannot be selected/inspected through fog, and changes under fog
  are invisible until re-scouted
  ([Liquipedia: Fog of War](https://liquipedia.net/starcraft2/Fog_of_War),
  [StarCraft wiki](https://starcraft.fandom.com/wiki/Fog_of_war)). This is
  the visual archetype of P3's snapshot-then-decay — but binary (fresh vs
  stale) with no confidence gradient.
- **EU4 — two-layer fog.** *Terra incognita* (undiscovered map) is a
  separate state from fog of war (no army visibility without adjacency,
  land, or units present); once discovered, geography is permanent
  knowledge and only the mutable layer (armies) is fogged
  ([Paradox forum discussion](https://forum.paradoxplaza.com/forum/threads/map-fog-of-war-undiscovered-areas-in-eu5-vs-eu4.1858018/),
  [EU4 wiki: Espionage](https://eu4.paradoxwikis.com/Espionage)). Notably,
  community design commentary argues most state information should NOT be
  automatically public and estimates should **trend toward accuracy with
  spy-network investment**
  ([forum proposal](https://forum.paradoxplaza.com/forum/threads/a-simple-way-to-turn-espionage-into-an-important-part-of-the-game-dont-make-every-piece-of-information-automatically-public.1565969/)) —
  i.e., the band-narrowing model this repo already sealed.
- **HOI4 — intel ladder with thresholds.** Intelligence (0–100%) accrues
  from spy networks, captured agents, radar, decryption, scout planes, and
  **combat itself**; thresholds gate what is revealed (rough division
  counts at lower levels, exact techs at ~70%)
  ([HOI4 wiki: Intel](https://hoi4.paradoxwikis.com/Intel),
  [Intelligence agency](https://hoi4.paradoxwikis.com/Intelligence_agency)).
  Precedent for: multiple channels feeding ONE confidence scalar, and
  threshold-gated legibility (≈ our confidence tiers).
- **CK3 — no terra incognita** (all geography known from start; only
  situational info gated) — the opposite pole from StarCraft, closest to
  the "maps existed, states knew their neighbors' geography" historical
  reading ([Paradox forum thread](https://forum.paradoxplaza.com/forum/threads/why-is-there-no-terra-incognita-in-ck3-like-in-eu4.1927426/)).

## 3. Synthesis for this design

### (a) Staleness = band re-widening — already sealed, precedent-confirmed

The unification hypothesis (last-seen snapshot ≡ a band narrowed at contact
that re-widens over turns) is **already canon**: P3 says exactly this, and
`js/intel.js` implements the scalar (gain/decay/width). StarCraft is the
binary ancestor; EU4 spy-estimate trending and HOI4 thresholds are the
graded analogs. No new law needed — slice 2 *consumes* P3.

### (b) Tracking the enemy field army ("where is their army NOW")

Historically this is the **contact-scouting channel**, not the resident
network: screens found and shadowed armies; beacons announced border
crossings; spies reported mobilization, not daily position. Games agree:
EU4 shows armies only where you have presence; HOI4 approximates front
strength, not unit positions. **Implication:** the field army's position is
a P3 *mutable-layer* attribute (P3 already lists "army position") —
last-seen position + elapsed turns × known speed = a deterministic **reach
cone** that widens each turn unobserved. The opportunism read's "pinned"
input then operates on the cone (worst/best case within it), keeping
ex-ante uncertainty on the information axis (D1) with zero new machinery
beyond the movement contract.

### (c) Enemy fatigue as a banded attribute

Condition is observable at scouting range (straggling, camp state — §1.4);
interior condition flows through the slow network. Consistent with the
slice-2 seal (fatigue joins the FG-⑦ band contract): the **same scout
channel** that narrows the substance band narrows the fatigue band; no
separate acquisition mechanism is warranted by the evidence.

### Candidate channel table (advisory — user decides)

| 채널 | 무엇을 밝히나 | 신선도·감쇠 | 비용/액션 | 봉인 캐논 충돌 | 권고 |
|---|---|---|---|---|---|
| Border watch / alarm (국경 감시·봉수) | enemy army **enters my border zone**: existence + heading (threat-ladder bandwidth) | instant, no decay while adjacent | free (standing) | none — formalizes contact-gating & "attack reveals attacker" | **채택** (cheap legibility floor; prevents undetectable deep strikes) |
| Reconnaissance plan (정찰, sealed) | narrows substance band; **extend to fatigue band + army last-seen fix** | per P3 decay | the sealed plan (turn + commit) | none — extension of sealed grammar | **채택** (extension, not new law) |
| Last-seen + reach cone (P3 응용) | field-army position as snapshot; cone = last-seen + turns × speed | re-widens each turn | free (derived) | none — P3 already names army position | **채택** (the pinning read's legal input) |
| Resident spy network (상주 간첩망, 용간/EU4형) | interior: mobilization, intent, capital state | slow, deep | new standing subsystem | none, but large new surface | **보류** (Phase 2; MVP는 정찰 확장으로 충분) |
| Deception / doomed-spy (기만) | adversarial: false signals into enemy channels | — | whole adversarial layer | strains "true-containing band" seal | **기각** for slice 2 (revisit only with a dedicated seal amending the band contract) |
| Combat as intel (전투 접촉) | engaged force ground truth | instant | paid in blood | already sealed (FG-⑦) | 이미 캐논 — no action |

### Open fork surfaced for the user (not resolved here)

**Does the immutable layer start revealed?** The fog feature's 2026-07-01
MVP idea is StarCraft-style map *discovery* (reveal terrain yourself); the
user's 2026-07-14 grill statement ("지도 자체를 아예 모르고 싸우지는
않았다" — sector/gate numbers belong on the map) and the CK3/EU4-discovered
precedent point instead to **geography as common knowledge from turn 0**,
with only the mutable layer fogged. The authored fixed world
(terrain-cradle) strengthens the latter reading (a fixed map is memorized
across playthroughs anyway). This would amend the fog INDEX "Idea" section
(map reveal + random-spawn replayability) — a user decision with a
supersession stamp, flagged for the grill.
