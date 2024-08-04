import { _getPromise, _postPromise, formatRet, _BaseRequest } from '../../base'
import debounce from 'lodash/debounce'

// 拼团商品列表接口
export const getTeambuyProList = (param) => {
    return _getPromise('/mall/teambuy/recommendTeambuyRecord', param)
}

// 获取商品详情的信息
export const getDetailInfo = (param) => {
    return _getPromise('/app/mall/pdtdetail/getPdtdetail', param)
}

// 话费临时使用----获取商品详情的信息
export const getDetailInfoTel = (param) => {
    return _getPromise('/app/mall/pdtdetail/getPdtdetailTel', param)
}

// 获取热门推荐商品----获取商品详情的id
export const getTopListNew = (param) => {
    return _getPromise('/product/getRecommendList', param, { showLoading: true })
}

// 获取热门推荐商品----获取商品详情的信息
export const getRecoPro = (param) => {
    return _postPromise('/product/getHotProductList', param, { showLoading: true })
}

// 获取商品详情的信息
export const getReactDetailInfo = (param) => {
    return _getPromise('/mall/v2/product/getPdtdetail', param, { showLoading: false })
}

// 虚拟商品详情 本地环境用
export const getVirtualDetailInfo = (param) => {
    return _getPromise('/mall/v2/virtual/product/getPdtdetail', param, { showLoading: false })
}
// 商铺的收藏交互
export const updateShopCollect = (param) => {
    return _postPromise('/shop/collect', param, { showLoading: true })
}

// 商铺的app收藏交互
export const updateAppShopCollect = (param) => {
    return _postPromise('/app/shop/collect', param, { showLoading: true })
}

// 领取红包
export const receiveCoupon = debounce((param) => {
    return _getPromise('/coupon/receiveCoupon', param)
}, 600, { leading: true, trailing: false })

// 立即购买
export const toBuy = (param) => {
    return _postPromise('/mall/v2/trade/buyNow', param, { showLoading: true })
}

// 加购物车
export const addCart = (param) => {
    return _postPromise('/mall/cart/add', param, { showLoading: true })
}

// 获取红包list
export const getCouponList = (param) => {
    return _getPromise('/mall/v2/product/checkReceiveCp', param)
}
// 红包资源位
export const getCouponTipList = (param) => {
    return _getPromise('/coupon/productCouponTipList', param)
}
// 获取红包list2019/02/28
export const getCouponListV3 = debounce((param) => {
    return _getPromise('/coupon/productCanReceiveList', param)
}, 600, { leading: true, trailing: false })

// 获取cps资源位
export const getCpsSource = (param) => {
    return _getPromise('/mall/v2/product/getSourcedetail', param)
}

// 获取购物车数量
export const getCartCount = (param) => {
    return _getPromise('/mall/cart/getCartCount', param)
}

// 获取规格参数［jd］
export const getSpec = (param) => {
    return _getPromise('/mall/v2/product/getSpecParams', param)
}

// 获取地区库存 [jd]
export const getStockState = (param) => {
    return _getPromise('/mall/v2/product/getStockState', param)
}

// 获取对应地区的有效mainSkuId
export const getValidSkuByArea = (param) => {
    return _getPromise('/mall/v2/product/getValidSku', param)
}

// 商品搜索列表接口
export const getProductCategoryList = (param) => {
    return _BaseRequest('/mall/product/list4Json', param, { methods: 'post' })
    // return _BaseRequest('/mall/product/list4Json', param)
}
// H5搜索热词
export const getHotWords = (param) => {
    return _BaseRequest('/home/getHotWords', param, { methods: 'post', isShowAllData: true })
}
export const getImMerchantInfo = (param) => {
    return _getPromise('/app/common/getImMerchantInfoByPKey', param)
}
export const getSystime = (param) => {
    if (window.aixuedai.isUavoApp === 'y') {
        return _getPromise('/app/common/getNow', param)
    } else {
        return _postPromise('/common/getNow', param)
    }
}

// 商详内嵌模块信息
export const getQaInfo = (param) => {
    return _getPromise('/mall/v2/product/qa/getQuestionInfo', param)
}

// 获取问题详情页信息（回答列表）
export const getAnswerList = (param) => {
    return _getPromise('/mall/v2/product/qa/getAnswerList', param)
}

// 获取问题列表
export const getQuestionList = (param) => {
    return _getPromise('/mall/v2/product/qa/getQuestionList', param)
}

// 提交回答
export const submitAnswer = (param) => {
    return _getPromise('/mall/v2/product/qa/answer', param)
}

// 校验回答资格
export const checkAnswer = (param) => {
    return _getPromise('/mall/v2/product/qa/answerCheck', param)
}

// 提交问题
export const submitQuestion = (param) => {
    return _getPromise('/mall/v2/product/qa/question', param)
}

// 校验提问资格
export const checkQuestion = (param) => {
    return _getPromise('/mall/v2/product/qa/questionCheck', param)
}

// 埋点统计接口
export const burPoint = (param) => {
    return _getPromise('/mall/product/burPoint', param)
}

// 开抢提醒
export const activityRemind = (param) => {
    return _getPromise('/mall/v2/product/setRemindDetail', param)
}
// 获取预约商品信息
export const getReservation = (param) => {
    return _getPromise('/mall/v2/product/reservation', param)
}
// 保存预约商品信息
export const saveReservation = (param) => {
    return _postPromise('/mall/reservation/save', param)
}
