// Runs clean → build → serve → watch for a given target (or all targets).
const { execSync } = require("child_process");
const path = require("path");
const targets = require("./config");
const serve = require("./serve");
const watchTarget = require("./watch");

const scriptsDir = __dirname;

const arg = process.argv[2];
const names = arg ? [arg] : Object.keys(targets);

// Clean
execSync(`node ${path.join(scriptsDir, "clean.js")}`, { stdio: "inherit" });

// Build all requested targets
for (const name of names) {
    execSync(`node ${path.join(scriptsDir, "build.js")} ${name}`, { stdio: "inherit" });
}

// Serve test/
serve();

// Watch
names.forEach(watchTarget);
