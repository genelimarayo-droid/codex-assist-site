// Run against the dev server with placeholder public configuration; all Supabase traffic is mocked.
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const context = await browser.newContext({ viewport: { width: 390, height: 844 } })
let admin = true, failRead = false, failWrite = false, records = [
  { id: 'relay', name: '中转方案', subtitle: '', price: 49.9, original_price: null, price_type: 'fixed', price_unit: '次', description: '服务介绍', badge: '入门', is_featured: false, is_active: true, sort_order: 1 },
  { id: 'plus-account', name: '成品账号 + Plus', price: 209.9, price_type: 'fixed', is_active: true, is_featured: true, sort_order: 2 },
  { id: 'new-account', name: '从 0 配置专属账号', price: null, price_type: 'consultation', is_active: true, sort_order: 3 },
  { id: 'white-account', name: 'Codex 白号', price: null, price_type: 'consultation', is_active: true, sort_order: 4 },
]
const uid = 'fa4c1fe3-1ea5-4447-b572-6218a98c6b78'
const user = { id: uid, aud: 'authenticated', role: 'authenticated', email: 'test@example.com' }
const jwt = `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: uid, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.test`
await context.route('https://ypydweztobzigaajcbhg.supabase.co/**', async route => {
  const req = route.request(), url = new URL(req.url())
  let status = 200, body
  if (url.pathname.endsWith('/token')) body = { access_token: jwt, refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, user }
  else if (url.pathname.endsWith('/user')) body = user
  else if (url.pathname.endsWith('/logout')) body = {}
  else if (url.pathname.endsWith('/admins')) body = admin ? { user_id: uid } : null
  else if (url.pathname.endsWith('/services')) {
    if (req.method() === 'PATCH') {
      if (failWrite) { status = 403; body = { message: 'RLS denied' } }
      else {
        const id = url.searchParams.get('id').slice(3)
        const row = records.find(row => row.id === id)
        Object.assign(row, req.postDataJSON()); body = row
      }
    } else if (failRead) { status = 503; body = { message: 'unavailable' } }
    else body = records
  } else throw new Error(`Unexpected request ${req.url()}`)
  await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
})
const page = await context.newPage()
const errors = []
page.on('pageerror', error => errors.push(error.message))
const login = async () => {
  await page.locator('[name=email]').fill('test@example.com')
  await page.locator('[name=password]').fill('test-password')
  await page.getByRole('button', { name: '登录', exact: true }).click()
}
try {
  await page.goto('http://localhost:5173/admin/services')
  await page.waitForURL('**/admin/login')
  await login()
  await page.waitForURL('**/admin')
  await page.waitForSelector('.admin-service')
  assert.equal(await page.locator('.admin-service').count(), 4)
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  const form = page.locator('.admin-service').first()
  await form.locator('[name=price]').fill('59.9')
  await form.getByRole('button', { name: '保存修改' }).click()
  await form.getByText('已保存到 Supabase。刷新前台即可查看。').waitFor()
  assert.equal(records[0].price, 59.9)
  await page.goto('http://localhost:5173/')
  await page.locator('.service-card').first().getByText('59.9', { exact: false }).waitFor()
  await page.goto('http://localhost:5173/services/relay')
  await page.locator('.detail-price').getByText('59.9', { exact: false }).waitFor()
  await page.goto('http://localhost:5173/admin/services')
  await form.locator('[name=priceType]').selectOption('consultation')
  await form.getByRole('button', { name: '保存修改' }).click()
  await form.getByText('已保存到 Supabase。刷新前台即可查看。').waitFor()
  assert.equal(records[0].price, null)
  assert.equal(records[0].price_type, 'consultation')
  failWrite = true
  await form.locator('[name=name]').fill('修改被拒绝')
  await form.getByRole('button', { name: '保存修改' }).click()
  await form.getByText(/保存失败/).waitFor()
  assert.equal(records[0].name, '中转方案')
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: '退出登录' }).click()
  await page.waitForURL('**/admin/login')
  admin = false
  await login()
  await page.getByText('此账号不是管理员，无权进入后台。').waitFor()
  assert.equal(await page.locator('.admin-service').count(), 0)
  failRead = true
  await page.goto('http://localhost:5173/')
  await page.getByText('最新价格暂时无法加载，具体价格请咨询。刷新页面可重试。').waitFor()
  assert.equal(await page.locator('.service-card').count(), 4)
  assert.equal(await page.locator('.price-currency').count(), 0)
  failRead = false
  records[0].is_active = false
  await page.reload()
  await page.waitForSelector('.service-card')
  assert.equal(await page.locator('.service-card').count(), 3)
  await page.goto('http://localhost:5173/services/relay')
  await page.getByText('此服务不存在或已下架').waitFor()
  records = []
  await page.goto('http://localhost:5173/')
  await page.getByText('暂无上架服务，欢迎联系咨询。').waitFor()
  assert.equal(await page.locator('.service-card').count(), 0)
  assert.deepEqual(errors, [])
  console.log('PASS: protected routes, login, non-admin denial, mobile layout, price save/read, consultation/null, RLS failure, logout, outage fallback, unpublish and empty catalog')
} finally { await browser.close() }
