const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");

const files = ["index.html", "game.html", "robots.txt", "sitemap.xml"];
const directories = ["css", "assets"];

// `js/` is NOT copied wholesale. It holds 26 files, and exactly one of them —
// `landing.js` — is loaded by anything this bundle serves (`index.html:30`).
// The other 25 are the reference prototype's modules: ADR 0041 names them an
// archive, `game.html` loads its own code from `assets/game/` instead, and no
// shipped surface references them. Publishing them put the source of a design
// ADR 0042 retired on the marketing host, read by no loader.
//
// The archive is not deleted and is not retired — it stays in the repo and still
// runs under a local static server (AGENTS.md § Verification). What changed is
// only that it stopped being *published*. Ruled 2026-08-02 while closing
// Wayfinder gate 11.
const singleFiles = ["js/landing.js"];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

files.forEach((file) => {
    fs.copyFileSync(path.join(root, file), path.join(output, file));
});

directories.forEach((directory) => {
    fs.cpSync(path.join(root, directory), path.join(output, directory), {
        recursive: true
    });
});

singleFiles.forEach((file) => {
    const destination = path.join(output, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, file), destination);
});

const countFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
    .reduce((total, entry) => {
        const entryPath = path.join(directory, entry.name);
        return total + (entry.isDirectory() ? countFiles(entryPath) : 1);
    }, 0);

console.log(`Hosting bundle ready: ${countFiles(output)} files in ${output}`);
