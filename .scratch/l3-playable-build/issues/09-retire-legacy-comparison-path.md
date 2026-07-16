# 09 — Retire the Legacy Comparison Path

**What to build:** After the accepted rollback window, remove the legacy browser
application from the public play topology or place it in the exact archive state
allowed by the cutover specification. Remove only migration adapters that
actually exist, prove that no canonical caller depends on them, and leave one
public TypeScript/TSX play implementation.

**Blocked by:** 08 — Verify and Promote the Canonical Play Path.

Status: needs-info

Specification gates: Wayfinder 11 and 12.

- [ ] The bounded rollback window and required evidence have completed before retirement begins.
- [ ] The legacy route is deleted or archived exactly as the accepted cutover policy specifies and is no longer a competing public implementation.
- [ ] Every temporary adapter that actually exists has satisfied its named retirement gate before removal.
- [ ] Search and executable checks prove that canonical UI, Runtime, renderer, tests, and hosting assembly have no remaining dependency on retired paths.
- [ ] The canonical L3 route still passes the full verification gate after retirement.
- [ ] Final static-hosting assembly contains one public play implementation and preserves only the historical evidence explicitly allowed by policy.
