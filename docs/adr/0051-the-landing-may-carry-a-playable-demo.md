# ADR 0051: The Landing May Carry a Playable Demo, as an Opaque Artifact

Date: 2026-08-03

Status: Accepted

Decision source: user decision, 2026-08-03 — embed the live L3 build in the
landing page for a school submission, and amend ADR 0041 rather than leave its
isolation clause saying something the deployment contradicts.

Amends: ADR 0041 § Decision 1. Its fourth bullet — "the game build is not an
input to them" — is narrowed by a named, bounded exception. Its first bullet's
"marketing landing surface **only**" is corrected: the landing surface may also
carry a demo of the L3 build. Everything else in that decision stands, including
the distribution target and the direction of isolation that actually matters.

## Context

ADR 0041 separated two environments and gave the reason plainly: the landing
page's stability must not become a constraint on game architecture, and the
browser must stop being mistaken for the game's delivery contract. Both hold.

But the ADR also described the situation this decision creates, and declined to
call it a violation. § Context: *"the deployed artifact does today contain a
playable prototype alongside the landing page. That is a marketing surface
carrying a demo — not the game's shipping channel."* And § Costs accepted: *"The
browser stops being the delivery contract and stays the playtest host."* The
prohibition throughout is written in the vocabulary of shipping, distribution,
and delivery — never as "no browser hosting".

Three things nevertheless stood in the way, and each needed a different answer.

**The word "only".** `docs/SYNC-DEBT.md` had already adjudicated the tension
between § Context's tolerance and § Decision's "only", and ruled for "only": *"do
not 'fix' the `AGENTS.md` sentence to match reality — the sentence is the
intended end state; the deployment is what is wrong."* That adjudication was
correct for what was actually deployed. It is superseded here for a different
artifact, deliberately and by the user rather than by an agent reading the ADR
generously.

**The 2026-08-02 take-it-down ruling.** Newer than ADR 0041, sealed, and a direct
verdict on this exact iframe. Its **stated reason** is what matters and what
narrows it: the objection recorded at gate 11 was that the embedded prototype
demonstrates *"the multi-faction conquest design ADR 0042 retired"*, so the
public artifact was advertising a game this project no longer builds. An L3 duel
embed does not carry that defect. The reason has expired for this case while the
ruling stands for the old one — and the old one is now fully executed rather than
merely narrowed, because `game.html` and `assets/game/` leave the bundle in the
same batch that adds the demo.

**The pipeline-isolation bullet.** This is the only one that required an actual
amendment, because copying a built game artifact into the landing bundle breaks
it as written, whatever the artifact contains.

## Decision

### 1. The landing may carry a playable demo of the L3 build

ADR 0041's distinction between a marketing surface carrying a demo and a shipping
channel becomes normative rather than incidental. The landing page may embed and
link a playable build.

### 2. The demo crosses as an opaque built artifact

This is the boundary that keeps the isolation meaningful:

- The landing pipeline may **copy** the emitted bundle (`game/dist-viewer/`).
- It may **not** read the game's source, its config, or its module graph, and it
  may not import from the game tree. Where it needs to know which files a page
  requires, it reads that page's own tags — the artifact describing itself.
- It may rewrite the copied HTML's own asset paths to suit the hosting layout,
  because that is treating the artifact as an artifact.
- **The game build takes nothing from the landing in return.** No landing asset,
  route, config, or hosting concern is an input to it, and `base: './'` stays, so
  the bundle remains path-independent for a file server or a native shell.

The direction ADR 0041 was written to protect is the one preserved: the landing's
stability still constrains nothing about game architecture. What is given up is
the symmetry, which was never the point.

### 3. The distribution target is unchanged

A native shell remains the intended destination (ADR 0016 Stage 2, ADR 0041).
The browser is a development, playtest, and now **demonstration** host. Nothing
here makes Firebase the game's shipping channel, and a demo embed must not be
cited later as precedent that it is.

### 4. The demo must not misrepresent what it is

The landing's copy has to match the build it embeds. `PRODUCT.md`
§ Anti-references already forbids implying the prototype is a finished demo; the
same duty applies to the L3 build, which is grey-box and hot-seat. The build
section says development build and means it.

## Consequences

- `scripts/build-hosting.js` gains a `play/` step and loses `game.html`. The
  bundle is 14 files.
- The route is `/play`, created by `firebase.json`'s existing `cleanUrls`. No
  rewrites block is needed and no headers change: nothing sets `frame-ancestors`
  or `X-Frame-Options`, so a same-origin iframe works as-is.
- `cleanUrls` plus `trailingSlash: false` means the demo page is served at a
  file-like URL, so its document-relative asset paths are absolutised during the
  copy. This is why decision 2 permits that rewrite explicitly — it is not an
  incidental convenience, it is the mechanism the hosting layout requires.
- The gate-11 deferral in `docs/SYNC-DEBT.md` is **paid**: the iframe now points
  at a design this project builds, and the prototype's last published traces are
  gone.
- `AGENTS.md` § Environments and `DESIGN.md` need the "landing page only"
  sentence re-cut to match this decision. Until then they are stale in the
  direction this ADR names.

## Alternatives rejected

- **A capture (video or screenshots).** On `docs/SYNC-DEBT.md`'s sanctioned list
  and free of governance cost, but it cannot show that the loop runs, which is
  the whole claim the build section makes.
- **A separate Firebase site for the demo, iframed cross-origin.** Keeps the
  pipelines formally uncoupled, but buys that with a second hosting target, a
  `frame-ancestors` policy, and a second deploy — and it would still leave ADR
  0041's "only" wrong. The coupling it avoids is one-directional and already
  bounded by decision 2.
- **Building the game with `base: '/play/'`.** Removes the path rewrite, but
  spends the artifact's path-independence — the property ADR 0041 keeps for the
  native shell — to save three characters in a copy step.
