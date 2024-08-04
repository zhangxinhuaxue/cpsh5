/* beautify preserve:start */
import { confirmAddress } from 'module/address/routes'
const index = () => import(/* webpackChunkName: 'trade_index' */ './index.vue')
const confirm = () => import(/* webpackChunkName: 'trade_confirm' */ './confirm/index.vue')
const confirmStage = () => import('./common/item_staging/popup_multi.vue')
const product = () => import(/* webpackChunkName: 'trade_product' */ './product/index.vue')
const virtualDetail = () => import(/* webpackChunkName: 'trade_virtualDetail' */ './virtual/game-vip.vue')
const virtualConfirm = () => import(/* webpackChunkName: 'trade_virtualConfirm' */ './virtual/confirm.vue')
const telrecharge = () => import(/* webpackChunkName: 'trade_telrecharge' */ './virtual/telrecharge.vue')
const productList = () => import(/* webpackChunkName: 'trade_productList' */ './product-list/index.vue')
const virtualList = () => import(/* webpackChunkName: 'trade_virtualList' */ './virtual-list/index.vue')
// 虚拟缴费
const App = () => import(/* webpackChunkName: 'trade_App' */ './App.vue')
const err = () => import(/* webpackChunkName: 'trade_err' */ './err/errpage.vue')
const cart = () => import(/* webpackChunkName: 'trade_cart' */ './cart/index.vue')
const payResult = () => import(/* webpackChunkName: 'trade_payResult' */ './payResult/index.vue')
const payError = () => import(/* webpackChunkName: 'trade_payError' */ './payResult/pay-error.vue')
const creditOrderResult = () => import(/* webpackChunkName: 'trade_creditOrderResult' */ './payResult/trade_credit.vue')
const productSearch = () => import(/* webpackChunkName: 'trade_productsearch' */ './product-list/search.vue')
const productQlist = () => import(/* webpackChunkName: 'trade_productQlist' */ './product/qlist.vue')
const productQdetail = () => import(/* webpackChunkName: 'trade_productQdetail' */ './product/qdetail.vue')
const productQaInput = () => import(/* webpackChunkName: 'trade_productQaInput' */ './product/qainput.vue')
const biopsyBankcard = () => import(/* webpackChunkName: 'trade_biopsyBankcard' */ './common/biopsy_bankcard/index.vue')

// A+会员卡
const VipCard = () => import(/* webpackChunkName: 'vipcard_index' */ './vipcard/index.vue')

// 会员卡2022s
const VipCard2022 = () => import(/* webpackChunkName: 'vipcard2022_index' */ './vipcard-2022/index.vue')
// 会员卡2022s
const returnCard = () => import(/* webpackChunkName: 'returnCard' */ './vipcard-2022/returnCard.vue')
// 金卡临时跳转页
const GoldenCard = () => import(/* webpackChunkName: 'vipcard_transit' */ './vipcard/transit.vue')
// A+会员卡权益展示
const VipCardRights = () => import(/* webpackChunkName: 'vipcard-rights_index' */ './vipcard/rights.vue')
// 通行证
const passcardDetail = () => import(/* webpackChunkName: 'passcard_index' */ './passcard/index.vue')
export default [{
    path: '/pages/trade',
    component: App,
    children: [{
        path: '/',
        component: index,
        name: 'tradeIndex',
        meta: {
            title: '导航页'
        }
    }, {
        path: 'confirm',
        component: confirm,
        name: 'tradeConfirm',
        meta: {
            title: '确认订单'
        },
        // children: confirmAddress,
        // 分期方案改由popup改为页面子路由
        children: [...confirmAddress, {
            path: 'stage',
            component: confirmStage,
            name: 'stage',
            meta: {
                title: '分期方案'
            }
        }]
        // children: [{
        //     path: 'address',
        //     component: address.component,
        //     children: address.children
        // }]
    }, {
        path: 'virtual/confirm',
        component: virtualConfirm,
        name: 'virtualConfirm',
        meta: {
            title: '确认订单'
        }
    }, {
        path: 'payResult/:tradeId(\\d+)',
        component: payResult,
        name: 'payResult',
        meta: {
            title: '支付结果'
        }
    }, {
        path: 'pay-error',
        component: payError,
        name: 'payError',
        meta: {
            title: '支付失败'
        }
    }, {
        path: 'creditOrderResult/:tradeId(\\d+)',
        component: creditOrderResult,
        name: 'tradeCreditOrderResult',
        meta: {
            title: '订单结果'
        }
    }, {
        path: 'biopsyBankcard',
        component: biopsyBankcard,
        name: 'biopsyBankcard',
        meta: {
            title: '安全验证'
        }
    }]
}, {
    path: '/pages/mall',
    component: App,
    children: [{
        path: 'product/:productId(\\d+)',
        component: product,
        name: 'product',
        meta: {
            title: '商品详情'
        }
    }, {
        path: 'product/search',
        component: productSearch,
        name: 'productSearch',
        meta: {
            title: '搜索'
        }
    }, {
        path: 'product/list',
        component: productList,
        name: 'productList',
        meta: {
            title: '商品列表'
        }
    }, {
        path: 'virtual/list',
        component: virtualList,
        name: 'virtualList',
        meta: {
            title: '充值中心',
            keepAlive: true
        }
    }, {
        path: 'virtual/detail/:productId(\\d+)',
        component: virtualDetail,
        name: 'virtualDetail',
        meta: {
            title: '游戏充值'
        }
    }, {
        path: 'telrecharge/detail/:productId(\\d+)',
        component: telrecharge,
        name: 'telrecharge',
        meta: {
            title: '话费充值'
        }
    }, {
        path: 'product/qlist',
        component: productQlist,
        name: 'productQlist',
        meta: {
            title: '问一问'
        }
    }, {
        path: 'product/qdetail',
        component: productQdetail,
        name: 'productQdetail',
        meta: {
            title: '问题详情'
        }
    }, {
        path: 'product/qainput',
        component: productQaInput,
        name: 'productQaInput',
        meta: {
            title: ''
        }
    }, {
        path: 'passcard',
        component: passcardDetail,
        name: 'passcardDetail',
        meta: {
            title: ' '
        }
    }]
}, {
    path: '/pages/vipcard',
    component: VipCard,
    name: 'vipcard',
    meta: {
        title: '购买会员'
    }
}, {
    path: '/pages/vipcard-2022',
    component: VipCard2022,
    name: 'vipcard2022',
    meta: {
        title: '购买招财会员'
    }
}, {
    path: '/pages/vipcard/returnCard',
    component: returnCard,
    name: 'returnCard',
    meta: {
        title: '退款订单'
    }
}, {
    path: '/pages/transit',
    component: GoldenCard,
    name: 'goldenCard',
    meta: {
        title: '金卡会员'
    }
}, {
    path: '/pages/vipcard-rights',
    component: VipCardRights,
    name: 'vipcard-rights',
    meta: {
        title: '更多权益'
    }
}, {
    path: '/err',
    component: err,
    name: 'err',
    meta: {
        title: '出错了'
    }
}, {
    path: '/pages/cart/list',
    component: cart,
    name: 'cart',
    meta: {
        title: '购物车'
    }
}]
/* beautify preserve:end */
