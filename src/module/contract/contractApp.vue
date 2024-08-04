<template>
   <m-cell-group style="margin-top: 0">
        <m-cell title="招集令用户注册协议" is-link @click="goUrl('https://opengateway-contract.zhaojiling.com/mng/template/view/userRegistration')"> </m-cell>
        <m-cell title="招集令隐私权保护条款" is-link @click="goUrl('https://opengateway-contract.zhaojiling.com/mng/template/view/privacyAgreement')"> </m-cell>
        <m-cell title="第三方SDK收集使用信息说明" is-link @click="goUrl('https://opengateway-contract.zhaojiling.com/mng/template/view/ZJL_sdk')"> </m-cell>
   </m-cell-group>
</template>

<script>
import { resetHeader } from 'components/header/resetHeader'

export default {
    data() {
        return {

        }
    },
    created() {
        resetHeader()
    },
    methods: {
        goUrl(url) {
            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'configNavigationBar',
                    params: {
                        visible: false
                    },
                    callback: function() {
                        window.location.href = url
                    }
                })
            } else {
                window.location.href = url
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
