<template>
    <div class="order-empty">
        <axd-empty name="empty">
            <p slot="title" class="page-empty_title">暂时还没有订单哦</p>
            <div slot="btns" class="page-empty_btns">
                <a href="javascript:;" class="aui-btn_border" @click="goIndex">马上去逛逛</a>
            </div>
        </axd-empty>
    </div>
</template>
<script>
import axdEmpty from 'components/empty_ui/index.vue'
export default {
    name: 'orderEmpty',
    components: {
        axdEmpty
    },
    methods: {
        goIndex() {
            if (this.isApp) {
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
            } else {
                window.location.href = '/pages/put/index'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../style.scss';
.order-empty {
    padding-top: px2rem(200);
}
</style>
