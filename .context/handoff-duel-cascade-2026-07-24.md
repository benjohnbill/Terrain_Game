# Handoff — 1v1 Duel Pivot: RUN THE DEFERRED DOC CASCADE

Date: 2026-07-24. Supersedes `.context/handoff-duel-gate6-finish-2026-07-24.md`
(that job — finish Gate 6 — is DONE).
Repo: `/home/benjohnbill/dev/Terrain_Game`, branch `main`.
This session committed the seal record only (`12cf032`: the draft ledger +
premises begin tracking). The cascade below is UNTOUCHED — the user chose
"commit the seals only, cascade next session."

## Where we are

**All six 1v1 duel-pivot design gates are CLOSED (2026-07-24).** The pivot's
design is complete. Gate 6 (turn structure) sealed this session:
- D6.1 simultaneous blind commit → simultaneous reveal (poker, not chess) + PvP-timer rider
- D6.1a resolve-order = simultaneous & symmetric, no first-mover asymmetry (concrete rule = its own L3 pass, registered as a forward gate)
- D6.2 turn phase skeleton = 3 tiers (decision ② / payoff ④ non-demotable / background ①⑤ auto-fold)
- D6.3 행동력 = a single non-hoardable chip stack, the one currency for ALL orders
- D6.4 match length = player-paced to capital fall; target 15–30 min (가안, fixed; change gated on data/business reason)
- EVAL BAR = the signature UI (single in-play TACTICAL confidence-band bar; strategic verdict → post-game COACH, live-excluded)

The truth of all six gates lives in
`.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` (now tracked). That
ledger is the compression-safe seal record the cascade reads FROM.

## Next session's job — RUN THE CASCADE (one governed batch)

The design is sealed; the docs still assert the OLD multi-realm model. Until the
cascade lands, SPEC/DOMAIN_MAP are a large, known, recorded sync debt. Full
work-list + evidence: `duel-pivot-premises.md` appendix (blast-radius inventory)
+ the ledger's "Amend flags" section. Do it in dependency order:

1. **New victory ADR (the anchor — everything references it).** Records
   capital-fall as the sole win condition. This is a **mandatory-ADR trigger**
   (changes a win condition — documentation law). Per the **ADR supersession
   protocol**: the new ADR's header must NAME what it supersedes/amends, AND the
   same commit must stamp each old ADR's header:
   - SUPERSEDE (5): 0030 hegemony (keystone), 0033 affordability bound,
     0034/0035/0036 crisis-ending stack → `Status: Superseded by ADR-XXXX (2026-07-24)` + one-line delta each.
   - AMEND (2): 0037 war-model build direction, 0038 war-ending composite (capital
     fall promoted backstop → primary win — the seam that absorbs the change) →
     `Amended by ADR-XXXX (2026-07-24)` + delta.
   - STALE-STAMP (2): 0031 force-geography defense, 0032 occupation geography →
     announce their own staleness in-header.
   - Survivors (do NOT touch): 0025 (uncertainty duel — becomes literal), 0026,
     0019, 0021, 0022, 0023, 0016/0028/0039/0040/0041.
2. **Capital birthplace `docs/features/capital/`.** CP-① already exists (named the
   birthplace). Add **CP-② rulings** = the win-condition's authoritative definition
   home (capital def/placement, fall mechanics, guard, forward/rear, 천도, early-rush
   emergent defense). The ledger's Gate 1–2 seals are the source text. Watch the
   **seal-amends-ADR duty**: a Production seal that amends an accepted ADR triggers
   the same header-stamp duty as a superseding ADR.
3. **DOMAIN_MAP / DESIGN doc-sync (~22 rows, Tier-2 autonomous).** 8 term
   definitions embed the multi-realm assumption and must be re-cut or retired:
   decision point, hegemony decision point, hermit clause, vassalage, and the
   winning-archetypes 복속 사슬형 / 어부지리형 / 약탈 소모형 / 중원 내선형. Obey the
   **single-definition rule**: capital birthplace stays authoritative; DOMAIN_MAP
   carries summary + pointer, never a second definition.
4. **match-arc reseal.** Stamp the stale match-arc seals (hegemony decision point,
   DT-③ dominance, hermit clause, vassalage-as-currency, ET-① ending taxonomy,
   frame decision [realm 4–6, multipolar map], crisis CE-①…⑳). Survivors
   (realm-internal): aging constitution, conscription register, mobilization, surge
   recruitment, occupation-geography (minus third-party branches), combat terms —
   these were affirmed LIVE in Gate 5, do not re-stale them.
5. **SPEC amendment — PROPOSAL only (Tier 3, user-approved).** 11 contradictions
   (Core Principle #5 termination, realm-count 4–6, multipolar geometry,
   hegemony-settlement end, dominance, crisis-arc / Westphalian draw, Phase-2
   diplomacy, …) + 4 sharpenings (Principle #2 uncertainty duel becomes literal, LoL
   positioning, Goal, Core Gameplay Promise). Draft it as a proposal and get the
   user's seal — never drift SPEC directly.
6. **Ritual close.** term-inventory.json patch for sealed/renamed/re-statused
   terms → `npm run lint:docs` (audit-lint) → regenerate `docs/GLOSSARY-QUICKREF.md`
   (include this batch's own seals, same-session freshness) → record any unpaid
   duty in `docs/SYNC-DEBT.md`.

## Read order for the next agent

1. `.scratch/l3-playable-seam/duel-pivot-draft-ledger.md` — gates 1–6 CLOSED; the
   seal text the cascade transcribes. Gate 6 section + closing summary + amend flags.
2. `.scratch/l3-playable-seam/duel-pivot-premises.md` — P1/P2/P3 + the blast-radius
   appendix (the seal work-list with ADR/SPEC/DOMAIN_MAP specifics).
3. Memories: `terrain-game-duel-pivot` (now carries the gate-6-complete state),
   `terrain-game-l3-wayfinder-gate07`, `terrain-game-crisis-design-pass`,
   `terrain-game-war-model-build`.
4. `DOCUMENTATION-LAW.md` (mirrored in AGENTS.md) — supersession protocol,
   seal-amends-ADR duty, single-definition rule, session-close ritual. The cascade
   is a documentation-governance operation; follow the law exactly.
5. The bounding ADRs themselves (0030, 0033, 0034/0035/0036, 0037, 0038, 0031,
   0032) before stamping them — read what you supersede, do not stamp blind.

## Hard constraints / what NOT to do

- **Do not re-open sealed decisions.** Gates 1–6, the eval-bar/interaction design,
  1v1-vs-multiplayer, capital-fall-vs-hegemony are all sealed. The cascade
  TRANSCRIBES seals into formal docs; it does not re-litigate them.
- **SPEC is Tier 3** — proposal + user approval only, no direct edit.
- **ADR supersession is not optional** — a stale ADR read in isolation must
  announce its own staleness. Stamp old headers in the SAME commit as the new ADR.
- **Single-definition rule** — the definition lives at its birthplace
  (capital/ for the win condition); every other surface is summary + pointer.
- **Do not touch `docs/teach/`** (Sanctuary).
- **The prototype is reference/throwaway** (ADR 0041), not L3 build source.
- After the cascade lands, **L3 Wayfinder gate 08 is unblocked** — but that is the
  step AFTER this batch, not part of it.

## Session mechanics / safety

- Voice: Korean 존댓말 (해요체); artifacts neutral professional English.
- `/usr/bin/git`; bare `git log` unreliable (parallel worktree) — use `rev-parse` /
  `show -s`. Repo convention: docs/seal commits go directly to `main` (see the
  recent `seal gate 05/06/07` + `12cf032` history), not a PR branch.
- The cascade is large; it may not fit one session. Land it as governed sub-batches
  (ADR+birthplace first as the anchor, then Projection sync, then SPEC proposal),
  committing each so the seal record stays safe.
- User viewport ~1591 px; L3 targets desktop/native.

## Suggested skills

- **`domain-modeling`** — for the DOMAIN_MAP/DESIGN sync and term re-cuts (records
  decisions at birthplace with the ubiquitous-language discipline).
- **`doc-audit`** — the ritual close (term-inventory patch + `npm run lint:docs`
  triage + QUICKREF). Fire it after the seal batch.
