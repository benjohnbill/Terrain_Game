# Fog-of-War & Discovery Glossary — Tier 1

Birthplace and single definition point of fog/perception vocabulary
(Vocabulary Law, `.claude/rules/documentation-law.md`). Header format:
English canonical (한국어 표시어). Created 2026-07-10: the terminology
audit (Ring B, finding R-01) found this feature's load-bearing terms in
established use across DESIGN/ADRs/js with no registration surface.

| Term | Definition | Status |
|---|---|---|
| Information confidence (정보 신뢰도) | How well the player knows a sector's true forces — a scalar from blind (0) to fully known (1) that narrows the estimated-force band and gates status legibility. A separate layer OVER province status: status says what a province reads as, confidence says how far to trust that reading (ADR 0023 draws the distinction). Raised by contact/scouting, decays for the mutable layer per the snapshot-information principle (노화 헌법 P3). Code: `informationConfidence` (js/intel.js and consumers). | AGREED (registered 2026-07-10 from established usage — DESIGN.md, ADRs 0013/0019/0020/0021/0023/0024) |
| Estimate band (추정 구간) | The banded display of a quantity the player cannot read exactly (enemy force, acceptance outlook, 판세): a range whose width is set by information confidence, never a false-precision point value. The fog axis of the uncertainty duel — systems trip on true values while the player predicts through the band. | AGREED (registered 2026-07-10 from established usage — fog slice-1 e29a7e6, ADR 0021/0025, MAGNITUDE/FORMULA usage) |
