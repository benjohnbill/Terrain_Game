# Handoff — War-Model Build Slice 2: Plan → Implementation (2026-07-14 → 다음 세션)

## 지금 위치 (한 줄)

**슬라이스 2(작전술층) 설계는 SEALED** (WM-②, 스펙 + doc-sync 커밋
`4e1d034` + `484496e`, 308/308 green). 다음 세션 = **TDD 플랜 저작 →
구현 → 측정**. 설계 재론 없음 — 스펙이 진실이다.

## 다음 세션의 산출물 (순서대로)

1. ~~TDD 플랜~~ → **완료 (2026-07-14, /to-tickets):** 플랜은 트레이서-불릿
   티켓 10장으로 발행됨 — `.scratch/war-model-slice2/issues/01~10-*.md`
   (차단 간선 명시, 의존 순서 번호). 프런티어: 01 → {02,03} →
   {04,05,06,07} → 08 → 09 → 10.
2. 구현 — **`/implement`로 프런티어를 한 장씩**, 티켓 사이 컨텍스트 클리어
   (SDD·whole-branch review는 슬라이스 1 방법론 선례 유지) + main 병합.
3. 측정 pass — 티켓 07(그리드 지표 1~4) + 티켓 10(김빠짐 재판독 지표 5)이
   측정을 내장; 판독은 유저와 공동 분석.

## 읽을 것 (순서)

1. **스펙** — `docs/superpowers/specs/2026-07-14-slice2-operational-layer-design.md`
   (마스터 문서 — 이번 세션의 모든 봉인이 여기 §0~§13에 있음)
2. **WM-②** — `docs/features/war-model-build/RULINGS.md` (판결·기각 대안·
   grill catch 기록)
3. **ADR 0038** — 전쟁 종결 복합 (승리 조건 변경의 의무 기록)
4. **war-model-build GLOSSARY.md** — 신규 Tier-1 어휘 9행
5. `js/battle.js` + `js/intel.js` — 건드리지 않는 봉인 계약(battle)과
   재사용할 P3 스칼라(intel)
6. terrain-cradle `mockup/combat-calc/map-gen.js` — 이동 계약의 기하 원천

## 스펙 요지 (설계 재론 방지용 — 정의는 전부 스펙이 authoritative)

- **피로**: 게이지 1 + 원장 2. 행군·전투 원장 → 볼록 곡선 → 전투력 배수,
  바닥 ×0.5가 곡선의 종점. 보급 원장 → 기아 상태 → **실체만** 연속·볼록
  감소 (능력 반전 없음 — 세션 막판 late ruling, 스펙 §2 반영 완료).
- **이동**: 헥스 위치, 목적지 명령, 자동 경로, 강행군 = 피로 지불 토글.
- **야전군**: 자유 분할·합류 (지침 총량 보존), 각개격파는 산술이 처벌.
- **커밋**: 턴당 재생성 비축불가 국가 예산 — 교전 레버는 그 몫 (FG-⑧ 해금).
- **정보**: 지리 공개 / 실체·피로·위치 = P3 노화 밴드 / 태세·커밋 = 깜깜이
  시장. 채널: 봉수 경보·정찰 확장·도달 원뿔 채택.
- **읽기(C1)**: 매 턴 전선별 창 산술, 묶임 = 원뿔∩응답창 공집합.
- **방어 배선**: 거점/지연 = 계산기 범주 입력, 포기/청야 = 판 동사.
  상비 태세 + 정보 후 반응 커밋.
- **봇 종전(C2)**: 교착 타이머 은퇴 → 창 기반 정착 수용. 봇 = 제약 내 최적.

## 경계 (끌어오지 말 것)

- 승자측 사상 계약 필드 = 슬라이스 3 · 방패층 커밋·M9 실지도 배선 =
  슬라이스 4 · 이동/게이지 UI = UI축 · 기술 시스템·간첩망·기만 = Phase 2.
- **커밋 곡선 재깎기 금지** (별도 세션 등록) — 배터리 sweep은 서술용만.
- 카탈로그 고도 재분류 = 전용 grill pass (SYNC-DEBT 등록됨).
- 다이얼 9종 값은 눈금 pass 몫 (스펙 §2 다이얼 시트가 과녁판) — 구현은
  가안 상수로.

## 이월 debt (인지만)

- origin push 안 됨: 로컬 main이 origin보다 ~190커밋 앞 (유저 결정 대기).
- crisis seal-sync 이연 등 기존 SYNC-DEBT 행 유지.
- HCLM·세 고도 SPEC/DESIGN 승격 제안 = 유저 결정 대기 (SYNC-DEBT).
- audit-lint의 Operation numeric-restatement 1건 = 알려진 false positive
  (88ade68 triage).

## 환경 주의 (이월)

- `rg` 0매칭 오보 → **`grep` 사용**. smart_*/tree-sitter 없음.
- 테스트: `node --test tests/*.test.js` (현재 308/308 green).
- battle.js는 `require('../js/battle.js')` 직접 로드 (isomorphic).
- browser-verify 시 hard-reload (persistent profile이 js/* 캐시).
