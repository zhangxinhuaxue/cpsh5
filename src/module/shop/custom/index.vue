<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="aui-page">
        <hybrid-header v-if="showBar" :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <recommend v-if="remConfig.isShow" :remConfig="remConfig"></recommend>
            <topic-product class="mt20" v-if="customList.length" :productList="customList"></topic-product>
            <error-page v-if="isError"></error-page>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import axdImage from 'src/components/image/index.vue'
import recommend from './recommend.vue'
import topicProduct from '../common/topic-products.vue'
import errorPage from '../common/error-tips.vue'
import { getCustomData } from 'store/modules/shop/index'

export default {
    name: 'customProducts',
    data() {
        return {
            barConfig: {
                reset: ''
            },
            showBar: false,
            barTitle: '',
            imgDefault: 'https://img.aiyoumi.com/static/img/201709/27161648258.png',
            remConfig: {},
            customList: [],
            isError: false
        }
    },
    created() {
        this.init()
    },
    activated() {
        document.title = this.barTitle
        this.barConfig.reset += '1'
    },
    methods: {
        init() {
            let customId = this.$route.params.id
            getCustomData({ customId }).then((res) => {
                if (res.success && res.result) {
                    let result = res.result
                    this.barTitle = result.name || '...'
                    document.title = this.barTitle
                    this.showBar = true
                    let remObj = {
                        isShow: true,
                        imgUrl0: result.mainFocusBackgroupImgUrl || this.imgDefault,
                        url0: result.mainFocusProductUrl || '',
                        imgUrl1: result.focus1BackgroundImgUrl || this.imgDefault,
                        url1: result.focus1ProductUrl || '',
                        imgUrl2: result.focus2BackgroundImgUrl || this.imgDefault,
                        url2: result.focus2ProductUrl || '',
                        imgUrl3: result.focus3BackgroundImgUrl || this.imgDefault,
                        url3: result.focus3ProductUrl || ''
                    }
                    this.remConfig = Object.assign(this.remConfig, remObj)
                    this.customList = result.topicList
                } else {
                    this.isError = true
                }
            })
        }
    },
    components: {
        hybridHeader,
        axdImage,
        recommend,
        topicProduct,
        errorPage
    }
}
</script>
