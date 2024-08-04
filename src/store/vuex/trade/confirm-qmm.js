// Create by sunxj on 08/21/18

import * as types from './mutation-types'
const state = {
    qmmOrderId: '', // 趣满满订单id
    cinemaAddress: '', // 影院地址
    cinemaName: '', // 影院名称
    movieName: '', // 影片名称
    hallName: '', // 影片类型
    moviePicUrl: '', // 影片海报图片
    moviePlayTime: '', // 影片播放时间
    number: '', // 数量
    payEndTime: '', // 截止支付时间
    price: '', // 单价
    seatName: '', // 座位号
    sumPrice: '', // 总价(元)
    serviceCost: '', // 服务费
    shopName: '' // 店铺名称
}

const getters = {}
const actions = {}
const mutations = {
    [types.QMM_CONFIRM_IMIT](state, obj) {
        for (let key in obj) {
            state[key] = obj[key]
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
