# Make Uncertainty Legible Without Leaking Truth

Type: prototype
Status: open
Blocked by: 03, 06

## Question

On the authored map, what is the cheapest L3 presentation that makes public
geography, own exact state, enemy estimate bands, last-seen positions, reach
cones, border alarms, and development-only placeholders distinguishable at a
glance? Determine what React owns, what the renderer owns, and whether the
existing SVG/Canvas approach is sufficient through live user reaction.

## Prototype constraints

- This gate is resolved by live user reaction, not by document reasoning alone.
  It must use the accepted authored world contract and viewer-knowledge matrix
  from gates 03 and 06.
- Public terrain and fortification remain readable under every Fog treatment.
  Hidden truth may not be placed in DOM attributes, renderer objects, tooltips,
  debug panels, or CSS-hidden elements.
- React owns application layout, panels, command composition, ephemeral focus,
  event presentation, and accessibility. The renderer consumes only a viewer
  projection and emits focus/gesture data; it owns geometry, map hit-testing,
  camera transforms, and map-layer drawing.
- The Runtime resolves immediately and never sleeps. Bot-event pacing is
  therefore a presentation choice: the prototype must test comprehension
  without making artificial waiting a rule-system dependency
  ([issue 02](02-define-game-runtime-authority.md)).
- A development placeholder must announce itself. It cannot imitate functional
  Fog or satisfy the L3 scouting gate.

## Existing renderer evidence

The authored-map workbench already draws the representative world as SVG,
including terrain polygons, sector seams, choke borders, routes, landmarks,
labels, and a smoothed coast silhouette
(`mockup/combat-calc/map-mockup.html:26-55,134-228`). The editor also uses SVG
(`mockup/combat-calc/map-editor.html:38,130-184`). That is enough evidence to
prototype semantic overlays before introducing a Canvas or PixiJS dependency;
it is not yet evidence that SVG meets the final interaction/performance gate.

## Prototype variants

### A. SVG semantic layers hosted by React

Reuse the authored SVG geometry in a renderer adapter. Keep terrain and
political geography stable; layer sector focus, confidence texture, estimate
glyphs, last-seen fixes, reach cones, border alarms, and command targets above
it.

- **Strength:** quickest route to a faithful clickable map, crisp labels, DOM
  accessibility, and inspectable layer ownership.
- **Cost:** many animated marks or broad translucent cones may eventually expose
  SVG update pressure; that must be measured rather than assumed.

### B. Canvas owns the full map surface

- **Strength:** cheap high-volume drawing and straightforward compositing.
- **Cost:** hit testing, accessible descriptions, semantic inspection, and text
  layout must be rebuilt. It spends migration budget before SVG has failed.

### C. React renders map cells directly

- **Strength:** familiar component composition.
- **Cost:** couples renderer internals to the UI tree and weakens the independent
  renderer axis accepted by ADR 0039. This is not recommended.

## Presentation hypotheses to put in front of the user

- **Public layer:** normal terrain, route, sector, fortification, landmark, and
  the control treatment selected by gate 03. Do not dim the whole board as a
  generic Fog effect.
- **Own exact state:** solid friendly marks and exact values in the focused
  panel.
- **Enemy estimate:** an uncertainty texture on the mutable military mark plus
  an explicit low–high band in the focused panel; never print a midpoint as if
  exact.
- **Last seen:** a dated/aged fix marker connected to a translucent reach cone;
  the cone communicates possible current position, not occupancy of every cell.
- **Border alarm:** a directional edge pulse/arrow and event item carrying only
  existence and heading.
- **Categorically hidden:** omit posture and current commit fields; explain
  their absence with stable copy rather than `?` values that look scoutable.
- **Development-only:** diagonal hatch plus a persistent `DEV — NOT IMPLEMENTED`
  badge and explanatory panel. Never use enemy truth as its fallback content.
- **Bot events:** an ordered event tray with immediate skip and deliberate
  step-through/autoplay. Runtime completion is instant; the player controls how
  long the explanation remains visible.

## Live evaluation script

The prototype session should ask one question at a time while the user performs
the same short sequence on two or three variants:

1. identify public geography and the currently focused front sector;
2. distinguish own exact state, enemy estimate, and categorically hidden state;
3. explain where a last-seen army might now be;
4. identify what a border alarm reveals and what it does not;
5. scout once and explain what visibly changed in the estimate and preview;
6. follow one bot event sequence, then use skip/step controls;
7. identify every development-only placeholder without instruction.

Record the user's words, the selected encoding, the rejected encoding, the
viewport used, and whether SVG interaction remained responsive. Only then can
the renderer and presentation contract be resolved.

## Recommendation

Prototype A first. Keep React responsible for shell, panels, command/event
flow, and ephemeral interaction; keep a dedicated SVG adapter responsible for
map geometry and viewer-safe overlays. Escalate to Canvas/PixiJS only if this
representative authored map produces measured interaction or layer-management
failure.

The honest cost is that SVG remains a hypothesis until the live session, and a
later renderer swap remains possible. This recommendation does not resolve the
gate; it prepares the concrete user test that does.
