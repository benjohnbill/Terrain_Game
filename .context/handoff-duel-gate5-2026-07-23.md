# Handoff — 1v1 Duel Wayfinder draft, open Gate 5 (match-arc in a short duel)

Date: 2026-07-23 (evening)
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`
HEAD: `430b511` (confirm with `/usr/bin/git rev-parse --short HEAD` — bare
`git log` is unreliable here, parallel worktree). Nothing committed this session;
all output is untracked working notes + memory.

## What the next session does

Open **Gate 5 — match-arc in a short duel** of the formal 1v1 Duel Wayfinder
draft, using `grilling` + `domain-modeling`: one question at a time, user seals
every node, each question carries your recommended answer. Gates 1–4 are CLOSED;
do not re-open them.

## Where the work lives — READ THESE, do not restate them

1. **`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md`** — the running seal
   ledger. **Read first.** Carries every sealed node (D1.1–D1.5, D2.1–D2.5,
   D3.1–D3.2, Gate 4 corollary), the captured forward gates, and the amend flags.
   This is the source of truth for what is already decided.
2. `.scratch/l3-playable-seam/duel-pivot-premises.md` — the 3 locked premises
   (P1 Charter / P2 Boundary / P3 Governance) + the blast-radius / seal-batch
   inventory (appendix).
3. Memory `terrain-game-duel-pivot` — the pivot and its six converging arguments.
4. `.context/handoff-duel-1v1-draft-2026-07-23.md` — the handoff that opened this
   draft (gate list, disposition mechanism, capture debts). Still valid context.

## State in one line

The game is a **two-realm 1v1 duel; sole win = capturing the enemy capital.**
Design is ~85% through the L3 Wayfinder (infra gates 01–07 resolved); this draft
IS the Wayfinder "war-termination pass" (the long pole blocking L3 gate 08),
resolved at a higher altitude. Implementation is 0/9 build tickets — no L3 code
exists yet. Duel gates remaining: **5 (this session), 6 (turn structure).**

## Gate 5 — what it must decide

The realm-internal match-arc systems were built for a **multi-realm, multi-war,
long arc**. The match is now a **single ~15–30 min 1v1 duel**. Gate 5 decides
what those systems MEAN in the compressed frame:

- **Aging constitution (노화 헌법, P1–P3)**, **conscription register (징집 명부)**,
  **surge recruitment (서지 모병)**, **mobilization intensity (동원 강도)** — do
  they survive intact, narrow in PURPOSE, or go inert in the short timescale?
- **The critical lens (carry it in):** the same failure mode that killed the
  blinds device (D3.2 mining) applies here — *systems calibrated for a long
  multi-realm game may not bite in a short duel.* Aging that mattered over a
  30-turn multi-war arc may never trigger in a 15–30 min duel. Ask, per system:
  is it LIVE or INERT in the 1v1 timescale, and if its old purpose is gone, does
  it get a new one or get parked?

### Hard constraints on Gate 5 (from the sealed frame)

- **P2 Boundary — the realm-internal economy is FIXED / out of scope.** Gate 5
  does NOT redesign aging / register / recruitment. It decides their ROLE and
  PURPOSE in the 1v1 frame (live vs inert vs repurposed), not their mechanics.
- **D3.2 interaction (already sealed).** The anti-fizzle bet leans on
  **land-derived decay** — losing ground starves land-derived recruitment, so
  the trailing player decays and must gamble. Gate 5's treatment of the
  register/recruitment must stay consistent with that: the register is the
  currency the decay pressure runs through. Do not narrow the register into
  something that breaks the D3.2 decay.
- **Combat/operational engine is FIXED**; the map is a PARALLEL pass (design on
  the abstract board). Do not pull either into this gate.

### Inputs to read when the gate opens

- `docs/features/match-arc/GLOSSARY.md` + `RULINGS.md` — aging constitution,
  conscription register, surge recruitment, mobilization seals (their
  birthplace). Note: much of match-arc is STALE against the pivot (hegemony /
  DT-③ dominance / hermit clause / vassalage / ET-① ending taxonomy) — read the
  realm-internal survivors, not the multi-realm victory machinery.
- The prior-work mining report on termination/crisis is in THIS session's
  history (a subagent distilled it). Its section D (frame-dependence) and the
  "5 hard lessons" are the reusable core; the crisis body itself is retired
  (Gate 4). If you need it re-derived, the sources are indexed in that report:
  match-arc RULINGS, ADR 0034–0038, DESIGN-RISKS R14, slice-2 tickets 10/11.

## What NOT to do

- **Do not run the seal cascade yet.** The doc cascade (new victory ADR, SPEC
  amendment proposal, DOMAIN_MAP/DESIGN doc-sync ~22 rows, stale-ADR stamps,
  match-arc reseal, lint + QUICKREF regen) executes AFTER the design gates seal
  (after Gate 6). Inventory is in the premises appendix + the ledger's amend
  flags. Until it lands, SPEC/DOMAIN_MAP still assert the multi-realm model as
  truth — a large, known sync debt the cascade pays.
- **Do not re-open sealed decisions:** 1v1 vs multiplayer, capital-fall vs
  hegemony, gates 1–4. The **2v2 co-op / Tichu mode is PARKED as a sub-mode**
  (the user considered making it main; rejected — it doesn't solve termination,
  and it fights the F2P-liquidity / onboarding product constraints).
- Do not touch `docs/teach/` (Sanctuary) or the user's landing-redesign work in
  the worktree. Stage only by explicit path; commit nothing unless asked.

## Session mechanics / safety

- Voice: Korean 존댓말 (해요체); artifacts neutral professional English.
- `/usr/bin/git`; bare `git log` unreliable (parallel worktree) — use
  `rev-parse` / `show -s`.
- Update the ledger (`duel-pivot-draft-ledger.md`) as Gate 5 nodes seal — it is
  the compression-safe checkpoint. Keep it faithful; the cascade reads from it.
- User viewport ~1591 px; L3 targets desktop/native.

## Suggested skills

- **`grilling`** — the draft's method (one question at a time; user seals). The
  user opened this draft with it; continue in it.
- **`domain-modeling`** — record terms/decisions at their birthplace as Gate 5
  seals (match-arc GLOSSARY / RULINGS for any repurposed realm-internal term).
- **`prototype`** — only if a Gate 5 question needs a live feel-check (e.g. does
  aging ever bite in a 15–30 min duel?); build a throwaway per the gate-07
  precedent, require live user reaction.

## Read order for the next agent

1. `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` (all sealed nodes).
2. `.scratch/l3-playable-seam/duel-pivot-premises.md` (P1/P2/P3 + seal batch).
3. Memory `terrain-game-duel-pivot`.
4. `docs/features/match-arc/{GLOSSARY,RULINGS}.md` — the realm-internal survivors
   (aging constitution, register, surge, mobilization), read through the pivot.
5. This handoff, then open Gate 5 with the compressed-timescale lens above.
