/**
 * 跳转域名转换
 */
const userDomain = {
    prefix: 'user',
    devPort: '8000'
}

const cpsH5Domain = {
    prefix: 'm',
    devPort: '8000'
}
const cpsAppDomain = {
    prefix: 'app',
    devPort: '8000'
}
const authDomain = {
    prefix: 'auth',
    devPort: '8443'
}

const loginDomain = {
    prefix: 'login',
    devPort: '8443'
}
const cashierDomain = {
    prefix: 'cashier',
    devPort: ''
}

const creditServerDomain = {
    prefix: 'api-gateway',
    devPort: '8095',
    // interPer: '/credit_h5'
}

// 前端埋点上报
const logServerDomain = {
    prefix: 'log',
    devPort: '8000'
}


// 当前应用域名前缘
const curSysPrefix = 'm|app'
// 通用跳转域名转换
const getDomain = (config) => {
    let curDomain = window.location.hostname
    let protocol = window.location.protocol + '//'
    // 跳转URL转换
    let targetDomain = curDomain.replace(/^fe-/, '').replace(new RegExp('^(' + curSysPrefix + ')'), config.prefix)
    let targetPort = ':' + config.devPort
    let targetInter = config.interPer || ''

    // dev/测试环境 & 线上
    if (process.env.NODE_ENV === 'production') {
        // dev/测试环境
        if (/(dev|shuyaotest)/.test(curDomain)) {
            return protocol + targetDomain + targetInter
        } else {
            // 线上环境（永远不要动）
            return protocol + targetDomain + targetInter
        }
    } else {
        /**
         * 本地开发，跳转地址转换
         */
        // 代理syao环境
        if (/-syao/.test(targetDomain)) {
            return 'https://' + targetDomain + targetInter
        }
        // 代理生产环境
        if (/-prod/.test(targetDomain)) {
            return 'https://' + targetDomain.replace(/-prod/, '') + targetInter
        }
        // 代理dev
        if (/-dev/.test(targetDomain)) {
            return protocol + targetDomain.replace(/-(dev)/, '.$1') + targetInter
        }
        // 本地访问走mock加端口
        return protocol + targetDomain + targetPort + targetInter
    }
}

// 外放地址转换方法
export const urlHandler = (preUrl) => {
    let targetUrl = ''
    // 根据接口前缀转发到不同域名
    if (preUrl.indexOf('/cms/') === 0) {
        targetUrl = getDomain(cpsH5Domain) + preUrl
    } else if (/\/(uc|login)\//.test(preUrl)) {
        targetUrl = getDomain(userDomain) + preUrl
    } else {
        targetUrl = preUrl
    }
    return targetUrl
}

export const loginOrigin = getDomain(loginDomain)
export const h5Origin = getDomain(cpsH5Domain)
export const appOrigin = getDomain(cpsAppDomain)
export const authOrigin = getDomain(authDomain)
export const creditServerOrigin = getDomain(creditServerDomain)
export const logServerOrigin = getDomain(logServerDomain)
export const cashierOrigin = getDomain(cashierDomain)
export const loginUrl = (url) => getDomain(userDomain) + url

// 此方法用于<<爱又米APP>>内的召集令业务登录
// TODO: 取现列表页如果tab去掉，则可以删除zjlLogin相关代码
// export function zjlLoginUrl(url) {
//     if (process.env.NODE_ENV !== 'production') {
//         return url
//     } else {
//         const hostname = location.hostname
//         if (/dev/.test(hostname)) {
//             return `https://login-server-dev.aicaitest.com:1443${url}`
//         } else if (/syao/.test(hostname)) {
//             // 从爱又米哪个测试环境同步完接口跳过来，需调用哪个环境接口验证
//             let regRes = /(aliyun\d)/.exec(window.aixuedai.applyTabUrl)
//             return `https://login-server-${regRes[1]}.aicaitest.com:1443${url}`
//         } else {
//             return `https://login-server.aiyoumi.com${url}`
//         }
//     }
// }
