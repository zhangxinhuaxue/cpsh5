<template>
    <div class="order-empty">
        <div class="icon"></div>
        <p>{{text}}</p>
    </div>
</template>
<script>
export default {
    name: 'empty',
    props: {
        text: {
            type: String,
            default: '暂无数据'
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.order-empty {
    padding: px2rem(100) 0;
    text-align: center;
    .icon {
        display: inline-block;
        width: px2rem(320);
        height: px2rem(320);
        background: url('../styles/imgs/empty.png') no-repeat;
        background-size: 100% 100%;
    }
    p {
        padding: px2rem(33) 0 px2rem(36);
        line-height: px2rem(45);
        color: $auiTextColorAssistant;
        font-size: px2rem(32);
    }
}
</style>
