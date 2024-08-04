import { _getPromise, _postPromise } from '../../base'

export const getCartCount = () => {
    return _getPromise('/mall/cart/getCartCount', null)
}

export const getCartPro = () => {
    return _getPromise('/mall/cart/listjson', null)
}

export const batchEdit = (param) => {
    return _getPromise('/mall/cart/batchEditProductNum', param)
}

export const deletePro = (param) => {
    return _getPromise('/mall/cart/delte', param)
}

export const getInventory = (param) => {
    return _getPromise('/mall/product/getSkuExpress', param)
}

export const getDetail = (param) => {
    return _getPromise('/mall/product/detailJson', param)
}

export const checkPrebuyNow = (param) => {
    return _getPromise('/mall/product/checkPrebuyNow', param)
}
