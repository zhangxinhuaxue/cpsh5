/**
 * Created by Doris on 22/08/17
 * 授信跳转
 * @e.g.->
 * toCredit({
        toCode: 5,
        toUrl: '',
        callback: (res) => {
        }
    })
 *
 * 参数说明：
 *    toCode: 1:用户认证通过即可 2:用户基础授信通过即可 3.用户完整授信通过 默认99:预留至后期最大授信状态
 *    toUrl: 授信流程完成回跳地址
 *    callback: 没有跳转授信流程，回调
 */
import {
    AXD
} from 'libs/util'
export const toCredit = ({ creditUrl, toUrl, query, callback } = {}) => {
    if (aixuedai.isUavoApp === 'n') {
        h5Credit(toUrl)
    } else {
        // 登录
        const isLogin = _axdAppPromise('user', 'isLogin')
        isLogin.then((res) => {
            if (res.result == 'false') {
                AXD.util.login()
            } else {
                appCredit(creditUrl, toUrl, query, callback)
            }
        })
    }
}

const h5Credit = (toUrl) => {
    let url = aixuedai.h5WebUrl + '/open/user/toCredit.html' + '?toUrl=' + toUrl
    window.location.href = url
}

const appCredit = (creditUrl, toUrl, query, callback) => {
    let method = 'pass'
    let state = 1 // 0 不跳，1 跳转
    let done = true // 是否最后一步
    let step = query.step
    switch (step) {
        // 认证
        case 'goto_default':
            state = '0'
            break
        case 'goto_credit_finish':
            state = '0'
            break
        case 'authinfo':
            done = false
            method = 'showCertification'
            break
        case 'chsi_verify':
            state = 2
            done = false
            method = 'chsi_verify'
            window.location.replace(`/pages/chsi/index?backUrl=${creditUrl}`)
            break
            // 基础授信
        case 'credit_base':
            done = false
            method = 'showCreditBase'
            break
            // 自助1，2
        case 'credit_self_inschool':
            method = 'showCreditDIY'
            break
            // 自助3（新生完整）
        case 'credit_self_fresh':
            method = 'showCreditDIY3'
            break
            // 自助4（毕业完整）
        case 'credit_self_graduate':
            method = 'showCreditDIY4'
            break
            // 选择审核方式
        case 'credit_choice_list':
            method = 'showCreditReviewMode'
            break
            // 查看进度
        case 'view_progress':
            state = 0
            method = 'showCreditProgress'
            break
            // 用户锁定状态
        case 'goto_credit_lock':
            state = 0
            method = 'lock'
            break
        default:
            method = 'lock'
            state = 0
    }
    // 跳转了h5
    if (state === 2) {
        return
    }
    // 去授信
    if (state === 1) {
        // 去授信
        let url = done ? toUrl : creditUrl || ''
        const credit = _axdAppPromise('credit', method, {
            callInfo: '',
            callCode: 1,
            callbackUrl: url,
            callbackFunc: ''
        }).then((res) => {
            axdApp.send({
                module: 'webview',
                method: 'close'
            })
        })
        // callback(method, state)
        return
    }
    callback(method, 0)
}

const _axdAppPromise = (module, method, params) => {
    return new Promise((resolve, reject) => {
        axdApp.send({
            module: module,
            method: method,
            params: params,
            callback: (ret) => {
                resolve(ret.data)
            }
        })
    })
}
