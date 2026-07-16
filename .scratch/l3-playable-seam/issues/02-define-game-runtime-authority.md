# Define Game Runtime Authority and Its Interface

Type: grilling
Status: resolved
Blocked by: none

## Question

What authoritative state and behavior belong behind the Game Runtime seam,
what is its smallest useful interface for callers and tests, and how must
intent submission, events, snapshots, subscriptions, seed, clock, errors, and
serialization behave so React and Node use the same rules without owning them?

## Answer

Adopt a stateful Game Runtime that privately owns authoritative match state and
lets no caller hold it. Every caller — React, the renderer, bots, Node tests —
enters through the same narrow door and receives only what its viewer is
entitled to know.

### 1. State authority — the Runtime privately owns match truth

The Runtime instance owns authoritative match state. Callers never receive a
reference to it. They receive a viewer-specific projection in which forbidden
values are **absent**, not present and concealed.

Decision basis (user, 2026-07-16): the game's own information design already
requires this — player-facing information surfaces receive values filtered by
confidence band and by ownership, never raw truth. A boundary that hands over
truth and asks callers not to look is a convention, not a boundary.

Rejected alternatives:

- **External state plus a public pure reducer.** The UI-level caller holds
  authoritative hidden truth. This is the pattern the current legacy route
  already exhibits: `js/ui.js:307-326` iterates every faction and renders exact
  `calculateMilitary()` and `gold`, including enemies, because `GameUI` receives
  the whole `Game` object. Incompatible with Fog non-leakage.
- **Opaque functional state token.** The caller holds an authoritative blob it
  is asked not to inspect. In JavaScript that opacity is a convention, and the
  same caller then holds both the band projection and the truth it was blurred
  from. Any holder that could enforce real opacity is the stateful Runtime
  itself.

### 2. Viewer projection — blur once, at the projection seam

The Runtime applies the information model when it builds a viewer projection,
once per projection. Downstream consumers receive bands only; no downstream
surface re-derives an estimate from truth.

Evidence for the rule: `js/command-preview.js:102-104` currently calls
`estimateRange(defenseForce, confidence, seed)` — it reads the **true** defense
and blurs it at read time — and line 78 additionally computes a truth-derived
`forecast`. The resulting card carries `defenseForce` and `forecast` (truth)
next to `defenseEstimate` and `forecastRange` (blurred), and `js/ui.js:156-157`
resolves them with fallbacks (`preview.forecastRange || forecast`,
`preview.defenseEstimate ? ... : String(preview.defenseForce)`) that print truth
when a blurred field is missing. Today the valid path always populates the
blurred fields, so nothing leaks; the protection is caller discipline, not
structure. Blurring at the projection seam removes the class.

### 3. Command preview — a separate pure module outside the Runtime

Preview is `preview(view, intent) -> PreviewCard`: a pure function of a viewer
projection and a candidate intent, importing the shared rule modules. It is not
a Runtime method and does not live in React.

Rationale: preview needs the rules but must not need truth. Audit of
`buildAttackPreview` shows exactly one truth-dependent input — the defender's
force — and everything else is either the viewer's own state or public
geography. Once the projection carries the defense band, preview runs with no
access to truth at all, which makes the leak class in §2 structurally
impossible rather than merely avoided.

Rejected alternatives:

- **Runtime method.** Works, but computes next to truth, so the §2 leak class
  survives and is prevented only by discipline.
- **React-owned preview.** Puts combat rules in the UI, contradicting ADR 0039
  and ADR 0040, and strands bots — which also need forecasts and are not React —
  forcing a second copy of the formula.

### 4. Bots and turn flow — bots are callers; the Runtime never sleeps

- A bot is an ordinary caller. `decideBotIntent(view, seed) -> Intent` produces
  an intent from the bot's own viewer projection, using the same preview module
  the human UI uses; the intent is then submitted through the same door as a
  human intent.
- **Turn order is a rule and stays in the Runtime.** The Runtime knows the
  current actor and rejects an intent submitted out of turn. A caller-side bug
  cannot skip or reorder a turn.
- **Pacing is presentation and stays outside.** The Runtime resolves and returns
  immediately; it never sleeps. How long to dwell on a bot's move is a UI dial.

Rationale:

1. A bot cannot cheat by construction: it holds a projection, not truth. The
   guardrail "no caller, including a bot, receives authoritative hidden truth
   merely because it runs in the same process" holds for free.
2. It is a self-check on the seam: if a bot can play a full match through the
   same interface a human uses, the interface is complete.
3. It separates the two concerns currently fused in `js/main.js:355,430`, where
   `setTimeout` chains carry both turn order and display pacing, and
   `js/main.js:201,410` mutate `currentGame.state` directly.

Measured basis for "the Runtime never sleeps" (`mockup/combat-calc/tournament.js`,
200 matches, ladder brain, 5 seats, 2026-07-16): **1.17 ms per whole match**,
≈21 µs per faction-turn. A complete match resolves inside a single 60 fps frame.
The current 500 ms bot delay is therefore deliberate pacing at roughly 23,000×
the actual computation, not compute latency. Parallelising bots is not
applicable — turn-based bot decisions are causally sequential — and asynchrony
addresses blocking the project does not have. Keeping bots outside the Runtime
preserves a cheap escape hatch: a future expensive bot can move to a worker
without changing the Runtime.

### 5. Serialization — the intent log plus the seed is canonical

- A match is reproducible from `(authored world identity, seed, ordered intent
  log)`. That triple is the canonical durable form.
- **Events are presentation output**, not the source of truth. Their schema stays
  free to change.
- **No snapshot API in v1.** Replay-from-intents costs ~1.17 ms per match, so a
  snapshot buys nothing that determinism does not already provide.

Rejected alternatives:

- **Event sourcing as the source of truth.** Freezes event schemas and creates
  migration obligations before save/replay are product requirements.
- **Snapshot as the canonical save.** Freezes the internal state schema while the
  war model is still being actively tuned (open R14 war-decisiveness pass;
  slice-2 tickets 10–11).

Accepted cost: a saved intent log is bound to the rule version that produced it;
changing a rule replays it differently. Schema-based alternatives pay the same
cost as migration debt, and only this option freezes nothing now.

### 6. Consequent interface

The decisions above determine the surface; nothing further is added by default.

```
Runtime (privately owns authoritative match state)
  currentActor                    -> ActorId
  view(viewerId)                  -> MatchView      // viewer-safe; blurred here, once
  submit(intent)                  -> GameEvent[]    // validate -> resolve -> advance; returns immediately

Pure modules outside the Runtime (no access to truth)
  preview(view, intent)           -> PreviewCard    // used by both the human UI and bots
  decideBotIntent(view, seed)     -> Intent         // submitted through the same door
```

Consequences that follow and are not separate decisions:

- **No subscription API.** Callers pump; `submit` returns the events. Push
  delivery would add lifecycle complexity for no gain in a turn-based game.
- **Seed and clock are injected.** Required by ADR 0040; rules read neither
  `Date.now()` nor `Math.random()` (both of which the legacy route uses —
  `js/game.js:228`, `js/game.js:374,395,431`).
- **Invalid intent is rejected without a state transition** and with a reportable
  reason (spec.md US16).
- **Internal decomposition is an internal seam.** The Runtime may implement
  transitions as pure functions behind a thin state-owning shell; that is an
  implementation choice, not a caller contract.

### Scope boundaries

- What each viewer may know remains owned by
  [issue 03](03-define-viewer-knowledge-contract.md). This ticket fixes that a
  projection exists, that it is the blur seam, and that truth is absent from it —
  not which categories it carries.
- Naming of the interface types is provisional. Term registration follows the
  documentation audit and [issue 12](12-partition-spec-handoff.md); no domain
  term is sealed here.

Decision source: user agreement, 2026-07-16 (§1 "너무 당연하게 A 아닌가?
정보창으로는 신뢰도에 따라 범위/소유에 따른 값으로 제공을 받는게 맞잖아";
§3 "(다)로 가자"; §4 "OK"; §5 "(iii) 으로 가자").
