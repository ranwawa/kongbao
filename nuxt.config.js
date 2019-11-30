module.exports = {
  build: {
    extend(config) {
      config.resolve.modules = ['./api', './node_modules', './utils', './components'];
    },
    postcss: [
      require('postcss-import')(),
      require('postcss-mixins')(),
      require('postcss-nested')(),
      require('postcss-simple-vars')(),
      require('autoprefixer')(),
    ],
    vendor: ['wx', 'utils', 'account', 'address', 'order', 'packet', 'request'],
  },
  css: [ // 全局引入的css文件
    { src: 'muse-ui/dist/muse-ui.css', lang: 'css' },
    { src: '~/static/font/iconfont.css', lang: 'css' },
  ],
  // 编译缓存
  cache: false,
  // 第3方VUE插件
  plugins: [
    { src: '~/plugins/muse-ui.js', ssr: false },
    { src: '~/plugins/toast.js', ssr: false },
    { src: '~/plugins/loading.js', ssr: false },
    { src: '~/plugins/message.js', ssr: false },
    { src: '~/plugins/distpicker.js', ssr: false },
    { src: '~/plugins/clipboard.js', ssr: false },
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],
  proxy: [
    [
      '/api',
      {
        target: 'http://api.ranwawa.cn/api',
        pathRewrite: { '^/api': '/' },
      },
    ],
  ],
};