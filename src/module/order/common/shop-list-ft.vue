<template>
    <div class="order-shop_ft">
        <span v-if="isInfo">共{{trade.goodsCount}}件商品 </span>实付:
        <span class="real-price" v-html="'¥' + complexMoney(trade.actualPayment, 100, true, true)"></span>
        <span v-if="isInfo">(包邮)</span>
    </div>
</template>
<script>

export default {
    name: 'orderListComponent',
    computed: {
        isInfo() {
            return this.trade.extType !== 'PAYFEE'
        }
    },
    props: {
        trade: Object
    }
}
</script>

<style lang="scss" scoped>
@import '../style.scss';
.order-shop_ft {
    width: 100%;
    height: px2rem(95);
    text-align: right;
    line-height: px2rem(95);
    color: #666;
    background-color: #fff;
    padding: 0 px2rem(32);
    font-size: px2rem(24);
    .real-price {
        font-size: px2rem(30);
        color: #2A2A2A;
    }
}
</style>
