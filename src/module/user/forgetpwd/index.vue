<!-- 
    Created by Doris on 04/2017
-->
<template>
    <div class="aui-page">
        <div class="aui-content">
            <div class="aui-cells aui-cells_form">
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">手机号</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="tel" placeholder="请输入您的手机号码" v-model.trim="form.telphone" maxlength="11" />
                    </div>
                </div>
                <vcode :telphone="form.telphone" :readImgCode="form.imgCode" smstype="findpwd" :needTop="true">
                    <input slot="smsCode" class="aui-input" type="tel" placeholder="请输入短信验证码" maxlength="6" v-model.trim="form.checkCode">
                    <input slot="imgCode" class="aui-input" type="text" placeholder="请输入图形验证码" maxlength="4" v-model.trim="form.imgCode">
                </vcode>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">登录密码</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="password" placeholder="请设置8-16位数字字母组合密码" v-model.trim="pwd" />
                    </div>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">确认密码</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="password" placeholder="请再输入一次新密码" v-model.trim="cmfPwd" />
                    </div>
                </div>
            </div>
            <div class="aui-btn aui-btn_primary mtb40" :class="{'aui-btn_disabled':disable}" @click="submit">完成</div>
        </div>
    </div>
</template>
<script>
import {
    testTelphone,
    testPwd,
    testVcode,
    testImgCode
} from '../common/common'
import {
    getEncryptedPsw
} from 'libs/util'
import {
    pwdReset
} from 'src/store/modules/user'
import vcode from '../common/vcode.vue'
import axdImage from 'components/image/index.vue'

export default {
    name: 'forgetpwd',
    data() {
        return {
            pwd: '',
            cmfPwd: '',
            form: {
                telphone: '',
                checkCode: '',
                password: '',
                cmfPwd: '',
                imgCode: ''
            },
            codeSrc: '',
            disable: false
        }
    },
    computed: {

    },
    created() {},
    mounted() {
        this.setCode()
    },
    components: {
        axdImage,
        vcode
    },
    methods: {
        setCode() {
            this.codeSrc = '/vcode?time=' + new Date().getTime()
        },
        submit() {
            if (this.disable) {
                return
            }
            let me = this
            this.form.password = getEncryptedPsw(this.pwd)
            this.form.cmfPwd = getEncryptedPsw(this.cmfPwd)
            if (this.check(this.form)) {
                this.disable = true
                pwdReset(this.form, res => {
                    if (res.success) {
                        this.$_toast({
                            txt: '密码重置成功,请重新登录',
                            callback: () => {
                                this.$router.replace({
                                    name: 'login'
                                })
                            }
                        })
                    } else {
                        this.$_toast(res.resultDes)
                    }
                    this.disable = false
                })
            }
        },
        check(form) {
            if (form.telphone === '') {
                this.$_toast('请输入您的手机号码')
                return
            }
            if (!testTelphone(form.telphone)) {
                this.$_toast('手机号格式输入不正确')
                return
            }
            if (form.checkCode === '') {
                this.$_toast('请输入短信验证码')
                return
            }
            if (!testVcode(form.checkCode)) {
                this.$_toast('短信验证码输入不正确')
                return
            }
            if (this.pwd === '') {
                this.$_toast('请输入登陆密码')
                return
            }
            if (!testPwd(this.pwd)) {
                this.$_toast('登录密码输入不正确')
                return
            }
            if (this.cmfPwd === '') {
                this.$_toast('请输入确认密码')
                return
            }
            if (!testPwd(this.cmfPwd)) {
                this.$_toast('确认密码输入不正确')
                return
            }
            if (this.pwd != this.cmfPwd) {
                this.$_toast('两次密码输入不一致')
                return
            }
            return true
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../var.scss';
.mtb40 {
    margin: px2rem(40) auto;
}
</style>
