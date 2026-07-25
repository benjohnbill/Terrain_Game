/**
 * The threshold registry — and the `pending` safety valve.
 *
 * Gate 05 D3 draws the ownership line: **gate 05 owns command existence, names,
 * and structure, while gate 10 owns each acceptance command's pass/fail
 * threshold.** Wayfinder gate 10 is still open. Its named safety valve is that
 * "an acceptance command fails `pending` until its threshold is filled, so a
 * deferred gate cannot masquerade as green".
 *
 * This file is that valve. A check whose threshold is unfilled does not skip,
 * does not pass, and does not quietly warn — it reports PENDING and the command
 * exits non-zero.
 *
 * **To fill a threshold:** set `filled: true` and give `value` a concrete
 * decision, citing where gate 10 sealed it. Do not fill one to make a red build
 * green; an unfilled threshold is a true statement about the project.
 */

/**
 * @typedef {object} Threshold
 * @property {string} owner     Who decides this, by name.
 * @property {boolean} filled   Whether that decision has been made and recorded.
 * @property {unknown} value    The decision. `null` while unfilled.
 * @property {string} question  What exactly is undecided, in one sentence.
 * @property {string} source    Where the ownership was sealed.
 */

/** @type {Readonly<Record<string, Threshold>>} */
export const THRESHOLDS = Object.freeze({
  'parity.equality': {
    owner: 'Wayfinder gate 10',
    filled: false,
    value: null,
    question:
      'Is Node/browser projection parity judged bit-exact, or to an epsilon? ' +
      'And if epsilon, what is it?',
    source: 'gate 05 D6 — "The parity pass threshold (bit-exact versus epsilon) is gate 10\'s to own."',
  },
});

export class PendingThreshold extends Error {
  /** @param {string} name @param {Threshold} threshold */
  constructor(name, threshold) {
    super(`threshold "${name}" is unfilled`);
    this.name = 'PendingThreshold';
    this.thresholdName = name;
    this.threshold = threshold;
  }
}

/**
 * Returns a filled threshold's value, or throws `PendingThreshold`.
 * @param {string} name
 * @returns {unknown}
 */
export function requireThreshold(name) {
  const threshold = THRESHOLDS[name];
  if (!threshold) throw new Error(`No threshold is registered under "${name}".`);
  if (!threshold.filled) throw new PendingThreshold(name, threshold);
  return threshold.value;
}

/**
 * Formats a pending threshold for a terminal, so the reason a command is red is
 * legible at a glance and is not mistaken for a broken build.
 * @param {PendingThreshold} error
 * @returns {string}
 */
export function formatPending(error) {
  const t = error.threshold;
  return [
    `PENDING  ${error.thresholdName}`,
    `  owner     ${t.owner} (still open)`,
    `  undecided ${t.question}`,
    `  sealed by ${t.source}`,
    '',
    '  This is not a build failure. The check ran; nothing is authorised to judge',
    '  its result yet, so it refuses to report green.',
  ].join('\n');
}
