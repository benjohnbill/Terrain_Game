# Handoff — Decisive-Battle Spine, Build Slice 1 (2026-07-13 → 다음 세션)

## 지금 위치 (한 줄)

War-model-build의 **첫 슬라이스 = 순수 결전 계산기**. 브레인스토밍 완료 →
spec 봉인 → plan 작성 완료. **구현 실행 직전, 오라버니 답 2개에서 멈춤.**

## 다음 세션 첫 할 일 (정확히 막힌 지점)

plan 실행이 오라버니 답 **두 개**에 막혀 있다. 세션 시작하면 이걸 물어라:

1. **plan-level 설계 결정 ①·⑤ 확인** (plan 헤더 "Plan-level design decisions"):
   - **① 결전은 개활지** — 방패 깨진 뒤 결전에서 야전군은 지형 배수
     안 받음 (명량·청야류 지형작용은 first-blow에서 끝, 결전은 야전).
   - **⑤ 궤주 binary cliff** — 야전군 궤주 시 총손실 도주 열림 65% / 막힘
     100%(섬멸), R 무관 (M4 "cliff not dial").
   - 나머지 ②③④(결전 headline=R2≥1 / shield garrison 자체 궤주 생략 /
     공격 레버 양쪽 적용)는 합리적 기본, 이견 없으면 그대로.
2. **실행 방식 선택** — subagent-driven(추천) vs inline.

→ 답 오면 **plan의 Task 1부터 실행**. 슬라이스는 TDD 5태스크(배수/레버 →
전력/피해곡선 → first-blow+격퇴/함락 → 결전+궤주/도주 → battery).

## 읽을 것 (순서)

1. **spec** — `docs/superpowers/specs/2026-07-13-decisive-battle-spine-design.md`
   (스코프·어휘·세 갈래·공식 포인터·측정·미결)
2. **plan** — `docs/superpowers/plans/2026-07-13-decisive-battle-spine.md`
   (5 TDD 태스크 + 실제 코드/테스트/기대값 + 설계 결정 5개 + self-review)
3. (배경) 지난 핸드오프 — `.context/handoff-war-model-build-2026-07-13.md`
4. feature — `docs/features/war-model-build/INDEX.md`, `REQUIREMENTS.md`

## 확정된 것 (spec/plan에 봉인 — 여기선 요약만, 중복 금지)

- 첫 슬라이스 = 결전 계산기 순수 모듈(가칭 `js/battle.js`, isomorphic) +
  battery. **실 헥스맵/UI/전선계층 통합은 슬라이스 2+.**
- 결전 척추 세 갈래: first-blow(R=attack÷shield) → 격퇴 / 방패깨기+결전
  (궤주·도주) / 야전군 부재 함락. 전부 **한 턴 atomic emergent chain**
  (ADR 0026; L2 multi-turn conveyor의 반대 — A2 fizzle 해소).
- 어휘 lock (봉인 "방패" 체계 채택): 방패 / 방패 깨기 / 결전 / 야전군 /
  궤주 절벽 / 도주 상태 / 섬멸 / 연쇄 붕괴.
- balance 방향: **공격 조금 유리** (근거: 오라버니 "리스크를 지는 행위가
  보상이 더 크다" — 이미 D4/D11에 내장). 야전군 결전 도착 ×0.75 강행군.
- 슬라이스 로드맵: **1) 결전 계산기(지금)** → 2) opportunism 봇
  (SPEC_GAP①, 야전군 도달 판정을 봇이 읽음) → 3) 정착(B3) → 4) 섹터 방어
  4-layer 정교화(A1/D7).

## 대화에서 나온 미기록 맥락 (spec/plan 밖 — 여기가 이 핸드오프의 값)

- **js/가 L2보다도 뒤처져 있음** (이번 세션 핵심 발견): `js/combat.js`는
  2026-06-29 주사위 헥스전투(D1 위배, `_roll` 0.7~1.3)이고, front sector
  개념이 js/에 아예 없음(여전히 헥스 단위 소유). REQUIREMENTS가 말한
  "reuse 대상"(ratio core·decision gate)조차 js/엔 없고 L2에만 있음. →
  **combat.js 재사용/확장 금지, 봉인 공식 fresh 구현** (plan Global
  Constraints에 박음).
- 결전 척추의 동기 = SPEC madmovie(오라버니 언어 "매드무비/도파민 거리").
  검증 서사: 명량류(지형이 결전 뒤집음 — 첫 슬라이스 씨앗, battery
  terrainFlips 지표) / 청야류(후퇴+보급초토화+통합지연 — 보급 슬라이스와
  나중 합류).
- 조사 subagent(방어·요새 봉인) 결론: war-decision 어휘가 이미
  ❓PROPOSED로 등록돼 있어(방패 깨기/결전/캐스케이드) "요새선 돌파" 신규
  대신 **기존 방패 체계 채택**, 캐스케이드→연쇄 붕괴 개명, 야전군은 미등록
  → 신규 등록. (요새선/요새 배수·우회 돌파 글자충돌 회피)

## 세션 종료 미납 debt

- **spec·plan 커밋 안 됨** (둘 다 untracked) — 오라버니 확인 후 커밋.
  이번 세션 파일: 위 spec/plan + 이 핸드오프.
- **어휘 seal doc-sync — 슬라이스 봉인 후로 확정** (오라버니 결정
  2026-07-13, doc-audit): 방패 깨기 / 결전 PROPOSED→AGREED, 캐스케이드→연쇄
  붕괴 개명(구칭 alias), 야전군 신규 등록 + term-inventory patch —
  birthplace = `docs/features/match-arc/GLOSSARY.md`. **지금 seal 하지
  않음이 확정** — slice가 구현·봉인된 뒤 doc-sync에서. SYNC-DEBT `## Open`
  의 "Decisive-battle spine — vocabulary seal DEFERRED" 행에 등록됨. 그때까지
  spec이 truth — GLOSSARY의 캐스케이드/PROPOSED를 canonical로 읽지 말 것.
- **DOMAIN_MAP L611** "Operation ~3-6 turns"가 ADR 0026 atomic과 어긋남
  → emergent-chain scale-label로 정리 (doc-sync; 조사가 확인).
- 지난 세션 이월 (미변경): crisis seal-sync, `eliminate()` register
  non-conservation, L2 fidelity-boundary NON-war 절반.

## suggested skills

- **superpowers:subagent-driven-development** (plan 실행 — 추천) 또는
  **superpowers:executing-plans** (inline).
- 구현 후 **verify** — battery 돌려 세 갈래·궤주·terrainFlips 관측
  (§7 측정: 정량 야전군격멸 + 정성 명량류/함락).
- 슬라이스 봉인 후 **doc-audit** + 세션 종료 **final-check** — 어휘 seal
  doc-sync 및 커버리지.

## 봉인 재료 포인터 (구현 중 참조)

- 공식: combat-formula `FORMULA.md` D1/D5/D6/D10/D11 · `MAGNITUDE.md`
  M2(레버)/M4(피해·궤주·도주)/M5(배수)/M7(문턱). 값은 birthplace, plan에
  포트로 박음.
- 척추: force-geography `RULINGS.md` FG-⑤(first-blow=raw defense, 예비대
  next beat)/⑧(커밋 OFF)/⑩(예비대=야전군+M9).
- 방향: ADR 0026(atomic)/0028(isomorphic·map-gen.js 선례)/0037(build);
  REQUIREMENTS A1/A2/B2/D7; DESIGN-RISKS R14.

## 환경 주의 (이월)

- `rg`가 이 환경에서 0매칭 오보 → **`grep` 사용**. smart_*/tree-sitter
  없음 → Read/grep.
- 테스트: `node --test tests/*.test.js`. battle.js는 module.exports 우선
  isomorphic이라 `require('../js/battle.js')`로 직접 로드(loadScripts
  불필요).
