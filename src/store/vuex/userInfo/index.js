/**
 * @author:      zhangjh
 * @dateTime:    2018-07-03
 * @description:
 *
 */
const debug = process.env.NODE_ENV !== 'production'
export default {
    namespaced: true,
    strict: debug,
    state: {
        userId: '', // 用户ID
        isGraduate: '', // 用户类型，是否已经毕业
        baseField: [],
        schoolField: [],
        empField: [],
        toPage: '',
        fromPage: ''
    },
    mutations: {
        saveUserInfo(state, val) {
            state.userId = val.userId
            state.isGraduate = val.isGraduate
            state.baseField = val.baseField
            state.empField = val.empField
            state.schoolField = val.schoolField
            window.localStorage.removeItem('userInfo')
            window.localStorage.setItem('userInfo', JSON.stringify(val))
        },
        saveToPage(state, val) {
            state.toPage = val
        },
        saveFromPage(state, val) {
            state.fromPage = val
        }
    }
}
