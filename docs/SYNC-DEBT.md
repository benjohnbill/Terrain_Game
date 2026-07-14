# Sync-Debt Ledger

Tracked ledger required by `.claude/rules/documentation-law.md`
(conflict rule + session-close ritual duty 6). One line per unpaid
documentation debt; strike it (move to Paid) when paid. An unrecorded
debt is a law violation; an unpaid-but-recorded one is normal
operation.

Seeded 2026-07-05 from the Codex governance audit (verdict: ADOPT WITH
FIXES; session `019f3183…`, log in `.context/codex-session-id`).

## Open

- [ ] **Field-army division-doctrine stamp — registered** (2026-07-15,
  slice-2 ticket 04 landed division/merge in code — merge 1950b36). Spec §12
  owed, now actioned by the code landing: amend the match-arc GLOSSARY 야전군
  row to free division/merge (retire "one at a time" → 구칭 alias) and refresh
  DOMAIN_MAP L666 ("one mobile main force" → freely divisible). Plus record the
  merge float-conservation implementation ruling (substance bit-exact;
  tiredness invariant up to ~1e-12 divide-then-multiply round-off, not
  laundering) at war-model-build RULINGS. Deferred to next doc-sync batch
  (user, 2026-07-15).

- [ ] **Catalog altitude-reclassification pass — registered** (2026-07-14,
  WM-②). Dedicated grill: stamp all 12 operation plans with their altitude
  (contact method / board verb / information·recovery verb), seat contact
  methods in the calculator's categorical socket (A4), author the
  present/predictive reconnaissance plan cards, and supersede the old
  "tactics sequenced = strategy" frame by ADR. Slice 2 performed only the
  minimal 2+2 defense split (spec §8).

- [ ] **Commit-curve grading session — registered** (2026-07-14, WM-②).
  M2 slope/max re-cut is out of slice 2 entirely; slice-2 battery carries a
  descriptive sweep only (spec §11). Decision in its own session, evidence
  first.

- [ ] **HCLM → SPEC Core Principles promotion — PROPOSED (Tier-3, user)**
  (2026-07-14). "High Complexity, Low Micromanagement" as the UX corollary
  of one-judgment (spec §3). User decides at a doc-sync.

- [ ] **Three-altitude reading → DESIGN promotion — PROPOSED (Tier-3,
  user)** (2026-07-14). Tactics / operational art / strategy as nested time
  scopes (spec §0). User decides at a doc-sync.

- [ ] **Stationary requirement for fatigue recovery — HELD dial**
  (2026-07-14, WM-②). Whether recovery requires not moving/fighting that
  turn, beyond the supply coupling (spec §2). Revisit at the magnitude pass
  or measurement.

- [ ] **§2 recovery model — ground/ash gate note — registered** (2026-07-15,
  slice-2 ticket 06 landed board verbs + emergent siege). Spec §2 states
  recovery is "a child of supply" only; the code adds a ground factor —
  ash (scorched ground) denies wear recovery even when supplied
  (`fatigue.turnUpkeep`'s recoveryFactor, `board-verbs.siegeUpkeep`),
  authorized by ticket 06 L25 and consonant with ADR 0014 (a burned
  province economy cannot sustain/rebuild its garrison). The §2 firewall
  holds — the ground gates the wear ledger ONLY, never substance. Owed: a
  §2 sync note that recovery = supply × ground-recovery factor, and a dial
  row for ash-recovery grading (binary 0 today; partial-burn curve is a
  magnitude candidate). Deferred to next doc-sync batch.

- [ ] **Crisis dial table — sweep + co-analysis: RAN, PARKED
  2026-07-13** (registered 2026-07-11; LANDED 2026-07-12
  `e5d5c58..25192cb`; co-analysis pass 2026-07-13 commit `d64d48c`,
  294/294). The co-analysis grill ran the sweep and **parked** the
  crisis: the growth formula was reshaped (register-anchored; retires
  rate0/rateStep/crisisRate/sectorFuel + intensity factor), and
  **self-denial** (CE-⑦ reframe, `selfDenialFrac`) cut draws 0.369 →
  0.200 — but the sweep found (a) every remaining crisis dial is a
  *brake* (cranking denial converts late-trips to draws, not to faster
  resolution; elim flat 3-5 throughout), and (b) the crisis is causally
  confined to turns ≥26, so it cannot fill the 18-22 tripTurn
  sweet-spot nor create decisive endings. **Root cause moved to R14**
  (DESIGN-RISKS): the main arc yields ZERO annihilations (77%
  stall→white-peace, crisis-OFF), so the draw/spectacle problem is the
  war system, not the crisis. Crisis stays 가안 + PARKED as a backstop;
  the next lever is the war-decisiveness pass (R14). **R14 RAN 2026-07-13
  → ADR 0037**: the four-survey synthesis found the answer is a war-machine
  *implementation* gap (per-front uniform defense / non-atomic siege conveyor /
  static declare gate + bot stall-exit) — build the sealed model
  (`docs/features/war-model-build/`), don't tune L2 further; crisis un-parks in
  the build context.
  No Tier-3 default flip (crisis stays opt-in OFF).

- [ ] **Crisis co-analysis seal-sync — DEFERRED** (2026-07-13, commit
  `d64d48c`). The pass landed code that AMENDS sealed rulings but the
  full Production/Projection seal-sync is deferred (pass is PARKED, dials
  stay 가안, so premature to final-seal): (a) RULINGS amend CE-④/⑭
  (growth reshape — register-anchored, additive baseline + scar
  amplifier, intensity factor retired) and CE-⑦ (denial self↔board
  reframe, `selfDenialFrac`); (b) record CE-㉑/⑳/㉒ as measured-INERT +
  CE-⑩ shield-drain BUILT-then-REVERTED; (c) GLOSSARY rows
  (unrestBase0/unrestStep/scarGain, selfDenialFrac, conquestPacifyFrac,
  noStallPeaceStage, rebelSiegeDrag); (d) QUICKREF regen; (e) ADR
  0035/0036 amend stamps (growth + denial reshape); (f) term-inventory
  patch. Recorded now, paid when the crisis un-parks (after R14) or in a
  dedicated doc batch.

- [ ] **`eliminate()` register non-conservation — pre-existing, Tier-3**
  (found 2026-07-12 during the crisis whole-branch review). In
  `mockup/combat-calc/tournament.js` `eliminate()`, the winner is
  credited `round(D.pool × 0.5)` but the defeated realm's `D.pool` is
  never zeroed (unlike `D.field`/`D.interior`), so the world reserve
  register can GROW on an elimination — a conservation break. The
  winner's inflated (alive) pool feeds the sealed affordability
  arithmetic and the cradle world-register-bounded test, so it is baked
  into the sealed record-world baseline; root-fixing it means
  **re-sealing that baseline (Tier-3, user decision)**. The crisis
  measurement (`crisisGateReport`) works around it by excluding
  `alive === false` realms from its register-exhaustion denominator
  (commit `25192cb`); no crisis metric depends on the bug. Owner: user
  — decide whether to root-fix + re-seal.

- [ ] **Suppression cost not deducted from garrisons — L2 fidelity gap**
  (registered 2026-07-12, crisis Task 5). `crisisTurn` MEASURES
  suppressor casualties per terrain (`record.crisis.suppressCostByTerrain`,
  the CE-⑯ watch item) but does not SUBTRACT them from `frontG`/
  `capitalGarrison`, so suppression budget stays constant turn-over-turn
  regardless of accumulated losses — a partial gap vs CE-⑩ ("walls
  hollow from within"). The harness has no dedicated reserve pool to
  deduct from cleanly; deferred as a measure-first simplification.
  Revisit if the co-analysis sweep shows it materially changes the
  chore-prevention / war-density read. Owner: the crisis co-analysis
  session.

- [ ] **L3 scar-intel fog layer** (registered 2026-07-11, CE-③). The
  fog-spec read of others' uprising fuel is design-sealed but L3-only;
  L2 measures true values. Pointer: `docs/DISPLAY-DEBT.md` (scar/
  mobilization fog intel view row).

- [ ] **Timing-ruler reframe — DOMAIN_MAP/DESIGN promotion scan** (registered
  2026-07-09; metric reframe SEALED same day as match-arc **DT-①**). The
  reframe (headline = decision timing, `envelopePct` / `medianTripTurn`;
  ET-① buckets demoted to descriptive) is sealed at its match-arc birthplace
  and the feature INDEXes are synced (force-geography U5 + "Next" line,
  match-arc INDEX) — those parts are PAID. RESIDUAL: two feature surfaces now
  consume the reading (match-arc DT-① defines it; force-geography `--fg`
  references it), which is the Tier-1→Tier-0 promotion trigger — but spec §13
  leaves "promote to DOMAIN_MAP/DESIGN vs stay a match-arc ruling" an OPEN
  doc-sync question. Held as a CHECKED non-promotion for now (match-arc-native
  reading); revisit at the next doc-sync batch or when a root doc needs it.
  The **instrument enhancement** for the re-measurement is now BUILT (main
  @f8655ad): `core1822Pct` (18-22 tight-core share, spec §4) + `meanTripTurn` /
  `stdTripTurn` (population) / `tripTurnHist` for a distribution-shape (normality)
  read, plus a `--fg` core line. §5 forced-resolution was SHAPED (RULINGS
  **DT-②**, 2026-07-09) and is now **IMPLEMENTED in the L2 harness
  (2026-07-10**, commits ceea2dc/cbe3b9a/b32a630/e7df309 — conquest-growth
  ripening wired into transfers + turn loop + `--growth` sweep driver;
  status corrected 2026-07-10 by the structure forensics, case F-10): a
  positive-sum growth-divergence engine resolves balanced boards emergently,
  so the §5 "no-draws" SPEC amendment is retired-as-unnecessary; mechanism
  NUMBERS remain deferred to the tuning pass against the timing ruler,
  ice-breaker is a measurement-gated contingency (Zhou seed parked). §6 domination victory arithmetic SEALED and now IMPLEMENTED +
  MEASURED (RULINGS **DT-③**, Combo 2 — trip = (leadership OR dominance) AND
  unassailable, reusing the gate's 1.7×+W6 clause; commit a29eb0a, 167/167
  green, task review + whole-branch review both Approved with zero
  Critical/Important). Same-N re-measurement (pre/post §6, reps=20 × 7
  bindings, seed 42) confirms the predicted `denied-dominant` wall absorption
  (ctrl 27.6%→1.7%, fgM9off 30.1%→2.6%) and a decided%/envelope/core rise
  across all three arms; fgM9off's median tripTurn moved from dead-center 19
  to 17 (now slightly ahead of the 18-22 core) — flagged as a §5 tuning
  watch-item, not a defect. The SPEC.md Direction amendment declaring the
  domination win-type is PAID (see Paid below). Open: whether "peaceful
  development" is a real growth path in the model or must be built; and
  whether the DT-① envelope target (≥78-80% final) is reachable purely
  through DT-②'s emergent growth engine without any clock-like device — the
  question the §5 tuning pass (next) will test empirically before it is
  revisited.

- [ ] **Derived-asymmetry machine-check** (registered 2026-07-08, seal
  TC-⑭): population parity (Σpop==6.0 per region) and the economy ladder
  are authored as literals in `map-gen.js sectorSpec`, not recomputed from
  geometry at load time — so SPEC #8 / TC-⑭ "derived, not baked" is
  doc-enforced, not machine-checked. Add a load-time assertion (per-region
  Σpop; econ == ladder(borders)) to harden it. Optional (compliant today);
  flagged by the 2026-07-08 independent audit.

- [ ] **Match-tilting pass — residual sync** (birthplace sync PAID
  2026-07-07, see Paid below; these items remain): (a) ~~ADR 0014
  header amendment stamp~~ — **PAID 2026-07-10** (user-sealed doc-
  governance package; header stamped under the new seal-amends-ADR duty,
  duplicate of the recovery-dial row's item (a) — ledger hygiene case
  F-11, single stamp paid both rows). (b) **Surge Draft Model curve numbers** — knees,
  band multipliers, surge exchange rate (+1%p/pt 가안), zone names —
  deferred to the magnitude session (structure sealed, numbers 가안).
  (c) Riders: **sheet-7 tempo revalidation** under f₀ 0.5 (was 0.7),
  **M14 flat blood-EV re-check** (band escalation bends it),
  **L2 re-verify registerPerPop** after tilting devices land.

- [ ] **Recovery-dial grill — residual sync** (doc-sync batch PAID
  2026-07-08, see Paid below; these remain): (a) ~~ADR 0014 header
  amendment stamp~~ — **PAID 2026-07-10** (see match-tilting row (a);
  one stamp, both rows). (b) **QUICKREF regeneration** (C-loop table + MT-⑤ + ADR 0027 +
  블라인드 supersession) — batched into the force-geography doc-sync
  **2026-07-09**: added the Force-geography term section + C-loop row +
  블라인드-supersession note + header date/addendum. Residual (a
  full row-by-row re-audit of every prior batch against canon) is NOT
  claimed done — QUICKREF is a convenience surface that may lag; treat
  this as targeted-current-through-2026-07-09, not a from-scratch regen.

- [ ] **L2 fidelity-boundary grill session** (registered 2026-07-10, §5
  conquest-growth measurement pass; user-requested). Standing principle
  (user, 2026-07-10): L2 implements EVERYTHING except the fun only a
  human can verify — mechanical, deterministic, document-specified
  behavior is never legitimately abstracted away. Trigger case: the L2
  board flattens sector transfer to a count while DOMAIN_MAP's cession
  currency is defined as "named sectors" with per-sector cap value
  varying 360–1,200 (3.3×) by region geography — the flat `capPerSector`
  dial both erased terrain from the growth engine and contaminated the
  2026-07-10 growth sweep. Owed: a dedicated grilling session producing
  the two lists — (1) "human-verify-only" items (stay out of L2) vs
  (2) "document-specified but currently simplified in L2" items (each an
  L2 fidelity debt with its own row/owner). Until that audit, treat any
  L2 conclusion that leans on a simplified mechanic as L1-grade for that
  mechanic (test-trust ladder, match-arc TEST-LADDER.md).
  **War-model half PAID 2026-07-13** (R14 four-survey synthesis →
  `docs/features/war-model-build/REQUIREMENTS.md`): list (2) "document-specified
  but simplified in L2" is enumerated for the war model — per-front uniform
  defense (sealed = per-sector 4-layer), non-atomic siege conveyor (contradicts
  ADR 0026), static declare gate + bot stall-exit — each a fidelity gap vs a
  sealed doc; ADR 0037 decides to build the sealed model rather than abstract
  it. The general two-list audit for NON-war subsystems remains owed.

- [ ] **Unsealed surge/economy 가안 — post-measurement reconsideration**
  (registered 2026-07-11, user ruling [conversation 2026-07-10]: keep 가안,
  re-examine only after an L2 measurement makes them bite). Four dials:
  `warMult 2` / `fullMult 12` (surge-curve multipliers — currently provably
  inert: treasury runs surplus all match, blinds autopsy 2026-07-07),
  surge SIZE exchange rate `+1%p/point` (axis unmodeled — commit economy,
  see the L2 fidelity-boundary grill row), `treasuryStartTurns 3`.
  Trigger to reopen: any measurement where the price curve or treasury
  actually binds (an economy-tightening pass, or commit-economy modeling).
  Do not tune before then — unverifiable numbers are decoration, not
  control. Owner: magnitude session. *(Checked 2026-07-11: the
  occupation-geography v2 seal run did not bind them — reopen trigger not
  hit; row unchanged.)*

- [ ] **battery.js growth probes reference retired dials** (registered
  2026-07-11, occupation-geography stage-① doc-sync). The
  `mockup/combat-calc/battery.js` WORLD-2/A-3 growth probes reference the
  dials retired by ADR 0032 (realm accumulator / flat capPerSector) —
  silent no-ops if re-run. Historical L1 rig; cleanup owed whenever
  battery.js is next touched.

- [ ] **Doc-governance promotion chain** (registered 2026-07-10, doc-audit
  session; sealed package, cold-review rider — gates must be owned rows, not
  a deferred-forever plan): (a) ~~P1 lint prototype~~ — **BUILT 2026-07-10**
  (TDD, 29 tests; `scripts/audit-lint.js`, `npm run lint:docs`; acceptance
  run on the live repo: 5 findings, all legitimate reports — 1 uncontrolled
  status word `candidate` @ Strike at half-crossing, 3 borderline numeric
  restatements for human ruling, 1 ledger-currency watch). (b) ~~/doc-audit
  skill codification~~ — **DONE 2026-07-10** (`.claude/skills/doc-audit/
  SKILL.md`, registered in doc-registry.json): codifies the S8 escalation
  ladder (Layer 0 `npm run lint:docs` script → Layer 1 targeted judgment
  or full HARVEST.md re-harvest, with the run-#2 cross-check-all-surfaces
  lesson folded in as an explicit step → Layer 2 git/claude-mem history)
  and ritual duty 7. Findings stay reports-only (S13) — no auto-rename/
  auto-register.
  (c) ~~hook promotion~~ — **DONE 2026-07-10** (`.claude/settings.json`,
  `scripts/hooks/write-lint.js` + `alias-inject.js`, `tests/hooks.test.js`
  15 tests, both hooks live-fire-tested via sentinel proof, not just piped):
  PostToolUse write-lint runs `npm run lint:docs` after Write/Edit on a
  governed doc path and injects findings as additionalContext, never
  blocking. UserPromptSubmit alias-inject flags an exact registered
  alias/구칭 match and injects a canonical-name note, also never blocking.
  Constraint resolutions: (a) exploration-exemption — both hooks are
  advisory-only, the fire/ignore judgment stays with the agent, never
  encoded as hook logic; (b) birthplace-구칭 exclusion — already satisfied
  structurally (checkHeaderDiff only scans DOMAIN_MAP+GLOSSARY, never
  docs/adr/* or RULINGS.md, so a correctly-historical old name never trips
  a finding) — no new code needed; (c) common-word scoping — exact,
  word-boundary matching only against the registered alias list (MIN_LEN
  guard + reuses `normalizeName` from audit-lint.js), verified "gold"
  never fires since it isn't a registered alias.
  (d) ~~audit run #2~~ — **DONE 2026-07-10**
  (`docs/audits/2026-07-10-audit-run-2.md`): baselines regenerated
  (222→221 terms, 107→118 registry rows), 1 genuine ruling-statement row
  dropped (2 of run #1's 3 "undetermined" rows were misclassified — they
  are real DOMAIN_MAP Tier-0 terms, restored with verdict null; the
  self-correction is recorded in the report), map-lore exemption narrowed
  to Ring-B-judging-only (not an inventory drop) with `HARVEST.md` amended
  to say so, 7 missing province-archetype-region aliases added, extended
  Ring A sweep of RULINGS/model docs/QUICKREF found no ghost-term drift,
  doc-registry reconciled (+11 rows for files created since run #1). Lint
  clean, suite 207/207. This session's edits are themselves the natural
  session-close `lint:docs` run gate (b)/(c) were waiting on.
  (e) smaller residues: ~~gold→treasury prose leak (SPEC:264)~~ — **fixed
  2026-07-10**, rewritten to "treasury yield"; ADR 0013:33 checked and is a
  false positive (`gold` names a map-legend color, not the resource — no
  change). Remaining residues: code-identifier drift actionCapacity↔
  `capacity`, computeProvinceStatus↔`classifyHex` (fold into the owed
  js/situation.js rework); `Estimate band` weak birthplace now homed at fog
  GLOSSARY (created 2026-07-10).

- [ ] **A-3 magnitude pass must ingest the L2 freeze evidence**
  (registered 2026-07-07, sheet-15 session): cap-growth-alone does not
  unfreeze the parity map (22→24% decided; on the asymmetric fixture
  it had looked sufficient) — the "national cap growth = ending
  mechanism" numbers (ruling ⑮, deferred to A-3) must be cut against
  the frozen-world autopsy in `mockup/combat-calc/NOTES.md`
  (2026-07-07 entry), alongside the blinds design outcome.

- [ ] **Term lifecycle beyond promotion** (Codex P1): define
  proposed → agreed → promoted → renamed → deprecated states in the
  Vocabulary Law; renames are the dangerous case for agents. Add an
  alias field (Korean casual phrases, code identifiers) to glossary
  schema (Codex P2).
- [ ] **Model-doc naming unification + promotion ladders to root**
  (registered 2026-07-05, A-4 B1 discussion): the bespoke per-feature
  model-doc names (MAGNITUDE / FORMULA / MATCHUP / CATALOG /
  STRATEGY-SPACE) are one function ("model/dials doc") under five
  names — a latent proliferation cost. Decide a disciplined convention,
  then give the model layer an explicit birthplace→root promotion
  ladder (model docs → DESIGN) symmetric with GLOSSARY→DOMAIN_MAP and
  RULINGS→ADR, so all three Production tiers connect to root the same
  way. NOT A-4 B1 scope; a deliberate separate pass (user-flagged).

## Deferred (user-decided 2026-07-06, A-4 B6 — revisit on trigger)

- [ ] **`npm run docs:check` lint** (Codex P2, optional tooling):
  grep-level checks — "amended" references without ADR stamp, quickref
  older than newest seal date, duplicate term headers. **User deferred:
  no generator yet; adopt when a misfile actually slips (YAGNI).**
- [ ] **Working-layer sublabels** (Codex P2): distinguish staging
  verdicts / generated digests / planning scratch / risk register
  inside the Working layer. **User deferred: no misfiling observed —
  revisit if it occurs (emergence-limit).**

## Paid

- [x] 2026-07-14 — **SPEC B2 amendment — PAID** (user approved same day).
  "A war is decided when the loser's capacity or will to resist breaks"
  composite applied at SPEC:147 with the ADR 0038 pointer; registered and
  paid within the slice-2 batch.

- [x] 2026-07-13 — **Decisive-battle spine vocabulary seal — PAID**
  (registered 2026-07-13, deferred until the slice was built & sealed).
  Slice 1 sealed at war-model-build `RULINGS.md` WM-① (same-session
  doc-sync batch, this commit): 방패 깨기 / 결전 ❓PROPOSED→AGREED,
  캐스케이드→연쇄 붕괴 rename (구칭 alias), 야전군 registered AGREED —
  birthplace match-arc GLOSSARY + term-inventory patch + QUICKREF
  regeneration.
- [x] 2026-07-12 — **Rebellion-body grill branch — PAID** (registered
  2026-07-11, CE-⑫ rider). The pass ran 2026-07-11/12 night and sealed
  the full body: suppression resolution (CE-⑬), rebellion five points
  (CE-⑭), seceded-sector behavior (CE-⑮), gate-5 terrain resonance
  resolved by structure (CE-⑯), peaceful-cession scar dissolved as a
  corollary (CE-⑰) — plus the unplanned canonization the grill forced:
  truce lock (CE-⑱), white peace as the ladder's 0% rung (CE-⑲), and
  the total-war stage-table shape (CE-⑳). ADR 0036; SPEC_GAPS ⑤/⑦
  stamped RESOLVED. Same-session doc-sync batch (this commit).
- [x] 2026-07-11 — **Crisis-ending SPEC amendment — user-sealed and
  applied** (registered under ADR 0034, drafted by the crisis-ending
  pass as `SPEC-AMENDMENT-DRAFT-crisis-ending.md`). User decision
  2026-07-11 (verbatim seal): the match-end declaration (decision point
  / crisis arc 25→35 / Westphalian draw <0.1%, no judged scorecard)
  applied to `SPEC.md` § "How a match ends (crisis arc)". Draft file
  restamped SEALED (drafting record); ADR 0035 Consequences updated.
- [x] 2026-07-11 — **Record-world harness default flip** (registered
  2026-07-11, AB-②) — `tournament.js` HARNESS.capLandFrac 0→1;
  `map-board.js` factory + cradle-tournament default gaan →
  FG_BOARD_GAAN (BOARD_GAAN survives as the explicit control world).
  Test adjudication (TDD, no silent updates): new AB-② seal-pin test;
  FG "default stays uniform walls" pin inverted; map-board fortAt pin
  re-cut to the FG crossing-class mapping; occ-geo frac-0 control tests
  given explicit `capLandFrac: 0`; tournament-board finalCheck pin
  corrected to the actual trip gate `(leadership || dominance) &&
  unassailable` (the old `leadership && unassailable` assertion was a
  world-specific accident — the record world trips seed 7 through the
  dominance arm). 248/248 green. Verified: a pure-default run (reps 20,
  seed 42) byte-reproduces the sealed [frac1] fgM9on baseline row
  (decided 67.8 · dd 98 · afford 20.4 · median 22 · stomp 2.2).
- [x] 2026-07-11 — **freeze-autopsy.js hand-rolled checkView replica**
  (registered 2026-07-11) — replica deleted, real `tournament.js`
  checkView export imported; script smoke-run verified (--quick).
- [x] 2026-07-11 — **Occupation-geography pass — deferred doc-sync batch —
  PAID** (stage-① doc-sync batch). Stage ① landed on main
  (2a9d8f3..9a64561, 238/238) and the v2 seal run measured; this batch
  paid: (1) match-arc RULINGS **OG-①…⑤** (occupation model, transfer
  channels + R2 conservation, interior redefinition R1, per-sector
  ripening migration + accumulator supersession, measured `capLandFrac`
  read — **0 sealed as the world of record**, L2) + **ADR 0032**
  (cross-feature model record); (2) **ADR 0029 sealed AS DRAFTED** (user,
  2026-07-11) + ADR 0022 header stamp + the DOMAIN_MAP/GLOSSARY
  Settlement-line reword; (3) SPEC Core Design Principle **#9** promotion
  (user-approved 2026-07-11, wording = design spec §2, carried by ADR
  0032); (4) match-arc INDEX refresh + QUICKREF regen + term-inventory
  patches (+9 rows). What remains OPEN (tracked at its home, not this
  row): **dominance-gate recalibration grill** (data ready — wall
  re-erection + fgM9on absorption, match-arc INDEX open q.1); **capital
  stage ②** (`docs/features/capital/`, untouched); item (5)
  development-lever reconsideration — folded into that future
  gate/§5-tuning session. Original registration 2026-07-11,
  occupation-geography design session.
- [x] 2026-07-10 — **Force-geography pass — the next spine — PAID** (lint
  run #1 flagged this row as overtaken; verified): (a) harness = FG-①…⑩
  landed on main @0e8dc52 with terrain-bound defense + reactive reserve;
  (b) the "may need a large ADR" question = ADR 0031 (backfilled
  2026-07-10) + the hegemony-bar answer measured via DT-③/fgM9off.
  Live residuals continue in their own rows (§5 tuning watch-item, DT-①
  envelope target). Original row kept below for history:
  (registered 2026-07-08,
  match-tilting close; source RULINGS MT-⑤ + `mockup/combat-calc/NOTES.md`
  §L2 fidelity audit). L2 diagnosed the frozen world as NON-economic; the
  next design pass is force-geography. Two things owed there, not now:
  (a) **harness**: replace uniform `startFort: 'walls'` (an artifact — map
  carries `fortTier: none`, hex terrain plains/hills/mtn/pass unused) with
  terrain-bound defense strength, both start placement AND in-match fort-
  build rules, so L2 measures the real terrain (user direction 2026-07-08);
  (b) **design**: the ~80% structural residual = the hegemony-bar / offense-
  defense-balance question — is leadership reachable among balanced realms
  on a parity map? May need a large ADR. Grill-worthy, fresh session.
  **UPDATE 2026-07-08 (terrain-fidelity session)** — the pass split. The
  fort sweep found fort strength is NOT the freeze lever (all-none 20% vs
  all-walls 10.2%; ceiling ~20%, 80% structural holds); force-geography-
  fort-by-class is therefore a *balance* lever (dormant opt-in
  `gaan.startFortByClass`), not the fidelity fix. The real fidelity fix
  (approved + **wired** this session): **combat terrain = border INTENT
  class** — open→plains, forest→forest, hills→hills, pass→pass(2.0),
  river→water riverOpposed 0.70, strait→water straitOpposed 0.55 + door
  choke (`combatFromBorderClass` in tournament.js; `frontClass`/`frontDoor`
  weakest-link in map-board.js; +5 tests, 116 green). Values sealed
  (terrain M5/D6, water ADR-0015 + ruling ⑦); binding is the approved
  decision. Also fixed: strait grammar now fires on the class (was hermit-
  gated → dead on cradle); `engine.js` straitOpposed comment synced
  (candidate→confirmed). Freeze re-measured on the un-flattened map ~12.6%
  decided, leadShortfall ~4600 — verdict holds. **Doc-sync PAID 2026-07-08
  (terrain-fidelity session, this integration batch)**: (i) border-class→
  combat seal recorded — RULINGS **TC-⑬** + terrain-cradle GLOSSARY row
  (values cite M5/ADR-0015, not restated); (ii) QUICKREF — item ② already
  regenerated it this day, so this batch adds only the TC-⑬ line + two
  C-loop rows + header addendum (no double-regen); (iii) NOTES gained the
  residual-freeze autopsy entry (`freeze-autopsy.js` committed alongside).
  **Design reframe RESOLVED 2026-07-08**: the tactical plan-AI suspect was
  built + battered (item ②, commits 7508b3a/162c158) and absorbed only
  **+0.8pp** (12.6→13.4%) — the freeze is NOT a bot artifact. The residual
  autopsy (this session) pins item (b) as the **hegemony ADR**: the
  leadership gate (own projection ≥ 1.7× the max live rival's shield) acts
  like last-man-standing — consolidation plateaus ~1.28, elim ~0, so the
  board freezes at parity. Terrain and tactics are both excluded by
  measurement. **Next = hegemony ADR grill** (SPEC-level victory condition
  — user-gated); knobs: shieldRatio, leadership shape, anti-snowball
  exposure-inheritance, consolidation strength. This force-geography Open
  item can close once that grill opens its own thread.
  **UPDATE 2026-07-08 (hegemony grill opened this thread).** The grill ran:
  (1) built the **ending-taxonomy panel** to classify the freeze bar-
  independently — sealed **ET-①** (match-arc RULINGS), committed `c082247` +
  doc-sync `926e1a9`. First finding: the ~87% timeout is ~56% standoff /
  **~28% denied-dominant** (dominant realms the check missed — statistically
  "hegemons the gate missed") / ~11% hegemon, plus a **crown inversion**
  (center pinned to standoffs, flanks dominate — evidence bearing on TC-②,
  not a rewrite). (2) Decomposed the fix into a **three-concept sequence**,
  user-sequenced: **(b) force-geography** (make defense uneven — IN DESIGN,
  see `.context/handoff-2026-07-08-force-geography-design.md`; skeleton
  approved: redistribution-not-growth "이불 한 장" principle, 5 units, U3+U5
  settled, U1/U2/U4 pending) → **(a) offense-dominance gate** (reshape
  leadership: `proj ≥ R×meanProj`; user's raw `proj≥1.7×meanShield` trips 0%
  = cross-axis magnitude bug; corrected R=2.0 → ~39% decided/79% wall fixed/
  7% leakage; SPEC-level, user-gated) → **(c) risk-gate + offense buff**
  (reward the risk-taker not the free-rider; needs blood to flow). **(a) and
  (c) are DEBT — each its own brainstorm→spec cycle, after (b).** Force-
  geography (b)'s harness item (this Open row's item a) is now the active
  design; it stays Open until (b) ships.
  **UPDATE 2026-07-09 (force-geography (b) design grill — v1 SEALED).**
  The (b) design ran the brainstorming flow; v1 **(최소)** design sealed in
  the new feature birthplace `docs/features/force-geography/` (INDEX +
  RULINGS **FG-①…⑨**). Key seals: **U1** = adopt the measured fort-by-class
  mapping (FG-②, L2 +33% — the "ceiling vs cost" question was re-litigation
  of an already-measured, dormant mapping); weak fronts come from
  **scarcity + value, NOT a defensibility-concentration policy** (FG-③,
  corrects the skeleton — a rational defender equalizes defense *power*,
  more bodies on weak terrain; and the bot RE-EQUALIZES, so differentiation
  alone is not durable, scarcity is); the **reactive mobile reserve is
  in-scope** (FG-④ — passive-defender measurement can only falsify not
  confirm, and that falsifier is exhausted) — reactive, first-blow vs raw
  defense, sealed **M9** wired into the (passive-today) defender,
  destination `deficit × value` reusing ADR 0019 (G8), whole-realm value
  for v1 with per-front (a) deferred (FG-⑤/⑥); attacker info = the sealed
  fog **estimate-range band** (derived, not chosen), band-weighting OPEN →
  U4 (FG-⑦); **commit-scarcity kept OFF** (FG-⑧, dormant `siege 8/field 14`
  = a third latent scarcity axis, off for scope); **sequencing** v1=(최소) /
  (정교) static standing-redistribution = deferred delta detailed after
  (최소) L2 data, measure minimal→sophisticated (FG-⑨). U3/U5 settled.
  **UPDATE 2026-07-09 (design continued — v1 DESIGN COMPLETE).** The
  session ran on and closed the last forks: **U4 SEALED FG-⑦** (band-
  weighting reuses the sealed disposition dial TP②, no new dial; pickTarget
  scores facing-front first-blow defense = judged garrison(λ) × public
  terrain × public fort); **reserve mass SEALED FG-⑩** = field-army
  operational counter + M9 tactical fill (BOTH, M9 swept — field-army-only
  rejected as a tactical-scale strawman per ladder rule 4). Design of v1
  (최소) is now COMPLETE (FG-①…⑩). **STILL OPEN**: (정교) standing-
  redistribution detail (after (최소) L2 data), plan-time scoping (M9
  abstraction cost — board has no sector routing; field-army late-arrival
  effectiveness), then the harness build. Next = **writing-plans**.
  (a)/(c) remain DEBT. Row stays Open until (b) ships.
  **UPDATE 2026-07-09 (v1 (최소) L2 HARNESS LANDED — SDD, main @ 0e8dc52).**
  Plan `docs/superpowers/plans/2026-07-09-force-geography-minimal.md`
  executed via subagent-driven-development: 7 TDD tasks + 2 review-fix
  waves + housekeeping, 159/159, whole-branch review (opus) = merge-ready,
  fast-forwarded to main. FG-①…⑩ wired opt-in (`FG_BOARD_GAAN`); engine/
  `DIALS`/`BOARD_GAAN` untouched, non-FG behavior byte-identical. Outcome +
  metric amendment recorded at the birthplace: `docs/features/force-
  geography/RULINGS.md` "L2 implementation + metric amendment".
  **STILL OWED (keeps this row Open):** (i) **high-reps measurement run**
  (the `--fg` sweep was smoke-tested at reps=2 only — plumbing, not a
  reading); headline read = **decided% + bucket deltas** across ctrl/
  fgM9on/fgM9off (within-realm variance + boostedShieldShare demoted to
  descriptive — they conflate garrison/terrain with the fort tier, user
  ruling 2026-07-09). (ii) **Projection sync** — DOMAIN_MAP/DESIGN summary
  entries for force-geography, owed when (b) is read as shipped. (iii)
  **note the non-FG battery baseline shift**: Task 4 changed field-army
  selection (biggest-field → biggest-**deficit**) UNCONDITIONALLY (intended
  per FG-⑥), so the existing plan-AI battery on `BOARD_GAAN` is no longer
  directly comparable to pre-branch numbers — record in the DOMAIN_MAP/
  DESIGN sync so the shift isn't misread as noise.
- [x] 2026-07-09 — **§6 domination victory — SPEC.md Direction amendment**
  — the win-type declaration owed by DT-③'s implementation landing, written
  to `SPEC.md` (new paragraph after the "Resolved (match-arc pass,
  2026-07-04)" block, principle #5 anchor): a summary + pointer to match-arc
  `RULINGS.md` DT-③ (birthplace stays authoritative; no arithmetic restated
  in SPEC per the single-definition rule). User-approved wording, 2026-07-09.
- [x] 2026-07-08 — **Ending-taxonomy pass → Production sync (ET-①)** —
  the hegemony grill's measurement-taxonomy design (grill Q1–Q4,
  user-sealed) written to its authoritative homes: match-arc RULINGS
  **ET-①** (the decision record — ruler B bar-independent, 8-metric
  panel, vassals fold full, provisional thresholds, first finding);
  match-arc GLOSSARY **종료 분류** row (definition + pointer to ET-①);
  INDEX refreshed (ending-taxonomy pass block + RULINGS range); QUICKREF
  header addendum + C-loop row (finding as UNSEALED evidence). Instrument
  itself committed c082247 (match.js/tournament.js/plan-battery.js +
  tests, 148 green). No DOMAIN_MAP change — feature-local, birthplace
  stays authoritative (promotes only if a second feature needs it). The
  crown-inversion finding is recorded as **evidence bearing on TC-②**,
  never a rewrite (TC-② is a user seal). Residual: threshold calibration
  + the wall/crown grill are live work, not doc debt.
- [x] 2026-07-07 — **Match-tilting seals → Production sync (birthplace
  batch)** — the session's NOTES-staged seals written to their
  authoritative homes so no session reads stale canon: match-arc
  RULINGS **MT-①…④** (aging constitution / register re-founding /
  Surge Draft Model / start-state coordinates — the decision record);
  match-arc GLOSSARY rows (모병 re-cut, 징집 명부 re-founded, +노화
  헌법 / 동원 강도 / 서지 모병 as new Tier-1 terms); combat-formula
  MAGNITUDE **M13 amended + M13a added** (registerPerPop 1,800,
  capPerPop derived ⅓, Surge Draft Model, f₀0.5/g₀1.0/ρ0.75) +
  **M12 amendment stamp** (garrison regen bills the register);
  DOMAIN_MAP (모병/징집 명부 rows re-cut as summary+pointer + 노화
  헌법 Design-Principle entry); QUICKREF rows re-pointed to birthplace.
  Residual (ADR 0014 stamp, curve numbers, riders) split to the Open
  row above.
- [x] 2026-07-08 — **Recovery-dial + blinds phase → Production sync
  (MT-⑤)** — the recovery-dial/blinds phase reached L2 wire-first and
  reversed the premise (freeze non-economic). Paid this batch: ADR 0027
  written + 0020 stamped + README index (main/surplus = magnitude
  labels, commit-gated force-shaping); match-arc RULINGS **MT-⑤** (full
  L2 record — recovery-gate +3pp, Q1 reversal, Option B inert, fidelity
  audit, freeze decomposed to force-geography + hegemony-bar);
  MAGNITUDE **M12-1 commit-gate amendment stamp**; GLOSSARY 블라인드 row
  SUPERSEDED-as-economic-device; DOMAIN_MAP `Command pool` floating-label
  framing; INDEX refreshed (economy phase closed). Residual (ADR 0014
  stamp, QUICKREF regen) → Open row above; force-geography = next spine
  (Open).
- [x] 2026-07-07 — **SPEC 중원-crown amendment (TC-②) APPLIED,
  user-approved** — SPEC §Match structure re-cut: survivability +
  starting-population parity balanced, geometry/economy asymmetry;
  crown economic only (traffic centrality + long-war stamina, never a
  population edge); center-protagonist stated as measured hypothesis
  with the stable-digestion premium framing. Proposed and approved in
  the 2026-07-07 doc-sync session (propose-never-drift honored).
- [x] 2026-07-07 — **Terrain-cradle → Projection sync (C-loop close
  doc-sync batch)** — DOMAIN_MAP gained a `Terrain Cradle (Authored
  Map)` section (summary + pointer, sync-stamped) promoting void
  terrain / parity start / battle-summoning placement; the Match
  structure parity row re-cut from "mass asymmetry, richer center" to
  parity-v5 wording (TC-①/②) with a supersession note; DESIGN
  §Map Representation Strategy gained the authored-map pipeline
  subsection (map-gen.js determinism, C-loop rhythm, carve principle);
  QUICKREF regenerated (Realm row + 3 promoted-term rows + header
  date). Definitions stay authoritative in
  `docs/features/terrain-cradle/` (single-definition rule). SPEC
  remainder split into its own Open row above.
- [x] 2026-07-06 — **L-level seal-stamp convention ADOPTED (Codex P2,
  A-4 B6)** — the optional validation-level stamp (L0 hand / L1 grid /
  L2 tournament / L3 playtest) codified into
  `.claude/rules/documentation-law.md` § seal mechanics: seals MAY carry
  an L-stamp; applied going forward, retrofit optional, not a fourth
  mandatory field. The other two Codex P2s (`docs:check` lint,
  Working-layer sublabels) were user-deferred — see Deferred above.
- [x] 2026-07-06 — **Economy-legibility surface relocated (A-4 B6)** —
  moved from a doc-sync debt to `docs/DISPLAY-DEBT.md` (the display-debt
  register), where the whole UI-read family now parks. Design deferred
  to B's UI work.

- [x] 2026-07-06 — **ADR header normalization sweep (Codex P1, A-4 B5)**
  — amendment-carrying ADR headers normalized to the law's structured
  fields: 0014 (`Amended by: ADR 0022 (2026-07-01)` + delta), 0015
  (self-amendment stamp for the 2026-07-03 magnitude pass), 0018
  (`Amended by: ADR 0020` + delta), 0020 (`Amends: ADR 0018` + delta).
  Status index table added to `docs/adr/README.md` (26 rows) with a
  pointer to the documentation-law supersession protocol; plain-Accepted
  ADRs carry no relationship field (index is their normalization
  surface — anti-noise reading). *ADR 0019 v5 front-sector amendment is
  a SEPARATE decision (a4-plan B5), user-gated — not part of this line.*
- [x] 2026-07-06 — **Sheet-12 spec gaps → canon (A-4 B4)** — the 7 open
  `mockup/combat-calc/tournament.js` §SPEC_GAPS given a canon home:
  disposition record in `docs/features/match-arc/RULINGS.md` §SPEC_GAPS
  disposition routes each to owning feature + B-design phase + harness
  candidate + recommended lean. All seven defer to B (AI-behavior /
  force-allocation / map-topology — playtest- and B-map-shaped; no paper
  rules authored, per the handoff over-authoring warning). GLOSSARY
  queue-8 and combat-formula INDEX Honest Gaps point to it. Indemnity
  spend (the 8th) was already paid by M14 treasury. Gap ③ (attacking a
  vassal) carries an identity choice surfaced to the user; the rest are
  structural/disposition closes.
- [x] 2026-07-05 — **DOMAIN_MAP slimming (Codex P1)** — Match Arc
  section entries (패권 결정점, 투사 가능 질량, 수락 산술, 복속) cut from
  duplicated mini-spec (sealed numbers, riders, dates) to qualitative
  definition + pointer to the feature GLOSSARY/RULINGS, matching the
  Combat Resolution section's existing discipline. Added the 5 missing
  promoted terms (긴급 투입/예비대, 동원 가시성, 항복 수확, 양동 후속타,
  기축통화 원칙). Sync metadata added at SECTION granularity (not
  per-entry — always-load/maintenance economy; flagged for review).
  A-4 batch B2. *Note: exposed a law-wording tension (single-definition
  rule "Tier 0 after promotion" vs DOMAIN_MAP-as-Projection-summary) —
  see A-4 plan law-gap log.*
- [x] 2026-07-05 — **glossary row splitting (Codex P1)** — match-arc
  GLOSSARY rows cut to definition + current value + seal stamp;
  ruling history (⑧–⑰) relocated to `docs/features/match-arc/
  RULINGS.md`. combat-formula GLOSSARY gained a Status column
  (AGREED / 가안 / candidate). A-4 batch B1.
- [x] 2026-07-05 — **seal registry DECIDED (user): no `docs/SEALS.md`**
  — this ledger + dated in-doc seal stamps remain the mechanism.
- [x] 2026-07-05 — law dial-ownership claim corrected (match-arc values
  acknowledged in GLOSSARY seal rows, not MAGNITUDE).
- [x] 2026-07-05 — mechanical seal definition added to the law
  (status word + date + verdict source).
- [x] 2026-07-05 — QUICKREF trust level made honest (agent-curated
  digest, no generator; dated header).
- [x] 2026-07-05 — this ledger created (Codex fix 2).
