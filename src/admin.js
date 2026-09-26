import { supabase, configurationError, requireAdmin, readServices, saveService } from './lib/supabase.js'
import { normalizeService, supportsField, servicePatch } from './lib/service-model.js'
import { escapeHtml as h } from './lib/html.js'
import './admin.css'
import { services as defaults } from './data/services.js'

const inputFields = [
  ['name', '服务名称', 'text'], ['subtitle', '副标题', 'text'],
  ['price', '价格（元）', 'number'], ['originalPrice', '原价（元，可留空）', 'number'],
  ['priceUnit', '价格单位', 'text'], ['badge', '标签', 'text'], ['sortOrder', '排序', 'number'],
]

export async function mountAdmin(app) {
  document.title = '管理员后台 · Codex Assist'
  const path = location.pathname.replace(/\/+$/, '')
  const frame = body => {
    app.innerHTML = `<main class="admin-shell"><header class="admin-header"><a href="/admin"><b>Codex Assist</b> 管理后台</a><a href="/">查看前台 ↗</a></header>${body}</main>`
  }
  const message = text => frame(`<section class="admin-panel"><p role="status">${h(text)}</p><a href="/admin/login">返回登录</a></section>`)
  if (!supabase) { message(configurationError); return }
  frame('<section class="admin-panel" role="status">正在检查登录状态…</section>')
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) { message('读取登录状态失败，请重新登录。'); return }
  if (!session) {
    if (path !== '/admin/login') location.replace('/admin/login')
    else login()
    return
  }
  try { await requireAdmin() }
  catch (error) {
    await supabase.auth.signOut({ scope: 'local' })
    login(error.message)
    history.replaceState(null, '', '/admin/login')
    return
  }
  if (path === '/admin/login') { location.replace('/admin'); return }
  if (!['/admin', '/admin/services'].includes(path)) { message('此后台页面暂未开放。'); return }
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') location.replace('/admin/login')
  })
  frame(`<nav class="admin-nav"><a href="/admin">后台首页</a><a href="/admin/services">服务管理</a><button id="logout" type="button">退出登录</button></nav><section class="admin-panel"><h1>${path === '/admin' ? '后台首页' : '服务管理'}</h1><p>修改后保存，客户刷新网站即可看到最新内容。</p><p id="list-status" role="status">正在读取服务…</p><div id="service-list"></div></section>`)
  document.querySelector('#logout').onclick = async event => {
    event.target.disabled = true
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) { event.target.disabled = false; document.querySelector('#list-status').textContent = '退出失败，请重试。' }
  }
  await load()

  function login(initialError = '') {
    frame(`<section class="admin-panel admin-login"><h1>管理员登录</h1><p>使用已创建的管理员邮箱与密码。</p><form id="login-form"><label>邮箱<input name="email" type="email" autocomplete="username" required></label><label>密码<input name="password" type="password" autocomplete="current-password" required></label><p class="admin-message" role="alert">${h(initialError)}</p><button class="admin-primary" type="submit">登录</button></form></section>`)
    document.querySelector('#login-form').onsubmit = async event => {
      event.preventDefault()
      const form = event.currentTarget
      const button = form.querySelector('button')
      const status = form.querySelector('[role="alert"]')
      const values = new FormData(form)
      button.disabled = true; status.textContent = '正在登录…'
      try {
        const { error } = await supabase.auth.signInWithPassword({ email: values.get('email').trim(), password: values.get('password') })
        form.elements.password.value = ''
        if (error) throw new Error('登录失败，请检查邮箱和密码，或稍后重试。')
        await requireAdmin()
        location.replace('/admin')
      } catch (error) {
        await supabase.auth.signOut({ scope: 'local' })
        status.textContent = error.message
        button.disabled = false
      } finally { form.elements.password.value = '' }
    }
  }

  async function load() {
    const status = document.querySelector('#list-status')
    try {
      const rows = await readServices()
      status.textContent = rows.length ? `共 ${rows.length} 项服务` : '当前账号未读取到服务记录。可将现有四种服务导入数据库。'
      const list = document.querySelector('#service-list')
      list.replaceChildren()
      rows.forEach(row => list.append(editor(row)))
      if (!rows.length) {
        const seed = document.createElement('button')
        seed.type = 'button'; seed.textContent = '导入现有四种服务'
        seed.onclick = async () => {
          seed.disabled = true
          try {
            await requireAdmin()
            const current = await readServices()
            if (current.length) { await load(); return }
            const records = defaults.map((s, index) => ({
              id: s.id, name: s.name, short_name: s.shortName, subtitle: '',
              price: s.price, original_price: null, price_type: s.price === null ? 'consultation' : 'fixed',
              price_unit: s.priceUnit, description: s.description, badge: s.badge,
              is_featured: s.id === 'plus-account', is_active: true, sort_order: index + 1,
            }))
            // INSERT never overwrites existing records; RLS still applies to this authenticated request.
            const { error } = await supabase.from('services').insert(records).select('id')
            if (error) throw error
            await load()
          } catch (error) { status.textContent = `导入失败：${error.message}`; seed.disabled = false }
        }
        list.append(seed)
      }
    } catch (error) {
      status.textContent = `读取失败：${error.message} `
      const retry = document.createElement('button')
      retry.textContent = '重试'; retry.onclick = load; status.append(retry)
    }
  }

  function editor(initialRow) {
    let row = initialRow
    let service = normalizeService(row)
    const form = document.createElement('form')
    form.className = 'admin-service'
    const supported = field => supportsField(row, field)
    form.innerHTML = `<h2>${h(service.name)}</h2><div class="admin-fields">${inputFields.map(([field, label, type]) => `<label>${label}<input name="${field}" type="${type}" value="${h(service[field])}" ${type === 'number' ? `step="${field === 'sortOrder' ? '1' : '0.01'}" ${field !== 'sortOrder' ? 'min="0"' : ''}` : 'maxlength="200"'} ${field === 'name' ? 'required' : ''} ${supported(field) ? '' : 'disabled title="现有表无此字段"'}></label>`).join('')}
      <label>价格类型<select name="priceType" ${supported('priceType') ? '' : 'disabled'}>${[['fixed', '固定价格'], ['consultation', '咨询'], ['free', '免费'], ['hidden', '隐藏价格']].map(([value, label]) => `<option value="${value}" ${service.priceType === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label class="admin-wide">简介<textarea name="description" rows="3" ${supported('description') ? '' : 'disabled'}>${h(service.description)}</textarea></label>
      ${[['recommended', '推荐'], ['published', '上架']].map(([field, label]) => `<label class="admin-check"><input type="checkbox" name="${field}" ${service[field] ? 'checked' : ''} ${supported(field) ? '' : 'disabled'}>${label}</label>`).join('')}</div>
      <p class="admin-message" role="status" aria-live="polite"></p><button class="admin-primary" type="submit">保存修改</button>`
    const typeSelect = form.elements.priceType
    const syncPrice = () => {
      form.elements.price.disabled = typeSelect.value !== 'fixed' || !supported('price')
      form.elements.price.required = typeSelect.value === 'fixed'
    }
    typeSelect.onchange = syncPrice; syncPrice()
    form.oninput = () => { form.dataset.dirty = 'true' }
    form.onsubmit = async event => {
      event.preventDefault()
      const button = form.querySelector('button[type="submit"]')
      const status = form.querySelector('[role="status"]')
      button.disabled = true; status.textContent = '正在保存…'
      try {
        const values = {}
        for (const [field, , type] of inputFields) {
          if (!supported(field) || field === 'price') continue
          const value = form.elements[field].value.trim()
          values[field] = type === 'number' ? (value === '' ? (field === 'sortOrder' ? 0 : null) : Number(value)) : value
        }
        if (supported('priceType')) values.priceType = typeSelect.value
        values.price = typeSelect.value === 'fixed' ? Number(form.elements.price.value) : null
        if (typeSelect.value === 'fixed' && (!form.elements.price.value.trim() || !Number.isFinite(values.price) || values.price < 0)) throw new Error('请输入有效的非负价格。')
        if (supported('description')) values.description = form.elements.description.value.trim()
        for (const field of ['recommended', 'published']) if (supported(field)) values[field] = form.elements[field].checked
        // Only send changed fields; retain every other existing database column.
        const changed = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== service[key]))
        if (!Object.keys(changed).length) { delete form.dataset.dirty; status.textContent = '没有需要保存的修改。'; return }
        const controls = [...form.elements].map(control => [control, control.disabled])
        controls.forEach(([control]) => { control.disabled = true })
        try { row = await saveService(row, servicePatch(row, changed)) }
        finally { controls.forEach(([control, disabled]) => { control.disabled = disabled }) }
        service = normalizeService(row)
        form.querySelector('h2').textContent = service.name
        delete form.dataset.dirty
        status.textContent = '已保存到 Supabase。刷新前台即可查看。'
      } catch (error) { status.textContent = error.message }
      finally { button.disabled = false }
    }
    return form
  }
}

window.addEventListener('beforeunload', event => {
  if (document.querySelector('[data-dirty="true"]')) { event.preventDefault(); event.returnValue = '' }
})
