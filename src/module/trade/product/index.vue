<!--
    Created by hity on 05/15/17
-->
<template>
    <div class="aui-page" id="product-real-detail">
        <template>
            <axd-header></axd-header>
            <axd-footer v-if="firstScreenDone" :skuPopupInstance="skuPopupInstance"></axd-footer>
            <axd-content :skuPopupInstance="skuPopupInstance"></axd-content>
        </template>
    </div>
</template>
<script>
/* global Image */
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import axdHeader from './blocks/header/index.vue'
import { resetHeader } from 'components/header/resetHeader'
import axdContent from './blocks/content/index.vue'
import axdFooter from './blocks/footer/index.vue'
import Preload from 'libs/preload_v1'
import _SkuPopup from 'src/module/trade/product/blocks/common/skuPopup.vue'

const { mapActions, mapState, mapMutations } = createNamespacedHelpers('trade/product')

export default {
    name: 'productDetail',
    data() {
        return {
            skuPopupInstance: {}, // sku弹窗的vue实例
            preloadObj: {}, // 图片分批预加载的自执行
            baseDataReady: false,
            cpsDataReady: false
        }
    },
    created() {
        this.init()
    },
    beforeRouteLeave(to, from, next) {
        this.axdErr({
            remove: true
        })
        resetHeader()
        next()
    },
    computed: {
        ...mapState({
            seckill: state => state.initData.seckill,
            trade: state => state.initData.trade,
            defaultData: state => state.defaultData,
            desc: state => state.initData.desc,
            instalment: state => state.initData.instalment,
            firstScreenDone: state => state.interactData.firstScreenDone,
            tradeInteractObj: state => state.interactData.trade,
            productId: state => state.initData.desc.productId,
            areaUpdateDone: state => state.interactData.jd.areaUpdateDone,
            productType: state => state.initData.shop.type
        }),
        isImgDataReady() {
            return this.baseDataReady && this.cpsDataReady
        },
        firstScreenImgsReady() {
            return this.preloadObj.firstSetReady
        }
    },
    watch: {
        // 初始资源加载完毕后，确认数据对应的展现
        baseDataReady(value) {
            if (value) {
                this.handleSeckillInit()
                if ((this.productType == 'JD' && this.areaUpdateDone) || this.productType != 'JD') {
                    this.initSkuPopup()
                }
            }
        },
        areaUpdateDone(newValue) {
            if ((this.productType == 'JD' && newValue) || this.productType != 'JD') {
                this.initSkuPopup()
            }
        },
        // 当base接口及cps接口的图片数据ready以后，开始预加载图片
        isImgDataReady(value) {
            if (value) {
                this.preLoadImg()
            }
        },
        // 首屏资源加载完毕，设置首屏完成的状态
        firstScreenImgsReady(value) {
            if (value) {
                this.updateInteractData({
                    targetKey: '',
                    firstScreenDone: true
                })
            }
        }
    },
    components: {
        axdHeader,
        axdContent,
        axdFooter
    },
    methods: {
        ...mapMutations([
            'updateInteractData'
        ]),
        ...mapActions([
            'getProductData',
            'getCpsSourceData',
            'getCouponSorceData',
            // 'getCouponListData',
            'getCartCountData'
        ]),
        init() {
            // 取得产品id
            let productId = this.$route.params.productId
            if (productId) {
                // 获取页面所需的数据
                this.getInfos(productId)
            } else {
                this.$_toast('无该商品')
            }

            // 拼团推荐id
            let recordId = this.$route.query.recordId
            if (recordId) {
                this.updateInteractData({
                    targetKey: 'teambuy',
                    recordId
                })
            }
        },
        initSkuPopup() {
            console.log('here sku')
            // 加载skuPopup组件
            let SkuPopup = Vue.extend(_SkuPopup)
            let popupInstance = new SkuPopup({
                el: document.createElement('div'),
                store: this.$store,
                router: this.$router
            })
            popupInstance.$el.id = 'sku-popup'
            let auiPage = document.querySelector('#product-real-detail')
            if (auiPage) {
                auiPage.appendChild(popupInstance.$el)
                this.skuPopupInstance = popupInstance
            }
        },
        getInfos(productId) {
            let me = this
            // 获取产品基本信息
            // 新人专享入参特殊
            let param = {
                'productId': productId,
                'activeType': this.$route.query.activeType
            }

            if (this.$route.query.activeType === 'chance') {
                let { xrdt, xrid } = this.$route.query
                param = Object.assign(param, { data: xrdt, sign: xrid })
            }
            this.getProductData(param).then((data) => {
                if (typeof data !== 'string') {
                    this.baseDataReady = true
                } else {
                    this._goHistoryChange(data, productId)
                }
            }, () => {
                this.axdErr({
                    errTitle: '商品详情',
                    errTip: '  ',
                    errDes: '商品已售罄，去看看其他商品吧',
                    showBtn: false
                })
            })

            // 获取cps资源位
            let params = {
                'productId': productId
            }
            this.getCpsSourceData(params).then(() => {
                this.cpsDataReady = true
            }, () => {
                this.cpsDataReady = true
            })
            this.getCouponSorceData(params)

            // 获取红包list
            // this.getCouponListData({ 'productIds': productId })

            // 获取购物车数量
            this.getCartCountData({})
        },
        handleSeckillInit() {
            let canBuy = false
            let btnTxt = '即将开始'

            if (this.seckill.isEnd) {
                this.$_toast('抱歉，来晚了，秒杀活动已结束')
                canBuy = false
                btnTxt = '立即购买'
            } else {
                canBuy = true
                btnTxt = '立即购买'
            }

            // 还没开始,等于默认值
            if (!this.seckill.isSeckillFlag) {
                canBuy = false
                btnTxt = '即将开始'
            }

            this.updateInteractData({
                targetKey: 'seckill',
                canBuy,
                btnTxt
            })
        },
        preLoadImg() {
            let imgs = [
                [
                    this.desc.bannerImgs[0].img,
                    this.defaultData.defaultImg
                ],
                [
                    this.instalment.thumbImg,
                    this.instalment.detailImg,
                    this.desc.imgUrl
                ]
            ]
            this.preloadObj = new Preload(true, imgs)
        },
        _goHistoryChange(productType, productId) {
            let name = ''
            switch (productType) {
                case 'virtual':
                    name = 'virtualDetail'
                    break
                case 'phone':
                    name = 'telrecharge'
                    break
            }
            if (!name) {
                return
            }
            this.$router.replace({
                name,
                params: {
                    productId
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

body {
    background-color: $auiBgColorDefault;
}

#product-real-detail {
    .aui-cells {
        margin-top: px2rem(20) !important;
        margin-bottom: px2rem(20);
    }
}

.com-more-icon {
    position: absolute;
    top: 0;
    right: px2rem(32);
    display: inline-block;
    width: px2rem(26);
    height: px2rem(96);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% auto;
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDI2IDYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI0NDQyIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGN4PSIzIiBjeT0iMyIgcj0iMyIvPjxjaXJjbGUgY3g9IjEzIiBjeT0iMyIgcj0iMyIvPjxjaXJjbGUgY3g9IjIzIiBjeT0iMyIgcj0iMyIvPjwvZz48L3N2Zz4=');
}

.mantissa {
    font-size: $auiFontSizeLevel5;
}

.animateImg {
    z-index: 1001;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: px2rem(200);
    height: px2rem(200);
    transform: translate(0, 0) scale(1, 1);
    transition: transform .6s cubic-bezier(0, 0, 0.79, 0.48) 0s;

    .imgIcon {
        display: block;
        width: 100%;
        height: 100%;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: contain;
        border: px2rem(1) solid #E4E4E4;
        border-radius: px2rem(4);
    }

    .animation {
        @include animation(rotate,
        .3s,
        linear,
        infinite);
    }
}

.skuTips {
    margin-left: px2rem(112);
    @include nLineLimit(1);
    width: px2rem(400);
    line-height: 140%;
}

@keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@-moz-keyframes rotate {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.Ptable {
    font-size: px2rem(28);
    line-height: px2rem(88);
    color: #222222;
    border-collapse: collapse;

    td,
    th {
        padding-left: px2rem(20);
        border: px2rem(1) #E4E4E4 solid;

        .tdTitle {
            width: px2rem(172);
        }
    }
}

.icon-back::before {
    color: #666;
    font-weight: 900;
}
</style>
