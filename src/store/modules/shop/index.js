import { _getPromise, _postPromise } from '../../base'
import debounce from 'lodash/debounce'
// 店铺信息
export const getShopInfo = (param) => {
    return _postPromise('/shop/shopInit', param, { showLoading: false })
}
// 收藏店铺
export const collectShop = (param) => {
    return _postPromise('/shop/collect', param, { showLoading: false })
}
// 我的收藏
export const getMyCollection = (param) => {
    return _postPromise('/shop/myCollection', param, { showLoading: false })
}
// 获取店铺下的首页topoic列表
export const getShopTopicList = (param) => {
    return _postPromise('/shop/getShopTopicList', param, { showLoading: true })
}
// 获取店铺下的全部商品列表或分类商品列表
export const getAllProduct = debounce((param) => {
    return _postPromise('/shop/productList', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
// 获取店铺下的上新商品列表
export const getNewProduct = (param) => {
    return _postPromise('/shop/newProduct', param, { showLoading: true })
}
// 获取商品分类
export const getProductGroup = (param) => {
    return _postPromise('/shop/productGroup/index', param, { showLoading: false })
}
// 获取商品分类列表里的商品
// export const getProductGroupProduct = debounce((param) => {
//     return _postPromise('/shop/group/productList', param, { showLoading: true })
// }, 600, { leading: true, trailing: false })
// 获取指定主焦橱窗初始化信息
export const getCustomData = (param) => {
    return _postPromise('/shop/custom', param, { showLoading: false })
}
// 获取指定的专题信息
export const getTopicData = (param) => {
    return _postPromise('/shop/topic/index', param, { showLoading: false })
}
// 验证图形验证码
export const checkImgCode = debounce((param) => {
    return _postPromise('/shop/licenseValidate', param, { showLoading: true })
}, 600, { leading: true, trailing: false })
