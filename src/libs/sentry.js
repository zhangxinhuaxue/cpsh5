import Vue from 'vue'
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import { AXD } from 'libs/util'

// 非开发环境下
if (process.env.NODE_ENV === 'production') {
    // 正式、测试环境各一套
    let dsn = /(m|app)\.zhaojiling/.test(window.location.hostname) ? 'https://8a1fce1bb1ce4d59bd3b86f50418c956@sentry.aiyoumi.com/4' : 'https://d66aa9324b9a47ed87debf69cd9b6f6d@sentry.aiyoumi.com/5'
    Sentry.init({
        dsn,
        integrations: [new Integrations.Vue({ Vue, attachProps: true })],
        ignoreErrors: [
            'Argument 1 (\'options\') to RTCPeerConnection.createOffer must be a dictionary',
            'Unexpected identifier',
            'this.ready is not a function',
            'Java exception was raised during method invocation', // 拉新页的fclog.baidu.com 日志报错 机型：安卓
            'refresh is not defined', // 拉新页的fclog.baidu.com 日志报错 机型：安卓
            'tencent_ug_bridge.callbackFromNative is not a function',
            'mag is not defined',
            'saveTokenFn is not defined',  // uc 
            'UCShellJava.sdkEventFire is not a function', // uc浏览器点击下载
            'x5onSkinSwitch is not defined', // qq浏览器点击下载
            'Can\'t find variable: appWebGLStart', // reffer rong360
            'Can\'t find variable: appWebGLStop',
            'processRandomSelector is not defined', // android
            'ignoreError is not defined' ,// android vivo
            'dmlife is not defined', // android 拉新页/下载页
            'Identifier \'start_time_c299c42708e1badb\' has already been declared' // android 取现页
        ],
        denyUrls: [
            /qq\.com/i,
            /baidu\.com/i,
            /vendors\.js/,
            /frms-fingerprint\.js/,
            /frms-fingerprint-min\.js/
        ]
    })
    // 添加字段
    Sentry.configureScope((scope) => {
        scope.setUser({
            userId: AXD.util.getUserId()
        })
    })
    Sentry.setTag('service', 'cps-static-h5')

    // 挂载全局
    window.Sentry = Sentry

    // 全局添加手动捕获方法
    window.Sentry.captureErr = (err) => {
        // 记录当前报错页面path
        let curPage = window.location.pathname + window.location.search
        // 默认自定义类型，若自定义标题文字，使用时添加title
        err = Object.assign({ title: '', type: 'DIY' }, err)
        // 错误映射码
        let errTypeMsg = {
            '404': '访问页面不存在',
            API: '接口请求错误',
            BIZ: '接口业务提示',
            DIY: '自定义跟踪错误'
        }
        // 重新组装兼容上报错误标题
        let title = `[ERR-${err.type}] ${err.title || errTypeMsg[err.type]}：${curPage}${err.url ? ' => ' + err.url : ''}${err.desc ? ' => ' + err.desc : ''}`

        // 手动触发
        Sentry.captureException(new Error(title), (scope) => {
            // 添加自定义字段
            scope.setExtra('request', err.req || '无')
            scope.setExtra('response', err.res || '无')
        })
    }
}
