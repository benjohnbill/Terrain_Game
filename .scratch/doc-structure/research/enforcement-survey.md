# Enforcement Mechanism Survey — Terrain Game doc-governance

Survey date: 2026-07-15 — snapshot; verify line numbers against the live tree before acting.

**Verified surface:** `.claude/skills/doc-audit/SKILL.md` (77 L) · `scripts/audit-lint.js` (405 L) · `.claude/settings.json` (29 L) · `scripts/hooks/write-lint.js` (72 L) · `scripts/hooks/alias-inject.js` (122 L) · `package.json` · `.claude/rules/documentation-law.md`. **`.claude/settings.local.json` does not exist** (nor does `.claude/hooks/` — hooks live at `scripts/hooks/`). All six enforcement files are git-tracked.

**Live state:** `npm run lint:docs` → **1 finding** (`numericRestatement` / `Operation`). Tests: **44 pass / 0 fail** (`tests/audit-lint.test.js` 29 + `tests/hooks.test.js` 15).

All claims below are verified by execution, not inference.

---

## A. The escalation ladder (SKILL.md:18–66)

Confirmed. Three rungs, gated by "Always start at Layer 0. Only climb when Layer 0 leaves something unresolved" (SKILL.md:20–21).

| Rung | Trigger | Action | Decider |
|---|---|---|---|
| **Layer 0 — script, no LLM** (L23–30) | Session close touching governed docs; or the PostToolUse hook | `npm run lint:docs`. `0 findings` → **done; "this satisfies ritual duty 7 on its own"** (L29). Findings → Layer 1 | Script. No judgment |
| **Layer 1 — targeted judgment / periodic full re-harvest** (L32–58) | Any Layer-0 finding | **(a) Per-finding triage** — open flagged file/line, decide: fix doc / correct inventory row / record explained false positive; "never leave an unexplained red finding" (L39). **(b) Cross-check discipline (run-#2 lesson, L40–48)** — before dropping any inventory row, grep the term across *all* surfaces `checkHeaderDiff` scans, not just its stated `birthplace`; re-run lint after *every* inventory edit. **(c) Full re-harvest** — `docs/audits/HARVEST.md` Ring A verbatim; write dated `docs/audits/YYYY-MM-DD-audit-run-N.md` | Agent judges; **user seals**. Skill "never edits documentation-law, never applies a rename, never registers a new term without the user's sign-off" (L12–16) |
| **Layer 2 — history** (L60–66) | Only when Layer 1 can't resolve from current file content alone | `git log -p -- <file>` / `git blame`; claude-mem search for past-session rulings never written to a file. "Use sparingly" (L66) | Agent |

**Exit criterion** (L68–76): lint ends clean *or* every remaining finding is a verified, explained false positive; inventory patched same batch (index fields only); new-term/rename candidates **reported, never auto-applied**.

Governing constraint, stated three times across the package: findings are **"reports, never legislation"** (SKILL.md:12, audit-lint.js:3, write-lint.js:4) — cited as documentation-law S13, separation of powers.

---

## B. Every check `audit-lint.js` implements

**8 checks, 12 finding kinds.** Runner `runAll(root)` (L329–379) returns one object keyed by check name; CLI (L383–396) prints `[<checkKey>] N finding(s)` + `JSON.stringify(f)` per finding, exits **1** if total > 0, **0** if clean (`'audit-lint: clean (8 checks, 0 findings)'`).

**Finding-object shape:** there is **no uniform shape**. The only invariant is `kind`. Exact literals:

```js
{ kind: 'unregistered-definition', term, path, detail }              // L86-89
{ kind: 'orphaned-inventory-row', term, path, detail }               // L119-122
{ kind: 'code-contract-violation', term, identifier, detail }        // L140-143   (no path)
{ kind: 'status-marker-mismatch', term, marker, status, detail }     // L168-172
{ kind: 'numeric-restatement', term, detail }                        // L212-214   (no path)
{ kind: 'unstamped-adr-amendment', adr, path, detail }               // L240-243   (no term)
{ kind: 'ledger-possibly-paid', row, detail }                        // L268-270
{ kind: 'stale-quickref', detail }                                   // L283
{ kind: 'stale-quickref', regenerated, newestSeal, detail }          // L292-294
{ kind: 'missing-birthplace', term, path }                           // L307       (no detail)
{ kind: 'duplicate-canonical', term }                                // L310
{ kind: 'alias-canonical-collision', term, alias }                   // L317
{ kind: 'dead-registry-path', path }                                 // L322
```

| # | Runner key / fn | Detects | Reads | Emits |
|---|---|---|---|---|
| 1 | `headerDiff` / `checkHeaderDiff` (L73–126) | **(a)** definition-surface header matching no inventory row; **(b)** inventory row whose name is *entirely* absent from its birthplace surface | `term-inventory.json` + `DOMAIN_MAP.md` + all 7 `docs/features/*/GLOSSARY.md` | `unregistered-definition`, `orphaned-inventory-row` |
| 2 | `codeContract` / `checkCodeContract` (L130–148) | `codeIdentifier` absent from every file in `codeRefs` | inventory + all `js/*.js` | `code-contract-violation` |
| 3 | `statusMarkers` / `checkStatusMarkers` (L159–177) | DOMAIN_MAP `✅/❓/⛔` contradicting inventory `status` per `MARKER_OK` (L153–157: `✅`→`!== 'PROPOSED'`, `❓`→`=== 'PROPOSED'`, `⛔`→`/reject/i`) | inventory + `DOMAIN_MAP.md` | `status-marker-mismatch` |
| 4 | `numericRestatement` / `checkNumericRestatement` (L205–220) | DOMAIN_MAP row that **both** matches `POINTER_RE` **and** (after `NOISE_RE` strip) matches `DIAL_RE` | `DOMAIN_MAP.md` only | `numeric-restatement` |
| 5 (src-labeled "check 8") | `adrStampDuty` / `checkAdrStampDuty` (L226–249) | doc says `amends ADR NNNN` but that ADR's header (text before first `\n## `) lacks `Amended by:` | 7 GLOSSARYs + 7 RULINGS + `docs/adr/*` | `unstamped-adr-amendment` |
| 6 | `ledgerCurrency` / `checkLedgerCurrency` (L257–275) | Open SYNC-DEBT row (`OPEN_ROW_RE`, L255) whose ≥6-char title token appears in a commit subject dated after registration | `docs/SYNC-DEBT.md` + `git log --since=30.days --format=%as%x09%s` | `ledger-possibly-paid` |
| 7 | `freshness` / `checkFreshness` (L281–298) | QUICKREF missing `Last regenerated:`, or its date `<` newest date found in any glossary (ritual duty 4) | `docs/GLOSSARY-QUICKREF.md` + glossaries | `stale-quickref` |
| 8 (src-labeled "check 7") | `baselineSelf` / `checkBaselineSelf` (L302–325) | birthplace path missing on disk; duplicate canonical; alias colliding with a canonical; registry path missing on disk | inventory + `doc-registry.json` + fs | `missing-birthplace`, `duplicate-canonical`, `alias-canonical-collision`, `dead-registry-path` |

Source comment numbering is non-sequential (check 8 sits between 4 and 5 at L222) — cosmetic only.

The regexes doing the actual discrimination:

```js
const DM_ROW = /^- (✅|❓|⛔) `([^`]+)`/;                                            // L11
const POINTER_RE = /MAGNITUDE M\d+|GLOSSARY|RULINGS|ADR \d{4}/;                     // L183
const DIAL_RE = /\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?\s*(?:×|%|명|생산|per\b|turns?\b)|=\s*\d/;  // L185
const OPEN_ROW_RE = /^- \[ \] \*\*(.+?)\*\*.*?registered (\d{4}-\d{2}-\d{2})/;      // L255
```

The one live finding, verified against source: `DOMAIN_MAP.md:611` — `` - ❓ `Operation` (작전): a shield-break or siege arc, ~3–6 turns … (ADR 0026)`` → `POINTER_RE` hits `ADR 0026`, `DIAL_RE` hits `6 turns`. The adjacent `War` row (L614, `~8–12 turns`) does **not** fire — it carries no pointer. That asymmetry is the heuristic's design (L180–182), not a bug.

---

## C. The hooks

**Both hooks confirmed.** `.claude/settings.json` is the only project hook config; no `settings.local.json`. Global `~/.claude/settings.json` carries hooks (rtk, agentcat, notify, read-guard) but **none touch doc-governance** — no interaction.

### C1. PostToolUse write-lint — CONFIRMED

```json
{ "matcher": "Write|Edit",                                    // settings.json:5
  "command": "node scripts/hooks/write-lint.js",              // :9
  "timeout": 30, "statusMessage": "doc-audit: linting governed docs" }
```

Path gate (`write-lint.js:9`):
```js
const GOVERNED = /^(DOMAIN_MAP\.md|SPEC\.md|DESIGN\.md|docs\/.*|js\/.*\.js|\.claude\/rules\/documentation-law\.md)$/;
```

Flow: read stdin JSON → `data.tool_input?.file_path || data.tool_response?.filePath` (L35) → relativize against `cwd` (L11–14) → **return silently if not GOVERNED** (L38) → `execSync('npm run lint:docs')` (L43) → **exit 0 ⇒ return, no context** (L49) → else emit `hookSpecificOutput.additionalContext` prefixed `doc-audit (Layer 0, triggered by edit to <rel>)` plus the explicit instruction to "triage each with the doc-audit skill's Layer 1 cross-check discipline before acting" (L55–57).

The hook **is the wiring that connects the ladder to the edit loop**: it names Layer 0, hands off to Layer 1, and never decides. Non-blocking by construction — no `permissionDecision`, no non-zero exit; both `main()` and the top-level call are try/caught to swallow everything (L64–68: *"never let the hook itself break the tool call"*).

Note: it runs the **whole-repo** lint, not a file-scoped one — a finding surfaced may be unrelated to the edit that triggered it. `AGENTS.md`, `CLAUDE.md`, and `mockup/*/NOTES.md` are **not** in `GOVERNED`.

### C2. UserPromptSubmit alias-inject — CONFIRMED

```json
{ "hooks": [{ "command": "node scripts/hooks/alias-inject.js",  // settings.json:21
              "timeout": 10, "statusMessage": "doc-audit: checking term alignment" }] }
```
**No `matcher` key** — fires on *every* user prompt.

- **Source file:** `docs/audits/term-inventory.json` (L90; silent return if absent, L91). 260 terms; fields `canonical, korean, aliases, birthplace, tier, status, kind, codeIdentifier, codeRefs, verdict, verdictRef`.
- **Trigger condition:** prompt contains a whole-match of any registered `canonical` / `korean` / alias (incl. 구칭 old-canonical names). ASCII names match via lookaround word boundary `(?<![A-Za-z0-9])…(?![A-Za-z0-9])` case-insensitively; Korean/mixed falls back to `text.includes()` — "no reliable `\b`, substring is the practical match" (L21–29). Length floors `MIN_LEN = { ascii: 3, other: 2 }` (L15). Candidates sorted **longest-first** so a multi-word alias out-ranks its own substrings (L44), deduped by canonical (L48–49).
- **Suppression:** a hit whose `normalizeName(matched) === normalizeName(canonical)` is dropped — "already canonical, no note needed" (L52). Capped at `MAX_MATCHES = 3` (L14, L54).
- **What it injects** (L59–66):
```
conversational term alignment (documentation-law): registered alias(es) detected in this prompt:
"<matched>" -> canonical "<canonical>" (<korean>)
Exploration exemption applies — if this is brainstorming or a reference to history/an old doc, ignore.
If the statement is heading toward a seal, echo the canonical name once and continue with it.
```
- **Shared-definition discipline:** imports `normalizeName` from `scripts/audit-lint.js` (L100) — deliberate, per the header: *"so there is one definition of 'what counts as the same name,' not two drifting copies"* (L10–11).

The exploration-exemption judgment is **deliberately not mechanized** (L5–9): *"never decides whether alignment should actually fire… mechanization applies the law, it does not replace judgment."* Both hooks are advisory-only by design, and SYNC-DEBT:264–266 records this as an explicit constraint resolution.

---

## D. Automated vs manual

### Mechanically enforced (with real coverage caveats)

| Law duty | Mechanism | Actual coverage |
|---|---|---|
| Status dictionary `✅/❓/⛔ ≡ AGREED/PROPOSED/rejected` | `checkStatusMarkers` | **115 of 117** DOMAIN_MAP marker rows (measured — see E) |
| Single-definition rule (no dial restatement) | `checkNumericRestatement` | **DOMAIN_MAP.md only.** GLOSSARYs, INDEX, QUICKREF, Tier-2 unchecked |
| Ritual duty 4 — QUICKREF same-session freshness | `checkFreshness` | Date-max heuristic |
| Ritual duty 5 — seal-amends-ADR stamp | `checkAdrStampDuty` | Only the literal phrase `amends ADR NNNN` |
| Ritual duty 6 — SYNC-DEBT currency | `checkLedgerCurrency` | 30-day git window, ≥6-char token heuristic |
| Ritual duty 7 — inventory patch | `checkHeaderDiff` + `checkBaselineSelf` | Birthplace must be a scanned surface |
| Canonical ↔ code identifier naming | `checkCodeContract` | **24 of 260 rows** (see E) |
| Conversational term alignment (a)/(b), exact-match slice | `alias-inject` hook | Advisory injection only |

### Honor-system prose — no check exists

- **Layer taxonomy authority / write rules** — who may write what, where. **`doc-registry.json` encodes `layer`, `role`, `ownerFeature`, `allowedContent`, `forbiddenContent` for 119 files, and *nothing reads them*.** Verified by grep: `registry` is touched at exactly two lines — `L342` (parse) and `L321` (`for (const f of (registry.files || [])) if (!exists(f.path))`). Only `.path` is consumed. **The entire content-authority model of the registry is dead data.** This is the single largest gap between the law's ambition and its machinery.
- **ADR supersession protocol** — `grep -i supersed scripts/` → **zero hits**. `Status: Superseded by ADR-XXXX` is never verified. Only the *amendment* half is checked, and only via one phrasing.
- **Seal mechanics** (status word + date + verdict source triad) — not parsed anywhere.
- **Mandatory ADR trigger** (win condition / cross-feature model / SPEC change ⇒ ADR in same batch) — not checked.
- **SPEC direction protection**, **Sanctuary `docs/teach/` untouchability** — not checked.
- **Ritual duties 1 (NOTES→Production sync), 2 (doc-sync batch + promotion scan), 3 (INDEX refresh)** — fully honor-system. Duty 2's promotion scan is exactly the duty the law itself records as historically missed ("learned 2026-07-09").
- **Coinage duty** (`[조어]` tag + same-exchange Tier-1 registration), **intuitive-over-compact naming**, **Tier-2 never-define**, **L-stamp validation level**, **Tier1→Tier0 promotion** — none checked.

**Structural summary:** the machine enforces *index consistency* — inventory ↔ surfaces ↔ code ↔ dates. It does not enforce *authority* (who may write what) or *seal integrity* (whether a seal is a real seal). Those remain entirely with the agent and the user.

---

## E. Known limits

**Marked by the code itself:**
- `audit-lint.js:1` — `// Audit lint — P1 prototype (doc-governance package, 2026-07-10).` The only such marker in `scripts/`; **no TODO/FIXME/stub anywhere**.
- `L367` — `catch (e) { /* no git — ledger check runs empty */ }`: check 6 silently degrades to zero coverage without git.
- `L101–106` — orphan judgment scoped to scanned formal surfaces only; "model-doc- and ADR-born terms are out of mechanical scope here." Inline mentions suppress the finding — "low-noise by design."
- `L94–95` — bold sub-terms suppress orphans but never raise `unregistered-definition` ("bold is usually prose emphasis").
- `L237` — `if (!adr) continue; // missing ADR file is check-7 territory`. **This comment is wrong.** Check 7 (`checkBaselineSelf`) validates inventory birthplaces and registry paths only — it never validates ADR numbers cited in production docs. A doc citing a nonexistent ADR is **silently dropped by both checks**.

**Deferred in `docs/SYNC-DEBT.md`:**
- `:440–443` — **`npm run docs:check` lint** (Codex P2). User-deferred: *"no generator yet; adopt when a misfile actually slips (YAGNI)."*
- `:444–447` — **Working-layer sublabels** (Codex P2). User-deferred: *"no misfiling observed — revisit if it occurs (emergence-limit)."*
- `:286–290` — **Open residue (e): code-identifier drift** — `actionCapacity ↔ capacity`, `computeProvinceStatus ↔ classifyHex`, folded into the owed `js/situation.js` rework.
- `:243–290` — the promotion chain rows (a)–(d) are all closed; only (e) remains open.

**Unmarked limits verified by execution (not in any comment):**
1. **`checkStatusMarkers` uses a weaker lookup than every other check.** `L164` calls `index.get(h.term.toLowerCase())` instead of the module's own `lookup(index, raw)` (L66–69), bypassing `normalizeName`. Measured: **117 marker rows; 115 resolve raw; 117 resolve via `lookup()` → 2 rows silently skipped** — `Realm count 4–6 (authoring default 5)` and `In/out of the balance — hermit clause` (en-dash / em-dash-annotation cases `normalizeName` L41–42 is built to handle). Not a false positive — a **silent false negative**. One-line fix; no test covers it.
2. **`checkCodeContract` covers 24 of 260 terms.** `L133` skips any term lacking *either* `codeIdentifier` *or* a non-empty `codeRefs`. Measured: 80 terms carry `codeIdentifier`, but **56 of those 80 have empty `codeRefs` and are silently skipped** (`Map unit → mapUnit`, `Region value → regionValue`, `Front sector → frontSector`, `Sector value → sectorValue`, `controlWeight → controlWeight`, …). The code-contract guarantee is far narrower than the SYNC-DEBT (e) row implies.
3. **`checkFreshness` takes the max of *every* `\d{4}-\d{2}-\d{2}` in every glossary** (`L286–289`) — not seal dates specifically. Any incidental date (a citation, a superseded note) can push `newestSeal` forward and false-positive the QUICKREF.
4. **`runAll` roots at `process.cwd()`** (`L384`) — `npm run lint:docs` is only correct from the repo root. The write-lint hook inherits this (`root = process.cwd()`, L36).

---

## Bottom line

The ladder is real and correctly wired: **Layer 0 script → PostToolUse injection → Layer 1 agent triage → user seal**, with "reports, never legislation" enforced structurally (no hook can block; nothing auto-renames or auto-registers). The alias-inject hook is a disciplined piece of mechanization — it shares `normalizeName` with the lint precisely to avoid two drifting definitions, and it refuses to encode the exploration-exemption judgment.

The gap worth surfacing: **the lint enforces index consistency, not authority.** `doc-registry.json`'s 119 rows of `layer` / `allowedContent` / `forbiddenContent` — the machine-readable encoding of the law's central taxonomy — are parsed and then ignored except for `.path` existence. Combined with the unenforced supersession protocol and the two silent false-negative classes above (`statusMarkers` lookup, `codeContract` 24/260), the honest characterization is: a well-built P1 index linter carrying a governance model it does not yet read.
