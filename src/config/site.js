// Works both in Vite and when the folder is served by a simple static server.
const env = import.meta.env ?? {}

export const siteConfig = {
  brand: 'Codex Assist',
  eyebrow: 'CODEX SETUP SERVICE',
  contact: {
    wechat: env.VITE_CONTACT_WECHAT || 'codex_support',
    qq: env.VITE_CONTACT_QQ || '123456789',
    phone: env.VITE_CONTACT_PHONE || '400-888-2026',
    hours: env.VITE_CONTACT_HOURS || '周一至周日 09:00–21:00',
  },
}
