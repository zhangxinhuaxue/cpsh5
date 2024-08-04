import { _getPromise, _postPromise } from '../../base'

// 支付结果
export const getTradeInfo = (param) => {
    return _postPromise('/payReuslt/getTradeInfo', param)
}

// 合并支付支付结果
export const getTradeInfoByGid = (param) => {
    return _postPromise('/payReuslt/getTradeInfoByGid', param)
}

// 支付 还款结果页推荐
export const getPayReusltConfig = (param) => {
    return _postPromise('/payReuslt/getConfig', param)
}

// 支付 还款结果页分享内容
export const getShareCon = (param) => {
    return _postPromise('/coupon/createCouponShare', param)
}

// 结果页推荐商品
export const getRecommendList = (param) => {
    return _postPromise('/plist/getRecommendList', param)
}

// 带单授信订单结果
export const getTradeCreditResult = (param) => {
    return _postPromise('/mall/v2/trade/getCreditResult', param)
}

// 根据payId获取tid gid
export const getTradeInfoByPayId = (param) => {
    return _postPromise('/payReuslt/getTradeInfoByPayId', param)
}
export const getCreditUrl = (param) => {
    return _postPromise('/mall/payment/v3/getCreditUrlByGId', param)
}

export const getPayError = (param) => {
    return _getPromise('/api/mall/pay/fail', param)
}
