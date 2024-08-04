<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page" v-if="initShow">
        <shop-header></shop-header>
        <shop-footer></shop-footer>
        <div class="aui-content">
            <shop-sign></shop-sign>
            <main-tab></main-tab>
            <keep-alive>
            <component :is="curTabComponent"></component>
            </keep-alive>
            <!-- <template>
                <main-products v-if="tabIndex === 0" @complete="select"></main-products>
                <all-products v-if="tabIndex === 1"></all-products>
                <new-products v-if="tabIndex === 2"></new-products>
            </template> -->
            <aym-totop></aym-totop>
            <!-- <error-page v-if="isError"></error-page> -->
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import shopHeader from './header.vue'
import shopSign from './shop-sign.vue'
import mainTab from './main-tab.vue'
import mainProducts from './main-products.vue'
import allProducts from './all-products.vue'
import newProducts from './new-products.vue'
import aymTotop from 'components/totop/index.vue'
// import errorPage from '../common/error-tips.vue'
import shopFooter from './footer.vue'
import { getShopInfo, getShopTopicList, getAllProduct, getNewProduct } from 'store/modules/shop/index'
const { mapActions, mapState } = createNamespacedHelpers('shop')
export default {
    name: 'shopHome',
    data() {
        return {
            barReset: '',
            tabIndex: 0,
            // curTabComponent: 'main-products',
            initShow: false,
            isError: false
        }
    },
    computed: {
        ...mapState({
            shopName: state => state.initShopData.shopName,
            tabCurIndex: state => state.mainTabIndex
        }),
        shopId() {
            return this.$route.params.shopId
        },
        curTabComponent() {
            return {
                0: 'main-products',
                1: 'all-products',
                2: 'new-products'
            }[this.tabCurIndex]
        }
    },
    created() {
        this.init()
    },
    methods: {
        ...mapActions([
            'initHomeData'
        ]),
        init() {
            // 如果存在商家id，则取商家id；无商家id，取店铺id.
            // 徐星华的要求~他说商家跟店铺数据库设计上就是一对一的关系，他不想在订单页取店铺id，不然服务会崩掉～～
            this.initHomeData({ id: this.shopId }).then(() => {
                this.initShow = true
                // let shopName = this.$store.state.initShopData.shopName
                let shopName = this.shopName
                shopName = this.limitString(shopName, 16)
                document.title = shopName
            }, () => {
                // this.isError = true
            })
        }
        // select(i) {
        //     if (i === this.tabIndex) {
        //         return false
        //     }
        //     this.tabIndex = i
        //     this.curTabComponent = {
        //         0: 'main-products',
        //         1: 'all-products',
        //         2: 'new-products'
        //     }[i]
        // }
    },
    components: {
        shopHeader,
        shopSign,
        mainTab,
        mainProducts,
        allProducts,
        newProducts,
        aymTotop,
        shopFooter
    }
}
</script>
