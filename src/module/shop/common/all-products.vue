<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div>
        <side-tab @select="selectTab"></side-tab>
        <template v-if="productList.length">
            <productlist :dt="productList"></productlist>
            <!-- <product-list :productVoList="productList | formatData"></product-list> -->
            <bottom-tips v-if="!hasNext"></bottom-tips>
            <!-- <load-more :hasNext="hasNext" @back="getMore"></load-more> -->
        </template>
    </div>
</template>
<script>
import sideTab from '../common/side-tab.vue'
import productlist from 'src/module/common/productList/index.vue'
// import loadMore from './load-more.vue'
import bottomTips from '../common/bottom-tips.vue'
export default {
    name: 'allProducts',
    props: {
        productList: Array,
        hasNext: Boolean
    },
    data() {
        return {
            fixedTop: 0,
            isFixed: false,
            sideTabs: [{
                name: '销量',
                sort: 'SALES_DESC'
            }, {
                name: '新品',
                sort: 'TIME_DESC'
            }, {
                name: '价格',
                sort: 'PRICE_ASC'
            }],
            tabIndex: 0,
            priceUp: false
        }
    },
    methods: {
        selectTab(sort, i) {
            let _sort = sort
            this.tabIndex = i
            if (i === 2) {
                this.priceUp = !this.priceUp
                _sort = this.priceUp ? 'PRICE_ASC' : 'PRICE_DESC'
            } else {
                this.priceUp = false
            }
            this.$emit('select', _sort, i)
        }
    },
    components: {
        sideTab,
        productlist,
        // loadMore,
        bottomTips
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';
.scroll_isfixed {
    width: 100%;
    position: fixed;
    left: 0;
    z-index: 11;
}

.aui-tab_side {
    @include flexbox();
    font-size: $auiFontSizeLevel5;
    color: $auiTextColorGeneral;
    height: px2rem(80);
    line-height: px2rem(80);
    text-align: center;
    background-color: #f7f7f7;
    span {
        @include flex(1);
        position: relative;
        .icon-arrow2 {
            font-size: px2rem(16);
            position: absolute;
            left: 50%;
            top: px2rem(22);
            margin-left: px2rem(56);
            &:before {
                transform: rotateZ(-90deg);
                display: block;
                color: $auiTextColorGeneral;
                transform-origin: 0 100%;
                position: relative;
                left: px2rem(2);
            }
            &:after {
                transform: rotateZ(-270deg);
                display: block;
                content: "\e900";
                color: #ccc;
                transform-origin: 0 0;
            }
        }
        &.cur {
            color: $auiTipsColor;
            .top_cur {
                &:before {
                    color: $auiTipsColor;
                }
            }
            .btm_cur {
                &:before {
                    color: $auiTextColorLight;
                }
                &:after {
                    color: $auiTipsColor;
                }
            }
        }
    }
}
</style>
