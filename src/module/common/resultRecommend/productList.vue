<!--
    Create by sunxj on 08/09/17
 -->
<template>
    <ul class="rec-product1">
        <li v-for="(item,index) in productArr" :key="index">
            <a :href="item.detailUrl">
                <img v-if="item.pCorner" :src="item.pCorner" class="corner-icon">
                <p class="img_wid">
                    <axd-image :src="item.imgUrl" :lazyParents="parentsName"></axd-image>
                </p>
                <div class="item_info">
                    <h4><span class="aui-tag_bgcolor" v-if="item.pTag">{{item.pTag}}</span><span class="aui-tag_bgcolor haitao" v-if="item.isSeaAmoy == 'y'">海淘</span>{{item.name}}</h4>
                    <p>￥<span v-html="complexMoney(item.price)"></span></p>
                </div>
            </a>
        </li>
    </ul>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import {
    formatComplexMoney
} from 'src/libs/util'
export default {
    name: 'productlist',
    props: {
        productArr: {
            type: Array
        }
    },
    data() {
        return {
            parentsName: '.aui-content'
        }
    },
    filters: {
        formatPrice(val) {
            return formatComplexMoney(val, 100, true)
        }
    },
    methods: {
        complexMoney(val) {
            return formatComplexMoney(val, 100, true)
        },
        goUrl(url) {
            window.location.href = url
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import './style.scss';

.rec-product1 { 
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
            width: 100%;
            height: px2rem(365);
            overflow: hidden;
            position: relative;
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
                .aui-tag_bgcolor {
                    background-color: $auiAttentionColor;
                    margin-right: px2rem(15);
                }
                .haitao {
                    background: #9012FE;
                    color: #fff;
                }
            }
        }
    }
}
</style>
