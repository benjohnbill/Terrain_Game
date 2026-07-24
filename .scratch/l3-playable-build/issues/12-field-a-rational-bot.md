# 12 — Field a Rational Bot on the Player's Own Instruments

**What to build:** An opponent that reasons through the same instruments the human
uses. From its own fogged projection it computes the per-front tactical R, the
eligible-fronts average, and the plan threshold needles, and it decides from those
reads. Where the decision is genuinely unmeasurable, a **disposition** parameter
governs it. It plays the range under the same irreducible uncertainty the human
faces — it is not an optimal solver.

**Blocked by:** 11 — Resolve Plan-Versus-Plan Matchups.

Status: needs-info

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): gate 08 § Answer axis 6 (the bot definition in full);
gate 02 § Answer §4 (`decideBotIntent(view, seed) -> Intent`; bots are ordinary
callers through the same door; the Runtime never sleeps for pacing);
duel-pivot ledger Gate 6 (what the bars mean and what the bot therefore reads);
`docs/features/tactical-plan-ai/` (the disposition concept and the deterministic
read primitives — the only parts of the archive bot that survive).

**The archive bot is discarded, not ported.** Its multipolar logic — which rival
to fight, war appetite, stall timers — is moot in a duel with one enemy and a
single terminus. Take the disposition concept and the deterministic read
primitives; leave the rest in the archive.

**Slice scope:** one balanced disposition ships. Disposition variants are an
iterate axis, not this ticket. Bot judgment quality is expected rough on first
play — this is data-gathering, not a balanced showcase.

- [ ] The bot receives only its own viewer projection; no code path gives it authoritative truth, the opponent's pre-reveal commitment, or a wider view than a human in its seat.
- [ ] It submits through the same `submit` door under the same validation and the same turn rules as the human; an out-of-turn or illegal bot intent is rejected exactly as a human's would be.
- [ ] It uses the **same** preview module the human UI uses, not a second copy of the forecast.
- [ ] It computes its per-front R and its eligible-fronts average from the same primitives that drive the EVAL BAR, so its reads and the player's are the same kind of read.
- [ ] It attacks where its front R exceeds its own average — the soft spot — and defends where the enemy's threat exceeds its own, rather than following a scripted opening.
- [ ] Commit sizing, plan choice among viable plans, capital-strike timing, and exposure tolerance are governed by the single balanced disposition within a rational range, and each is identifiable in the code as a disposition-governed judgment rather than a hardcoded constant.
- [ ] It commits blind, simultaneously with the human, and no path lets it react to the human's allocation before the reveal.
- [ ] No stall timer, patience policy, or forced-termination heuristic exists in the bot; it never force-closes a match.
- [ ] It is deterministic for equal `(view, seed)`, so a full bot-played match replays identically in Node and browser.
- [ ] A bot-versus-bot match runs to a capital fall unattended — the seam self-check: if a bot can play a whole match through the human's interface, the interface is complete.
