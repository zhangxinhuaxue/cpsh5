import { isSupportSessionStorage } from 'libs/util'

// import { state, mutations } from './mutations'

/* globals sessionStorage */

let applyData = isSupportSessionStorage() ? sessionStorage.getItem('applyData') : ''
let userId = isSupportSessionStorage() ? sessionStorage.getItem('userId') : ''

// let confirmData = sessionStorage.getItem('confirmData')
const debug = process.env.NODE_ENV !== 'production'
export default {
    strict: debug,
    namespaced: true,
    state: {
        applyData: (applyData && JSON.parse(applyData)) || {},
        userId: userId
    },
    mutations: {
        setUserId(state, data) {
            state.userId = data
            if (isSupportSessionStorage()) {
                sessionStorage.setItem('userId', data)
            }
        },
        updateApplyData(state, value) {
            state.applyData = value
            if (isSupportSessionStorage()) {
                sessionStorage.setItem('applyData', JSON.stringify(value))
            }
        }
        // ,
        // updateConfirmData(state, value) {
        //     state.confirmData = value
        //     sessionStorage.setItem('confirmData', JSON.stringify(value))
        // }
    }
}

// this.$store.state.count
// store.commit('increment')
