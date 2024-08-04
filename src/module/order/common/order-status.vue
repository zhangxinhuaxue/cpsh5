<template>
    <div class="statusBar primary" v-if="isCreditServiceStatus">若30分钟内未提交借款订单，系统将自动发起退款</div>
    <div class="statusBar" v-else :class="(status=='TRADE_CLOSED' || status=='TRADE_CLOSED_BY_USER') ? 'grey' : 'primary'">
        {{status | formatStatus(shop.trade, extType)}}
        <!-- 尾款 未付款 显示提示 -->
        <p v-if="shop.trade.bizType==='ENDPAY' && shop.trade.status=='WAIT_BUYER_PAY' ">
            {{shop.trade|endpayTimeTips('date')|dateFormat('MM月dd日hh:mm')}}{{shop.trade|endpayTimeTips}}
        </p>
        <div class="countdown-wrap" v-show="isMoivePay">
            <div v-if="!timeInit" class="countdown">--:--</div>
        </div>
    </div>
</template>
<script>
import Seckill from 'src/libs/seckill'
import { filterStatus } from './common'
export default {
    name: 'orderStatus',
    props: {
        shop: Object,
        // systimeFunction: Function,
        systimeObj: Object
    },
    data() {
        return {
            timeInit: false,
            countDownObj: null,
            endTime: '',
            startTime: '2018-08-10 18:47:00',
            status: '',
            audit: '',
            extType: '',
            // 是否显示担保订单状态
            isCreditServiceStatus: false
        }
    },
    computed: {
        isMoivePay() {
            return this.extType === 'MOVIE' && this.status === 'WAIT_BUYER_PAY'
        }
    },
    filters: {
        endpayTimeTips(value, type = 'str') {
            let { payStartTime, payEndTime } = value
            if (value.payCondition === 'WAIT') {
                return type === 'date' ? payStartTime : '开始支付尾款'
            }
            // let isClosed = value.status === 'TRADE_CLOSED' || value.status === 'TRADE_CLOSED_BY_USER'
            // let isNotPay = value.payStat === 'NO_CREATE_PAY' || value.payStat === 'WAIT_PAY'
            // if (isClosed && isNotPay) {
            //     return type === 'date' ? payEndTime : '前未支付尾款,交易关闭'
            // }
            return type === 'date' ? payEndTime : '前需支付完毕,超时订单关闭且无法退还定金'
        },
        formatStatus(code, trade, extType) {
            return filterStatus(code, trade, extType)
        }
    },
    beforeDestroy() {
        if (this.isMoivePay) {
            this.countDownObj.destory()
        }
    },
    created() {
        this.handleProps()
    },
    mounted() {
        if (this.isMoivePay) {
            this.countDown()
        }
    },
    methods: {
        handleProps() {
            let trade = this.shop.trade
            let order = this.shop.orders[0]
            let extType = order.extType
            this.status = trade.status
            this.audit = trade.audit
            this.extType = extType
            if (extType === 'MOVIE') {
                let skuPropertiesName = JSON.parse(order.skuPropertiesName)
                this.endTime = skuPropertiesName.payEndTime
            }
            // 当是嗨花-增信服务订单 并且处在 付款后与退款前, 提示提交借款订单文案
            if (extType === 'ENSURE' && (this.status !== 'WAIT_PAY_RETURN' && this.status !== 'WAIT_BUYER_PAY' && this.status !== 'TRADE_CLOSED' && this.status !== 'TRADE_CLOSED_BY_USER')) {
                this.isCreditServiceStatus = true
            }
        },
        countDown() {
            this.countDownObj = new Seckill({
                el: document.querySelector('.countdown-wrap'),
                during: 1000,
                style: '.countdown {display: inline-block;}',
                pClass: 'countdown',
                template: '$m$m:$s$s',
                endTime: this.endTime,
                startTime: this.startTime,
                getServerTime: () => {
                    return Promise.resolve(this.systimeObj)
                },
                beginSeckillCb: () => {
                    this.timeInit = true
                },
                endSeckillCb: (res) => {
                    this.timeInit = true
                }
            })
            this.countDownObj.init()
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.countdown {
    display: inline-block;
}

.countdown-wrap {
    float: right;
    font-size: $auiFontSizeLevel4;
    color: #474747;
    position: relative;
    padding-left: px2rem(36);
    line-height: px2rem(80);
    height: px2rem(80);
    &:before {
        content: "";
        display: inline-block;
        width: px2rem(28);
        height: px2rem(28);
        @include img2x('../img/clock');
        background-repeat: no-repeat;
        background-size: 100%;
        position: absolute;
        top: 50%;
        margin-top: px2rem(-15);
        left: 0;
    }
}

.statusBar {
    background: $auiColorPrimary;
    padding: px2rem(20) px2rem(32);
    font-size: px2rem(30);
    line-height: px2rem(40); // height: px2rem(80);
    p {
        line-height: px2rem(30);
        font-size: px2rem(26);
        margin-top: px2rem(10);
    }
    &.grey {
        background: #e4e4e4;
    }
}
</style>
