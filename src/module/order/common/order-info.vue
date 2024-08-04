<template>
    <div class="info" :class="{gap: isSingleShop}">
        <div class="c-9">订单号：{{trade.id}}</div>
        <div class="c-9">下单时间：{{trade.createTime | dateFormat}}</div>
        <div v-if="trade.buyerMessage" class="c-9">买家留言：{{trade.buyerMessage}}</div>
    </div>
</template>
<script>

export default {
    name: 'orderListInfo',
    props: {
        trade: Object,
        isSingleShop: Boolean
    },
    create() {
        console.log('isSingleShop', this.isSingleShop)
    }
}
</script>

<style lang="scss" scoped>
@import '../style.scss';
.gap {
    margin: px2rem(20) 0;
}
.info {
    background: #fff;
    line-height: px2rem(47);
    padding: px2rem(32);
    overflow: hidden;
}
</style>
