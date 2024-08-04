const debug = process.env.NODE_ENV !== 'production'
export default {
    namespaced: true,
    strict: debug,
    state: {
        jobInfo: {
            id: '',
            name: ''
        }
    },
    mutations: {
        saveJobInfo(state, val) {
            state.jobInfo = val
        }
    }
}
