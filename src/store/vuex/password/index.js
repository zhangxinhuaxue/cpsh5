/**
 *
 * @author:      sunxj
 * @dateTime:    2017-11-14 19:46:14
 * @description:
 */
const debug = process.env.NODE_ENV !== 'production'

export default {
    namespaced: true,
    strict: debug,
    state: {
        telphone: '',
        pwd: '',
        errorTip: ''
    },
    mutations: {
        saveTel(state, val) {
            state.telphone = val
        },
        savePwd(state, val) {
            state.pwd = val
        },
        saveErrorTip(state, val) {
            state.errorTip = val
        }
    }
}
