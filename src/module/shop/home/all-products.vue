<template>
    <div v-infinite-scroll="getAllproductFun" infinite-scroll-disabled="busy" infinite-scroll-distance="300">
        <all-products :productList="allList" :hasNext="hasNext" @select="sideSelect"></all-products>
        <error-page v-if="isError"></error-page>
    </div>
</template>
<script>
import allProducts from '../common/all-products.vue'
import errorPage from '../common/error-tips.vue'
import { getAllProduct } from 'store/modules/shop/index'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('shop')
export default {
    name: 'home-all',
    data() {
        return {
            page: 1,
            sort: 'SALES_DESC',
            hasNext: true,
            allList: [],
            isError: false,
            busy: false
        }
    },
    computed: {
        ...mapState({
            tabCurIndex: state => state.mainTabIndex
        }),
        shopId() {
            return this.$route.params.shopId
        }
    },
    watch: {
        tabCurIndex(newVal) {
            this.busy = !(newVal === 1 && this.hasNext)
        }
    },
    // mounted() {
    //     this.getAllproductFun()
    // },
    beforeDestroy() {
        this.busy = true
    },
    methods: {
        getAllproductFun() {
            console.log('getAllproductFun')
            this.isError = false
            if (this.busy) {
                return
            }
            this.busy = true
            let params = {
                shopId: this.shopId,
                sort: this.sort,
                page: this.page,
                size: 10
            }
            getAllProduct(params).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    let hasNext = result.hasNext
                    this.page = result.nextPage
                    this.hasNext = hasNext
                    this.$nextTick(() => {
                        this.busy = !hasNext
                    })
                    console.log('busy:' + this.busy)
                    this.allList.push(...result.result)
                    // this.allList = [...this.allList, ...result.result]
                } else {
                    this.isError = true
                    this.busy = true
                }
            })
        },
        sideSelect(sort) {
            if (this.sort === sort) {
                return false
            }

            this.page = 1
            this.busy = false
            this.hasNext = true
            this.allList = []
            this.sort = sort
            console.log('sideSelect')
            this.getAllproductFun()
        }
    },
    components: {
        allProducts,
        errorPage
    }
}
</script>
