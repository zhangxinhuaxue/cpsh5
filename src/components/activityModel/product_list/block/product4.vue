<!--
    created by daly on 11/20/18
    Des: 一行四个样式
    四种商品类型长一个样，不用区分了
-->
<template>
    <ul :class="['pl',{'notFour':productList.length%4}]">
        <template v-for="(pro,index) in productList">
            <li class="pl__pro" :key="index">
                <a @click="gotoDetail(pro.summary.id)">
                    <div class="pro__imgbox">
                        <axd-image :src="pro.summary.imgUrl" :resizeW="144"></axd-image>
                        <span class="pro__benefit" v-if="pro.advantage">{{pro.advantage}}</span>
                    </div>
                    <section class="pro__content" :style="blockStyle">
                        <h4>{{filterName(pro)}}</h4>
                        <p class="pro__price pro__price-normal" v-if="showPrice(pro.summary)">
                            <span class="s1" :style="favPriceColor"><i>￥</i>{{filterPrice(pro)}}</span>
                            <axd-image :src="'http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201901/25144248377.png'" v-if="pro.activityType==='vip'"></axd-image>
                            <span class="s2" :style="originColor" v-if="showOriginPrice(pro)">{{filterOrigin(pro)}}</span>
                        </p>
                        <p v-else class="pro__noPrice" :style="favPriceColor">暂无报价</p>
                    </section>
                </a>
            </li>
        </template>
    </ul>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { formatColor } from 'src/libs/util'
import { productMixin } from '../js/product'
export default {
    name: 'product_four',
    mixins: [productMixin],
    props: {
        productList: Array,
        config: Object,
        blockType: String
    },
    computed: {
        originColor() {
            return {
                'color': formatColor(this.config.extJsonObj.originalPriceColor)
            }
        },
        blockStyle() {
            let a = formatColor(this.config.extJsonObj.priceBgColor1)
            let b = this.config.extJsonObj.priceBgColor2 && formatColor(this.config.extJsonObj.priceBgColor2)
            if (b) {
                return {
                    backgroundImage: 'linear-gradient(to right,' + a + ', ' + b + ')'
                }
            } else {
                return {
                    background: a
                }
            }
        }
    },
    components: {
        axdImage
    }
}
</script>
