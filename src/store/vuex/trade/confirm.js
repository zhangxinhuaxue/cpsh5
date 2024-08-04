/**
 *
 * @author:      zhouqing
 * @dateTime:    2017-05-15 16:41:03
 * @description:
 */
// initial state
import * as types from './mutation-types'
const state = {
    buyerMessage: '',
    couponCode: '',
    couponText: '',
    couponMoney: '',
    hasCoupon: true,
    couponInfo: {
        amt: '',
        code: '',
        useEffect: '',
        hasCoupon: true
    },
    couponForMerchantIndex: -999,
    stageFirstPay: '',
    stageChecked: false,
    stageNum: '',
    stageText: '',
    stageDetail: {
        firstPayAmount: '...',
        stageAmount: '...',
        monthPay: '...'
    },
    csrfToken: '',
    productId: '',
    productInstalment: '',
    totalAmount: '',
    skuId: '',
    productNum: '1', // 默认数量为1
    pin: {
        createTeabuy: '',
        recordId: '',
        tbId: ''
    },
    bottomTips: {
        idCard: false, // 身份证提示
        stock: false, // 地区无货提示
        fouthAddr: false // 四级地址提示
    },
    productType: '', // JD，AICAI
    // createOrderParam: {}, // 提交订单参数
    createOrderSku: [], // 商品信息+红包信息+留言信息
    commonCouponParam: [],
    wholeCoupon: {
        useEffect: '无可使用红包',
        code: ''
    },
    hasWholeCoupon: false,
    stageData: [], // 订单确认页分期方案子路由所需参数
    checkedProductFreeInterestCode: null, // 选中A+免息券code码
    showMianXi: false,
    // 借款人意外险
    accidentInsurance: {
        isShow: false,
        isChosed: false,
        isAgreed: false,
        jobInfo: '',
        insuranceInfo: null
    }
    // storeCreateTeabuy: state => state.confirm.createTeabuy,
    // storeRecordId: state => state.confirm.recordId,
    // storeTbId: state => state.confirm.tbId
}

// getters
const getters = {
    finalPay: (state, getters) => {
        let couponMoney = state.couponMoney || 0
        let result = state.totalAmount - couponMoney // * 10
        return result >= 0 ? result : 0
    },
    skuIdAndNum: (state, getters) => {
        if (state.skuId && state.productNum) {
            return state.skuId + ',' + state.productNum
        } else {
            return ''
        }
    },
    stockTipsState: (state, getters) => {
        return state.productType == 'JD' && state.bottomTips.stock
    },
    fouthAddrTipsState: (state, getters) => {
        return state.productType == 'JD' && (state.bottomTips.stock ? false : state.bottomTips.fouthAddr)
    },
    idCardTipsState: (state, getters) => {
        return (state.bottomTips.stock || state.bottomTips.fouthAddr) ? false : state.bottomTips.idCard
    },
    getInsuranceInfo: () => {
        return state.accidentInsurance.insuranceInfo
    }
}

// actions
const actions = {}
// [type.CONFIRM_UPDATE_DATA] [types.CONFIRM_INIT]
// mutations
const mutations = {
    // init(state, obj) {
    [types.CONFIRM_INIT](state, obj) {
        for (let key in obj) {
            state[key] = obj[key]
        }
    },
    // updateData(state, obj) {
    [types.CONFIRM_UPDATE_DATA](state, obj) {
        state[obj.name] = obj.value
    },
    // selectCoupon(state, obj) {
    [types.SELECT_COUPON_V3](state, obj) {
        state.couponInfo = {
            code: obj.code || '',
            useEffect: obj.useEffect || '',
            amt: obj.amt || '',
            hasCoupon: true
        }
    },
    [types.SELECT_COUPON](state, obj) {
        state.couponCode = obj.code
        state.couponText = obj.text
        state.couponMoney = obj.money
    },
    [types.EDIT_SKUPARAM](state, obj) {
        state.createOrderSku = obj
    },
    // selectStage(state, obj) {
    [types.SELECT_STAGE](state, obj) {
        state.stageFirstPay = obj.firstPay
        state.stageNum = obj.num
        state.stageText = obj.stageText
        state.stageDetail = obj.detail
    },
    saveSkuId(state, val) {
        state.skuId = val
    },
    changeBottomTips(state, obj) {
        for (let key in obj) {
            state.bottomTips[key] = obj[key]
        }
    },
    [types.SAVE_STAGE_DATA](state, val) {
        state.stageData = val
    },
    checkProductFreeInterest(state, val) {
        state.checkedProductFreeInterestCode = val
        console.log('选中商品免息券code为' + val)
    },
    initShowMianxi(state, val) {
        state.showMianXi = val
    },
    saveAccidentInsuranceInfo(state, obj) {
        for (let key in obj) {
            state.accidentInsurance[key] = obj[key]
        }
    },
    resetAccidentInsuranceInfo(state) {
        state.accidentInsurance = {
            isShow: false,
            isChosed: false,
            isAgreed: false,
            jobInfo: '',
            insuranceInfo: null
        }
    },
    saveInsuranceToOrderSku(state, obj) {
        let list = state.createOrderSku
        if (list.filter(item => item.type && obj.type && item.type === obj.type).length) {
            list.forEach((item, index) => {
                if (item.type && obj.type && item.type === obj.type) {
                    list.splice(index, 1, obj)
                    return false
                }
            })
        } else {
            state.createOrderSku.push(obj)
        }
    },
    delInsuranceFromOrderSku(state, skuId) {
        state.createOrderSku = state.createOrderSku.filter(item => {
            let skuItemVos = item.skuItemVos.filter(subItem => {
                return subItem.skuId !== skuId
            })
            return skuItemVos.length
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
