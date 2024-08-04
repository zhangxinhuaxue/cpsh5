<template>
    <div>
        <vfnotel-code @complete="wfComplete" @getCode="wfGetVerificationCode" v-if="key === 'wf'"></vfnotel-code>
        <vf-code :phone="phoneNo" @complete="complete" @getCode="getVerificationCode" v-else></vf-code>
    </div>
</template>
<script>
import vfCode from 'src/module/common/vfcode/index.vue'
import vfnotelCode from 'src/module/common/vfcode/noTel.vue'
import { wfVeriCode } from 'store/modules/rrh'
import { rrhReqConfirm } from 'store/modules/rrh' 
export default {
    data() {
        return {
            key: this.$route.query.key,
            oidBiz: this.$route.query.oidBiz,
            phoneNo: '',
            id: this.$route.query.id,
            source: this.$route.query.source,
            succTo: this.$route.query.succTo,
            applyNo: this.$route.query.applyNo,
            smsValidateCode: ''
        }
    },
    methods: {
        /**
         * 提交手机验证码
         */
        complete(code) {
        },
        /*
         * 提交手机验证码-外放
         */
        wfComplete(code) {
            if (!this.smsValidateCode) {
                this.$_toast('请重新获取验证码')
                return false
            }
            rrhReqConfirm({
                loanId: this.id,
                payPassWd: code,
                token: this.smsValidateCode
            }).then(res => {
                if (res.success) {
                    if (res.result.isCycle) {
                        this.$router.replace(`/pages/rrh/authone?cycleId=${res.result.cycleId}&type=first`)
                    } else {
                        this.$router.replace({
                            name: 'rrhResult',
                            query: {
                                loanId: this.id,
                                type: 'default'
                            }
                        })
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        /**
         * 获取验证码
         */
        getVerificationCode() {
        },
        /**
         * 获取验证码-外放
         */
        wfGetVerificationCode(callback) {
            wfVeriCode({
                loanId: this.id
            }).then(res => {
                callback(res.success)
                if (!res.success) {
                    this.$_toast(res.resultDes)
                } else {
                    this.smsValidateCode = res.result
                }
            })
        }
    },
    components: {
        vfCode,
        vfnotelCode
    }
}
</script>
<style scoped>

</style>