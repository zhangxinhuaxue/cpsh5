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
import {
    userstatKey
} from 'src/store/modules/user'
export const toCredit = ({ toCode = 99, toUrl, callback } = {}) => {
    let sourceReg = /^m/g
    let isH5 = sourceReg.test(window.location.hostname)
    if (isH5) {
        h5Credit(toCode, toUrl)
    } else {
        // 登录
        const isLogin = _axdAppPromise('user', 'isLogin')
        isLogin.then((res) => {
            if (res.result == 'false') {
                AXD.util.login()
            } else {
                appCredit(toCode, toUrl, callback)
            }
        })
    }
}

const h5Credit = (toCode, toUrl) => {
    let url = '/open/user/toCredit.html' + '?toCode=' + toCode + '&toUrl=' + toUrl
    window.location.href = url
}

const appCredit = (toCode, toUrl, callback) => {
    let method = 'pass'
    let state = 1 // 0 未进行任何操作，1 跳转原生，2 跳转h5页面
    userstatKey().then((res) => {
        if (res.result.success) {
            let code = res.result.result
            switch (code) {
                // 认证
                case 'goto_default':
                    method = 'pass'
                    break
                case 'authinfo':
                    method = 'showCertification'
                    break
                case 'chsi_verify':
                    state = 2
                    method = 'chsi_verify'
                    window.location.replace(`/pages/chsi/index?backUrl=${toUrl}`)
                    break
                    // 基础授信
                case 'credit_base':
                    if (toCode > 1) {
                        method = 'showCreditBase'
                    }
                    break
                    // 自助1，2
                case 'credit_self_inschool':
                    if (toCode > 2) {
                        method = 'showCreditDIY'
                    }
                    break
                    // 自助3（新生完整）
                case 'credit_self_fresh':
                    if (toCode > 2) {
                        method = 'showCreditDIY3'
                    }
                    break
                    // 毕业基础授信
                case 'credit_self_graduate_base':
                    if (toCode > 1) {
                        method = 'showCreditBase2'
                    }
                    break
                    // 自助4（毕业完整）
                case 'credit_self_graduate':
                    if (toCode > 2) {
                        method = 'showCreditDIY4'
                    }
                    break
                    // 选择审核方式
                case 'credit_choice_list':
                    method = 'showCreditReviewMode'
                    break
                    // 查看进度
                case 'view_progress':
                    method = 'showCreditProgress'
                    break
                    // 用户锁定状态
                case 'goto_lock_default':
                    state = 0
                    method = 'lock'
                    break
                default:
                    state = 0
            }
            // 已通过
            if (method === 'pass') {
                if (toUrl) {
                    window.location.href = decodeURIComponent(toUrl)
                } else {
                    callback(res.result)
                }
                return
            }
            // 去授信
            if (state === 1) {
                // 去授信
                _axdAppPromise('credit', method, {
                    callInfo: '',
                    callCode: 1,
                    callbackUrl: toUrl,
                    callbackFunc: ''
                })
                return
            }
            // 未跳转
            if (state === 0) {
                callback(res.result)
            }
        } else {
            callback(res.result)
        }
    })
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
