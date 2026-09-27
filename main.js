import { siteConfig as rawSiteConfig } from './src/data/site.js'
import { services as localServices } from './src/data/services.js'
import { faqs as localFaqs } from './src/data/faqs.js'
import { escapeTree } from './src/lib/html.js'

const siteConfig = escapeTree(rawSiteConfig)
const faqs = escapeTree(localFaqs)
const publishedServices = localServices.filter(service => service.published !== false)
  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
const services = escapeTree(publishedServices)

const app = document.querySelector('#app')
const contact = siteConfig.contact

const icon = (name) => `<span class="feature-icon" aria-hidden="true">${name}</span>`
const price = (service) => {
  const type = service.priceType || (service.price === null ? 'consultation' : 'fixed')
  if (type === 'hidden') return ''
  if (type === 'free') return '<span class="price-consult">免费</span>'
  if (type === 'consultation' || !Number.isFinite(service.price)) return '<span class="price-consult">咨询</span>'
  return `${Number.isFinite(service.originalPrice) && service.originalPrice > service.price ? `<del style="font-size:16px;color:#758197">¥${service.originalPrice}</del> ` : ''}<span class="price-currency">¥</span>${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(service.price)}${service.priceUnit ? `<small> / ${service.priceUnit}</small>` : ''}`
}

function header(active = 'home') {
  return `<header class="site-header">
    <a class="brand" href="/" aria-label="Codex Assist 首页"><span class="brand-symbol">&gt;_</span><span><strong>${siteConfig.brand}</strong><small>${siteConfig.eyebrow}</small></span></a>
    <nav class="desktop-nav" aria-label="主导航">
      <a class="${active === 'home' ? 'active' : ''}" href="/#top">首页</a>
      <a class="${active === 'services' ? 'active' : ''}" href="/#services">服务方案</a>
      <a href="/#compare">怎么选择</a>
      <a href="/#faq">常见问题</a>
    </nav>
    <a class="header-cta" href="/#contact">立即咨询 <span>↗</span></a>
    <button class="menu-toggle" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
  </header>`
}

function mobileMenu() {
  return `<div class="menu-backdrop" hidden></div><aside id="mobile-menu" class="mobile-menu" hidden><nav><a href="/#top">首页</a><a href="/#services">服务方案</a><a href="/#compare">怎么选择</a><a href="/#faq">常见问题</a></nav><a class="button button-dark mobile-contact" href="/#contact">立即咨询 <span>↗</span></a></aside>`
}

function footer() {
  return `<footer class="site-footer"><div class="footer-main"><a class="brand" href="/"><span class="brand-symbol">&gt;_</span><span><strong>${siteConfig.brand}</strong><small>${siteConfig.eyebrow}</small></span></a><p>帮助普通用户更清楚地完成 Codex 安装、配置与使用准备。</p><div class="footer-contact"><span>咨询微信：${contact.wechats.map(id => `<b>${id}</b>`).join('、')}</span><span>服务时间：${contact.hours}</span></div></div><div class="footer-bottom"><span>© 2026 ${siteConfig.brand}</span><span>账号信息不会展示在网站页面中</span></div></footer>`
}

function contactActions() {
  return `<div class="contact-actions">${contact.wechats.map(id => `<button class="button button-outline-light copy-contact" data-copy="${id}" type="button">复制 ${id} <span>⧉</span></button>`).join('')}<small>微信：${contact.wechats.join('、')} · ${contact.hours}</small></div>`
}

function serviceCard(service) {
  return `<article class="service-card ${service.recommended ? 'featured' : ''}">
    <div class="card-top"><span class="card-number">${service.number}</span><span class="badge">${service.badge}</span></div>
    <div class="card-title"><h3>${service.name}</h3><span class="card-arrow">↗</span></div>
    ${service.subtitle ? `<p>${service.subtitle}</p>` : ''}<p>${service.description}</p>
    <div class="card-price">${price(service)}</div>
    <div class="card-audience"><span class="label">适合</span>${service.suitableFor[0] || '欢迎咨询'}</div>
    <a class="card-link" href="/services/${encodeURIComponent(service.id)}">了解方案 <span>→</span></a>
  </article>`
}

function compareTable() {
  const rows = [
    ['是否需要自己有账号', 'ownAccount'],
    ['是否包含 Plus', 'plus'],
    ['账号归属', 'ownership'],
    ['是否提供配置', 'setup'],
    ['适合人群', 'audience'],
  ]
  return `<div class="comparison-table"><div class="comparison-row comparison-head"><span>服务项目</span>${services.map((s) => `<span>${s.shortName}</span>`).join('')}</div>${rows.map(([label, key]) => `<div class="comparison-row"><strong>${label}</strong>${services.map((s) => `<span>${s.comparison[key]}</span>`).join('')}</div>`).join('')}</div><div class="comparison-mobile">${services.map((s) => `<article class="comparison-mobile-card"><div><b>${s.number}</b><strong>${s.shortName}</strong></div>${rows.map(([label, key]) => `<p><span>${label}</span><b>${s.comparison[key]}</b></p>`).join('')}</article>`).join('')}</div>`
}

function homePage() {
  return `${header('home')}<main>
    <section id="top" class="hero-section section-shell"><div class="hero-grid">
      <div class="hero-copy"><div class="eyebrow"><span class="eyebrow-dot"></span>CODEX 安装 / 配置服务</div><h1>不知道怎么安装 Codex？<br /><em>我们帮你配置好。</em></h1><p>从已有账号接入，到成品账号和专属配置，帮你快速理清选择，完成基础环境准备，开始使用 Codex。</p><div class="hero-actions"><a class="button button-primary" href="#services">查看服务方案 <span>→</span></a><a class="text-button" href="#contact">直接咨询 <span>↗</span></a></div><div class="hero-points"><span>${icon('✓')} 不展示账号密码</span><span>${icon('✓')} 按需人工指导</span></div></div>
      <div class="hero-console" aria-label="Codex 配置终端示意"><div class="console-bar"><span></span><span></span><span></span><small>codex-assist / setup</small></div><div class="console-body"><p><i>01</i> 选择你的使用方式</p><p class="console-muted"><i>02</i> 我们确认配置范围</p><p class="console-muted"><i>03</i> 完成安装与交付</p><div class="console-cursor">ready<span>_</span></div></div><div class="console-caption"><span class="status-dot"></span><span>配置流程清晰可追踪</span></div></div>
    </div></section>

    <section id="services" class="section-shell services-section"><div class="section-heading"><div><span class="eyebrow">四种服务方式</span><h2>先看清区别，再选适合你的方案</h2></div><p>不做复杂套餐，只把每种方式的适用场景说明白。</p></div><div class="service-grid">${services.map(serviceCard).join('')}</div></section>

    <section id="choose" class="chooser-section"><div class="section-shell"><div class="section-heading light"><div><span class="eyebrow">Still deciding?</span><h2>不知道选哪一种？</h2></div><p>根据你现在的账号状态和使用目标，快速找到对应方案。</p></div><div class="chooser-grid">${services.map(s => `<div class="choice"><span>${s.chooserPrompt || s.suitableFor[0] || s.name}</span><b>${s.chooserLabel || s.name} <a href="/services/${encodeURIComponent(s.id)}">→</a></b></div>`).join('')}</div></div></section>

    <section id="compare" class="section-shell compare-section"><div class="section-heading"><div><span class="eyebrow">清晰对比</span><h2>四种方案，一张表看懂</h2></div><p>具体交付以购买前确认的实际服务说明为准。</p></div>${compareTable()}</section>

    <section id="process" class="process-section"><div class="section-shell"><div class="section-heading light"><div><span class="eyebrow">服务流程</span><h2>从咨询到开始使用，只有四步</h2></div></div><div class="process-grid"><div class="process-step"><b>01</b><span class="process-line"></span><h3>选择方案</h3><p>根据你的账号状态和目标，先选最合适的方式。</p></div><div class="process-step"><b>02</b><span class="process-line"></span><h3>联系客服</h3><p>说明你的情况，确认服务范围与注意事项。</p></div><div class="process-step"><b>03</b><span class="process-line"></span><h3>完成配置</h3><p>按方案完成账号、环境和基础使用配置。</p></div><div class="process-step"><b>04</b><span class="process-line"></span><h3>开始使用</h3><p>拿到清晰说明，开始你的 Codex 使用流程。</p></div></div></div></section>

    <section id="faq" class="section-shell faq-section"><div class="section-heading"><div><span class="eyebrow">FAQ</span><h2>常见问题</h2></div><p>还没找到答案？可以直接联系我们。</p></div><div class="faq-list">${faqs.map(faq => `<details><summary>${faq.q}<span>+</span></summary><p>${faq.a}</p></details>`).join('')}</div></section>

    <section id="contact" class="contact-section"><div class="section-shell contact-inner"><div><span class="eyebrow">准备开始了吗？</span><h2>把你的情况告诉我们，<br /><em>一起选对方案。</em></h2></div>${contactActions()}</div></section>
  </main>${footer()}${mobileMenu()}`
}

function detailPage(service) {
  const faqMarkup = service.faqs.map((faq) => `<details><summary>${faq.q}<span>+</span></summary><p>${faq.a}</p></details>`).join('')
  return `${header('services')}<main class="detail-main"><section class="detail-hero section-shell"><a class="back-link" href="/#services">← 返回服务方案</a><div class="detail-hero-grid"><div><span class="eyebrow"><b>${service.number}</b> / ${service.category}</span><h1>${service.name}</h1><p>${service.description}</p><div class="detail-price">${price(service)}</div><div class="hero-actions"><a class="button button-primary" href="/#contact">立即咨询 <span>↗</span></a><span class="availability"><i></i>${service.availability === 'available' ? '当前可咨询' : '价格与库存请咨询'}</span></div></div><div class="detail-side-note"><span class="note-label">你会得到</span><strong>${service.badge}</strong><p>${service.includes[0]}</p><p>${service.includes[1]}</p></div></div></section>
    <section class="section-shell detail-content"><div class="detail-two-col"><div><span class="eyebrow">适合谁</span><h2>这个方案适合这样的你</h2></div><ul class="check-list">${service.suitableFor.map((item) => `<li>${icon('✓')}<span>${item}</span></li>`).join('')}</ul></div><div class="detail-two-col includes-block"><div><span class="eyebrow">你将获得什么</span><h2>把配置交给清晰的流程</h2></div><div class="include-grid">${service.features.map((item, i) => `<div class="include-item"><span>${['⌘','◎','→','✓'][i % 4]}</span><b>${item}</b></div>`).join('')}</div></div></section>
    <section class="detail-process-section"><div class="section-shell"><div class="section-heading light"><div><span class="eyebrow">服务流程</span><h2>确认后，我们按这几步完成</h2></div></div><div class="detail-process-list">${service.process.map((item, i) => `<div><b>0${i + 1}</b><span>${item}</span></div>`).join('')}</div></div></section>
    <section class="section-shell detail-faq"><div class="section-heading"><div><span class="eyebrow">FAQ</span><h2>关于这个方案</h2></div></div><div class="faq-list">${faqMarkup}</div></section>
    <section class="contact-section detail-contact"><div class="section-shell contact-inner"><div><span class="eyebrow">下一步</span><h2>确认适合你的服务，<br /><em>再开始配置。</em></h2></div>${contactActions()}</div></section>
  </main>${footer()}${mobileMenu()}`
}

function updateMeta(service) {
  const title = service ? `${service.name}｜Codex 安装配置服务` : 'Codex 安装配置服务｜Codex 配置、账号与使用服务'
  const description = service ? `${service.description} 提供 Codex 安装、配置和使用说明，详情请咨询。` : '提供 Codex 安装、配置及相关账号服务，帮助用户快速完成环境配置并开始使用。'
  document.title = title
  let meta = document.querySelector('meta[name="description"]')
  if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta) }
  meta.content = description
}

let interactionController
function wireInteractions() {
  interactionController?.abort()
  interactionController = new AbortController()
  const options = { signal: interactionController.signal }
  const toggle = document.querySelector('.menu-toggle')
  const menu = document.querySelector('.mobile-menu')
  const backdrop = document.querySelector('.menu-backdrop')
  const setMenu = (open) => {
    if (!toggle || !menu || !backdrop) return
    toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单')
    menu.hidden = !open; backdrop.hidden = !open; document.body.classList.toggle('menu-open', open)
  }
  setMenu(false)
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'), options)
  backdrop?.addEventListener('click', () => setMenu(false), options)
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false), options))
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setMenu(false) }, options)
  window.addEventListener('resize', () => { if (window.innerWidth > 760) setMenu(false) }, options)
  window.addEventListener('pageshow', () => setMenu(false), options)
  document.querySelectorAll('.copy-contact').forEach((button) => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = `已复制 ${button.dataset.copy} ✓` } catch { button.textContent = `微信：${button.dataset.copy}` }
  }, options))
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', () => setMenu(false), options))
}

async function start() {
  if (/^\/admin(?:\/|$)/.test(location.pathname)) {
    const { mountAdmin } = await import('./src/admin.js')
    await mountAdmin(app)
    return
  }
  const match = location.pathname.match(/^\/services\/([^/]+)\/?$/)
  const selectedService = match ? publishedServices.find(s => encodeURIComponent(s.id) === match[1]) : null
  app.innerHTML = match
    ? (selectedService ? detailPage(escapeTree(selectedService)) : `${header()}<main class="section-shell" style="padding:80px 0"><h1>此服务不存在或已下架</h1><a href="/">返回首页</a></main>${footer()}`)
    : homePage()
  updateMeta(selectedService)
  wireInteractions()
  if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
}
start().catch(() => {
  app.innerHTML = '<main class="section-shell" style="padding:60px 0"><h1>页面暂时无法加载</h1><p>请刷新重试。</p><a href="/">返回首页</a></main>'
})
