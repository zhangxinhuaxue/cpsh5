<template>
    <div class="box">
        <infoDesc v-for="(value, key) in info" :key="key" :leftText="key|keysDic">
            <template slot="right">
                {{key==='depositDiscount'?'-￥':'￥'}}{{value|formatNum}}
            </template>
        </infoDesc>
    </div>
</template>
<script>
import infoDesc from 'src/module/common/components/info-desc.vue'
export default {

    name: 'presale-info',
    props: {
        info: {}
    },
    filters: {
        keysDic(value) {
            return {
                price: '商品总价',
                depositDiscount: '预售优惠',
                actualPrice: '实际金额'
            }[value] || value
        }
    },
    components: {
        infoDesc
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-cell {
    height: auto;
}

.box {
    width: 100%;
    ::v-deep .desc__box {
        margin-bottom: px2rem(10);
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
