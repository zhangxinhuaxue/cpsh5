const App = () => import(/* webpackChunkName: 'rrh_app' */ './App.vue')
const index = () => import(/* webpackChunkName: 'clearProof_index' */ './index.vue')
const apply = () => import(/* webpackChunkName: 'clearProof_apply' */ './apply.vue')
const result = () => import(/* webpackhunkName: 'clearProof_result */ './result.vue')
export default [{
    path: '/pages/clearProof',
    component: App,
    children: [{
        path: 'index',
        component: index,
        name: 'clearProofIndex',
        meta: {
            title: '结清证明'
        }
    }, {
        path: 'apply',
        component: apply,
        name: 'clearProofApply',
        meta: {
            title: '结清证明申请'
        }
    }, {
        path: 'result',
        component: result,
        name: 'clearProofResult',
        meta: {
            title: '提交成功'
        }
    }]
}]
