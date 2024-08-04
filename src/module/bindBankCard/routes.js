const App = () => import(/* webpackChunkName: 'bankCardApp' */ './App')
const manage = () => import(/* webpackChunkName: 'bankCardManage' */ './bankCardManage')
const add = () => import(/* webpackChunkName: 'bankCardAdd' */ './addBankCard')
const changePhone = () => import(/* webpackChunkName: 'bankCardChangePhone' */ './changePhone')
const debitCard = () => import(/* webpackChunkName: 'bankCardDebitCard' */ './debitCard')
export default [
    {
        path: '/pages/bankCard',
        component: App,
        children: [
            {
                path: 'manage',
                component: manage,
                name: 'manage',
                meta: {
                    title: '银行卡管理'
                }
            }, {
                path: 'add',
                component: add,
                name: 'addCard',
                meta: {
                    title: '填写银行卡信息'
                }
            }, {
                path: 'changePhone',
                component: changePhone,
                name: 'changePhone',
                meta: {
                    title: '更改手机号'
                }
            }, {
                path: 'debitCard',
                component: debitCard,
                name: 'debitCard',
                meta: {
                    title: '选择扣款银行卡'
                }
            }
        ]
    }
]
