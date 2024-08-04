import { renderData } from 'src/store/api'
const debug = process.env.NODE_ENV !== 'production'

export default {
    namespaced: true,
    strict: debug,
    state: {
        fromIndex: false,
        renderData: undefined,
        zjlApplyData: undefined,
        bankInfo: {
            cardCode: '',
            bankName: ''
        },
        loanInfo: {}
    },
    mutations: {
        saveFromPage(state, val) {
            state.fromIndex = val
        },
        saveBankInfo(state, val) {
            state.bankInfo.bankName = val.bankName
            state.bankInfo.cardCode = val.cardCode
        },
        saveLoanInfo(state, val) {
            state.loanInfo = val
        },
        saveRenderData(state, val) {
            state.renderData = val
        },
        saveApplyData(state, val) {
            state.zjlApplyData = val
        }
    },
    actions: {
        getRenderData({state, commit}) {
            return new Promise((resolve, reject) => {
                if (state.renderData) {
                    resolve(state.renderData)
                } else {
                    renderData({
                        alias: 'rrh_resource',
                        type: '/cms'
                    }, data => {
                        commit('saveRenderData', data)
                        resolve(data)
                    })
                }
            })
        },
        getZjlApplyData({state, commit}) {
            return new Promise((resolve, reject) => {
                if (state.zjlApplyData) {
                    resolve(state.zjlApplyData)
                } else {
                    renderData({
                        alias: 'zjl_apply',
                        type: '/cms'
                    }, data => {
                        commit('saveApplyData', data)
                        resolve(data)
                    })
                }
            })
        }
    }
}
