<template>
    <div class="my-container">
        <div v-show="initDone" class="aui-page">
            <my-info @initDone="myInit"></my-info>
            <my-trade :isLogin="isLogin"></my-trade>
            <my-config :isLogin="isLogin"></my-config>
        </div>
        <transition name="router-slide">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import {
    myinit
} from 'src/store/modules/user'
import myInfo from './info.vue'
import myTrade from './trade.vue'
import myConfig from './config.vue'
export default {
    name: 'my',
    data() {
        return {
            initDone: false,
            isLogin: false
        }
    },
    components: {
        myInfo,
        myTrade,
        myConfig
    },
    methods: {
        myInit(isLogin) {
            this.initDone = true
            this.isLogin = isLogin
        }
    }
}
</script>
