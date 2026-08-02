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
 * @property {string} [sealedBy] Where the *decision* was sealed, once filled.
 * @property {string} [revisitWhen] The named condition that reopens a filled threshold.
 */

/** @type {Readonly<Record<string, Threshold>>} */
export const THRESHOLDS = Object.freeze({
  'parity.equality': {
    owner: 'Wayfinder gate 10',
    filled: true,
    value: 'bit-exact',
    question:
      'Is Node/browser projection parity judged bit-exact, or to an epsilon? ' +
      'And if epsilon, what is it?',
    source: 'gate 05 D6 — "The parity pass threshold (bit-exact versus epsilon) is gate 10\'s to own."',
    sealedBy:
      'gate 10 § Resolution, SEALED 2026-08-02 (user). Bit-exact is what the digest ' +
      'comparison already implements, so this authorises the running check rather than ' +
      'tightening it; epsilon was not chosen partly because a sha256 digest cannot carry ' +
      'one without restructuring the comparison field by field.',
    revisitWhen:
      'The game runs on a non-V8 JavaScript engine. Both hosts agree today because both ' +
      'are V8, which is an accident of host choice and not a language guarantee: ' +
      'ECMAScript leaves Math.pow implementation-approximated, and domain/battle.ts\'s ' +
      'CASUALTY_EXPONENT of 1.4 is the one non-integer exponent in the domain, so it ' +
      'takes the genuine transcendental path. Casualties feed capital fall, so that ' +
      'single site is the only known way the two hosts could disagree about who won. ' +
      'The trigger is the shell decision deferred by ADR 0016 Stage 2 (a system-webview ' +
      'shell would put JavaScriptCore under the game on macOS and Linux).',
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
