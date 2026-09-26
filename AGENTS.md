# 项目维护约定

- 这是现有 Vite + 原生 JavaScript 网站，不重建项目、不更换技术栈。
- 正式站点：https://codex-assist-site.netlify.app
- GitHub：https://github.com/genelimarayo-droid/codex-assist-site
- 用户通过自然语言、当前网页元素和浏览器批注提出修改。优先自行结合页面与源码定位，不要求用户寻找代码文件。
- 完成用户要求的修改后，运行 `npm run build`，执行必要的针对性验证，检查 Git 差异，提交并推送到现有 GitHub 分支，由 Netlify 自动部署。核实上线结果；有阻碍则明确报告，不声称已部署。
- 普通修改已有持续授权，无需重复询问技术细节或提交/推送许可；重大架构变化需先确认。
- 不再开发独立后台、/admin、Supabase 管理后台、CMS、管理员登录或网页编辑器，除非用户明确重新要求。
- 前台经营内容以代码中的集中数据文件为准：`src/data/services.js`（服务、价格、详情及服务 FAQ）、`src/data/faqs.js`（首页 FAQ）、`src/data/site.js`（网站配置、联系方式）。保持 JavaScript，不为文件后缀引入 TypeScript。
- 保留现有 UI，尤其不能回退移动导航修复：菜单及遮罩默认隐藏、按钮与菜单项/遮罩可关闭、桌面导航不受影响。
- 不修改现有云数据库、管理员账号或 Cloudflare 部署，除非明确要求。
- 不提交密钥、密码、构建产物、node_modules 或 .pnpm-store 缓存；保留无关本地改动，仅提交本次任务文件。
