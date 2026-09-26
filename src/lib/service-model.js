import { services as defaults } from '../data/services.js'

export const fields = {
  name: ['name'], subtitle: ['subtitle'], price: ['price'],
  originalPrice: ['original_price'], priceType: ['price_type'], priceUnit: ['price_unit'],
  description: ['description'], badge: ['badge'],
  recommended: ['is_featured'], published: ['is_active'],
  sortOrder: ['sort_order'],
}
export function columnFor(row, field) {
  return fields[field].find(key => Object.hasOwn(row, key))
}
export function supportsField(row, field) {
  return Boolean(columnFor(row, field))
}
export function normalizeService(row) {
  const slug = String(row.id)
  const base = defaults.find(s => s.id === slug) || defaults.find(s => s.name === row.name) || {}
  const result = { ...base, id: slug, dbId: row.id }
  for (const field of Object.keys(fields)) {
    const column = columnFor(row, field)
    if (column) result[field] = row[column]
  }
  result.price = result.price == null ? null : Number(result.price)
  result.priceType ||= result.price == null ? 'consultation' : 'fixed'
  result.originalPrice = result.originalPrice == null ? null : Number(result.originalPrice)
  result.published ??= true
  result.recommended ??= base.id === 'plus-account'
  result.sortOrder ??= 0
  result.name ??= '服务方案'
  result.shortName = result.subtitle || row.short_name || base.shortName || result.name
  result.subtitle ??= ''
  result.description ??= ''
  result.badge ??= ''
  result.priceUnit ??= '次'
  result.number ??= ''
  result.category ??= ''
  result.comparison = { ...base.comparison }
  for (const key of ['suitableFor', 'features', 'includes', 'process', 'faqs']) {
    if (!Array.isArray(result[key])) result[key] = []
  }
  return result
}

export function servicePatch(row, values) {
  const patch = {}
  for (const [field, value] of Object.entries(values)) {
    const column = columnFor(row, field)
    if (column) patch[column] = value
    else throw new Error(`现有 services 表缺少 ${fields[field][0]} 字段，未保存。`)
  }
  return patch
}
