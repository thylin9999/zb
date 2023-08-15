const useAnalyser = process.env.VUE_APP_USE_ANALYSZER
const path = require('path')
const resolve = path.resolve
const { getSass } = require('@zougt/some-loader-utils')
const multipleScopeVars = [
    {
    // 必需
        scopeName: 'theme-default',
        path: path.resolve('src/theme/default-vars.scss')
    },
    {
        scopeName: 'theme-mauve',
        path: path.resolve('src/theme/mauve-vars.scss')
    }
]
module.exports = {
    lintOnSave: false,
    publicPath: './',
    css: {
        loaderOptions: {
            scss: {
                implementation: getSass({
                    getMultipleScopeVars: sassOptions => multipleScopeVars.map(item => {
                        return {
                            ...item,
                            path: path.resolve(item.path)
                        }
                    })
                })
            }
        }
    },
    chainWebpack: config => {
        config.devtool('source-map')
        if (useAnalyser) {
            config
                .plugin('webpack-bundle-analyzer')
                .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end()
        }
        // 必要css样式 内联，防止阻塞渲染
        // config.plugin('critters-webpack-plugin').use(require('critters-webpack-plugin'), [{
        //   inlineThreshold: 10
        // }]).end()
        // svg rule loader
        const svgRule = config.module.rule('svg') // 找到svg-loader
        svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
        // // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(resolve('src/icons'))
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
        config.plugin('html')
            .tap((args) => {
                args[0].title = process.env.VUE_APP_APP_NAME
                return args
            })
    },
    devServer: {
        proxy: {
            '/api': { // 代理 所有  /api/v1 开头的 请求
                // 这样写就可以了
                // target: 'http://api.wuhaicj.com',
                target: 'http://api.hljhwyy.cn',
                changeOrigin: true, // 跨域
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/aaa': { // 代理 所有  /api 开头的 请求
                // 这样写就可以了
                // target: 'http://api.wuhaicj.com',
                // target: 'http://api.haibao18.cn',
                target: 'http://127.0.0.1:3000/',
                changeOrigin: true, // 跨域
                pathRewrite: {
                    '^/aaa': ''
                }
            }
            // '/api/v2': { // 代理 所有  /api/v1 开头的 请求
            //     // 这样写就可以了
            //     target: process.env.VUE_PROXY_HOST,
            //     changeOrigin: true,// 跨域
            //     pathRewrite: {
            //       '^/api/v2': '/api/v1'
            //     }
            // }
            // '/file/uploads': { // 代理上传的功能
            //   // 这样写就可以了
            //   target: 'http://172.19.103.145:3000',
            //   changeOrigin: true, // 跨域
            //   pathRewrite: {
            //     '^file': ''
            //   }
            // }
        }
    }
}
