const pxToRem = require('postcss-pxtorem')
module.exports = {
  plugins: [
    pxToRem({
      rootValue: ({ file }) => (/vant/.test(file) ? 37.5 : 75),
      // 配置要转换的css属性， *表示所有
      propList: ['*'],
      // 配置不要转换的样式资源，不用后缀
      exclude: 'github-markdown'
    })
  ]
}
