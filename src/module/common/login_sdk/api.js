import {
    getCookie
} from 'src/libs/util'
const authPath = '/views/wechat/auth'

/*
 * params 参数对象
 * 包括cbUrl，channel，spm等
 */
export const goAuth = (params) => {
    // 拿到cat和openid之后不再走授权流程
    let openId = getCookie('fopid')
    // let cat = getCookie('cat')

    if (openId) {
        return
    }

    var cbUrl = params ? (params.cbUrl ? params.cbUrl : window.location.href) : window.location.href
    var finalParams = {
        ...params,
        cbUrl: encodeURIComponent(cbUrl),
        pause: '1'
    }

    var search = '?'

    Object.keys(finalParams).forEach((key) => {
        search += key + '=' + finalParams[key] + '&'
    })

    let targetUrl = window.aixuedai.authWebHost + authPath + search
    // console.log(targetUrl)
    window.location.replace(targetUrl)
}
