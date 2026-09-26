export const services = [
  {
    id: 'relay', number: '01', name: '中转方案', shortName: '中转', badge: '入门方案',
    chooserPrompt: '适用于新手练手或想降低token费用', chooserLabel: '选择中转方案',
    priceType: 'fixed', recommended: false, published: true, sortOrder: 1,
    description: '适用于新手练手或想降低token费用', price: 49.9, priceUnit: '次', category: '新手练手 / 降低费用',
    suitableFor: ['新手练手或想降低token费用的用户', '不想花时间处理连接与基础配置', '希望有人带着完成初次使用'],
    features: ['配置连接方案', '基础环境安装指导', '常用设置说明', '使用过程答疑'],
    includes: ['根据现有账号情况确认方案', '协助完成基础配置', '提供清晰的使用说明'],
    process: ['联系客服并说明当前账号情况', '确认方案与服务范围', '完成配置与测试', '开始使用 Codex'],
    faqs: [
      { q: '中转方案需要我有自己的账号吗？', a: '不需要。适用于新手练手或想降低token费用。' },
      { q: '需要把账号密码交给你们吗？', a: '请先咨询具体服务方式。涉及账号验证的步骤会由客户本人完成，我们不会在网页保存账号密码。' },
      { q: '这个方案包含 Plus 吗？', a: '中转方案本身不默认包含 Plus，具体以实际服务说明为准。' },
    ], availability: 'available', comparison: { ownAccount: '不需要', plus: '以实际服务说明为准', ownership: '客户自己的账号', setup: '是', audience: '新手练手或想降低token费用' },
  },
  {
    id: 'plus-account', number: '02', name: 'Codex 成品账号 + Plus', shortName: '成品账号 + Plus', badge: '直接开始',
    chooserPrompt: '我没有账号，想直接使用', chooserLabel: '选择成品账号 + Plus',
    priceType: 'fixed', recommended: true, published: true, sortOrder: 2,
    description: '已完成基础配置，适合希望减少自行配置时间、直接开始使用的用户。', price: 288, priceUnit: '套', category: '开箱即用',
    suitableFor: ['没有现成账号或不想自行配置', '希望尽快开始使用 Codex', '需要 Plus 服务的用户'],
    features: ['已完成基础配置', '包含 Plus 服务（期限以实际商品说明为准）', '安装与配置说明', '基础使用答疑'],
    includes: ['成品账号交付说明', '基础安装与配置指导', 'Plus 服务期限说明', '首次使用问题答疑'],
    process: ['联系客服确认库存与服务期限', '确认交付规则与注意事项', '按说明完成登录与基础设置', '开始使用 Codex'],
    faqs: [
      { q: '购买后可以直接使用吗？', a: '服务已完成基础配置，会提供安装和使用说明，适合希望快速开始的用户。' },
      { q: 'Plus 包含多长时间？', a: '具体期限会随实际服务说明展示，购买前请联系客服确认。' },
      { q: '网页会展示账号密码吗？', a: '不会。账号信息不会出现在公开页面，也不会写入前端代码。' },
    ], availability: 'available', comparison: { ownAccount: '否', plus: '是', ownership: '以实际交付规则说明', setup: '是', audience: '想直接使用' },
  },
  {
    id: 'new-account', number: '03', name: '从 0 配置专属账号', shortName: '从 0 配置', badge: '账号属于你',
    chooserPrompt: '我想要完全属于自己的账号', chooserLabel: '选择从 0 配置',
    priceType: 'consultation', recommended: false, published: true, sortOrder: 3,
    description: '使用客户自己的信息，协助完成注册、基础配置和 Codex 环境安装。', price: null, priceUnit: '咨询', category: '专属配置',
    suitableFor: ['没有账号，想从零开始', '希望账号由自己持有和管理', '需要安装与配置陪伴'],
    features: ['使用客户自己的信息', '协助完成账号注册', '完成基础环境安装', '配置完成后交付给客户'],
    includes: ['注册流程说明与协助', '客户本人完成必要验证', 'Codex 基础安装与配置', '交付后的使用说明'],
    process: ['联系客服确认需求', '客户本人完成必要的注册验证', '协助完成环境配置与测试', '交付并由客户自行管理'],
    faqs: [
      { q: '账号是我自己的吗？', a: '是。这个方案使用客户自己的信息，账号由客户自己持有和管理。' },
      { q: '注册验证可以代办吗？', a: '涉及客户本人验证的步骤，需要由客户自行完成，我们会提供流程指导。' },
      { q: '配置完成后还会长期持有我的账号吗？', a: '不会。配置完成后交付给客户管理，网站也不会保存客户账号密码。' },
    ], availability: 'consult', comparison: { ownAccount: '否', plus: '以实际情况为准', ownership: '客户自己的账号', setup: '是', audience: '想拥有自己的账号' },
  },
  {
    id: 'white-account', number: '04', name: 'Codex 白号', shortName: '白号', badge: '基础账号',
    chooserPrompt: '我只需要一个基础账号', chooserLabel: '选择 Codex 白号',
    priceType: 'consultation', recommended: false, published: true, sortOrder: 4,
    description: '已注册、无 Plus 的基础账号，适合只需要基础使用条件的用户。', price: null, priceUnit: '咨询', category: '基础账号',
    suitableFor: ['已经有自己的使用方式', '暂时不需要 Plus', '只需要一个基础账号'],
    features: ['已注册基础账号', '不包含 Plus', '基础交付说明', '使用问题答疑'],
    includes: ['账号类型与服务说明', '基础登录指引', '常见问题说明'],
    process: ['联系客服确认需求', '确认账号状态与交付规则', '按说明完成登录', '开始使用基础功能'],
    faqs: [
      { q: '白号包含 Plus 吗？', a: '不包含。白号是已注册、无 Plus 的基础账号。' },
      { q: '适合完全不会安装的人吗？', a: '可以先咨询，我们会说明基础使用步骤；如果需要完整配置，可考虑从 0 配置方案。' },
      { q: '网页会公开展示账号吗？', a: '不会。真实账号信息不会展示在网站页面中。' },
    ], availability: 'consult', comparison: { ownAccount: '否', plus: '否', ownership: '以实际交付规则说明', setup: '基础配置', audience: '只需基础账号' },
  },
]

export const serviceById = (id) => services.find((service) => service.id === id)
