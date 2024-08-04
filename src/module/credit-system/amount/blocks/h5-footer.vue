<!--
 * @Author: sunxj
 * @Date: 2019-08-26 10:29:39
 * @LastEditTime: 2019-08-29 10:55:09
 * @LastEditors: sunxj
 * @Description: 下载App
 -->
<template>
<div class="mt100">
    <m-button @click="goDownApp">下载APP 体验极速放款</m-button>
    <p class="credit-tips mt22">在APP中可提升您的信用额度，还能畅享免息优惠</p>
</div>
</template>

<script>
import { AXD } from 'libs/util'
export default {
    name: 'h5Footer',
    methods: {
        goDownApp() {
            AXD.util.goAppDownload()
        }
    }
}
</script>

<style lang="scss" scoped>
@import 'src/style.scss';
.mt100 {
    margin-top: px2rem(100);
}
.mt22 {
    margin-top: px2rem(22);
}
.credit-tips {
    text-align: center;
    margin: px2rem(76) 0;
    color: $auiTextColorLight;
    font-size: $auiFontSizeLevel7;
}

</style>