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
  const restatused = [];
  const redefined = [];

  for (const canonical of now.keys()) if (!was.has(canonical)) added.push(canonical);
  for (const canonical of was.keys()) if (!now.has(canonical)) removed.push(canonical);

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
    restatused,
    redefined,
    total: added.length + removed.length + restatused.length + redefined.length
  };
}

module.exports = { drift };
