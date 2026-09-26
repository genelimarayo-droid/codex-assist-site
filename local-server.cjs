const http = require('http')
const fs = require('fs')
const path = require('path')

const root = __dirname
const port = Number(process.env.PORT || 5173)
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon'
}

http.createServer((req, res) => {
  const requested = decodeURIComponent((req.url || '/').split('?')[0])
  const clean = path.normalize(requested).replace(/^([.][.][/\\])+/, '')
  let file = path.join(root, clean === path.sep ? 'index.html' : clean)
  if (!file.startsWith(root)) return void (res.writeHead(403), res.end('Forbidden'))
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html')
  fs.readFile(file, (err, data) => {
    if (err) return void (res.writeHead(404), res.end('Not found'))
    res.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' })
    res.end(data)
  })
}).listen(port, '127.0.0.1', () => console.log(`Codex site: http://127.0.0.1:${port}/`))
