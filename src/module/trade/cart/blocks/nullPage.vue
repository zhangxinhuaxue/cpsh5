<template>
    <section class="cart_null">
        <div>
            <span class="icon_cart"></span>
            <p>购物车内没有商品哦</p>
            <a v-if="isApp" @click="goIndex">去逛逛</a>
        </div>
    </section>
</template>
<script>
export default {
    name: 'cartNull',
    methods: {
        goIndex() {
            axdApp.send({
                module: 'navigation',
                method: 'goPage',
                params: {
                    page: 'root', // 原生页面标识
                    loginFirst: false, // 是否需要先登录再跳转
                    closeToRoot: true, // 返回（或者关闭）至首页
                    rootPage: 0 // 当需要返回至首页时标识具体的首页页面0:商城首页1:专题3:取现4:我的,
                }
            })
        }
    }
}
</script>
