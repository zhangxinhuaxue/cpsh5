/* beautify preserve:start */
const App = () => import(/* webpackChunkName: 'contract_app' */ './App.vue')
const contractCash = () => import(/* webpackChunkName: 'contract_cash' */ './contractCash.vue')
const contractApp = () => import(/* webpackChunkName: 'contract_cash' */ './contractApp.vue')
/* beautify preserve:end */

export default [{
    path: '/pages/contract',
    component: App,
    name: 'commonContract',
    children: [{
        path: 'list',
        component: contractCash,
        name: 'commonContractList'
    }, {
        path: 'cash',
        component: contractCash,
        name: 'cash', // 切记：routerName不要写这么简单很容易重复，不容易搜索。建议其他合同使用以下模版。
        meta: {
            title: '资金提供方协议'
        }
    }, {
        path: 'app',
        component: contractApp,
        meta: {
            title: '用户协议'
        }
    }]
}]