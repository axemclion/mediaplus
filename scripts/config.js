// Build targets: defines what gets copied where, and what to watch.
const targets = {
    chrome: {
        copies: [
            { from: "extensions/chrome", to: "bin/chrome" },
            { from: "core",              to: "bin/chrome/core" },
            { from: "lib",               to: "bin/chrome/lib" },
        ],
        watch: ["extensions/chrome", "core"],
    },
    opera: {
        copies: [
            { from: "extensions/chrome", to: "bin/opera" },
            { from: "core",              to: "bin/opera/core" },
            { from: "lib",               to: "bin/opera/lib" },
            { from: "extensions/opera",  to: "bin/opera" },
        ],
        watch: ["extensions/chrome", "extensions/opera", "core"],
    },
    firefox: {
        copies: [
            { from: "extensions/firefox", to: "bin/firefox" },
            { from: "core",               to: "bin/firefox/data/core" },
            { from: "lib",                to: "bin/firefox/data/lib" },
        ],
        watch: ["extensions/firefox", "core"],
    },
    opera14: {
        copies: [
            { from: "extensions/opera14", to: "bin/opera14" },
            { from: "core",               to: "bin/opera14/core" },
            { from: "lib",                to: "bin/opera14/lib" },
        ],
        watch: ["extensions/opera14", "core"],
    },
};

module.exports = targets;
