<template>
    <transition name="fade">
        <keep-alive :include="/^keepAlive_/">
            <router-view class="view"></router-view>
        </keep-alive>
    </transition>
</template>
<style lang="scss">
@import 'src/assets/styles/transition.scss';
</style>
<script>
export default {
    mounted() {
        window.toMyPage = function() {
            if (aixuedai.isUavoApp === 'y') {
                axdApp.send({
                    module: 'navigation',
                    method: 'goPage',
                    params: {
                        page: 'root', // 原生页面标识
                        loginFirst: false, // 是否需要先登录再跳转
                        closeToRoot: true, // 返回（或者关闭）至首页
                        rootPage: 4 // 当需要返回至首页时标识具体的首页页面0:商城首页1:专题3:取现4:我的,
                    }
                })
            } else {
                window.history.go(-1)
            }
        }
        window.toMyPageH5 = function() {
            window.history.go(-1)
        }
        window.toGoods = function() {
            if (aixuedai.isUavoApp === 'y') {
                window.location.href = '/pages/order/goods'
            } else {
                window.history.go(-1)
            }
        }
        window.toCashBack = function() {
            window.history.go(-1)
        }
    }
}
</script>
