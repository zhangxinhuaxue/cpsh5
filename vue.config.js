// vue.config.js

const path = require('path')
const  AnalyticsPlugin = require('@ac/analytics-vue-plugin')
function resolve(dir) {
    return path.join(__dirname, dir)
}

const proxyRouter = {
    'fe-m-dev.zhaojiling.com:8095': 'http://m.dev.zhaojiling.com',
    'fe-m-prod.zhaojiling.com:8095': 'https://m.zhaojiling.com',
    'fe-m-syao1.shuyaotest.com:8095': 'https://m-syao1.shuyaotest.com',
    'fe-m-syao2.shuyaotest.com:8095': 'https://m-syao2.shuyaotest.com',
    'fe-m-syao3.shuyaotest.com:8095': 'https://m-syao3.shuyaotest.com'
}
console.log(proxyRouter)
module.exports = {
    outputDir: '../static-build/cps-static-h5/build',
    assetsDir: 'assets',
    transpileDependencies:['@fe/buss-ui'],
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                src: resolve('src'),
                assets: resolve('src/assets'),
                components: resolve('src/components'),
                module: resolve('src/module'),
                libs: resolve('src/libs'),
                store: resolve('src/store'),
            },
        },
        plugins: [
            new AnalyticsPlugin({
                options: resolve('./src/analytics.config.js')
            }),
        ]
    },
    css: {
        extract: false,
        loaderOptions: {
            sass: {
                prependData: `
                    @use "sass:math";
                    @import "~@fe/scssfn";
                    $colorPrimary: #4286FF;
                    `,
            },
        },
    },
    devServer: {
        port: 8095,
        disableHostCheck: true,
        proxy: {
            '(^/mall/trade/v3/logisticsTrace)': {
                logLevel: 'debug',
                target: 'http://yapi.aicaitest.com/mock/375',
                router: proxyRouter,
            },
            '^/(oscar|app|cms|syao|api|mall|credit_h5|payReuslt|rights|monitoring)': {
                logLevel: 'debug',
                target: 'http://yapi.aicaitest.com/mock/367',
                router: proxyRouter,
            },
            '(^/common/)': {
                logLevel: 'debug',
                target: 'http://yapi.aicaitest.com/mock/359',
                router: proxyRouter,
            },

        },
    },
}
