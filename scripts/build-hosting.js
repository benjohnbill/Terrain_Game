const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const output = path.join(root, "dist");

const files = ["index.html", "game.html", "robots.txt", "sitemap.xml"];
const directories = ["css", "js", "assets"];

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

const countFiles = (directory) => fs.readdirSync(directory, { withFileTypes: true })
    .reduce((total, entry) => {
        const entryPath = path.join(directory, entry.name);
        return total + (entry.isDirectory() ? countFiles(entryPath) : 1);
    }, 0);

console.log(`Hosting bundle ready: ${countFiles(output)} files in ${output}`);
