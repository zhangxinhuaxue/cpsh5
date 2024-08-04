<template>
    <div class="aui-cell_auto flex-start">
        <div class="aui-cell__hd">
            <img :src="productInfo.imgUrl">
        </div>
        <div :class="['aui-cell__bd', productInfo.className]">
            <p class="name">{{productInfo.productName}}</p>
        </div>
        <div :class="['aui-cell__ft', productInfo.className]" v-if="productInfo.price">
            <p>￥{{productInfo.price | toRMB(100)}}</p>
            <p class="buy-num">X{{productInfo.num}}</p>
            <p class="refund-status" v-if="productInfo.refundType">{{productInfo.refundType}}</p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'orderProduct',
    props: {
        productInfo: Object
    }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
.aui-cell_auto {
    padding: px2rem(44) 0;
    font-size: $auiFontSizeLevel6;
    &.flex-start {
        -webkit-box-align: start;
        -webkit-align-items: flex-start;
        align-items: flex-start;
    }
}

.aui-cell__hd {
    width: px2rem(127);
    height: px2rem(127);
    border: solid 1px #e4e4e4;
    margin-right: px2rem(24);
    display: -webkit-flex;
    display: -webkit-box;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    img {
        max-width: 100%;
        max-height: 100%;
    }
}

.aui-cell__bd {
    line-height: 1.2em;
    .name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        max-height: px2rem(82);
        word-wrap: break-word;
    }
    .desc {
        color: $auiTextColorAssistant;
        font-size: $auiFontSizeLevel7;
        margin-top: px2rem(5);
    }
}

.aui-cell__ft {
    line-height: 1.2em;
    color: $auiTextColorImportant;
    margin-left: px2rem(40);
    .buy-num {
        color: $auiTextColorLight;
        margin-top: px2rem(5);
    }
    .refund-status {
        color: #ffb626;
        margin-top: px2rem(8);
    }
}

.pt24 {
    padding-top: px2rem(24);
}
</style>
