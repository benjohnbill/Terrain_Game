const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");

// `game.html` is gone from this list, and with it the last published trace of
// the reference prototype. It was the multi-faction world-conquest design **ADR
// 0042 retired**, so the marketing host was demonstrating a game this project no
// longer builds; the user ruled take-it-down on 2026-08-02 and this is the
// deferred half of that ruling, executed once the landing had somewhere else to
// point (see `play/` below). The prototype is not deleted and not retired — it
// stays in the repo and still runs under a local static server (AGENTS.md
// § Verification). It just stopped being published.
const files = ["index.html", "robots.txt", "sitemap.xml"];
const directories = ["css", "assets"];

// `assets/game/` is the prototype's own five ESM modules, loaded by `game.html`
// and nothing else. With that page unpublished they would ship with no loader —
// exactly the defect gate 11 fixed for `js/`, so it would be strange to recreate
// it here on the way out.
const excludedFromDirectories = [path.join("assets", "game")];

// `js/` is NOT copied wholesale either. It holds 26 files, and exactly one of
// them — `landing.js` — is loaded by anything this bundle serves
// (`index.html:30`). The other 25 are the prototype's modules, on the same
// reasoning as above. Ruled 2026-08-02 while closing Wayfinder gate 11.
const singleFiles = ["js/landing.js"];

// The playable demo, served at `/play` and embedded by the landing's build
// section. ADR 0051 amends ADR 0041 to allow exactly this and bounds it: the
// demo crosses as an **opaque built artifact**, so what follows may copy
// `game/dist-viewer/` and may not read the game's source, config, or module
// graph. The game build takes nothing from here in return, which is the
// direction ADR 0041's isolation was written to protect.
//
// `game/demo.html` becomes `play/index.html` so the route is `/play` rather than
// `/play/demo`. Source maps are excluded by name: they are 70% of the bundle and
// nothing on a marketing host reads them. Run `npm run build:game` first — this
// script builds nothing, it only copies.
const gameBundle = path.join(root, "game", "dist-viewer");
const playOutput = path.join(output, "play");

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

files.forEach((file) => {
    fs.copyFileSync(path.join(root, file), path.join(output, file));
});

directories.forEach((directory) => {
    fs.cpSync(path.join(root, directory), path.join(output, directory), {
        recursive: true,
        filter: (source) => {
            const relative = path.relative(root, source);
            return !excludedFromDirectories.some(
                (excluded) => relative === excluded || relative.startsWith(excluded + path.sep)
            );
        }
    });
});

singleFiles.forEach((file) => {
    const destination = path.join(output, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(root, file), destination);
});

if (!fs.existsSync(path.join(gameBundle, "demo.html"))) {
    // Fail loudly rather than shipping a landing whose demo slot 404s: the page
    // asserts in copy that the build runs, and a silently missing bundle would
    // make that copy false again — the exact defect the gate-11 ruling named.
    console.error(
        `Missing ${path.join(gameBundle, "demo.html")}.\n` +
        "Run `npm run build:game` before `npm run build:hosting`."
    );
    process.exit(1);
}

// Only the assets `demo.html` itself names.
//
// The game bundle emits two entries and a shared chunk, so copying `assets/`
// wholesale would publish the other entry's chunk with nothing to load it — the
// same defect as the prototype modules above, recreated three lines after
// removing it. Vite lists every file a page needs in that page's own tags
// (including the modulepreload for the shared chunk), so the page is the
// manifest. Source maps are not referenced there and so are excluded for free.
const demoPage = fs.readFileSync(path.join(gameBundle, "demo.html"), "utf8");
const reachableAssets = [...new Set(
    [...demoPage.matchAll(/(?:src|href)="\.\/assets\/([^"]+)"/g)].map((match) => match[1])
)];

fs.mkdirSync(path.join(playOutput, "assets"), { recursive: true });
reachableAssets.forEach((name) => {
    fs.copyFileSync(path.join(gameBundle, "assets", name), path.join(playOutput, "assets", name));
});

// The page's own tags are absolutised on the way in; the game build's are not
// touched.
//
// `cleanUrls` serves this file at `/play` — a file-like URL with no trailing
// slash — so a document-relative `./assets/x` resolves against `/` and 404s.
// `trailingSlash: false` then rules out fixing it with `/play/`, because Firebase
// redirects that back to `/play`. The game build must keep `base: './'`: ADR 0041
// wants the artifact path-independent so it can also be opened from a file server
// or a native shell, and hard-coding a hosting path into it would spend that to
// buy nothing.
//
// Only the HTML needs this. The emitted modules import each other
// *module*-relatively, which resolves against the importing module's own URL and
// is already correct.
fs.writeFileSync(
    path.join(playOutput, "index.html"),
    demoPage.replaceAll('"./assets/', '"/play/assets/')
);

const countFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
    .reduce((total, entry) => {
        const entryPath = path.join(directory, entry.name);
        return total + (entry.isDirectory() ? countFiles(entryPath) : 1);
    }, 0);

console.log(`Hosting bundle ready: ${countFiles(output)} files in ${output}`);
