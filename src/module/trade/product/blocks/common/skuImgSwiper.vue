<!--
    Created by yangjun on 08/01/17
-->
<template>
    <div v-if="show" class="imgSwiper" @click="closeImgSwiper">
        <axd-swiper :swipe-data='imgList' :config='swipeConfig' :otherName="'skuImg-swiper'" :useDefault="false"></axd-swiper>
        <span class="skuName">{{skuName}}</span>
    </div>
</template>
<script>
import Vue from 'vue'
import {
    AXD
} from 'libs/util'
import axdSwiper from 'components/swipe/swipe_v1.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('trade/product')
export default {
    name: 'skuImgSwiper',
    data() {
        let that = this
        return {
            swipeConfig: {
                initialSlide: that.$store.state.trade.product.interactData.trade.skuImgIndex,
                isShowBullets: true,
                pagination: '.swiper-pagination',
                paginationType: 'fraction',
                loop: false,
                onSlideChangeEnd: function(swiper) {
                    that.nowIndex = swiper.activeIndex
                }
            },
            nowIndex: that.$store.state.trade.product.interactData.trade.skuImgIndex,
            show: true
        }
    },
    computed: {
        ...mapState({
            imgList: state => state.interactData.trade.skuImgList,
            skuImgIndex: state => state.interactData.trade.skuImgIndex
        }),
        skuName() {
            return this.imgList[this.nowIndex].skuName
        }
    },
    watch: {
        nowIndex(newVal) {
            this.skuName = this.imgList[newVal].skuName
        }
    },
    components: {
        axdSwiper
    },
    methods: {
        closeImgSwiper() {
            this.show = false
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.imgSwiper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 1001;
}

.imgSwiper .swiper-pagination {
    color: #999;
    font-size: px2rem(34);
    letter-spacing: px2rem(-2);
}

.skuName {
    position: absolute;
    bottom: px2rem(182);
    left: 50%;
    white-space: nowrap;
    -webkit-transform: translate(-50%);
    transform: translate(-50%);
    line-height: px2rem(50);
    border-radius: px2rem(25);
    background-color: rgba(0, 0, 0, .8);
    color: #fff;
    z-index: 1;
    padding: 0 px2rem(24);
    font-size: px2rem(34);
    max-width: px2rem(580);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

</style>
