<template>
    <div class="aui-page">
        <div class="aui-content">
            <div class="aui-cells">
                <a class="aui-cell aui-cell_access" @click="toHelp">
                    <div class="aui-cell__bd">
                        <p>个人资料</p>
                    </div>
                    <div class="aui-cell__ft">
                    </div>
                </a>
                <a class="aui-cell aui-cell_access" @click="toAddr">
                    <div class="aui-cell__bd">
                        <p>管理收货地址</p>
                    </div>
                    <div class="aui-cell__ft">
                    </div>
                </a>
            </div>
        </div>
        <transition name="router-slide">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
    </div>
</template>
<script>
export default {
    name: 'choose',
    methods: {
        toHelp() {
            this.$router.push({
                name: 'personal'
            })
        },
        toAddr() {
            this.$router.push('/pages/address/list')
        }
    }
}
</script>
