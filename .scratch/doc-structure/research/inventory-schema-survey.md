# Term Inventory Schema Survey — schema archaeology

Survey date: 2026-07-15 — snapshot; verify line numbers against the live tree before acting.

All findings verified programmatically against the files.

---

## A. `term-inventory.json` schema

**Envelope:** `{ "regenerated": "2026-07-10", "auditRun": 2, "terms": [...] }`
**Total terms: 260.** Every row has all 11 fields present (no optional-key sparsity — nulls are explicit).

| field | type | null | value domain |
|---|---|---|---|
| `canonical` | str | 0 | free text; **strict unique key** (0 collisions, case-insensitive) |
| `korean` | str\|null | 91 | 한국어 표시어; 169 present, all distinct |
| `aliases` | list[str] | 0 (172 empty) | len 0–12 (0:172, 1:49, 2:25, 3:4, 4:4, 5:1, 6:3, 7:1, 12:1) |
| `birthplace` | str | 0 | doc path, 17 distinct |
| `tier` | int | 0 | `0` (83) / `1` (177) |
| `status` | str | 0 | 7 distinct (below) |
| `kind` | str | 0 | 5 distinct (below) |
| `codeIdentifier` | str\|null | 180 | 80 present, e.g. `capPerPop`, `computeProvinceStatus`, `LEAK_RATIO` |
| `codeRefs` | list[str] | 0 (235 empty) | js/ paths; only **25** rows non-empty |
| `verdict` | str\|null | 39 | 4 values (below) |
| `verdictRef` | str\|null | 39 | 3 values: `2026-07-10-terminology-audit.md` (219), `docs/features/capital/RULINGS.md#CP-1` (2), null (39) |

**Distributions**

- **status (7):** `AGREED` 235 · `PROPOSED` 10 · `SEALED` 10 · `AGREED-concept` 2 · `AGREED-structure` 1 · `가안` 1 · `SUPERSEDED` 1
- **tier (2):** `1` 177 · `0` 83
- **kind (5):** `mechanism` 207 · `meta` 48 · `mechanic` 2 · `state` 2 · `strategy` 1 — *(`mechanic`/`state`/`strategy` are drift; HARVEST §4 defines the domain as exactly `mechanism` | `meta`)*
- **verdict (4+null):** `justified-coinage` 97 · `standard-match` 70 · `synonym-exists` 52 · `standard-term` 2 · null 39
- **birthplace (17):** `DOMAIN_MAP.md` 80 · `match-arc/GLOSSARY.md` 75 · `combat-formula/GLOSSARY.md` 23 · `terrain-cradle/GLOSSARY.md` 17 · `operation-plan-catalog/CATALOG.md` 14 · `combat-formula/MAGNITUDE.md` 9 · `force-geography/RULINGS.md` 9 · `war-model-build/GLOSSARY.md` 9 · `match-arc/STRATEGY-SPACE.md` 6 · `tactical-plan-ai/GLOSSARY.md` 5 · `adr/0019-…md` 3 · `combat-formula/MATCHUP.md` 3 · `fog-of-war-discovery/GLOSSARY.md` 2 · `capital/GLOSSARY.md` 2 · `match-arc/RULINGS.md` 1 · `match-arc/TEST-LADDER.md` 1 · `tactical-plan-ai/RULINGS.md` 1

**tier is not an independent field — it is a pure function of `birthplace`.** tier=1 ∧ birthplace=DOMAIN_MAP.md: **0 rows**. tier=0 ∧ birthplace≠DOMAIN_MAP.md: exactly **3 rows**, all ADR-0019-born (`Posture as annotation lens`, `Leak-through`, `Reachable-weakest-link`) — the registration-gap rows HARVEST.md's closing paragraph flags by name.

## B. How the schema encodes the Vocabulary Law

**Birthplace/tier — encoded, correctly, as the primary key of authority.** `birthplace` is the single-definition-rule pointer; `tier` restates it (0 ⟺ DOMAIN_MAP is birthplace, per HARVEST step 3).

**Status dictionary — partially encoded, leaking.** The law fixes `AGREED/PROPOSED/rejected-recorded ≡ ✅/❓/⛔`. The file honours the first two (245/260) but carries five off-dictionary values (`SEALED` ×10, all force-geography/match-arc RULINGS-born; `AGREED-concept` ×2 capital; `AGREED-structure` ×1; `가안` ×1 Frontage; `SUPERSEDED` ×1 Blinds — the last matching DOMAIN_MAP but not the dictionary). **`rejected-recorded` / ⛔ has zero rows** — the rejection tier of the dictionary is unpopulated.

**Aliases / 구칭 — the 구칭 marker is destroyed on ingest.** `grep 구칭` over the whole JSON returns **0 hits**, while the birthplace GLOSSARYs carry it inside the header string (`Impassable terrain (공백 지형 · 구칭 void terrain)`). `aliases` is an untyped grab-bag holding at least seven distinct relations with no discriminator: old names (`"Void terrain"`), Korean 구칭 (`"인력 풀"`), retired names — *with the status smuggled into the string itself*: `"dissonance (retired)"` — enum members (`secure`,`threatened`,…), instances (12 region names), code identifiers (`forceShare`,`HHI`,…), ladder rungs (`관대`,`표준`,`최대`), formula shorthand (`"W = 6"`), and cross-doc refs (`"SPEC Core Principle #8"`).

**Promotion (Tier-1 → Tier-0) — not representable.** QUICKREF declares three terms promoted to DOMAIN_MAP in the 2026-07-07 batch; DOMAIN_MAP.md carries the ✅ entries (lines 454/458/468). All three remain **tier=1** in the inventory:

```
Impassable terrain           tier=1  birthplace=docs/features/terrain-cradle/GLOSSARY.md
Parity start                 tier=1  birthplace=docs/features/terrain-cradle/GLOSSARY.md
Battle-summoning placement   tier=1  birthplace=docs/features/terrain-cradle/GLOSSARY.md
```

This is *consistent with the law* (promotion adds a Tier-0 summary+pointer; the feature doc stays authoritative) but means the schema has **no field for "has a promoted Tier-0 summary entry"** — a promoted term and an unpromoted one are byte-indistinguishable. Promotion state lives only in prose addenda in QUICKREF.

**Verbatim rows:**

```json
{"canonical": "Emergent asymmetry", "korean": "파생 비대칭", "aliases": ["Derived asymmetry", "SPEC Core Principle #8"], "birthplace": "docs/features/terrain-cradle/GLOSSARY.md", "tier": 1, "status": "AGREED", "kind": "meta", "codeIdentifier": null, "codeRefs": [], "verdict": "standard-match", "verdictRef": "2026-07-10-terminology-audit.md"}
```
```json
{"canonical": "Conscription register", "korean": "징집 명부", "aliases": ["인력 풀", "manpower pool"], "birthplace": "docs/features/match-arc/GLOSSARY.md", "tier": 1, "status": "AGREED", "kind": "mechanism", "codeIdentifier": "registerPerPop", "codeRefs": [], "verdict": "synonym-exists", "verdictRef": "2026-07-10-terminology-audit.md"}
```
```json
{"canonical": "Leak-through", "korean": null, "aliases": ["dissonance (retired)", "부조화"], "birthplace": "docs/adr/0019-situation-judgment-structured-province-reading.md", "tier": 0, "status": "AGREED", "kind": "mechanism", "codeIdentifier": "LEAK_RATIO", "codeRefs": [], "verdict": "justified-coinage", "verdictRef": "2026-07-10-terminology-audit.md"}
```

## C. THE KEY QUESTION — polysemy

**No precedent exists. The schema cannot record a term with multiple senses.**

Exhaustive checks, all negative:

1. **No senses/homonym/scope field.** Grepping every row's full JSON for `sense|homonym|disambig|overload|polysem|meaning|context-|scoped` → **0 hits**. There is no `senses[]`, no `layer`, no `scope`, no `seeAlso`, no back-reference of any kind. The row is flat and single-valued.
2. **`canonical` is a hard unique key.** 260/260 distinct. Stripping parentheticals and re-testing for collisions: **NONE** — no word is registered twice under different qualifiers.
3. **No alias collides with any other row's `canonical`** (0 hits) — a word cannot be *reached* through two rows even accidentally.
4. **"spec"/"SPEC" is not registered at all.** Exactly one row in 260 contains the string, and only as a cross-reference inside an alias: `"SPEC Core Principle #8"` on `Emergent asymmetry`. Neither sense of "spec" is a term. Nor is it defined anywhere else in the term system: `grep '^| \`?SPEC'` over `DOMAIN_MAP.md` + all `docs/features/*/GLOSSARY.md` → **0 rows**, and `.claude/rules/documentation-law.md` never mentions `docs/superpowers/specs` at all (its only "superpowers" hit is the Working-layer taxonomy row).

**The nearest thing to disambiguation is a naming convention, not a schema feature.** 24 rows carry a parenthetical qualifier baked into the `canonical` string — `Standing (situation axis)` / `Standing forces` / `Standing world rule`; `R (combat ratio)`; `Dominance (victory condition)`; `Denied-dominant (the wall)`. These are *distinct terms that share a head word*, disambiguated by hand at naming time. Nothing links them, nothing records that the qualifier exists because of a collision, and no row says "this word also means X elsewhere." 28 such head-word families exist (`Reach`/`Reach cone`, `Fatigue`/`Fatigue ledger`, `Settlement`/`Settlement currencies`/`Settlement preset ladder`, `capital`/`capital guard`, …) — all handled as separate concepts, never as senses.

**Where the "spec" ambiguity *is* actually resolved: the other baseline, in the path dimension.** `doc-registry.json` cleanly separates both senses — but as *files*, with no bridge to the term layer:

```json
{"path": "SPEC.md", "layer": "direction", "role": "product direction; changes only by explicit user decision (proposal, never drift)", "ownerFeature": null, "allowedContent": ["direction","principles","scope"], "forbiddenContent": ["dial-values","feature-definitions"]}
```
```json
{"path": "docs/superpowers/specs/2026-07-10-doc-audit-and-forensics.md", "layer": "working", "role": "time-stamped spec/plan record; consult for context, not current truth", "ownerFeature": null, "allowedContent": [], "forbiddenContent": []}
```

21 registry entries carry the string "spec": 1 direction-layer `SPEC.md`, 20 working-layer `superpowers/{specs,plans}/*` sharing the identical `role` string *"time-stamped spec/plan record; consult for context, not current truth."* So the governance system **knows** the two senses and even states the authority inversion — but only as a property of paths. The word itself is unregistered, and the two baselines have no join key. Naming an overloaded word is exactly the gap between them.

## D. The maintenance model (HARVEST.md)

**Two modes, amended 2026-07-10 "after cold review":**

| | **Incremental (between audits)** | **Full re-harvest (at audit runs)** |
|---|---|---|
| trigger | a session seals a NEW term, renames one, or changes a status | a `/doc-audit` run |
| who | the sealing session, **in the same doc-sync batch** (= documentation-law session-close duty 7) | the audit run, re-executing HARVEST §1–6 from sources |
| scope | **one row, index fields only** | all rows; reconciles drift; re-judges |
| authority | **provisional until the next run confirms** | **the authority** |
| verdict fields | new/renamed rows get `verdict: null` → enter next audit's judging queue | step 6 **carries verdicts forward** for rows whose canonical name is unchanged — this is what stops accepted coinages being re-flagged every run |

Rationale stated in-file: without the incremental patch "the inventory lags and the lint false-positives on every newly sealed term."

**Fields hand-patchable vs regenerated-only:** the file says "index fields only" without enumerating them, and explicitly bans definition text and dial values ("single-definition rule applies to this file too"). The one field with an explicit machine rule is `verdict`/`verdictRef` — step 6 makes them carried-forward-or-null, i.e. **verdict is audit-owned, never hand-set**. The live data confirms both modes ran exactly as documented: **221 rows carry a verdict, 39 carry null — and 221 is precisely the "221 terms, audit run #2" figure QUICKREF cites.** The 39 nulls are the incremental patches accumulated since (occupation-geography, crisis-ending, war-model-build slice 1–2), sitting in the judging queue. `"regenerated": "2026-07-10"` / `"auditRun": 2` were correctly *not* bumped by the patches — but git shows the file last touched at `484496e` (2026-07-14), so the envelope date now understates the file by four days by design.

**On the honesty of the original claim — the file says it outright:**

> Maintenance model (amended 2026-07-10 after cold review — the original **"regenerated only, never hand-maintained" claim was fiction without committed tooling**)

and closes with the same candour: *"No committed generator script exists yet (run #1 used session-scoped tooling, now gone). This PROCEDURE document is the generator… Matching this procedure matters; matching any old script does not."* It further self-reports **known weak rows**: the 3 ADR-born birthplaces (a tension with the law's "ADRs never define" rule) and `Estimate band` (no clean birthplace, provisionally homed at fog-of-war RULINGS) — "both are registration-gap evidence, not clean data." §2 also records a self-correction at run #2: map-lore proper nouns keep their rows (dropping them would make `checkHeaderDiff` re-flag them), after "the literal reading nearly caused a self-inflicted lint regression."

## E. QUICKREF's role

`docs/GLOSSARY-QUICKREF.md` is the **agent-curated convenience digest** — one line per term (pair / short gloss / where the definition lives), manually regenerated at each seal batch from `DOMAIN_MAP.md` + `docs/features/*/GLOSSARY.md`, no generator script. Its header is a self-demotion: *"convenience surface only. Do not edit by hand, do not cite as a definition source; it may lag the canon"* — narrowed by the 2026-07-10 amendment to "covers only content older than the current session," with "Last regenerated: 2026-07-14" as the lint's freshness target. `가안` rows are marked UNSEALED; every row is a pointer.

**The C-loop translation table** (§ at line 360, marked *2026-07-07 — 가안, UNSEALED*) is its **extended role, adopted by user ruling**: this file doubles as the **user-audit surface**, a 3-column table mapping **the user's own design statements (verbatim, quoted Korean) → the dial/scale that implements them → the checking scale that validates it**. E.g. `"승리 문법은 지방마다 다르다"` → per-region win-grammar archetypes → checked by *L2 archetype spread*; `"심판의 모병 미래는 세계가 실제로 파는 것만 센다 — min(자리, 속도, 돈, 몸)"` → affordability bound on the unassailability futures credit → checked by *affordBindRate instrument*. It is the audit trail letting the user verify their intent survived translation into numbers. ~25 rows, mostly dated 2026-07-07 → 07-11.

**Relation to the inventory: none, mechanically — they are parallel derivations from the same sources with no join key.** Both are derived-from-birthplace; QUICKREF is prose for humans, the inventory is rows for the lint. They diverge and are allowed to: QUICKREF's addendum still cites *"221 terms, audit run #2"* while the inventory now holds **260**. QUICKREF is the human-audit surface; `term-inventory.json` is the machine index QUICKREF points at (line 102: *"Machine inventory of all terms: `docs/audits/term-inventory.json`"*). The law also names QUICKREF (가안/UNSEALED rows) as a **Ring A harvest source** for the inventory — so the dependency runs QUICKREF → inventory at audit time, and birthplace → both at seal time.

---

## Bottom line on C

The inventory is a **flat, single-sense, unique-key registry**. One canonical string = one concept = one birthplace = one authority. Every disambiguation in it (24 parentheticals) is a human naming decision frozen into the key at coinage time, with no record that a collision was the reason. **"spec" is unregistered, and the schema has no slot that could hold its two senses** — the two-sense structure exists only in `doc-registry.json`, keyed by path, unlinked to any term. Registering "spec" as a term would be the **first polysemous entry in the system**, and would require either a new field (`senses[]` / layer-scoped rows) or a naming-convention precedent extended past what any of the 260 rows currently do.

Additional schema debts observed: the 구칭 marker loss on ingest (aliases carry no relation type), promotion state unrepresentable (three promoted terms all tier=1, indistinguishable), five off-dictionary status values (`SEALED` ×10 et al.) with `rejected-recorded` unpopulated, and three off-domain `kind` values breaking dictionary routing.
