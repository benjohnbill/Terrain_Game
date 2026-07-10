// PostToolUse hook (Write|Edit) — doc-governance promotion chain (c).
// Runs `npm run lint:docs` (scripts/audit-lint.js) after an edit touches a
// governed doc surface and surfaces findings as additionalContext. Never
// blocks: findings are reports, never legislation (documentation-law S13).
// Any internal failure here fails silently — a hook bug must never stop
// the edit it's reacting to.
'use strict';

const GOVERNED = /^(DOMAIN_MAP\.md|SPEC\.md|DESIGN\.md|docs\/.*|js\/.*\.js|\.claude\/rules\/documentation-law\.md)$/;

function relPath(root, filePath) {
  if (!filePath) return null;
  return filePath.startsWith(root + '/') ? filePath.slice(root.length + 1) : filePath;
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

  const filePath = data.tool_input?.file_path || data.tool_response?.filePath;
  const root = process.cwd();
  const rel = relPath(root, filePath);
  if (!rel || !GOVERNED.test(rel)) return;

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
        `doc-audit (Layer 0, triggered by edit to ${rel}): npm run lint:docs reported findings.\n` +
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

module.exports = { GOVERNED, relPath };
