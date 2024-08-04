import { AXD } from 'libs/util'

const testTelphone = (value) => {
    let regPhone = /^1\d{10}$/
    return regPhone.test(value)
}
const testPwd = (value) => {
    // let regPassword = /^[A-Za-z0-9]{8,16}$/
    let regPassword = /^(?=.*\d)(?=.*[A-Za-z]).{8,16}$/g
    return regPassword.test(value)
}
const testNumPwd = (value) => {
    // 兼容原来6位密码的用户
    let regPassword = /^\d{6}$/g
    return regPassword.test(value)
}
const testImgCode = (value) => {
    let regImgCode = /^[A-Za-z\d]{4}$/
    return regImgCode.test(value)
}

const testVcode = (value) => {
    let regVcode = /^\d{6}$/
    return regVcode.test(value)
}

const testIdNum = (value) => {
    let redIdNum = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    return redIdNum.test(value)
}

const skipUrl = (res, route) => {
    /* notifyUrl 前端规定本页面操作成功跳转的页面
        toUrl 授信外放，后端决定操作完成跳转的页面
     */
    let notifyUrl = route.query.notifyUrl
    if (notifyUrl && !AXD.util.urlIllegal(notifyUrl)) {
        return notifyUrl
    }

    if (res.result.toUrl) {
        // let fullPath = route.fullPath
        // let param = ''
        // if (fullPath.indexOf('?') > -1) {
        //     param = fullPath.substring(fullPath.indexOf('?'))
        // }
        // let targetUrl = res.result.toUrl
        // if (targetUrl.indexOf('?') > -1) {
        //     param = param.replace('?', '&')
        // }
        // return targetUrl + param

        let targetUrl = res.result.toUrl
        let query = route.query
        let param = ''
        let targetParam = ''
        if (targetUrl.indexOf('?') > -1) {
            let params = targetUrl.substring(targetUrl.indexOf('?') + 1)
            targetParam = params.split('&').map((a) => {
                return a.split('=')[0]
            })
        }
        for (var key of Object.keys(query)) {
            param = targetParam.indexOf(key) > -1 ? param : param + `&${key}=${query[key]}`
        }
        if (targetUrl.indexOf('?') == -1) {
            param = param.replace(/^&/, '?')
        }
        return targetUrl + param
    }
}

const getCache = (query) => {
    /* 用于授信外放，配合服务端是否需要清除缓存
     */
    return query.useCache ? { useCache: query.useCache } : {}
}

let url = ''
if (aixuedai.isUavoApp === 'n') {
    url = aixuedai.h5WebUrl + '/h5/user/contract/viewPublicTemplate/CT190516452'
} else {
    url = aixuedai.appUrl + '/app/user/contract/viewPublicTemplate/CT190516452'
}
const regProto = url

export { testTelphone, testPwd, testNumPwd, testImgCode, testVcode, regProto, testIdNum, skipUrl, getCache }
