import {
    _BaseRequest
} from '@/store/base'
// 请求类型
const methods = {
    methods: 'post',
    showLoading: true
}
/*
获取用户是否需要完善信息数据
 */
export const getUserSupplement = (param) => {
    methods.isShowAllData = false
    return _BaseRequest('/mall/loan/userSupplement', param, { showLoading: false })
}
export const addUserSupplement = (param) => {
    methods.isShowAllData = false
    return _BaseRequest('/mall/loan/addUserSupplement', param, methods)
}
// 嗨花 - 是否补充用户信息
export const checkNeedSupplementUserInfo = (param) => {
    methods.isShowAllData = false
    methods.showLoading = false
    return _BaseRequest('/app/loan/checkNeedSupplementUserField', param, methods)
}
// 嗨花 - 补充用户信息
export const hhAddUserSupplement = (param) => {
    methods.isShowAllData = false
    methods.showLoading = false
    return _BaseRequest('/app/loan/supplementUserInfos', param, methods)
}
// 新的用户补录
export const newUserSupplement = (param) => {
    methods.isShowAllData = false
    methods.showLoading = param.showLoading
    return _BaseRequest('/oscar/loan/createTaskId', param, methods)
}
