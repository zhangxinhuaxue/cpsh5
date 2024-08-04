<template>
    <div class="order-shop_bd " :class="{'order-shop_bd-detail':pageType === 'detail'}">
        <template v-for="(item, index) in shop.orders">
            <div class="order-product" :class="[pageType === 'detail'? 'order-product-detail ':'']" @click="goDetail(tradeGroupId, tids, item.productId, item.extType)">
                <span class="order-product_hd" :style="{backgroundImage: 'url(' + formatImgLocal(item.imgThumb) + ')'}"></span>
                <div class="order-product_bd">
                    <p class="product-title">{{item.productName}}
                        <span v-if="item.extType == 'MOVIE'" class="cc9">({{item.skuPropertiesName | jsonParse('hallType')}})</span>
                    </p>
                    <p class="product-sku" v-for="i in skuFormat(item.skuPropertiesName,item.extType)">
                        {{i}}
                    </p>
                    <span v-if="item.bizType==='PRESELL'||item.bizType==='ENDPAY'" class="presale-tag">预售</span>
                </div>
                <div class="order-product_ft">
                    <p v-if="item.price" class="product-price" v-html="'¥' + complexMoney(item.price, 100, true, true)"></p>
                    <p v-if="item.num" class="product-number">X{{item.num}}</p>
                    <p v-if="pageType !== 'detail' && Number(item.feedback)" class="product-feedback">{{item.feedback | refundType}}</p>
                    <a v-if="pageType === 'detail' && refundBtn[index].isShow" href="javascript:;" class="aui-btn_border " :class="{'aui-btn_disabled':refundBtn[index].isShowReund}"  @click.prevent.stop="refundOrder(shop.trade, item, index)">
                            {{refundBtn[index].btnText}}
                    </a>
                </div>
            </div>
            <slot name="presaleInfo" :orderId="item.id"></slot>
        </template>
        <actionsheets-list :list="selectList" @complete="choosePop" :isPop="isPop" :isShowBtn="true"></actionsheets-list>
    </div>
</template>
<script>
import * as orderAction from 'src/store/modules/order'
import axdDialog from 'components/dialog/index'
import actionsheetsList from 'components/actionsheets/list.vue'
import axdAlert from 'components/alert/index'
import { openIm } from 'src/libs/im'
import { appDownloadUrl, formatImg, AXD } from 'src/libs/util'

export default {
    name: 'shop-bd',
    props: ['shop', 'pageType', 'tradeGroupId', 'tids'],
    filters: {
        jsonParse(str, k) {
            let obj = JSON.parse(str)
            return obj[k]
        },
        refundType(code) {
            let refundInfo = ''
            switch (Number(code)) {
                case 107:
                    refundInfo = '退款关闭'
                    break
                case 110:
                    refundInfo = '退款成功'
                    break
                default:
                    refundInfo = '退款中'
            }
            return refundInfo
        }
    },
    data() {
        return {
            refundBtn: [],
            trade: null,
            isPop: false,
            selectList: {}
        }
    },
    components: {
        actionsheetsList
    },
    created() {
        if (this.pageType === 'detail') {
            this.trade = this.shop.trade
            this.shop.orders.forEach((item, index) => {
                this.refundBtn.push({
                    isShow: false,
                    canCheck: true,
                    btnText: '退款',
                    url: '/app/refund/index?orderId=' + item.id,
                    tipText: '您有退款处理中，具体情况请咨询客服'
                })
                this.getRefundInit(item.feedback, item, index) // 退款按钮初始化
            })
        }
    },
    methods: {
        skuFormat(value, type) {
            if (type === 'MOVIE') {
                // 电影票
                let obj = JSON.parse(value)
                let item1 = `${obj['cinemaName']}(${obj['cinemaAddress']})`
                return [item1, obj['moviePlayTime'], obj['seatName']]
            }
            return [value]
        },
        formatImgLocal(url) {
            let rechargeImg = 'https://img.aiyoumi.com/static/img/201711/02112824647.jpg'
            return (url.indexOf('话费') > -1) ? formatImg(rechargeImg, 75, 160) : formatImg(url, 75, 160)
        },
        goDetail(gId, tId, pId, extType) {
            if (this.pageType === 'detail') {
                if (extType === 'PAYFEE' || extType === 'MOVIE' || extType === 'ENSURE') {
                    return false
                } else if (extType === 'VIPPLUS') {
                    // A+会员卡则跳转到A+会员卡订单页面
                    window.location.href = '/pages/vipcard'
                } else if (extType === 'LOANPASS') {
                    // A+会员卡则跳转到A+会员卡订单页面
                    window.location.href = '/pages/mall/passcard?type=passcard'
                } else {
                    window.location.href = '/mall/product/detail.html?productId=' + pId
                }
            } else {
                // 权益不可查看详情
                if (extType === 'RIGHTS_PACKAGE') {
                    return false
                }
                this.$router.push({
                    name: 'orderGoodsDetail',
                    query: {
                        gId,
                        tId
                    }
                })
            }
        },
        choosePop(item, index) {
            this.isPop = false
            if (item !== undefined) {
                window.location.href = item.url
            }
        },
        getActionSheetList(list, prefix) {
            return list.map(({ optionName, orderId }) => ({
                name: optionName,
                url: prefix + orderId,
                orderId
            }))
        },
        refundOrder(trade, item, index) {
            let orderId = item.id

            // h5直接跳转下载app
            if (!this.isApp) {
                window.location.href = appDownloadUrl
                return false
            }
            if (this.refundBtn[index].isShowReund) {
                axdAlert({
                    content: this.refundBtn[index].refundText,
                    okText: '确定',
                    onOk: () => {

                    }
                })
                return
            }
            let me = this
            if (trade.extType == 'JD') {
                orderAction.refundJD({
                    orderId
                }).then(res => {
                    if (res.success) {
                        window.location.href = '/app/refund/index?orderId=' + orderId
                    } else {
                        let warnMsg = res.resultDes
                        axdDialog({
                            title: '温馨提示',
                            content: warnMsg,
                            buttons: [{
                                text: '取消'
                            }, {
                                text: '联系客服',
                                onClick: function() {
                                    me.openImFn()
                                }
                            }]
                        })
                    }
                })
            } else {
                if (this.refundBtn[index].canCheck) {
                    if (this.refundBtn[index].isShowActionsheet) {
                        let detailList = this.getActionSheetList(item.orderOptions, this.refundBtn[index].url)
                        this.selectList = {
                            title: '',
                            list: detailList
                        }
                        this.isPop = true
                    } else {
                        window.location.href = this.refundBtn[index].url
                    }
                } else {
                    this.$_toast(this.refundBtn[index].tipText)
                }
            }
        },
        getRefundInit(feedback, item, index) {
            let orderId = item.id

            let status = '退款中'
            let tipText = '您有退款处理中，具体情况请咨询客服'
            switch (feedback * 1) {
                case 0:
                    status = '退款'
                    break
                case 110:
                    status = 'TRADE_REFUND'
                    status = '退款成功'
                    tipText = '您的退款已处理成功'
                    break
                case 107:
                    status = '退款关闭'
                    tipText = '您的退款流程已关闭'
                    break
            }
            let refundBtn = this.refundBtn[index]
            refundBtn.btnText = status
            refundBtn.tipText = tipText
            // h5直接跳转下载app
            if (!this.isApp) {
                if (this.trade.status === 'WAIT_SELLER_SEND_GOODS' || this.trade.status === 'TRADE_BUYER_SIGNED' || this.trade.status === 'WAIT_BUYER_CONFIRM_GOODS') {
                    refundBtn.isShow = true // h5下按钮一直显示
                }
                return false
            }

            orderAction.showRefund({
                orderId
            }).then(res => {
                if (res.success && res.result) {
                    let data = res.result
                    if (data.isApply) { // 退款按钮是否显示
                        refundBtn.isShow = true
                    } else if (data.isAutoRefund === 'y' && data.refundId) { // 自助发起退款
                        if (item.orderOptions && item.orderOptions.length > 1) {
                            refundBtn.isShowActionsheet = true
                            refundBtn.url = '/app/refund/detail?refundId=' + data.refundId + '&orderId='
                        } else {
                            refundBtn.url = '/app/refund/detail?refundId=' + data.refundId + '&orderId=' + orderId
                        }
                        refundBtn.isShow = true
                    } else if (data.isAutoRefund === null || data.isAutoRefund === 'n') { // 由客服cps后台发起退款
                        refundBtn.canCheck = false
                        refundBtn.isShow = true
                    } else {
                        refundBtn.isShow = false
                    }
                    // isShowReund --- 是否置灰
                    let { isShowReund = false, refundText = '' } = data.showRefund || {}
                    Object.assign(refundBtn, {
                        isShowReund,
                        refundText
                    })
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        openImFn() {
            if (!this.isApp) {
                window.location.href = aixuedai.appDownloadUrl
                return false
            }
            AXD.util.isLogin(false).then(() => {
                // 连接平台客服
                let params = {
                    productId: '',
                    merchantId: ''
                }
                // 打开客服
                openIm(params)
            }, () => {
                // 未登录
                AXD.util.login()
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.cc9 {
    color: #666;
}

.order-product {
    position: relative; // padding: px2rem(20) px2rem(32);
    padding: px2rem(30);
    display: flex;
    justify-content: space-between;

    .order-product_hd {
        flex: none;
        display: block;
        width: px2rem(160);
        height: px2rem(160);
        background-color: #fff;
        background-size: 100% auto;
        background-repeat: no-repeat;
    }

    .order-product_bd {
        padding-left: px2rem(20);
        flex: 1;
        position: relative;

        .product-title {
            @include nLineLimit(2);
            font-size: px2rem(26);
            line-height: 125%;
            color: #222;
        }

        .product-sku {
            @include nLineLimit(2);
            /*position: absolute;
            top: px2rem(60);
            left: 0;*/
            font-size: px2rem(24);
            color: #999999;
            padding-top: px2rem(6);
        }

        .presale-tag {
            display: inline-block;
            min-width: px2rem(56);
            text-align: center;
            padding: 0 px2rem(12);
            margin-top: px2rem(4);
            font-size: px2rem(20);
            color: #fff;
            background: #8C50FF;
            border-radius: px2rem(16);
        }
    }

    .order-product_ft {
        // position: relative;
        text-align: right;

        .product-number {
            // position: absolute;
            margin-top: px2rem(20); // right: 0;
            font-size: px2rem(24);
            color: #999;
        }

        .product-feedback {
            margin-top: px2rem(80);
            font-size: px2rem(26);
            color: #FFB626;
        }
    }

    .aui-btn_border {
        // position: absolute;
        // right: px2rem(32);
        // bottom: px2rem(40);
        margin-top: px2rem(30);
        width: px2rem(170);
        height: px2rem(60);
        line-height: px2rem(60);
        text-align: center;
        font-size: px2rem(26);
        color: #474747;
        border-color: #E4E4E4;
    }

    .aui-btn_disabled {
        border: none;
        background-color: #f2f2f2;
        color: #ccc;
    }

    &::after {
        position: absolute;
        bottom: 0;
        left: px2rem(53);
        content: '';
        width: px2rem(645);
        height: 1px;
        background-color: #E4E4E4;
        margin: auto;
        @include onepxline();
    }

    &:last-child:after {
        background-color: transparent;
    }
}

.order-shop_bd-detail {
    overflow-x: hidden;

    div:last-of-type:after {
        left: px2rem(32);
        width: 100%; // background-color: transparent;
    }
}

.order-shop_bd-detail {
    position: relative;

    /*border-top: 1px solid #E4E4E4;*/
    &::before {
        position: absolute;
        top: 0;
        left: 0;
        content: '';
        width: 100%;
        height: 1px;
        background-color: #E4E4E4; // margin: auto;
        @include onepxline();
        z-index: 9;
    }

    &::after {
        position: absolute;
        bottom: 0;
        left: px2rem(32);
        content: '';
        width: px2rem(718);
        height: 1px;
        background-color: #E4E4E4;
        margin: auto;
        @include onepxline();
    }

    .order-product-detail {

        background-color: #fff; // height: px2rem(247);

        &:after {
            left: px2rem(180);
            width: px2rem(570);
        }
    }
}
</style>
