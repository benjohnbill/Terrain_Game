const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function createBrowserContext() {
  const context = {
    console,
    Math,
    Date,
    Map,
    Set,
    Array,
    Object,
    Number,
    String,
    Boolean,
    JSON,
    window: {},
    document: {
      getElementById() {
        return null;
      },
      querySelectorAll() {
        return [];
      }
    }
  };
  context.window = context;
  return vm.createContext(context);
}

function loadScripts(relativePaths) {
  const context = createBrowserContext();
  for (const relativePath of relativePaths) {
    const absolutePath = path.join(__dirname, '..', '..', relativePath);
    const source = fs.readFileSync(absolutePath, 'utf8');
    vm.runInContext(source, context, { filename: relativePath });
  }
  return context;
}

module.exports = { loadScripts };
