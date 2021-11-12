import Dialog from './dialog-api/index.js';
import Avatar from './avatar/index.js';

// 组件列表
const components = [
  Avatar,
];

// 全局注册组件
const install = Vue => {
  components.forEach(comp => {
    Vue.components(comp.name, comp);
  });
};

/**
 * 有可能组件会通过script标签引入，如<script src='https://xxx'></script>
 */
if (typeof Window.Vue !== 'undefined') {
  install(Window.Vue); // 全局直接通过script 引用的方式会默认调用install方法
}

export default {
  install,
  dialogApi: Dialog,
	Avatar,
};
