# Strategy Ground AX Landing Design

> **Status:** Approved implementation design  
> **Date:** 2026-07-16  
> **Source:** Session grilling, product context memo, and approved map-first
> product-story direction.

## Experience

The reviewer opens a standalone URL at a desk, without narration, and should
feel that they are reading an operational map rather than entering a generic
neon game dashboard. The page moves from premise to proof to development state
in one continuous vertical story.

## Visual system

- **Scene:** a dark cartographic table under controlled task lighting.
- **Color strategy:** committed near-black blue-green base, mineral green map
  surfaces, brass for planned action, and restrained vermilion for danger.
- **Typography:** condensed industrial display type for English brand moments;
  a highly legible Korean sans serif for explanations.
- **Imagery:** an inline fictional operational SVG map is the primary image.
  Topography, routes, fronts, and control areas are information, not decoration.
- **Avoid:** neon cyan sci-fi HUD, glass-card grids, gradient text, emoji icons,
  fake probability readouts, decorative grid backgrounds, and repeated eyebrow
  labels.

## Page structure

### Navigation

A compact fixed header contains the wordmark, `The Idea`, `War Model`, and
`Development` anchors plus a restrained `Development Build` link. Mobile uses a
single accessible menu button.

### Hero

The wordmark and headline—`Shape the war before the battle begins.`—occupy the
left side. A fictional map composition occupies the right and previews the four
operation states. The primary CTA scrolls to the model; the secondary CTA opens
`game.html` and identifies it as a development build.

### Product thesis

A large statement contrasts accumulated consequence with repetitive action.
Supporting copy names terrain, force, information, and timing as the connected
decision set. The layout uses one broad composition, not a card comparison.

### Interactive war model

Four semantic buttons select `Read`, `Position`, `Commit`, and `Consequence`.
Each state updates:

- the active map overlay and route;
- a concise state title and description;
- one decision and one visible consequence;
- the current step indicator and accessible live-region text.

The interaction is explanatory. It does not calculate combat odds or claim to
be current game runtime.

### Emergent outcomes

Two opposing compositions—prepared reversal and catastrophic commitment—show
that the system should support both stories. They reuse the map vocabulary but
do not reenact named historical battles.

### Principles and status

Product principles appear as a varied editorial list rather than identical
cards. Development state uses a three-part `Now / Next / Vision` progression,
explicitly without dates or implied completion percentages.

### Footer

The footer repeats the working-title status and development disclosure and
links to the current build. The repository PRD is not exposed through Hosting.

## Motion and behavior

- One orchestrated hero-map entrance and direct state transitions in the war
  model.
- No scroll-jacking, parallax, or content hidden until JavaScript runs.
- Hover and focus transitions last 150–250ms; state transitions use ease-out.
- `prefers-reduced-motion: reduce` disables animated travel and reveals final
  states immediately.

## Responsive behavior

- Desktop: asymmetric two-column Hero and interaction.
- Tablet: balanced stacked compositions with the map before detailed copy where
  comprehension benefits.
- Mobile: single column, visible menu control, 44px minimum targets, no fixed
  map width, and no horizontal overflow.

## Technical architecture

- `index.html`: semantic document structure, inline SVG maps, final copy.
- `css/landing.css`: tokens, layout, cartographic rendering, responsive states,
  reduced motion.
- `js/landing.js`: mobile navigation, anchor state, war-model state machine,
  and progressive enhancement.
- `game.html`: retained as the current development build.
- Firebase Hosting: static deployment only; no Authentication or Firestore for
  this submission.

## Verification

Run the repository static server and inspect at 375px, 768px, 1024px, and
1440px. Verify keyboard operation, reduced motion, all anchor links, the
development-build link, console output, and Firebase-hosted production URL.
