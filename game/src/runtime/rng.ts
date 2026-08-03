/**
 * Deterministic randomness, drawn only from the injected seed.
 *
 * ADR 0040 § Decision 3 bars rules from reading `Math.random()` or
 * `Date.now()` — that is why the archive bot was discarded. Randomness from the
 * *injected seed* is not barred and is exactly what the seed exists for: a
 * different seed per match gives different play, the same seed replays
 * identically (DECISIONS-OWED R4).
 *
 * This is plumbing, not a game dial. The algorithm below is the standard
 * xmur3 + sfc32 pair: no tuning surface, no value anyone must approve, and
 * identical output in Node and in a browser because it uses only `Math.imul`
 * and uint32 arithmetic.
 */

/** Hashes a seed string into four uint32 words of state. */
function xmur3(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/** A deterministic stream of numbers in [0, 1). */
export interface Rng {
  /** Next value in [0, 1). */
  next(): number;
  /** Next integer in [0, bound). Rejects a non-positive bound rather than guessing. */
  nextInt(bound: number): number;
  /**
   * An independent stream derived from this one's seed and a label. Lets each
   * consumer draw without the order of *other* consumers' draws shifting its
   * results — which is what keeps replays stable as the build grows.
   */
  fork(label: string): Rng;
}

export function createRng(seed: string): Rng {
  const hash = xmur3(seed);
  let a = hash();
  let b = hash();
  let c = hash();
  let d = hash();

  const next = (): number => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };

  return {
    next,
    nextInt(bound: number): number {
      if (!Number.isInteger(bound) || bound <= 0) {
        throw new RangeError(`nextInt bound must be a positive integer, got ${String(bound)}`);
      }
      return Math.floor(next() * bound);
    },
    fork(label: string): Rng {
      return createRng(`${seed}::${label}`);
    },
  };
}
