// Create by sunxj on 05/15/17
const state = {
    comfirm: {
        num: 1
    },
    productId: '',
    uid: '',
    source: '',
    rechargeTitle: '',
    type: '',
    passcard: '',
    chargeAcm: '',
    skus: {},
    // discount: '',
    chargegame: '',
    chargeregion: '',
    chargeserver: '',
    chargetype: '',
    acm: '',
    goodstype: '',
    activityIds: null,
    isRefresh: '',
    sceneType: ''
    // productUrl: '',
    // gamesVo: {}
}

// const getters = {
//     disPrice: (state, getters) => {
//         let price = state.skus.price || 0
//         let discount = state.discount || 100
//         return (price * discount / 10000).toFixed(2)
//     }
// }
const actions = {}
const mutations = {
    saveVirtualData(state, obj) {
        for (let key in obj) {
            state[key] = obj[key]
        }
    },
    // saveGamesObj(state, obj) {
    //     state.gamesVo = obj
    // },
    saveAcm(state, val) {
        state.acm = val
    }
}

export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations
}
