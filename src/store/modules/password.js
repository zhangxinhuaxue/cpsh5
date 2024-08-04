import { _getPromise, _postPromise, formatRet } from '../base'
import debounce from 'lodash/debounce'

// 校验身份证后4位
export const checkValidateCardLastFour = debounce((param) => {
    return _postPromise('/common/validateCardLastFour', param, { showLoading: true })
}, 300, { leading: true, trailing: false })

// 校验完整身份证
export const checkValidateID = debounce((param) => {
    return _postPromise('/common/validateID', param, { showLoading: true })
}, 300, { leading: true, trailing: false })

// 未设置过，设置支付密码
export const setPaypwd = (param) => {
    return _postPromise('/paypwd/paypwdSet', param, { showLoading: true })
}
// 重置支付密码
export const resetPaypwd = (param) => {
    return _postPromise('/paypwd/paypwdReset', param, { showLoading: true })
}

// 设置支付密码->忘记密码->发验证码
export const sendCodeMsg = (param) => {
    return _postPromise('/common/sendCodeMsg', param, { showLoading: true })
}
// 设置支付密码->忘记密码->校验验证码
export const checkSmsCode = (param) => {
    return _postPromise('/common/smsCode/check', param, { showLoading: true })
}
