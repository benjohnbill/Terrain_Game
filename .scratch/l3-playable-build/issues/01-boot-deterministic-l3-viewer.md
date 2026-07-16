# 01 — Boot a Deterministic L3 Viewer

**What to build:** Add the parallel L3 preview path and make it boot a canonical
TypeScript Game Runtime from an accepted authored-world identity and seed. A
player opening that path can see the current actor and an initial viewer-safe
match projection through React while the legacy play path remains independently
runnable.

**Blocked by:** None — first implementation ticket after its specification gates close.

Status: needs-info

Specification gates: Wayfinder 05, 06, 09, 10, and 12.

- [ ] The L3 preview path boots beside the retained legacy play path and does not convert it in place.
- [ ] Equal authored-world identity and seed produce equal initial viewer projections in browser and Node.
- [ ] React displays the current actor and a viewer-safe match summary without receiving authoritative match state.
- [ ] The Runtime surface does not add snapshot or subscription behavior.
- [ ] Rule execution has no implicit DOM, renderer, browser-global, time, or entropy dependency.
- [ ] Type checking, the production build, emitted-ESM browser/Node verification, and the retained legacy test suite pass through named project commands.
