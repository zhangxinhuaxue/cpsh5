/**
 * Created by liuju on 2019/3/7
 */
import { _getPromise, _postPromise } from '../../base'
import { loginUrl } from 'src/libs/domain'

// 帮助与客服
export const getCsFacade = () => {
    return _getPromise('/common/getCsFacade', {}, { showLoading: true })
}
// 获取用户加密id及名称 用作跳转第三方客服
export const getImInfo = (param) => {
    return _getPromise(loginUrl('/login/external/info'))
}
// 获取问题答案
export const questionAnswer = (param) => {
    return _getPromise('/common/questionAnswerSobot', param, { showLoading: true })
}
// 自助服务埋点
export const selfServiceBuryPoint = (param) => {
    return _getPromise('/common/selfServiceBuryPoint', param, { showLoading: true })
}
// 门户页进入聊天埋点
export const csFacadeBuryPoint = () => {
    return _getPromise('/common/csFacadeBuryPoint', {}, { showLoading: true })
}

// 用户自提工单问题类型
export const getQuestiones = (param) => {
    return _postPromise('/onlinecust/getQuestiones', param, { showLoading: true })
}
// 用户自提工单创建
export const custorderSave = (param) => {
    return _postPromise('/common/custorder/save', param, { showLoading: true })
}

// 用户自提工单列表
export const getCustorderList = (param) => {
    return _getPromise('/common/custorder/list', param, { showLoading: true })
}
// 用户自提工单详情
export const getCustorderInfo = (id) => {
    return _getPromise(`/common/custorder/info/${id}`, {}, { showLoading: true })
}
// 商品订单
export const myTrades = (param) => {
    // ?status=&start=5&size=5
    return _getPromise('/mall/trade/v3/myTrades', param, { showLoading: true })
}
// 取现订单
export const loanList = (param) => {
    // ?pageSize=30&startIndex=0&statusType=all
    return _getPromise('/oscar/loan/mergeLoanOrder', param, { showLoading: true })
}