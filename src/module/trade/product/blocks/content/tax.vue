<!--
    Created by hity on 05/15/17
-->
<template>
    <p class="tax" @click="popup()">
        <span class="title">商品税：</span>
        <template v-if="tax">
            <span class="money-icon">¥</span>
            <span class="price" v-html="complexMoney(tax, 100, false)"></span>(已包含在商品价格中)<i class="icon-ask"></i>
        </template>
        <span v-if="!tax">包税<i class="icon-ask"></i></span>
    </p>
</template>
<script>
import { mapState } from 'vuex'
import createPopup from 'src/module/trade/product/blocks/common/createPopup'

export default {
    mixins: [createPopup],
    data() {
        return {
            config: {
                title: '商品进口税费',
                type: 'tax',
                contentHtml: '<p style="color:#222;font-size:0.59733rem;">进口税=商品完税价格(包括运费)*税率</p><p style="color:#666;font-size:0.512rem;">当前税费仅供参考，已包含在商品价格中</p>'
            }
        }
    },
    computed: {
        ...mapState('trade', {
            tax: state => state.product.initData.desc.tax
        })
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    .tax {
        font-size: px2rem(24);
        line-height: 120%;
        color: #222;
        background: #fff;
        padding: 0 px2rem(32) px2rem(18);
        .title {
            color: #666;
        }
        .icon-ask {
            padding-left: px2rem(6);
            font-size: px2rem(30);
            line-height: 120%;
            &::before {
                position: relative;
                top: px2rem(6);
                color: #666;
                font-size: px2rem(30);
                line-height: 120%;
            }
        }
    }
</style>
