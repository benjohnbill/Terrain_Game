// Vocabulary dashboard — operation-plan records.
// Pure: catalog text in, records out. No fs, no HTML.
//
// An operation plan is not vocabulary. Each one is a record with a schema
// (ADR 0024: name, availability conditions, effect axes, risk profile, claim
// block), so a one-line gloss is a WORSE view of one than its own record. That
// is why the 13 plans leave the term list for their own panel, and why this
// module exists instead of letting them render as term rows.
//
// Shapes below were MEASURED against the real catalog, and two guesses were
// refuted in the process:
//   - labels carry parentheticals (`**Availability (shape, user-confirmed
//     2026-07-02).**`, `**Risk character (청야).**`), so they match by stem;
//   - `risk` is NOT an extractable level. Of 12 records, five open with a bare
//     level word and seven are prose ("The highest in the catalog…", "Lowest
//     operational risk…"). Normalising that would be invention, so risk is
//     carried as the author's own text.
//
// Design: docs/superpowers/specs/2026-07-28-vocab-dashboard-design.md § A
'use strict';

// ### Swift Seizure (신속 점령) — shape COMPLETE (template plan)
// One heading may declare two plans: `A (가) + B (나)`.
const PLAN_HEAD = /^### (.+?)\s*(?:—.*)?$/;
const NAMED = /^(.+?)\s*\(([^)]+)\)\s*$/;
const AXIS_ROW = /^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|/;
// Some records state axes in prose instead of a table: Reconnaissance says
// "`confidenceGain: core` — its sole non-zero axis".
const AXIS_INLINE = /`([A-Za-z]+):\s*(core|secondary|none)`/g;
// Shape cells carry riders — `none — defining zero`, `secondary — **friendly
// direction**`. The bucket is the leading word.
const shapeOf = (cell) => cell.split(/\s*[—-]\s*/)[0].trim().toLowerCase();

// A label matched by stem, capturing any parenthetical so a two-plan section
// can route `(청야)` fields to Scorched Earth and the bare ones to its sibling.
const labelRe = (stem) => new RegExp(`^\\*\\*${stem}(?:\\s*\\(([^)]*)\\))?\\.?\\*\\*\\s*(.*)$`);

function paragraphFrom(lines, at) {
  const out = [];
  for (let i = at; i < lines.length; i++) {
    if (!lines[i].trim()) break;
    out.push(lines[i].trim());
  }
  return out.join(' ').trim();
}

function headingsIn(lines) {
  const heads = [];
  lines.forEach((line, at) => {
    const head = line.match(PLAN_HEAD);
    if (!head) return;
    const declared = head[1].split(/\s+\+\s+/).map((piece) => {
      const named = piece.match(NAMED);
      return named
        ? { name: named[1].trim(), korean: named[2].trim() }
        : { name: piece.trim(), korean: null };
    });
    heads.push({ at, declared });
  });
  return heads;
}

// Every occurrence of a stem in this block, with its parenthetical and text.
function fieldsFor(block, stem) {
  const re = labelRe(stem);
  const found = [];
  for (let i = 0; i < block.length; i++) {
    const hit = block[i].match(re);
    if (!hit) continue;
    const text = [hit[2].trim(), paragraphFrom(block, i + 1)].filter(Boolean).join(' ').trim();
    found.push({ scope: hit[1] ? hit[1].trim() : null, text: text || null, at: i });
  }
  return found;
}

// A field belongs to the plan whose 한국어 the label's parenthetical names.
// `(shape)` and `(shape, user-confirmed …)` name no plan, so they are shared.
function scopedTo(fields, plan) {
  const mine = fields.find((f) => f.scope && plan.korean && plan.korean.includes(f.scope));
  if (mine) return mine;
  return fields.find((f) => !f.scope || !plan.korean || !plan.korean.includes(f.scope) === false) || fields[0] || null;
}

function readField(block, stem, plan) {
  const hit = scopedTo(fieldsFor(block, stem), plan);
  return hit ? hit.text : null;
}

function readAxes(block, stem, plan) {
  const hit = scopedTo(fieldsFor(block, stem), plan);
  const axes = { core: [], secondary: [], none: [] };
  if (!hit) return axes;

  const add = (axis, cell) => {
    const bucket = shapeOf(cell);
    if (axes[bucket] && !axes[bucket].includes(axis)) axes[bucket].push(axis);
  };

  // The label's own text first — that is where a prose record states them.
  if (hit.text) {
    for (const found of hit.text.matchAll(AXIS_INLINE)) add(found[1], found[2]);
  }
  for (let i = hit.at; i < block.length; i++) {
    const row = block[i].match(AXIS_ROW);
    if (row) {
      add(row[1], row[2]);
      continue;
    }
    if (/^\*\*/.test(block[i]) && i > hit.at) break; // next labelled field
  }
  return axes;
}

function parsePlans(catalogText) {
  const lines = catalogText.split('\n');
  const heads = headingsIn(lines);

  return heads.flatMap((head, n) => {
    const end = n + 1 < heads.length ? heads[n + 1].at : lines.length;
    const block = lines.slice(head.at + 1, end);
    return head.declared.map((plan) => ({
      name: plan.name,
      korean: plan.korean,
      identity: readField(block, 'Real-war identity', plan),
      availability: readField(block, 'Availability', plan),
      risk: readField(block, 'Risk character', plan),
      effectAxes: readAxes(block, 'Effect axes', plan)
    }));
  });
}

module.exports = { parsePlans };
