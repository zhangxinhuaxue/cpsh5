<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content" v-load-more="init">
            <all-products :productList="allList" :hasNext="hasNext" @select="sideSelect" @complete="init"></all-products>
            <error-page v-if="isError"></error-page>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import allProducts from '../common/all-products.vue'
import errorPage from '../common/error-tips.vue'
import { getAllProduct } from 'store/modules/shop/index'
export default {
    name: 'groupProducts',
    data() {
        return {
            barConfig: {
                reset: ''
            },
            page: 1,
            sort: 'SALES_DESC',
            hasNext: true,
            allList: [],
            isError: false
        }
    },
    computed: {
        groupId() {
            return this.$route.params.groupId
        },
        barTitle() {
            if (this.$route.query.name) {
                return this.$route.query.name
            } else {
                return '商品'
            }
        },
        id() {
            let key = this.$route.query.key
            if (key) {
                return 'shopId'
            } else {
                return 'groupId'
            }
        }
    },
    created() {
        this.init()
    },
    activated() {
        this.barConfig.reset += '1'
        document.title = this.barTitle
        let id = this.$route.params.groupId
    },
    methods: {
        init() {
            if (!this.hasNext) {
                return false
            }
            this.isError = false
            document.title = this.barTitle

            let params = {
                page: this.page,
                size: 20,
                sort: this.sort
            }
            params[this.id] = this.groupId

            getAllProduct(params).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    this.page = result.nextPage
                    this.hasNext = result.hasNext
                    this.allList = [...this.allList, ...result.result]
                } else {
                    this.isError = true
                }
            })
        },
        sideSelect(sort) {
            if (this.sort === sort) {
                return false
            }

            this.page = 1
            this.hasNext = true
            this.allList = []
            this.sort = sort
            this.init()
        }
    },
    components: {
        hybridHeader,
        allProducts,
        errorPage
    }
}
</script>
