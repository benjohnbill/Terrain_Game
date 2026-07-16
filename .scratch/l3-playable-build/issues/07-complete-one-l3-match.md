# 07 — Complete One L3 Match

**What to build:** Make the accepted L3 match mode playable from authored-world
setup through human and bot rounds, wars, and the legal match ending. The player
can finish one uninterrupted match, understand the outcome, and start another
without developer controls.

**Blocked by:** 06 — Carry a War to an Accepted Outcome.

Status: needs-info

Specification gates: Wayfinder 08, 10, and 12.

- [ ] The accepted starting state, human seat, bot participation, command set, and stopping point match the Production specification.
- [ ] Play can continue through the required rounds and wars without page refreshes or developer intervention.
- [ ] The match ends only through its accepted decision-point or draw path and never through last-faction-standing or percentage-of-hexes legacy checks.
- [ ] The ending is explicit, final, and explains why play stopped and what outcome occurred.
- [ ] A completed match can be reproduced from authored-world identity, seed, and ordered intent log.
- [ ] Starting a new match resets authoritative and interaction state without reviving the legacy play implementation.
