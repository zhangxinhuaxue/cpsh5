<template>
    <axd-modal :show="dgShow" :classes="pwdClass">
        <div slot="title">{{title}}</div>
        <div slot="content">
            <span class="pwd-close" @click="closeDialog"></span>
            <div class="pwd_input_trigger">
                <input v-focus id="pwdInput" type="password" pattern="[0-9]*" :maxlength="count" :value="code" @input="chargeInput">
                <div class="pwd_view" @click="setInputFocus">
                    <div class="pwd_item" v-bind:class="{dot : codeArr[i-1]}" v-for="i in count"></div>
                </div>
            </div>
            <div class="pwd_oter" v-if="isApp">
                <a class="pwd_forget" href="javascript:;" @click="forgetPwd">忘记密码？</a>
            </div>
        </div>
    </axd-modal>
</template>
<script>
import CryptoJS from 'libs/encrypt'
import Overlay from '../overlay/index.vue'
import Modal from 'components/modal/index.vue'
import {
    hasPayPasswd,
    checkPaypwd
} from 'src/store/modules/loan'
export default {
    /* directives: {
         focus: {
             inserted(el) {
                 el.focus()
             }
         }
     }, */
    name: 'com-pwdClass',
    props: {
        title: {
            type: String,
            default: '请输入信息'
        },
        show: {
            type: Boolean,

            default: false
        },
        hasbutton: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            code: '',
            isActive: true,
            count: 6,
            pwdClass: 'axd_pwd_container',
            hasPwd: false,
            dgShow: false
        }
    },
    components: {
        'axd-modal': Modal,
        Overlay
    },
    computed: {
        codeArr() {
            let ret = []
            let count = this.count
            for (let i = 0; i < count; i++) {
                ret[i] = this.code[i]
            }
            return ret
        }
    },
    watch: {
        show(to, from) {
            if (to) {
                this.showDialog()
            }
        }
    },

    mounted() {
        this.hasPaypwd()
    },

    methods: {
        forgetPwd() {
            axdApp.resetPayPassword()
        },
        setInputFocus() {
            let inputObj = document.getElementById('pwdInput')
            inputObj.focus()
        },
        chargeInput(e) {
            let _this = e.target || e.srcElement
            // 判断输入的值是否整数
            this.code = _this.value
            if (this.code.length >= this.count) {
                this.isActive = true
                // this.validCode(this.code)
                if (!this.hasbutton) {
                    this.validCode(this.code)
                }
            } else {
                this.isActive = false
            }
        },
        submit(e) {
            let _this = e.target || e.srcElement
            let code = this.code
            // 按钮不可点击的状态直接不操作
            if (_this.classList.contains('dis')) {
                return
            }
            // 判断是否输出符合长度的密码、验证码
            if (code.length < this.count) {
                return
            }
            // 校验code
            this.validCode(code)
        },
        validCode(code) {
            let that = this
            // 验证输入的数值是否正确
            if (/^\d+$/g.test(code)) {
                let encryPwd = this.getEncryptedPsw(code)
                checkPaypwd({
                    password: encryPwd,
                    source: 'h5'
                }, res => {
                    if (res.success) {
                        that.closeDialog()
                        this.$emit('complete', encryPwd)
                    } else {
                        this.code = ''
                        this.$_toast('密码错误，请重试')
                    }
                })

                // let inputObj = document.getElementById('pwdInput')
                // inputObj.blur()
            } else {
                this.$emit('error', code)
                this.code = ''
            }
            // this.code = ''
        },
        closeDialog() {
            this.code = ''
            this.dgShow = false
            this.$emit('close')
        },
        showDialog() {
            if (this.hasPwd) {
                this.dgShow = true
            } else {
                this.setPaypwd()
                this.closeDialog() // 关闭，否则确认按钮没法点
            }
        },
        hasPaypwd() {
            var that = this
            hasPayPasswd(res => {
                // res.success = true // 测试代码  后面删掉
                // 设置过支付密码，直接验证支付密码
                if (res.success) {
                    that.hasPwd = true
                } else {
                    that.hasPwd = false
                }
            })
        },
        setPaypwd() {
            let that = this
            if (that.isApp) {
                // axdApp.setPayPassword()
                axdApp.send({
                    module: 'security',
                    method: 'setPayPassword',
                    callback(res) {
                        if (res.data && res.data.result == 'true') {
                            that.hasPwd = true
                        }
                    }
                })
            } else {
                // 支付密码为空 用户未设置支付密码
                var url = '/mall/safe/initsetpwd.html?url=' + encodeURIComponent(window.location.pathname + window.location.hash)
                window.location.href = url
            }
        },
        getEncryptedPsw(password) {
            /* eslint camelcase: "off" */
            var aixuedai_aeskey = 'YWl4dWVkYWk0MDAtODY3MQ==' // aixuedai400-8671
            let key = CryptoJS.enc.Base64.parse(aixuedai_aeskey)
            let iv = CryptoJS.enc.Base64.parse(aixuedai_aeskey)

            return CryptoJS.AES.encrypt(password, key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.ZeroPadding
            }).toString()
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';
.axd_pwd_container {
    background-color: #f0f0f0;
    .pwd_title {
        font-size: px2rem(28);
        text-align: center;
        line-height: px2rem(50);
    }
    .pwd_input_trigger {
        position: relative;
        width: 100%;
        // height: px2rem(65);
        margin: 0 auto;
        padding: px2rem(5);
        // overflow: hidden;
        input {
            position: absolute;
            /*   left: 0;
            top: px2rem(-999999); */
            left: 99999px;
        }
        .pwd_view {
            width: px2rem(458);
            height: px2rem(70);
            margin: 0 auto;
            background: url('./pwd_inputbg.png') 0 center no-repeat;
            background-size: cover;
            .pwd_item {
                display: inline-block;
                width: px2rem(15);
                height: px2rem(15);
                margin: px2rem(25) px2rem(30) px2rem(25) px2rem(30);
                float: left;
            }
        }
    }
    .dot {
        border-radius: 50%;
        background-color: #000;
        overflow: hidden;
    }
    .modal-inner {
        border-radius: 0.35rem;
        .pwd_oter {
            text-align: right;
        }
        .pwd_forget {
            font-size: px2rem(23);
            color: #4ca9ff;
            line-height: px2rem(30);
            // text-align: right;
            padding-top: px2rem(10);
            padding-right: px2rem(10);
        }
    }
    .modal-inner:before {
        height: 0;
    }
    .pwd-close {
        position: absolute;
        right: px2rem(20);
        top: px2rem(20);
        width: px2rem(28);
        height: px2rem(26);
        background: url('./pwd_close.png') 0 center no-repeat;
        background-size: cover;
    }
}
</style>
