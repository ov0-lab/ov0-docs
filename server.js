const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 1145;
const rootDir = path.join(process.cwd(), 'build');

const server = http.createServer((req, res) => {
    try {
        const decodedPath = decodeURIComponent(url.parse(req.url).pathname);
        let pathname = path.normalize(path.join(rootDir, decodedPath)).replace(/\\/g, '/');

        console.log(`请求路径: ${pathname}`); // 调试日志

        fs.stat(pathname, (err, stats) => {
            if (err) {
                console.error('文件stat错误:', err); // 调试日志
                res.writeHead(err.code === 'ENOENT' ? 404 : 500);
                return res.end(err.code === 'ENOENT' ? '404 Not Found' : '500 Server Error');
            }

            if (stats.isDirectory()) {
                pathname = path.join(pathname, 'index.html');
                fs.stat(pathname, (err, stats) => {
                    if (err || !stats.isFile()) {
                        res.writeHead(404);
                        return res.end('404 Not Found');
                    }
                    sendFile(res, pathname, stats);
                });
            } else {
                sendFile(res, pathname, stats);
            }
        });
    } catch (e) {
        console.error('服务器错误:', e);
        res.writeHead(500);
        res.end('500 Internal Server Error');
    }
});

function sendFile(res, filepath, stats) {
    const ext = path.extname(filepath).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.json': 'application/json',
        '.model3.json': 'application/json',
        '.moc3': 'application/octet-stream',
    };

    const stream = fs.createReadStream(filepath);
    stream.on('error', (err) => {
        console.error('文件流错误:', err);
        res.writeHead(500);
        res.end('500 Server Error');
    });

    res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Content-Length': stats.size,
        'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    stream.pipe(res);
}

server.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
    console.log(`根目录: ${rootDir}`);
});