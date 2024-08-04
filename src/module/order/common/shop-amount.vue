<template>
    <div class="shop-amount">
        <div class="aui-cols">
            <div class="aui-col-1 c-9">
                商品总价
            </div>
            <span class="real-price" v-html="'¥' + complexMoney(trade.payment, 100, true, true)"></span>
        </div>
        <!-- N件任选增加活动优惠列表，兼容之前的优惠数据 -->
        <template v-if="trade.discountFees&&trade.discountFees.length">
            <div class="aui-cols" v-for="discount in trade.discountFees">
                <div class="aui-col-1 c-9">{{discount.title}}</div>
                -&nbsp;
                <span class="real-price" v-html="'¥' + complexMoney(discount.discountAmt, 100, true, true)"></span>
            </div>
        </template>
        <div class="aui-cols" v-if="trade.couponAmt && Number(trade.couponAmt)">
            <div class="aui-col-1 c-9">红包</div>
            -&nbsp;
            <span class="real-price" v-html="'¥' + complexMoney(trade.couponAmt, 100, true, true)"></span>
        </div>
        <div class="aui-cols" v-if="trade.wholeCouponAmt">
            <div class="aui-col-1 c-9">全场红包</div>
            -&nbsp;
            <span class="real-price" v-html="'¥' + complexMoney(trade.wholeCouponAmt, 100, true, true)"></span>
        </div>
        <div class="aui-cols">
            <div class="aui-col-1 c-9">运费</div>
            <div>包邮</div>
        </div>
        <div class="aui-cols total-amount">
            <div class="aui-col-1 c-9">
                <template v-if="isSingleShop"> 实付款
                </template>
                <template v-else>店铺小计</template>
            </div>
            <span class="real-price" v-html="'¥' + complexMoney(trade.actualPayment, 100, true, true)"></span>
        </div>
    </div>
</template>
<script>
export default {
    name: 'shopAmount',
    props: {
        trade: Object,
        isSingleShop: Boolean
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';

.shop-amount {
    background-color: #fff;
    padding: px2rem(40) px2rem(32);
    font-size: px2rem(26);

    .total-amount {
        .c-9 {
            font-size: px2rem(30);
            color: #222;
        }

        .real-price {
            font-size: px2rem(34);
            color: #E31436;
        }
    }
}
</style>
