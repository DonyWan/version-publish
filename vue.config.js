module.exports = {
  publicPath: '',
  // outputDir: 'D:\\sts-workspaces\\VersionPublish\\src\\main\\resources\\static',
  configureWebpack: {
    devtool: 'source-map'
  },
  chainWebpack: config => {
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
  }
}