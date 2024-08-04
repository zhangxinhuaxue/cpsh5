/*
 * @Author: sunxj
 * @Date: 2019-03-11 11:19:02
 * @LastEditTime: 2019-09-09 11:33:30
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 */
import { getSuningContract } from 'store/modules/credit-system/index'
// initial state
const state = {
    suningContract: null
}

const getters = {}

const mutations = {
    saveSuningData(state, list) {
        state.suningContract = list
    }
}
const actions = {
    getSuningContractData({commit}) {
        return new Promise((resolve, reject) => {
            getSuningContract({
                platform: 'suning'
            }).then((res) => {
                if (res.success && res.result) {
                    commit('saveSuningData', res.result)
                    resolve(res.result)
                } else {
                    reject()
                }
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
