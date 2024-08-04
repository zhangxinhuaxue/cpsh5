<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="tipInfo">
            <div class="icon"></div>
            <div class="text text-type-1">还款已提交</div>
            <div class="text text-type-2">具体结果请留意短信通知</div>
        </div>
        <div class="aui-cols">
            <div class="aui-col-1 pr12 pl12">
                <div @click="toIndex" class="aui-btn aui-btn_primary">完成</div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            barConfig: {
                action: 'complete', // 右侧按钮点击事件， 必须是window变量
                app: {
                    leftbuttonVisible: false,
                    rightBtnShow: true,
                    rightBtn: 'close'
                }
            }
        }
    },
    beforeMount() {
        window.complete = () => {
            this.$router.replace({
                name: 'rrhBill'
            })
        }
    },
    methods: {
        /**
         * 跳转抱米花账单首页
         * @return {[type]} [description]
         */
        toIndex() {
            this.$router.replace({
                name: 'rrhBill'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.tipInfo{
    width: px2rem(750);
    height: px2rem(440);
    margin-top: px2rem(21);
    margin-bottom: px2rem(30);
    background-color: #ffffff;
    padding-top: px2rem(78);
    .icon{
        width: px2rem(140);
        height: px2rem(140);
        margin: 0 auto;
        @include img2x('../styles/imgs/complete');
        background-size: 100% 100%;
    }
    .text{
        text-align: center;
    }
    .text-type-1{
        font-size: px2rem(36);
        line-height: px2rem(36);
        margin-top: px2rem(53);
    }
    .text-type-2{
        font-size: px2rem(30);
        line-height: px2rem(30);
        color: #666666;
        margin: px2rem(30) 0 px2rem(20);
    }
    .text-type-3{
        font-size: px2rem(26);
        line-height: px2rem(37);
        color: #666666;
    }
    .time{
        color:#F99E00;
    }
}
.ops{
    @include flex;
    margin-top: px2rem(50);
    height: px2rem(90);
    line-height: px2rem(90);
    font-size: px2rem(36);
    justify-content: space-around;
    .op-item{
        height: 100%;
        text-align: center;
        border-radius: px2rem(100);
        background-color: #ffffff;
        width: px2rem(320);
    }
    .op-item.primary{
        background-color: #ffe352;
    }
}
</style>
