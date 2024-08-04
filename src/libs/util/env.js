import { getDecryptedPsw, getCookie, setCookie, getUA } from './util'
export const inBrowser = typeof window !== 'undefined'
export const UA = inBrowser && window.navigator.userAgent.toLowerCase()
export const isAym = getUA('appName') === 'AYM'
export const isZjl = getUA('appName') === 'ZJL' || getUA('appName') === 'ZJLSC'
export const isMjb = getUA('appName') && !isAym && !isZjl
export const isApp =  (isAym || isZjl || isMjb) && UA.indexOf('macintosh') < 0

export const isAndroid = UA && UA.indexOf('android') > 0
export const isIOS = UA && /iphone|ipad|ipod|ios/.test(UA)


export const isPU = (str) => {
    let cookieStr = getCookie('partnerAuth')
    if (cookieStr) {
        let partnerAuth = JSON.parse(getDecryptedPsw(cookieStr))
        if (str && str == 'chanel') {
            return partnerAuth.channel == 'pu'
        } else {
            return partnerAuth.partnerInfo && partnerAuth.channel == 'pu'
        }
    }
}

// 设置网关
export const setEnvCookie = (env) => {
    let host = window.location.hostname
    if (!/(test|aliyun)/.test(host)) {
        return
    }
    let curEnv = env || host.match(/m-(\S*)\.(aiyoumi|aicaitest)/) || host.match(/app-(\S*)\.(aiyoumi|aicaitest)/) || host.match(/m\.(\S*)\.aicai/)
    if (curEnv) {
        let envValue = curEnv[1]
        setCookie('gateway-source-branch', envValue, 1, 'aicaitest.com')
        setCookie('gateway-source-branch', envValue, 1, 'aiyoumi.com')
        setCookie('gateway-source-branch', envValue, 1, 'aixuedai.com')
        setCookie('gateway-source-branch', envValue, 1, 'aicai.cloud')
    }
}
