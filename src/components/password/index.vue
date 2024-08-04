<template>
    <div>
        <input-ui @complete="checkPaypwd" type="dot" :tips="errorinfo">
            <p slot="title">
                <slot name="title">请输入招集令支付密码，完成借款申请</slot>
            </p>
            <!-- 去掉 v-if="isApp" 条件 0321 赵志胜 -->
            <a href="javascript:;" @click="forgetPwd">忘记密码</a>
        </input-ui>
    </div>
</template>
<script>
import inputUi from 'components/input_ui/aym_input.vue'
import {
    getEncryptedPsw
} from 'libs/util'
import {
    hasPayPasswd,
    checkPaypwd
} from 'src/store/modules/loan'
export default {
    name: 'password',
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            errorinfo: '',
            hasPwd: false
        }
    },
    components: {
        inputUi
    },
    mounted() {
        this.hasPaypwd()
    },
    methods: {
        forgetPwd() {
            if (this.isApp) {
                axdApp.resetPayPassword()
            } else {
                this.$router.push({
                    path: '/pages/checkmsg'
                })
            }
        },
        checkPaypwd(code) {
            this.errorinfo = ''
            let encryPwd = getEncryptedPsw(code)
            checkPaypwd({
                password: encryPwd,
                source: 'h5'
            }).then(res => {
                if (res.success) {
                    this.$emit('complete', encryPwd)
                } else {
                    this.errorinfo = '密码错误，请重试'
                }
            })
        },
        hasPaypwd() {
            hasPayPasswd().then(res => {
                // 设置过支付密码，直接验证支付密码
                if (res.success) {
                    this.hasPwd = true
                } else {
                    this.setPaypwd()
                }
            })
        },
        setPaypwd() {
            if (this.isApp) {
                // axdApp.setPayPassword()
                axdApp.send({
                    module: 'security',
                    method: 'setPayPassword',
                    callback: (res) => {
                        if (res.data && res.data.result == 'true') {
                            this.hasPwd = true
                        } else {
                            this.$emit('error', res)
                        }
                    }
                })
            } else {
                // 支付密码为空 用户未设置支付密码
                var url = '/mall/safe/initsetpwd.html?url=' + encodeURIComponent(this.$route.fullPath)
                window.location.href = url
            }
        }
    }
}
</script>
