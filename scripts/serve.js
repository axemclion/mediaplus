const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 9999;
const root = path.resolve(__dirname, "..", "test");

const mimeTypes = {
    ".html": "text/html",
    ".js":   "application/javascript",
    ".css":  "text/css",
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".swf":  "application/x-shockwave-flash",
};

function serve() {
    const server = http.createServer((req, res) => {
        const filePath = path.join(root, req.url === "/" ? "/index.html" : req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Not found");
                return;
            }
            const ext = path.extname(filePath);
            res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
            res.end(data);
        });
    });
    server.listen(PORT, () => console.log(`Test server running at http://localhost:${PORT}`));
    return server;
}

// Allow both direct execution and require()
if (require.main === module) {
    serve();
}

module.exports = serve;
