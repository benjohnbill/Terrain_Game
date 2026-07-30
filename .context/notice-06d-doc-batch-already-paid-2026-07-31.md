# Notice for the 06d session — your doc-sync batch is already paid on `main`

Written 2026-07-31 ~03:20 by the parallel session in pane `wD:p9`, for the 06d
implementation session in `wD:pA` / worktree `Terrain_Game-06d`. Short on purpose:
you know 06d better than this note does. It exists to stop one duplicate.

## The one thing to change

Your todo **"Pay the doc-sync batch, including the seal-amends-ADR stamps"** —
**do not author it.** It landed on `main` while you were implementing:

- **`docs/adr/0047-the-sector-is-the-unit-of-population-accounting.md`** (new,
  `467a276`) — the origin-grain ruling as an ADR, with the mandatory-ADR trigger
  argued (cross-feature model).
- **ADR 0045's header** — stamped `Amended by ADR 0047`, with the delta.
- **match-arc MT-⑥** — same banner, since it is 0045's Production birthplace.
- **`docs/adr/README.md`** — 0047's row, and 0045 marked amended.

`main` is at `467a276` and pushed. **Rebase and drop your batch**, rather than
writing a second set of stamps onto the same headers.

## We reached the same ruling independently — no substance to reconcile

Your claim commit (`b6fae41`) and ADR 0047 agree: origin composition moves to
sector grain with the register, and the rollup alternative is rejected because
valuing one captured sector's civilians needs a within-province apportionment,
which is R17 restored. Same answer, same reason.

**Your diagnosis was sharper than mine and the ADR does not carry it.** You found
that a half-move makes `#removeDead` throw on *every* casualty, because
`registers[region]` is indexed with a key taken from `origins`. The ADR argues
from a coarser case (a partial capture at high mobilization). If you want that
line in the record, add it to ADR 0047's Context — it is the better statement.

## Two small deltas worth a look

1. **Item list.** Your claim says ADR 0045's "title and items 2, 4, 5". ADR 0047
   says items **2, 3, 4, 5** — item 3 is "Province-local civilian shortages
   prorate", which becomes sector-local. Check whether your code moved the
   recruitment scarcity bucket; if it did, 0047's list is right and yours is a
   line short. The title is not changed on `main` — say so if you think it should
   be.
2. **Scope carve-out.** 0047 item 7 states what did *not* move — `Realm.regions`,
   `Sector.regionId`, the partition and the world schema stay region-keyed,
   because what changed grain is population accounting, not the region concept.
   Worth checking your diff against, in both directions.

## Also on `main`, and NOT yours to act on

Ticket **07**'s two `needs-info` items closed while you worked. Mentioned only so
that a rebase conflict in `07-*.md` or `DECISIONS-OWED.md` does not look like a
mystery, and so you do not re-derive it:

- **CP-⑤** (`capital/RULINGS.md`) re-cuts the capital guard coefficient to 가안
  2,500/pop. Part 2 row #10 is closed; its "350 vs 1500" framing was wrong.
- **CP-①'s header** now carries three amendment banners. The stale designation
  rule is **item 1** (R3), not item 3 — both registers had misfiled it.

None of this touches 06d. Do not fold it into your ticket.

## Baseline

`main` at `467a276`: `verify:game` all lanes PASS with parity PENDING by design,
both hosts `29f214a11fc56ef8`; `test:node` 217, `test:browser` 21, root
`npm test` 562, `lint:docs` 0 blocking / 12 advisory.
