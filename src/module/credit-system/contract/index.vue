<!--
 * @Author: sunxj
 * @Date: 2019-09-05 17:30:02
 * @LastEditTime: 2019-09-17 14:12:45
 * @LastEditors: sunxj
 * @Description: 授信合同
 -->
<template>
<m-page :setHeight="false">
    <con-footer slot="bottom" v-if="forceRead == '0'" :platform="platform" :name="name"></con-footer>
    <!-- <div style="-webkit-overflow-scrolling: touch; overflow-y: scroll;"> -->
        <iframe :src="url" frameborder="0" width="100%" height="100%"></iframe>
    <!-- </div> -->
</m-page>
</template>

<script>
import conFooter from './blocks/footer.vue'
import { resetHeader } from 'components/header/resetHeader'
export default {
    name: 'creditContractIndex',
    data() {
        let { url = '', name = '服务协议', forceRead = '1', platform } = this.$route.query
        return {
            url,
            name,
            forceRead,
            platform
        }
    },
    computed: {
        isHideBar() {
            return !(~~this.forceRead) && this.isApp
        }
    },
    components: {
        conFooter
    },
    mounted() {
        if (this.isHideBar) {
            axdApp.send({
                module: 'webview',
                method: 'configNavigationBar',
                params: {
                    visible: false
                },
                callback: function(data) {
                    // alert(JSON.stringify(data))
                }
            })
        }
    },
    beforeRouteLeave(to, from, next) {
        if (this.isHideBar) {
            resetHeader()
        }
        next()
    }
}
</script>

<style lang="scss" scoped>
// @import 'src/style.scss';
.mui-page ::v-deep.mui-content {
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
}
iframe {
  width: 100%;
  max-width: 100%;
}
</style>