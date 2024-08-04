<template>
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"></hybrid-header>
            <template v-if="showDetail">
                <div class="aui-fixedbottom">
                    <order-footer
                        :shop="shop"
                        :pageType="'detail'"
                        :payChannel="payChannel"
                        :tradeGroupId="group.tradeGroupId"
                        :shopLength="group.shops.length"
                        @refreshInit="refreshInit"
                    ></order-footer>
                </div>
                <div class="aui-content">
                    <!-- 订单状态 -->
                    <order-status :shop="shop" :systimeObj="systimeObj" />
                    <div
                        class="logistics"
                        v-if="trade.packageNum> 1"
                        @click="goLogisticsList(trade.id)"
                    >
                        商品被分成{{trade.packageNum}}个包裹，已发出包裹请查看物流
                        <span class="icon-arrow2"></span>
                    </div>
                    <div class="express aui-cols" v-if="trade">
                        <div class="icon"></div>
                        <!-- 话费特殊处理 -->
                        <div class="aui-col-1" v-if="trade.extType == 'RECHARGE'">
                            <div class="express_title">{{trade.recvName}} {{trade.recvAddress}}</div>
                            <div class="c-9">{{trade.recvCellphone}}</div>
                        </div>
                        <div class="aui-col-1" v-else>
                            <div class="express_title">{{trade.recvName}} {{trade.recvCellphone}}</div>
                            <div
                                class="c-9"
                            >{{trade.recvProvince}}{{trade.recvCity}}{{trade.recvCounty}}{{street}}{{trade.recvAddress}}</div>
                        </div>
                    </div>
                    <div class="order-shop" v-for="(shop, key) in group.shops" :key="key">
                        <shop-hd v-if="shop" :shop="shop" :pageType="'detail'"></shop-hd>
                        <shop-bd
                            v-if="shop"
                            :shop="shop"
                            :pageType="'detail'"
                            :tradeGroupId="group.tradeGroupId"
                        >
                            <presaleInfo
                                v-if="shop.trade.bizType==='PRESELL'||shop.trade.bizType==='ENDPAY'"
                                slot="presaleInfo"
                                slot-scope="slotProps"
                                :orderId="slotProps.orderId"
                                :isClosed="['TRADE_CLOSED','TRADE_CLOSED_BY_USER'].indexOf(shop.trade.status)>-1"
                            />
                        </shop-bd>
                        <!-- 电影票取票码 -->
                        <order-moive v-if="isMoiveSigned" :shop="shop" :systimeObj="systimeObj"></order-moive>
                        <template
                            v-if="shop.trade.bizType!=='PRESELL'&&shop.trade.bizType!=='ENDPAY'"
                        >
                            <shopAmount
                                v-if="shop.trade"
                                :trade="shop.trade"
                                :isSingleShop="group.shops.length === 1"
                            ></shopAmount>
                            <template v-if="group.shops.length > 1">
                                <orderInfo
                                    :trade="shop.trade"
                                    :isSingleShop="group.shops.length === 1"
                                ></orderInfo>
                            </template>
                            <template v-else>
                                <installment v-if="isInstallmentShow" :tradeGroup="installmentObj"></installment>
                            </template>
                        </template>
                    </div>
                    <div class="order-detail-ft" v-if="group">
                        <template v-if="group.shops.length > 1">
                            <div class="full-info">
                                <div class="aui-cols total-amount">
                                    <div class="aui-col-1 c-9">实付款</div>
                                    <span
                                        class="real-price"
                                        v-html="'¥' + complexMoney(group.tradeGroup.actualPayment, 100, true, true)"
                                    ></span>
                                </div>
                            </div>
                            <installment v-if="isInstallmentShow" :tradeGroup="installmentObj"></installment>
                        </template>
                        <template v-else>
                            <!-- <div class="loan-info" v-if="isLoanOrder">
                                <div class="title">借款订单号</div>
                                <div class="info">
                                    <p>{{loanId}}</p>
                                </div>
                            </div>-->
                            <orderInfo :trade="trade"></orderInfo>
                        </template>
                    </div>
                </div>
                <!-- 小浮标 -->
                <fixed-icon :config="trade"></fixed-icon>
            </template>
        </div>
    </div>
</template>
<script>
import { getOrderDetail } from 'src/store/modules/order'
import { getSystime } from 'store/modules/trade/product'
import { loadInit, newSobotIm } from 'src/libs/im'
import hybridHeader from 'components/header/hybridheader.vue'
import orderFooter from '../common/order-new-footer.vue'
import orderStatus from '../common/order-status.vue'
import installment from '../common/installment.vue'
import orderInfo from '../common/order-info.vue'
import shopHd from '../common/shop-hd.vue'
import shopBd from '../common/shop-bd.vue'
import orderMoive from '../common/order-moive.vue'
import shopAmount from '../common/shop-amount.vue'
import fixedIcon from '../other/fixed-icon/index.vue'
import presaleInfo from '../common/presale-info.vue'

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
                },
                leftAction: this.$route.query.source === 'cashier' ? 'toGoods' : ''
            },
            rechargeImg: 'https://img.aiyoumi.com/static/img/201711/02112824647.jpg',
            orders: [],
            IMtype: 'callphone',
            sdkParams: {},
            showDetail: false,
            group: {},
            systimeObj: null,
            loanId: '',
            type: '',
            sobotUrl: ''
        }
    },
    components: {
        hybridHeader,
        orderFooter,
        orderStatus,
        installment,
        orderInfo,
        shopHd,
        shopBd,
        orderMoive,
        shopAmount,
        fixedIcon,
        presaleInfo
    },
    created() {
        this.preloadIm()
    },
    mounted() {
        this.systimeFunction()
        this.getOrderInfo()
        this.hideAppBar()
    },
    computed: {
        payChannel() {
            try {
                let {
                    tradeGroup: { payChannel }
                } = this.group
                return payChannel
            } catch (err) {
                console.log('get payChannel err')
                return undefined
            }
        },
        shop() {
            return this.group.shops ? this.group.shops[0] : {}
        },
        trade() {
            return this.shop.trade
        },
        isMoiveSigned() {
            return this.shop.orders[0].extType === 'MOVIE' && this.trade.status === 'TRADE_BUYER_SIGNED'
        },
        // 是否为增信服务担保订单
        isLoanOrder() {
            return this.shop.orders[0].extType === 'ENSURE'
        },
        isInstallmentShow() {
            let stages = 0
            try {
                let {
                    tradeGroup: { stags }
                } = this.group
                stages = stags
            } catch (err) {
                console.log(err)
            }

            if (!stages) {
                return false
            } else {
                return Number(stages) >= 1
            }
        },
        street() {
            if (!this.trade.recvStreet) {
                return ''
            }
            return this.trade.recvStreet
        },
        installmentObj() {
            if (this.trade.status === 'WAIT_BUYER_PAY') {
                return this.group.tradeGroup
            } else {
                return this.trade
            }
        }
    },
    methods: {
        goLogisticsList(tid) {
            this.$router.push({
                path: '/pages/order/logisticsList',
                query: {
                    tid: tid
                }
            })
        },
        systimeFunction() {
            getSystime().then(res => {
                if (res.success) {
                    this.systimeObj = {
                        success: res.success,
                        serverTime: res.result
                    }
                }
            })
        },
        refreshInit() {
            this.getOrderInfo()
        },
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
            getOrderDetail({
                gid: this.$route.query.gId,
                tid: this.$route.query.tId || this.$route.query.id // 原本的虚拟跳转带的参数是id,出现特殊流程页面，无法兼容全部，所以需要加上以防万一
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    this.group = result
                    if (this.shop && this.shop.orders) {
                        let order = this.shop.orders[0]
                        this.loanId = order && order.extOrderId
                    }
                    this.showDetail = true
                } else {
                    this.$_toast(resultDes)
                }
            })
        },
        goProductDetail(productId) {
            if (this.trade.extType == 'PAYFEE') {
                return
            }
            window.location.href = '/mall/product/detail.html?productId=' + productId
        },
        preloadIm() {
            if (!this.isApp) return

            // 嘉兴客服已废弃
            // loadInit(window, document, 'script', 'https://kfmcs.jiaxincloud.com/mcs.js', '_JIAXIN')

            // 获取智齿客服机器人URL
            newSobotIm(res => (this.sobotUrl = res))
        }
        // viewLoan() {
        //     // 跳转借款详情
        //     this.$router.push({name: 'cashDetailNormal', query: {loanId: this.loanId, type: '202007'}})
        // }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.order-shop {
    margin: px2rem(20) 0;

    div:last-child {
        position: relative; // &::after {
        //     position: absolute;
        //     top: 0;
        //     left: px2rem(32);
        //     content: '';
        //     width: px2rem(718);
        //     height: 1px;
        //     background-color: #E4E4E4;
        //     margin: auto;
        //     @include onepxline();
        // }
    }
}

.order-detail-ft {
    /*margin: px2rem(20) 0;*/
    .full-info {
        position: relative;
        background-color: #fff;
        padding: px2rem(32);

        .total-amount {
            .c-9 {
                font-size: px2rem(30);
                color: #222;
            }

            .real-price {
                font-size: px2rem(34);
                color: #e31436;
            }
        }
    }
}

.aui-cell_access {
    height: auto;
}

.logistics {
    position: relative;
    line-height: px2rem(80);
    font-size: px2rem(30);
    color: #474747;
    line-height: px2rem(80);
    background: #fff;
    margin-bottom: px2rem(20);
    padding-left: px2rem(37);

    .icon-arrow2 {
        position: absolute;
        top: px2rem(10);
        right: 0;

        &::before {
            font-size: px2rem(20);
            font-weight: normal;
        }
    }
}

.express {
    padding: px2rem(26) px2rem(32);
    background: #fff;
    color: #222;
    margin-bottom: px2rem(20);

    .icon {
        width: px2rem(38);
        height: px2rem(38);
        background: url('../img/pin@3x.png') no-repeat center center;
        background-size: 100% auto;
        margin-right: px2rem(7);
    }

    .express_title {
        font-size: px2rem(30);
    }
}

.aui-fixedbottom ~ .aui-content {
    bottom: px2rem(115);
    margin-bottom: px2rem(20);
}

.aui-fixedbottom {
    height: px2rem(115);
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: flex-end;
    justify-content: flex-end;
    voerflow: hidden;

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
.loan-info {
    width: 100%;
    height: px2rem(152);
    padding: px2rem(20) px2rem(32) px2rem(15);
    background-color: #fff;
    font-size: px2rem(28);
    .title,
    .info {
        height: px2rem(58);
        line-height: px2rem(58);
    }
    .info {
        display: flex;
        justify-content: space-between;
        p:first-child {
            color: #999;
        }
        // p:last-child{
        //     color: var(--auiTipsColor);
        //     font-size: px2rem(24);
        // }
    }
}
.loan-info ~ .info {
    position: relative;
    &::before {
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        border-top: 1px solid #e4e4e4;
        transform: scaleY(0.5);
        position: absolute;
        top: 0;
        left: px2rem(32);
    }
}
</style>
