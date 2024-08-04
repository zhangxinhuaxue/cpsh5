// for new cart by yangjun 20171116
// edited by yangjun 20180411

import { _getPromise, _postPromise } from '../../base'
export const getCartCount = () => {
    return _getPromise('/mall/cart/getCartCount', null, { showLoading: true })
}
export const getCartList = () => {
    return _getPromise('/mall/cart/list', null, { showLoading: true })
}

export const addProToOnline = (param) => {
    return _getPromise('/mall/cart/add', param, { showLoading: true })
}

export const batchEdit = (param) => {
    return _postPromise('/mall/cart/edit', param, { showLoading: true })
}
export const deletePro = (param) => {
    return _getPromise('/mall/cart/delete', param, { showLoading: true })
}
export const getInventory = (param) => {
    return _getPromise('/mall/product/getSkuExpress', param, { showLoading: true })
}
export const getDetail = (param) => {
    return _getPromise('/mall/product/detailJson', param, { showLoading: true })
}

export const caculatePrice = (param) => {
    return _postPromise('/mall/cart/caculatePrice', param, { showLoading: true })
}

export const receiveCp = (param) => {
    return _postPromise('/mall/cart/receiveCoupon', param, { showLoading: true })
}

// 立即购买
export const toBuy = (param) => {
    return _postPromise('/mall/v3/trade/buyNow', param, { showLoading: true })
}

// 获取各个商铺是否有红包
export const showReceiveCp = (param) => {
    return _getPromise('/mall/cart/showReceiveCp', param, { showLoading: false })
}

// 获取商品是否参加N件任选
export const joinActivity = () => {
    return _getPromise('/mall/cart/activityinfos', null, { showLoading: false })
}
