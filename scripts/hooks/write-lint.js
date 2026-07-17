// PostToolUse hook (Write|Edit|apply_patch) — doc-governance promotion chain (c).
// Runs `npm run lint:docs` (scripts/audit-lint.js) after an edit touches a
// governed doc surface and surfaces findings as additionalContext. Never
// blocks: findings are reports, never legislation (documentation-law S13).
// Any internal failure here fails silently — a hook bug must never stop
// the edit it's reacting to.
//
// Host-portable: Claude Code sends one edited path as `tool_input.file_path`,
// while Codex routes every file edit through `apply_patch` and sends the patch
// text as `tool_input.command` instead — so the same hook reads both shapes
// rather than forking into two drifting copies.
'use strict';

const GOVERNED = /^(DOMAIN_MAP\.md|SPEC\.md|DESIGN\.md|docs\/.*|js\/.*\.js|\.claude\/rules\/documentation-law\.md)$/;

// apply_patch envelope directives, e.g. `*** Update File: docs/x.md`. One patch
// may touch several files, and `*** Move to:` carries a rename's destination.
const PATCH_FILE_LINE = /^\*\*\*\s+(?:Add|Update|Delete)\s+File:\s*(.+?)\s*$/gm;
const PATCH_MOVE_LINE = /^\*\*\*\s+Move\s+to:\s*(.+?)\s*$/gm;

function relPath(root, filePath) {
  if (!filePath) return null;
  return filePath.startsWith(root + '/') ? filePath.slice(root.length + 1) : filePath;
}

function patchPaths(command) {
  if (typeof command !== 'string') return [];
  const out = [];
  for (const re of [PATCH_FILE_LINE, PATCH_MOVE_LINE]) {
    re.lastIndex = 0; // these are module-level /g regexes — reset before reuse
    let m;
    while ((m = re.exec(command)) !== null) out.push(m[1]);
  }
  return out;
}

// Every path this tool call touched, across hosts. Claude's single file_path
// first; Codex's apply_patch text as the fallback.
function touchedPaths(data) {
  const direct = data?.tool_input?.file_path || data?.tool_response?.filePath;
  if (direct) return [direct];
  return patchPaths(data?.tool_input?.command);
}

function main() {
  const fs = require('fs');
  const path = require('path');
  const { execSync } = require('child_process');

  let raw = '';
  try {
    raw = fs.readFileSync(0, 'utf8');
  } catch (e) {
    return; // no stdin — nothing to react to
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return;
  }

  const root = process.cwd();
  const governed = touchedPaths(data)
    .map((p) => relPath(root, p))
    .filter((rel) => rel && GOVERNED.test(rel));
  if (!governed.length) return;

  let output = '';
  let exitCode = 0;
  try {
    output = execSync('npm run lint:docs', { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    output = (e.stdout || '') + (e.stderr || '');
    exitCode = e.status ?? 1;
  }

  if (exitCode === 0) return; // clean — no context needed

  const result = {
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext:
        `doc-audit (Layer 0, triggered by edit to ${governed.join(', ')}): npm run lint:docs reported findings.\n` +
        `Reports, not legislation (documentation-law S13) — triage each with the doc-audit skill's ` +
        `Layer 1 cross-check discipline before acting.\n\n${output.trim()}`
    }
  };
  process.stdout.write(JSON.stringify(result));
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    // swallow — never let the hook itself break the tool call
  }
}

module.exports = { GOVERNED, relPath, patchPaths, touchedPaths };
