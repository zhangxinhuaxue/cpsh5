<template>
    <div class="installment" v-if="isShow">
        <div class="aui-cols">
            <div class="aui-col-1 c-9">首付金额</div>
            <span class="real-price" v-html="'¥' + complexMoney(formatNumber(tradeGroup.downPayment), 100, true, true)"></span>
        </div>
        <div class="aui-cols">
            <div class="aui-col-1 c-9">分期金额</div>
            <span class="real-price" v-html="'¥' + complexMoney(formatNumber(tradeGroup.installmentFee), 100, true, true)"></span>
        </div>
        <div class="aui-cols">
            <div class="aui-col-1 c-9">分期信息</div>
            <div>{{tradeGroup.stags}}期</div>
        </div>
        <div class="aui-cols">
            <div class="aui-col-1 c-9">月供(仅供参考，以账单为准)</div>
            <span class="real-price" v-html="'¥' + complexMoney(formatNumber(tradeGroup.monthPay), 100, true, true)"></span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'installment',
    props: {
        tradeGroup: Object
    },
    computed: {
        isShow() {
            let stages = this.tradeGroup.stags
            if (!stages) {
                return false
            } else {
                return Number(stages) >= 1
            }
        }
    },
    methods: {
        formatNumber(val) {
            if (typeof val === 'number' || typeof val === 'string') {
                return val
            }
            return 0
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.installment {
    position: relative;
    background-color: #fff;
    padding: px2rem(40) px2rem(32);
    font-size: px2rem(26);

    &::before {
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

    .total-amount {
        .c-9 {
            font-size: px2rem(30);
            color: #222;
        }

        .real-price {
            font-size: px2rem(34);
            color: #E31436;
        }
    }
}
</style>
