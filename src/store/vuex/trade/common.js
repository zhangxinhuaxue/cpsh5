// Create by sunxj on 01/05/19
import * as types from './mutation-types'
import { confirmCommit } from '../../modules/trade/confirm'
const state = {
    merchantsArr: [], // 商家合集
    csrfToken: '',
    cartTotalPrice: '', // 合计价格
    shopCouponArr: [], // 店铺红包
    shopTotalPriceArr: [], // 店铺小记价格
    wholeCouponVo: { // 全场红包
        amt: '',
        code: '',
        useEffect: '加载中...',
        hasCoupon: false
    },
    stages: { // 分期数据
        isSelect: false, // 是否确定选了分期
        firstpaybal: '', // 首付比例
        firstpayName: '', // 首付比例名称
        month: '', // 分期月数
        requesting: false, // 是否请求中、、
        detail: {
            loading: true,
            firstPayAmount: '',
            stageAmount: '',
            monthPay: '',
            stageNum: ''
        },
        fqDesc: '',
        fqCorner: '',
        freeStr: false
    },
    stageChecked: false,
    invitationCode: ''
}

const getters = {}
const mutations = {
    // 保存总价
    [types.SAVE_CARTTOTALPRICE](state, val) {
        state.cartTotalPrice = val
    },
    // 保存店铺小计
    [types.SAVE_SHOPTOTALPRICE](state, {shopPrice, index}) {
        state.shopTotalPriceArr.splice(index, index, shopPrice)
    },
    // 保存分期数据
    [types.SAVE_STAGES](state, obj) {
        Object.assign(state.stages, obj)
    },
    // 保存全场红包
    [types.SAVE_WHOLECOUPON](state, obj) {
        Object.assign(state.wholeCouponVo, obj)
    },
    // 保存店铺红包
    [types.SAVE_SHOPCOUPON](state, {shopCoupon, index}) {
        Object.assign(state.shopCouponArr[index], shopCoupon)
    },
    // 保存初始化数据
    [types.SAVE_UNCHANGEDATA](state, obj) {
        for (let key in obj) {
            state[key] = obj[key]
        }
    },
    // 保存有无选择分期状态
    [types.SAVE_STAGECHECKED](state, val) {
        state.stageChecked = val
    },
    // 保存推荐码
    [types.SAVE_ACM](state, val) {
        state.invitationCode = val
    }
}
const actions = {
    confirmInfoInit({commit}, obj) {
        return new Promise((resolve, reject) => {
            obj.url(obj.data).then((data) => {
                if (data.success && data.result) {
                    let result = data.result || {}
                    let { wholeCouponVo, confirmVo, csrfToken, fqCorner, fqDesc, mxMark = false } = result
                    let { cartTotalPrice, merchants } = confirmVo
                    let shopCouponArr = []
                    let shopTotalPriceArr = []
                    merchants.map(({ couponVo, shopTotalPrice }) => {
                        if (!couponVo) {
                            couponVo = {
                                amt: '',
                                useEffect: '无可用红包',
                                code: '',
                                hasCoupon: false
                            }
                        } else {
                            couponVo.hasCoupon = true
                        }
                        shopCouponArr.push(couponVo)
                        shopTotalPriceArr.push(shopTotalPrice)
                    })

                    // if (wholeCouponVo) {
                    //     wholeCouponVo.hasCoupon = true
                    // }
                    if (!wholeCouponVo) {
                        wholeCouponVo = {
                            amt: '',
                            useEffect: '无可用红包',
                            code: '',
                            hasCoupon: false
                        }
                    } else {
                        wholeCouponVo.hasCoupon = true
                    }
                    commit('SAVE_STAGECHECKED', false)
                    commit('SAVE_UNCHANGEDATA', {
                        csrfToken,
                        merchantsArr: merchants,
                        shopCouponArr,
                        shopTotalPriceArr
                    })
                    commit('SAVE_CARTTOTALPRICE', cartTotalPrice)
                    commit('SAVE_STAGES', {
                        fqCorner,
                        fqDesc,
                        mxMark
                    })
                    commit('SAVE_WHOLECOUPON', wholeCouponVo)
                    // commit('SAVE_SHOPCOUPON', shopCouponArr)
                    resolve(result)
                } else {
                    reject(data)
                }
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
