<template>
    <p v-if="bankCode == warnBankCode" class="bank_tip">
        {{warnTips}}
        <slot></slot>
    </p>
</template>
<script>
export default {
    name: 'bankTip',
    props: {
        bankCode: {
            type: String
        },
        warnBankCode: {
            type: String,
            default: '01000000'
        },
        warnTips: {
            type: String,
            default: '因银行系统问题，中国邮政储蓄银行到账可能会有一定的延迟，如您急需用钱，建议选用其他银行银行卡收款。'
        }
    },
    data() {
        return {

        }
    },
    computed: {

    },
    components: {

    },
    mounted() {

    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
/* 邮储银行提示 */
.bank_tip {
    padding: px2rem(20) px2rem(32);
    color: #F99E00;
    font-size: px2rem(24);
    line-height: px2rem(32);
    background: url('./img/tip.png') px2rem(32) px2rem(24) no-repeat;
    background-size: px2rem(24) px2rem(24);
    text-indent: px2rem(30);
}
</style>
