import hybridHeader from 'components/header/hybridheader.vue'
import * as orderAction from 'src/store/modules/order'
import myOrder from 'module/order/common/myorder.vue'
import orderEmpty from '../common/empty.vue'
import { AXD } from 'src/libs/util'
import { loadInit, newSobotIm } from 'src/libs/im'

let myOrderMixin = {
    name: 'myOrderMixin',
    data() {
        return {
            rechargeImg: 'https://img.aiyoumi.com/static/img/201711/02112824647.jpg',
            dataLoaded: false,
            orderlist: [],
            sobotUrl: ''
        }
    },
    methods: {
        initList(params) {
            let me = this
            this.getOrderList(params).then(res => {
                if (res.code === '10010' || res.code === '-1999') {
                    AXD.util.login()
                    return
                }
                if (!res.success) {
                    me.$_toast(res.resultDes)
                } else {
                    let orderList = []
                    for (let pItem of res.result) {
                        let trade = pItem.trade
                        let statusName = this.formatStatus(trade.status, trade.audit)

                        let order = pItem.orders[0]
                        let orderObj = {
                            order: pItem.orders.map(order => {
                                return {
                                    className: 'pt24', // 样式名
                                    id: order.id,
                                    tradeId: order.tradeId, // 订单号
                                    statusName,
                                    orderOptions: order.orderOptions,
                                    tradeIdOrDate: '订单号:' + order.tradeId,
                                    productId: order.productId,
                                    productName: order.productName,
                                    imgUrl: this.formatRechargeImg(order.imgThumb, this.rechargeImg),
                                    price: order.price,
                                    num: order.num,
                                    refundType: this.formatFeedback(order.feedback)
                                }
                            }),
                            trade
                        }
                        orderList.push(orderObj)
                    }
                    me.orderlist = orderList
                    me.dataLoaded = true
                }
            })
        },
        formatStatus(code, audit) {
            let status = {
                WAIT_PAY_RETURN: '待提交',
                WAIT_BUYER_PAY: '待付款',
                WAIT_SELLER_SEND_GOODS: '待发货',
                TRADE_BUYER_SIGNED: '交易成功',
                WAIT_BUYER_CONFIRM_GOODS: '待收货',
                TRADE_CLOSED: '交易关闭',
                TRADE_CLOSED_BY_USER: '交易关闭',
                WAIT_TEAM_BUY: '拼团中'
            }[code]
            if (audit == 'audit') {
                if (!(code == 'TRADE_CLOSED' || code == 'TRADE_CLOSED_BY_USER')) {
                    status = '订单审核中'
                }
            }
            return status
        },
        formatRechargeImg(originImg, img) {
            let imgUrl = originImg.indexOf('话费') > -1 ? img : originImg
            return imgUrl
        },
        formatFeedback(feedback) {
            let refundType = ''
            feedback = feedback * 1
            if (!feedback) {
                return refundType
            }
            switch (feedback) {
                case 107:
                    refundType = '退款关闭'
                    break
                case 110:
                    refundType = '退款成功'
                    break
                default:
                    refundType = '退款中'
                    break
            }
            return refundType
        },
        preloadIm() {
            if (!this.isApp) return

            // 嘉兴客服已废弃
            // loadInit(window, document, 'script', 'https://kfmcs.jiaxincloud.com/mcs.js', '_JIAXIN')

            // 获取智齿客服机器人URL
            newSobotIm(res => (this.sobotUrl = res))
        }
    },
    components: {
        hybridHeader,
        myOrder,
        orderEmpty
    }
}

export { myOrderMixin }
