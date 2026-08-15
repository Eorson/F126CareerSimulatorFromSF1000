/**
 * ========================================
 * F1 26 Career Simulator - Vue 3 主入口
 * ========================================
 *
 * 项目描述：
 * 这是一个F1 2026职业生涯模拟游戏，允许玩家以任何真实车手的身份
 * 进行整个赛季的职业模拟，包括车队研发、人际关系管理和比赛决策。
 *
 * 架构说明：
 * - main.js: Vue 3 框架初始化和应用挂载
 * - legacy.js: 核心游戏引擎和状态管理（保持传统JavaScript风格以兼容性）
 * - style.css: 全局样式（支持浅色/深色主题）
 * - index.html: HTML 页面结构
 */

// 从Vue中解构出必要的API
// createApp: 创建Vue应用实例
// nextTick: 在下一次DOM更新周期后执行回调
const { createApp, nextTick } = Vue;

/**
 * Vue 3 应用配置
 *
 * 说明：
 * 这是一个最小化的Vue应用包装器。主要业务逻辑保存在legacy.js中
 * 以保持与原始实现的兼容性。Vue这里主要用于提供现代的开发体验。
 */
createApp({
  /**
   * mounted 生命周期钩子
   * 当Vue应用挂载到DOM后执行
   */
  mounted() {
    nextTick(() => {
      // 标记Vue已成功挂载，便于其他脚本检测
      document.documentElement.dataset.vueMounted = "true";

      // 触发自定义事件，通知其他脚本Vue已准备就绪
      // legacy.js 中的脚本可以监听此事件
      window.dispatchEvent(new CustomEvent("f1vue:mounted"));
    });
  },
  // 将应用挂载到HTML中的 #app 元素
}).mount("#app");
