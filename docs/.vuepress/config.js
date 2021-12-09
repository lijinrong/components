module.exports = {
  title: '公共组件库',
  description: '公共组件库',
  themeConfig: {
    sidebar: {
      '/components/': [
        '/components/',
        {
          title: 'API弹窗组件',
          path: 'API弹窗组件',
        },
      ],
    },
    sidebarDepth: 2, // 将同时提取markdown中h2 和 h3 标题，显示在侧边栏上。
    lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
    nav: [
      //   { text: '组件', link: '/components/' }, // 内部链接 以docs为根目录
    ],
  },
  plugins: [
    '@vuepress/active-header-links',
    '@vuepress/back-to-top',
    '@vuepress/nprogress',
    [
      '@vuepress/register-components',
      {
        componentsDir: '/src/packages/',
      },
    ],
  ],
};
