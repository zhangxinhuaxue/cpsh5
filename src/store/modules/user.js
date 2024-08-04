import {
    _get,
    _post,
    _postPromise,
    _getPromise,
    formatRet
} from '../base'

import debounce from 'lodash/debounce'

/* ================登陆================= */
// 短信验证码登录提交
export const login = (param, callback) => {
    return _post('/doLogin', param, (data) => {
        callback(formatRet(data))
    })
}

export const appLogin = (param, callback) => {
    return _postPromise('/app/mall/doLogin', param)
}

// 发送手机验证码
export const sendCodeMsg = debounce((param, callback) => {
    console.log(new Date())
    return _post('/common/sendCodeMsg', param, (data) => {
        callback(formatRet(data))
    })
}, 2000, { leading: true, trailing: false })

// 快速注册登录
export const smsLogin = (param, callback) => {
    return _post('/doSmsLogin', param, (data) => {
        callback(formatRet(data))
    })
}

/* ================注册================= */
// 注册提交
export const register = debounce((param, callback) => {
    return _post('/user/reg', param, (data) => {
        callback(formatRet(data))
    })
}, 1000, { leading: true, trailing: false })

// 验证手机号码是否存在
export const phoneExists = (param, callback) => {
    return _post('/getCellphoneExists', param, (data) => {
        callback(formatRet(data))
    })
}

/* ================忘记密码================= */
// 忘记密码提交
export const pwdReset = (param, callback) => {
    return _post('/pwdReset', param, (data) => {
        callback(formatRet(data))
    })
}

/* ================认证================= */
// 认证初始化
export const authInit = (param) => {
    return _postPromise('/mall/initauthinfo', param, { showLoading: true })
}

// 认证提交
export const authSubmit = (param, callback) => {
    return _postPromise('/mall/infoSubmit', param, { showLoading: true })
}

// 认证结果页，返回用户认证结果
export const authResult = (param) => {
    // let url = aixuedai.isUavoApp == 'y' ? '/app/vuser/authresult' : '/mall/authresult'
    return _getPromise('/mall/v2/trade/authresult', param)
}

// 认证结果页，用pid获取用户tid
export const authResultGetTid = (param) => {
    return _getPromise('/payReuslt/getTradeInfoByPayId', param)
}
// 无带单授信了
// 认证结果页，认证失败，清空用户分期信息
// export const authResultPayClean = (param) => {
//     return _getPromise('/mall/v2/trade/clearTradestagsAndDownpaymentPct', param)
// }

/* ================app授信流程================= */
// 用户状态
export const userstatKey = (param) => {
    return _postPromise('/app/user/comm/userstatKey', param, { showLoading: true })
}

/* ================商城我的================= */
// 用户状态
export const myAll = () => {
    return _postPromise('/h5/my/all', null, { showLoading: true })
}

// 商品 + 订单状态
export const myMallInfo = () => {
    return _postPromise('/h5/my/mallInfo', null)
}

// 用户信息
export const myInfo = () => {
    return _postPromise('/h5/my/info', null)
}

// 授权
export const authorize = () => {
    return _postPromise('/partner/puhome/authorize', null, { showLoading: true })
}

export const submitAuthorize = (param) => {
    return _postPromise('/mall/ticket/auth', param, { showLoading: false })
}
