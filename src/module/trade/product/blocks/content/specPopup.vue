<!--
    Created by hity on 07/31/17
-->
<template>
        <div v-html="spec"></div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('trade/product', {
            spec: state => state.initData.jd.spec
        })
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

    div {
        margin: 0 px2rem(32) px2rem(20);
    }


</style>
