<!--
    Created dongyusi on 09/2018
-->
<template>
    <m-page></m-page>
</template>
<script>
import {
    notice
} from './index'
import { isSupportLocalStorage, appDownloadUrl } from 'src/libs/util'
export default {
    name: 'credit-notice',
    data() {
        let { authOrderId, creditItem, noticeBack } = this.$route.query
        return {
            authOrderId,
            creditItem,
            backUrl: noticeBack
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            if (this.authOrderId) {
                this.authNotice()
                // this.checkCreditItem()
            } else {
                this.goBack()
            }
        },
        authNotice() {
            notice(this.authOrderId, (res) => {
                let query = {
                    creditItem: this.creditItem
                }
                let result = res.result || {}
                if (res.success) {
                    // 认证成功，返回授信工单号
                    query.creditOrderId = result.creditOrderId
                } else {
                    // 认证失败，返回认证工单号，code === -999 认证未做
                    if (res.code === '-999') {
                        this.goBack()
                        return
                    }
                    query.authOrderId = result.authOrderId
                    query.code = res.code
                    query.msg = res.resultDes
                }
                this.$router.replace({
                    name: 'creditBasicResult',
                    query: query
                })
            })
        },
        goBack() {
            if (this.backUrl) {
                window.location.replace(decodeURIComponent(this.backUrl))
                return
            }
            if (this.isApp) {
                axdApp.send({
                    module: 'webview',
                    method: 'close'
                })
            } else {
                window.location.replace(appDownloadUrl)
            }
        }
    }
}
</script>
