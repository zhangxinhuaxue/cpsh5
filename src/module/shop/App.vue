<template>
    <transition name="fade">
        <div>
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    </transition>
</template>
<script>
import Vue from 'vue'
import lazyload from 'src/libs/lazyload'
import loadMore from 'src/libs/loadmore'
import { install as shopGlobal } from './global'
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.use(lazyload)
Vue.use(loadMore)
Vue.use(shopGlobal)
export default {
    name: 'shop'
}
</script>
<style lang="scss">
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

img {
    pointer-events: none;
}
</style>
