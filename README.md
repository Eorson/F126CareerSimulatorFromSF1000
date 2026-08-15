# F1 26 Career Simulator BETA — Vue 3 + JavaScript

这是对原单文件 HTML 的兼容式 Vue 重构：
- Vue 3 负责应用挂载与生命周期入口。
- 原模拟器逻辑按原顺序保留在 `src/legacy.js`，避免改变比赛、存档、合同、研发、事件等行为。
- 原 CSS 按原顺序集中到 `src/style.css`，不主动改动样式规则。
- `index.html` 保持原页面结构和 `id/class/onclick` 接口，以保证现有逻辑继续工作。

## 直接部署
无需构建，整个项目目录可直接作为静态站点部署。

### Netlify
将项目根目录作为 Publish directory，Build command 留空即可。

### GitHub Pages
直接把项目文件发布到 Pages；`.nojekyll` 已包含。

> Vue 3 使用官方 CDN，因此浏览器需要能够访问 unpkg。若需要完全离线版本，可把 Vue runtime 下载到 `vendor/vue.global.prod.js` 后将 `index.html` 的 CDN 地址替换为本地路径。

## 可选 Vite
如果希望本地开发：`npm install` → `npm run dev`。`vite.config.js` 已设置相对 base，适合 GitHub Pages 子路径。
