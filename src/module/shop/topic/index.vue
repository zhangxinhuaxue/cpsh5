<template>
    <div class="aui-page">
        <hybrid-header v-if="showBar" :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <productlist v-if="topicList.length" :dt="topicList"></productlist>
            <error-page v-if="isError"></error-page>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import productlist from 'module/common/productList/index.vue'
import errorPage from '../common/error-tips.vue'
import { getTopicData } from 'store/modules/shop/index'

export default {
    name: 'groupProducts',
    data() {
        return {
            barTitle: '...',
            showBar: false,
            topicList: [],
            isError: false
        }
    },
    computed: {
        barConfig() {
            let obj = {
                h5: {
                    // title: this.barTitle,
                    rightBtnShow: false
                },
                app: {
                    // title: this.barTitle,
                    rightBtnShow: false
                }
            }
            return obj
        }
    },
    mounted() {
        this.init()
    },
    activated() {
        document.title = this.barTitle
    },
    methods: {
        init() {
            let id = this.$route.params.id
            getTopicData({ id }).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    this.barTitle = result.name || '专题'
                    document.title = this.barTitle
                    this.showBar = true
                    this.topicList = result.productVoList || []
                } else {
                    this.isError = true
                }
            })
        }
    },
    components: {
        hybridHeader,
        productlist,
        errorPage
    }
}
</script>
