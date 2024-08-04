/* beautify preserve:start */
const App = () => import(/* webpackChunkName: 'order_app' */ './app.vue')
const Goods = () => import(/* webpackChunkName: 'order_goods' */ './views/goods.vue')
const GoodsDetail = () => import(/* webpackChunkName: 'order_goodsDetail' */ './views/goodsDetail.vue')
const Cash = () => import(/* webpackChunkName: 'order_cash' */ './views/cash.vue')
const CashDetail = () => import(/* webpackChunkName: 'order_cashDetail' */ './views/cashDetail.vue')
// const CashDetailNormal = () => import(/* webpackChunkName: 'order_cashDetailNormal' */ './views/cashDetailNormal.vue')
const CashDetailNew = () => import(/* webpackChunkName: 'order_cashDetailNew' */ '../rrh/loanRecords/details.vue')
const Express = () => import(/* webpackChunkName: 'order_express' */ './views/express.vue')
const logisticsList = () => import(/* webpackChunkName: 'order_logistics_list' */ './views/logisticsList.vue')
const refund = () => import(/* webpackChunkName: 'order_refund' */ './views/refund.vue')
const refundDetail = () => import(/* webpackChunkName: 'order_refund' */ './views/refundDetail.vue')
/* beautify preserve:end */
export default [{
    path: '/pages/order',
    component: App,
    children: [{
        path: '',
        redirect: 'goods'
    }, {
        path: 'goods',
        component: Goods,
        name: 'orderGoods',
        meta: {
            title: '我的订单'
        }
    }, {
        path: 'cash',
        component: Cash,
        name: 'orderCash',
        meta: {
            title: '我的订单'
        }
    }, {
        path: 'goodsDetail',
        component: GoodsDetail,
        name: 'orderGoodsDetail',
        meta: {
            title: '订单详情'
        }
    }, {
        path: 'cashDetail',
        component: CashDetail,
        name: 'orderCashDetail',
        meta: {
            title: '取点花订单'
        }
    }, {
        path: 'cashDetailNormal',
        component: CashDetailNew,
        name: 'cashDetailNormal',
        meta: {
            title: '订单详情'
        }
    }, {
        path: 'express',
        component: Express,
        name: 'orderExpress',
        meta: {
            title: '物流详情'
        }
    }, {
        path: 'logisticsList',
        component: logisticsList,
        name: 'logisticsList',
        meta: {
            title: '查看物流'
        }
    }, {
        path: 'refund',
        component: refund,
        name: 'orderRefund',
        meta: {
            title: '退款退货',
            keepAlive: false
        }
    }, {
        path: 'refund/detail',
        component: refundDetail,
        name: 'refundOrderDetail',
        meta: {
            title: '退款退货详情',
            keepAlive: false
        }
    }]
}]
