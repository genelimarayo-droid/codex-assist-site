import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
const { chromium, webkit, devices } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
const baseURL = process.env.SITE_URL || 'http://localhost:5173'
const engines = [
  ['iPhone Safari (WebKit)', webkit, {}, devices['iPhone 13']],
  ['iPhone WeChat UA (WebKit)', webkit, {}, { ...devices['iPhone 13'], userAgent: `${devices['iPhone 13'].userAgent} MicroMessenger/8.0.50` }],
  ['Android Chrome (Chromium)', chromium, { channel: 'msedge' }, devices['Pixel 7']],
  ['Android WeChat UA (Chromium)', chromium, { channel: 'msedge' }, { ...devices['Pixel 7'], userAgent: `${devices['Pixel 7'].userAgent} MicroMessenger/8.0.50` }],
]
for (const [name, engine, launch, device] of engines) {
  const browser = await engine.launch({ ...launch, headless: true })
  try {
    for (const width of [375, 390, 430]) {
      const context = await browser.newContext({ ...device, viewport: { width, height: 844 } })
      // Isolate navigation from remote data; no production database access or writes.
      await context.route('**/*.supabase.co/**', route => route.abort())
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(error.message))
      const toggle = page.locator('.menu-toggle'), menu = page.locator('.mobile-menu'), overlay = page.locator('.menu-backdrop')
      const closed = async () => {
        assert.equal(await toggle.getAttribute('aria-expanded'), 'false')
        assert.equal(await menu.isVisible(), false)
        assert.equal(await overlay.isVisible(), false)
        assert.equal(await page.locator('body').evaluate(node => node.classList.contains('menu-open')), false)
      }
      const open = async () => {
        await toggle.tap()
        assert.equal(await toggle.getAttribute('aria-expanded'), 'true')
        assert.equal(await menu.isVisible(), true)
        assert.equal(await overlay.isVisible(), true)
      }
      await page.goto(baseURL, { waitUntil: 'networkidle' })
      await closed()
      await open()
      await toggle.tap()
      await closed()
      await open()
      await page.touchscreen.tap(5, 650)
      await closed()
      for (const hash of ['top', 'services', 'compare', 'faq', 'contact']) {
        await open()
        await menu.locator(`a[href="/#${hash}"]`).tap()
        await page.waitForURL(`**/#${hash}`)
        await closed()
      }
      await open()
      await page.reload({ waitUntil: 'networkidle' })
      await closed()
      await open()
      await page.keyboard.press('Escape')
      await closed()
      await open()
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false')
      await closed()
      assert.equal(await toggle.isVisible(), false)
      assert.equal(await page.locator('.desktop-nav').isVisible(), true)
      assert.equal(await page.locator('.site-header').evaluate(node => getComputedStyle(node).zIndex), '20')
      await page.setViewportSize({ width, height: 844 })
      await closed()
      assert.deepEqual(errors, [])
      await context.close()
      console.log(`PASS ${name} ${width}px: default closed, toggle, overlay, five links, reload, Escape, desktop resize`)
    }
  } finally { await browser.close() }
}
