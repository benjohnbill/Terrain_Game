# PRD · Landing Context — 2026-07-16

> **Layer:** Working / untracked handoff  
> **Authority:** None. This file is a pointer map and session context, not a
> product-definition source. On conflict, follow the repository documentation
> law and the linked Direction / Projection / Record / Production documents.

## 1. Purpose

This note preserves the evidence needed to conduct a business-integrated PRD
grill and later derive a production-quality landing page. It separates:

- verified product direction;
- sealed or active design;
- current implementation state;
- user-confirmed workflow intentions;
- unresolved business and landing decisions.

It deliberately does not promote hypotheses into `SPEC.md`, redefine domain
terms, or decide the landing framework and visual system in advance.

## 2. Context read directly in the main session

### Product harness

- `SPEC.md`
- `DESIGN.md`
- `DOMAIN_MAP.md`
- `.claude/rules/documentation-law.md`

### Records and production front doors

- `docs/adr/README.md` and ADR 0001–0038
- Every current `docs/features/*/INDEX.md`:
  - `capital`
  - `combat-formula`
  - `fog-of-war-discovery`
  - `force-geography`
  - `match-arc`
  - `operation-plan-catalog`
  - `phase-1-fun-core`
  - `phase-1-terrain-combat`
  - `tactical-plan-ai`
  - `terrain-cradle`
  - `war-model-build`
- Product-relevant deeper reads:
  - `docs/features/war-model-build/REQUIREMENTS.md`
  - `docs/features/match-arc/STRATEGY-SPACE.md`
  - `docs/features/terrain-cradle/GLOSSARY.md`
  - `docs/features/fog-of-war-discovery/GLOSSARY.md`
- Fresh implementation handoff:
  - `.context/handoff-slice2-ticket10-2026-07-16.md`

## 3. Evidence-backed product nucleus

### Product promise

- ✅ A browser-based, turn-based national management and conquest game.
- ✅ The central positioning is a **Civ-depth world with a LoL-shaped hand**:
  high systemic complexity, low required micromanagement, and optional depth.
- ✅ The intended match envelope is roughly 30–40 minutes, with an hour as the
  outer direction. Exact turn and wall-clock calibration remains provisional.
- ✅ The player should feel growth, read the map, make a consequential judgment,
  and express skill through situation fit rather than mechanical execution or
  memorizing one universally optimal build.

Primary pointers: `SPEC.md` Positioning and Fun Pillars; ADR 0010, 0017,
0018; `docs/features/phase-1-fun-core/INDEX.md`.

### Core experience grammar

The current decision ladder is:

1. read the strategic situation through province-level lenses;
2. choose the front sector that is the hinge of the turn;
3. choose an operation-plan preset;
4. fine-tune commitment and redirect surplus;
5. resolve deterministically and read the persistent world change.

- ✅ The core pressure engine is the **uncertainty duel**: simultaneous or
  opponent-dependent commitment under incomplete information.
- ✅ Resolution is deterministic; uncertainty belongs in information and
  prediction, not hidden dice.
- ✅ Geography is public from turn 0. Fog applies to mutable military state,
  posture, substance, fatigue, and position; estimates should be shown as
  confidence-dependent bands rather than false precision.
- ✅ Plans stamp atomic effects into persistent state; longer campaigns emerge
  from repeated turn decisions rather than scripted multi-turn actions.

Primary pointers: ADR 0019–0027; ADR 0037–0038; operation-plan and fog feature
indexes; `war-model-build/REQUIREMENTS.md`.

### World and strategic identity

- ✅ The world is fictional and East Asia-inspired, designed for legibility and
  extensibility rather than strict historical simulation.
- ✅ The authored map currently consists of 10 regions, 55 sectors, and roughly
  292 hexes. Named provinces and front sectors carry strategic meaning while
  hexes supply physical evidence and rendering.
- ✅ Starting asymmetry should emerge from geography and fog, not arbitrary
  faction bonuses. Terrain defines the possibility space; judgment chooses
  within it.
- ✅ Cities and routes are authored to summon conflict and create readable
  stakes, including corridors, gates, interior heartlands, and straits.

Primary pointers: SPEC Core Principles 8–9; ADR 0001–0007, 0022, 0031–0032;
`terrain-cradle/INDEX.md` and `GLOSSARY.md`.

### War and match arc

- ✅ The intended war spectacle is shield-breaking into a decisive battle and
  then a cascade, with field-army destruction or political breakage deciding a
  war rather than slow tile-by-tile exhaustion alone.
- ✅ Match victory detects irreversibility through leadership or dominance plus
  unassailability. The game then presents a settlement rather than silently
  ending the human player's war via bot policy.
- ✅ A late internal-uprising crisis is designed as a backstop against permanent
  stalemate, ending in a draw if no hegemony exists; it is not intended to be
  the main spectacle or a scorecard judge.
- ✅ Six strategy archetypes currently serve as a balance checklist: conquest,
  vassal chains, opportunistic timing, raiding/attrition, shield-first play, and
  interior-line play. These are design-space checks, not validated marketing
  personas or promised faction classes.

Primary pointers: SPEC Match Structure; ADR 0030–0038;
`match-arc/INDEX.md`, `STRATEGY-SPACE.md`; `war-model-build/REQUIREMENTS.md`.

### Phase scope

- ✅ Phase 1 prioritizes terrain, regional value, combat, local garrisons,
  movement/crossing constraints, and the economy/population needed to make war
  costs legible.
- ✅ Diplomacy, deeper national management, events, naval depth, and free-form
  negotiation are later directions.
- ✅ The MVP is supposed to prove the fun core, not merely demonstrate an
  anti-snowball simulation.

Primary pointers: `SPEC.md`; ADR 0008, 0015, 0018;
`phase-1-terrain-combat/INDEX.md` and `phase-1-fun-core/INDEX.md`.

## 4. Current product maturity — do not collapse these layers

### Designed or sealed

- The positioning, core design principles, map hierarchy, uncertainty model,
  operation-plan shape, terrain-bound defense direction, authored cradle,
  match-decision structure, and the main war-model requirements have substantial
  documented design depth.
- Many exact magnitudes are provisional even where their structural role is
  sealed.

### Implemented or under active build

- The repository remains a static HTML/CSS/JavaScript application; no build
  system is currently required for the game prototype.
- The old L2 tournament stage machine has been retired as product truth because
  it produced artificial war fizzles.
- The real war model is being rebuilt as pure modules under `js/`.
- Fresh repository evidence on 2026-07-16: slice-2 tickets 01–09 are merged to
  `main`; ticket 10, the fizzle re-read and terminal evidence gate, remains.
  This is fresher than the `war-model-build/INDEX.md` status line.

### Not yet validated as product truth

- ❓ The complete end-to-end player loop has not yet been proven fun at L3.
- ❓ Final UI/UX information architecture and interaction cost are not sealed.
- ❓ The 30–40 minute promise needs real-player wall-clock validation.
- ❓ Multiplayer/PvP is not adopted product scope; making it so requires a SPEC
  decision. Earlier notes that mention future PvP are intentions, not current
  product truth.
- ❓ Commercial demand, audience fit, willingness to pay, retention, and landing
  conversion are unvalidated.

## 5. User-confirmed PRD and landing intentions

- ✅ First create a complete **business-integrated PRD**, then use it as the
  source for a landing page.
- ✅ The PRD should give significant weight to the intended gameplay UX while
  also addressing market, business model, release, and Steam-related thinking.
- ✅ The landing page should be production-quality and capable of evolving into
  the real public product surface, not a disposable mockup.
- ✅ An interactive miniature game/situation simulation embedded in the page is
  appealing because it can make the core judgment experience tangible.
- ✅ High implementation difficulty is acceptable when it creates meaningful
  product quality.
- ✅ Design assets may be generated when the game itself does not yet provide
  polished UI captures.
- ✅ Before finalizing the landing architecture, research approximately five
  traditional grand-strategy/war-game sites and five casual/indie-game sites,
  specifically examining navigation, sidebars, CTA behavior, layout, scrolling,
  interaction, and proof.
- ✅ Later design work should use `ui-ux-pro-max` and `impeccable`.
- ⛔ `landing_example/` is explicitly excluded as a design reference.

## 6. Tooling and platform context

- `ui-ux-pro-max` is installed project-locally and its search script was
  verified.
- `impeccable` is installed project-locally and its hook is enabled.
- Full Impeccable design-context initialization is intentionally deferred until
  a landing subproject exists. Initializing at repository root would collide
  semantically with the architectural root `DESIGN.md`.
- An existing Firebase project was identified earlier (`1082123901885`) with
  an intention to register a web app and eventually support the landing page.
- Firebase is **not** currently being connected as the gameplay runtime database.
  Exact landing uses—hosting, waitlist, email/password accounts, Firestore
  content, analytics, or administration—remain product decisions. No Firebase
  scope should be inferred merely from the earlier connection request.

## 7. Decisions that remain open — do not smuggle them into the PRD

- ✅ **PRD audience and decision function — confirmed 2026-07-16:** the PRD is
  an internal Master PRD for the developer/founder acting as product owner. Its
  primary job is to state the intended game UX, pursued product values, target
  players, future vision, validation logic, active MVP scope, and path toward a
  Steam release. It is not primarily an investor-fundraising artifact; pitch and
  landing briefs should be derived from it.
- ✅ **Initial target and desired payoff — confirmed 2026-07-16:** the primary
  audience is players who like war simulations but find their playtime burdensome,
  plus experienced players who have grown tired of familiar genre grammar. The
  desired payoff is not merely a shorter campaign: players should author a plan
  and produce a compressed, high-intensity strategic highlight comparable to a
  real-time-game “madmovie.” User examples include a Myeongnyang- or
  Waterloo-like battlefield reversal and a Moscow-like scorched-earth trap that
  defeats a stronger invader through prior design.
- ✅ **Historical-content boundary — confirmed 2026-07-16:** the product should
  not force literal historical scenarios into the game. Its fictional world,
  terrain, forces, information, timing, and fortifications should provide a
  causal possibility space in which player choices naturally produce battles
  recognizable after the fact as “Myeongnyang-like” victories or
  “Tangeumdae-like” annihilations.
- ✅ **Authored climax shape — confirmed 2026-07-16:** the player receives a
  small number of legible, high-level choices. Their judgments accumulate over
  roughly four to six turns into a designed decisive engagement. A sound plan
  may reverse a material disadvantage; a misdirected decisive-battle plan may
  destroy the field army and collapse the state. Both triumph and catastrophe
  belong to the intended emergent narrative.
- ✅ **Fresh match-cadence intent — confirmed 2026-07-16:** the expected match
  finish should peak around turns 18–22, inside the broader 15–25-turn design
  envelope. A realm should experience roughly three to five wars. One war runs
  roughly 8–12 turns from declaration through settlement; the 4–6-turn rhythm
  describes the operational phase in which atomic plans and their consequences
  accumulate toward a decisive outcome, not one scripted multi-turn action and
  not the full war. Preparation should include fortress specialization, accumulated
  technology, and force/resource management—the latter described as “quality”
  in an earlier user document.
- ❓ **Scope reconciliation still required:** the current MVP fixes troop
  quality at 1 and reserves the technology/quality axis for post-MVP expansion;
  the PRD must distinguish long-term product vision from the active MVP instead
  of silently changing either scope.
- ✅ **First landing success criterion — confirmed 2026-07-16:** the initial
  landing is a credible product home whose primary job is to make a strategy
  player encountering Terrain Game for the first time understand what is
  different and what kind of war they can author. Recruiting followers,
  collecting email signups, playtest acquisition, and Steam conversion are
  secondary capabilities to activate when traffic and a suitable build exist,
  not assumptions the first page must satisfy.
- ✅ **Immediate delivery context — confirmed 2026-07-16:** the first landing
  version is needed for a school AX program that has asked to see a landing
  page. It should be built now at a credible attainable quality rather than
  blocked on a playable demo or the fully interactive long-term concept.
- ✅ **Two-horizon landing scope — confirmed 2026-07-16:** distinguish the
  near-term AX landing MVP from the eventual production product home. The first
  may use restrained interaction and transparent in-development storytelling;
  a later version can add playable proof, richer scroll narrative, and stronger
  Steam-facing conversion once the corresponding game/demo evidence exists.
- ✅ **AX review mode — confirmed 2026-07-16:** the first landing is submitted
  as a URL rather than presented live. Reviewers will open and inspect it
  without a narrated walkthrough, so the page must communicate its essential
  product story unaided and cannot rely on the developer to bridge missing
  context.
- ✅ **Immediate delivery constraint — confirmed 2026-07-16:** the AX landing
  must be completed now. The workflow should therefore freeze the accumulated
  grilling into a concise PRD, implement an attainable submission-first page,
  and defer production-grade interaction rather than extending the interview or
  blocking on a perfect final design.
- ✅ **Brand-language direction — confirmed 2026-07-16:** the Hero headline
  should be written in English. English may be used wherever it produces a
  stronger global-facing brand expression; the project should not force Korean
  copy into every prominent surface.
- ✅ **Product name status — confirmed 2026-07-16:** `Terrain_Game` is a working
  repository/project name, not an approved market-facing title. A more intuitive,
  distinctive, and brand-capable game name must be explored before Hero copy is
  finalized, because the name and headline divide the explanatory burden.
- ✅ **Naming semantic center — confirmed 2026-07-16:** the market-facing title
  should foreground the fantasy of authoring a decisive war, not terrain as an
  isolated mechanic. Terrain and geography enable that fantasy; match
  compression and low micromanagement are supporting promises for Hero and
  subheadline copy rather than the title's required literal subject.
- ✅ **Naming form constraints — confirmed 2026-07-16:** avoid coined words.
  Prefer one or two established English words, ideally functioning as a noun or
  noun phrase rather than an imperative, sentence, or explanatory tagline.
- ✅ **Provisional market-facing title — selected 2026-07-16:** use
  `Strategy Ground` as the working candidate while developing the PRD and Hero
  copy. This is not a final public name, repository rename, trademark decision,
  or domain commitment; reassess it in the complete name/Hero/descriptor lockup.
- ❓ Secondary segments, buyer/user distinction, and priority launch geography.
- ❓ The first problem statement and the real alternatives being displaced.
- ❓ Final public promise, proof strategy, and acceptable claim strength.
- ❓ Release scope: prototype validation, demo, early access, full launch, or a
  staged sequence.
- ❓ Business model and pricing.
- ❓ Steam/platform strategy and whether browser play is product, demo, or
  validation surface.
- ❓ Multiplayer/PvP scope and timing.
- ❓ Landing page primary CTA and conversion funnel.
- ❓ Whether the landing needs accounts at all; if so, why Email/password is the
  right first method instead of or alongside a lower-friction waitlist.
- ❓ React, Next.js, or another landing stack. ADR 0016's “do not adopt Next.js”
  applies to the then-current game build decision and must not be silently
  generalized into a permanent ban on a separate marketing site; the landing
  stack needs its own evidence-based decision.
- ❓ Final information architecture, sidebar, scroll narrative, motion system,
  visual theme, and asset direction.
- ❓ The interactive demo's fidelity, cost, fallback behavior, and relationship
  to unvalidated game UI.
- ❓ How prominently the public landing should expose development status.
  Current direction: development state can serve as evidence and community
  context, but its hierarchy and conversion role remain to be decided.

## 8. Recommended grilling order

Ask one decision at a time, with a recommended answer and explicit consequence:

1. PRD audience and decision function.
2. Product stage and release claim boundary.
3. Initial target player and strongest unmet need.
4. Competitive alternatives and differentiated promise.
5. Core experience proof and MVP validation plan.
6. Product requirements, non-goals, and risk gates.
7. Business model, distribution, and platform sequence.
8. Success metrics and falsification criteria.
9. Landing audience, CTA, narrative, and evidence hierarchy.
10. Landing technology, Firebase service scope, interactive demo, and launch
    operations.
11. Visual research brief and design-system work using the installed skills.

## 9. Guardrails for the next phase

- Keep sealed mechanics distinct from provisional dials and marketing claims.
- Do not let the deep simulation design substitute for audience evidence.
- Do not advertise multiplayer, a release date, final match length, or a fully
  working end-to-end game without corresponding evidence.
- Treat the landing page as a derived product surface, not the authority for
  game rules.
- Prefer showing the judgment fantasy—reading terrain, choosing a plan, making
  a commitment, seeing consequences—over listing every system.
- Research competitors before sealing the navigation or story structure.
- After grilling, write the PRD into an appropriate new document rather than
  silently changing `SPEC.md` or `DESIGN.md`.
