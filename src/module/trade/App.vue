<template>
    <transition name="fade">
        <div class='view-frame'>
            <keep-alive>
                <router-view class="view" v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view class="view" v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </transition>
</template>
<script>
import Vue from 'vue'
import lazyload from 'src/libs/lazyload'
import {
    install as tradeGlobal
} from './global'
Vue.use(tradeGlobal)
Vue.use(lazyload)

export default {
    name: 'tradeBox',
    data() {
        return {}
    },
    computed: {},
    mounted() {
        if (this.isApp) {
            axdApp.send({
                module: 'webview',
                method: 'setNativeRefreshEnable',
                params: {
                    enable: false
                },
                callback: function(data) {}
            })
        }
    }
}
</script>
<style lang="scss">
@import './common.scss';
html,
body,
.page {
    height: 100%;
}

body {
    width: 16rem;
    margin: 0 auto;
    position: relative;
}
</style>
