<!--
    Created by hity on 05/15/17
-->
<template>
    <div>
        <a :href="instalment.detailUrl " :style="{ backgroundImage: 'url(' + instalment.detailImg + ')'}"></a>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('trade/product', {
            instalment: state => state.initData.instalment
        })
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    div {
        margin: 0 px2rem(32) px2rem(20);
        a {
            display: block;
            margin: 0 auto;
            width: px2rem(686);
            height: px2rem(340);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
        }
    }
</style>
