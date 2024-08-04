import { _getPromise, _postPromise } from '../../base'
import debounce from 'lodash/debounce'

// 根据alias获取CMS全部数据
export const renderData = (param) => {
    return _getPromise('/cms/renderData', param)
}

// 虚拟 label 类型选择
export const getVirtualGames = (param) => {
    return _postPromise('/mall/v2/product/getVirtualGames', param, { showLoading: true })
}

// 虚拟充值列表
export const getVirtualList = debounce((param) => {
    return _postPromise('/mall/v2/product/virtual/list4json', param, { showLoading: true })
}, 600, { leading: true, trailing: false })


// 根据选择红包， 计算缴费金额
export const changeCoupon = debounce((param) => {
    return _postPromise('/mall/v2/trade/payfee/changeCp', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 购买拦截
export const preBuyNow = (param) => {
    return _postPromise('/mall/v3/trade/virtual/infoValid', param, { showLoading: true })
}

// 订单确认页 初始化
export const virtualConfirmInit = (param) => {
    return _postPromise('/mall/v3/trade/virtual/buynow', param, { showLoading: false })
}
// 有无全场红包
export const getHaswholeCp = (param) => {
    return _postPromise('/mall/v3/trade/coupon/wholeCpListInfo', param, { showLoading: false })
}
// 红包列表
export const virtualCouponList = debounce((param) => {
    return _postPromise('/mall/v3/trade/coupon/virtualCpList', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
// 选择红包
export const virtualCouponChange = debounce((param) => {
    return _postPromise('/mall/v3/trade/virtual/changCp', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
// 获取分期信息
export const virtualFQData = debounce((param) => {
    return _postPromise('/mall/v3/trade/virtual/getFQData', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
// 获取分期费率
// export const virtualFQGoodsCode = debounce((param) => {
//     return _postPromise('/mall/v3/trade/virtual/getActiveBackGoodsCodeVo', param, { showLoading: false })
// }, 800, { leading: true, trailing: true })
export const virtualFQGoodsCode = (param) => {
    return _postPromise('/mall/v3/trade/virtual/getActiveBackGoodsCodeVo', param, { showLoading: false })
}

// 创建订单
export const virtualCreateTradeV3 = debounce((param) => {
    return _postPromise('/mall/v3/trade/virtual/create', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 确认风险担保订单
export const virtualCreateTradeBuynow = debounce((param) => {
    return _postPromise('/mall/v3/trade/virtual/ensure/buynow', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
// 创建风险担保订单
export const virtualCreateTradeCreate = debounce((param) => {
    return _postPromise('/mall/v3/trade/virtual/ensure/create', param, { showLoading: true })
}, 600, { leading: true, trailing: false })

// 获取通行证数据
export const getLoanpassProductInfo = (param) => {
    return _postPromise('/mall/v3/trade/virtual/loanpass/productInfo', param, { showLoading: false })
}
