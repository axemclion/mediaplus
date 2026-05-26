const fs = require("fs");
const path = require("path");
const targets = require("./config");

const root = path.resolve(__dirname, "..");

async function buildTarget(name) {
    const target = targets[name];
    if (!target) {
        console.error(`Unknown target: ${name}. Valid targets: ${Object.keys(targets).join(", ")}`);
        process.exit(1);
    }
    for (const { from, to } of target.copies) {
        const src = path.join(root, from);
        const dest = path.join(root, to);
        fs.mkdirSync(dest, { recursive: true });
        await fs.promises.cp(src, dest, { recursive: true });
    }
    console.log(`Built: ${name} → bin/${name}`);
}

async function main() {
    const arg = process.argv[2];
    const names = arg ? [arg] : Object.keys(targets);
    for (const name of names) {
        await buildTarget(name);
    }
}

main().catch(err => { console.error(err); process.exit(1); });
