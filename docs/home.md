# 公共组件库

### 简介：

公共组件库

### 组件开发

组件目录在`src/packages`，下面拿`dialog-api`组件为例：

1. 在`src/packages`新建目录`dialog-api`
2. 在`dialog-api`目录新建`index.js`或`index.vue`（样式文件可自行创建，此处只例举必要条件）
3. `dialog-api/index.vue`撰写组件代码

#### 打包

`yarn build`

#### 本地开发

`yarn dev`

### 单元测试

后续加入

### 使用

npm 安装 babel-plugin-import

然后通过 npm 安装此组件库后，修改.babelrc

```js
{
  ...
  plugins: [
    ...
    [
      'import',
      {
        libraryName: 'ik-components',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ]
  ...
}
```

在代码中引用即可

```js
import { Avatar } from 'ik-components';
```
