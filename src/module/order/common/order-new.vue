<template>
    <div class="order-list">
        <div class="order-group" v-for="group in groups">
            <div class="order-shop" v-for="shop in group.shops">
                <shop-hd :shop="shop" :pageType="'list'"></shop-hd>
                <shop-bd :shop="shop" :tradeGroupId="group.tradeGroupId" :tids="filterTids(group)"></shop-bd>
                <shop-ft :trade="shop.trade"></shop-ft>
            </div>
            <order-footer :shop="group.shops[0]" :tids="filterTids(group)" :pageType="'list'" :tradeGroupId="group.tradeGroupId" :payChannel="group.payChannel" @refreshInit="refreshInit"></order-footer>
        </div>
        <p class="bottom-tips continue" v-if="!wholeDataDone">下拉加载</p>
        <p class="bottom-tips" v-else>已经到底咯～</p>
    </div>
</template>
<script>
import orderFooter from './order-new-footer.vue'
import shopHd from './shop-hd.vue'
import shopBd from './shop-bd.vue'
import shopFt from './shop-list-ft.vue'

export default {
    name: 'orderListComponent',
    props: {
        groups: Array,
        wholeDataDone: Boolean
    },
    data() {
        return {}
    },
    mounted() {},
    methods: {
        refreshInit() {
            this.$emit('refreshInit')
        },
        filterTids(group) {
            return group.shops.map((shop) => {
                return shop.trade.id
            }).join(',')
        }
    },
    components: {
        orderFooter,
        shopHd,
        shopBd,
        shopFt
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.order-list {
    font-size: px2rem(26);
    .order-group {
        margin-top: px2rem(20);
    }
}

.order-shop {
    position: relative;
    &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        content: '';
        width: 100%;
        height: 1px;
        background-color: #E4E4E4;
        @include onepxline();
    }
    &:nth-last-child(2)::after {
        left: px2rem(32);
    }
}

.bottom-tips {
    font-size: px2rem(26);
    color: #CCCCCC;
    text-align: center;
    padding: px2rem(54) 0 px2rem(12);
}
</style>
