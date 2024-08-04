<template>
    <transition name="fade">
        <router-view class="view"></router-view>
    </transition>
</template>
<script>
// import Vue from 'vue'
// import { Progress, Actionsheet, Switch } from '@fe/buss-ui'
// Vue.use(Progress)
//     .use(Actionsheet)
//     .use(Switch)
</script>
<style lang="scss">
@import 'src/style.scss';
 .aui-navbar ~ .mui-content {
     margin-top: 1.87733rem;
 }
.mt-40 {
    margin-top: px2rem(40);
}
.mui-page {
    background-color: #ffffff !important;
}
</style>
