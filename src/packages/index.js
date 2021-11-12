import Dialog from './dialog-api/index.js';
// ... 其他组件

// 全局注册组件
const install = Vue => {
  // ... 其他组件
};

/**
 * 有可能组件会通过script标签引入，如<script src='https://xxx/zyl-ui'></script>
 */
if (typeof Window.Vue !== 'undefined') {
  install(Window.Vue); // 全局直接通过script 引用的方式会默认调用install方法
}

export default {
  install,
  dialogAPI: Dialog,
};
