<template>
    <div class="order-shop_hd">
        <div class="shop-info" >
            <span class="shop-logo"></span> {{shop.trade.merchantShopName}}
            <span class="icon-arrow2"></span>
        </div>
        <span v-if="pageType === 'list'" class="shop-order-state">
            {{shop.trade.status | formatStatus(shop.trade, shop.orders[0].extType)}}
        </span>
    </div>
</template>
<script>
import { filterStatus } from './common'
export default {
    name: 'shop-hd',
    props: {
        shop: Object,
        pageType: String
    },
    filters: {
        formatStatus(code, trade, extType) {
            return filterStatus(code, trade, extType)
        }
    },
    methods: {

    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.order-shop_hd {
    position: relative;
    width: 100%;
    height: px2rem(95);
    line-height: px2rem(95);
    background-color: #fff;
    padding: 0 px2rem(32);
    font-size: px2rem(28);
    .shop-info {
        display: inline-block;
        padding: 0 px2rem(46);
        color: #222;
        max-width: 70%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        .icon-arrow2 {
            position: absolute;
            top: px2rem(20);
            right: 0;
            &::before {
                font-size: px2rem(28);
                color: #ccc;
            }
        }
    }
    .shop-order-state {
        color: #FF6161;
        float: right;
    }
    .shop-logo {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: px2rem(36);
        height: px2rem(95);
        background: url(../img/shop.png) center center no-repeat;
        background-size: 100% auto;
    }
}
</style>
