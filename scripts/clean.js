const fs = require("fs");
const path = require("path");

const binDir = path.resolve(__dirname, "..", "bin");

fs.rmSync(binDir, { recursive: true, force: true });
console.log("Cleaned bin/");
