# Handoff — Force-Geography Pass (next spine), 2026-07-08

## 시작 문장 (오라버니용)

"force-geography pass 시작하자." 핵심 방향 (오라버니 확정 2026-07-08):
**우리 지형 정보에 맞는 방어 강도 및 전략 수립을 근거로 L2가 측정되도록**
한다. 지금 L2는 모든 전선에 균일 `walls`를 깔아 방어 우위를 인위 생성
중 — 이걸 지형-결합 방어로 바꾸는 게 첫 작업.

## 직전 세션에서 끝난 것 (economy phase CLOSED, 커밋 4914f59)

match-tilting pass의 recovery-dial + blinds phase를 L2 wire-first로
검증 → **전제가 뒤집힘.** 봉인·기록 완료 (RULINGS MT-⑤, ADR 0027):

- **동결은 경제 노화가 아니라 다극 교착.** L2 autopsy: 동결 매치의
  99%가 리더십 게이트 실패(중앙값 48% 투사 미달), 1%만 연합-bound.
  결판=판 붕괴(생존 3.8 vs 4.5, 속국화 0.97 vs 0.34).
- **어떤 경제 레버도 안 통함**: 회복-게이트 +3pp, 재생률 0 +1pp,
  cap-growth 0, 동원 과세 −4pp(역효과), 봇 공격성 +5pp(그래도 85%
  동결). "블라인드=경제 노화" 가설 소진.
- **회복-게이트는 커밋-게이트로 봉인** (ADR 0027): main/surplus =
  커밋 크기 이름표, force-shaping 행위는 커밋-게이트 바닥0. +3pp 얇은
  보조로 유지.
- **L2 신뢰도 감사(독립 subagent) = FAITHFUL**: 시작좌표 42.1/58.7,
  명부:상한 3.00, 전투·패권 다이얼 전부 정확. 동결은 진짜 설계 문제.

## 동결의 두 겹 (감사가 분해) — 이게 다음 pass의 뼈대

startFort 스윕 (cradle, reps30 seed42): none 19.5% · fieldworks 17.6%
· walls 10.2% · fortress 9.5% decided.

1. **force-geography 겹 (~9pp) — 이번 pass의 spine**
   - 균일 walls가 동결을 2배로(19.5→10.2%). 맵은 56섹터 전부
     `fortTier: none`인데 어댑터가 `startFort: 'walls'`로 균일 덮어씀
     (`map-board.js` BOARD_GAAN — 봉인 아님).
   - 맵은 이미 hex 단위 지형 보유(`mapUnits[].terrainLayer`:
     plains/hills/mtn/pass; engine.DIALS.terrain에 배수 존재
     plains1.0/hills1.2/mtn1.5/pass2.0/legendary2.5, fort ladder
     none1.0/fieldworks1.3/walls1.8/fortress2.4/legendary3.0).
   - **할 일**: 방어 강도를 지형에 결합. (a) 시작 배치 — 균일 walls
     대신 지형 기반 시작 요새 배분(산악·요충 강, 평지 노출 약);
     (b) 진행 규칙 — fort build가 지형에 묶여 아무 데나 강요새 못 짓게.
     그러면 약한 전선=공격 창이 생겨 교착이 풀리는지 L2 재측정.

2. **hegemony-bar 겹 (~80% 구조 잔차) — 더 깊은 질문, 큰 ADR 후보**
   - fort=none에도 80% 동결. 5-seat 균형 지도에서 리더십 마진이
     애초에 도달 가능한가? 승리조건 / 공방 밸런스 재검토가 필요한가.
   - 봇을 공격적으로 만들어 가리는 건 사람-PvP 괴리만 키움(오라버니).
   - force-geography가 이걸 얼마나 흡수하는지 먼저 보고, 남으면 큰 ADR.

## Harness 상태 (mockup/combat-calc/, suite 111/111)

- **Option A wired**: `regenGarrisons`는 자동 펄스 아님 → `peacePrimary`
  행위(커밋-게이트, `BOT.regenThreshold` 0.8 preempt). export됨.
- **Option B wired but INERT**: `econ.intensityPrice`/`draftBill`(적분
  가격) + `r.treasury` + `realmIncome`; recruit/regen이 곡선가로 treasury
  지불. placeholder(SURGE base .005/knees .42,.58/warMult 2/fullMult 12,
  treasuryStartTurns 3). treasury가 매치당 불어 안 물림 — 유지, dial 원상.
- **startFort는 BOARD_GAAN gaan** — force-geography가 여기를 교체.
- 감사 지적 minor: usable recovery ungated(should be "not raided");
  legacy `makeBoard()` 여전히 ×1.5(cradle path 아님, sheet-12 함정).

## 남은 문서 빚 (SYNC-DEBT Open)

- **ADR 0014 header stamp** (P1 + MT-⑤ 둘 다 free/auto-regen 제거) —
  Tier-3 propose-only, 오라버니 승인 필요.
- **QUICKREF 전면 재생성** — force-geography pass doc-sync에 배치(중복
  regen 방지).
- force-geography 하네스+설계 = 위 §두 겹.

## 파킹 (건드리지 말 것, 트리거 시 깨움)

- 봇 정산 공격성 ≈5pp headroom — bot-policy 감사 슬라이스.
- 서지 곡선 숫자(무릎/배수/서지율) — magnitude 세션.
- 피폐 문턱, 유목 동원 프로파일 — Phase 2.
