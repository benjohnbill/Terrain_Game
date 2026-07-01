# ADR 0023: Province Status and Control Summary From Front Sectors

Date: 2026-07-01

Status: Accepted

## Context

ADR 0022 made front sectors the formal territorial ownership unit for the MVP.
That means a named province can contain mixed sector control and should not be
forced into a single hard owner for internal logic. The game still needs
province-level summaries for situation judgment, map color, AI/global
evaluation, rankings, and reports.

## Decision

Use two derived province summaries:

- **Province status** is perspective-based:
  `computeProvinceStatus(province, perspectiveFactionId)`. It is used by
  player-facing situation judgment and can differ by observer.
- **Province control summary** is perspective-neutral. It aggregates sector
  `controlWeight` shares, dominant faction, dominant share, mixed-control flag,
  and contested sector ids for statistics, rankings, AI/global evaluation, and
  neutral map summaries.

Province status is not the same thing as the situation axis from ADR 0019.
Status is the background control/contact state of the province; situation axis is
the current-turn interpretation of why the player should look there (`위협`,
`기회`, or `불확실`). For example, a `split` province may be a threat if enemy
force is pressing a valuable sector, an opportunity if the enemy-held sector is
weak, or uncertain if information confidence is too low.

Province status uses `controlWeight` share. From a given faction's perspective:

- share >= 70% is controlled enough to be `secure`, `threatened`, or `border`;
- 30% < share < 70% is `split`;
- share <= 30% with another faction >= 70% is `occupied`;
- active conflict makes the province `contested` regardless of share.

`Border` means direct contact with a rival or enemy sector without active
conflict. `Threatened` means no direct border conflict is active, but a rival can
reach a perspective-held sector next turn or within the current operation range,
with sufficient information confidence or report support.

Information confidence is a separate layer over status. `Uncertain` is not a
province status value. Low confidence is surfaced through the situation-judgment
`불확실` axis and confidence overlays, so the game can express combinations such
as border-but-uncertain, split-but-uncertain, or occupied-but-poorly-scouted.
`Threatened` requires sufficient confidence or report support; otherwise the
province remains at the best-known status and is flagged as uncertain.

When multiple statuses apply, display priority is `contested` → `split` →
`occupied` → `border` → `threatened` → `secure`.

## Considered Options

- **Hard province owner:** rejected — front-sector ownership can be mixed, and
  forcing a single owner hides the actual operational state.
- **Only sector-level display:** rejected — accurate but too noisy for
  map-first situation judgment and global summaries.
- **Perspective status plus neutral control summary:** accepted — it keeps
  internal territorial truth at sector level while giving UI, AI, and ranking
  systems the summaries they need.

## Consequences

- The same province can be `occupied` to the player, `secure` to its holder, and
  differently summarized for another observer.
- Situation judgment can visualize intermediate control states, such as mixed
  ownership, contested border colors, or uncertainty from incoming reports.
- Situation judgment consumes both province status and situation axis: status
  drives the base control/contact encoding, while axis drives the current-turn
  highlight reason.
- Visual encoding should keep the layers separate: province status/control share
  drives base fill or ownership mix; situation axis drives border, pulse, or
  highlight treatment; confidence drives fog, hatching, dotted outlines, or
  uncertainty overlays.
- Combat and defense result reports should present both levels: the direct
  front-sector outcome and the resulting province status/control-summary change.
  This keeps the one-turn operational result legible while preserving the
  province-level strategic meaning.
- Status confidence and uncertainty are represented separately from the status
  value; `uncertain` is not added to the status vocabulary.
- Neutral/global systems must read province control summary rather than
  pretending province status is universal.
- Province-level map color should be derived from status and control share, not
  from a single stored province owner.
