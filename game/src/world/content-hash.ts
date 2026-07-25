/**
 * The revision content-integrity stamp (gate 06 D5 tier 1).
 *
 * Purpose is narrow and worth stating so nobody over-reads it: this detects an
 * artifact whose **content** changed while its **revision** did not. That is an
 * accident — a hand edit, a half-applied re-bake, a compaction re-running a
 * completed batch — not an attack, so a short non-cryptographic hash is the
 * right tool. It must, however, be **identical in Node and in a browser**, which
 * rules out `node:crypto`; the FNV-1a below uses only `Math.imul` and uint32
 * arithmetic and so agrees across hosts by construction.
 *
 * The serialization matters more than the hash. `JSON.stringify` cannot be used:
 * `Infinity` becomes `null`, which is the exact corruption gate 06 D2 rejected
 * JSON to avoid — the stamp would then be blind to the one field it most needs
 * to protect.
 */

/**
 * Deterministic, key-sorted serialization that survives the values a world
 * artifact actually contains.
 *
 * Non-finite numbers are spelled out rather than dropped, so an open border's
 * `Infinity` is part of what the stamp covers.
 */
export function canonicalize(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NaN';
    if (value === Infinity) return 'Infinity';
    if (value === -Infinity) return '-Infinity';
    // Round-trip-exact for every finite double, so a re-bake that changes a
    // value in its last bit is not silently equal.
    return Object.is(value, -0) ? '-0' : String(value);
  }

  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';

  if (Array.isArray(value)) return `[${value.map(canonicalize).join(',')}]`;

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalize(v)}`).join(',')}}`;
  }

  throw new TypeError(`A world artifact may not contain a ${typeof value}.`);
}

/** FNV-1a, 32-bit, rendered as 8 lowercase hex digits. */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Stamps an artifact's content, excluding `contentHash` itself.
 *
 * One pass, over a length-prefixed canonical serialization. That is the whole
 * job: catching an artifact whose content moved while its revision did not.
 */
export function contentHashOf(artifact: Record<string, unknown>): string {
  const { contentHash: _ignored, ...content } = artifact;
  const canonical = canonicalize(content);
  return fnv1a(`${canonical.length}:${canonical}`);
}
