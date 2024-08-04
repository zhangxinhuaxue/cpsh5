<!--
 * @Author: sunxj
 * @Date: 2019-09-09 11:01:09
 * @LastEditTime: 2019-09-17 15:15:25
 * @LastEditors: sunxj
 * @Description: In User Settings Edit
 -->
<template>
    <transition name="fade">
        <div>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
        <!-- <keep-alive>
            <router-view class="view">
            </router-view>
        </keep-alive>-->
    </transition>
</template>
<script>
import Vue from 'vue'
import { Errpage, Actionsheet, transferDom } from '@fe/buss-ui'
Vue.use(Errpage)
    .use(Actionsheet)
    .use(transferDom)
export default {
    name: 'credit-system',
    data() {
        return {}
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
@import './assets/style/common.scss';
.text-ellipsis .mui-cell__ft,
.text-ellipsis .mui-cell__ft p {
    max-width: px2rem(500);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.mui-page .aui-navbar ~ .mui-content {
    top: 1.87733rem;
}
</style>
