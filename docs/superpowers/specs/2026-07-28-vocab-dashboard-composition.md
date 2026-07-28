# Vocabulary Dashboard — composition brief

Date: 2026-07-28
Status: **CONFIRMED by the user 2026-07-28. Unbuilt.**
Working layer. Produced by `/impeccable shape`.

Companion to `2026-07-28-vocab-dashboard-design.md`, which owns architecture,
the parse/render/drift contract, triggers, locations, and the law analysis. This
file owns **only the composition** — what the surface looks like and how it
behaves. Where the two disagree, the design spec wins on structure and this one
wins on presentation.

Register: **product**, not brand. `PRODUCT.md` declares `brand`, but that
describes the Strategy Ground marketing landing; routing takes the task cue
first, and this is a dashboard. The landing's brand may not be worn here.

Visual-direction probes were **skipped**: this harness has no native image
generation. Layout is fixed in text below instead.

## 1. Feature summary

A single self-contained HTML page, opened from `file://` out of gitignored
`dist/vocab/`, that renders the project's entire registered vocabulary — 254
terms, 13 operation-plan records, and one lock reading — as a window the user
keeps open beside their editor while writing documentation. It answers one
question fast: **where does this term's definition live?** It is written only
when the `doc-audit` skill is invoked; it is never a hook's side effect.

## 2. Primary user action

**Find a term and land on its authoritative source.** Everything else —
the gloss, the status, the plans, the lock figure — is secondary to putting the
user one click from the birthplace file.

## 3. Design direction

**Color strategy: Restrained.** The product floor, and the measurement forces
it: status is 92% `AGREED`, so there is nothing here worth a full palette. One
accent, used on three things and nothing else.

**Scene sentence.** *"오라버니가 새벽 두 시에, 에디터와 터미널이 이미 화면을
채운 상태에서, 문서를 쓰다 말고 곁눈으로 'Front sector가 어디 정의돼 있더라'를
확인하려 여는 창."* That forces **dark**: this panel lives in the corner of a
dark working screen and must not read as a lamp.

**Mood phrase.** *야간 열람실의 인용 색인 — 검은 종이에 조용한 회색 본문,
출처만 빛난다.* ("A citation index in a night reading room: black paper, quiet
grey body, only the source glows.")

That phrase is doing real work, not atmosphere. It places the one warm colour on
the **pointer** — which is the one element the law declares citable. Colour
follows authority here; it is not decoration.

**Lineage: its own face** (user, 2026-07-28). Deliberately not inherited from
either existing surface:

- `game/src/ui/styles.css` — the L3 viewer's dark blue-grey monospace grey-box.
  Its own comment says it owes "legibility, nothing more." Borrowing it would
  make this tool look unfinished by inheritance.
- `mockup/situation-map.css` — the game's olive/paper military-cartographic
  skin. That is the *game's* identity; a documentation tool wearing it is
  costume.

Pure-neutral black separates this surface from both (the viewer's ground is
blue-tinted, the mockups' is olive), and the gold carries the identity — the
palette guidance's own rule that mood lives in the brand colour, never in the
surface.

**Anchor references.** Linear (list density, the quiet selected row), Raycast
(search as the primary control, results as the page), and a printed legal
citator — an index whose whole design is "the citation is the payload."

**Category-reflex check.** First-order reflex for a vocabulary tool is a white
documentation site with blue links; this is not that. Second-order reflex, one
tier deeper, is "docs tool that isn't a white docs site → dark terminal green,
all monospace"; the editorial type voice and gold-on-neutral step off that lane
too. Monospace appears here only where it is semantically right: file paths and
code identifiers.

### Palette (OKLCH)

```css
--bg:      oklch(0.090 0.000   0);   /* pure neutral black — no hue tint      */
--surface: oklch(0.145 0.000   0);   /* detail pane, lock bar, header          */
--line:    oklch(0.240 0.000   0);   /* hairlines, row separators              */
--ink:     oklch(0.930 0.008  60);   /* body — a whisper of the gold's hue     */
--muted:   oklch(0.650 0.006  60);   /* korean, gloss preview, meta            */
--primary: oklch(0.650 0.146  60);   /* THE POINTER. seed, unmodified          */
--accent:  oklch(0.860 0.090 230);   /* unsettled: PROPOSED + non-zero drift   */
```

Contrast, computed: ink/bg ≈ 16:1, muted/bg ≈ 6.5:1, primary/bg ≈ 6.5:1,
accent/bg ≈ 12:1. All clear AA for their roles; ink clears AAA.
primary↔accent ≈ 1.85, above the 1.7 floor, and they differ in hue by 170°.

**Where each colour is allowed:**

| Role | Allowed on | Never on |
|---|---|---|
| `--primary` (gold) | the birthplace pointer, in the row and in the detail pane | headings, selection, borders, decoration |
| `--accent` (cool) | the `PROPOSED` mark (10 terms), a non-zero drift count | anything with a count of zero, any `AGREED` row |
| `--surface` | the selected row's fill, the detail pane, header, lock bar | — |

Selection is a surface fill plus the term name in `--ink`; it never borrows the
accent. This keeps "which row is open" and "which term is unsettled" from
competing.

### Type

One family plus monospace where monospace *means* something.

```css
--ui:   ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
        "Noto Sans KR", "Malgun Gothic", sans-serif;
--mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
```

Self-contained means **system stacks only** — no CDN, no webfont, no `@font-face`
with a remote URL. Korean must fall back gracefully because 176 terms carry it.

Fixed rem scale, ratio ≈ 1.15 (product register: no `clamp()` here — a heading
that shrinks inside a narrow panel looks worse, not better):

| Step | Size | Used for |
|---|---|---|
| `--t-meta` | 0.6875rem | counts, lock figures, status marks |
| `--t-path` | 0.75rem | birthplace pointer (mono), code identifier |
| `--t-row` | 0.8125rem | term name, 한국어, gloss preview |
| `--t-read` | 0.9375rem | the quoted definition in the detail pane |
| `--t-head` | 1.0625rem | the open term's name |

The quotation is set in the same family as the interface, distinguished by
**size, leading, measure, and colour** rather than by a second typeface. A serif
would break on the mixed Korean/English inside these definitions, and the
product register prefers one family regardless.

## 4. Scope

- **Fidelity:** production-ready. This is a tool the user opens daily, and its
  visual quality was fixed as a requirement, not deferred.
- **Breadth:** one surface, three regions, two modes (Terms / Plans).
- **Interactivity:** shipped-quality — search, filter, select, keyboard.
- **Time intent:** polish until it ships.

## 5. Layout strategy

A **middle window**, ~880px wide by default, list left / detail right, with a
fixed lock bar across the bottom (user, 2026-07-28).

```
┌────────────────────────────────────────────────────────┐
│ ⌕ search…                     Terms 254 │ Plans 13     │  header  (surface)
├──────────────────────┬─────────────────────────────────┤
│ Land-derived state   │  Front sector                   │
│ 땅에서 파생된 상태     │  전선 구역          AGREED · T0  │
│ DOMAIN_MAP · "the …" │                                 │
│──────────────────────│  "The operational atom of the   │
│ Front sector       ▸ │   war model. A front sector      │
│ 전선 구역             │   groups hexes into the player- │
│ DOMAIN_MAP · "the o… │   facing operational scale …"    │
│──────────────────────│                                 │
│ Terrain-first        │  ── excerpt, quoted verbatim    │
│ DOMAIN_MAP · "geog…" │                                 │
│ …                    │  → DOMAIN_MAP.md                │
├──────────────────────┴─────────────────────────────────┤
│ last locked 2026-07-26 (auditRun 3) · +12 new · 3 re…  │  lock bar (surface)
└────────────────────────────────────────────────────────┘
   ~340px                        ~520px
```

**Widths are derived, not chosen.** The detail pane holds prose measured at p50
290 characters, so it needs a 65–75ch measure: ~520px at `--t-read`. The list
column takes what remains. Total lands at ~880px, which is what "디스플레이 일부"
means in practice.

**Row anatomy — the signature move.** Most reference UIs bury the source path in
small grey text at the end. This inverts it: the pointer is coloured, set in
mono, and sits on its own line as the row's payload. The gloss is the footnote,
not the path.

```
Front sector   전선 구역                              ·      ← line 1
DOMAIN_MAP · "The operational atom of the war mod…"          ← line 2
└─ gold, mono ─┘  └─ muted, single line, ellipsis ─┘
```

Two lines, ~44px per row. All **254 rendered at once** — no pagination, no
virtualisation. 254 DOM rows is nothing, and virtualising would break the
browser's own Ctrl+F, which an encyclopedia must not do.

**Responsive** behaviour is structural, not fluid. Below ~720px the detail pane
stops being a column and becomes a full-width view pushed over the list, with a
back control. Below ~420px the 한국어 moves under the term instead of beside it.

## 6. Key states

| State | What it must show |
|---|---|
| **Default** | Full list, nothing selected, search focused, detail pane in its empty state |
| **Detail empty** | Teaches the surface: "254 terms across 17 files. Search, or pick a term — every row links to where its definition actually lives." Not "nothing selected." |
| **Term selected** | Name, 한국어 if present, status, tier, the full quotation, provenance label, the pointer |
| **No 한국어** (91 terms, 34%) | Simply absent. The line closes up; no placeholder, no dash, no "—". A third of rows must not look broken |
| **No gloss** | A blank slot, never a demotion (law text). The row keeps its full height and its pointer; nothing is sorted, badged, or sectioned by this |
| **`PROPOSED`** (10) | A quiet accent mark. The only status worth surfacing |
| **`SEALED`** (10) | Rendered as `AGREED` plus a seal mark in muted. More settled, not less — never grouped with `PROPOSED` |
| **`rejected-recorded`** (1) | Visibly marked as a tombstone and still findable. Its job is to stop someone re-coining a rejected name |
| **Long alias set** (max 12) | Aliases wrap as text, never as inline chips. Several sets are enumerated members, not aliases |
| **Search: no match** | "No term matches *X*. 254 registered." plus a clear-search control |
| **Filtered by source** | A dismissible filter chip in the header; the count in the mode switch updates |
| **Plans mode** | 13 records as columns (name, availability, effect axes, risk), not as term rows |
| **Lock: drift** | `last locked <date> (auditRun N) · +N new · M re-statused · K redefined` — non-zero counts in accent |
| **Lock: no drift** | `no drift since 2026-07-26` in muted. A zero never wears the accent |

No loading state and no error state: the page is generated with its data inline.
There is nothing to fetch and nothing to fail.

## 7. Interaction model

- **Search** is the primary control and takes focus on open. It matches
  canonical, 한국어, and aliases; it does **not** match gloss text, so results
  stay predictable.
- **Click a row** → detail pane. **Click the gold source label** → filter the
  list to that birthplace. That is the drill-in the user asked for, delivered
  without spending a third column on a rail.
- **Keyboard**: `↑`/`↓` move the selection, `Enter` opens the pointer, `Esc`
  clears search then filter then selection, `/` refocuses search.
- **The pointer** is a real link to the birthplace file. From `file://` it opens
  the markdown; that is the intended terminus of every interaction.
- **Mode switch** (Terms / Plans) is a segmented control in the header, not a
  tab bar and not a modal.

**Motion**, 150–250ms, conveying state only. Detail-pane content crossfades at
160ms on selection change. The list itself never animates — filtering 254 rows
with a transition is a stutter, not a delight. Selection is instant.
`prefers-reduced-motion: reduce` drops the crossfade to an instant swap. No
entrance choreography: the page opens into a task.

## 8. Content requirements

All copy is English (artifact voice), except the 한국어 표시어, which is data.

- Empty detail pane: *"254 terms across 17 files. Search, or pick a term — every
  row links to where its definition actually lives."*
- No search match: *"No term matches "X". 254 registered."*
- Provenance label in the detail pane, and **only** there: `authored` /
  `excerpt`. Never in a row — as a badge across 254 rows it would rebuild the
  hierarchy the law removes.
- Excerpt framing: the quotation is presented as a quotation, at full length,
  scrolling if needed. **Never truncated in the detail pane** — trimming a quote
  to fit a card silently edits it, which is precisely what quoting instead of
  summarising exists to avoid. The row's one-line preview is explicitly a
  preview and carries an ellipsis.
- Header: term count, and the mode switch counts.
- Lock bar: the dates and the four drift figures.

Dynamic ranges, measured 2026-07-28: 254 term rows · 13 plans · canonical
3–45 chars · 한국어 1–15 chars, absent on 91 · birthplace 13–63 chars across 17
distinct values · aliases 0–12 · definition text 37–1331 chars, p50 290.

## 9. Recommended references during implementation

`layout.md` (two-pane density and the responsive collapse), `typeset.md` (the
five-step fixed scale and the quotation's optical treatment), `interaction-
design.md` (search + keyboard model), and `audit.md` before shipping — contrast
is computed here but must be verified in the rendered page.

## 10. Open questions

Both of the questions this brief opened are now **closed by the build**. One new
one took their place, and it is the user's.

1. **`drift`'s redefinition test — CLOSED: binary.** "Changed at all", not a
   diff-size threshold, because a threshold would need a justification nobody
   has. Settled as a direct string comparison rather than a digest: both texts
   are in memory and no baseline file stores content, so hashing would have been
   ceremony.
2. **Gloss coverage at row level — CLOSED: the preview line stays.** Measured on
   the real sources, not estimated: 96.3% of terms carry a gloss in the detail
   layer, and 199 of 254 rows carry a preview. The gap is not the ~48 unglossed
   rows this brief feared; it is the 47 `context` glosses the renderer withholds
   from the row on purpose, because a quotation that is not the term's own
   definition may not appear where provenance cannot be shown. The fallback (a
   no-gloss scan layer) is not needed.
3. **NEW, and the user's — where the markdown output lands.** § Output division
   names `docs/GLOSSARY-QUICKREF.md`, and the build found two reasons that is
   not a decision code may take on its own:
   - **That file is not the flat term list this brief assumed.** It is 481 lines
     of sectioned digest, with term tables under 15 feature headings AND
     hand-authored synthesis (`## Economy flows — reader's digest`, "sealed
     canon, intuition glosses") that a generator would destroy — the same hazard
     that moved the C-loop table out to `docs/C-LOOP.md`.
   - **A fresh `docs/` path is not free either.** It would enter the governed set
     with no row in `docs/audits/doc-registry.json` and no mention in the law's
     Working-layer enumeration; amending that taxonomy is Tier 3.

   Until it is ruled, the generator writes to gitignored
   `dist/vocab/vocab-index.md` — the two-format decision is honoured, no
   governed path is squatted, and `--markdown=<path>` aims it in one flag. Note
   also that the generated file quotes definitions **in full**, where the
   QUICKREF precedent the law permits is short hand-written glosses; whether
   that difference matters is part of the same ruling.

## 11. What the build changed in this brief

Recorded rather than silently absorbed, because each was a decision.

- **Accent also carries focus rings and the `context` caution.** § 3's table
  said accent was for `PROPOSED` and a non-zero drift figure only. Focus
  indication needs the highest-contrast token on the page and is a different
  axis from status; the caution ("*Not this term's own definition*") is a
  warning, not a status. Both are correct uses the table did not anticipate.
- **Search also matches `codeIdentifier`.** § 7 named canonical, 한국어, and
  aliases. 84 terms carry an identifier and it is how the value axes are written
  in prose, so excluding it made those terms unfindable by the name a reader
  actually has.
- **The status bar carries both dates and the source commit**, rather than the
  header. One bar holds all of the page's provenance; splitting it across two
  regions would have made rendered-vs-locked harder to read, not easier.
- **Plan rows stack three lines instead of four side-by-side columns.**
  Measured: a 340px list cannot seat a name beside a risk clause —
  `Encirclement and Annihilation` is 29 characters, and anything sharing its
  line wraps it. Wrapped names destroy the alignment a column view exists for.
- **Plan `risk` is prose, not a level.** Of twelve records, five open with a
  bare level word and seven are sentences ("The highest in the catalog…").
  Normalising that would be invention, so the author's text is carried through
  and the list column ellipsizes it.
- **The detail overlay gained a back control.** § 5 promised one at narrow
  width and the first build omitted it, so the overlay trapped a touch device
  with no Escape key. It is a plain fragment link, working with JS disabled.
