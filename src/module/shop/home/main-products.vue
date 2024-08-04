<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div>
        <axd-image v-if="mainFocusType === 'static'" :src="mainFocusImgUrl"></axd-image>
        <a v-else @click="goUrl(mainFocusType)">
            <axd-image :src="mainFocusImgUrl"></axd-image>
        </a>
        <topic-product v-if="topicList" :productData="topicList"></topic-product>
        <error-page v-if="isError"></error-page>
        <a class="aui-btn_border btn_all" @click="seeALlPro(1)">查看全部商品</a>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import axdImage from 'src/components/image/index.vue'
import topicProduct from '../common/topic-products.vue'
import errorPage from '../common/error-tips.vue'
import { getShopTopicList } from 'store/modules/shop/index'
const { mapState, mapMutations } = createNamespacedHelpers('shop')
export default {
    name: 'mainProducts',
    props: {
        productList: Array
    },
    data() {
        return {
            isError: false,
            topicList: null
        }
    },
    computed: {
        ...mapState({
            id: state => state.initShopData.id,
            shopId: state => state.initShopData.shopId,
            mainFocusType: state => state.initShopData.mainFocusType,
            mainFocusContent: state => state.initShopData.mainFocusContent,
            mainFocusImgUrl: state => state.initShopData.mainFocusImgUrl
        })
    },
    components: {
        axdImage,
        topicProduct,
        errorPage
    },
    mounted() {
        this.getShopTopic()
    },
    methods: {
        ...mapMutations([
            'saveMainTabIndex'
        ]),
        getShopTopic() {
            this.isError = false
            let params = {
                relateId: this.id
            }
            getShopTopicList(params).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    this.topicList = result
                } else {
                    this.isError = true
                }
            })
        },
        goUrl(type) {
            if (type === 'custom') {
                // window.location.href = '/pages/shop/custom/' + obj.content
                this.$router.push({
                    name: 'customProducts',
                    params: {
                        id: this.mainFocusContent
                    }
                })
            } else if (type === 'product') {
                window.location.href = '/pages/mall/product/' + this.mainFocusContent
                // this.$router.push({
                //     name: 'product',
                //     params: {
                //         productId: this.mainFocusContent
                //     }
                // })
            }
        },
        seeALlPro(i) {
            this.saveMainTabIndex(i)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.btn_all {
    width: px2rem(278);
    margin: px2rem(12) auto px2rem(35);
    display: block;
}
</style>
