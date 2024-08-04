<template lang="html">
    <div class="container" id="container">
        <div class="aui-page">
            <hybrid-header :config="barConfig"> </hybrid-header>
            <template v-if="showDetail">
            <div class="aui-content">
                <div class="order-tips-box">
                    <div class="row">
                        <div class="inline"> <img class="ico-ckeck-img" src="./../img/icon-suc.png" /></div>
                        <div class="inline">
                            <p class="p1"> {{orderStatus.text1}}</p>
                            <p class="p2">{{orderStatus.text2}}
                            </p>
                        </div>
                    </div>
                    <div  class="order-step-box">
                        <img :src="orderStatus.image" alt="">
                    </div>
                </div>
                <div class="order-item-box ">
                    <div>订单类型</div>
                    <div>{{$route.query.type | filterType}}</div>
                </div>
                <div class="order-item-box ">
                    <div>订单号</div>
                    <div>{{orders.loanId}}</div>
                </div>
                <div class="order-item-box ">
                    <div>借款时间</div>
                    <div>{{orders.createTime}}</div>
                </div>
                <div class="order-item-box ">
                    <div>借款金额</div>
                    <div>{{orders.amtLoan | formatMoneyK}}元</div>
                </div>
                <div class="order-item-box " v-if="$route.query.type === '202070'&& orders.amtDeposit">
                    <div>保证金</div>
                    <div>{{orders.amtDeposit | formatMoneyK}}元</div>
                </div>
                <div class="order-item-box ">
                    <div>月供详情</div>
                    <div>{{orders.monthPay | formatMoneyK}}元</div>
                </div>
                <div class="order-item-box ">
                    <div>{{orders.loanProvider === 'haier' ? '担保手续费' : '手续费'}}</div>
                    <div>{{(orders.handlerService || 0) | formatMoneyK}}元</div>
                </div>
                <div class="order-item-box ">
                    <div>分期数</div>
                    <div>{{orders.period}}期</div>
                </div>
                <div class="order-item-box ">
                    <div>消费用途</div>
                    <div>{{orders.loanReason}}</div>
                </div>
            </div>
            </template>
        </div>
    </div>
</template>
<script>
import { formatMoneyK, formatMoney } from 'src/libs/util'
import {
    getLoanDetail
} from 'store/modules/win-win/prime'
export default {
    name: 'goodsCashDetailNormal',
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
                leftAction: 'toCashBack'
            },
            rechargeImg: 'https://img.aiyoumi.com/static/img/201711/02112824647.jpg',
            orders: {},
            orderStatus: {
                text1: '',
                text2: '',
                statusImage: ''
            },
            showDetail: false
        }
    },
    filters: {
        formatMoneyK,
        filterType(type) {
            if (type) {
                return {
                    '202007': '嗨花订单',
                    '202070': '优资贷订单',
                    '202009': '取点花订单',
                    '202020': '天天花订单',
                    '202060': '抱米花',
                    '202080': '教育培训订单'
                }[type]
            } else {
                return '极速取现订单'
            }
        }
    },
    created() {
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
                        window.location.href = 'zjl://WebView/hideCloseButton'
                    }
                })
            }
        },
        transResult(status, type) {
            if (type == '202009') {
                switch (status) {
                    case '1':
                    case '3':
                    case '8':
                    case '9':
                        this.orderStatus = {
                            text1: '放款中',
                            text2: '您的订单已审核通过，银行放款中',
                            image: require('./../img/111.png')
                        }
                        break
                    case '2':
                        this.orderStatus = {
                            text1: '交易关闭',
                            text2: '抱歉！由于资金端放款失败，您的订单已关闭。',
                            image: require('./../img/555.png')
                        }
                        break
                    case '7':
                        this.orderStatus = {
                            text1: '交易关闭',
                            text2: '抱歉！当前您的信用有待提高，订单审核失败已关闭。',
                            image: require('./../img/555.png')
                        }
                        break
                    case '10':
                    case '12':
                        this.orderStatus = {
                            text1: '交易关闭',
                            text2: '抱歉！由于资金端放款失败，您的订单已关闭。',
                            image: require('./../img/555.png')
                        }
                        break
                    case '4':
                        this.orderStatus = {
                            text1: '已到账',
                            text2: '您的借款到账啦，赶紧去花吧！',
                            image: require('./../img/666.png')
                        }
                        break
                    case '5':
                        this.orderStatus = {
                            text1: '还款完成',
                            text2: '借款已还清，为自己的信用加分，赞！',
                            image: require('./../img/444.png')
                        }
                        break
                    case '6':
                        this.orderStatus = {
                            text1: '审核中',
                            text2: '您的订单正等待审核，后续将直达银行，请耐心等待',
                            image: require('./../img/222.png')
                        }
                        break
                    case '11':
                        this.orderStatus = {
                            text1: '待提交',
                            text2: '您的订单正等待审核，后续将直达银行，请耐心等待',
                            image: require('./../img/333.png')
                        }
                        break
                    case '99':
                        this.orderStatus = {
                            text1: '已冻结',
                            text2: ''
                        }
                        break
                }
            } else {
                switch (status) {
                    case '1':
                        this.orderStatus = {
                            text1: '审核中',
                            text2: '您的订单正等待审核，后续将直达银行，请耐心等待',
                            image: require('./../img/222.png')
                        }
                        break
                    case '2':
                    case '4':
                        this.orderStatus = {
                            text1: '放款中',
                            text2: '您的订单已审核通过，银行放款中',
                            image: require('./../img/111.png')
                        }
                        break
                    case '3':
                        this.orderStatus = {
                            text1: '交易关闭',
                            text2: '抱歉！当前您的信用有待提高，订单审核失败已关闭。',
                            image: require('./../img/555.png')
                        }
                        break
                    case '6':
                    case '9':
                        this.orderStatus = {
                            text1: '交易关闭',
                            text2: '抱歉！由于资金端放款失败，您的订单已关闭。',
                            image: require('./../img/555.png')
                        }
                        break
                    case '5':
                        this.orderStatus = {
                            text1: '已到账',
                            text2: '您的借款到账啦，赶紧去花吧！',
                            image: require('./../img/666.png')
                        }
                        break
                    case '7':
                        this.orderStatus = {
                            text1: '还款完成',
                            text2: '借款已还清，为自己的信用加分，赞！',
                            image: require('./../img/444.png')
                        }
                        break
                    case '11':
                        this.orderStatus = {
                            text1: '待提交',
                            text2: '您的订单正等待审核，后续将直达银行，请耐心等待',
                            image: require('./../img/333.png')
                        }
                        break
                    case '99':
                        this.orderStatus = {
                            text1: '已冻结',
                            text2: ''
                        }
                        break
                }
            }
        },
        getOrderInfo() {
            getLoanDetail({
                loanId: this.$route.query.loanId,
                oidBiz: this.$route.query.type
            }).then(res => {
                if (res.success) {
                    this.transResult(res.result.status, this.$route.query.type)
                    this.orders = res.result
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
.order-tips-box {
    margin: px2rem(20) 0;
    padding: px2rem(40) px2rem(20);
    background: #fff;
    .inline {
        display: inline-block;
        &:nth-child(1) {
            width: 10%;
            text-align: center;
            position: relative;
            top: px2rem(-10);
            left: px2rem(10);
        }
        .p1 {
            font-size: px2rem(40);
            color: #5db826;
            margin-bottom: px2rem(10);
        }
        .p2 {
            color: #666;
            font-size: px2rem(24);
        }
    }
    .ico-ckeck-img {
        width: px2rem(50);
        height: px2rem(50)
    }
    .order-step-box {
        width: 100%;
        padding-top: px2rem(40);
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: px2rem(600)
        }
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
/*.mismatch-item-tips {*/
    /*background: #FFF7D8;*/
    /*height:px2rem(70);*/
    /*span {*/
        /*display: inline-block;*/
        /*width: 100%;*/
        /*text-align: left;*/
    /*}*/
    /*line-height: px2rem(70);*/
    /*color: #ffb626;*/
    /*font-size: px2rem(28);*/
    /*padding-left: px2rem(30)*/
/*}*/
</style>
