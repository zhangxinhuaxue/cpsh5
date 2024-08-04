<template>
<div class="aui-page" style="z-index: 90;">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="a-work" @click="alreadyWork"></div>
        <div class="n-work" @click="notWork"></div>
    </div>
</div>
</template>
<script>
export default {
    data() {
        return {
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                leftAction: '',
                h5: {},
                app: {
                    rightBtnShow: true,
                    leftbuttonAction: '',
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'TEXT', // TEXT:文字 IMAGE:图片
                        textColor: '#000000', // #ff00000颜色 showType=TEXT
                        text: '' // 展示文字内容 showType=TEXT
                    }
                }
            }
        }
    },
    methods: {
        alreadyWork() {
            this.$router.push({
                path: this.$store.state.userInfo.fromPage + '/userInfoSupp',
                query: {
                    hasWork: true
                }
            })
        },
        notWork() {
            this.$router.push({
                path: this.$store.state.userInfo.fromPage + '/userInfoSupp',
                query: {
                    hasWork: false
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@mixin work {
    width: px2rem(500);
    height: px2rem(460);
    margin: 0 auto;
    background-size: 100% 100%;
}
.aui-page{
    background-color: #ffffff;
}
.a-work{
    @include work;
    @include img2x('./imgs/aw');
    margin-top: px2rem(76);

}
.n-work{
    @include work;
    @include img2x('./imgs/nw');
    margin-top: px2rem(20);
}

</style>
