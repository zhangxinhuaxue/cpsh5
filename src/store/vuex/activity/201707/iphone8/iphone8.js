import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    state: {
        name: '',
        img: null,
        openid: '',
        tipsShow: true

    },
    mutations: {
        compound(state, obj) {
            for (let key in obj) {
                state[key] = obj[key]
            }
        }
    }
})
