# Handoff — War-Model Build Slice 2: Grill → Spec → Plan (2026-07-13 → 다음 세션)

## 지금 위치 (한 줄)

**슬라이스 1(결전 계산기)은 SEALED** (WM-①, L2, main 병합·측정 완료).
다음 세션 = **슬라이스 2 설계 세션**: grilling부터 planning까지 — 스펙과
플랜을 작성하고 멈춘다. **구현은 그 다음 별도 세션** (오라버니 계획).

## 다음 세션의 산출물 (여기까지만, 구현 금지)

1. grill로 슬라이스 2 설계 봉인 →
   `docs/superpowers/specs/2026-07-13+-slice2-*.md` (spec)
2. `superpowers:writing-plans`로 TDD 플랜 →
   `docs/superpowers/plans/` (슬라이스 1 플랜이 포맷 선례)
3. 새 핸드오프 작성 (구현 세션용)

## 읽을 것 (순서)

1. **WM-①** — `docs/features/war-model-build/RULINGS.md` (슬라이스 1 seal:
   측정 판독·기각된 rider·이월 항목 전부 여기)
2. **INDEX** — `docs/features/war-model-build/INDEX.md` (슬라이스 사다리 +
   **슬라이스 2 grill 의제가 이미 등록돼 있음** — 거리 마모/패리티 표면 항목)
3. **REQUIREMENTS** — 같은 폴더, C1(opportunism read, UNDESIGNED)·C2(백지평화
   봇 정책) 행
4. match-arc `GLOSSARY.md` — Opportunism read(기회주의 읽기, ❓PROPOSED) 행 +
   방금 봉인된 방패 깨기/결전/야전군 행
5. `docs/features/operation-plan-catalog/CATALOG.md` §Defense (거점/지연/
   포기+청야 — 방어선택 배선의 재료)
6. force-geography `RULINGS.md` FG-⑥(예비대 목적지 argmax)·⑦(공격자 정보 =
   추정밴드)·⑩(예비대 2층)
7. (거리 마모용) terrain-cradle feature + `mockup/` 지도 목업 — 지도 기하가
   이미 있음

## Grill 의제 (INDEX에 등록된 것 + 대화에서 나온 것)

1. **Opportunism read (C1, SPEC_GAP ① — load-bearing 미설계)**: 봇이 "상대
   야전군이 딴 전선에 묶임"을 어떻게 읽고 커밋하나. 슬라이스 1이 만든 판:
   `fieldArmy.reaches` 입력을 봇이 스스로 도출해야 함 (지금은 battery가 각본).
2. **방어선택 배선**: WM-① 봉인 독해 — 결전 개활지는 *모드*; 요새 재전·공수
   역전은 같은 계산기의 다음 턴 호출. 어느 방어 플랜(거점/지연/포기)이 어느
   호출로 이어지는지의 문법.
3. **거리 비례 마모 + 패리티 표면 (오라버니 제기)**: 양측 hex-거리 비례 전투력
   감쇠 — flat ×0.75를 대체/포섭. 논점: (a) ADR 0015(도하 과세)의 육상 일반화,
   (b) 보급 시스템과의 이중과세 점검(M7 원칙), (c) **마모 곡선의 모양이 동질량
   결전의 문법을 결정** — 착지 룰은 공격 승(유효 ~×1.9), 대칭 마모+방어커밋은
   수비 결정론 승(피의 격퇴 13~19%, 절벽 미달). 수치는 INDEX/WM-① 참조.
4. **C2 스코프 질문**: stall→백지평화 봇 정책 재설계를 슬라이스 2에 넣나
   (opportunism과 같은 봇 정책층) — grill에서 결정.

## 대화에서 나온 미기록 맥락 (문서 밖 — 이 핸드오프의 값)

- **오라버니 세션 분할 계획**: grill→planning 세션(다음) / 구현 세션(그 뒤).
  다음 세션에서 코드 작성 시작하지 말 것.
- **측정 방법론 교훈** (이번 세션의 핵심 동학): 곱연산 공식(커밋×지형×요새)은
  단층 측정이 비대칭을 과장한다 — 오라버니가 두 번 연속으로 측정 편향(저병력
  그리드, 빠진 예비대 층)을 잡아냈고 그게 판독을 뒤집었다. 슬라이스 2 측정
  설계 때 처음부터 층 복원 knob를 넣을 것 (선례:
  `mockup/decisive-battle/probe-defense-layers.js` — parity drift-guard
  테스트 패턴 포함, 재사용 가능).
- **경계 확정**: M9 fill·방어 커밋 배선 = 슬라이스 4(per-sector 방어) 몫.
  승자측 결전 사상자 필드 + 단위 통일(절대치 vs 분수) = 슬라이스 3(정착) 몫.
  슬라이스 2가 이걸 끌어오지 말 것.
- **rider ii는 죽었다**: ×0.75→1.0 revert 단독은 무력(96.7%)이 실측. 거리
  마모 설계가 이 다이얼을 포섭하는 게 기대 경로 (WM-①에 기록).

## 이월 debt (이 세션 것 아님, 인지만)

- crisis seal-sync 이연, `eliminate()` register non-conservation, L2
  fidelity-boundary NON-war 절반 — 전부 SYNC-DEBT에 등록돼 있음.
- **origin push 안 됨**: 로컬 main이 origin보다 ~188커밋 앞. push는
  오라버니 결정 대기.
- audit-lint의 Operation numeric-restatement 1건은 알려진 false positive
  (88ade68에서 triage — DOMAIN_MAP arc-ladder는 질적 요약).

## Suggested skills

- **grilling** — grill 단계 (오라버니가 grill 트리거를 쓰면; 스타일은 memory
  `terrain-game-grill-communication-style` 참조: 흐름 지도 먼저, 게임 디자이너
  언어).
- **superpowers:brainstorming** — grill 전 설계 탐색이 필요하면.
- **superpowers:writing-plans** — 스펙 봉인 후 플랜 작성.
- 세션 종료 시 **doc-audit** + **final-check** (봉인 있으면 QUICKREF 재생성
  포함 — 이번 세션이 선례).

## 환경 주의 (이월)

- `rg`가 이 환경에서 0매칭 오보 → **`grep` 사용**. smart_*/tree-sitter 없음.
- 테스트: `node --test tests/*.test.js` (현재 308/308 green).
- battle.js는 `require('../js/battle.js')`로 직접 로드 (isomorphic,
  loadScripts 불필요).
