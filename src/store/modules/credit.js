import {
    _post,
    formatRet,
    _postPromise
} from '../base'

/* ================基础授信================= */

// 基础授信初始化
export const getBaseCredit = (param, callback) => {
    return _postPromise('/h5/user/getBaseCredit', param)
}

// 基础授信表单提交-下一步
export const submitBaseCredit = (param, callback) => {
    return _postPromise('/h5/user/submitBaseCredit', param)
}

// 表单缓存
export const submitBaseCreditMG = (param, callback) => {
    return _postPromise('/h5/user/submitBaseCreditMG', param)
}

// 学籍提交
export const submitSchoolInfo = (param, callback) => {
    return _postPromise('/h5/user/submitSchoolInfo', param)
}
// 教育背景提交
export const submitEducationInfo = (param, callback) => {
    return _postPromise('/h5/user/submitEducationInfo', param)
}

// 联系人提交
export const submitContact = (url, param, callback) => {
    return _postPromise(url, param)
}

/* ================毕业基础授信================= */

// 毕业基础初始化
export const getGradBasic = (param, callback) => {
    return _postPromise('/h5/user/getGraBasicCredit', param, { showLoading: true })
}

// 毕业基础提交-下一步
export const submitGradBasic = (param, callback) => {
    return _postPromise('/h5/user/submitGradBasic', param)
}

// 手机运营商提交
export const submitPhone = (param, callback) => {
    return _postPromise('/h5/user/submitPhone', param)
}

// 手机运营商页面初始化
export const getService = (callback) => {
    return _postPromise('/h5/user/getService', null)
}

// 毕业生驳回再提交
export const getGraBasicReject = () => {
    return _postPromise('/h5/user/getGraBasicReject', null, { showLoading: true })
}

/* ================授信外放功能================= */
// 社保公积金外放h5链接获取
export const extendH5Url = (param) => {
    return _postPromise('/app/vuser/getThirdH5Link', param)
}
// 刷脸结果查询
export const biopsyResult = (param) => {
    return _postPromise('/common/h5/vivo/auth/result', param)
}
