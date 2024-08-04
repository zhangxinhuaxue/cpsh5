import { _getPromise, _postPromise, formatRet } from '../../base'
import debounce from 'lodash/debounce'
const finalPaymentConfirmation = () => {

}
// 订单确认页 初始化
export const confirmInit = (param) => {
    return _postPromise('/mall/v2/trade/buyNow', param, { showLoading: false })
}

// 订单确认页 初始化
// add by adly for cart 2.0
export const confirmInitV3 = (param) => {
    return _postPromise('/mall/v3/trade/buyNow', param, { showLoading: false })
}
export const preBuyNow = (param) => {
    return _postPromise('/mall/v3/trade/infoValid', param, { showLoading: false })
}

export const hasIdCard = (param) => {
    return _postPromise('/mall/deliver/hasDeliverIdentify', param, { showLoading: false })
}

export const addIdCard = (param) => {
    return _postPromise('/mall/deliver/addDeliverIdentify', param, { showLoading: true })
}
export const getPresaleInfo = (param) => {
    return _postPromise('/mall/trade/v3/presellDetail', param, { showLoading: true })
}

// 选择红包
export const getCoupon = debounce((param) => {
    return _postPromise('/coupon/autoSelectCoupon', param, { showLoading: true })
}, 300, { leading: true, trailing: false })

// 选择红包--话费
export const getCouponTel = debounce((param, extend) => {
    return _postPromise('/coupon/autoSelectCoupon', param, { showLoading: false })
}, 300, { leading: true, trailing: true })

// 加入购物车 跳转提额前
export const addCartBeforeCredit = debounce((param) => {
    return _postPromise('/mall/cart/addBeforeCredit', param, { showLoading: true })
}, 300, { leading: true, trailing: false })
// 是否需要上传通讯录
export const uploadUserContract = debounce((param) => {
    return _postPromise('/mall/v3/trade/userContract', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
// 选择分期方案
export const getStage = debounce((param) => {
    return _postPromise('/mall/v2/trade/getFQData', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 分期方案返回详情
export const getStageDetail = debounce((param) => {
    //  return _postPromise('/mall/trade/getActiveBackGoodsCodeVo', param, extend)
    return _postPromise('/mall/v2/trade/getActiveBackGoodsCodeVo', param)
}, 500, { leading: true, trailing: true })

// 实物|购物车
export const confirmCommit = debounce((param) => {
    return _postPromise('/mall/v2/trade/create', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 拼团
export const confirmPinCommit = debounce((param) => {
    return _postPromise('/mall/v2/trade/teamBuyCreate', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 获取收银台参数
export const getPayParameterByGid = debounce((param) => {
    return _postPromise('/mall/payment/v3/getPayParameterByGid', param)
}, 600, { leading: true, trailing: false })

// 话费----提交订单
export const phoneCreate = debounce((param) => {
    return _postPromise('/mall/v2/trade/phoneCreate', param, { showLoading: true })
}, 600, { leading: true, trailing: true })

// 虚拟提交订单
export const virualCreate = debounce((param) => {
    // return _postPromise('/mall/v2/trade/virualCreate', param, { showLoading: true })
    return _postPromise('/mall/v3/trade/virtual/create', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 刷脸绑卡
export const gatValidinfos = (param) => {
    return _postPromise('/secu/validinfos', param, { showLoading: true })
}

// -------------cart2.0------------------

// 获取全场红包
export const getWholeCoupon = (param) => {
    return _postPromise('/mall/v3/trade/wholeCpList', param, { showLoading: true })
}

// 分期方案返回详情
export const getStageDetailV3 = debounce((param) => {
    return _postPromise('/mall/v3/trade/getActiveBackGoodsCodeVo', param)
}, 500, { leading: true, trailing: true })

// 选择分期方案
export const getStageV3 = debounce((param) => {
    return _postPromise('/mall/v3/trade/getFQData', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 实物|购物车
export const confirmCommitV3 = debounce((param) => {
    return _postPromise('/mall/v3/trade/create', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 更改红包后的价格
export const getFinalPrice = debounce((param) => {
    return _postPromise('/mall/v3/trade/changeCp', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// // 获取收银台参数
// export const getPayParameterByGidV3 = debounce((param) => {
//     return _postPromise('/mall/payment/v3/getPayParameterByGid', param)
// }, 600, { leading: true, trailing: false })

// 店铺红包列表
export const getShopCpList = (param) => {
    return _postPromise('/mall/v3/trade/shopCpList', param, { showLoading: true })
}

// ------- A+会员新增 --------

// 确认订单页>分期方案>选择商品免息券
export const checkProductFreeInterest = (param) => {
    return _postPromise('/coupon/checkProductFreeInterest', param, { showLoading: true })
}
