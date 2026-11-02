import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const label = process.argv[2] || 'audit'
let base = process.env.AUDIT_URL
let staticServer
if (!base) {
  staticServer = http.createServer((request, response) => {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0])
    const candidate = path.join(process.cwd(), 'dist', requestPath)
    const filePath = fs.existsSync(candidate) && fs.statSync(candidate).isFile()
      ? candidate
      : path.join(process.cwd(), 'dist', 'index.html')
    const extension = path.extname(filePath)
    response.setHeader('Content-Type', {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.woff2': 'font/woff2',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
    }[extension] || 'application/octet-stream')
    response.end(fs.readFileSync(filePath))
  })
  await new Promise(resolve => staticServer.listen(4179, '127.0.0.1', resolve))
  base = 'http://127.0.0.1:4179'
}
const widths = [360, 390, 768, 1024, 1280, 1440, 1920]
const zooms = [1, 1.25, 1.5]
const routes = [
  'dashboard', 'timetable', 'attendance', 'courses', 'registration', 'add-drop',
  'results', 'exams', 'admit-card', 'transcript', 'finance/ledger',
  'finance/vouchers', 'finance/payment', 'requests', 'documents',
  'notifications', 'support', 'profile', 'settings', 'international', 'policies',
]

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 1000 })
await page.goto(`${base}/?debug=layout`, { waitUntil: 'networkidle0' })
await page.evaluate(() => {
  const key = 'uit-portal-v4'
  const saved = JSON.parse(localStorage.getItem(key) || '{}')
  localStorage.setItem(key, JSON.stringify({ ...saved, loggedIn: true, activeKind: 'international' }))
})
await page.reload({ waitUntil: 'networkidle0' })

const rows = []
for (const zoom of zooms) {
  for (const requestedWidth of widths) {
    const cssWidth = Math.max(240, Math.round(requestedWidth / zoom))
    await page.setViewport({ width: cssWidth, height: Math.round(1000 / zoom) })
    for (const route of routes) {
      await page.evaluate((nextRoute) => {
        history.pushState({}, '', `/${nextRoute}?debug=layout`)
        window.dispatchEvent(new PopStateEvent('popstate'))
      }, route)
      await new Promise(resolve => setTimeout(resolve, 110))
      const offenders = await page.evaluate(() => window.__UIT_LAYOUT_AUDIT__?.run() || [])
      for (const offender of offenders) {
        rows.push({ ...offender, requestedWidth, zoom: `${Math.round(zoom * 100)}%` })
      }
    }
  }
}

await browser.close()
await new Promise(resolve => staticServer ? staticServer.close(resolve) : resolve())
fs.mkdirSync('artifacts', { recursive: true })
fs.writeFileSync(`artifacts/layout-${label}.json`, JSON.stringify(rows, null, 2))
console.log(JSON.stringify({
  label,
  checks: widths.length * zooms.length * routes.length,
  offenders: rows.length,
  routesWithIssues: [...new Set(rows.map(row => row.route))],
  byReason: Object.groupBy(rows, row => row.reason),
}, null, 2))
