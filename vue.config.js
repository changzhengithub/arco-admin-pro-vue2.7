const path = require('path')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  transpileDependencies: true,
  // devServer: {
  //   disableHostCheck: true,
  //   host: 'xxx.xxx.xxx.xx', // 本机地址
  //   port: 8080, // 端口号
  //   https: false, // https:{type:Boolean}
  //   open: true, //配置自动启动浏览器
  //   // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
  //   proxy: {
  //       '/api': {
  //           target: 'http://www.xxx.com/api', // 跨域地址
  //           changeOrigin: true,
  //           pathRewrite: {
  //               '^/api': ''
  //           }
  //       }
  //   }
  // },
  
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // DO NOT REMOVE THIS LINE
          javascriptEnabled: true,
          globalVars: {
            // less vars，customize ant design theme
            // 'primary-color': '#F5222D',
          }
        }
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/less/main.less')]
    }
  }

})