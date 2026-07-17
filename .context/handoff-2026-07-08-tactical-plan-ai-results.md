# Handoff RETURN — Tactical Plan AI results → terrain-fidelity session

From: tactical-plan-ai session (2026-07-08, item ②). For: the origin
session's integrated freeze verdict (terrain fidelity + tactical AI).

## 한 줄 결론

**전술 AI는 프리즈를 흡수하지 못한다: +0.8pp (12.6% → 13.4% decided,
수동 수비 대비 상한). 잔차 = 사실상 프리즈 전체 (86.6% timeout,
leadership shortfall ~5300 부동). hegemony ADR이 진짜 크기다.**

## 무엇이 봉인·구현됐나

- 설계 6개 봉인 (user grill): `docs/features/tactical-plan-ai/RULINGS.md`
  ①결정성 사다리 ②판단 창+성향 다이얼 ③정보 모델=안개 스펙 §4–5 재사용
  (성벽 등급은 공개 — fog RULINGS ① 신설) ④accuracy 팔+랜덤 대조군 2종
  ⑤배터리 설계 ⑥수비 유예+정직성 라이더.
- 구현 (TDD, 141 tests green): `mockup/combat-calc/plan-ai.js` (순수:
  estimateBand=intel.js 충실 미러+fidelity 테스트, judgedValue, eligiblePlans,
  choosePlan — 판단 R은 engine.resolve dry-run 재사용, 산수 중복 0),
  warBattle 4단계 brain 분기 (S0 스크립트 경로 무변경), runMatch/
  runCradleTournament brain 전파 + planStats 텔레메트리.
- 배터리: `mockup/combat-calc/plan-battery.js`, 90,180매치 63초.

## 원 세션이 필요로 한 세 숫자

1. **전술 AI 재측정**: L1(conf 0.90) decided 13.4%, shortfall 5299,
   elim 719, vassalDeals 4546. S0 재현 12.6%/5262 (계기 일치 ✓).
2. **프리즈 흡수량**: +0.8pp (~2.7σ — 실재하나 미미). 정보 곡선 평평
   (0.90→blind 13.4→13.3), 성향 승률 효과 0.
3. **잔차 (hegemony ADR의 진짜 크기)**: 86.6% undecided, shortfall
   ~5300. Ruling ⑥ 비대칭 판정 — 잔차 큼 → 수비 깨워도 잔차는 커질
   뿐이므로 **hegemony ADR 필요 결론이 상한 측정만으로 확정**.

## 부수 발견 (통합 판정에 유용)

- 전투 층위에서 결정성 축은 열림: 항복수확이 grinding 섬멸을 대체
  (vassalDeals +17%, elim −33%). 그런데 hegemony trip으로 연쇄되지
  않음 — 승부의 병목은 싸움의 질이 아니라 leadership projection 축적
  (경제/스케일 구조).
- plan 다양성 단독(주사위 봇)은 오히려 해로움 (−1.3pp).
- 강제 grinding 36–37% (판단값으로 아무 plan도 문턱을 못 넘는 전투) —
  프리즈의 전술적 질감. Crossing은 0회 선택 (opposed-water R이 1.5를
  못 넘음 → hermit 전선은 DP grind).

## 전체 근거

`docs/features/tactical-plan-ai/research/battery-run-2026-07-08.md`
(해석 규칙: BATTERY.md 없이 인용 금지 — 상한 라벨 필수).
