<template lang="html">
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"> </hybrid-header>
            <template v-if="showDetail">
            <div class="aui-content">
                <div class="info mt20">
                    <div class="title">
                        借款金额(元)
                    </div>
                    <div class="money">
                        {{amtLoan | formatMoneyK}}
                    </div>
                </div>
                <div class="order-item-box ">
                    <div>分期数</div>
                    <div>{{stages}}期</div>
                </div>
                <div class="order-item-box ">
                    <div>消费用途</div>
                    <div>{{loanReason}}</div>
                </div>
                <div class="mismatch-item-tips mb20">
                    <span>
                        本笔借款智能匹配为2笔订单，详情如下：
                    </span>
                </div>
                <div class="detail">
                    <div v-for="(item,key) in orders" :key="key">
                        <div class="order-item-header">
                            <span :class="'fl icon'+key"></span>
                            <span :class="'fr text'">{{item.status |formatStatus}}</span>
                        </div>
                        <div class="order-item-list">
                            <ul>
                                <li>
                                    <span>订单号</span>
                                    <span>{{item.id}}</span>
                                </li>
                                <li>
                                    <span>借款金额</span>
                                    <span>{{item.amt | formatMoneyK}}元</span>
                                </li>
                                <li>
                                    <span>分期数</span>
                                    <span>{{item.stages}}期</span>
                                </li>
                                <li>
                                    <span>手续费</span>
                                    <span>{{item.handlerServicesFee | formatMoneyK}}元</span>
                                </li>
                                <li>
                                    <span>服务费</span>
                                    <span>{{item.manageServicesFee | formatMoneyK}}元</span>
                                </li>
                                <li>
                                    <span>优惠</span>
                                    <span>0元</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            </template>
        </div>
    </div>
</template>
<script>
import * as orderAction from 'src/store/modules/order'
import { formatMoneyK, formatMoney } from 'src/libs/util'
export default {
    name: 'goodsCashDetail',
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
            amtLoan: '0', // 借款总金额
            stages: 0, // 总期数
            loanReason: '', // 借款原因
            merchant: null,
            logistics: null,
            trade: {},
            IMtype: 'callphone',
            sdkParams: {},
            // realPayment: 0,
            // getloanDetailList
            showDetail: false
        }
    },
    filters: {
        formatMoneyK,
        formatStatus(code, audit) {
            let status = {
                '0': '待提交',
                '1': '待审核',
                '2': '审核通过',
                '3': '审核拒绝',
                '4': '提现中',
                '5': '已提现',
                '6': '提现失败',
                '7': '已还款',
                '9': '已退款',
                '11': '待面签'
            }[code]
            return status
        },
        formatRecharge(url, rechargeImg) {
            let imgUrl = (url.indexOf('话费') > -1) ? rechargeImg : url
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
            orderAction.getloanDetailList({
                loanId: this.$route.query.loanId
            }).then(res => {
                if (res.success) {
                    this.orders = res.result.childLoanDetails
                    this.amtLoan = res.result.amtLoan
                    this.stages = res.result.stages
                    this.loanReason = res.result.loanReason
                    this.showDetail = true
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.info {
    border-radius: px2rem(12);
    background-color: #fff;
    height: px2rem(300);
    .title {
        text-align: center;
        font-size: px2rem(28);
        padding: px2rem(50);
    }
    .money {
        font-size: px2rem(120);
        color: $auiTextColorImportant;
        line-height: px2rem(140);
        width: 100%;
        text-align: center;
    }
}
.order-item-box {
    @include hairline(top);
    background-color: #fff;
    padding: 0 px2rem(30);
    height: px2rem(100);
    line-height: px2rem(100);
    font-size: px2rem(28);
    &>div:nth-child(1) {
        float: left;
        color: #222;
        line-height: inherit;
    }
    &>div:nth-child(2) {
        line-height: inherit;
        float: right;
        color: #999;
    }
}
.mismatch-item-tips {
    background: #FFF7D8;
    height:px2rem(70);
    span {
        display: inline-block;
        width: 100%;
        text-align: left;
    }
    line-height: px2rem(70);
    color: #ffb626;
    font-size: px2rem(28);
    padding-left: px2rem(30)
}
.detail {
    padding: 0 px2rem(20);
    .order-item-header {
        height: px2rem(100);
        background-color: #fff;
        line-height: px2rem(100);
        .text {
            font-size: px2rem(30);
            color:#222;
            padding-right: px2rem(20);
        }
        .icon0 {
            position: relative;
            top: px2rem(30);
            left: px2rem(20);
            width: px2rem(90);
            height: px2rem(40);
            @include img2x( '../img/tagA-1');
            background-size: 100% 100%;
        }
        .icon1 {
            position: relative;
            top: px2rem(30);
            left: px2rem(20);
            width: px2rem(90);
            height: px2rem(40);
            @include img2x( '../img/tagA-2');
            background-size: 100% 100%;
        }
    }
    .order-item-list{
        margin-bottom: px2rem(20);
        padding: px2rem(40) px2rem(32);
        background-color: #fff;
        @include hairline(top);
        ul{
            li{
                height: px2rem(28);
                line-height: px2rem(28);
                font-size: $auiFontSizeLevel5;
                margin-bottom: px2rem(30);
                &:last-child{
                    margin-bottom: 0;
                }
                span{
                    color:$auiTextColorAssistant;
                }
                span:nth-child(2){
                    float: right;
                }
            }
        }
    }
}
</style>
