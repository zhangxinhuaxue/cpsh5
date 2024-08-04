const loanTransition = () => import(/* webpackChunkName: 'rrh_loanTransition' */'./loan/transition.vue')
export default [ {
    path: '/pages/loan/transition',
    name: 'loanTransition',
    component: loanTransition,
    meta: {
        title: '结果查询'
    }
}]
