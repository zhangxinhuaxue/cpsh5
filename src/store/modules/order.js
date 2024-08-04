import { _postPromise, _getPromise, formatRet } from '../base'

// 订单列表
export const getOrderList = (param) => {
    return _getPromise('/mall/trade/v3/myTrades', param, { showLoading: true })
}

// 获取尾款商品信息
export const getEndOrderInfo = (param) => {
    return _getPromise('/mall/trade/v3/endpayinfo', param, { showLoading: true })
}

// 错配订单详情
export const getloanDetailList = (param) => {
    return _getPromise('/mall/loan/loanDetail', param, { showLoading: true })
}

// 订单详情
export const getOrderDetail = (param) => {
    return _getPromise('/mall/trade/v3/tradeDetail', param, { showLoading: true })
}

// 退货详情
export const getRefundDetail = (param) => {
    return _getPromise('/mall/trade/refundOrderDetail', param, { showLoading: true })
}

// 物流列表信息
export const getLogisticsList = (param) => {
    return _getPromise('/mall/trade/v3/listLogisticsWithSku', param, { showLoading: true })
}

// 物流信息
export const expressStatus = (param) => {
    return _getPromise('/mall/trade/v3/logisticsTrace', param, { showLoading: true })
}

// 取消订单
export const cancelOrder = (param) => {
    return _postPromise('/mall/trade/v3/cancelTrade', param, { showLoading: true })
}

// 删除订单
export const deleteOrder = (param) => {
    return _postPromise('/mall/trade/v3/delTrade', param, { showLoading: true })
}
// 支付订单已改为其他接口
// 支付订单
// export const getPayOrder = (param) => {
//     return _postPromise('/mall/payment/v2/getPayParameterByTid', param, { showLoading: true })
// }
// 确认收货
export const confirmOrder = (param) => {
    return _postPromise('/mall/trade/v3/confirmSignTrade', param, { showLoading: true })
}

// 取现订单列表
export const cashOrderList = (param) => {
    // return _getPromise('/mall/trade/getLoanList', param, { showLoading: true })
    return _getPromise('/oscar/loan/mergeLoanOrder', param, { showLoading: true })
}

// 退款按钮显示逻辑
export const showRefund = (param) => {
    // let reqUrl = aixuedai.isUavoApp === 'y' ? '/app/refund/showRefund' : '/refund/showRefund'
    return _postPromise('/app/refund/showRefund', param)
}

// 退款按钮点击逻辑
export const refundJD = (param) => {
    return _getPromise('/app/refund/jd/index', param, { showLoading: true })
}

// 退款退货
export const getRefundList = (param) => {
    return _getPromise('/mall/trade/getMyRefundList', param, { showLoading: false })
}

// 趣满满电影票号
export const getTicketIssueQmm = (param) => {
    return _postPromise('/mall/ticket/issue/qmm', param, { showLoading: false })
}
