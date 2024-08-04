<!--
    Modified by mahui on 06/21/17
    Des: 修复滑动模块滑动流畅性问题
    Log: 06/21/17. 包含该模块的页面，禁用app下，向左滑动返回的功能
         07/03/17  更改了如果是商品模式，打开商品详情页面使用app的goUrl
-->
<template>
    <div type="slide" :class="classObj" v-if="!noData" :style="{backgroundColor: targetBgColor}">
        <div class="container-box-wrap"
            @touchmove="swipeMove"
            @touchstart="swipeStart"
            @touchend="swipeEnd"
            :style="{width: targetWidth,
            backgroundColor: targetBgColor,
            'transform': 'translate(' + moveDistanceX + 'px, 0px) translateZ(0px)',
            'transition-timing-function': 'ease-out',
            'transition-duration': inertiaDuration}"
            :data-name="config.title">

            <!--图片类型-->
            <a class="image" :href="item.url" v-for="item in picList">
                <axd-image :src="item.imgUrl" :lazy="false"></axd-image>
            </a>

            <!--商品列表-->
            <a class="product" @click="gotoDetail(item)" v-if="productList.length" v-for="item in productList">
                <p class="img">
                    <axd-image :src="item.productImgUrl" :lazy="false" :resizeW="280"></axd-image>
                </p>
                <p class="desc" :style="nameStyle"> {{item.productName}} </p>
                <div class="no-period" v-if="config.showFavprice">
                    <span v-if="config.showFavprice" :style="favPriceStyle">
                        <b>¥</b>{{item.productPrice | formatMoney}}
                    </span>
                    <label v-if="config.showPrice && config.showFavprice" :style="priceStyle">原价:¥{{item.originPrice | formatPrice}}</label>
                </div>
            </a>
            <!-- 更多 -->
            <a :href="moreImg.url" v-if="productList.length && config.imgUrl" class="more-link">
                <img :src="moreImg.imgUrl">
            </a>
        </div>
    </div>
</template>

<script>
import {formatColor} from 'src/libs/util'
import axdImage from 'src/components/image/index.vue'
import {getProdListByName} from 'src/store/modules/activity'

export default {
    name: 'slide',
    props: {
        config: Object
    },
    data() {
        return {
            targetWidth: 0,
            targetBgColor: '',
            inertiaDuration: '0s',
            lastMoveDistanceX: 0, // 滑动移动距离
            startX: 0,
            moveDistanceX: 0, // 滑动模块偏移量
            limitWidth: 0, // 滑动最大距离限制
            startTime: 0, // 滑动开始时间
            priceStyle: {
                color: ''
            },
            favPriceStyle: {
                color: ''
            },
            nameStyle: {
                color: ''
            },
            productList: [],
            picList: [],
            moreImg: {
                url: '',
                imgUrl: ''
            },
            noData: false
        }
    },
    computed: {
        classObj() {
            return {
                'container': true,
                'floor': this.config.floorShow && this.config.floorShow === 'y'
            }
        }
    },
    beforeMount() {
        if (this.config && this.config.blockType === 'slide' && this.config.dataType) {
            if (this.config.dataType === 'product') {
                this.getMoreBlock()
                this.getProducts()
            }
            if (this.config.dataType === 'image') {
                this.getImages()
            }
        }
        this.disableSwipe()
    },
    filters: {
        formatColor,
        formatPrice(num) {
            return (num / 100).toFixed(0)
        },
        formatMoney(num) {
            if (num.toString().length >= 7) {
                return (num / 100).toFixed(0)
            } else {
                return (num / 100).toFixed(2)
            }
        }
    },
    methods: {
        swipeStart(e) {
            this.inertiaDuration = '0s'
            let touch = e.touches[0]
            this.startX = touch.clientX
            // 记录滑动开始时间
            this.startTime = new Date().getTime()
        },
        swipeMove(e) {
            let me = this
            let containerWidth
            let bodyWidth
            me.$nextTick(() => {
                let containerBox
                let containerBoxes = document.getElementsByClassName('container-box-wrap')

                Array.prototype.map.call(containerBoxes, (box) => {
                    if (box.dataset.name === me.config.title) {
                        containerBox = box
                    }
                })

                containerWidth = containerBox.offsetWidth
                bodyWidth = document.body.offsetWidth
                me.limitWidth = containerWidth - bodyWidth
            })
            // 如果滑动模块容易的宽度没有超出body的宽度，则不能滑动
            if (me.limitWidth < 0) {
                me.moveDistanceX = 0
            } else {
                let x = e.touches[0].clientX
                let moveX = x - me.startX + me.lastMoveDistanceX

                // 判断边界条件，只在有效范围内滑动
                if (moveX > 0) {
                    me.moveDistanceX = 0
                } else if (moveX < -me.limitWidth) {
                    me.moveDistanceX = -me.limitWidth
                } else {
                    me.moveDistanceX = moveX
                }
            }
        },
        swipeEnd(e) {
            let me = this
            let curTime = new Date().getTime()

            // 滑动时间超过300ms，则不加惯性
            if (curTime - me.startTime > 300) {
                me.lastMoveDistanceX = me.moveDistanceX
                return
            }

            // 添加滑动惯性
            let endX = e.changedTouches[0].pageX
            let distance = endX - me.startX

            me.inertiaDuration = '0.46s'

            let newDistance = me.lastMoveDistanceX + 3.5 * distance

            if (newDistance <= -me.limitWidth) {
                // 滑到最右侧临界
                me.moveDistanceX = -me.limitWidth
            } else if (newDistance >= 0) {
                // 滑到最左侧临界
                me.moveDistanceX = 0
            } else {
                me.moveDistanceX = newDistance
            }

            me.lastMoveDistanceX = me.moveDistanceX
        },
        getProducts() {
            let me = this
            let productId = me.config.productListId

            me.targetBgColor = formatColor(this.config.bgColor)
            me.priceStyle.color = formatColor(this.config.priceColor)
            me.nameStyle.color = formatColor(this.config.labelColor)
            me.favPriceStyle.color = formatColor(this.config.favpriceColor)

            // 获取商品列表数据
            getProdListByName({
                type: 'id',
                idOrName: productId,
                needAll: 'true'
            }, (data) => {
                if (data.success && data.result) {
                    data.result.map((item) => {
                        // 已经下架的产品不进行显示
                        item.status === 'y' && me.productList.push(item)
                    })
                    me.productList.length > 0
                        ? me.$nextTick(me.resetWidth)
                        : me.noData = true
                } else {
                    me.noData = true
                }
            })
        },
        getMoreBlock() {
            try {
                this.moreImg.url = this.config.url
                this.moreImg.imgUrl = this.config.imgUrl
            } catch (e) {
                console.log(e)
            }
        },
        getImages() {
            try {
                let images
                typeof this.config.objList === 'string' && (images = JSON.parse(this.config.objList))
                typeof this.config.objList === 'object' && (images = this.config.objList)
                if (images.length) {
                    this.picList = images
                    this.$nextTick(this.resetWidth)
                } else {
                    this.noData = true
                }
                this.targetBgColor = formatColor(this.config.bgColor)
            } catch (e) {
                console.log(e)
            }
        },
        resetWidth() {
            let containerBox
            let itemsLength
            let me = this
            let containerBoxes = document.getElementsByClassName('container-box-wrap')

            Array.prototype.map.call(containerBoxes, (box) => {
                if (box.dataset.name === me.config.title) {
                    containerBox = box
                }
            })

            if (me.config.dataType === 'product') {
                itemsLength = me.productList.length
                // 分为有“更多”和无更多两种情况
                if (me.config.imgUrl) {
                    me.targetWidth = (itemsLength + 1) * 6.3 + 'rem'
                } else {
                    me.targetWidth = itemsLength * 6.3 + 'rem'
                }
            }
            if (me.config.dataType === 'image') {
                itemsLength = me.picList.length
                me.targetWidth = itemsLength * 6.3 + 'rem'
            }
        },
        disableSwipe() {
            window.axdApp && window.axdApp.send({
                module: 'webview',
                method: 'setSwipeBackEnable',
                params: {
                    canSwipeBack: false
                },
                callback(data) {}
            })
        },
        gotoDetail(item) {
            let pageUrl = ''

            if (item.url) {
                pageUrl = item.url || ''
            } else {
                pageUrl = window.location.origin + '/pages/mall/product/' + item.productId
            }

            if (window.aixuedai.isUavoApp === 'n') {
                window.location.href = pageUrl
            } else {
                if (pageUrl) {
                    axdApp.send({
                        module: 'navigation',
                        method: 'goURL',
                        params: {
                            url: pageUrl,
                            rootPage: 0
                        },
                        callback() {}
                    })
                }
            }
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss">
    @import 'style.scss';
    $designWidth: 750;
    .container {
        position: relative;
        width: 100%;
        height: auto;
        overflow: hidden;
        font-size: 0;
    }
    .container-box-wrap {
        height: auto;
        position: relative;
        display: inline-block;
        margin: px2rem(10) 0;
        *display: inline;
        *zoom: 1;
        display: -webkit-box;
        display: -moz-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        .product {
            background: #fff;
            width: px2rem(280);
            height: px2rem(406);
            flex: 1;
            -webkit-flex: 1;
            margin-left: px2rem(10);
            // padding-bottom: px2rem(5);

            .img {
                display: table-cell;
                /*height: px2rem(296);*/
                vertical-align: middle;
                text-align: center;
                position: relative;
                img {
                    vertical-align: middle;
                    display: inline-block;
                    max-height: px2rem(296);
                    width: 100%;
                }
            }
            .desc {
                padding: 0 px2rem(6);
                display: block;
                height: px2rem(60);
                line-height: px2rem(30);
                font-size: px2rem(24);
                overflow: hidden;
                margin-top: px2rem(5);
            }
            .no-period {
                height: px2rem(50);
                display: flex;
                display: -webkit-flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;
                align-items: center;
                padding: 0 px2rem(10);
                span {
                    color: #f63144;
                    font-size: px2rem(32);
                    b {
                        font-size: px2rem(24);
                        font-style: normal;
                    }
                }
                label {
                    color: #a4a4a4;
                    font-size: px2rem(20);
                    text-decoration: line-through;
                }
            }
        }
        .image {
            width: px2rem(280);
            margin-left: px2rem(10);
            display: block;
            div {
                width: px2rem(280);
                img {
                    width: 100%;
                    height: auto;
                }
            }
        }
        .image:last-child {
            margin-right: px2rem(10);
        }
        .more-link {
            width: px2rem(280);
            height: 100%;
            margin: 0 px2rem(10);
            overflow: hidden;
            img {
                width: px2rem(280);
            }
        }
    }
</style>
