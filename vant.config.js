module.exports = {
  name: 'ik-components',
  build: {
    css: {
      preprocessor: 'less',
    },
    site: {
      publicPath: '/',
    },
  },
  site: {
    title: 'ik-components',
    logo: 'http://media.xiangshengclub.com/MTY1NDE2NDgzOTcwMyM1NDgjaWNv.ico',
    nav: [
      {
        title: '开发指南',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
          {
            path: 'quickstart',
            title: '快速上手',
          },
        ],
      },
      {
        title: '基础组件',
        items: [
          {
            path: 'dialog-api',
            title: 'dialog弹窗',
          },
          {
            path: 'avatar',
            title: '头像裁剪',
          },
        ],
      },
    ],
  },
};
