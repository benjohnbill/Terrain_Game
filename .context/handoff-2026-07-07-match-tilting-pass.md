# Handoff — Match-Tilting Pass, mid-flight (2026-07-07 night)

## 오라버니용 요약 (빠른 참조)

오늘 세션에서 봉인된 사슬 (전부 커밋됨, 스테이징은 NOTES):

1. **동결 세계 발견** — L2 실지도 12,600매치: 매치 ~58% 영구 동결
   (억지 평형). pile-on 프로브로 "봇 무죄, 구조적" 판결. 블라인드
   부채 최초 정량화.
2. **노화 헌법 P1~P3** — 이중 청구(사람 충원 = 피+생산) · 흐름은
   늙지 않음 · 스냅샷 정보.
3. **징집 명부 재창설** — 명부 = 1,800 × 인구점 (땅-파생, 총원
   회계); capPerPop 600 = 유지분수 ⅓의 파생 상수. 2-트랙 연구
   (역사 + 게임 관례) 앵커.
4. **서지 모병 모형** — 동원 강도(복무÷명부)가 단가를 정하는 연속
   곡선(청구서=적분) + 이름 구간 4개(서사·M10 전용) + 커밋 서지.
5. **시작 좌표 3종** — f₀ 0.5(무장 평화) · g₀ 1.0(방패 만땅) ·
   ρ 0.75(보방 비율) → 시작 강도 42%, 구조 최대 58%.
6. **보방 세계의 심화 동결** — 새 체격으로 재측정: 결판율 7%.
   장치(회복 다이얼+블라인드)가 짊어질 과녁이 ~93%로 선명해짐.

**다음 세션 = ① 회복 다이얼 grill + ② 블라인드 설계.** 시작 문장:
"회복 다이얼 grill 이어가자" — 첫 질문은 **회복 감속 vs 블라인드
하중의 배분**이다 (두 장치는 상보적: 회복을 많이 늦출수록
블라인드는 가벼워도 된다).

장부: `docs/SYNC-DEBT.md` (오늘 봉인들의 birthplace sync 빚 — 큰
행 하나) · `docs/DISPLAY-DEBT.md` (동원 계기판 UX 3종) ·
`mockup/combat-calc/NOTES.md` 2026-07-07 항목 3개 (전 봉인의 verdict
source) · `docs/features/match-arc/research/` 연구 3편.

---

## For the next agent

Session context: the match-tilting pass (grill skill, mid-flight).
The user redirected session close before the recovery-dial grill
opened — that grill is THE next work unit. Read order: this file →
`mockup/combat-calc/NOTES.md` 2026-07-07 entries (three, in order:
sheet-15 / Surge Draft Model / start-state coordinates) → the
SYNC-DEBT match-tilting row → `docs/features/match-arc/research/`
(3 files).

### State of the machine (mockup/combat-calc/)

- `map-board.js` — cradle board factory. **BOARD_GAAN header comments
  carry the seal stamps** (registerPerPop 1800, startFieldFrac 0.5,
  garrisonPerBorderSector 900, capitalGarrison 1500). Board realms:
  pool = total-bodies register (1,800 × Σ pop), field = 0.5 × cap,
  garrisons full.
- `tournament.js` — (b) total-bodies accounting: `servingBodies()`,
  `civilians()`, `doRecruit` (draft = civilian→serving, capped by
  civilians, pool unchanged), `regenGarrisons` (P1: draws civilians),
  `poolBleed` (death only shrinks pool). `pickTarget(…, H)` carries
  the pileOn probe flag. `finalCheck` = timeout autopsy
  (leadershipShortfall / coalitionOverhang).
- battery sheets: 14b (CRADLE heavy checks) · 15 (cradle tournament,
  REPS 30, watch-flag + pair tables). `node battery.js cradle`.
- Tests 101/101 (`npm test`). Coordinate seal test in
  `tests/map-board.test.js` (asserts 42%/58%/ρ0.75).

### Freeze baselines (keep the timeline straight)

| world | decided | note |
|---|---|---|
| legacy start state (f₀0.7, ρ0.39) | 21–22% | sheet-15 headline run |
| + accounting fix (total-bodies) | 21% | no shift |
| + pile-on probe | 23–24% | bot blindness ≈ nil → freeze structural |
| + A-3 cap growth | 24–26% | cap growth alone insufficient |
| **sealed physique (f₀0.5, ρ0.75)** | **7%** | Vauban world — thicker shields raise war cost AND the leadership bar |

Interpretation sealed in NOTES: NOT grounds to unseal the physique —
converging this world is precisely the tilting devices' duty (~93%
at bot-grade; converging half lands mean T26, past the 15–25
envelope).

### The next grill's opening frame (was about to be asked)

Recovery-dial grill = re-opening SEALED M12 values with the freeze
evidence: garrison regen 10%/turn, usable recovery +10pp/turn,
recruit 10%/turn (now Band-1 base). The binding constraint is the
leadership bar vs a HEALED rival — so the lever family is "make
wounds persist": slower regen, war-scar variants (only war losses
heal slowly), or leave dials and let blinds carry everything. First
question drafted: **the allocation between recovery slowdown and
blinds weight** (complementary pair — user named this the central
uncertainty). Blinds design follows; candidate synergy: the surge
draft is already an escalation surface (deep-band prices rise as the
world bleeds — blinds may compose with it rather than duplicate it).

### Gotchas

- **Harness limits**: tournament harness has NO treasury — the
  intensity price curve is NOT wired into L2 yet (recruit is
  body-capped but not yield-priced there). Wiring it is part of the
  recovery-dial session's L2 verification.
- **Register semantics**: pool = living bodies TOTAL. Never subtract
  on draft. `civilians = pool − servingBodies`. Interior garrisons
  are OUTSIDE the serving ledger (abstracted cascade defenders,
  fixed 500) — a known accounting seam, fine at this fidelity.
- **Measure, don't recall, garrison compositions**: the agent
  misclaimed ρ twice this session by conflating garrison classes;
  the correction is on the record in NOTES. Compute from the board.
- Browser verify: hard-reload (ignoreCache) after editing js —
  profile caches modules.
- Curve numbers (knees/multipliers), surge exchange rate (+1%p/point
  가안), zone names — ALL deferred to the magnitude discussion;
  only the shape is sealed.
- 파킹된 것: 봇 정책 감사(L2 fine-tuning), 유목 동원 프로파일
  (Phase 2), 피폐 문턱(Phase 2), 외교 탭 씨앗(pile-on 공포 —
  NOTES에 파킹).
