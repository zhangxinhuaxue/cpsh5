<template>
<m-page class="page__card">
    <hybrid-header slot="header" :config="barConfig" class="mui-bar_nav"></hybrid-header>
    <div class="page__content">
        <div class="card__box">
            <div class="card__title">请选择会员卡</div>
            <div class="card__list">
                <div v-for="(item, index) in vipcardList" :key="item.skuId" class="card__item" :class="{'card__item--active': index === activedVipcardIndex}" @click="activeVipcardItem(index)">
                    <div class="card__name">{{ item.cardName }}</div>
                    <div>
                        <span>￥</span><span class="card__price">{{ item.price|formatMoneyK(1)}}</span>
                    </div>
                    <div class="card__days">{{item.days}}天</div>
                </div>
            </div>
        </div>
        <div class="rights__list"></div>
    </div>
    <div slot="bottom" class="mui-fixedbottom">
        <m-cell class="cell__custom" size="small" is-link title="请选择红包" :disabled="!hasTicket" @click="selectMerchantableTicket">
            <div slot="value" :class="['ticket-desc',hasTicket?'red':'']">{{ticketDesc}}</div>
        </m-cell>
        <div class="bottom__btn">
            <div :class="['button__icon',(firstDiscountFee &&isFirstOrder)?'firstOrderIcon':(isDiscount?'discountIcon':'noDiscountIcon')]">{{orderDesc}}</div>
            <div :class="['button__price',(firstDiscountFee &&isFirstOrder)?'firstOrderIcon':(isDiscount?'discountIcon':'noDiscountIcon')]">
                <span class="order__price"><span class="amount-token">¥</span><span class="amount-num">{{orderPrice}}<span v-if="(firstDiscountFee &&isFirstOrder) ||isDiscount" class="amount-separator">/</span></span></span>
                <span class="order__originPrice" v-if="(firstDiscountFee&&isFirstOrder) ||isDiscount ">原价¥{{orderOriginPrice}}</span>
            </div>
            <div class="button__submit" @click="handleConfirm">立即支付</div>
        </div>
        <Agreement class="agreement-color" v-model="isAgree" descText="阅读并同意" :listProtocol="listProtocol"></Agreement>
        <popup :isPop="isPop" @complete="popSelect">
            <coupon-pop v-if="isPop" slot="content" class="popup-coupon" :showCancelBtn="true" :popData="popData" @confirm="popSelect" @close="popCancel"></coupon-pop>
        </popup>
    </div>
</m-page>
</template>

<script>
import {
    getCardList
} from 'store/modules/trade/vipcard'
import {
    virtualCouponList,
    virtualCouponChange,
    virtualConfirmInit,
    virtualCreateTradeV3,
} from 'store/modules/trade/virtual'
import {
    payMixinMulti
} from '../common/assets/order_vipcard'
import {
    AXD,
} from 'src/libs/util'
import Agreement from "src/components/agreement"
import couponPop from '../common/confirm/coupon-pop.vue'
import popup from 'components/popup/index.vue'
export default {
    name: 'VIPCard2022',
    components: {
        Agreement,
        popup,
        couponPop
    },
    mixins: [payMixinMulti],
    data() {
        return {
            isAgree: false,
            isFirstOrder: false,
            isPop: false,
            // TODO:
            listProtocol: [{
                label: '《招集令招财会员服务协议》',
                value: 'ZJL_ZCK'
            }],
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            vipcardList: [],
            activedVipcardIndex: -1,
            merchantTicketInfo: null,
            popData: {
                title: '请选择红包',
                type: 'coupon',
                couponCodeSelect: '',
                couponList: {}
            },
            activedTicketIndex: -1,
            buyNowInfo: null,
            ticketChangeUpInfo: null,
            cpType: {
                shop: 'shop', // 店铺红包
                cart: 'cart', // 全场红包
                trade: 'trade' // 交易红包(店铺+全场)
            },
            wholeCpType: 'cart',
            goodsType: {
                vipcard: 'vipcard',
                buynow: 'VIP_CARD' // 此处下单有修改
            },
            cardNum: 1,
            comfirmFunction: virtualCreateTradeV3, // 支付接口
        }
    },
    filters: {
        formatMoneyK(data, count = 1) {
            let num = parseInt(data)
            if (isNaN(num)) {
                return data
            } else if (Math.floor(num / 1000) !== (num / 1000)) {
                return (num / 1000).toFixed(count)
            } else {
                return (num / 1000)
            }
        }
    },
    computed: {
        selectVipcard() {
            if (!this.vipcardList) return {}
            return this.vipcardList[this.activedVipcardIndex] || {}
        },
        selectTicket() {
            if (!this.merchantTicketInfo) return {}
            const {
                availableList
            } = this.merchantTicketInfo
            return (availableList && availableList[this.activedTicketIndex]) || {}
        },
        hasTicket() {
            if (!this.merchantTicketInfo) return false
            const {
                availableList
            } = this.merchantTicketInfo
            return !!(availableList && availableList.length)
        },
        ticketDesc() {
            if (!this.merchantTicketInfo) return '无可用红包'
            const {
                availableList
            } = this.merchantTicketInfo
            if (!availableList || !availableList.length) return '无可用红包'
            if (this.activedTicketIndex === -1) return '不使用红包'
            let target = availableList[this.activedTicketIndex]
            return target ? target.useEffect : ''
        },
        firstDiscountFee() {
            let vipcard = this.vipcardList[this.activedVipcardIndex]
            if (!vipcard || !vipcard.firstDiscountFee) return ''
            let firstDiscountFee = parseInt(vipcard.firstDiscountFee)
            if (isNaN(firstDiscountFee)) {
                return '0'
            } else if (Math.floor(firstDiscountFee / 1000) !== (firstDiscountFee / 1000)) {
                return (firstDiscountFee / 1000).toFixed(1)
            } else {
                return (firstDiscountFee / 1000)
            }
        },
        isDiscount() {
            if (this.firstDiscountFee && this.isFirstOrder) return false
            const target = this.vipcardList[this.activedVipcardIndex]
            if (!target) return false
            return parseInt(target.price) !== parseInt(target.originPrice)
        },
        orderDesc() {
            if (this.firstDiscountFee && this.isFirstOrder) return `首单优惠${this.firstDiscountFee}元`
            if (this.isDiscount) return '限时购'
            return '开卡立享价'
        },
        orderPrice() {
            if (this.ticketChangeUpInfo) {
                const {
                    confirmVo
                } = this.ticketChangeUpInfo
                let cartTotalPrice = parseInt(confirmVo.cartTotalPrice)
                if (isNaN(cartTotalPrice)) {
                    return '0'
                } else if (Math.floor(cartTotalPrice / 100) !== (cartTotalPrice / 100)) {
                    return (cartTotalPrice / 100).toFixed(1)
                } else {
                    return (cartTotalPrice / 100)
                }
            } else {
                if (!this.buyNowInfo) return '0'
                const {
                    confirmVo
                } = this.buyNowInfo
                let cartTotalPrice = parseInt(confirmVo.cartTotalPrice)
                if (isNaN(cartTotalPrice)) {
                    return '0'
                } else if (Math.floor(cartTotalPrice / 100) !== (cartTotalPrice / 100)) {
                    return (cartTotalPrice / 100).toFixed(1)
                } else {
                    return (cartTotalPrice / 100)
                }
            }
        },
        orderOriginPrice() {
            let target = this.vipcardList[this.activedVipcardIndex]
            if (!target) return '0'
            let originPrice = parseInt(target.originPrice)
            if (isNaN(originPrice)) {
                return '0'
            } else if (Math.floor(originPrice / 1000) !== (originPrice / 1000)) {
                return (originPrice / 1000).toFixed(1)
            } else {
                return (originPrice / 1000)
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        // 获取会员卡信息 金额单位是里
        getList() {
            getCardList().then(res => {
                if (res.success) {
                    const {
                        isFirstOrder = false,
                            aplusList = []
                    } = res.result || {}
                    this.vipcardList = aplusList
                    // 设置是否首单优惠
                    this.isFirstOrder = isFirstOrder
                    if (aplusList.length) {
                        this.activeVipcardItem(0)
                    }
                } else {
                    this.$_toast(res.resultDes)
                    if (res.code === '-1999' || res.code === '-1997') {
                        AXD.util.login()
                    }
                }
            })
        },
        // 选择会员卡后红包查询
        activeVipcardItem(index) {
            this.activedVipcardIndex = index
            this.confirmOrderInfo(index, this.vipcardList[index])
        },
        // 下单
        confirmOrderInfo(index, args = {}) {
            const params = {
                activityIds: [],
                goodsType: this.goodsType.buynow,
                num: this.cardNum,
                skuId: args.skuId
            }
            const data = {
                params: JSON.stringify(params)
            }
            virtualConfirmInit(data).then(res => {
                if (res.success) {
                    this.buyNowInfo = res.result || null
                    this.getMerchantableTicket(res.result)
                } else {
                    this.buyNowInfo = null
                    this.$_toast(res.resultDes)
                    if (res.code === '-1999' || res.code === '-1997') {
                        AXD.util.login()
                    }
                }
            })
        },
        // 获取红包信息
        getMerchantableTicket(args = {}) {
            const {
                confirmVo
            } = args
            const {
                merchants,
            } = confirmVo
            const params = {
                activityIds: [],
                cpType: this.cpType.shop,
                goodsType: this.goodsType.buynow,
                num: this.cardNum,
                skuId: this.selectVipcard.skuId,
                wholeCp: '',
                cpCode: (merchants[0].couponVo && merchants[0].couponVo.code) || ''
            }
            const data = {
                params: JSON.stringify(params)
            }
            virtualCouponList(data).then(res => {
                if (res.success) {
                    this.merchantTicketInfo = res.result || null
                    this.initMerchantableTicket()
                } else {
                    this.merchantTicketInfo = null
                }
            })
        },
        // 设置初始化红包
        // 购买会员的抵扣红包仍取原有的商品红包；红包默认展示金额最大，若金额一样则取有效期最短，如果红包则该模块不可点击
        initMerchantableTicket() {
            // 清空购买数据
            this.ticketChangeUpInfo = null
            if (!this.merchantTicketInfo || !this.merchantTicketInfo.availableList || !this.merchantTicketInfo.availableList.length) {
                this.activedTicketIndex = -1
                return
            }
            const {
                availableList
            } = this.merchantTicketInfo
            let activedTicketIndex = -1
            if (availableList.length === 1) {
                activedTicketIndex = 0
            } else {
                let amtCoupons = availableList.map(item => (parseInt(item.amtCoupon) || 0))
                let maxAmtCoupon = Math.max(...amtCoupons)
                let maxAmtCouponIndex = -1
                let nowDate = new Date().toLocaleDateString()
                for (let i = 0; i < availableList.length; i++) {
                    let tmp = availableList[i]
                    if (parseInt(tmp.amtCoupon) === maxAmtCoupon) {
                        if (maxAmtCouponIndex === -1) {
                            maxAmtCouponIndex = i
                        } else {
                            let maxTarget = availableList[maxAmtCouponIndex]
                            let maxTime = Date.parse(maxTarget.endTime) - Date.parse(nowDate)
                            let curTime = Date.parse(tmp.endTime) - Date.parse(nowDate)
                            if (curTime < maxTime) {
                                maxAmtCouponIndex = i
                            }
                        }
                    }
                }
                activedTicketIndex = maxAmtCouponIndex
            }
            this.activeMerchantableTicket(activedTicketIndex)
        },
        // 打开红包选择框
        selectMerchantableTicket() {
            let couponObj = {
                title: '请选择红包',
                type: 'coupon',
                couponCodeSelect: '',
                couponList: this.merchantTicketInfo
            }
            const {
                availableList
            } = this.merchantTicketInfo
            if (this.activedTicketIndex !== -1) {
                couponObj.couponCodeSelect = availableList[this.activedTicketIndex].code
            }
            this.showPop(couponObj)
        },
        // 选择红包获取实际售价
        activeMerchantableTicket(index) {
            const {
                availableList
            } = this.merchantTicketInfo
            this.activedTicketIndex = index
            this.getActualPriceByTicket(availableList[index])

        },
        getActualPriceByTicket(args = {}) {
            const params = {
                activityIds: [],
                goodsType: this.goodsType.buynow,
                num: this.cardNum,
                skuId: this.selectVipcard.skuId,
                wholeCp: '',
                cpCode: args.code || '',
                wholeCpType: this.wholeCpType
            }
            const data = {
                params: JSON.stringify(params)
            }
            virtualCouponChange(data).then(res => {
                if (res.success) {
                    this.ticketChangeUpInfo = res.result || null
                }
            })

        },
        // 红包列表
        showPop(data) {
            this.popData = data
            this.isPop = true
        },
        //获取选择类型 和item
        popSelect(type, activeItem) {
            if (type === 'coupon') {
                const {
                    code
                } = activeItem
                const {
                    availableList
                } = this.merchantTicketInfo
                let targetIndex = -1
                if (code) {
                    for (let i = 0; i < availableList.length; i++) {
                        if (code === availableList[i].code) {
                            targetIndex = i
                            break
                        }
                    }
                }
                this.ticketChangeUpInfo = null // 清除选择红包状态
                this.activedTicketIndex = targetIndex
                this.activeMerchantableTicket(targetIndex)
                this.popCancel()
            }
        },
        popCancel() {
            this.isPop = false
        },
        // 立即支付
        handleConfirm() {
            if (!this.isAgree) {
                this.$_toast('请阅读并同意会员服务协议')
                return
            }
            this.handlePayment()
        },

        // 收银台
        handlePayment() {
            const {
                csrfToken,
            } = this.buyNowInfo
            const params = {
                activityIds: [],
                csrfToken: csrfToken,
                goodsType: this.goodsType.buynow,
                num: this.cardNum,
                skuId: this.selectVipcard.skuId,
                wholeCp: '',
                cpCode: (this.selectTicket.code) || '',
                wholeCpType: this.wholeCpType
            }
            // 调用公共创建订单，唤起收银台方法
            const backUrl = `${window.location.href}`
            this.createOrder({
                params,
                backUrl
            })
        }
    }
}
</script>

<style lang="scss" scoped>
$colorPrimary: #4286ff;

.color-link {
    color: $colorPrimary;
}

.page__card {

    .bottom__btn {
        //padding: px2rem(0) px2rem(32);
        display: flex;
        width: px2rem(686);
        height: px2rem(96);
        margin: px2rem(32) auto 0;
        position: relative;
        background: linear-gradient(90deg, #4B5D95 0%, #202844 100%);
        border-radius: px2rem(4);

        .button__price {
            flex: 1;

            &.firstOrderIcon,
            &.discountIcon {
                padding: px2rem(15) 0 0 px2rem(114);
            }

            &.noDiscountIcon {
                padding: px2rem(15) 0 0 px2rem(170);
            }

            .amount-token {
                font-size: px2rem(28);
                font-weight: 600;
                color: #F2D9B5;
                line-height: px2rem(40);
            }

            .order__price {

                .amount-num {
                    font-size: px2rem(48);
                    font-weight: 600;
                    color: #F2D9B5;
                    line-height: px2rem(67);
                }

                .amount-separator {
                    font-size: px2rem(24);
                    font-weight: 400;
                    color: #F2D9B5;
                    line-height: px2rem(33px);
                }
            }

            .order__originPrice {
                font-size: px2rem(24);
                font-weight: 400;
                color: #F2D9B5;
                line-height: px2rem(33);
                text-decoration: line-through;
            }
        }

        .button__submit {
            text-align: center;
            width: px2rem(260);
            height: px2rem(96);
            line-height: px2rem(96);
            background: linear-gradient(90deg, #F9DFAF 0%, #EDBF77 100%);
            border-radius: px2rem(4);
            font-size: px2rem(36);
        }

        .button__icon {
            position: absolute;
            background: #FF3E00;
            text-align: center;
            border-radius: px2rem(18) px2rem(18) 0 px2rem(18);
            font-size: px2rem(20);
            color: #FFFFFF;
            font-weight: 400;
            line-height: px2rem(36);

            &.firstOrderIcon {
                bottom: px2rem(68);
                right: px2rem(541);
                width: px2rem(153);
                height: px2rem(36);

            }

            &.discountIcon {
                left: px2rem(34);
                bottom: px2rem(68);
                width: px2rem(92);
                height: px2rem(36);

            }

            &.noDiscountIcon {
                left: px2rem(40);
                bottom: px2rem(68);
                width: px2rem(132);
                height: px2rem(36);
            }

        }
    }

    .mui-fixedbottom {
        height: auto;
        padding: 0;

        ::v-deep {
            .ticket-desc {
                &.red {
                    color: #FF3E00;
                }
            }
        }
    }

    .mui-fixedbottom~ ::v-deep.mui-content {
        bottom: px2rem(300);
    }

}

.page__content {
    height: 100%;
    line-height: 1.4;
    overflow-y: auto;
    padding: px2rem(20) px2rem(24);

}

.card__box {
    padding: px2rem(32) px2rem(32) px2rem(40);
    background: #fff;
    border-radius: px2rem(12);
    margin-bottom: px2rem(20);

    .card__title {
        font-size: px2rem(32);
        color: #333;
        font-weight: 600;
        margin-bottom: px2rem(16);
    }

    // .card__list{
    // }
    .card__item {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: px2rem(200);
        height: px2rem(280);
        margin-right: px2rem(19);
        border-radius: px2rem(12);
        color: #222;
        font-size: px2rem(28);
        font-weight: 600;
        background: center / 100% no-repeat url(./assets/bg-default.png);

        &.card__item--active {
            background: center / 100% no-repeat url(./assets/bg-active.png);

            .card__days {
                color: #B68443;
            }
        }

        &:nth-child(3n) {
            margin-right: 0;
        }

        .card__price {
            font-size: px2rem(56);
            font-weight: 600;
        }

        .card__days {
            color: #999;
            font-size: px2rem(24);
            font-weight: 400;
        }
    }
}

.rights__list {
    width: px2rem(702);
    height: px2rem(380);
    background: center / 100% no-repeat url(./assets/vip-rights.png);

}

.cell__custom {
    height: px2rem(88);
    background: linear-gradient(270deg, #FFFBF3 0%, #F8ECD4 100%);
}

.agreement-color {

    //padding:px2rem(20) px2rem(32);
    ::v-deep {

        .icon-checkbox,
        .icon-checkbox.active {
            color: #EDBF77;
        }

        .color-link {
            color: #B68443;
        }
    }
}

::v-deep {
    .aui-popup_content {
        border-radius: px2rem(20) px2rem(20) 0 0;

        .popup-coupon {
            .aui-popup__hd {
                width: px2rem(750);
                height: px2rem(88);
                text-align: center;
                font-weight: 400;
                font-size: px2rem(32);
                line-height: px2rem(88);

                .close-icon {
                    position: absolute;
                    top: px2rem(32);
                    left: px2rem(32);
                    width: px2rem(24);
                    height: px2rem(24);
                }
            }

            .aui-popup__bd {
                .aui-cells.aui-cells_radio {

                    .aui-cell__ft {
                        .path1 {
                            &::before {
                                color: #EDBF77;
                            }
                        }
                    }
                }
            }

            .aui-popup__ft {
                .aui-btn_full {
                    font-size: px2rem(36);
                    font-weight: 400;
                    color: #222222;
                    background: linear-gradient(90deg, #F9DFAF 0%, #EDBF77 100%);
                }
            }
        }
    }
}
</style>
