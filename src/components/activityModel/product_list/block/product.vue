<!--
    created by daly on 10/16/18
    Des: 一行一个普通样式
    edited by daly on 02/18/19
    Des: UI改版 除了一行四个，其他全部合并到这一个模板，终于不用维护那么多模板了，感谢改版，(～￣▽￣)～
-->
<template>
    <ul :class="['pl',addClass]">
        <li class="pl__pro" v-for="(pro,index) in productList" :key="index">
            <a @click="gotoDetail(pro.summary.id)">
                <div class="pro__imgbox">
                    <axd-image :src="pro.summary.imgUrl" :resizeW="resizeW"></axd-image>
                    <!-- 广告位 -->
                    <axd-image :src="pro.saleImgUrl" :class="['pro__saleImg']" :resizeW="resizeW" v-if="!isTwoH"></axd-image>
                    <!-- 左上角tag -->
                    <span class="pro__tag" :style="cornerStyle(pro.summary.corner[0])" v-if="pro.summary.corner"></span>
                </div>
                <section class="pro__content">
                    <!-- 不是一行两个横向的都走这个模板 -->
                    <div class="pro__content1" v-if="!isTwoH">
                        <h4>
                            <!--是否海淘商品-->
                            <template v-if="showSeaAmoy">
                                <span class="pro__seaamoy" :style="{'background': tag.color}" v-for="tag in pro.summary.wordsStyle">{{ tag.name }}</span>
                            </template>
                            <!-- 名称tag -->
                            <template v-if="!isTwoH">
                               <span v-for="txt in pro.summary.tags">{{txt}}</span>
                            </template>
                            {{filterName(pro)}}
                        </h4>
                        <div class="pro__benefit">
                            <!-- 券标志 -->
                            <axd-image
                            v-if="showCpIcon(pro)"
                            :src="'http://img.aiyoumi.com/static/img/201811/28113602704.png'"
                            :imgClass="'pro__benefitImg'"></axd-image>
                            <!-- 利益点 -->
                            <span v-if="pro.advantage">{{pro.advantage}}</span>
                            <!-- 价格标签 -->
                            <template v-else>
                                <span v-for="item in pro.summary.priceTags">{{item}}</span>
                            </template>
                        </div>
                        <!-- 销量 -->
                        <p class="pro__sales" v-if="isOne">已售{{pro.showSumSale}}件</p>
                    </div>
                    <!-- 一行两个横向的模板 -->
                    <div :class="['pro__content1',{'pro__content1-special':!showProname(pro)}]" v-else>
                        <h4 v-if="showProname(pro)">
                            {{filterName(pro)}}
                        </h4>
                        <div class="pro__benefit">
                            <span v-if="pro.advantage">{{pro.advantage}}</span>
                            <template v-else>
                                <span v-for="item in pro.summary.priceTags">{{item}}</span>
                            </template>
                        </div>
                        <h4 v-if="!showProname(pro)">{{filterName(pro)}}</h4>
                    </div>
                    <!-- 以上是价格名称和利益点展示 -->
                    <!-- 以下是价格块处理 -->
                    <!-- ！！！里面不要换行，空格符占位 -->
                    <!-- 有价格展示这一块 -->
                    <template v-if="showPrice(pro.summary)" >
                        <!-- 非预售的活动模板 -->
                        <template v-if="pro.activityType!='presale'">
                            <p class="pro__monthprice" :style="monthPayColor">{{monthPayTxt}}￥<span class="pro__pricenum"  :style="monthPayColor" v-html="filterMonth(pro)"></span><span class="pro__months">x{{monthsNum(pro)}}</span></p>
                            <!-- <p v-else class="pro__monthprice" :style="monthPayColor">分期享低价</p> -->
                            <p class="pro__price" v-if="showProname(pro)||!isTwoH">
                                <span class="s1" :style="favPriceColor">{{favPriceTxt(pro)}}￥<i>{{filterPrice(pro)}}</i></span>
                                <axd-image :src="'http://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201901/25144248377.png'" v-if="pro.activityType==='vip'"></axd-image>
                                <span class="s2"  v-if="showOriginPrice(pro)">￥{{filterOrigin(pro)}}</span>
                            </p>
                        </template>
                        <!-- 预售商品版位 -->
                        <template v-else>
                            <p class="pro__monthprice" :style="favPriceColor">{{filterPresalePriceTxt(pro)}}￥<span class="pro__pricenum" v-html="filterPrice(pro)"></span></p>
                            <p class="pro__price" v-if="!isTwoH">
                                <span class="s2">￥{{filterOrigin(pro)}}</span>
                            </p>
                        </template>
                    </template>
                    <!-- 无价格展示这一块 -->
                    <template v-else>
                        <p class="pro__noPrice" :style="favPriceColor">暂无报价</p>
                        <p class="pro__noMonthPrice" v-if="!((pro.activityType === 'vip' || pro.activityType == 'normal')&&isTwoH)" :style="monthPayColor">分期享低价</p>
                    </template>
                    <!-- 按钮包含购买、预售、缺货等状态 -->
                    <div class="pro__btn pro__btn-normal" :style="btnStyle(pro)" v-if="showBtn(pro)">{{btnTxt(pro)}}</div>
                </section>
            </a>
        </li>
    </ul>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { productMixin } from '../js/product.js'
export default {
    mixins: [productMixin],
    props: {
        productList: Array,
        config: Object,
        blockType: String
    },
    components: {
        axdImage
    },
    created() {
        console.log(this.productList)
    }
}
</script>
