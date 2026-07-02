# External Survey: Operational Wargames (Unity of Command Priority)

Source: research subagent (sonnet), 2026-07-02. Audits the 11-plan roster,
supply/route model, fog design, turn economy, and lean-hex presentation
against Unity of Command I/II, Panzer Corps/Order of Battle, and card-driven
wargames. Raw report below (agent's own sourcing caveats preserved at end).

---

## 1. UoC Mechanics Inventory

| UoC/UoC2/PzC mechanic | Closest of our 6 axes / plan | Match quality |
|---|---|---|
| Road/rail supply hub placement, MP-range tracing, decay off-road | routeDisruption (open side) | Partial — ours is a binary-ish route status; UoC treats logistics as a placed spatial resource with range math |
| Out-of-supply staged penalty (turn 1: fine → turn 2: can't attack → turn 3: defenseless) | routeDisruption → feeds garrisonDamage | Partial — a continuous *status* tied to route state, not a one-shot damage application; resets instantly on resupply |
| Encirclement → attrition → forced surrender | Encirclement and Annihilation (plan) | Clean |
| HQ command-point pool; artillery suppression (forgo attack to shell, suppress steps) | garrisonDamage (temporary) | Partial — folded into generic attack-plan magnitude rather than its own low-commitment prep action |
| Bridge/rail repair or demolition (HQ action) | routeDisruption (both directions) | Clean concept, but ours has no discrete "engineer" sub-action distinct from Supply Interdiction/Recovery |
| Amphibious/seaborne invasion (HQ-gated action) | Crossing/Landing Securement (plan) | Clean |
| Feint attack (HQ action) | confidenceGain (enemy-facing, negative) | Gap — no equivalent; see GAPS #2 |
| No-retreat order (HQ action) | riskProfile modifier on defense plans | Gap — see GAPS #3 |
| Replenish steps / reorganize (HQ action, spends resource points) | Recovery/Consolidation (plan) | Clean |
| Victory-tier timing (Decisive/Brilliant = capture objectives N turns early) | (no current equivalent — meta-layer above plans) | Gap — see GAPS #1 |
| Fog of War: intel markers reveal nationality + unit type + coarse strength band; sharpens via HQ intel-branch levels or recon | Fog estimate band (identity + magnitude) | Clean — directly validates current fog design |
| Hidden unit still projects ZoC into a visible hex (surprise contact) | Fog / sector-defense interaction | Clean-ish, worth confirming our fog model allows this |
| HQs and supply hubs always fully visible regardless of FoW | Fog design (what stays legible) | Clean — good precedent to adopt |
| Panzer Corps/OoB: entrenchment accrues passively (+1 def/turn stationary, lost on being attacked) | fortificationDamage (currently authored-only) | Gap — see GAPS #4 |
| Panzer Corps/OoB: suppression (temporary) vs efficiency/cohesion damage (slow-recovering) vs step loss (permanent) as three separate damage tiers | garrisonDamage (currently one bucket) | Gap — see GAPS #8 |
| Prestige/Resource Points: single currency spent on both repair and new unit purchase | Single-pool surplus (already our design) | Clean — validates the "single pool, multiple outlets" surplus model |

## 2. GAPS (ranked)

| # | Gap | Real-war meaning | Why it matters | MVP verdict |
|---|---|---|---|---|
| 1 | Turn-count/timing victory pressure (finishing early scores higher, independent of the plan used) | Operational tempo — a commander who clears an objective ahead of schedule frees reserves for the next front | Adds urgency beyond binary win/lose; rewards decisive commitment over the "safe recommended" slider value | Yes — layer as a completion-speed multiplier on sector-control reward, no new axis needed |
| 2 | Feint/deception plan: cheap action that *worsens* the enemy's read of you (negative confidenceGain aimed at them) rather than dealing damage | Deceiving the enemy commander about your intent/strength to draw reserves or provoke a bad commitment | Mirror-image use of an existing axis; currently every plan either helps or costs us, none manipulates the opponent's estimate cheaply | Yes — fits as a low-commitment, low-risk plan alongside Reconnaissance |
| 3 | No-retreat / fight-to-the-last order as a defense modifier | Command decision denying a garrison the option to fall back, trading a chance of total loss for maximum defensive output | Sharpens the stakes of sector loss — could make loss total (garrison destroyed) vs. partial (garrison escapes to reinforce elsewhere) | Yes — riskProfile toggle on Stronghold Defense / Delaying Defense, no new axis |
| 4 | Passive entrenchment accrual for an undisturbed garrison (fortification that grows from inaction, separate from authored/built fortificationDamage) | Defenders left alone dig in over time | Explains why a stalled offensive makes the next assault harder; natural complement to Delaying Defense and Recovery/Consolidation | Yes — background modifier, not a new plan |
| 5 | Discrete "soften first" prep sub-action (bombard/suppress only, no ground commitment) | Preparatory bombardment before the main push, its own operational choice | Currently folded into full attack plans; a standalone cheap prep action would let players buy down enemy garrison before committing the main slider | Yes — candidate for a 12th plan, low risk/low cost, non-combat-adjacent |
| 6 | Fog investment ladder: intel quality improves with sustained HQ/scout investment (levels), not just one-off recon | Standing reconnaissance assets and staff experience compound over a campaign | Gives long-run payoff to repeatedly focusing scouting on the same front | Yes — extends the already-OPEN fog design rather than a new system |
| 7 | Supply-hub network as a placed, spatial sub-game (engineers build hubs, MP-range tracing, road vs rail distinction) | Logistics as its own allocable resource, not a simple cut/open flag | Turns routeDisruption into an interesting spatial puzzle | Later-phase — a full placement mini-game is heavier than one-sector-one-turn MVP scope |
| 8 | Tiered damage model: temporary suppression vs efficiency/cohesion damage (slow-recovering) vs step loss (permanent) | Distinguishes "scared and disorganized" defenders from actually-destroyed ones | Directly relevant to the flagged open question of post-battle recovery pacing | Later-phase — would split garrisonDamage into sub-fields, a bigger schema change |

## 3. Turn-Economy Notes

- **Two-tier rhythm in UoC/UoC2**: routine moves are cheap per-unit actions, but game-changing actions (suppression, bridge demolition, feints, no-retreat) are gated behind a scarce HQ command-point pool. Cheap routine decisions + a handful of expensive "moments" per turn. Our analog: the committed-slider action is the "moment"; surplus redirection is the cheap secondary tier — worth keeping that framing explicit rather than treating surplus as an afterthought.
- **Speed itself is a currency**: UoC's Decisive/Brilliant victory tiers reward capturing objectives *ahead of* the turn limit. Worth stealing — currently nothing in the roster rewards speed independent of outcome.
- **Compounding investment**: HQs level up over a campaign from being used well — an argument for letting a front sector's scouting/command investment compound rather than reset each turn (echoes the fog-investment ladder).
- **Card-driven wargames (Paths of Glory)**: a *mandatory* periodic offensive prevents turtling; escalating deck tiers (Mobilization → Limited War → Total War) model a war growing in scale across acts — useful patterns if a multi-phase campaign layer is ever added.

## 4. Presentation Notes (lean hex map)

- Icon-based unit status, not silhouette memorization — damage, entrenchment, supply state as small consistent icons on the counter.
- Crisp fog boundary — FoW as a color-tinted overlay with a precise edge; "known-empty" vs "fog, might hide a unit" never ambiguous.
- Partial-reveal icons live only in the fog layer — intel markers (nationality + type + coarse strength band) visually lighter than fully-known counters, so certainty is legible at a glance.
- Command/logistics skeleton always visible — HQs and supply hubs ignore fog, giving a stable reference frame.
- Deliberately low unit density — every counter individually meaningful; no stacks.
- Bounded, small maps — deliberately constrained scope keeps tempo up.
- Cartographic hierarchy privileges logistics-relevant terrain — roads, rail, rivers, cities dominant; other terrain muted.
- Air/naval abstracted to effects, not simulated — bounded "theater assets" with use-counts, no per-unit tracking.

## Sources

unityofcommand.net forums/blog (blog 403'd — diary specifics are from search
snippets, treat exact thresholds as approximate), scientificgamer.com,
strategyandwargaming.com, gamedeveloper.com UoC design case study,
wargamer.com, explorminate.org, culturedvultures.com, steamcommunity.com
(supply, victory/turn-limit threads), magicgameworld.com (supply, fog),
panzercorps.fandom.com, saveorquit.com (Order of Battle), Wikipedia (Paths of
Glory), theboardgameschronicle.com.

Agent caveats: "rail repair" and "airstrike" as named HQ actions were not
independently confirmed (bridge repair/destroy confirmed); developer-diary
specifics sourced from snippets rather than full fetches.
