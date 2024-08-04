const App = () => import(/* webpackChunkName: 'rrh_index' */ './App.vue')
const index = () => import(/* webpackChunkName: 'rrh_index' */ './index.vue')

const auto = () => import(/* webpackChunkName: 'rrh_loan' */ './auto.vue')
const quxianIndex = () => import(/* webpackChunkName: 'rrh_loan' */ './quxian.vue')
const loan = () => import(/* webpackChunkName: 'rrh_loan' */ './loan/index.vue')
const ReplenishVerify = () => import(/* webpackChunkName: 'rrh_loan' */ './loan/replenish-verify.vue')
const result = () => import(/* webpackChunkName: 'rrh_loan' */ './loan/result.vue')
const sign = () => import(/* webpackChunkName: 'rrh_loan' */ './loan/sign.vue')
const modifyPhone = () => import(/* webpackChunkName: 'rrh_loan' */ './loan/modify-phone.vue')
const rightList = ()=>import(/* webpackChunkName:'rrh_right_list' */'./rights/right-list.vue')
const rightDetail =()=>import(/* webpackChunkName:'rrh_right_detail' */'./rights/right-detail.vue')
// 优惠券使用规则详情
const couponRule = () => import(/* webpackChunkName: 'rrh_loan' */ './loan/coupon-rule.vue')
// 优惠券列表
const couponList = () => import(/* webpackChunkName: 'couponList' */ './coupon/couponList.vue')
const invalidCouponList = () => import(/* webpackChunkName: 'invalidCouponList' */ './coupon/invalidCouponList.vue')
const useRule = () => import(/* webpackChunkName: 'useRule' */ './coupon/useRule.vue')

const bill = () => import(/* webpackChunkName: 'rrh_bill' */ './bill/index.vue')
const billItemDetails = () => import(/* webpackChunkName: 'rrh_bill' */ './bill/details.vue')
const prepayment = () => import(/* webpackChunkName: 'rrh_bill' */ './bill/prepayment.vue')
const paymentResult = () => import(/* webpackChunkName: 'rrh_bill' */ './bill/result.vue')
const rrhChangeCard = () => import(/* webpackChunkName: 'rrh_bill' */ './bill/change-card.vue')

const repayRecords = () => import(/* webpackChunkName: 'rrh_repayRecords' */ './repayRecords/index.vue')
const repayDetails = () => import(/* webpackChunkName: 'rrh_repayRecords' */ './repayRecords/details.vue')
const newRepayPlan = () => import(/* webpackChunkName: 'rrh_repayRecords' */ './repayRecords/newRepayPlan.vue')
const loanRecords = () => import(/* webpackChunkName: 'rrh_loanRecords' */ './loanRecords/index.vue')
const loanDetails = () => import(/* webpackChunkName: 'rrh_loanRecords' */ './loanRecords/details.vue')
const List = () => import(/* webpackChunkName: 'rrh_bankcard_list' */ 'src/module/common/bankbind/supportbanklist.vue')
// 增信服务页
// const rrhCreditService = () => import(/* webpackChunkName: 'rrh_creditService' */ './creditService/index.vue')
// const rrhServicePayResult = () => import(/* webpackChunkName: 'rrh_creditService' */ './creditService/payResult.vue')
// const rrhConfirm = () => import(/* webpackChunkName: 'rrh_creditService' */ './creditService/confirm.vue')
// 手机验证码
const rrhVfCode = () => import(/* webpackChunkName: 'rrh_vfCode' */ './common/vfcode')
// 授权引导页
const authone = () => import(/* webpackChunkName: 'authone' */ './authGuide/authone.vue')
const authtwo = () => import(/* webpackChunkName: 'authtwo' */ './authGuide/authtwo.vue')
const authpopup = () => import(/* webpackChunkName: 'authpopup' */ './authGuide/popup.vue')
const relogin = () => import(/* webpackChunkName: 'relogin' */ './common/relogin.vue')
const rights = () => import(/* webpackChunkName: 'rrh_loan' */ './rights/rights.vue')

export default [
    {
        path: '/pages/rrh',
        component: App,
        children: [
            {
                path: 'auto',
                component: auto,
                name: 'rrhAuto',
                meta: {
                    title: '招集令',
                    code: '210015203'
                }
            },
            {
                path: 'index',
                component: index,
                name: 'rrhIndex',
                meta: {
                    title: '招集令',
                    code: '210015202'
                }
            },
            {
                path: 'quxian',
                component: quxianIndex,
                name: 'quxianIndex',
                meta: {
                    title: '招集令'
                }
            },
            {
                path: 'loan',
                component: loan,
                name: 'rrhLoan',
                meta: {
                    title: '招集令',
                    code: '210015208'
                }
            },
            {
                path: 'replenishVerify',
                component: ReplenishVerify,
                name: 'replenishVerify',
                meta: {
                    title: '招集令'
                }
            },
            {
                path: 'couponRule',
                component: couponRule,
                name: 'couponRule',
                meta: {
                    title: '优惠券详情'
                }
            },
            {
                path: 'result',
                component: result,
                name: 'rrhResult',
                meta: {
                    title: '申请结果',
                    code: '210015211'
                }
            },
            {
                path: 'loanRecords',
                component: loanRecords,
                name: 'rrhLoanRecords',
                meta: {
                    title: '订单记录',
                    code: '210015212'
                },
                children: [
                    {
                        path: 'details',
                        component: loanDetails,
                        name: 'rrhLoanDetails',
                        meta: {
                            title: '借款详情'
                        }
                    }
                ]
            },
            {
                path: 'repayRecords',
                component: repayRecords,
                name: 'rrhRepayRecords',
                meta: {
                    title: '还款记录'
                },
                children: [
                    {
                        path: 'details',
                        component: repayDetails,
                        name: 'rrhRepayDetails',
                        meta: {
                            title: '还款详情'
                        }
                    }
                ]
            },
            {
                path: 'bill',
                component: bill,
                name: 'rrhBill',
                meta: {
                    title: '我的账单',
                    code: '210015214'
                },
                children: [
                    {
                        path: 'details',
                        component: billItemDetails,
                        name: 'billItemDetails',
                        meta: {
                            title: '详情'
                        }
                    },
                    {
                        path: 'prepayment',
                        component: prepayment,
                        name: 'rrhPrepayment',
                        meta: {
                            title: '提前还款'
                        }
                    }
                ]
            },
            {
                path: 'newRepayPlan',
                component: newRepayPlan,
                name: 'newRepayPlan',
                meta: {
                    title: '还款'
                }
            },
            {
                path: 'paymentResult',
                name: 'rrhPaymentResult',
                component: paymentResult,
                meta: {
                    title: '支付结果'
                }
            },
            {
                path: 'sign',
                name: 'rrhSign',
                component: sign,
                meta: {
                    title: '银行卡校验',
                    code: '210015207'
                },
                children: [
                    {
                        path: 'supportBankList',
                        component: List,
                        name: 'rrhSupportBankList',
                        meta: {
                            title: '银行列表'
                        }
                    }
                ]
            },
            {
                path: 'modifyPhone',
                name: 'rrhModifyPhone',
                component: modifyPhone,
                meta: {
                    title: '修改手机号'
                },
                children: [
                    {
                        path: 'supportBankList',
                        component: List,
                        name: 'rrhMPSupportBankList',
                        meta: {
                            title: '银行列表'
                        }
                    }
                ]
            },
            // {
            //     path: 'rrhCreditService',
            //     name: 'rrhCreditService',
            //     component: rrhCreditService,
            //     meta: {
            //         title: '增信服务'
            //     }
            // },
            // {
            //     path: 'rrhConfirm',
            //     name: 'rrhConfirm',
            //     component: rrhConfirm,
            //     meta: {
            //         title: '确认订单'
            //     }
            // },
            // {
            //     path: 'rrhServicePayResult/:tradeId(\\d+)',
            //     name: 'rrhServicePayResult',
            //     component: rrhServicePayResult,
            //     meta: {
            //         title: '支付结果'
            //     }
            // },
            {
                path: 'changeCard',
                component: rrhChangeCard,
                name: 'rrhChangeCard',
                meta: {
                    title: '更换银行卡'
                }
            },
            {
                path: 'couponList',
                component: couponList,
                name: 'couponList',
                meta: {
                    title: '优惠券列表'
                }
            },
            {
                path: 'invalidCouponList',
                component: invalidCouponList,
                name: 'invalidCouponList',
                meta: {
                    title: '已失效优惠券列表'
                }
            },
            {
                path: 'useRule',
                component: useRule,
                name: 'useRule',
                meta: {
                    title: '使用规则'
                }
            },
            {
                path: 'vfCode',
                component: rrhVfCode,
                name: 'rrhVfCode',
                meta: {
                    title: '输入验证码',
                    code: '210015210'
                }
            }, {
                path: 'authone',
                component: authone,
                name: 'authone',
                meta: {
                    title: '更多取现方案'
                }
            }, {
                path: 'authtwo',
                component: authtwo,
                name: 'authtwo',
                meta: {
                    title: '订单确认'
                }
            }, {
                path: 'authpopup',
                component: authpopup,
                name: 'authpopup'
            }, {
                path: 'relogin',
                component: relogin,
                name: 'relogin'
            }, {
                path: 'rights',
                component: rights,
                name: 'rights',
                meta: {
                    title: '招集令'
                }
            },{
                path:'rightList',
                component:rightList,
                name:'rightList',
                meta:{
                    title:'权益订单'
                }
            },{
                path:'rightDetail',
                component:rightDetail,
                name:'rightDetail',
                meta:{
                    title:'权益详情'
                }
            }
        ]
    }
]
