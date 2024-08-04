/*
 * @Author: sunxj
 * @Date: 2019-09-04 11:44:44
 * @LastEditTime: 2019-09-09 11:34:14
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 */
import debounce from 'lodash/debounce'
import { formatRet, _postPromise, _getPromise } from 'src/store/base'
import { creditServerOrigin } from 'src/libs/domain'

const creditSystemPrefix = creditServerOrigin + '/credit_h5' 

const _gatewayApi = (url, params, config = {}) => {
    return _postPromise(creditSystemPrefix + url, params, config)
}

// 补录提额第一页数据
export const getBuluFirst = () => {
    return _gatewayApi('/credit/bulu/first', {}, { showLoading: true })
}

// 授信入口
export const getStatus = (params) => {
    return _gatewayApi('/credit/status/get', params, { showLoading: true })
}
// 社保提额跳转
export const getSocialResult = () => {
    return _gatewayApi('/credit/enhance/jumpResultPage', {}, { showLoading: true, setHeaderUrlencoded: true })
}
// 公积金提额跳转
export const getGjjResult = () => {
    return _gatewayApi('/credit/enhance/gjjResultPage', {}, { showLoading: true, setHeaderUrlencoded: true })
}

export const creditIncrease = () => {
    return _gatewayApi('/credit/increase', {}, { showLoading: true })
}

// 认证通知
export const noticeAuthResult = (params) => {
    return _gatewayApi('/credit/auth/result', params, { showLoading: true })
}

export const getUrl = (params) => {
    return _gatewayApi('/credit/url/get', params, { showLoading: true })
}
export const submitBasic = debounce(
    (params) => {
        return _gatewayApi('/credit/base/apply', params, { showLoading: false })
    },
    600,
    { leading: true, trailing: false }
)
export const baseResult = (params) => {
    return _gatewayApi('/credit/baseResult', params)
}
// 信息
export const getInfo = () => {
    return _gatewayApi('/credit/base/get', {})
}
export const submitInfo = (params) => {
    return _gatewayApi('/credit/base/save', params, { showLoading: true })
}

// 地址
export const getLocation = () => {
    return _gatewayApi('/credit/location/get', {})
}
export const submitLocation = (params) => {
    return _gatewayApi('/credit/location/save', params, { showLoading: true })
}

// 联系人
export const getContacts = () => {
    return _gatewayApi('/credit/contacts/get', {})
}
export const submitContacts = (params) => {
    return _gatewayApi('/credit/contacts/save', params, { showLoading: true })
}
// 结果页
export const getResult = (params) => {
    return _gatewayApi('/credit/result', params, { showLoading: true })
}
export const resubmitResult = (params) => {
    return _gatewayApi('/credit/reset', params, { showLoading: true })
}

// 授信项是否需要做
export const getNeedDoCreditItem = (params) => {
    return _gatewayApi('/credit/item/detail', params)
}

// 获取额度
export const getAmountChange = () => {
    return _gatewayApi('/credit/amountOfChange', {}, { showLoading: true })
}
// 获取哪些需要用户授权
export const getReady = () => {
    return _gatewayApi('/credit/ready', {}, { showLoading: true })
}
// 获取苏宁合同
export const getSuningContract = (params) => {
    return _gatewayApi('/credit/suning/contract', params, { showLoading: false })
}
// 获取风控驳回联系人信息
export const getRejectContacts = () => {
    return _gatewayApi('/credit/getRejectContacts', {})
}
// 提交驳回联系人信息
export const submitRepairContacts = (params) => {
    return _gatewayApi('/credit/submitRepairContacts', params, { showLoading: false })
}
export const getContractStatus = () => {
    return _getPromise(creditSystemPrefix + '/credit/contract/queryContractStatus', {},  { showLoading: true }) 
}
// 更换手机号验证接口
export const checkChangeTel = (params) => {
    return _gatewayApi('/credit/contacts/check', params, { showLoading: false })
}

