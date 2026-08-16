# F1 26 Career Simulator BETA — Vue 3 + JavaScript

源代码来自SF1000老师，只尝试fixbug

对原单文件 HTML 的兼容式 Vue 重构：

- Vue 3 负责应用挂载与生命周期入口。
- 原模拟器逻辑按原顺序保留在 `src/legacy.js`，避免改变比赛、存档、合同、研发、事件等行为。
- 原 CSS 按原顺序集中到 `src/style.css`，不主动改动样式规则。
- `index.html` 保持原页面结构和 `id/class/onclick` 接口，以保证现有逻辑继续工作。

-bug修复详情请看BUG_FIX_REPORT-
