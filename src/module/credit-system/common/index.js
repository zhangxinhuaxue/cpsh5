import { noticeAuthResult } from 'src/store/modules/credit-system'
import { AXD, isApp, isAndroid, setCookie } from 'src/libs/util'

const from = isApp ? (isAndroid ? 'android' : 'ios') : 'h5'

export const notice = async function(authOrderId, callback) {
    // let baiduMac = await AXD.util.getLocationInfo('基础授信提交通知')
    noticeAuthResult({
        authOrderId,
        from,
        baiduMac: '{}'
    }).then((res) => {
        callback(res)
    })
}

export const getLocalUrl = (extendArry = []) => {
    let hrefSplit = window.location.href.split('?')
    let params = hrefSplit[1] || ''
    if (params) {
        params = params.split('&')
            .filter(k => !/^authOrderId=/.test(k) && !/^needNotice=/.test(k) && !/^authResult=/.test(k) && !/^resetItem=/.test(k))
            .concat(extendArry)
            .join('&')
    } else {
        params = extendArry.join('&')
    }
    let sep = params ? '?' : ''
    return encodeURIComponent(hrefSplit[0] + sep + params)
}

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
