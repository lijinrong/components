# 公共组件库

## 背景：

目前公共组件封装好了，需要拷贝到各个项目中，创建此库可通过npm管理公共组件。

## 目录结构

```javascrit
.
├── README.md
├── babel.config.js
├── lib												 #最终打包文件
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets
│   ├── main.js
│   ├── packages								#组件目录
│   │   ├── dialog-api
│   │   │   ├── index.js				#单个组件入口，各组件通过此入口文件实现按需加载
│   │   │   ├── index.less
│   │   │   ├── index.vue
│   │   │   └── readme.md
│   │   └── index.js						#组件库入口
│   └── styles
│       └── _var.scss
├── stylelint.config.js
├── tests												#组件测试用例
│   └── unit
│       └── example.spec.js
└── vue.config.js
```

## 组件开发

组件目录在`src/packages`，下面拿`dialog-api`组件为例：

1. 在`src/packages`新建目录`dialog-api`
2. 在`dialog-api`目录新建`index.js`和`index.vue`（样式文件可自行创建，此处只例举必要条件）
3. `dialog-api/index.vue`撰写组件代码
4. `dialog-api/index.js`写组件入口，如下：

```js
import Avatar from './index.vue';

Avatar.install = function(Vue) {
  Vue.component(Avatar.name, Avatar);
};

export default Avatar;

```

