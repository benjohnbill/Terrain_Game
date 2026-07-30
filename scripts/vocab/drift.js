// Vocabulary dashboard — the drift stage.
// Pure: two models in, changes out. No fs, no HTML, no git.
//
// The lock marker stores a commit hash and nothing else; the old model is
// recovered by re-parsing that revision, so no content-bearing baseline is ever
// committed (ruling 03 Q5's ownership boundary). This function is what makes
// that cheap: it compares models, never files.
//
// Design: docs/superpowers/specs/2026-07-28-vocab-dashboard-design.md
'use strict';

function byCanonical(model) {
  return new Map((model.entries || []).map((e) => [e.canonical, e]));
}

// The definition text a term currently shows, across both slots that can carry
// it. Compared as a string rather than a digest: both texts are already in
// memory, so hashing would buy nothing — the lock baseline stores a commit
// hash, never content, and the old model is re-parsed from that revision.
//
// Binary by decision: "changed at all", not a diff-size threshold. A threshold
// would need a justification nobody has, and the axis this watches (definition
// prose) has no enforcement behind it at all.
function definitionOf(entry) {
  return JSON.stringify([
    entry.gloss ? entry.gloss.text : null,
    entry.tier0 ? entry.tier0.summary : null
  ]);
}

function drift(before, after) {
  const was = byCanonical(before);
  const now = byCanonical(after);

  const added = [];
  const removed = [];
  const renamed = [];
  const restatused = [];
  const redefined = [];

  const appeared = [...now.keys()].filter((c) => !was.has(c));
  const vanished = [...was.keys()].filter((c) => !now.has(c));

  // A rename is recoverable only because the Vocabulary Law requires the old
  // name to stay on as a `구칭` alias at the birthplace. Without that rule this
  // is indistinguishable from a withdrawal plus an unrelated registration.
  const claimed = new Set();
  for (const canonical of appeared) {
    const aliases = now.get(canonical).aliases || [];
    const old = vanished.find((gone) => !claimed.has(gone) && aliases.includes(gone));
    if (old) {
      renamed.push({ from: old, to: canonical });
      claimed.add(old);
      claimed.add(canonical);
    }
  }

  added.push(...appeared.filter((c) => !claimed.has(c)));
  removed.push(...vanished.filter((c) => !claimed.has(c)));

  for (const [canonical, then] of was) {
    const nowEntry = now.get(canonical);
    if (!nowEntry) continue;
    if (then.status !== nowEntry.status) {
      restatused.push({ canonical, from: then.status, to: nowEntry.status });
    }
    if (definitionOf(then) !== definitionOf(nowEntry)) redefined.push(canonical);
  }

  return {
    added,
    removed,
    renamed,
    restatused,
    redefined,
    total: added.length + removed.length + renamed.length + restatused.length + redefined.length
  };
}

module.exports = { drift };
