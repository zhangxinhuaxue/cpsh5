<!--
    Created by hity on 07/31/17
-->
<template>
    <div class="aui-cell">
        <p class="spec" @click="popup()">
            规格参数
            <span class="aui-tag_border ml56" v-if="buyMininum > 1">{{buyMininum}}件起售</span>
            <span class="com-more-icon more"></span>
        </p>
    </div>
</template>
<script>
import createPopup from 'src/module/trade/product/blocks/common/createPopup'
import { getSpec } from 'store/modules/trade/product'
import { mapState, mapActions } from 'vuex'
export default {
    mixins: [createPopup],
    data() {
        return {
            config: null,
            openPopup: false
        }
    },
    created() {
        this.config = {
            title: '规格参数',
            type: 'spec'
        }
        this.getSpecInfo({
            skuId: this.skuId
        })
    },
    computed: {
        ...mapState('trade/product', {
            skuId: state => state.interactData.trade.skuId,
            productType: state => state.initData.shop.type,
            specInfo: state => state.initData.jd.spec,
            buyMininum: state => state.initData.trade.buyMininum
        }),
        hasJdSku() {
            return this.skuId > 0 && this.productType == 'JD'
        }
    },
    watch: {
        skuId(newValue) {
            if (newValue) {
                this.getSpecInfo({
                    skuId: newValue
                })
            }
        }
    },
    methods: {
        ...mapActions('trade/product', [
            'getSpecInfo'
        ])
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
    .spec {
        width: 100%;
        font-size: $auiFontSizeLevel5;
        line-height: px2rem(96);
        color: #666;
        background-color: #fff;
    }
    .ml56 {
        margin-left: px2rem(56);
    }
</style>
