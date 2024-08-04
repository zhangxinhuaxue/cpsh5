import Vue from 'vue'
import Vuex from 'vuex'

import trade from './vuex/trade'
import shop from './vuex/shop'
import credit from './vuex/credit'
import address from './vuex/address'
import loan from './vuex/loan/loan'
import password from './vuex/password'
import userInfo from './vuex/userInfo'
import rrh from './vuex/rrh'
import jobInfo from './vuex/jobInfo'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    strict: debug,
    state: {
        // initial state
        scrollPos: {
            routerName: 1
        }
    },
    getters: {},
    mutations: {
        saveScrollPos(state, obj) {
            state.scrollPos = Object.assign(state.scrollPos, obj)
        }
    },
    modules: {
        trade: trade,
        shop: shop,
        credit: credit,
        address: address,
        loan: loan,
        password: password,
        userInfo: userInfo,
        rrh,
        jobInfo
    }
})
