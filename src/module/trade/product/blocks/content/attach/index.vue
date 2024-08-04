<!--
    Created by hity on 05/19/17
-->
<template>
    <div class="attach aui-cells" v-if="showAttach">
        <axd-instalment v-if="!$_isCheck&&instalment.isShow" :instalment="instalment"></axd-instalment>
        <axd-coupon v-if="coupon.isShow" :coupon="coupon"></axd-coupon>
        <axd-sales v-if="sales.isShow" :sales="sales"></axd-sales>
        <axd-npxe></axd-npxe>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import axdInstalment from './instalment.vue'
import axdCoupon from './coupon.vue'
import axdSales from './sales.vue'
import axdNpxe from './npxe.vue'
export default {
    name: 'attach',
    computed: {
        ...mapState('trade', {
            buyType: state => state.product.initData.trade.buyType,
            instalment: state => state.product.initData.instalment,
            coupon: state => state.product.initData.coupon,
            npxelist: state => state.product.initData.activity.list,
            sales: state => state.product.initData.sales
        }),
        showAttach() {
            return this.instalment.isShow || this.coupon.isShow || this.sales.isShow || (this.buyType == 'npxe' && this.npxelist.length)
        }
    },
    components: {
        axdInstalment,
        axdCoupon,
        axdSales,
        axdNpxe
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.attach {
    margin-top: 0;
}
</style>
