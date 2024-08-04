<template>
<div v-show="config.show">
    <div class="aui-mask"></div>
    <div class="dialog">
        <div class="dialog_hd">温馨提示</div>
        <div class="dialog_body">
            <p>{{config.content}}</p>
            <p>您本笔借款的第一期还款日为<span class="repayDate">{{config.repayDate}}</span>(具体还款日以放款时间为准)</p>
        </div>
        <div class="submit" @click="confirm">确定</div>
    </div>
</div>
</template>
<script>
import modal from 'components/modal/index.vue'
export default {
    name: 'tip',
    props: {
        config: {
            type: Object,
            required: true
        }
    },
    methods: {
        confirm() {
            this.$emit('confirm')
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.dialog{
    position: absolute;
    width: px2rem(493);
    // height: px2rem(634);
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    @include img2x('../styles/imgs/bg2');
    background-size: 100% 100%;
    z-index: 1000;
    .dialog_hd{
        height: px2rem(48);
        text-align: center;
        font-size: px2rem(34);
        color: #222222;
        margin-top: px2rem(65);
    }
    .dialog_body{
        // height: px2rem(273);
        width: px2rem(387);
        margin: px2rem(49) auto 0;
        color:#666666;
        font-size: px2rem(28);
        line-height: px2rem(40);
        p ~ p{
            margin-top: px2rem(40);
        }
        .repayDate{
            color:#F99E00;
            margin: 0 px2rem(10);
        }
    }
    .submit{
        background-color: var(--auiColorPrimary);
        color:var(--auiButtonTextColor);
        width: px2rem(430);
        height: px2rem(80);
        line-height: px2rem(80);
        margin: px2rem(40) auto;
        font-size: px2rem(36);
        border-radius: px2rem(100);
        text-align: center;
    }
}
</style>
