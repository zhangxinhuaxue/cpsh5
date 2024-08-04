<template>
    <a href="javascript:;" @click="fngo(pdata.id)">
        <div class="product-img">
            <div class="img-wrap">
                <axd-image :src="pdata.imgUrl" :lazyParents="parentsName"></axd-image>
            </div>
            <span class="tag1" v-if="pdata.goodCorner && !$_isCheck">{{pdata.goodCorner}}</span>
            <span class="tag2" v-if="pdata.saleMark && !$_isCheck">
                <img :src="pdata.saleMark" alt="">
            </span>
        </div>
        <div class="product-info">
            <div class="product-info__top">
                <div class="desc"><span class="desc-tag mr4" v-if="pdata.mark && !$_isCheck">{{pdata.mark}}</span><span class="desc-tag sea mr4" v-if="pdata.seaAmoy">海淘</span>{{pdata.name}}</div>
                <div class="discount" ref="discountTags">
                    <template v-for="(item,index) in tagData" v-if="tagData.length > 0">
                        <span class="discount-tag1" v-if="index==0" :key="index" v-show="item.isShow">
                            <img :src="item.imgSrc" alt="">
                        </span>
                        <span class="discount-tag" v-else :key="index" v-show="item.isShow">{{item.txt}}</span>
                    </template>
                </div>
            </div>
            <template v-if="pdata.showPrice==1">
            <div class="stage" v-if="!$_isCheck">
                <span v-html="moneyFormat(pdata.monthPay)"></span>x{{pdata.instalmentNum}}期
            </div>
            <div class="price">
                <p>¥{{pdata.minSkuPrice}}</p>
                <p>
                    <span v-if="ctype==='c1'">{{pdata.platform}}</span>
                    <span v-if="ctype!=='c3'">{{pdata.storageMode | storageTxt}}{{pdata.showSumSale}}件</span></p>
            </div>
            </template>
            <template v-else>
                <p class="price__desc">暂无报价</p>
                <p class="stage__desc">分期享低价</p>
            </template>
        </div>
    </a>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { getProductUrl } from 'src/libs/util'
export default {
    name: 'product',
    props: {
        ctype: String,
        pdata: Object,
        isCustomGo: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            parentsName: '.aui-content',
            disTagImg: 'http://img.aiyoumi.com/static/img/201811/28113602704.png',
            tagData: []
        }
    },
    filters: {
        storageTxt(n) {
            return n == 1 ? '已售' : '已定'
        }
    },
    created() {
        let tagArr = this.pdata.priceMark
        let hasRedPacket = this.pdata.hasRedPacket || false
        this.tagData.push({
            isShow: hasRedPacket,
            imgSrc: this.disTagImg
        })
        if (tagArr && tagArr.length > 0) {
            for (let i of tagArr) {
                this.tagData.push({
                    isShow: true,
                    txt: i
                })
            }
        }
    },
    mounted() {
        let el = this.$refs.discountTags
        let child = el.children
        let tw = el.clientWidth
        let count = 0
        if (this.tagData.length > 0) {
            this.tagData.map((item, index) => {
                count += child[index].clientWidth
                if (count > tw) {
                    item.isShow = false
                }
            })
        }
    },
    methods: {
        moneyFormat(n) {
            let m = n % 1
            if (m < 1 && m > 0) {
                let nArr = String(n).split('.')
                return `¥<em>${nArr[0]}</em><span>.${nArr[1]}</span>`
            } else {
                return `¥<em>${n}</em>`
            }
        },
        fngo(id) {
            let url = this.productUrl(id)
            if (!this.isCustomGo) {
                window.location.href = url
            } else {
                this.$emit('customGo', url)
            }
        },
        productUrl(id, statisticsString) {
            return getProductUrl(id, statisticsString)
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import './product.scss'
</style>
