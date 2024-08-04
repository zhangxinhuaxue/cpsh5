<template lang="html">
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"> </hybrid-header>
            <template v-if="showDetail">
                <div class="aui-fixedbottom">
                    <a v-if="refundBtn.isShow" href="javascript:;" class="aui-btn_small-bg weaken" @click="refundOrder()">{{refundBtn.btnText}}</a>
                    <a href="javascript:;" class="aui-btn_small-bg weaken" @click="openImFn">联系客服</a>
                </div>
                <div class="aui-content">
                    <div class="statusBar" :class="(trade.status=='TRADE_CLOSED' || trade.status=='TRADE_CLOSED_BY_USER') ? 'grey' : 'primary'">
                        {{trade.status | formatStatus(trade.audit)}}
                    </div>
                    <div class="aui-cells mb20" v-if="logistics">
                        <router-link class="aui-cell aui-cell_access" :to="'/pages/order/express?id='+logistics.id">
                            <div class="aui-cell__bd">
                                <p>{{logistics.companyName}} {{logistics.status}}</p>
                                <p class="c-9">{{logistics.outId}}</p>
                            </div>
                            <div class="aui-cell__ft"></div>
                        </router-link>
                    </div>
                    <div class="express aui-cols" v-if="trade">
                        <div class="icon"></div>
                        <div class="aui-col-1">
                            <div>{{trade.recvName}} {{trade.recvCellphone}}</div>
                            <div class="c-9 mt10">{{trade.recvProvince}}{{trade.recvCity}}{{trade.recvCounty}}{{trade.recvAddress}}</div>
                        </div>
                    </div>
                    <div class="detail">
                        <div v-for="(item, index) in orders" :key="index" class="item aui-cols" @click="goProductDetail(item.productId)">
                            <div class="preview">
                                <img :src="item.imgThumb | formatRecharge(rechargeImg)">
                            </div>
                                <div class="aui-col-1">
                                    <div class="name">
                                        {{item.productName}}
                                    </div>
                                    <div class="tip">
                                        {{item.skuPropertiesName}}
                                    </div>
                                </div>
                                <div class="price">
                                    ￥{{item.price | toRMB(100)}}
                                    <div class="c-c">X {{item.num}}</div>
                                </div>
                            </div>
                            <div class="aui-split_line ammount">
                                <div class="aui-cols" v-if="trade.postFee>0">
                                    <div class="aui-col-1 c-9">运费</div>
                                    <div>￥{{trade.postFee | toRMB(100)}}</div>
                                </div>
                                <div class="aui-cols" v-if="coupon > 0">
                                    <div class="aui-col-1 c-9">红包</div>
                                    <div>-￥{{coupon| toRMB(100)}}</div>
                                </div>
                                <div class="aui-cols" v-if="discountedPrice > 0">
                                    <div class="aui-col-1 c-9">优惠</div>
                                    <div>-￥{{discountedPrice| toRMB(100)}}</div>
                                </div>
                                <!--
                                    <div class="aui-cols" v-if="trade.discountFee>0 || trade.cpAmt>0">
                                        <div class="aui-col-1 c-9">优惠抵扣</div>
                                        <div v-if="trade.discountFee>0">-￥{{trade.discountFee | toRMB(100)}}</div>
                                        <div v-else>-￥{{trade.cpAmt | toRMB(100)}}</div>
                                    </div>
                                -->
                                <template v-if="trade.stags && trade.stags>0">
                                    <div class="aui-cols">
                                        <div class="aui-col-1 c-9">首付金额</div>
                                        <div>￥{{trade.downPayment | toRMB(100)}}</div>
                                    </div>
                                    <div class="aui-cols">
                                        <div class="aui-col-1 c-9">分期金额</div>
                                        <div>￥{{trade.installmentFee | toRMB(100)}}</div>
                                    </div>
                                    <div class="aui-cols">
                                        <div class="aui-col-1 c-9">分期信息</div>
                                        <div>{{trade.stags}}期</div>
                                    </div>
                                    <div class="aui-cols">
                                        <div class="aui-col-1 c-9">月供(实际还款以账单为准)</div>
                                        <div>￥{{trade.monthPay | toRMB(100)}}</div>
                                    </div>
                                </template>
                                <div class="aui-cols">
                                    <div class="aui-col-1 c-9">实付款(含运费)</div>
                                    <!-- <div class="total">￥{{realPayment | toRMB(100)}}</div> -->
                                    <div class="total">￥{{trade.amount | toRMB(100)}}</div>
                                </div>
                            </div>
                        </div>
                        <div class="info">
                            <div class="c-9">订单号：{{trade.id}}</div>
                            <div class="c-9">下单时间：{{trade.createTime | dateFormat}}</div>
                            <div class="c-9">买家留言：{{trade.buyerMessage}}</div>
                        </div>
                    </div>
            </template>
        </div>
    </div>
</template>
<script>
import * as orderAction from 'src/store/modules/order'
import { getImMerchantInfo } from 'src/store/modules/trade/product'
import { getMerchantInfoByKey } from 'src/module/common/assets/im-info'
import { loadInit, openIm, newSobotIm } from 'src/libs/im'
import { AXD, appDownloadUrl } from 'src/libs/util'
// import { goBasicAuth } from 'src/module/trade/common/assets/order'
import axdDialog from 'components/dialog/index'
import { goBiopsyBankcard } from '../common/biopsyBack'
export default {
    name: 'goodsOrderDetail',
    data() {
        return {
            barConfig: {
                app: {
                    visible: false
                },
                h5: {
                    rightBtnShow: false,
                    enforce: true
                }
            },
            rechargeImg: 'https://img.aiyoumi.com/static/img/201711/02112824647.jpg',
            orders: [],
            merchant: null,
            logistics: null,
            trade: {},
            IMtype: 'callphone',
            sdkParams: {},
            // realPayment: 0,
            refundBtn: {
                isShow: false,
                canCheck: true,
                btnText: '退款',
                url: '/app/refund/index?orderId=' + this.$route.query.orderId,
                tipText: '您有退款处理中，具体情况请咨询客服'
            },
            showDetail: false,
            sobotUrl: ''
        }
    },
    computed: {
        coupon() {
            let { salePrice, actualPayment } = this.trade
            return salePrice - actualPayment
        },
        discountedPrice() {
            let { salePrice, payment } = this.trade
            return payment - salePrice
        }
    },
    filters: {
        formatStatus(code, audit) {
            let status = {
                WAIT_PAY_RETURN: '订单待提交',
                WAIT_BUYER_PAY: '订单待付款',
                WAIT_SELLER_SEND_GOODS: '订单待发货',
                TRADE_BUYER_SIGNED: '订单交易成功',
                WAIT_BUYER_CONFIRM_GOODS: '订单待收货',
                TRADE_CLOSED: '交易关闭',
                TRADE_CLOSED_BY_USER: '交易关闭',
                TRADE_REFUND: '付款后关闭',
                WAIT_TEAM_BUY: '拼团中'
            }[code]
            if (audit == 'audit') {
                status = '订单审核中'
            }
            return status
        },
        formatRecharge(url, rechargeImg) {
            let imgUrl = url.indexOf('话费') > -1 ? rechargeImg : url
            return imgUrl
        }
    },
    mounted() {
        this.getOrderInfo()
        this.hideAppBar()
    },
    methods: {
        hideAppBar() {
            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'configNavigationBar',
                    params: {
                        visible: false
                    },
                    callback: function(data) {
                        // window.location.href = 'zjl://WebView/hideCloseButton'
                    }
                })
            }
        },
        getOrderInfo() {
            orderAction
                .getRefundDetail({
                    orderId: this.$route.query.orderId
                })
                .then(res => {
                    if (res.success) {
                        this.orders = res.result.orders
                        this.merchant = res.result.cpsMerchantVo
                        this.logistics = res.result.logistics
                        this.trade = res.result.tradeVo
                        this.showDetail = true
                        // this.realPayment = this.trade.payment * 1 + (this.trade.postFee * 1 || 0) - (this.trade.cpAmt * 1 || 0) - (this.trade.discountFee * 1 || 0)
                        this.getRefundInit() // 退款按钮初始化
                        // 客服初始化
                        this.preloadIm()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
        },
        getRefundInit() {
            let status = '退款中'
            let tipText = '您有退款处理中，具体情况请咨询客服'
            switch (this.trade.feedback * 1) {
                case 0:
                    status = '退款'
                    break
                case 110:
                    this.trade.status = 'TRADE_REFUND'
                    status = '退款成功'
                    tipText = '您的退款已处理成功'
                    break
                case 107:
                    status = '退款关闭'
                    tipText = '您的退款流程已关闭'
                    break
            }
            this.refundBtn.btnText = status
            this.refundBtn.tipText = tipText
            // h5直接跳转下载app
            if (!this.isApp) {
                if (
                    this.trade.status === 'WAIT_SELLER_SEND_GOODS' ||
                    this.trade.status === 'TRADE_BUYER_SIGNED' ||
                    this.trade.status === 'WAIT_BUYER_CONFIRM_GOODS'
                ) {
                    this.refundBtn.isShow = true // h5下按钮一直显示
                }
                return false
            }
            orderAction
                .showRefund({
                    orderId: this.$route.query.orderId
                })
                .then(res => {
                    if (res.success && res.result) {
                        let data = res.result
                        if (data.isApply) {
                            // 退款按钮是否显示
                            this.refundBtn.isShow = true
                        } else if (data.isAutoRefund === 'y' && data.refundId) {
                            // 自助发起退款
                            this.refundBtn.url = '/app/refund/detail?refundId=' + data.refundId + '&orderId=' + this.$route.query.orderId
                            this.refundBtn.isShow = true
                        } else if (data.isAutoRefund === null || data.isAutoRefund === 'n') {
                            // 由客服cps后台发起退款
                            this.refundBtn.canCheck = false
                            this.refundBtn.isShow = true
                        }
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
        },
        refundOrder() {
            // h5直接跳转下载app
            if (!this.isApp) {
                window.location.href = appDownloadUrl
                return false
            }
            let me = this
            if (this.trade.extType == 'JD') {
                orderAction
                    .refundJD({
                        orderId: this.$route.query.orderId
                    })
                    .then(res => {
                        if (res.success) {
                            window.location.href = '/app/refund/index?orderId=' + this.$route.query.orderId
                        } else {
                            let warnMsg = res.resultDes
                            axdDialog({
                                title: '温馨提示',
                                content: warnMsg,
                                buttons: [
                                    {
                                        text: '取消'
                                    },
                                    {
                                        text: '联系客服',
                                        onClick: function() {
                                            me.openImFn()
                                        }
                                    }
                                ]
                            })
                        }
                    })
            } else {
                if (this.refundBtn.canCheck) {
                    window.location.href = this.refundBtn.url
                } else {
                    this.$_toast(this.refundBtn.tipText)
                }
            }
        },
        preloadIm() {
            if (!this.isApp) return

            // 嘉兴客服已废弃
            // loadInit(window, document, 'script', 'https://kfmcs.jiaxincloud.com/mcs.js', '_JIAXIN')

            // 获取智齿客服机器人URL
            newSobotIm(res => (this.sobotUrl = res))
        },
        openImFn() {
            if (!this.isApp) {
                window.location.href = aixuedai.appDownloadUrl
                return false
            }
            AXD.util.isLogin(false).then(
                () => {
                    let params = {
                        productId: this.orders[0].productId,
                        merchantId: this.trade.strMerchantId || ''
                    }
                    // 嘉兴客服（废弃）
                    // openIm(params)
                    // 智齿客服
                    window.location.href = this.sobotUrl
                },
                () => {
                    // 未登录
                    AXD.util.login()
                }
            )
        },
        goProductDetail(productId) {
            window.location.href = '/mall/product/detail.html?productId=' + productId
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.statusBar {
    background: $auiColorPrimary;
    padding: 0 px2rem(32);
    font-size: px2rem(30);
    line-height: px2rem(80);
    height: px2rem(80);

    &.grey {
        background: #e4e4e4;
    }
}

.aui-cell_access {
    height: auto;
}

.express {
    padding: px2rem(40) px2rem(30);
    background: #fff;
    color: #222;

    .icon {
        width: px2rem(90);
        height: px2rem(90);
        margin-right: 5px;
        background: url('../img/pin@3x.png') no-repeat center center;
        background-size: px2rem(50) px2rem(50);
    }
}

.detail {
    margin-top: px2rem(20);
    background: #fff;
    padding: 0 0 0 px2rem(32);

    .item {
        padding: px2rem(40) px2rem(32) px2rem(40) 0;
        color: #222;
        align-items: flex-start;

        .preview {
            width: px2rem(127);
            height: px2rem(127);
            border: solid 1px #e4e4e4;
            margin-right: px2rem(32);
            display: -webkit-flex;
            display: flex;
            align-items: center;

            img {
                max-width: 100%;
                max-height: 100%;
            }
        }

        .name {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .tip {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            color: $auiTextColorAssistant;
            font-size: px2rem(24);
        }

        .price {
            margin-left: px2rem(48);
            text-align: right;
        }
    }

    .ammount {
        padding: px2rem(32) px2rem(32) px2rem(32) 0;
        line-height: px2rem(47);

        .total {
            color: var(--auiTipsColor);
        }
    }
}

.info {
    margin: px2rem(20) 0;
    background: #fff;
    line-height: px2rem(47);
    padding: px2rem(32);
}

.aui-fixedbottom ~ .aui-content {
    bottom: px2rem(115);
}

.aui-fixedbottom {
    padding: 0 px2rem(32);
    height: px2rem(115);
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;

    .aui-btn_small-bg {
        line-height: px2rem(50);
        font-size: px2rem(28);
        height: px2rem(50);
        padding: 0 px2rem(24);
        margin-left: px2rem(15);
        min-width: px2rem(170);
        text-align: center;

        &.weaken {
            border: 1px solid #999;
            background: #fff;
            color: #999;
        }
    }
}
</style>
