<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <input-ui @complete="inputComplete" type="visible" :tips="errorinfo">
                <p slot="title" v-if="telphone">
                    已向{{telphone}}发送短信验证码
                </p>
                <a href="javascript:;" @click="getCode">{{codebtn}}</a>
            </input-ui>
        </div>
    </div>
</template>
<script>
import store from 'src/store/vuex/password/index'
import { verifyCodeMixin } from 'module/common/verification_code/verification'
import { sendCodeMsg, checkSmsCode } from 'store/modules/password'
export default {
    name: 'msgcode',
    mixins: [verifyCodeMixin],
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            errorinfo: '',
            telphone: ''
        }
    },
    mounted() {
        this.sendMsgCode()
    },
    methods: {
        sendMsgCode() {
            this.errorinfo = ''
            sendCodeMsg({
                smstype: 'resetPayPwd'
            }).then((res) => {
                if (res.success) {
                    this.telphone = res.result.telphone
                    this.countown()
                } else {
                    this.errorinfo = res.resultDes
                    if (res.code === '20006') { // 已发送5次
                        setTimeout(() => {
                            this.$router.go(-1)
                        }, 2000)
                        return false
                    }
                }
            })
        },
        executeCheck(code) {
            checkSmsCode({
                checkCode: code,
                smstype: 'resetPayPwd'
            }).then((res) => {
                if (res.success) {
                    this.$router.replace({
                        name: 'paySetPwdCommon',
                        params: {
                            type: 'forget'
                        }
                    })
                } else {
                    this.errorinfo = res.resultDes
                }
            })
        }
    },
    store
}
</script>
