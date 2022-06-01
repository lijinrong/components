const path = require('path');
const fs = require('fs');

function toLine(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// 开发配置
function resolveConfig(config) {
  config.plugin('html').tap(() => [
    {
      title: 'ik-components',
      filename: 'index.html',
      template: path.join(__dirname, 'public/index.html'),
      chunks: ['chunk-vendors', 'chunk-common', 'app'],
    },
  ]);
}

// 最终打包成库的配置
function resolveLibConfig(config) {
  // 先清空入口
  config.entryPoints.clear();

  // 扫描组件文件夹，动态创建入口
  const dir = path.join(__dirname, './src/packages');
  const entryWithAll = path.join(__dirname, './src/packages', 'index.js');
  const arr = fs.readdirSync(dir);
  arr.forEach((item) => {
    const fullPath = path.join(dir, item);
    let entryPath = path.join(fullPath, 'index.js');
    if (!fs.existsSync(entryPath)) {
      entryPath = path.join(fullPath, 'index.vue');
    }

    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      const entryStats = fs.statSync(entryPath);
      if (!entryStats.isDirectory()) {
        config.entry(toLine(item)).add(entryPath).end();
      }
    }
  });
  // 非按需加载的总入口，包含所有组件
  config.entry('ik-comp').add(entryWithAll).end();

  // 打包lib
  config.output
    .library('ik-comp')
    .libraryTarget('umd')
    .filename('[name]/index.js');
  //不拆分公共代码
  config.optimization.splitChunks(false);
  // 单独提取css配置
  config.plugin('extract-css').tap(() => [
    {
      filename: '[name]/style.css',
      chunkFilename: '[name]/style.css',
    },
  ]);

  config.externals({
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    },
  });

  // 不需拷贝html文件
  config.plugins
    .delete('copy')
    .delete('html')
    .delete('preload')
    .delete('prefetch');

  // 图片全部转base64
  config.module
    .rule('images')
    .use('url-loader')
    .tap((args) => ({
      ...args[0],
      limit: undefined,
    }));
}

module.exports = {
  outputDir: 'lib',
  publicPath: './',
  chainWebpack: (config) => {
    // 打包lib
    if (
      process.env.npm_lifecycle_script &&
      process.env.npm_lifecycle_script.includes('--lib')
    ) {
      resolveLibConfig(config);
    } else {
      resolveConfig(config);
    }
  },
};
