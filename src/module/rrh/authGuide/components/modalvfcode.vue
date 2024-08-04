<template>
    <m-modal :isShow="show"
        title="验证码校验"
        ref="modal2"
        @close="close">
        <div slot="content">
            <vf-code ref="vfcode" class="modalvfcode" :phone="phone" @complete="complete" @getCode="getVerificationCode" @focusInput="focusInput"></vf-code>
        </div>
    </m-modal>
</template>
<script>
import vfCode from 'src/module/common/vfcode/noTel'
import { authSignApply, authSign } from 'src/store/modules/rrh'
import { isIOS } from 'src/libs/util'
export default {
    name: 'modalvfcode',
    props: {
        show: {
            type: Boolean,
            default: true
        },
        phone: {
            type: String,
            default: ''
        },
        param: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    components: {
        vfCode
    },
    data() {
        return {
            serialNo: ''
        }
    },
    watch: {
        show(n) {
            // 控制在浮层打开时获取验证码
            if (n) {
                this.getVerificationCode()
                this.$refs.vfcode.pending = true
            }
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        // 提交验证码
        complete(code) {
            authSign({
                msgCode: code,
                serialNo: this.serialNo,
                ...this.param
            }).then(res => {
                if (res.success) {
                    this.$emit('complate', res.result.secondLoanId)
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        // 获取验证码
        getVerificationCode(callback) {
            if (this.show) {
                authSignApply(this.param).then(res => {
                    if (res.success) {
                        callback && callback(res.success)
                        this.serialNo = res.result.serialNo
                    } else { 
                        if (res.code === '1000') {
                            this.$emit('dealWrong', res.resultDes)
                        } else {
                            this.$_toast(res.resultDes)
                        }
                    }
                })
            }
        },
        // 兼容处理：修复IOS-14系统键盘将验证码浮层遮住
        focusInput() {
            if (isIOS) {
                window.scrollTo({
                    top: document.body.clientHeight,
                    left: 0
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped>
::v-deep .modalvfcode .main-title {
    display: none;
}
</style>
