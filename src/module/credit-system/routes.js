/*
 * @Description: In User Settings Edit
 */
const App = () => import(/* webpackChunkName: 'credit_system_app' */ './App.vue')
// 授信统一入口页
const creditAmount = () => import(/* webpackChunkName: 'credit_basic_amount' */ './amount/index.vue')
// 基础授信统一入口页
const creditBasic = () => import(/* webpackChunkName: 'credit_basic' */ './basic/index.vue')
// 基础授信结果页
const creditBasicCardResult = () => import(/* webpackChunkName: 'credit_BasicCard_result' */ './basic/result.vue')
// const creditBasicInfo = () => import(/* webpackChunkName: 'credit_basic_info' */ './common/info.vue')
const creditBasicAddress = () => import(/* webpackChunkName: 'credit_basic_address' */ './common/address.vue')
const creditBasicContacts = () => import(/* webpackChunkName: 'credit_basic_contacts' */ './common/contacts.vue')
// 提额公用结果页，暂时包含瀑布式基础授信结果页
const creditBasicResult = () => import(/* webpackChunkName: 'credit_basic_result' */ './common/result.vue')
// 提额授信中转页
const creditNotice = () => import(/* webpackChunkName: 'credit_basic_result' */ './common/notice.vue')
// 我的额度页
const creditMyAmount = () => import(/* webpackChunkName: 'credit_myamount' */ './my/index.vue')
// 基础授信合同
const creditContract = () => import(/* webpackChunkName: 'credit_contract' */ './contract/index.vue')
// 提额页
const upamount = () => import(/* webpackChunkName: 'upamount' */ './upamount/index.vue')
// 授信关闭-随意花引导页
const closeGuide = () => import(/* webpackChunkName: 'closeGuide' */ './closeguide/index.vue')
// 授信驳回-更换联系人
const changeContacts = () => import(/* webpackChunkName: 'changeContacts' */ './changeContacts/index.vue')
// 信用提额-APP弹窗
const creditpopup = () => import(/* webpackChunkName: 'creditpopup' */ './creditpopup.vue')

export default [
    {
        path: '/pages/credit-system',
        component: App,
        name: 'creditSystem',
        children: [
            {
                path: 'amount',
                component: creditAmount,
                name: 'creditAmount',
                meta: {
                    title: '提高额度',
                    code: '210015204'
                }
            },
            {
                path: 'basic/:platform',
                component: creditBasic,
                name: 'creditBasic',
                meta: {
                    title: ' '
                    // keepAlive: true
                }
            },
            {
                path: 'basicResult/:platform',
                component: creditBasicCardResult,
                name: 'creditBasicCardResult',
                meta: {
                    title: '审核结果'
                }
            },
            {
                path: 'address',
                component: creditBasicAddress,
                name: 'creditBasicAddress',
                meta: {
                    title: '居住地址'
                }
            },
            {
                path: 'contacts',
                component: creditBasicContacts,
                name: 'creditBasicContacts',
                meta: {
                    title: '联系人'
                }
            },
            {
                path: 'result',
                component: creditBasicResult,
                name: 'creditBasicResult',
                meta: {
                    title: '审核结果'
                }
            },
            {
                path: 'notice',
                component: creditNotice,
                name: 'creditNotice',
                meta: {
                    title: ' '
                }
            },
            {
                path: 'myAmount',
                component: creditMyAmount,
                name: 'creditMyAmount',
                meta: {
                    title: '我的额度'
                }
            },
            {
                path: 'contract',
                component: creditContract,
                name: 'creditContract',
                meta: {
                    title: '协议'
                }
            },
            {
                path: 'upamount',
                component: upamount,
                name: 'upamount',
                meta: {
                    title: '补录提额'
                }
            },
            {
                path: 'closeGuide',
                component: closeGuide,
                name: 'closeGuide',
                meta: {
                    title: ' '
                }
            },
            {
                path: 'changeContacts',
                component: changeContacts,
                name: 'changeContacts',
                meta: {
                    title: ' '
                }
            },
            {
                path: 'creditpopup',
                component: creditpopup,
                name: 'creditpopup'
            }
        ]
    }
]
