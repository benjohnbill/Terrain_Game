# Handoff — Terrain Game: War Model Build 설계 시작 (2026-07-13 → 다음 세션)

**이번 세션의 목표:** `docs/features/war-model-build/REQUIREMENTS.md`(빌드 명세
뼈대) 위에서 **빌드 설계를 시작**한다. L2 전투 시뮬(`mockup/combat-calc/`)은
은퇴됐고, 봉인된 전쟁 모델을 실제 게임 코드(`js/`)로 짓는 국면이다.

## 어디서 왔나 — 지난 세션(R14 → 빌드 전환, 커밋 `f9ffeaa`)

크리시스 co-analysis가 지목한 R14(주 아크 전쟁이 결정적 결판을 못 냄)를 grill.
파고드니 **문제가 크리시스도, 튜닝도 아니라 L2 자체가 SPEC 전쟁을 거꾸로
구현한 것**이었다. 4갈래 병렬 조사(SPEC + DESIGN + DOMAIN_MAP + feature + ADR)로
규명:

- **fizzle(섬멸 0 · 백지평화 77%)은 SPEC 전쟁의 성질이 아니라 L2 artifact.**
  - 방어: 봉인 = 섹터별 4-layer 지형분산(ADR 0022/0031) / L2 = 전선당 균일
    aggregate(`frontG=섹터수×900`, "교체대상"). force-geography 측정: 균일성이
    freeze driver(+33% decided).
  - 결판: 봉인 = **atomic 한-턴 결판**(ADR 0026) / L2 = 다단계 siege→field→
    cascade→capital 컨베이어(미봉인, **ADR 0026 위배**). 2턴 stall exit가 야전
    결전 전에 발화.
  - 봇 전쟁의욕: 봉인 = opportunism read(**미설계** SPEC_GAP ①) / L2 = 정적
    1.7 declare 게이트 → 대칭 보드 freeze.
  - stall 종전: 봉인 = bot-policy only 인간 무관(CE-⑲) / L2 = patience 2 →
    77% 백지평화.
  - **봉인된 매치 결판(leadership OR dominance AND unassailable)은 충실 작동 =
    봉인 무죄.**
- **결정(ADR 0037 Accepted):** L2 stage-machine 은퇴, 빌드가 봉인모델 구현.

**꼭 읽을 것 (읽기 순서):**
1. `docs/features/war-model-build/INDEX.md` — front door + open questions
2. `docs/features/war-model-build/REQUIREMENTS.md` — 명세 뼈대(A 전투 / B 결판 /
   C 봇 / D 지원, 각 행 봉인출처 + L2 gap + fizzle 오염 + 빌드 우선순위)
3. `docs/adr/0037-war-model-build-over-retired-l2-stage-machine.md` — 전환 결정
4. `docs/adr/0028-l3-buildout-stack-direction.md` — stack 방향("무엇부터" 입력)
5. `SPEC.md` Match structure + Core Principles; `DESIGN.md`
6. 봉인 재료: ADR 0022(front sector), 0026(atomic), 0031(force-geo defense),
   0032(occupation); match-arc RULINGS FG-①…⑩ · SPEC_GAP ①
7. 메모리: `terrain-game-war-model-build`, `terrain-game-stack-decision`,
   `terrain-game-grill-communication-style`

## 다음 세션의 첫 갈림길 (grill 과녁)

INDEX open questions 4개. **추천: q1을 먼저 게이트로.**
1. **무엇부터 + 어떤 stack** (ADR 0028) — 빌드 첫 슬라이스를 P1 행(A1 섹터방어 /
   A2 atomic 결판 / B2 야전군격멸 / C1 opportunism봇 / D7 지형방어)에서 어떻게
   자를지. 이게 나머지를 게이트한다. **여기부터.**
2. **opportunism read** (C1) — load-bearing 미설계 조각. 핀된 상대의 노출 전선을
   봇이 어떻게 읽고 개전하나.
3. **atomic war spine 표현 + ❓PROPOSED 어휘 grill** (A2/B2) — "shield-break →
   decisive battle → cascade"를 ADR 0026 atomic 결판 안에서 emergent chain으로
   표현; 어휘를 AGREED로 승격.
4. **per-sector 방어 포팅** (A1/D7) — force-geography(`FG_BOARD_GAAN`)의
   terrain-bound 방어 + reactive reserve를 실맵의 섹터별 4-layer로.

## 핵심 tension / caveat (반드시 유지)

- **정교화 ≠ 결정성.** 방어를 정교하게 짓는 게 fizzle을 자동으로 안 고친다.
  R14의 답은 "야전군 격멸이 결판"이 *실제로 벌어지게* 하는 것.
- **빌드도 만능 아님.** "결정적 전쟁이 default냐, 고수가 만드는 드문 것이냐"는
  결국 **L3 playtest**가 답한다(bot은 원리적으로 못 가름). 빌드는 그 질문을
  *답 가능한 자리로* 옮기는 것.
- **SPEC-adjacent 결정(승리조건 / 매치구조 변경)은 Tier-3** — ADR + 유저 승인.
- crisis(ADR 0035/0036)는 opt-in OFF로 PARKED — 빌드에서 결정적 전쟁이 default가
  된 뒤 lean turn-30 backstop(AB-③)으로 재방문.

## 방법론 (지난 세션의 큰 교훈)

- **L2는 반증엔 강하나 확증엔 원리적으로 약하다.** 구조적 불가능성 증명은
  L2의 강점이지만 "재밌나 / default냐"는 bot 인질 — L2 지표 튜닝은 "알맹이 없이
  뺑뺑". fidelity는 전역이 아니라 판단-상대적. (유저 직감 "L2 데이터 불신"이
  fizzle=artifact로 확증됨.)
- grill 스타일: 흐름 지도 먼저 · 게임 디자이너 언어 · 한 턴 한 질문 + 추천 ·
  "복잡해서 이해 못하겠다" = 고도 틀림 신호(평범한 번호 리스트로 리셋) · 유저
  pushback은 대개 load-bearing.
- 문서법: birthplace=authoritative, REQUIREMENTS는 pointer surface(restate 금지);
  봉인 시 ADR/RULINGS; 세션 종료 doc-sync ritual.
- tree-sitter 없음 → smart_* 대신 Read/grep. **`rg`가 이 환경에서 오작동(0 매칭
  오보) → `grep` 사용.**

## 제안 스킬

- **`brainstorming`** — 빌드 첫 슬라이스 설계 시작(새 기능 설계).
- **`grilling`** — 설계 grill 주 스킬.
- **`writing-plans` → `subagent-driven-development`** — 설계가 코드로 갈 때.

## 열린 debt (SYNC-DEBT)

- crisis seal-sync 이연 — 빌드에서 crisis unpark 후.
- `eliminate()` register non-conservation (Tier-3, 유저 결정).
- L2 fidelity-boundary 부채의 **NON-war 절반**은 아직(war-model 절반만 상환).
