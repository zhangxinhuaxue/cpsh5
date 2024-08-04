<template>
    <m-page>
        <hybrid-header slog="heander" :config="barConfig"></hybrid-header>
        <input-ui @complete="inputComplete" type="visible" :tips="errorinfo">
            <p slot="title" v-if="telNum">
                已向{{telNum | PhoneReplace}}发送短信验证码
            </p>
            <a href="javascript:;" @click="getCode">{{codebtn}}</a>
        </input-ui>
    </m-page>
</template>
<script>
import { verifyCodeMixin } from 'module/common/verification_code/verification.js'
import {
    sendLianLianCode,
    checkLianLianCode
} from 'store/modules/bankbind/bank'
import { AXD, PhoneReplace } from 'src/libs/util'
export default {
    name: 'sms',
    mixins: [verifyCodeMixin],
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightbuttonVisible: false
                }
            },
            token: this.$route.params.token,
            telNum: this.$route.params.telNum,
            cardCode: this.$route.params.bankcardNo
        }
    },
    filters: {
        PhoneReplace
    },
    mounted() {
        this.countown()
    },
    methods: {
        sendMsgCode() {
            sendLianLianCode({
                source: '9',
                telephone: this.telNum,
                bankcardNo: this.cardCode
            }).then((res) => {
                if (res.success) {
                    this.token = res.result
                    this.countown()
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        },
        executeCheck(verifyCode) {
            checkLianLianCode({
                source: '9',
                token: this.token,
                verifyCode: verifyCode
            }).then((res) => {
                if (res.success) {
                    let toUrl = ''
                    if (res.result && res.result.toUrl) {
                        toUrl = res.result.toUrl
                    }
                    this.$_toast({
                        txt: '绑卡成功',
                        callback: () => {
                            if (toUrl) {
                                window.location.href = this.isApp ? decodeURIComponent(toUrl) : toUrl
                            } else {
                                this.$router.go(-2)
                            }
                        }
                    })
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        }
    }
}
</script>
