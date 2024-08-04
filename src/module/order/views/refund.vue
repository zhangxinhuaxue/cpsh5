<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"> </hybrid-header>
        <div class="aui-content" v-if="dataLoaded">
            <my-order v-if="orderlist.length>0" :orderArr="orderlist" @afreshInit="afreshInitList"></my-order>
            <order-empty v-else></order-empty>
        </div>
    </div>
</template>
<script>
import { getRefundList } from 'src/store/modules/order'
import { myOrderMixin } from '../common/myorder'
export default {
    name: 'keepAlive_orderRefund',
    mixins: [myOrderMixin],
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false,
                    enforce: true
                },
                app: {
                    visible: false,
                    rightBtnShow: false
                }
            }
        }
    },
    computed: {
        getOrderList() {
            return getRefundList
        }
    },
    created() {
        this.afreshInitList()
        this.preloadIm()
    },
    methods: {
        afreshInitList() {
            this.initList(null)
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.refund-list {
    padding: px2rem(30) px2rem(32);
}
</style>
