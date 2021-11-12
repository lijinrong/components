# 公共组件库

## 背景：

目前公共组件封装好了，需要拷贝到各个项目中，创建此库可通过npm管理公共组件。

## 目录结构

.
├── README.md
├── babel.config.js
├── lib
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets
│   ├── main.js
│   ├── packages
│   │   ├── avatar
│   │   │   ├── assets
│   │   │   │   └── images
│   │   │   │       └── avatar.png
│   │   │   ├── index.js
│   │   │   └── index.vue
│   │   ├── dialog-api
│   │   │   ├── index.js
│   │   │   ├── index.less
│   │   │   ├── index.vue
│   │   │   └── readme.md
│   │   └── index.js
│   └── styles
│       └── _var.scss
├── stylelint.config.js
├── tests
│   └── unit
│       └── example.spec.js
└── vue.config.js

