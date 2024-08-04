<!--
    Modified by limeng on 12/20/17
    Des: 修改关于一行两列、一行三列、一行一列的排版判断
-->
<template id="header-template">
    <div :data-name="config.title" :class="classObj" :style="floorBg" type="productlist">
        <div class="titlebox">
            <a :href="moreUrl">
                <axd-image :src="titleImage"></axd-image>
            </a>
        </div>
        <section :class="blockClass()" v-if="datalist.length">
            <template v-for="item in datalist">
                <axd-product :product="item" :cfgTxt="cfgTxt"></axd-product>
            </template>
        </section>
    </div>
</template>
<script>
import axdProduct from './product.vue'
import { getProdListByName } from 'src/store/modules/activity'
import { formatColor } from 'src/libs/util'
import axdImage from 'src/components/image/index.vue'
export default {
    name: 'productlist',
    data() {
        return {
            datalist: [],
            _config: {},
            floorBg: {
                backgroundColor: formatColor(this.config.bgColor)
            },
            price: {
                'style': {
                    color: formatColor(this.config.favPriceColor)
                },
                'text': this.config.favPriceTxt || '优惠价'
            },
            mPrice: {
                'style': {
                    color: formatColor(this.config.monthPayColor)
                },
                'text': this.config.monthPayTxt || '月供'
            },
            btn: {
                'style': {
                    color: formatColor(this.config.buttonTxtColor),
                    backgroundColor: formatColor(this.config.buttonColor)
                },
                'text': this.config.buttonTxt || '立即购买'
            },
            moreUrl: this.config.moreUrl || 'javascript:',
            blockStyle: ''
        }
    },
    props: ['titleImage', 'templateId', 'config', 'onlyPro'],
    components: {
        axdImage,
        axdProduct
    },
    computed: {
        cfgTxt() {
            return {
                big: this.mPrice,
                small: this.price,
                btn: this.btn
            }
        },
        classObj() {
            if (this.onlyPro) {
                return {
                    'tab-content': true,
                    'floor': true
                }
            } else {
                return {
                    'tab-content': true,
                    'floor': this.config.floorShow && this.config.floorShow === 'y'
                }
            }
        }
    },
    beforeMount() {
        this.getProducts()
    },
    methods: {
        blockClass() {
            let classObj = {
                product_one: 'pro__one',
                product_two: 'pro__two',
                product_three: 'pro__three'
            }

            this.blockStyle = this.config.blockLayoutStyle || 'product_two'
            return ['product__list', classObj[this.blockStyle]]
        },
        getProducts() {
            let that = this
            let blockStyle = this.config.blockLayoutStyle || 'product_two'

            getProdListByName({
                type: 'id',
                idOrName: that.templateId,
                needAll: 'true'
            }, (data) => {
                if (data.success && !!data.result) {
                    let result = data.result
                    let priceSeq = this.config.priceSeq || ''
                    let hasPriceSeqOder = false
                    let orderArr = {}
                    let sort = []
                    let i = 1
                    let deepCopy = function(obj) {
                        if (typeof obj != 'object') {
                            return obj
                        }
                        var newobj = {}
                        for (var attr in obj) {
                            newobj[attr] = deepCopy(obj[attr])
                        }
                        return newobj
                    }

                    // 在此处理 月供，原价，优惠价的顺序,将数据存放在 priceOrder 中
                    if (priceSeq) {
                        hasPriceSeqOder = true
                        orderArr = JSON.parse(priceSeq)

                        // orderArr 会有多种情况
                        for (let item in orderArr) {
                            if (!orderArr[item]) {
                                orderArr[item] = 0
                            }
                            orderArr[item] = parseInt(orderArr[item])
                            sort.push(orderArr[item])
                        }
                        sort.sort((a, b) => { return a - b })
                        sort.map(item => {
                            if (item > 0) {
                                for (let s in orderArr) {
                                    if (orderArr[s] === item) {
                                        orderArr[s] = i
                                        i++
                                    }
                                }
                            }
                        })
                    }

                    that.datalist = []
                    result.forEach((el) => {
                        if (el.status && el.status === 'y') {
                            that.datalist.push({
                                id: el.productId,
                                name: el.productName,
                                imgUrl: el.productImgUrl,
                                saleImgUrl: el.saleImgUrl,
                                price: el.productPrice,
                                mprice: el.monthPay,
                                oriprice: el.originPrice,
                                cornerUrl: el.cornerUrl,
                                url: el.url,
                                hasPriceSeqOder,
                                priceOrder: orderArr,
                                productStyle: that.config.productStyle,
                                productSummary: el.productSummary,
                                blockLayoutStyle: blockStyle,
                                showSumSale: el.showSumSale
                            })
                        } else {
                            console.log('商品下架： id=' + el.productId)
                        }
                    })

                    // 当商品为一行两列或者一行三列的时候，判断商品列表的个数
                    if (blockStyle === 'product_two' || blockStyle === 'product_three') {
                        let dataLength = that.datalist.length
                        let flagNum = blockStyle === 'product_two' ? 2 : 3
                        let litNum = dataLength % flagNum
                        let targetObj = deepCopy(that.datalist[dataLength - 1])

                        if (litNum) {
                            // 一行两列： 添加一个商品
                            targetObj.shouldHide = true
                            if (blockStyle === 'product_two') {
                                that.datalist.push(targetObj)
                            }
                            if (blockStyle === 'product_three') {
                                for (let i = 0; i < 3 - litNum; i++) {
                                    that.datalist.push(targetObj)
                                }
                            }
                        }
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
$designWidth: 750;

.product__list {
    width: px2rem(730);
    margin: 0 auto;
}

.pro__one {
    overflow: hidden;
    padding-top: px2rem(20);

    a {
        width: px2rem(710);
        height: px2rem(260);
        position: relative;
        margin: 0 auto px2rem(20);
        background-color: #fff;
    }

    p.img {
        width: px2rem(250);
        height: px2rem(250);
        line-height: px2rem(32);
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
    }

    .img_cuxiao {
        max-height: px2rem(83) !important;
    }

    p.desc {
        position: absolute;
        width: px2rem(420);
        left: px2rem(270);
        top: px2rem(30);
        font-size: px2rem(26);
        height: px2rem(60);
        line-height: px2rem(30);
        padding-left: 0;
    }

    .product__price {
        position: absolute;
        left: px2rem(270);
        top: px2rem(80);
        width: px2rem(420);
        height: px2rem(90);
        padding-right: px2rem(20);

        .block_up {
            font-size: 0;
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
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            -ms-flex-pack: distribute;
            justify-content: flex-start;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            align-content: flex-start;

            span:first-child {
                font-size: px2rem(28);
                line-height: px2rem(60);
            }

            .price__old {
                font-size: px2rem(20);
                display: inline-block;
                border-left: solid 1px #d8d8d8;
                padding-left: px2rem(10);
                margin-left: px2rem(10);
                text-decoration: line-through;
            }
        }

        .label_list {
            position: absolute;
            top: px2rem(50);
            display: flex;
        }

        .tag__price {
            font-size: px2rem(16);
            color: #fff;
            background: #ffa944;
            line-height: px2rem(25);
            height: px2rem(25);
            display: block;
            padding: 0 px2rem(10);
            border-radius: px2rem(3);
            margin-left: px2rem(10);
        }
    }

    .btn__buy_now {
        display: block;
        height: px2rem(50);
        font-size: px2rem(22);
        line-height: px2rem(50);
        border: none;
        border-radius: px2rem(6);
        position: absolute;
        left: px2rem(270);
        bottom: px2rem(30);
        padding: 0 px2rem(18);
    }

    .btn__buy_period {
        position: absolute;
        left: px2rem(270);
        bottom: px2rem(30);
        border-radius: px2rem(6);
        border: solid 1px #fd2d54;
        color: #fd2d54;
        font-size: 0;

        span {
            display: inline-block;
            height: 100%;
            font-size: px2rem(22);
            line-height: px2rem(50);
            height: px2rem(50);
        }

        span:first-child {
            padding: 0 px2rem(23);
        }

        span:last-child {
            background: #fd2d54;
            color: #fff;
            text-align: center;
            padding: 0 px2rem(10);
        }
    }
}

.pro__two,
.pro__three {
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
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    align-content: flex-start;
}

.pro__two {
    padding-top: px2rem(20);

    a {
        width: px2rem(345);
        margin-bottom: px2rem(20);
    }
}

.pro__three {
    a {
        width: px2rem(230);
        margin-bottom: px2rem(10);

        .img {
            height: px2rem(230);
        }

        .img_cuxiao {
            max-height: px2rem(76) !important;
        }
    }

    .tag__name,
    .tag__seaamoy {
        display: none;
    }
}

.pro__three_price,
.pro__three_month {
    font-size: px2rem(22);
    padding-left: px2rem(10);
}
</style>
