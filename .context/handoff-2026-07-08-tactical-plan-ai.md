# Handoff — Tactical "Max-Benefit Accuracy" Plan AI (item ②), 2026-07-08

## 시작 문장 (오라버니용)

"전술 plan AI 세션 시작하자." 이 세션의 목표: L2 봇이 전투에서 **plan을
스크립트가 아니라 판단으로** 고르게 한다. 현재 봇은 7개 plan 중 Swift/DP
2개만, 고정 commit, 단계 스크립트로 싸운다 — 결정적 plan(Flanking 섬멸,
Encirclement 항복수확)을 절대 안 쓴다. 오라버니 방향: 정찰/안개 대신
**"(준)완전정보 하 최대 이득 plan을 고르는 봇"** — accuracy 손잡이로 정보
질을 조절.

## 왜 이게 지금 제1 순위인가 (직전 세션 발견)

프리즈 조사가 두 겹으로 분해됐고(요새 천장 20% / 구조적 80%), 구조적 80%가
"승리조건 문제"로 보였다. **그런데 전투 판단 감사에서 반전**: 봇이 절대 안
쓰는 결정적 plan들(Flanking=섬멸, Encirclement=항복수확→속국화)이 바로
프리즈 오토프시가 "빠졌다"고 지목한 **속국화·판붕괴 축**과 일치. 즉
"구조적 동결"이 **승리조건이 아니라 봇이 결정적으로 못 싸우는 아티팩트**일
수 있다. hegemony ADR(큰 작업) 전에 이걸 먼저 검증해야 한다 — 더 싸고 근거도
단단하다.

## 현재 상태 (직전 세션에서 확정)

- **전투 해결(engine.resolve)은 봉인 공식 그대로 충실** — R, lever, 사상자
  곡선, 붕괴 절벽, terrain/fort/water, matchup mod 전부. 산수는 손대지 말 것.
- **plan 선택 = 스텁**: `tournament.js warBattle`이 단계 스크립트
  (siege→field→cascade→capital). 유일한 "선택"은 siege의 요새문턱 분기
  (`fortNow ≤ BOT.stormAt[fort]` → Swift storm, else DP). field/cascade는
  무조건 Swift. commit 고정(`BOT.siegeCommit 8`, `fieldCommit 14`).
- **엔진에 먹이는 plan은 7중 2개**(resolve 호출 6군데 전부 Swift 또는 DP).
  Flanking / Encirclement / Crossing / Raid / SI / delaying / 예비대 /
  반도이격 / 고립 게이트 = 전부 dormant.
- **전략 AI는 있음(아키타입 스크립트)**: `pickTarget`(field/shield ≥
  attackRatio 1.7, opportunism, pile-on), 정산 수락만 봉인모델(`accepts`,
  `expectedContinuedLoss`, match.js).
- **item ① 지형 충실도는 이미 배선됨**(이 base 위에서 작업): siege가
  국경등급→terrain/water/choke를 읽음(`combatFromBorderClass`,
  `frontClass`/`frontDoor`). 요새는 fidelity 측정 위해 baseline(균일 walls)
  고정, force-geography-요새-by-class는 dormant opt-in(`startFortByClass`).
  프리즈 재측정 진짜 지도 기준 ~12.6% decided, leadShortfall ~4600 구조적.

## 이 세션이 봉인할 설계 (grill 먼저 — 숫자·모델은 유저 결정)

1. **Eligible-plan 판정**: 주어진 국면에서 어떤 plan이 가능한가?
   엔진 gate/threshold를 재사용 — Encirclement(고립 게이트 + threshold 2.2),
   Flanking(seam/측면 + 1.6), Crossing(water), Raid, SI, DP, Swift(항상).
   국면 상태(전선/예비/고립/water/erosion)에서 가능 plan 집합을 뽑는 규칙.
2. **"최대 이득" 지표**: 봇이 무엇을 최대화하나? 후보 —
   (a) margin(R−threshold), (b) 순 병력 교환, (c) 수도 도달 속도,
   (d) **기대 consolidation**(속국화/섬멸로 판을 줄이는 것 — 프리즈와 직결).
   추천 출발점: 결정적 plan을 성공 가능할 때 우선하는 지표(섬멸·항복이
   grinding Swift보다 판을 붕괴시키니까). 유저 grill.
3. **Accuracy 손잡이**: perfect(항상 진짜 최선) ↔ degraded(추정 오차/노이즈).
   오라버니 프레이밍 = 정찰 모델링 대신 정확도 파라미터. perfect부터 시작해
   상한(전술 AI가 프리즈를 얼마나 흡수하는가)을 먼저 재고, 그다음 열화.
4. **commit 최적화 여부**: 고정 8/14 대신 lever 곡선으로 commit도 payoff
   선택할지. 별도 손잡이.

**주의**: 이 4개는 봉인 대상(모델/숫자). 유저 grill 없이 배선 금지.
숫자는 유저 결정, 조사근거 구조는 자율 마감 OK(위임 선례).

## 방법론

- TDD (`superpowers:test-driven-development`) — plan 선택 로직은 순수 함수로
  뽑아 테스트 가능하게. `choosePlan(situation, accuracy) → plan` 형태 추천.
- 기존 116 테스트 green 유지. engine.resolve 산수 불변.
- 배선 후 **프리즈 재측정**(`runCradleTournament`, reps20, seed 42/7/99):
  전술 AI가 decided%/leadShortfall/elim/vassalDeals를 얼마나 움직이는지.
  이게 이 세션의 핵심 실험 — hegemony ADR의 진짜 크기가 여기서 드러난다.

## 파일

- `mockup/combat-calc/tournament.js` — `warBattle`(plan 선택 배선 지점,
  siege ~L200, field/cascade/capital), `BOT`(dials, stormAt, commit),
  `pickTarget`, `warEndState`.
- `mockup/combat-calc/engine.js` — `resolve`(plan threshold/gate: thresholds,
  wallAssaultCap, escaladeFamily, flank/encircle/delaying/reserve 파라미터).
- `docs/features/combat-formula/MATCHUP.md`(plan family 21셀 상성),
  `MAGNITUDE.md`(M7 threshold, M10 matchup 분수, M9 예비대) — 봉인 근거.
- `docs/features/operation-plan-catalog/` — plan 카탈로그 모양.

## 끝나면

이 세션 결과를 **tmp에 handoff로 써서 원 세션(지형충실도 세션)으로 반환** —
전술 AI 재측정 결과 + 프리즈 흡수량 + 남은 잔차(진짜 hegemony ADR 크기).
원 세션이 지형충실도+전술AI 둘 다 켠 최종 프리즈 판정을 통합한다.

## 파킹 (건드리지 말 것)

- 지형 충실도 잔여(item ①에서 처리됨): terrain 배선·해협버그·choke 완료.
  남은 것 = r4 steppe/highland flavor 불일치(전투 무영향), field-stage
  strait water(siege-only 결정), 관중 weakest-link 입도 한계 — 전부 별건.
- force-geography-요새-by-class(밸런스 레버, dormant opt-in) — 전술AI 다음.
- hegemony-bar 큰 ADR — 전술 AI 재측정 후 잔차 크기 보고 결정.
