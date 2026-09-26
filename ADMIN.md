# 管理员后台

> 历史资料：自 2026-09-26 起停止后台开发，前台改由 `src/data` 中的本地文件维护。下述数据库更新流程不再影响当前前台，请按 README.md 和 AGENTS.md 的代码发布流程维护网站。

现有 Vite + 原生 JavaScript 项目，使用 Supabase Auth 和数据库现有 RLS。
未改动数据库结构、管理员账号、Netlify 项目或 Cloudflare 部署。

## 使用

1. 打开 `/admin`，未登录会自动前往 `/admin/login`。
2. 输入现有管理员邮箱和密码，登录后校验 `admins.user_id`。
3. `/admin` 和 `/admin/services` 均可查看、编辑服务。
4. 如果管理员查询也无服务记录，点击“导入现有四种服务”。仅执行 INSERT，不覆盖已有记录；已有主键会导致导入失败而非覆盖。
5. 修改价格后保存，再刷新前台或详情页查看。经营数据更新不需要重新部署。

## 公开构建变量

- `VITE_SUPABASE_URL`：当前验证可访问的域名为 `https://ypydweztobzigaajcbhg.supabase.co`，注意不是 `yypd...`。
- `VITE_SUPABASE_ANON_KEY`（或 `VITE_SUPABASE_PUBLISHABLE_KEY`）：同一项目的公开 key。
- 禁止使用 secret / service_role key。密码仅由浏览器交给 Supabase Auth。

变量在 Vite 构建时注入，首次修改环境变量需要重新部署。构建产物不依赖笔记本运行。

## 已核实字段

`admins.user_id`；`services` 的 `id`、`name`、`short_name`、`subtitle`、`price`、`original_price`、`price_type`、`price_unit`、`description`、`badge`、`is_featured`、`is_active`、`sort_order`、`updated_at`。

固定价格用数值；`consultation` / `free` / `hidden` 保存 `price = null`。
前台匿名读取数据库，即使同一浏览器已登录管理员，也只展示 `is_active` 的服务。
请求失败保留本地介绍并显示“价格请咨询”；成功返回空数组时展示暂无上架服务，不把下架内容重新补回。
详情页原有说明仍保存在 `src/data/services.js`。FAQ、联系信息等后续再接入。

后台会在每次写入前重新校验用户；真正的数据库访问边界是 Supabase 现有 RLS。代码不会修改策略。
必须由现有策略限制 admins 自我授权、非管理员写入及未上架服务公开读取。
无法仅凭公开 key 验证完整策略定义或管理员成功写入；正式验收需用户本人登录测试。

## 验证

`npm run build`。

`tests/admin-flow.mjs` 使用 Playwright + Edge，测试请求全部模拟，不读取真实密码，不修改生产数据。
运行测试前，以占位公开配置启动 `npm run dev -- --port 5173`；将 `PLAYWRIGHT_MODULE` 指向已安装的 Playwright `index.mjs`，再执行 `node tests/admin-flow.mjs`。
覆盖后台跳转、登录、非管理员拒绝、保存回显、咨询空价格、写入拒绝、退出、手机宽度、故障降级、下架及空数据。

Netlify fallback 已在 `netlify.toml` 配置为 `/* -> /index.html (200)`；`main.js` 负责选择前台或后台页面。
