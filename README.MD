# 公共组件库

## 背景：

目前公共组件封装好了，需要拷贝到各个项目中，创建此库可通过 npm 管理公共组件。

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

Avatar.install = function (Vue) {
  Vue.component(Avatar.name, Avatar);
};

export default Avatar;
```

5. 在`packages/index.js`组件列表中加入组件引用并导出

ps：若希望组件不能通过`Vue.use`安装，入口文件为`index.vue`即可，可忽略 index.js 文件，打包工具会自动选择各个组件入口，优先级为`index.js`>`index.vue`，即组件目录有`index.js`，则入口为`index.js`，若无则入口文件为`index.vue`

#### 打包

`npm run build:lib`

#### 本地开发

`npm run serve`

## 单元测试

后续加入

## VuePress 搭建文档

后续加入

官网地址：https://link.juejin.cn/?target=https%3A%2F%2Fwww.vuepress.cn%2Fguide%2Fgetting-started.html

## 使用

npm 安装 babel-plugin-component

然后通过 npm 安装此组件库后，修改.babelrc

```js
{
  ...
  plugins: [
    ...
    [
      'import',
      [
        ...
        {
          "libraryName": "ik-components",
          "libraryDirectory": "es",
          "style": true
        }
        ...
      ]
    ]
  ]
  ...
}
```

在代码中引用即可

```js
import { avatar } from 'ik-components';
```
