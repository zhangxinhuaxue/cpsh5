const chsiEntry = () => import(/* webpackChunkName: 'chsi_entry' */ './chsi/entry.vue')
const chsiResult = () => import(/* webpackChunkName: 'chsi_result' */ './chsi/result.vue')
const App = () => import(/* webpackChunkName: 'common_credit_app' */ '../../App.vue')

export default [{
    path: '/pages/chsi',
    component: App,
    children: [{
        path: 'entry',
        component: chsiEntry,
        name: 'chsiEntry',
        meta: {
            title: '学信网验证'
        }
    }, {
        path: 'result',
        component: chsiResult,
        name: 'chsiResult',
        meta: {
            title: '验证结果'
        }
    }]
}]
