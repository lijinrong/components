// postcss 相关的坑, 原来在这里, 感谢由大神已经建好了这个文件, 不然只能干捉急了
// https://github.com/michael-ciniawsky/postcss-load-config

/**
 * @example https://www.npmjs.com/package/px2rem
 */
var px2remOpts = {
  // 1rem -> 75px
  remUnit: 75,
  // 是否根据  dpr 产生三种font-size 选择器
  threeVersion: true,
  // device pixel ratio 基准
  baseDpr: 2,
  // rem精度
  remPrecision: 3,
};

// 不需要转Rem的目录
var no2rem = [];

function is2Rem(from) {
  // 编译.vue 文件中 style 标签中的样式时，from为空，故如需要不转Rem，需要把样式拿出来（.less || .css）。
  if (!from) return px2remOpts;

  return (
    no2rem.every((item) => {
      return from.indexOf(item) === -1;
    }) && px2remOpts
  );
}

module.exports = (ctx) => {
  // parser: 'sugarss',
  return {
    plugins: {
      autoprefixer: {},
      'postcss-px2rem': is2Rem(ctx.from || (ctx.file && ctx.file.dirname)),
    },
  };
};
