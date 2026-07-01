# Payoff Loop Mockup — Design-Intent Questions

For the planning session that holds the design authority. Each question is tied
to a concrete choice the mockup had to make (a placeholder) or a place where the
payoff-loop spec is OPEN or silent. The mockup does not answer these; it makes
them visible so they can be decided deliberately.

Source of truth: `docs/superpowers/specs/2026-07-01-phase-1-mvp-payoff-loop-design.md`.

---

## A. Skill edge (pillars 2–3) — the spec's primary OPEN

The mockup's placeholder: the command card has a **"내 판단 vs 프리셋 기본값"
slider** that surfaces a `+X% 기대이득` delta and nudges the forecast band.

1. **Number vs feel.** Does a numeric "+X% over the default" make the skill
   legible, or does turning judgment into a displayed number undercut the *feel*
   of a good read (it becomes a solved calculation, not a judgment)? What is the
   non-numeric alternative — a shifted forecast band only? a confidence widening?

2. **Before or after resolution.** Should the edge be shown **pre-commit**
   (predictive, as mocked) or **revealed after** the turn resolves (you learn
   your read paid off)? Pre-commit invites "just max the slider"; post-hoc
   rewards a genuine read but is less immediate. Or both (a hint before, a
   verdict after)?

3. **Which knob carries the edge?** The mock uses one abstract "상황 판단"
   slider. ADR 0017 / the command card describe intent, intensity, and sources.
   Which of these actually expresses skill, and is it one dimension or several?

## B. Opportunity chaining

The mockup's placeholder: after a conquest, newly-opened adjacent targets pulse
with a gold ring, plus a text line in the right-rail edge panel.

4. **Persistence.** Is a transient map highlight (rings that fade) enough, or does
   "what this opened" need a persistent surface so the player can plan the chain?

5. **Depth.** Show only immediate adjacencies, or a projected multi-hop chain?
   The spec frames the snowball as "expanding possibility" — how far ahead does
   that possibility render before it becomes noise?

## C. The "Am I winning?" glance

6. **Momentum signal.** The mock tracks recently gained/lost **provinces**
   (▲/▼ chips). The spec's analogue is the **gold-graph *slope*** (power trend).
   Should momentum be province events, a power-slope sparkline, or both? Over
   what window?

7. **Which rival does the power bar anchor to?** The mock uses **self vs the
   single strongest rival**, and the bar's rival auto-switches when the ranking
   changes (in the canned run, the strongest rival flips mid-game). Is the
   strongest rival the right anchor, or self-vs-field, or a fixed nemesis? The
   auto-switch is legible in the ladder but can feel unstable in the bar.

## D. Map emphasis

8. **Full heatmap vs sparse briefing.** The mock always colors **every** hex by
   the active lens (a full heatmap). ADR 0013 says only the most relevant
   locations for the turn should get strong emphasis — "avoid turning the whole
   map into visual noise." Should the default be a sparse, briefing-driven
   highlight (this turn's hot spots only), with the full heatmap as an opt-in?

9. **Development encoding weight.** The growth spine stacks **three** channels for
   development — color intensity + building-icon density + glow. Strong "it
   lights up" feel, but potentially loud. Is triple-encoding right for the core
   growth payoff, or should one channel carry it and the others recede?

10. **Information confidence on the map.** The mock marks low confidence with a
    small purple `◔` corner glyph (plus the hover chip / command card %). Is a
    map-level uncertainty cue wanted at all, or is confidence better confined to
    hover/card so the map stays clean? If wanted, glyph vs a subtle fog
    (desaturation)?

## E. Structural (for the eventual implementation, not the feel)

11. **Province vs hex granularity.** The mock maps **one province to one hex** for
    legibility. The real design layers named provinces over hex clusters
    (ADR 0002 / 0004). Do the payoff surfaces (glow, chip, command card) attach
    to a **province** or per-hex, and how does "territory lights up" read at the
    real scale of 25–40 provinces?

---

### Not invented here

Where the spec is OPEN (pillars 2–3, preset differentiation) the mockup only
placed the lightest placeholder and flagged it `OPEN ?`. It did not choose a
direction. Time pressure (SPEC "To validate") is intentionally absent — it is an
opt-in mode, not part of this loop.
