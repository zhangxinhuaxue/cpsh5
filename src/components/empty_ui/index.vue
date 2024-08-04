<!--
    Create by sunxj on 08/30/17
 -->
<!-- <empty-ui name="empty">
        <p slot="title" class="page-empty_title">网络不给力，请重新加载</p>
        <p slot="desc" class="page-empty_desc">请确保手机连接了WIFI或运营商网络。您可能关闭了招集令的网络使用权限，去设置</p>
        <div slot="btns" class="page-empty_btns">
            <a href="javascript:;" class="aui-btn_border" @click="test">联系我们</a>
        </div>
    </empty-ui> -->
<template>
    <div class="page-empty">
        <span class="page-empty_img" :class="name"></span>
        <slot name="title"></slot>
        <slot name="desc"></slot>
        <slot name="btns"></slot>
    </div>
</template>
<script>
export default {
    name: 'emptyUi',
    props: {
        name: String // empty nonetwork nopage noservice
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/style.scss';
.page-empty {
    text-align: center;
    color: $auiTextColorAssistant;
    font-size: $auiFontSizeLevel5;
    .empty {
        @include img2x( './img/sousuokongbai');
    }
    .nonetwork {
        @include img2x( './img/wangluochucuo');
    }
    .nopage {
        @include img2x( './img/404');
    }
    .noservice {
        @include img2x( './img/chucuo');
    }
    .nocoupon_big,
    .nocoupon_small {
        background-image: url('./img/nocoupon_big.png');
    }

    .nocoupon_big {
        width: px2rem(200);
        height: px2rem(200);
        margin: px2rem(200) auto px2rem(35);
    }
    .nocoupon_small {
        width: px2rem(120);
        height: px2rem(120);
        margin: px2rem(160) auto px2rem(25);
    }
    &_img {
        display: inline-block;
        width: px2rem(200);
        height: px2rem(200);
        background-size: cover;
    }
    &_title {
        margin: px2rem(16) px2rem(95) 0;
    }
    &_desc {
        font-size: $auiFontSizeLevel6;
        text-align: left;
        margin: px2rem(30) px2rem(95) 0;
    }
    &_btns {
        margin-top: px2rem(60);
        a {
            border-color: #999;
            color: #999;
            margin: 0 px2rem(30);
        }
    }
}
</style>
