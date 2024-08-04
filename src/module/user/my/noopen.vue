<template>
    <div class="aui-page">
        <div class="aui-content">
            <img :src="logo" alt="" class="page-logo">
            <p class="page-text">
                功能暂未开放，请前往应用市场
                <br> 搜索“招集令”客户端还款。
            </p>
            <a :href="downloadUrl" class="aui-btn aui-btn_primary">去下载</a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'noopen',
    data() {
        return {
            logo: require('./img/pics.png')
        }
    },
    computed: {
        downloadUrl() {
            return aixuedai.returnUrl
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-content {
    padding-top: px2rem(181);
    text-align: center;
    .page-logo {
        width: px2rem(181);
        margin: 0 auto;
    }
    .page-text {
        margin-top: px2rem(50);
        font-size: $auiFontSizeLevel5;
    }
    .aui-btn {
        margin-top: px2rem(60);
    }
}
</style>
