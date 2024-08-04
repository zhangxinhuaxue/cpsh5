<!--
    Created by hity on 05/19/17
-->
<template>
    <div v-if="sales.isShow" class="on-sale aui-cell" @click="openSales()">
        <span class="aui-tag_bgcolor">促销</span>
        {{sales.txt|limitString(40)}}
        <span class="com-more-icon more"></span>
    </div>
</template>
<script>
// import { mapState } from 'vuex'
export default {
    props: {
        sales: Object
    },
    // computed: {
    //     ...mapState('trade', {
    //         sales: state => state.product.initData.sales
    //     })
    // },
    methods: {
        openSales() {
            let value = this.sales.url
            if (value) {
                window.location.href = value
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    .on-sale {
        width: 100%;
        @include flexbox();
        @include flexVert();
        font-size: $auiFontSizeLevel5;
        color: $auiTextColorGeneral;
        .aui-tag_bgcolor {
            background: $auiAttentionColor;
            margin-right: px2rem(10);
        }
    }
</style>
