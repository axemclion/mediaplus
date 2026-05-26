const path = require("path");
const chokidar = require("chokidar");
const targets = require("./config");
const { execSync } = require("child_process");

const root = path.resolve(__dirname, "..");

function watchTarget(name) {
    const target = targets[name];
    if (!target) {
        console.error(`Unknown target: ${name}`);
        process.exit(1);
    }

    const watchPaths = target.watch.map(p => path.join(root, p));
    console.log(`Watching ${name}: ${target.watch.join(", ")}`);

    chokidar.watch(watchPaths, { ignoreInitial: true }).on("all", (event, filePath) => {
        console.log(`[${name}] ${event}: ${path.relative(root, filePath)}`);
        try {
            execSync(`node ${path.join(__dirname, "build.js")} ${name}`, { stdio: "inherit" });
        } catch (e) {
            console.error(`Build failed for ${name}`);
        }
    });
}

// Allow both direct execution and require()
if (require.main === module) {
    const arg = process.argv[2];
    const names = arg ? [arg] : Object.keys(targets);
    names.forEach(watchTarget);
}

module.exports = watchTarget;
