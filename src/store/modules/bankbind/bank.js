import { _getPromise, _postPromise, formatRet } from '../../base'
// import debounce from 'lodash/debounce'

// 获取银行列表
export const bandList = (param) => {
    return _postPromise('/common/banks', param, { showLoading: true })
}

/* 获取银行卡列表-new */
export const getBankListNew = (param, callback) => {
    return _postPromise('/oscar/spend/userBankCard', param, { showLoading: true })
}

// 获取资方支持的银行列表
export const bandListByMsg = (param) => {
    return _postPromise('/oscar/spend/channelBanks', param, { showLoading: true })
}
// 选择扣款银行卡列表
export const getDebitCard = (param) => {
    return _postPromise('/oscar/bindcard/getUserRepayBankList', param, { showLoading: true })
}

// 发送短信验证
export const sendLianLianCode = (param) => {
    return _postPromise('/mall/loan/sendLianLianCode', param, { showLoading: true })
}

// 卡bin预校验
export const bindCardValidate = (param) => {
    return _postPromise('/oscar/bindcard/bindCardValidate', param, { showLoading: true })
}

// 是否实名认证
export const getAuthInfo = (param) => {
    return _postPromise('/oscar/bindcard/isCredit', param, { showLoading: true })
}

// 通过银行卡号id获取卡信息
export const getInfoByCardId = (param) => {
    return _postPromise('/oscar/bindcard/getUserBankInfo', param, { showLoading: true })
}

// 更换手机号发送验证码
export const changeSendCode = (param) => {
    return _postPromise('/oscar/bindcard/modifyPhoneApply', param, { showLoading: true })
}

// 更换手机号保存
export const saveChangeMobile = (param) => {
    return _postPromise('/oscar/bindcard/modifyPhoneConfirm', param, { showLoading: true })
}

// 绑卡申请-卡bin校验（四要素验证通过才发送）--点击获取验证码
export const sendCode = (param) => {
    return _postPromise('/oscar/bindcard/bindCardApply', param, { showLoading: true })
}
// 绑卡确认-输入验证码后点确认按钮提交-对应原来老的（checkLianLianCode）
export const bindCardConfirm = (param) => {
    return _postPromise('/oscar/bindcard/bindCardConfirm', param, { showLoading: true })
}

// 绑卡验证
export const checkLianLianCode = (param) => {
    return _postPromise('/mall/loan/checkLianLianCode', param, { showLoading: true })
}

// 获取用户信息
export const getUserInfo = () => {
    return _postPromise('/common/getCurrentUserInfo', null, { showLoading: true })
}

// 解绑银行卡App
export const unBindCardApp = (param) => {
    return _postPromise('/mall/loan/modifybindbanktel', param, { showLoading: true })
}

// 解绑银行卡H5
export const unBindCardH5 = (param) => {
    return _postPromise('/mall/loan/unbindbanktel', param, { showLoading: true })
}

// 获取绑卡用户信息
export const getBindCardUserInfo = (param) => {
    return _postPromise('/oscar/bindcard/getBindCardUserInfo', param, { showLoading: true })
}
