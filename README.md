# Codex Assist

现有 Vite + 原生 JavaScript 服务展示网站。正式站点：https://codex-assist-site.netlify.app

## 维护方式

用户用自然语言、页面元素或浏览器批注提出修改，由 Codex 定位代码、修改、构建、提交和推送。
除非用户明确重新要求，不再开发独立后台、CMS、管理员登录或网页编辑器。

前台经营数据以代码为准，不读取 Supabase，不需要数据库在线即可展示服务与价格。

- `src/data/services.js`：服务、价格、上架与推荐状态、排序、选择卡片、服务详情和服务 FAQ。
- `src/data/faqs.js`：首页 FAQ。
- `src/data/site.js`：网站名称与联系方式。直接编辑这里，旧联系环境变量不再覆盖这些值。
- `main.js`：页面渲染及导航交互。
- `styles.css`、`public/styles.css`：现有样式，两份保持同步。

`priceType` 支持 fixed / consultation / free / hidden；固定价格使用数字，咨询价格使用 null。
服务设为 `published: false` 后不显示于前台。

项目仍使用 JavaScript，不需要为了数据文件改成 TypeScript。
原后台代码及 ADMIN.md 保留为历史资料，已停止开发；后台修改不会改变当前前台数据。

## 开发与发布

```bash
npm run dev
npm run build
git status
git add <本次修改文件>
git commit -m "Describe the change"
git push origin main
```

GitHub：https://github.com/genelimarayo-droid/codex-assist-site

Netlify 自动从 GitHub 构建，命令为 `npm run build`，发布目录为 `dist`。
`netlify.toml` 保留 SPA fallback。推送后检查正式站点版本及本次修改。
不提交密钥、密码、依赖缓存或构建产物，不混入无关本地改动。
Cloudflare 旧部署保留。

## 导航回归

`tests/mobile-navigation.mjs` 可用 Playwright + Edge/WebKit 检查 375/390/430px、菜单开关、遮罩、导航项、刷新和桌面切换。
将 `PLAYWRIGHT_MODULE` 指向 Playwright 的 `index.mjs`，可选 `SITE_URL` 指定正式站点；默认使用本地 5173 端口。
旧 `tests/admin-flow.mjs` 是历史后台流程测试，不用于当前静态前台验收。
