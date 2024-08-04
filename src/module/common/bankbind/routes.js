import App from 'src/App.vue'
// const cardList = () => import(/* webpackChunkName: 'bankcard_index' */ './bindcardlist.vue')
const Add = () => import(/* webpackChunkName: 'bankcard_add' */ './addcard.vue')
const List = () => import(/* webpackChunkName: 'bankcard_list' */ './supportbanklist.vue')
const smsCheck = () => import(/* webpackChunkName: 'bankcard_smscheck' */ './smsCheck.vue')

export default [
    {
        path: '/pages/bankbind',
        component: App,
        children: [
            {
                path: 'addBankCard',
                component: Add,
                name: 'addBankCard',
                meta: {
                    title: '添加银行卡',
                    code: '210015206'
                },
                children: [
                    {
                        path: 'supportBankList',
                        component: List,
                        name: 'supportBankList',
                        meta: {
                            title: '银行列表'
                        }
                    }
                ]
            },
            {
                path: 'smsCheck',
                component: smsCheck,
                name: 'smsCheck',
                meta: {
                    title: '绑卡验证'
                }
            }
        ]
    }
]
