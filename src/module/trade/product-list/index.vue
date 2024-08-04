<template>
<div class="container">
    <div class="page aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content" id="content" v-if="page.container">
            <div class="buttons-tab">
                <div class="tab">
                    <a href="javascript:;" v-for="(item, index) in option.optionName" :key="index" :class="{active : option.highlight == index}" @click="setoption(item, index)" class="button">
                      <span>{{item}}</span>
                      <i class="arrow" v-if="index === 0 || index === 2"></i>
                    </a>
                </div>
                <div class="sort" v-show="option.index === 0">
                  <div class="h"></div>
                  <ul>
                    <li v-for="(item, index) in sort.sortNames" :class="{on : sort.index == index}" :key="index" @click="selected(item, index)">
                      <span>{{item}}</span>
                      <i class="selected"></i>
                    </li>
                  </ul>
                </div>
                <div class="price-range" v-show="option.index === 2">
                  <div class="h"></div>
                  <div class="box">
                    <p>价格区间（元）</p>
                    <div class="priceMaxMin">
                      <input type="number" v-model="price.Min" placeholder="最低价格">
                      <span>-</span>
                      <input type="number" v-model="price.Max" placeholder="最高价格">
                      <a href="javascript:;" class="aui-btn_small" @click="getGoodsInfo(sort.index, parseFloat(price.Max*100), parseFloat(price.Min*100))">确定</a>
                    </div>
                  </div>
                </div>
                <div class="sort-dialog" @click="CloseDialog" v-show="option.index === 0 || option.index === 2"></div>
            </div>
            <productlist :dt="goods" ctype="c1"></productlist>
            <div class="goods-load" @click="nextPage('up')" v-show="page.nextPage">
                {{page.nextPageText}}
            </div>
            <axd-totop></axd-totop>
        </div>
        <div class="page js_show" v-else>
            <div id="toast_loading" class="toast">
                <div class="aui-mask_transparent"></div>
                <div class="aui-toast aui-icon_loading">
                    <i class="aui-loading"></i>
                    <p class="aui-toast__content">加载中...</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
// 1. 无账单未设置还款日url、2.无账单已设置还款日url 5. 招集令和嗨花账单共存url
import { getProductCategoryList } from 'store/modules/trade/product'
import hybridHeader from 'components/header/hybridheader.vue'
import { getProductUrl } from 'src/libs/util'
import axdTotop from 'components/totop/index.vue'
import productlist from 'src/module/common/productList/index.vue'
export default {
    name: 'app',
    data() {
        return {
            barConfig: {
                h5: {
                    title: '商品列表',
                    rightBtnShow: false // 是否显示右侧按钮
                },
                app: {
                    title: '商品列表'
                }
            },
            goods: [],
            categoryIds: this.$route.query.categoryIds, // 一级类目或者二级类目id
            categoryId: this.$route.query.categoryId, // 三级类目ID
            merchantId: this.$route.query.merchantId, // 商户ID
            text: this.$route.query.text, // 关键字搜索
            price: {
                Max: null,
                Min: null
            },
            option: {
                optionName: ['综合排序', '销量优先', '价格区间'],
                index: -1,
                highlight: 0 // 高亮
            },
            sort: {
                sortNames: ['综合排序', '价格从低到高', '价格从高到底'],
                index: 0
            },
            page: {
                start: 0,
                nextPage: true,
                nextPageText: '点击加载下一页',
                container: false // 整个页面隐藏
            },
            modalshow: false,
            loadText: '数据加载中',
            index: 0
        }
    },
    created() {
        this.init()
    },
    components: {
        hybridHeader,
        axdTotop,
        productlist
    },
    methods: {
        productUrl(id) {
            return getProductUrl(id) // {'path': '/mall/product/detail.html', 'query': { productId: id }}
        },
        setoption(item, index) {
            this.option.highlight = this.option.index = index
            if (this.option.index === 1) {
                this.init()
            }
        },
        selected(item, index) {
            if (this.sort.index === index) {
                this.CloseDialog()
            } else {
                this.sort.index = index
                this.option.optionName[0] = item
                this.init()
            }
        },
        CloseDialog(obj) {
            this.option.index = -1
        },
        getGoodsInfo(sort, Max, Min) {
            if (Min === null) {
                this.$_toast('最底价格不能空~')
            } else {
                this.init()
            }
        },
        nextPage(pages) {
            this.page.nextPageText = this.loadText
            this.init(pages)
            this.page.nextPageText = '点击加载下一页'
        },
        init(nextPage) {
            let me = this

            getProductCategoryList({
                minPrice: this.price.Min === null ? '' : this.price.Min * 100, // 最大价格
                maxPrice: this.price.Max === null ? '' : this.price.Max * 100, // 最小价格
                saleDesc: this.option.index === 1 ? 'y' : '', // 销量降序y
                priceDesc: this.sort.index === 2 ? 'y' : '', // 价格降序y
                priceAsc: this.sort.index === 1 ? 'y' : '', // 价格升序y
                qualityFactor: this.sort.index == 0 ? 'y' : '', // 综合排序
                text: this.text, // 关键字
                categoryId: this.categoryId, // 三级类目id
                categoryIds: this.categoryIds, // 一级类目或者二级类目id
                start: nextPage == 'up' ? this.page.start : this.index
            }).then(function(data) {
                if (me.option.index !== 1) {
                    me.option.index = -1
                }
                me.page.container = true
                if (data.success === true) {
                    if (me.goods.length === 0 || nextPage === undefined) {
                        me.goods = data.result.list
                    } else {
                        data.result.list.forEach(elem => {
                            me.goods.push(elem)
                        })
                    }
                    // 更新起始页
                    me.page.start = data.result.size * data.result.page.currentPage
                    // me.page.start
                    // 是否显示分页
                    if (data.result.page.nextPage === -1) {
                        me.page.nextPage = false
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
// 遮罩层距离顶部距离
$top: 86;
// $top: 90;
.money-icon {
    color: $auiAttentionColor;
    font-size: $auiFontSizeLevel7;
    line-height: px2rem(45);
    margin-right: px2rem(5);
}
.desc__price {
    font-size: $auiFontSizeLevel3;
    color: $auiAttentionColor;
    line-height: 100%;
    font-weight: bold;

}
.txt_sale {
    float: right;
    font-size: px2rem(20);
    color: #999;
}
.aui-content{
    ::v-deep .product-wrap{
        margin-top:px2rem(110);
    }
}
.buttons-tab {
    width: 100%;
    background: white;
    @include hairline(top);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    .tab {
        display: flex;
        flex-wrap: nowrap;
        text-align: center;
        font-size: $auiFontSizeLevel5;
        position: absolute;
        z-index: 1000;
        width: 100%;
    }
    .button {
        width: 100%;
        box-flex: 1;
        line-height: px2rem(88);
        background-color: #fff;
        color: $auiTextColorGeneral;
        &.active {
            color: $auiTipsColor;
            i.arrow {
                @include img2x( './img/arrow');
            }
        }
        i.arrow {
            vertical-align: middle;
            display: inline-block;
            width: px2rem(15);
            height: px2rem(10);
            background-size: 100% 100%;
            @include img2x( './img/arrow1');
        }
    }
}
.goods-load {
    margin: px2rem(20) 0;
    height: px2rem(40);
    line-height: px2rem(40);
    font-size: $auiFontSizeLevel7;
    text-align: center;
    color: $auiTextColorAssistant;
    font-weight: 100;
}
.sort-dialog {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .6);
    position: fixed;
    z-index: 12;
    top: px2rem($top);
    right: 0;
    left: 0;
    bottom: 0;
    transition-duration: 400ms;
}
.price-range {
    width: 100%;
    position: fixed;
    top: px2rem($top);
    left: 0;
    background-color: #fff;
    z-index: 900;
    .box {
        padding-top: px2rem(24);
        padding-left: px2rem(52);
        padding-bottom: px2rem(30);
    }
    p {

        line-height: px2rem(28);
        padding-bottom: px2rem(10);
        font-size: $auiFontSizeLevel6;
        color: $auiTextColorGeneral;
    }
    .priceMaxMin {

        input {
            border: px2rem(2) solid $auiLineColorLight;
            display: inline-block;
            width: px2rem(240);
            height: px2rem(52);
            line-height: px2rem(52);
            text-align: center;
            font-size: $auiFontSizeLevel7;
            color: $auiTextColorImportant;
            background-color: transparent;
            @include border-radius(px2rem(12));
        }
        input::-webkit-input-placeholder {
            color: $auiLineColorLight;
        }
        span {
            font-size: $auiFontSizeLevel7;
            color: $auiLineColorLight;
        }
    }
}
.h {
    background-color: $auiBgColorDefault;
    height: px2rem(20);
}
.sort {
    width: 100%;
    position:absolute;
    top: px2rem($top);
    left: 0;
    z-index: 20;
    background-color: #fff;
    ul {
        margin: 0 px2rem(30);
        li {
            background-color: #fff;
            @include hairline(bottom);
            line-height: px2rem(76);
            text-align: left;
            &:last-child {
                @include hairline-remove(bottom);
            }
            span {
                height: px2rem(76);
                font-size: $auiFontSizeLevel5;
                color: $auiTextColorGeneral;
            }
            i.selected {
                display: none;
                width: px2rem(30);
                height: px2rem(20);
                position: absolute;
                right: 0;
                top: px2rem(28);
            }
            &.on {
                span {
                    color: $auiTipsColor;
                }
                i.selected {
                    display: inline-block;
                    @include img2x( './img/check');
                    background-size: 100% 100%;
                }
            }
        }
    }
}
header ~ .aui-content{
  .buttons-tab{
    top: px2rem($top);
  }
  .price-range{
    top: px2rem($top * 2);
  }
}
</style>
