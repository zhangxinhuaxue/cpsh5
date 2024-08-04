<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div v-if="newList.length">
        <template v-for="(list, index) in newList">
            <p class="new_date">{{list.groupName}}</p>
            <productlist :dt="list.list" :key="index"></productlist>
        </template>
        <error-page v-if="isError"></error-page>
    </div>
</template>
<script>
import productlist from 'src/module/common/productList/index.vue'
import errorPage from '../common/error-tips.vue'
import { getNewProduct } from 'store/modules/shop/index'
export default {
    name: 'newProducts',
    props: {
        productList: Array
    },
    data() {
        return {
            isError: false,
            newList: []
        }
    },
    components: {
        productlist,
        errorPage
    },
    computed: {
        shopId() {
            return this.$route.params.shopId
        }
    },
    mounted() {
        this.getNewProduct()
    },
    methods: {
        getNewProduct() {
            this.isError = false
            let params = {
                shopId: this.shopId
            }
            getNewProduct(params).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    this.newList = result
                } else {
                    this.isError = true
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.new_date {
    text-align: center;
    font-size: $auiFontSizeLevel7;
    color: $auiTextColorLight;
    position: relative;
    width: px2rem(300);
    margin: px2rem(20) auto;
    &:before,
    &:after {
        content: " ";
        position: absolute;

        top: 50%;
        height: 1px;
        border-top: 1px solid #ccc;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(.5);
        transform: scaleY(.5);
        width: px2rem(76);
    }
    &:before {
        left: 0;
    }
    &:after {
        right: 0;
    }
}
</style>
