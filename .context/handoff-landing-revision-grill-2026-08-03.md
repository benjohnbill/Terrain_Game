# Handoff — grill the landing page revision

Written 2026-08-03 at the close of the session that put the commit-first demo
shell on the landing page and deployed it
(`demo/school-submission`, through `3630ebf`). The next session **grills the
landing copy with the user present, one question at a time.**

Carries only what is not already in the repo. Everything else is by path.

---

## Why this is owed

The landing page was authored **2026-07-16**. The duel pivot landed
**2026-07-23** (ADR 0042: 1v1, capital fall the sole win condition, the crisis
stack retired). Nothing on the page was re-cut for it. Yesterday's take-it-down
ruling and today's demo embed fixed the *artifact* the page points at; they did
not touch what the page **says**.

So the page currently sells a game shaped like the one before the pivot, next to
an iframe playing the one after it.

Live now: `https://notification-prototype-ec5c5.web.app`

---

## What the survey found, worst first

### 1. The page's centrepiece teaches an order the project reversed

`#war-model` (`index.html:237`) is the flagship interactive: *"One operation. Four
connected judgments"* — **Read → Position → Commit → Consequence**. Land first,
commit third.

Gate 07 sealed the opposite on a live evaluation with the user
(`.scratch/l3-playable-seam/issues/07-prototype-map-fog-presentation.md:148-154`):
**커밋량 → 행동 소환 → 세부 작전 → 가능 지역 빛남 → 지목**. Commit is the
*entrance*. The seal explicitly notes land-first as "a later variant".

The demo now sitting in `#build`, directly above, runs the sealed order. **The
page contradicts itself between two adjacent sections**, and the older one is the
one with the big interactive explainer. This is the same conflict registered as a
doc debt (`operation-plan-catalog/INDEX.md:35-42` and DOMAIN_MAP's turn ladder
also carry the old order) — the landing is its third and most public instance.

Decide: re-cut the explainer to commit-first, or retire it in favour of the
demo, which now explains itself.

### 2. Four numbers, in the one section that stakes its honesty on them

`#proof` (`index.html:438`) ends with *"이 숫자들은 마케팅 문구가 아니라 저장소에
있는 사실입니다."* That sentence makes a stale number worse here than anywhere
else on the page.

| Claim | Says | Repository today |
|---|---|---|
| 통과하는 자동화 테스트 | **437** | 575 root · 257 game node · 23 browser |
| 기록된 설계 결정(ADR) | **38** | **50** |
| 봉인된 기능 설계 문서 | 11 | 11 — still correct |
| 검증 중인 전쟁 모델 모듈 | **9** | slice-2's eleven tickets all landed; `game/src/domain/` holds 13 |

Also in that section: *"다음 증거 목표는 이것을 플레이 가능한 한 번의 전쟁으로
배선하는 것입니다."* That target was met — `/play` runs a full match to capital
fall. The page describes its own present as its future.

Decide: which counts to publish, and whether counting at all is still the right
proof device now that a playable match is the proof.

### 3. Retired mechanics still advertised

**위기 (crisis)** appears twice, and ADR 0042 supersedes ADR 0034/0035/0036 — the
crisis stack is retired:

- `#outcomes`: *"Catastrophic commitment — 잘못 고른 결전으로 **나라의 위기를**
  열다"*
- `#principles`: *"Compressed arc — 한 판의 성장과 전쟁, **위기를** 짧고 밀도 높은
  호흡으로 설계합니다"*

`#development`'s Now rung also names *"상황 판단"* as a shipped feature; the
situation-judgment model is ADR 0019's, and the pivot re-cut much of it (`js/situation.js`
was never reworked — a known carryover).

### 4. The identity is missing

The page never says the game is a **1v1 duel**, and never says **capital fall is
the only way to win**. That is the product's defining decision, sealed into SPEC.
The hero says *"몇 번의 큰 판단이 전쟁의 서사를 만드는 턴제 전략 게임"*, which was
true before the pivot and is now underspecified — a visitor cannot tell whether
they are buying a grand-strategy campaign or a duel.

This is the one finding that is an **addition**, not a correction, and it is
probably the whole point of the revision.

### 5. The development ladder has advanced past its own rungs

`#development` (`index.html:479`): Now = *"Systems prototype"*, Next = *"One
complete war"*, Vision = *"Every match, a war story"*.

Now is understated (a full match plays), Next has happened, and Vision commits to
**"PvP와 Steam 출시"** — PvP is a separate SPEC axis and the sealed distribution
target is a **native shell** (ADR 0016 Stage 2, ADR 0041/0051), not Steam. Steam
is not forbidden; it is simply not decided, and the page states it as direction.

### 6. The approved design doc is now stale in two places

`docs/superpowers/specs/2026-07-16-strategy-ground-ax-landing-design.md` (Status:
Approved implementation design) still says the secondary CTA *"opens `game.html`
and identifies it as a development build"* and *"`game.html`: retained as the
current development build"*. Both are false since today. Re-cut it in the same
batch, or the next reader implements backwards from it.

### 7. Where the work lands is undecided

All of today's landing changes are on **`demo/school-submission`**, which was
created as throwaway. `main` still has the old `index.html`, the old
`build-hosting.js`, and no ADR 0051. The deployed site is built from the demo
worktree.

That is fine for a submission and wrong as a resting state. **Decide before
editing further**: cherry-pick the landing + ADR commits onto `main`, merge the
branch, or keep deploying from the branch and accept the divergence. The ADR is
Record-layer and belongs on `main` regardless.

---

## Constraints the grill must respect

- **The approved visual system stands** unless the user reopens it: a dark
  cartographic table under controlled task lighting; brass for planned action;
  and the **Avoid** list — no neon cyan sci-fi HUD, no glass-card grids, no
  gradient text, no emoji icons, **no fake probability readouts**, no decorative
  grid backgrounds, no repeated eyebrow labels.
  (`docs/superpowers/specs/2026-07-16-strategy-ground-ax-landing-design.md`)
- **`landing_example/` is excluded as a design reference** — a rejected earlier
  direction, ruled out at `.context/prd-landing-context-2026-07-16.md:193`. Do not
  mine it.
- **`PRODUCT.md` § Anti-references**: do not imply the prototype is a finished
  demo. The demo is grey-box and hot-seat; say so.
- **ADR 0051 bounds the embed**: the landing may carry the demo as an *opaque
  built artifact*. Copy the bundle; do not reach into the game's source or config.
- **SPEC is Direction layer.** If the revision wants to state something SPEC does
  not, that is a proposal, not an edit.
- The page is **vanilla** — `index.html` + `css/landing.css` + `js/landing.js`,
  no bundler. `build-hosting.js` is a copy script with three allowlist arrays.

## Two audiences, and they may want different pages

Worth putting to the user early, because it changes everything downstream. The
original brief (`.context/prd-landing-context-2026-07-16.md`) was **a school AX
programme reviewing a submitted URL without a narrated walkthrough**. That is
still the immediate consumer. But the same page is also the product's public
home, and the PRD explicitly separated *"the near-term AX landing MVP"* from
*"the eventual production product home"*.

Today's demo changes the balance: the page can now show rather than claim. The
prose was written for a page that could only claim.

## Tooling notes that cost real time today

- **Use `/usr/bin/git`** — a bare `git` here can report another worktree's HEAD.
- **`rg` misses real matches** on recursive scope in this repo; confirm with
  `grep -rn`.
- **`firebase deploy` is blocked by the harness classifier.** The user runs it
  with a `!` prefix; the agent prepares `dist/` and verifies afterwards.
- **`cleanUrls: true` + `trailingSlash: false`** is a live-only trap: the demo is
  served at a file-like `/play`, so document-relative asset paths break. Already
  handled in `build-hosting.js` — do not "simplify" that rewrite away.
- Verifying the embed means **scrolling the iframe into view, not the section**.
  Scrolling `#build` leaves the frame's bottom below the fold, which is also a
  fair description of what a visitor does.

## Verification baseline

On `demo/school-submission` at handoff:

```bash
npm test                   # 575/575
npm run verify:game        # 6/6 lanes
npm run lint:docs          # 0 blocking / 21 advisory
npm run build:game && npm run build:hosting   # 14 files, 684 KB
```

Live checks that passed today, worth re-running after any landing edit:

- `/` 200 · `/play` 200 · `/game` **404** · `/game.html` **404**
- a full turn played *inside the iframe* at 1280×720 (the size that first
  failed): both eval bars diverge, tray shows commit → reveal → battle → capture
- frame fits on one screen at 1920×1080, 1440×900, 1366×768, 1280×720, 871×800,
  390×844, with the commit bar reachable in all six

## Suggested first question

Not the copy. Ask what the page is **for** now — AX submission, product home, or
both — because finding 2 (drop the counts or correct them), finding 1 (re-cut the
explainer or retire it), and finding 4 (how loudly to state the duel) all resolve
differently depending on the answer. Lead with the flow map at a designer's
altitude, not with the defect list (memory
`terrain-game-grill-communication-style`).

Suggested skill: **`/grilling`**.
