# Handoff — L2 잔차 분석 방향 + 차기 grill 설계, 2026-07-08

## 시작 문장 (오라버니용)

"L2 분석 세션 시작하자." 이 세션의 목표 두 가지: ① 전술 AI로도 안 풀린
**잔차 프리즈(~87% timeout, shortfall ~5300)를 L2에서 어떻게 해부할지**
분석 설계를 세우고, ② 그 해부 결과를 근거로 **다음 grill(유력하게는
hegemony ADR 본체)**의 의제를 짠다. 직전 세션이 "봇이 못 싸워서"
가설을 반증했으므로, 이제 질문은 "그럼 정확히 무엇이 승부를 막는가"다.

## 직전 세션 결론 (전술 plan AI — 완료, 중복 서술 금지: 포인터만)

- **판정: 프리즈 흡수 +0.8pp (12.6→13.4% decided). 구조적 동결은 봇
  아티팩트가 아님. hegemony ADR이 진짜 크기.** 수동 수비 대비 상한이므로
  이 결론은 비대칭 판정(Ruling ⑥ rider 2)으로 확정.
- 전투 층위 결정성은 열림: vassalDeals +17%, elim −33% — 항복수확이
  grinding을 대체. 그러나 hegemony trip으로 연쇄 안 됨.
- 근거·봉인·구현 전부 커밋됨: `7508b3a`(구현) + `162c158`(문서).
  - 봉인 6: `docs/features/tactical-plan-ai/RULINGS.md`
  - 측정 기반 시트: `docs/features/tactical-plan-ai/BATTERY.md` (인용 규칙 포함)
  - 풀 결과: `docs/features/tactical-plan-ai/research/battery-run-2026-07-08.md`
  - 원 세션(지형충실도) 반환: `.context/handoff-2026-07-08-tactical-plan-ai-results.md`

## ① L2 잔차 해부 — 분석 후보 (이 세션에서 설계·실행)

병목은 "leadership projection 축적"으로 진단됐지만 그 내부는 아직
블랙박스다. 해부 각도 후보 (전부 기존 계기로 가능, 새 봉인 불요):

1. **shortfall 분해**: `finish()`의 finalCheck가 이미 leadership
   shortfall / coalition overhang을 매치마다 기록. 5300이 무엇의
   합인가 — 후보의 projection이 안 크는 건지(성장 정체), 라이벌
   need가 같이 크는 건지(상대 성장), coalition 항이 막는 건지.
   timeout 매치의 finalCheck 분포를 축별로 갈라 볼 것.
   (`mockup/combat-calc/tournament.js` finish(), `match.js` hegemonyCheck)
2. **decided 세계의 부검**: 13.4%는 *왜* 결판났나 — trip-solo vs
   trip-chain 경로, 승자의 projection 궤적, 결판 매치와 timeout 매치의
   초기 조건 차이(seating? 아키타입 조합? 초반 전쟁 타이밍?).
   binding별 decided%가 3~25%로 갈렸던 것(이 세션 실측)도 단서 —
   지리(자리배치)가 승부 가능성의 큰 변수.
3. **정산이 판을 닫는가**: 전쟁이 accepts 모델로 일찍 닫혀서 점령이
   얕게 끝나는지(claim 깊이 vs goalOccupied), 속국화가 projection에
   기여하는 경로(vassalPremium 0.25)가 실제로 작동하는지.
4. **pool 고갈 비대칭** (기존 관찰 obs 9174): timeout 세계와 decided
   세계의 인력 풀 소모 차이 — 소모전이 판을 늙게만 하고 못 닫는 구조.
5. **강제 grinding 36%의 지도**: planStats.forced가 어느 전선(요새/물)
   에 몰리는지 — Crossing이 0회인 것(opposed-water R < 1.5)과 함께
   "지리가 만드는 못 여는 문"의 목록화. hegemony ADR이 아니라 지형
   레버(force-geography startFortByClass, dormant opt-in)로 풀리는
   몫이 얼마인지 가늠.

권장 순서: 1→2가 본류(승리조건의 해부), 3~5는 본류에서 갈라지는 보조
가설. 분석은 조사근거 구조이므로 자율 마감 OK(위임 선례) — 단 새
다이얼/모델 제안이 나오면 그건 grill 안건으로 넘긴다.

## ② 차기 grill 의제 후보 (해부 결과가 정할 것)

- **본명: hegemony ADR 본체** — 승리조건/leadership 축적 구조의 재설계.
  해부 1·2가 "무엇을 고쳐야 하는지"를 좁혀준 뒤에 여는 것이 순서.
  주의: 승리조건은 SPEC 레벨 함의가 있음 — SPEC 변경은 유저 승인 제안
  절차 필수(documentation law).
- 보조 후보: 수비 판단 pass(지연전 사다리·예비대 트리거 — 별도 grill로
  파킹됨), commit 최적화(item ④), match-tilting 스레드의 회복 다이얼
  잔여(handoff-2026-07-07-match-tilting-pass.md — 형제 스레드, 혼동 금지).

## 방법론 메모

- 분석 스크립트는 `mockup/combat-calc/plan-battery.js` 패턴(aggregate
  순수 함수 + 테스트)을 따를 것. 기존 141 테스트 green 유지.
- 시뮬 실행은 토큰 거의 무소모(node + 집계만 읽기). 12,600매치 ≈ 8초.
- record에 이미 있는 것: finalCheck, endingShape, settlements,
  planStats, finalRealms. 새 계기가 필요하면 TDD로.
- D팔 짝지은 설계(combo 간 동일 seed) 같은 분산 축소 트릭 재사용 가치.

## Suggested skills

- `grilling` — ②로 넘어갈 때 (유저가 grill 선언 후). ① 분석 단계에선 불요.
- `superpowers:test-driven-development` — 새 계기/집계 함수 추가 시.
- `claude-mem:mem-search` — 과거 관찰 참조 시 (hegemony check 깨짐
  이력 obs 8380, pool 비대칭 obs 9174 등).

## 파킹 (건드리지 말 것)

- 수비 판단 pass, commit 손잡이(item ④), SI rung 재조정, Crossing 질감
  — 전부 tactical-plan-ai INDEX의 open questions에 등록됨.
- 지형충실도 세션의 잔여 항목들(원 handoff의 파킹 절 참조).
- `.context/handoff-2026-07-08-tactical-plan-ai-results.md`는 원 세션
  (지형충실도) 소비용 — 이 세션이 대신 소비하지 말 것.
