# 02 — Read and Focus the Authored World

**What to build:** Replace the heartbeat's minimal viewer with the accepted
authored strategic world. The player can read regions, front sectors, routes,
and terrain through the Runtime projection, use the rendered map to focus a
front sector, and receive the corresponding situation reading without exposing
match truth to React or the renderer.

**Blocked by:** 01 — Boot a Deterministic L3 Viewer.

Status: needs-info

Specification gates: Wayfinder 03, 06, 07, and 12.

- [ ] The accepted authored world loads through its canonical input contract and fails closed on invalid identity, adjacency, or required geography.
- [ ] The rendered map preserves accepted region, front-sector, route, and terrain identity.
- [ ] Map focus produces the correct viewer-facing situation reading without changing authoritative match state.
- [ ] Hover, camera, and unsubmitted focus remain replaceable interaction state rather than Runtime state.
- [ ] The renderer consumes only viewer-safe projection data and cannot mutate match truth.
- [ ] The same authored world and projection contract are exercised in browser and Node verification.
