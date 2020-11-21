const path = require('path')
const resolve = (dir) => path.join(__dirname, './', dir)
module.exports = {
    lintOnSave: false,
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT'
        },
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'src': resolve('src'),
                'theme': resolve('theme'),
            }
        },
    },
    devServer: {
        port: 80,
        proxy: {
            // proxy all requests starting with /api to jsonplaceholder
            '/blog': {
                target: 'http://localhost:8080',   //代理接口
                changeOrigin: true,
                pathRewrite: {
                    '^/blog': ''
                }
            }
        }
    }
}
