# Codex Assist

Codex 安装、配置与账号服务展示网站。项目使用 Vite + 原生 JavaScript，部署后不依赖本地电脑持续运行。

## 本地开发

```bash
pnpm install
pnpm dev
```

也可以使用 `npm install` 和 `npm run dev`。

## 构建

```bash
pnpm run build
```

Vercel 的构建设置：

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 内容维护

价格、名称、简介、标签、推荐和上架状态现由 Supabase 提供，登录 `/admin` 或 `/admin/services` 修改。完整使用说明见 [ADMIN.md](./ADMIN.md)。
当前优先通过 GitHub 推送触发 Netlify 自动部署，SPA fallback 由 `netlify.toml` 提供。

- 本地备用服务资料、详情说明、FAQ：`src/data/services.js`（成功读取数据库时，经营字段以数据库为准）
- 网站名称与联系方式：`src/config/site.js`
- 环境变量示例：`.env.example`
- 页面结构与路由渲染：`main.js`
- 视觉样式：`styles.css`

复制 `.env.example` 为 `.env` 后，可配置：

```text
VITE_CONTACT_WECHAT=
VITE_CONTACT_QQ=
VITE_CONTACT_PHONE=
VITE_CONTACT_HOURS=
```

这些值会在构建时写入公开网页，只能填写公开联系方式，不能填写密码、API Key 或其他私密信息。

## GitHub + Vercel 发布

1. 在 GitHub 新建一个空仓库。
2. 在项目目录执行：

```bash
git init
git add .
git commit -m "Initial Codex Assist site"
git branch -M main
git remote add origin <你的 GitHub 仓库地址>
git push -u origin main
```

3. 在 Vercel 选择 `Add New Project`，导入这个 GitHub 仓库。
4. 使用上面的 Vite 构建设置并点击 Deploy。
5. 后续每次 push 到 `main`，Vercel 会自动构建并发布新版本。

`vercel.json` 已配置 `/services/*` 的 SPA 回退，因此详情页可以直接刷新。`public/_redirects` 仍保留，方便同一份 `dist` 产物部署到 Netlify。
