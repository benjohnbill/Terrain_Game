# Handoff — Terrain-Cradle C-loop close (2026-07-07)

## 오라버니용 요약 (빠른 참조)

지도는 완성·봉인됨 (B1/B2 PASS, viable 7/7). 남은 일, 순서대로:

1. ~~**doc-sync 배치**~~ ✅ **완료 (2026-07-07 오후 세션, 커밋 2건)** —
   DOMAIN_MAP 승격(void·동일인구·전장소환) + 낡은 행 수정 + DESIGN
   파이프라인 소절 + QUICKREF 재생성 + **SPEC 중원-왕관 개정 유저
   승인·반영**. SYNC-DEBT terrain-cradle 행 전액 정산.
2. ~~**L2 어댑터**~~ ✅ **완료 (2026-07-07 오후, 커밋 4건)** —
   map-board.js + sheet 14b/15, 12,600매치 측정. **헤드라인: 동결
   세계 발견** (회복이 상처를 이김, 매치 ~58% 영구 동결, A-3 단독
   불충분) — `mockup/combat-calc/NOTES.md` 2026-07-07 항목. 바늘
   판정(중원 밴드·관중+촉·초원)은 L2 신뢰도 상승 뒤로 유예.
3. **블라인드 설계** → **매치 기울이기 pass로 확장, 진행 중** —
   2026-07-07 밤 세션이 노화 헌법·명부 재창설·서지 모병·시작
   좌표까지 봉인. **현행 핸드오프 =
   `handoff-2026-07-07-match-tilting-pass.md`** (이 파일의 이후
   항목들은 그쪽이 최신).
4. **force-geography pass** — 모병 발원지·수비대/예비대 관계·이동
   처리. (미설계 덩어리, 지도가 전제라 이제 가능)
5. **디자인 전용 그릴** — 시각 개선 + 에디터 재동기화 + 중원
   중심성(DISPLAY-DEBT).

유보 다이얼(사다리 상수·심장부 감가·픽션 밴드·전선폭·hills 1300)은
세션이 아니라 L2/L3 데이터 도착 시 깨어남. 장부: `docs/SYNC-DEBT.md`
· `docs/DISPLAY-DEBT.md` · `docs/features/terrain-cradle/INDEX.md`.

---

Session: the C-loop map-authoring marathon. The 10-region map is
AUTHORED & SEALED at L1. Read
`docs/features/terrain-cradle/INDEX.md` first — it is the front door
(status, rhythm law, pointers, open questions). Decision record:
`RULINGS.md` TC-①…⑫. Commits this session: 281315d (workbench merge)
… 1dcb5d2+ (doc close).

## Session plan agreed with the user (order matters)

1. **Session A — doc-sync batch (NEXT, before L2).** Pays the
   registered SYNC-DEBT row "Terrain-cradle → Projection sync":
   - Draft the **SPEC amendment proposal** for the 중원-crown
     demotion (TC-②): SPEC line ~118 still speaks the old
     one-richer-center-seat model; parity v5 contradicts it. USER
     APPROVAL required — propose, never drift (documentation law).
   - Promote to DOMAIN_MAP (Tier-0 summary+pointer entries, definition
     stays in feature GLOSSARY): void terrain, parity start,
     battle-summoning placement.
   - Fix stale Projection rows (e.g., QUICKREF/DOMAIN_MAP `Realm`:
     "one richer center seat").
   - Regenerate QUICKREF header/date after the batch.
2. **Session B — L2 tournament adapter.** Sheet-12 tournament →
   CRADLE_MAP realms; includes re-wiring battery sheet 14 (currently
   FIXTURE regression anchor only). Measures the 7 watch flags
   (QUICKREF C-loop table).
3. **Session C — force-geography pass.** Muster location / pool draw /
   garrison↔reserve / movement processing. Registered as an
   undesigned cluster in the QUICKREF table.
4. **Session D — dedicated map-design grill (user-flagged).** Visual
   design pass + editor re-sync/exporter (the original editor sketch
   is superseded — see INDEX "Authoring rhythm" staleness note) +
   DISPLAY-DEBT 중원-centrality row.

Held dials (ladder constants 0.55/0.45, core-depth debit, fiction
band, frontage weighting, hills 1,300) are NOT sessions — they wake up
when L2/L3 data arrives.

## Gotchas for the next agent

- **Carve principle (TC-⑫)**: never change map-gen candidates/growth
  after a layout seal — global reshuffle scrambles USER_SWAPS and the
  seat indices. Terrain edits = post-partition carves + law checks.
- Browser verify: hard-reload (ignoreCache) after editing js — the
  profile caches modules. Mockup edit layer writes
  `terrainMapOverrides.v1` localStorage; baked no-ops are harmless but
  "전체 초기화" clears them.
- The user audits via `docs/GLOSSARY-QUICKREF.md` C-loop translation
  table — keep it current with every ruling (extended role, law §4).
