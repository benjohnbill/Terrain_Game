# C-loop Translation Table

> **Working layer. The user-audit surface** (user ruling 2026-07-07): it maps the
> user's own design statements — verbatim, in the words they were said in — to the
> dial or scale that implements them, and to the instrument that checks it. Its
> purpose is to let the user verify that their intent survived translation into
> numbers.
>
> **Hand-written, and deliberately so.** Rows are 가안 / UNSEALED unless their
> birthplace says otherwise, and they are pointers, never definitions — on any
> divergence the birthplace seal is truth (documentation-law conflict rule).
>
> **Why it lives here** (adopted 2026-07-28, documentation-law ritual duty 4): it
> was carried inside `docs/GLOSSARY-QUICKREF.md` until the QUICKREF's purpose was
> defined as a re-renderable lock point. Hand-authored content inside a
> re-rendered file is content a re-render destroys. It had also grown well past
> its stated terrain-cradle origin — rows now reach match-arc (DT-①②③, ET-①),
> force-geography (FG-①…⑨), 서지 모병, and the crisis pass — so no single feature
> could host it either.

User design statements → the dials/scales implementing them → the instrument
that checks each one.

Each row cites its own birthplace in the third column; that citation is the
authority, and this file never restates a definition or a sealed value. The
earliest rows came from the 2026-07-07 terrain-cradle C-loop authoring sessions
(GLOSSARY + RULINGS TC-①…⑬); three of those terms were promoted to
`DOMAIN_MAP.md` in the same doc-sync batch (impassable terrain · 구칭 void
terrain, parity start, battle-summoning placement) while the rest — great range
/ 하서회랑 / 대환 TC-⑨, 태산 TC-⑩, grid-form freeze TC-⑪, carve principle TC-⑫,
economy ladder TC-③, border classes TC-④, border-class combat binding TC-⑬ —
stayed at the birthplace only. Later rows come from elsewhere entirely; read
each row's own citation rather than assuming a single home.

| User statement | Translation | Checked by |
|---|---|---|
| "승리 문법은 지방마다 다르다 — 단 성향이지 각본 아님" | per-region win-grammar archetypes; no scripted play | L2 archetype spread |
| "시작 인구는 지방마다 완전 동일" (2026-07-07 adopted) | equal Σpopulation per region; divergence only via play (conquest/development) | B1/B2 flat by construction |
| "중원 왕관은 인구가 아니라 경제로" | 중원 pop = parity, economyValue premium only | invisible to B-gates; L2 long-war |
| "중원 주인공은 법이 아니라 가설" | no design guarantee; needle ① holder overall winrate ≈ average, needle ② stable-hold (N+ turns) → hegemony rate clearly ↑ | L2 tournament, band = user's |
| "개발 확정 이득이라 다들 개발만 할까 걱정" | develop-greedy opening archetype probe; reprice ruling ⑳ if it dominates. NOTE: development costs the turn's PRIMARY (the one main action), not 1 command point — "main 19 + develop 1" splits are impossible | L2 tournament |
| "경제 좋은 섹터 중심으로 번영시키는 그림 — 반복 개발 열어도 되지 않나" (2026-07-07 lean) | repeatable development is already a Phase 2 reserved seat (ruling ⑳: needs a diminishing ladder); user leans YES, with snowball / fortress-turtle meta named as the guard duty | Phase 2 reopen + L2 turtle probe |
| (open pass, 2026-07-07) | **Force geography** — 모병 muster location & pool draw distribution, garrison↔reserve relation, whether main garrisons redeploy, how movement (attack & repositioning) is actually processed. Undesigned cluster; needs its own pass. L2 map wiring can run meanwhile on the current positionless-field-army abstraction | future force-geography pass |
| "자연 국경 — 국경이 전부 평지인 건 말이 안 된다" (2026-07-07 layout APPROVED) | border classes baked into map-gen INTENT: rivers 중원-강남/한경-동북/한경-강남 · forest 하북-초원 · hills 하북-서역 (천산 softened; **hills door 1,300 = new 가안 class**) · 한경-초원 partial river stays open-class → invasion-corridor authoring (sector pass) | inbound-flow measure + render audit |
| "우리 지형 정보에 맞는 방어 강도로 L2가 측정되게" (2026-07-08 APPROVED, TC-⑬) | L2 combat now reads the border class → terrain/water/choke (was hardcoded hills + uniform walls); strait grammar fires on class (bug fixed). Fort held at baseline; force-geography fort-by-class is a dormant balance opt-in | freeze re-measured un-flattened map ~12.6%; verdict held |
| L2 residual-freeze autopsy (2026-07-08, UNSEALED evidence → next grill) | tactical AI absorbed only +0.8pp; residual = victory condition unreachable — leadership 1.7×-over-max-rival acts like last-man-standing, consolidation plateaus ~1.28, elim ~0. Feeds hegemony ADR grill (SPEC-level) | NOTES autopsy · freeze-autopsy.js |
| "어떻게 게임이 종료됐는지 측정할 기준부터" (2026-07-08 hegemony grill, ending taxonomy SEALED ET-①) | bar-독립 8지표 패널(forceShare/controlShare/HHI + shieldShare/reversibilityIndex/vassalShare/bloodAxis, 속국 full 접기)이 ~87% 타임아웃을 ~56% standoff / **~28% denied-dominant(놓친 패권=벽)** / ~11% hegemon로 분해; 왕관 역전(중앙은 standoff 붙박이, 측면이 지배 — TC-② 증거). 측정≠승자규칙; 임계값 가안(측정 후 보정) | match-arc RULINGS ET-① / GLOSSARY 종료 분류 · NOTES §Ending-taxonomy |
| "15-25턴 안(핵심 18-22)에 정규분포 형태로 결판나야 — 어부지리 타임아웃 말고" (2026-07-09 decision-timing pass, DT-① SEALED · L2) | 성공 지표 = **결정 타이밍**: envelope%(전체 중 15-25턴 트립 비율) + median tripTurn; ET-① bucket은 서술용 강등. 과녁(가안 L0/L1): envelope% ≥~78-80%(현 34.6%) · median 18-22(현 19✓) · stomp 바닥 ≤~8-10%(현 ~6%✓) · timeout ≤~1-2%. 레버: **§6 지배 승리 승인**(체크픽스, denied-dominant 벽 흡수) · **§5 강제 종결 램프 보류**(게임성 vs 현실성 숙고 중). 계측기 보강 owed(18-22 core bin + 정규성 읽기) | match-arc RULINGS DT-① / spec 2026-07-09 hegemony-decision-timing-target |
| "가만있으면 뒤처지니 문 걸어잠그기보다 공격을 택하게 — 리스크 지면 보상, positive-sum" (2026-07-09, DT-② shape SEALED · L1, 숫자 유예) | §5 해소 = **창발적 성장 발산 엔진**: 두 성장 경로(발전 안전·느림 / 정복 위험·빠름, 정복 보상 = 전략적 위치 즉시 + 경제 지연[AGENTS.md 가드레일]) → 공격 = +EV 기본값, 존버 = niche = "리스크=보상" 원칙의 성장-루프 표현. 무승부는 저절로 희귀 → **§5 "무승부 금지" SPEC 개정 불필요**(#5 실현). 결판 다이얼 = 정복의 즉시-vs-지연 배분(§6 뒤 timing ruler로 튜닝). 얼음깨기 = 측정-게이트 컨틴전시(주나라-seed 파킹, 선제 미설계). 경합성 = 리더 확장이 새 전선 노출. 미검증: "평화 발전"이 기존 경로인지 | match-arc RULINGS DT-② / spec 2026-07-09 §5 |
| "이미 이긴 게임(못 뚫는 벽)은 승리로 닫아야 — 존버 마무리 말고 싸워서" (2026-07-09, DT-③ SEALED · L1, 콤보 2) | §6 지배 승리 = **트립 = (leadership OR dominance) AND unassailable**. dominance = forceShare ≥ 0.5 또는 최강 rival 2.5배(라이벌 *벽* 바 없음, 공격 점유율만); unassailable = 기존 gate 1.7배+6턴 예측 **재사용**(ⓒ 별도 카운터 불필요, 6턴 예측이 지속). 콤보 1(panel 1.0 스냅샷) 기각: 원칙 #5 "CAN reverse"=미래형이라 window가 충실 + 불가침 정의 단일화 + out-fight 정체성 + 벽-31% 더 이르게 envelope 전환. 구현(check-fix) = spec §7 첫 레버 | match-arc RULINGS DT-③ / spec 2026-07-09 §6 |
| "경제력의 지배 변수는 노출도와 투사" (ladder v2 structure APPROVED w/ holds) | econ index = 0.55 + 0.45 × (inbound flow ÷ world avg) + projection-shortfall credit; **HELD by user: core(심장부) debit, fiction band** — depth value unmeasured, constants 0.55/0.45 need their own grilling later | L1 formula now; L2/L3 validate |
| (baked 2026-07-07, map-gen parity v5) | all regions Σpop 6.0 / cap 3,600; Σecon = index × 6.0 (중원 7.5 crown … 서역 4.8 · 동남해 4.6); 초원 = first pop-econ separation case (pop spread, econ capital-spiked) | B1/B2 PASS, viable 7/7 re-verified |
| L2 watch flags (2026-07-07, user-agreed) | ① 중원 crown needles ×2 ② develop-greedy opening ③ 강남 quiet winner (two river shields + full projection) ④ 촉-seat overperformance (nerf deferred — door dial if needed, not econ) ⑤ region-abandonment meta ⑥ 동남해 fertility funding (parked with fiction band) ⑦ 관중 gate-city seat performance | L2 tournament adapter |
| "도시는 전장을 소환한다" (placement principle, 2026-07-07) | every city except 서역's is placed where fighting is invited — cities pulled centerward, borders shared. 서역 = deliberate opposite pole (max-hermit oasis, depth ~6 hex). Baked as fixed seats in map-gen.js | render audit + L2 |
| "노화 — 속도뿐 아니라 어떻게 늙는지" (2026-07-07 밤, 노화 헌법 P1~P3 SEALED — staged in NOTES, birthplace sync owed) | P1 이중 청구: 사람 충원(모병+수비대 재생)은 피(영구)+생산(흐름) 동시 청구, 공짜 치유 없음 · P2 흐름은 늙지 않음(경제는 회복 속도만; 초토화만 예외; 피폐 문턱 Phase 2 파킹) · P3 스냅샷 정보(불변층 영원, 가변층 접촉 순간 박제 후 바램 — 재정찰 = 행동력) | match-arc GLOSSARY 노화 헌법 / RULINGS MT-① |
| "징집 명부 = 군사력이 될 수 있는 모든 신체 인구" (2026-07-07 밤 재창설, registerPerPop 3.0 SEALED) | 명부 = 1,800 × 인구점(땅-파생 재고, 죽음만 감소) · capPerPop 600 = 파생 상수(유지분수 ⅓: 평생 신체의 ⅓만 동시 복무) · 근거: 2-트랙 연구(나폴레옹 3-4× 창 + 게임 관례 2.5-3×) | match-arc GLOSSARY 징집 명부 / RULINGS MT-② / MAGNITUDE M13 |
| "동원 강도에 따라 생산 단가가 달라진다" (서지 모병 모형 SEALED 2026-07-07 밤) | 동원 강도 = 복무 중 ÷ 현재 명부 · 단가 = 연속 구간별-선형 한계 곡선(청구서 = 적분), 이름 구간 4개는 서사+M10 누설 전용 · 크기 축 = 커밋 서지(단발) · 수비대 재생 동일 단가 · 시작 좌표: 시작 42% / 구조 최대 58% (f₀ 0.5·g₀ 1.0·ρ 0.75, 연구 앵커) | match-arc GLOSSARY 서지 모병·동원 강도 / RULINGS MT-③④ / MAGNITUDE M13a (무릎·배율 = 눈금 세션) |
| "회복 다이얼이 그렇게까지 영향력이 클 줄 몰랐다 — 매치를 기울이는 장치가 판 자체를 바꾸는 메타 체인지" (2026-07-07 impact-first 룰링) | 동결 세계 발견(억지 평형, MA 행 참조): 매치 ~58% 영구 동결, 병목 = "치유된 이웃" 상대 leadership 바(중앙값 4,500명 부족), A-3 cap 성장 단독 불충분(22→24%). **블라인드 설계가 force-geography 앞으로 승격**; 바늘 판정(중원 밴드·관중+촉·초원)은 L2 신뢰도 상승 뒤 유예 | sheet 15 (`battery.js cradle`) + finalCheck 부검 눈금 2종: leadership shortfall(결정점까지 남은 투사 부족분, 명 단위)·coalition overhang(연합이 나를 뒤집을 여유분) |
| Sector layout SEALED via edit-layer export (2026-07-07) | 하북/한경 **gate-cities** hold 3/3 & 4/4 of the 중원-border hexes (every campaign passes the city) · 강남 **pivot city** fronts 중원(5)+촉(4), strait lands in an INTERIOR harbor (rear-strike dagger — intended asymmetry) · 동북 **port capital** = its strait sector (island link IS the seat's meaning; profile amended from "deep interior") · 관중 **gate-city on the mountain triple junction** 중원/하북/촉 — terrain stays mountain, basin-grammar ("rim poor / floor rich") named exception · 중원 **keep city** r1_s3 (interior, mild spike 2.0/2.4; flatness ruling amended: stakes smeared on the rim, heart inside — the only city invisible from any border) · 촉 all-3-sectors border-touching (triple-front hinge r8_s2) | baked map-gen.js; B1/B2 PASS, viable 7/7, totals exact |
| "예비대 없는 측정이 의미 있나 — 약한 전선은 예비대 없이는 허수아비" + "험지 몰빵할 이유가 없지 않나" (2026-07-09, force-geography (b) v1 SEALED FG-①…⑨) | ① 게임이론 교정: 합리적 수비자는 방어력을 *균등화*(약지형에 병력 더)→그게 프리즈. 약한전선 = **부족+가치**(저가치×고비용 전선이 구멍), defensibility 몰빵 정책 아님. ② **반응 예비대 IN-SCOPE**: 첫blow=야전군 vs 깡수비, M9 ×0.5 한박자뒤(그 창이 돌파구), 목적지 `deficit×value`(ADR 0019 재사용, whole-realm). ③ 공격자 정보=봉인된 fog estimate-band(파생), band 가중치만 U4로 열림. ④ 커밋-희소 OFF. ⑤ v1=(최소) 균일상비+예비대집중 / (정교) 상비 재분배=데이터 뒤 델타 | L2 (최소) 측정: within-realm 분산↑ · 방어력 shieldShare↑ · denied-dominant/standoff↓ · 결정%↑ + 집중이 예비를 이기는 빈도 |

| "지리가 가능한 것의 집합을 정하고, 판단이 그 안에서 고른다" (2026-07-11, SPEC #9로 승격 — ADR 0032) + 땅-상한 결합 다이얼 0 봉인 (R4 · L2) *(당일 AB-②로 개정: 기록 세계 = FG+M9+frac1)* | L2 세계가 섹터 해상도로 — 실명 점령·id-정확 양도·보유지 파생 수입/상한·섹터별 숙성. capLandFrac 스윕: 결합이 켜질수록 denied-dominant 벽 재축조(ctrl 89→239), fgM9on 예비대만 흡수(135→109) → 0 = world of record, 게이트 재보정은 별도 grill | v2 seal run (reps 20 × 7 bindings, seed 42) · plan-battery.js dd/overhang 상설 계기 |
| "심판의 모병 미래는 세계가 실제로 파는 것만 센다 — min(자리, 속도, 돈, 몸)" (2026-07-11, AB-① SEALED · L2) | 불가침 산술의 모병 미래 신용에 지불능력 상한: money = 국고 + 6턴 수입을 서지 곡선 단가로(doRecruit와 동일 draftBill), bodies = 민간 명부. 새 다이얼 0. 측정: 벽 기저 하락(fgM9on dd 135→69), frac-결합 재축조는 생존 → 돈/몸은 고frac 하중부재 아님 | affordBindRate 상설 계기(frac0: ctrl 4.1% · fgM9on 23.5% · fgM9off 12.7%) · 기준선 research/2026-07-11-record-world-baseline.txt |
| "이도저도 아닌 blend는 세계적 의미가 없다 — 상한은 정복한 인구 현실을 따른다" (2026-07-11, AB-② SEALED — 기록 세계 = FG+M9+frac1) + "32턴 종은 위기다, 채점표가 아니라" (AB-③ 방향 SEALED · L0) | capLandFrac 1 채택(중간값 기각, land-derived 정체성); dd 비용(69→98) 수용 — 위기 종결 + 게이트 재보정 레버 3종(정치적 실행가능성 필터 / 왕관 K턴 연속 보유 / 소집 시간 할인)이 배수구. 32턴 = 이민족 침입 계열 돌연사 위기(주사위 없음·대비 가능·~3턴 내 종결 강제), 채점표는 최후 fallback; decided% = KO율 재해석; 상세 설계 = 전용 패스(5 게이트 + 3 라이더, ADR 0034) | pre-crisis baseline 고정 · 하네스 기본값 플립 = SYNC-DEBT · SPEC 개정안은 설계 패스에 탑승 |

