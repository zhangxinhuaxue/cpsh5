<template>
    <section v-if="productPresetData" class="presale-box">
        <div class="box">
            <infoDesc v-for="(value, key) in infoObj" :key="key" :leftText="key|keysDic" :rightText="value|formatMoney(key==='depositDiscount',key==='shippingFee')"></infoDesc>
        </div>
        <div class="step__block mt20" v-for="(value,index) in productPresetData.payinfos" :key="index">
            <div class="box ">
                <p class="step__info" :class="{active:value.currentPhase}">
                    阶段{{index|indexDic}}： {{value.payStat|status(index,isClosed)}} {{value.feedback=='110'?'(已退款)':''}}
                    <template v-if="value.bizType==='ENDPAY'">
                        {{value|endpayTimeTips('date',isClosed)|dateFormat('MM月dd日hh:mm')}}{{value|endpayTimeTips('str',isClosed)}}
                    </template>
                </p>
                <infoDesc v-for="(svalue, skey) in stepObj[index]" :key="skey" :leftText="skey|stepDic(index)" :rightText=" svalue|formatMoney(skey==='coupon',skey==='stags')">
                </infoDesc>
            </div>
            <p v-if="value.payStat!=='NO_CREATE_PAY'" class="acpay " :class="{active:value.currentPhase}">
                实际支付：{{value.actualPayment|formatMoney}}
            </p>
        </div>
    </section>
</template>
<script>
import infoDesc from 'src/module/common/components/info-desc.vue'
import { getPresaleInfo } from 'store/modules/trade/confirm'
import { formatNum } from 'src/libs/util'

export default {
    name: 'presale-info',
    props: {
        orderId: [String, Number],
        isClosed: Boolean,
        type: String
    },
    filters: {
        indexDic(value) {
            return ({
                0: '一',
                1: '二'
            })[value]
        },
        formatMoney(value, isLess, isBare) {
            if (isBare) {
                return value
            }
            return (isLess ? '-￥' : '￥') + formatNum(value)
        },
        status(value, index, isClosed) {
            if (isClosed && index == 1 && value === 'WAIT_PAY') {
                return ''
            }
            return ({
                PAY_SUCCESS: '已完成',
                WAIT_PAY: '待付款',
                PAY_FAIL: '支付失败',
                NO_CREATE_PAY: '未完成'
            })[value]
        },
        endpayTimeTips(value, type = 'str', isClosed) {
            let { payStartTime, payEndTime, payStat, auditStat, feedback, startPay } = value
            // 审核拒绝，交易关闭
            if (isClosed) {
                if (auditStat === 'closed') {
                    return type === 'str' ? '审核拒绝，交易关闭' : ''
                }
                if (feedback != 0) {
                    return type === 'str' ? '交易关闭' : ''
                }
                return type === 'date' ? payEndTime : '前未支付尾款，交易关闭'
            }
            if (payStat === 'NO_CREATE_PAY') {
                if (startPay) {
                    return type === 'date' ? payEndTime : '前截止支付'
                }
                return type === 'date' ? payStartTime : '开始支付尾款'
            }
            if (payStat === 'WAIT_PAY') {
                return type === 'date' ? payEndTime : '前截止支付'
            }
        },
        keysDic(value) {
            return ({
                price: '商品总价',
                depositDiscount: '预售优惠',
                shippingFee: '运费',
                actualPrice: '实际金额'
            })[value] || value
        },
        stepDic(value, index) {
            let paymentStr = index === 0 ? '商品定金' : '尾款金额'
            return ({
                payment: paymentStr,
                coupon: '红包',
                stageAmount: '分期金额',
                stags: '分期信息',
                monthpayment: '月付（仅供参考，以账单为准）'
            })[value] || value
        }
    },
    data() {
        return {
            productPresetData: null
        }
    },
    computed: {
        stepObj() {
            if (!this.productPresetData) {
                return null
            }
            return this.productPresetData.payinfos.map(item => {
                let { payment, salePrice, actualPayment, downPayment, stags, monthpayment, installMentFee: stageAmount } = item
                let coupon = Number(salePrice) - Number(actualPayment)
                // let stageAmount = payment - downPayment
                if (item.payStat === 'NO_CREATE_PAY') {
                    return {
                        payment
                    }
                }
                let stageObj = {}
                if (stags != 0) { // 未分期不显示分期信息。分期数0就是不分期
                    stageObj = {
                        stageAmount,
                        stags: stags + '期',
                        monthpayment
                    }
                }
                return {
                    payment,
                    coupon,
                    ...stageObj
                }
            })
        },
        infoObj() {
            if (!this.productPresetData) {
                return null
            }
            let { price = '', depositDiscount = '', actualPrice = '' } = this.productPresetData
            return {
                price,
                depositDiscount,
                shippingFee: '包邮',
                actualPrice
            }
        }
    },
    components: {
        infoDesc
    },
    mounted() {
        this.getData()
    },
    methods: {
        getData() {
            getPresaleInfo({ orderId: this.orderId }).then(({ success, result }) => {
                if (success && result) {
                    this.productPresetData = result
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

// .presale-box {
//     position: relative;
//     &:before {
//         position: absolute;
//         top: 0;
//         left: px2rem(53);
//         content: '';
//         width: px2rem(645);
//         height: 1px;
//         background-color: #E4E4E4;
//         @include onepxline();
//     }
// }
.aui-cell {
    height: auto;
}

.box {
    padding: px2rem(40) px2rem(30);
    background: #fff;

    ::v-deep .desc__box {
        margin-bottom: px2rem(10);

        &:last-child {
            margin-bottom: 0;
        }
    }
}

.step__block {
    // padding: 0 px2rem(30);
    background: #fff;
}

.step__info {
    margin-bottom: px2rem(10);

    &.active {
        color: #FF6161;
    }
}

.acpay {
    position: relative;
    line-height: px2rem(80);
    padding-right: px2rem(30);
    text-align: right; // margin-bottom: px2rem(-30);

    &.active {
        color: var(--auiTipsColor);
    }

    &:before {
        position: absolute;
        top: 0;
        left: px2rem(32);

        content: '';
        width: px2rem(718);
        height: 1px;
        background-color: #E4E4E4;
        margin: auto;
        @include onepxline();
    }
}

.mt20 {
    margin-top: px2rem(20);
}

.mb20 {
    margin-bottom: px2rem(20);
}
</style>
