module.exports = {
  presets: ['@vant/cli/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
