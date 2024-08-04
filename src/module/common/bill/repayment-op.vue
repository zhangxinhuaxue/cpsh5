<template>
    <div flex class="repayment-op">
        <div v-show="show" class="repayment-checkbox">
            <div class="checkbox" :class="{dischecked: !data.checked}" @click="select"></div>
            全选
        </div>
        <div class="repayment-money">
            <span class="label">合计:</span>
            <span class="money">{{data.money | formatMoneyK}}元</span>
        </div>
        <div class="repayment-btn" :class="{disabled: data.btnDisabled}" @click="submit">立即还款</div>
    </div>
</template>
<script>
import {
    formatMoney,
    formatMoneyK
} from 'src/libs/util'
export default {
    props: {
        show: {
            type: String,
            required: false,
            default: ''
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    filters: {
        formatMoney,
        formatMoneyK
    },
    methods: {
        select() {
            this.$emit('select', !this.data.checked)
        },
        submit() {
            if (!this.data.btnDisabled) {
                this.$emit('submit')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
.repayment-op{
    position: absolute;
    bottom: 0;
    height: px2rem(100);
    line-height: px2rem(100);
    width: px2rem(750);
    background-color: #ffffff;
}
.repayment-btn{
    width: px2rem(290);
    text-align: center;
    font-size: px2rem(32);
    background-color: var(--auiColorPrimary);
    color: #fff;
    &.disabled{
        color: #666;
        background-color: #ccc
    }
}
.repayment-money{
    flex: 1;
    width: px2rem(290);
    padding-left: px2rem(24);
    .label{
        font-size: px2rem(28);
        align-items:middle;
        vertical-align: super;
    }
    .money{
        font-size: px2rem(30);
        color: #FF6161;
        vertical-align: super;
        &:before{
            content: '￥';
        }
    }
}
.repayment-checkbox{
    width: px2rem(140);
    font-size: px2rem(28);
    color: #666666;
    text-align: right;
    position: relative;
    .checkbox{
        position: absolute;
        width: px2rem(40);
        height: px2rem(40);
        left: px2rem(32);
        top: 50%;
        transform: translateY(-50%);
        @include img2x('./imgs/checked');
        background-size:100% 100%;
        &.dischecked{
            @include img2x('./imgs/dischecked')
        }
    }
}
</style>
