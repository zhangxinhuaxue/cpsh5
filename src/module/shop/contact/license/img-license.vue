<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="license-img">
        <h2>爱又米合作商家工商执照展示</h2>
        <img :src="licenseImg">
    </div>
</template>
<script>
export default {
    name: 'licenseImg',
    props: {
        code: String
    },
    computed: {
        shopId() {
            return this.$route.params.shopId || ''
        },
        licenseImg() {
            return '/shop/licenseImg?shopId=' + this.shopId + '&code=' + this.code
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.license-img {
    text-align: center;
    padding: px2rem(60) px2rem(90);
    h2 {
        font-size: $auiFontSizeLevel5;
        margin-bottom: px2rem(66);
    }
}
</style>
