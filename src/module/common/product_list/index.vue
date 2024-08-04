<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <ul class="aui-product_list">
        <li v-for="item in productVoList" :key="item.id">
            <a @click="productUrl(item.id, item.statisticsString)" :key="item.id">
                <img class="corner-icon" v-if="item.goodCornerUrl" :src="item.goodCornerUrl">
                <div class="img_wid">
                    <axd-image :src="item.imgUrl" :lazyParents="parentsName"></axd-image>
                    <!-- TODO 这里有一个促销标签 、 下面还要加个销量 -->
                    <img v-if="item.saleImgUrl" class="img_cuxiao" :src="item.saleImgUrl" alt="">
                </div>
                <div class="item_info">
                    <h4><span v-if="item.tag instanceof Array" class="aui-tag_bgcolor" v-for="tag in item.tag">{{tag}}</span><span v-if="typeof item.tag === 'string' && item.tag" class="aui-tag_bgcolor">{{item.tag}}</span><span class="aui-tag_bgcolor name-tag_purple" v-if="item.isSeaAmoy === 'y'">海淘</span>{{item.name}}</h4>
                    <p>￥<span  v-html="complexMoney(item.price)"></span> <span class="txt_sale">已售<strong>{{item.showSumSale || '0'}}</strong>件</span></p>
                </div>
            </a>
        </li>
    </ul>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { formatComplexMoney, getProductUrl } from 'src/libs/util'
export default {
    name: 'productList',
    data() {
        return {
            parentsName: '.aui-content'
        }
    },
    props: {
        productVoList: Array
    },
    methods: {
        complexMoney(val) {
            return formatComplexMoney(val, 100, true)
        },
        productUrl(id, statisticsString) {
            let pageUrl = getProductUrl(id, statisticsString)
            if (this.isApp) {
                axdApp.send({
                    module: 'navigation',
                    method: 'goURL',
                    params: {
                        url: pageUrl,
                        rootPage: 0
                    },
                    callback() {}
                })
            } else {
                window.location.href = pageUrl
            }
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt20 {
    margin-top: px2rem(20);
}

.aui-product_list { 
    display: flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    li {
        width: 50%;
        margin-bottom: px2rem(20);
        &:nth-child(odd) {
            padding-right: px2rem(10);
        }
        &:nth-child(even) {
            padding-left: px2rem(10);
        }
    }
    a {
        display: block;
        background-color: #fff;
        position: relative;
        .img_wid {
            display: flex;
            align-items: center;
            width: 100%;
            height: px2rem(365);
            overflow: hidden;
            position: relative;
            &>div {
                flex: auto;
            }
        }
        .corner-icon {
            position: absolute;
            top: px2rem(22);
            left: px2rem(22);
            width: px2rem(53);
            height: px2rem(28);
            z-index: 10;
        }
        .item_info {
            padding: px2rem(20) px2rem(30) 0;
            height: px2rem(140);
            p {
                overflow: hidden;
                padding: px2rem(10) 0 px2rem(20);
                font-size: $auiFontSizeLevel4;
                color: $auiAttentionColor;
                line-height: $auiFontSizeLevel4;
            }
            h4 {
                font-size: $auiFontSizeLevel7;
                color: $auiTextColorImportant;
                line-height: $auiFontSizeLevel4;
                height: px2rem(60);
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                font-weight: normal;
                word-break: break-all;
                .aui-tag_bgcolor {
                    background-color: $auiAttentionColor;
                    margin-right: px2rem(15);
                }
                .name-tag_purple {
                    background-color: #9013fe;
                }
            }
        }
    }
    .img_cuxiao {
        position: absolute;
        left: 0;
        bottom: 0;
        max-height: px2rem(110);
        width: auto;
        max-width: 100%;
        border-radius: px2rem(4);
    }
    .txt_sale {
        float: right;
        font-size: px2rem(20);
        color: #999;
    }
    strong {
        // color: #666;
    }
}
</style>
