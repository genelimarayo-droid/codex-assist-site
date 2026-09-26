import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY
export let supabase = null
export let configurationError = ''
try {
  if (!url || !key) throw new Error('缺少 Supabase 公开环境变量，请检查 Netlify 构建配置。')
  if (key.startsWith('sb_secret_')) throw new Error('请使用 Supabase publishable / anon key。')
  const payload = key.split('.')[1]
  if (payload && JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))).role === 'service_role') {
    throw new Error('禁止在前端使用 service_role key。')
  }
  supabase = createClient(url, key, {
    global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal || AbortSignal.timeout(15000) }) },
  })
} catch (error) { configurationError = error.message }

export async function readServices(client = supabase) {
  if (!client) throw new Error(configurationError)
  const { data, error } = await client.from('services').select('*').abortSignal(AbortSignal.timeout(15000))
  if (error) throw error
  return data.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || String(a.id).localeCompare(String(b.id)))
}

export async function requireAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!user) throw new Error('请先登录。')
  const result = await supabase.from('admins').select('user_id').eq('user_id', user.id).maybeSingle()
  if (result.error) throw result.error
  if (!result.data) throw new Error('此账号不是管理员，无权进入后台。')
  return user
}

export async function saveService(row, patch) {
  await requireAdmin()
  let query = supabase.from('services').update(patch).eq('id', row.id)
  if (row.updated_at) query = query.eq('updated_at', row.updated_at)
  const { data, error } = await query.select('*').single()
  if (error) throw new Error(`保存失败：${error.message}。请检查权限，或刷新确认数据是否已被其他设备修改。`)
  return data
}

// Public reads must stay anonymous even when this browser has an administrator session.
export const publicSupabase = supabase ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'codex-public' },
}) : null
