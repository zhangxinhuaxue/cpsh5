<!--
    Modified by limeng on 10/31/17
    1.修复角标显示问题，更改为根据角标的图片大小进行显示
    2.角标图片做了是否支持webp的兼容判断

    modified by limeng on 12/21/17
    API调整角标字段，一行两列去掉按钮
    tags: 名称标签
    corner: 角标
    priceTags: 价格标签
    isSeaAmoy：是否是海淘商品 y：是
    wordsStyle：海淘样式
-->
<template>
    <a @click="gotoDetail" :style="productOpicity">
        <p class="img">
            <axd-image :src="imgUrl"></axd-image>
            <span class="corner" :style="cornerbg"></span>
            <img v-if="saleImgUrl" class="img_cuxiao" :src="saleImgUrl" alt="">
            <!-- TODO -->
        </p>
        <p class="desc">
            <!--名称标签-->
            <template v-if="product.productSummary.tags">
                <span v-for="tag in product.productSummary.tags" class="tag__name">{{ tag }}</span>
            </template>
            <!--是否海淘商品-->
            <template v-if="product.productSummary.isSeaAmoy === 'y'">
                <span class="tag__seaamoy"
                    :style="{'background': tag.color}"
                    v-for="tag in product.productSummary.wordsStyle">
                    {{ tag.name }}
                </span>
            </template>

            {{product.name}}
        </p>

        <!--一行两列的情况-->
        <template v-if="product.blockLayoutStyle == 'product_two'">
            <p v-if="normal" class="p_text1" :style="section1.style" v-html="section1.html"></p>
            <p v-if="normal" class="p_text2 clearfix">
                <span :style="section2.style" v-html="section2.html"></span>
                <span class="del" :style="section3.style" v-html="section3.html"></span>
            </p>

            <!--没有价格的情况-->
            <div v-if="noPrice" class="no-price">
                <div>
                    月供:
                    <label>¥
                        <b>{{ product.mprice | formatMoney }}</b>起
                    </label>
                </div>
            </div>

            <!--没有分期数的情况-->
            <div v-if="noPeriod" class="no-period">
                <span>
                    <b>¥</b>
                    {{ product.price | formatMoney }}
                </span>
                <label>月供: ¥{{ product.mprice | formatMoney }}</label>
            </div>
        </template>

        <!--一行三列的情况-->
        <template v-if="product.blockLayoutStyle === 'product_three'">
            <!--优惠价-->
            <div class="pro__three_price"
                :style="cfgTxt.small.style"
                v-if="!noPrice">¥{{ product.price | formatMoney }}</div>
            <!--月供-->
            <p class="pro__three_month"
                :style="cfgTxt.big.style"
                v-if="!noPeriod">月供: ¥{{ product.mprice | formatMoney }}起</p>
        </template>

        <!--一行一个的情况-->
        <template v-if="product.blockLayoutStyle === 'product_one'">
            <div class="product__price">
                <div class="block_up">
                    <span :style="cfgTxt.small.style">¥{{ product.price | formatMoney }}</span>
                    <span :style="cfgTxt.small.style" class="price__old" v-if="!noOriPrice">¥{{ product.oriprice | formatInt }}</span>
                    <span class="txt_sale">已售<strong>{{product.showSumSale || '0'}}</strong>件</span>
                </div>
                <!--价格标签-->
                <div v-if="product.productSummary.priceTags" class="label_list">
                    <label v-for="tag in product.productSummary.priceTags" class="tag__price">{{ tag }}</label>
                </div>
            </div>
            <!--没有月供的情况显示 “立即购买” 按钮-->
            <button v-if="noPeriod" class="btn__buy_now" :style="cfgTxt.btn.style">{{ cfgTxt.btn.text }} &gt;</button>
            <div v-if="!noPeriod"
                :style="{'borderColor': cfgTxt.btn.style.backgroundColor}"
                class="btn__buy_period">
                <span :style="cfgTxt.big.style">月供 ¥{{ product.mprice | formatMoney }}起</span>
                <span :style="cfgTxt.btn.style">{{ cfgTxt.btn.text }} &gt;</span>
            </div>
        </template>
    </a>
</template>
<script type="text/javascript">
import {formatImgWH, formatImg} from 'src/libs/util'
import axdImage from 'src/components/image/index.vue'
import {saveAym} from 'src/store/api'
import * as util from 'src/libs/util'
export default {
    name: 'product',
    data() {
        return {
            labelImg: 'https://img.aiyoumi.com/null/201895/09152489/20180905091524_750x146.jpg',
            section1: {},
            section2: {},
            section3: {},
            normal: true,
            noPeriod: false,
            noPrice: false,
            noOriPrice: false
        }
    },
    props: {
        product: {},
        cfgTxt: {}
    },
    filters: {
        formatInt(num) {
            if (isNaN(parseFloat(num))) {
                return num
            } else if (num === null || num === undefined || num === 0 || num === '') {
                return '0'
            } else {
                return (parseFloat(num) / 100).toFixed(0)
            }
        },
        formatMoney(num) {
            if (num) {
                let price = (parseFloat(num) / 100).toFixed(2)
                if (price.indexOf('.00') > 0) {
                    return parseInt(price).toFixed(0)
                } else {
                    return price
                }
            } else {
                return '0'
            }
        }
    },
    computed: {
        imgUrl() {
            return this.product.imgUrl
        },
        saleImgUrl() {
            return this.product.saleImgUrl
        },
        cornerbg() {
            let corners = this.product.productSummary.corner

            if (corners && corners.length) {
                let corner = corners[0]
                let widthAndHeight = formatImgWH(corner)
                let backgroundImage = 'url(' + formatImg(corner) + ')'
                let width
                let height

                if (widthAndHeight.length > 1) {
                    width = this.computedSize(widthAndHeight[0])
                    height = this.computedSize(widthAndHeight[1])

                    return {
                        width,
                        height,
                        backgroundImage
                    }
                } else {
                    return {
                        backgroundImage
                    }
                }
            }
        },
        productOpicity() {
            if (this.product.shouldHide) {
                return {
                    opacity: 0
                }
            }
        }
    },
    methods: {
        gotoDetail() {
            this.normalHandle()
        },
        getSpm() {
            let spmArray = window.location.search.match(/_spm_=([\d]+[^&])/)
            let _spm_ = ''
            if (spmArray && spmArray[1]) {
                _spm_ = spmArray[1]
            }
            return _spm_
        },
        normalHandle() {
            let pageUrl = ''
            if (this.product.url) {
                // 判断pageUrl是否为相对连接
                if (this.product.url.indexOf('http://') >= 0 || this.product.url.indexOf('https://') >= 0) {
                    pageUrl = this.product.url
                } else {
                    pageUrl = window.location.origin + this.product.url
                }
            } else {
                pageUrl = window.location.origin + '/pages/mall/product/' + this.product.id
            }
            if (window.aixuedai.isUavoApp === 'n') {
                window.location.href = pageUrl
            } else {
                if (pageUrl) {
                    saveAym(encodeURIComponent(pageUrl))

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
        },
        // 将px转化为rem
        computedSize(px) {
            // $px*320/$designWidth/20 + rem;
            return (px * 320 / 750 / 20) + 'rem'
        },
        formatNewMoney(num) {
            if (num) {
                let price = (parseFloat(num) / 100).toFixed(2)
                if (price.indexOf('.00') > 0) {
                    return parseInt(price).toFixed(0)
                } else {
                    return price
                }
            } else {
                return '0'
            }
        }
    },
    components: {
        axdImage
    },
    created() {
        // 处理没有价格、期数的情况
        let productStyle = this.product.productStyle || 0
        if (productStyle === 1) {
            // 没有价格
            this.noPrice = true
            this.normal = false
            this.noPeriod = false
        }
        if (productStyle === 2) {
            // 没有分期数
            this.noPrice = false
            this.normal = false
            this.noPeriod = true
        }

        // 1. 月供  2. 优惠价  3. 原价
        let text1 = this.formatNewMoney(this.product.mprice) + 'x24'
        let text2 = this.formatNewMoney(this.product.price)
        let text3 = this.formatNewMoney(this.product.oriprice)

        // 处理排序的逻辑
        if (this.product.hasPriceSeqOder) {
            let priceOrder = this.product.priceOrder
            let hideLength = 0

            // 计算有多少个隐藏的选项
            for (var i in priceOrder) {
                if (!priceOrder[i]) {
                    hideLength++
                }
            }

            for (i = 0; i < hideLength; i++) {
                this['section' + (3 - i)].show = false
            }

            // 月供
            if (priceOrder.monthPay) {
                this['section' + priceOrder.monthPay] = {
                    show: true,
                    style: this.cfgTxt.big.style,
                    html: this.cfgTxt.big.text + ':<em>¥' + text1 + '</em>'
                }
                this.noPeriod = false
            } else {
                this.product.blockLayoutStyle !== 'product_two' && (this.noPeriod = true)
            }

            // 优惠价
            if (priceOrder.price) {
                this['section' + priceOrder.price] = {
                    show: true,
                    style: this.cfgTxt.small.style,
                    html: this.cfgTxt.small.text + ':<em>¥' + text2 + '</em>'
                }
                this.noPrice = false
            } else {
                this.product.blockLayoutStyle !== 'product_two' && (this.noPrice = true)
            }

            // 原价
            if (priceOrder.origPrice) {
                this['section' + priceOrder.origPrice] = {
                    show: true,
                    style: '',
                    html: '原价:¥' + text3
                }
                this.noOriPrice = false
            } else {
                this.noOriPrice = true
            }
        } else {
            this.section1 = {
                show: true,
                style: this.cfgTxt.big.style,
                html: this.cfgTxt.big.text + ':<em>¥' + text1 + '</em>'
            }
            this.section2 = {
                show: true,
                style: this.cfgTxt.small.style,
                html: this.cfgTxt.small.text + ':<em>¥' + text2 + '</em>'
            }
            this.section3 = {
                show: true,
                style: '',
                html: '原价:¥' + text3
            }
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
.fr {
    float: right;
}

em {
    font-style: normal;
}

.pt30 {
    padding-top: px2rem(30);
}
.txt_sale {
    font-size: px2rem(20);
    color: #999;
    flex: 1;
    text-align: right;
}
strong {
    // color: #666;
}
.product__list {
    a {
        display: block;
        background: #fff;
        padding-bottom: px2rem(1);
    }
    .img {
        display: table-cell;
        height: px2rem(296);
        vertical-align: middle;
        text-align: center;
        position: relative;
        img {
            vertical-align: middle;
            display: inline-block;
            max-height: px2rem(296);
        }
        .corner {
            position: absolute;
            top: px2rem(10);
            left: px2rem(10);
            width: px2rem(110);
            height: px2rem(110);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: 0 0;
        }
        .img_cuxiao {
            position: absolute;
            left: 0;
            bottom: 0;
            max-height: px2rem(98);
            max-width: 100%;
            width: auto;
            border-radius: px2rem(4);
        }
    }
    .desc {
        padding: 0 px2rem(10);
        display: block;
        height: px2rem(60);
        line-height: px2rem(30);
        font-size: px2rem(20);
        text-overflow: ellipsis;
        color: #666666;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }
    .p_text1 {
        padding: 0 px2rem(10);
        font-size: px2rem(22);
        color: #f13d48;
        // margin-top: px2rem(5);
        white-space: nowrap;
        em {
            // font-size: px2rem(32);
        }
    }
    .p_text2 {
        white-space: nowrap;
        padding: 0 px2rem(10);
        font-size: px2rem(18);
        color: #666;
        span {
            letter-spacing: px2rem(-1);
            &.del {
                float: right;
                text-decoration: line-through;
            }
        }
        span:first-child {
            font-size: px2rem(18);
            color: #666;
        }
        span:last-child {
            font-size: px2rem(18);
            color: #666;
        }
    }
    .price {
        padding: 0 px2rem(10);
        font-size: px2rem(22);
        color: #f13d48;
        margin-top: px2rem(5);
        white-space: nowrap;
        em {
            font-size: px2rem(32);
        }
    }
    .price_desc {
        padding: 0 px2rem(10);
        span {
            letter-spacing: px2rem(-1);
        }
        span:first-child {
            font-size: px2rem(18);
            color: #666;
        }
        span:last-child {
            font-size: px2rem(18);
            color: #666;
        }
    }
    .no-period {
        position: relative;
        height: px2rem(70);
        span {
            color: #f63144;
            font-size: px2rem(24);
            position: absolute;
            left: px2rem(12);
            b {
                font-size: px2rem(14);
                font-style: normal;
            }
        }
        label {
            position: absolute;
            left: px2rem(12);
            top: px2rem(33);
            color: #a4a4a4;
            font-size: px2rem(18);
        }
    }
    .no-price {
        position: relative;
        div {
            color: #a4a4a4;
            font-size: px2rem(18);
            display: inline-block;
            margin-left: px2rem(12);
            margin-bottom: px2rem(12);
        }
        label {
            color: #f63144;
            font-size: px2rem(22);
        }
    }
}
.tag__seaamoy, .tag__name {
    display: inline-block;
    font-size: px2rem(18);
    line-height: px2rem(24);
    height: px2rem(24);
    color: #fff;
    border-radius: px2rem(3);
    padding: 0 px2rem(6);
    position: relative;
    bottom: px2rem(2);
}
.tag__name {
    background: #F66045;
}
</style>
