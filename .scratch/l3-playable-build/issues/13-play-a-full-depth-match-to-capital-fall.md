# 13 — Play a Full-Depth Match to Capital Fall

**What to build:** Nothing new — the acceptance. One real, complete 1v1 duel,
human versus bot, at full compound depth, run at its natural player-paced length
until a capital falls, producing undistorted real-play data. This is the ticket
that says the slice is done.

**Blocked by:** 12 — Field a Rational Bot on the Player's Own Instruments.

Status: needs-info

Specification gates: Wayfinder 10, 12.

Contract (interim pointers): gate 08 § Answer — axis 1 (match mode), axis 7
(stopping point) and the scope trade; ADR 0042; duel-pivot ledger D6.4 (match
length is player-paced and induced by decay, target 15–30 minutes as a fixed 가안
whose change requires data or a business reason); `docs/features/match-arc/TEST-LADDER.md`
(the L3 rung is fun, tension, and skill expression); C02.7 (presentation pacing
only).

**The bought benefit, stated plainly.** Gate 08 traded failure localization away
for undistorted real-play data. This ticket is where that trade pays or does not.
A shortcut that makes the match finish faster by changing what happens is
forbidden — it destroys exactly the thing the trade was made for.

**Iterate targets, expected rough.** Partition and terrain balance, and bot
judgment quality. First play is data-gathering, not a balanced showcase; a rough
verdict on either is a measurement to record, not a failure of this ticket.

- [ ] One uninterrupted match runs from setup through capital fall with no page refresh, no developer control, and no manual intervention in the rules.
- [ ] Every layer is live in that match: the two-realm partition, chosen capitals, the commit-and-reveal loop with the single chip stack, the decay engine, decisive-battle combat, Standard Fog and reconnaissance, the EVAL BAR, plan selection, plan-versus-plan matchups, the capital guard, and the bot.
- [ ] The match ends only by capital fall, and the victory screen is shown.
- [ ] No compression, speed-up, or shortcut alters the outcome: an accelerated run and an un-accelerated run of the same `(worldId, revision, seed, intent log)` produce identical events and identical final state. Pacing is presentation only.
- [ ] The observed match length and turn count are **recorded as a measurement** against the 15–30 minute target; a miss is reported, not tuned away inside this ticket.
- [ ] The recorded evidence shows the decay engine doing its job: the trailing side's income and force ceiling fall over the match, and the terminal gamble is attributable to that pressure rather than to a clock.
- [ ] A human playtester can distinguish the information categories and explain how a reconnaissance purchase changed a commitment judgment.
- [ ] A human playtester's verdict on the L3 rung — tension, skill expression, whether the reveal delivers — is captured as a stated verdict, with who judged it and what would have counted as a failure.
- [ ] The full `verify:game` gate passes, with any command whose threshold Wayfinder 10 has not filled still failing `pending` rather than reporting green.
- [ ] The match is demoable and reproducible from `(worldId, revision, seed, ordered intent log)` in Node and browser.
- [ ] Deferred-by-design absences are listed in the evidence rather than discovered later: the Moscow-trap fall path, settlement negotiation, reserves, multi-stage operations, disposition variants, human-versus-human play, and art beyond grey-box.
