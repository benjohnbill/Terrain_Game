# PROTOTYPE — combat-formula calculator harness (throwaway)

**This is a throwaway prototype. It is NOT wired to game code and must
never be imported by `js/`.** Delete or absorb once the magnitude pass
closes (the sealed dial values live in
`docs/features/combat-formula/MAGNITUDE.md`; this harness only mirrors
them for validation).

## Question being answered

Does the sealed M1–M11 dial set (plus the M12 world-pulse draft) produce
historically-shaped outcomes when run as one machine? Specifically:

1. 명량 confluence — strait frontage 500 + lever ceiling + terrain must
   let 13 부대 repel 133.
2. Fortress economics — storm vs siege-erosion vs bypass-starvation must
   price out as distinct, non-dominated paths (siege ≈ 3–4 turns).
3. Raid vs sortie — defender-triggered interception must make sortie a
   real choice, not an exploit.
4. Delaying overselection — delaying must not dominate standing defense
   at every R.
5. Grinding dominance — a succeeding plan (DP) must dominate any
   deliberately-failing plan at every tempting R.
6. Reserve / feint geography — 양동 후속타 must emerge from the numbers.
7. **Full-match tempo sheet** — does a war settle in ~8–12 turns and a
   match fit 15–25? (This is the gate on confirming M12.)

Added 2026-07-05 (A-2, match-arc close-out — `match.js` + sheets 10–11):

8. **Hegemony ledger (sheet 10)** — does the 결정점 formula (leadership
   ∧ unassailability + 은둔국 조항) trip inside the envelope when
   computed end-to-end, and is it unreachable from a parity start in a
   single war? Validates the ~1.7 reuse, the 1,000 projection floor,
   and prices the unsealed terms (shield base, choke flow, regen
   window).
9. **Settlement acceptance (sheet 11)** — does the preset claim-rate
   ladder (관대 50 / 표준 75 / 최대 100) produce non-dominated choices
   under the 수락 산술? Pass bar: conciliatory-target 최대 acceptance
   ≤ 40–50%. Also: fill-order decoupling, vassalage pricing proposal.
10. **S6 re-run** under the ruling-⑥ reserve movement schedule
   (1 pt = 12.5% province awakening).

## Run

```
npm run battery          # all sheets
node mockup/combat-calc/battery.js myeongnyang   # one sheet by name
```

## Files

- `engine.js` — pure resolution module (no I/O). Worth lifting if the
  dials validate.
- `match.js` — pure match-level arithmetic (hegemony check, settlement
  acceptance) mirroring the sealed match-arc GLOSSARY terms. Worth
  lifting alongside engine.js.
- `battery.js` — scenario runner; prints worked sheets.
- `NOTES.md` — the answer to the question, filled in as the user rules
  on each sheet.
