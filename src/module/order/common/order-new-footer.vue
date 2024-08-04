<template>
    <div>
        <div class="order-btn-group">
            <a v-if="trade.extType === 'CARD' && pageType !== 'detail'" href="javascript:;" class="aui-btn_border card-btn gray" @click="toggleCardBlock($event)">
                {{isShowCard|cardBtnText}}
                <span class="icon-arrow2" :class="[isShowCard?'up':'down']"></span>
            </a>
            <!-- 尾款待支付，20181017：订单详情页不显示 -->
            <span v-if="trade.status=='WAIT_BUYER_PAY'&&trade.bizType==='ENDPAY' &&pageType !== 'detail'">
                 {{trade|endpayTimeTips('date')|dateFormat('MM月dd日hh:mm')}} {{trade|endpayTimeTips}}
            </span>
            <a v-if="isImShow" href="javascript:;" class="aui-btn_border gray" @click="openImFn()">
                联系客服
            </a>
            <a v-if="trade.status=='TRADE_BUYER_SIGNED' || trade.status=='TRADE_CLOSED' || trade.status=='TRADE_CLOSED_BY_USER'" href="javascript:;" class="aui-btn_border gray" @click="deleteOrder(trade.id)">
                删除订单
            </a>
            <a v-if="trade.canCancelTrade" href="javascript:;" class="aui-btn_border gray" @click="cancelOrder(trade.id, tradeGroupId)">
                取消订单
            </a>
            <template v-if="trade.status=='WAIT_BUYER_PAY'">
                <a v-if="trade.payCondition==='ORDER'" href="javascript:;" class="aui-btn_border" @click="payEndOrder(trade)">
                付尾款
                </a>
                <a v-if="trade.payCondition==='CASHIER'" href="javascript:;" class="aui-btn_border" @click="payOrder(tradeGroupId, trade.id)">
                付款
                </a>
            </template>
            <a v-if="isLogisticsShow" href="javascript:;" class="aui-btn_border" :class="{gray: trade.extType !== 'JD'}" @click="logistics(trade)">
                查看物流
            </a>
            <a v-if="trade.status=='WAIT_BUYER_CONFIRM_GOODS' && trade.extType !== 'JD'" href="javascript:;" class="aui-btn_border" @click="confirmOrder(trade.id)">
                确认收货
            </a>
            <!--   <a v-if="trade.status=='WAIT_PAY_RETURN' && trade.audit != 'audit'" href="javascript:;" class="aui-btn_border" @click="submitOrder(trade.baseLimitStatus, trade.id)">
                待提交
            </a> -->
        </div>
        <template v-if="trade.extType === 'CARD' && pageType !== 'detail'">
            <div v-show="isShowCard" class="card top-line" ref="cardListBox">
                <div class="card__tips">请长按下方数字进行复制</div>
                <div class="top-line card__content" v-for="(i, index) in trade.cards">
                    <p><em>卡号{{index+1}}：</em>&nbsp; {{i.cardNumber}}
                    </p>
                    <p><em>卡密：</em>&nbsp; {{i.cardPwd}}
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { openIm } from 'src/libs/im'
import { AXD } from 'libs/util'
import * as orderAction from 'src/store/modules/order'
// import { getPaymentParams, openPayment, paymentResult } from 'src/module/trade/common/assets/order'
import { getPaymentParamsV3, openPaymentV3, paymentResultV3 } from 'src/module/trade/common/assets/order_multi'

export default {
    name: 'orderFooter',
    filters: {
        endpayTimeTips(value, type = 'str') {
            let { payStartTime, payEndTime } = value
            if (value.payCondition === 'WAIT') {
                return type === 'date' ? payStartTime : '开始 支付尾款'
            }
            return type === 'date' ? payEndTime : '前支付'
        },
        cardBtnText(isShow) {
            return isShow ? '收起卡密' : '查看卡密'
        }
    },
    props: {
        shop: Object,
        pageType: String,
        tradeGroupId: String,
        tids: String,
        payChannel: String,
        shopLength: Number
    },

    data() {
        return {
            isShowCard: false,
            contentElem: document.querySelector('.aui-content')
        }
    },
    computed: {
        trade() {
            return this.shop.trade
        },
        isImShow() {
            return this.trade.status === 'WAIT_SELLER_SEND_GOODS' || (this.pageType === 'detail' && this.shopLength == 1)
        },
        isLogisticsShow() {
            let {
                logisticList
            } = this.trade
            return logisticList && logisticList.length > 0
        }
    },
    methods: {
        logistics(trade) {
            let { logisticList, id, packageNum } = trade
            if (packageNum === 1) {
                this.$router.push({
                    path: '/pages/order/express',
                    query: {
                        id: logisticList[0].id
                    }
                })
            } else {
                this.$router.push({
                    path: '/pages/order/logisticsList',
                    query: {
                        tid: id
                    }
                })
            }
        },
        goIndex() {
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goPage',
                    params: {
                        page: 'root', // 原生页面标识
                        loginFirst: false, // 是否需要先登录再跳转
                        closeToRoot: true, // 返回（或者关闭）至首页
                        rootPage: 0 // 当需要返回至首页时标识具体的首页页面0:商城首页1:专题3:取现4:我的,
                    }
                })
            } else {
                window.location.href = '/pages/put/index'
            }
        },
        openImFn(item) {
            this.$router.push('/pages/help/contact')
            // if (!this.isApp) {
            //     window.location.href = aixuedai.appDownloadUrl
            //     return false
            // }
            // AXD.util.isLogin(false).then(() => {
            //     let productId = this.shop.orders[0].productId
            //     let merchantId = this.shop.trade.strMerchantId
            //     let params = {
            //         productId,
            //         merchantId
            //     }
            //     // 打开客服
            //     openIm(params)
            // }, () => {
            //     // 未登录
            //     AXD.util.login()
            // })
        },
        deleteOrder(id) {
            let me = this
            orderAction.deleteOrder({
                tid: id
            }).then(res => {
                if (res.success) {
                    me.$_toast('删除成功')
                    setTimeout(function() {
                        me.$emit('refreshInit')
                    }, 1000)
                } else {
                    me.$_toast(res.resultDes)
                }
            })
        },
        cancelOrder(tId, gId) {
            let me = this
            orderAction.cancelOrder({
                tids: this.tids,
                gid: this.tradeGroupId
            }).then(res => {
                if (res.success) {
                    me.$_toast('取消成功')
                    setTimeout(function() {
                        me.$emit('refreshInit')
                    }, 1000)
                } else {
                    me.$_toast(res.resultDes)
                }
            })
        },
        submitOrder(url, id) {
            if (this.isApp) {
                window.location.href = url || '/app/activity/page.html?type=selectcredit&op=trade_' + id
            } else {
                this.$_toast({
                    txt: '请下载招集令app完成后续认证',
                    callback() {
                        window.location.href = aixuedai.appDownloadUrl
                    }
                })
            }
        },
        payEndOrder(trade) {
            orderAction.getEndOrderInfo({
                tid: trade.id
            }).then(({ success, result, resultDes = '' }) => {
                if (success && result) {
                    this.$router.push({
                        name: 'tradeConfirm',
                        query: {
                            data: JSON.stringify([result])
                        }
                    })
                    return
                }
                this.$_toast(resultDes)
            })
        },
        payOrder(gId, tId) {
            // 如果是购物车2.0以上
            // if (this.payChannel === 'AICAI_PAY_V2') {
            // 获取收银台参数 v3
            getPaymentParamsV3.call(this, gId, tId)
                .then(res => {
                    // 唤起收银台
                    return openPaymentV3.call(this, res)
                }).then(res => {
                    // 支付结果处理
                    paymentResultV3.call(this, res, gId, tId)
                })
            // } else {
            //     // 获取收银台参数 v2
            //     getPaymentParams.call(this, { gid: gId }, tId)
            //         .then(res => {
            //             // 唤起收银台
            //             return openPayment.call(this, res)
            //         }).then(res => {
            //             // 支付结果处理
            //             paymentResult.call(this, res, gId, tId)
            //         })
            // }
        },
        confirmOrder(id) {
            let me = this
            orderAction.confirmOrder({
                tid: id
            }).then(res => {
                if (res.success) {
                    me.$_toast('确认收货成功')
                    setTimeout(function() {
                        me.$emit('refreshInit')
                    }, 1000)
                } else {
                    me.$_toast(res.resultDes)
                }
            })
        },
        toggleCardBlock(e) {
            this.isShowCard = !this.isShowCard
            let ltPercent = (e.clientY / window.innerHeight) < 0.8
            // 隐藏按钮或者点击偏上 不做处理
            if (!this.isShowCard || ltPercent) {
                return
            }
            this.$nextTick(() => {
                this.contentElem.scrollTop += e.clientY / 2
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';

@import '../style.scss';

.order-btn-group {
    position: relative;
    padding: 0 px2rem(32);
    height: px2rem(120);
    background-color: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .aui-btn_border {
        vertical-align: px2rem(120);
        margin-left: px2rem(20);
        width: px2rem(170);
        height: px2rem(60);
        font-size: px2rem(26);
        line-height: px2rem(60);
        color: var(--auiButtonTextColor);
        border-color:  var(--auiColorPrimary);
        background-color: var(--auiColorPrimary);
    }

    .gray {
        color: #474747;
        border-color: #E4E4E4;
        background-color: #fff;
    }
}

.card {
    width: 100%;
    background-color: #fff;
    padding-left: px2rem(32);

    .card__tips {
        line-height: px2rem(90);
        font-size: px2rem(26);
    }

    .card__content {
        padding: px2rem(26) 0;
        font-size: px2rem(28);

        em {
            display: inline-block;
            width: px2rem(82);
            font-style: normal;
            color: #666;
            font-size: px2rem(24);
            white-space: nowrap;
        }
    }
}

.card-btn {
    padding: 0 px2rem(20);
    width: auto !important;
}

.icon-arrow2 {
    display: inline-block;
    font-size: px2rem(22);
    font-weight: 700;
    transition: transform .5s;

    &:before {
        color: #f99e00;
    }

    &.down {
        transform: scale(0.7) rotate(90deg)
    }

    &.up {
        transform: scale(0.7) rotate(270deg)
    }
}

.top-line {
    position: relative;

    &::after {
        position: absolute;
        top: 0;
        content: '';
        width: 100%;
        height: 1px;
        background-color: #E4E4E4;
        margin: auto;
        @include onepxline();
    }
}
</style>
