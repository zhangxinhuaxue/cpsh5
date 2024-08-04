<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <div class="tipInfo">
                <div class="icon"></div>
                <div class="text text-type-1">结清证明申请提交成功</div>
                <div class="text text-type-2">预计1小时内开具完成</div>

            </div>
            <div class="submit" @click="viewProof">查看证明</div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'index',
    data() {
        return {
            barConfig: {
                action: 'complete', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    rightBtnShow: true,
                    rightBtn: 'close'
                },
                app: {
                    leftbuttonVisible: false,
                    rightBtnShow: true,
                    rightBtn: 'close'
                }
            }
        }
    },
    methods: {
        viewProof() {
            this.$router.back()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.submit{
    text-align: center;
    width: px2rem(686);
    height: px2rem(90);
    line-height: px2rem(90);
    font-size: px2rem(36);
    background-color: var(--auiColorPrimary);
    border-radius: px2rem(100);
    margin: px2rem(60) auto 0;
}
.tipInfo{
    width: px2rem(750);
    height: px2rem(490);
    margin-top: px2rem(21);
    background-color: #ffffff;
    padding-top: px2rem(78);
    .icon{
        width: px2rem(140);
        height: px2rem(140);
        margin: 0 auto;
        @include img2x('./styles/imgs/complete');
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
        margin: px2rem(30) 0 0;
    }
}
</style>
