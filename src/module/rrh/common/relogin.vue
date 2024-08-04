<template>
    <div class="mui-page relogin-container">
        <p class="relogin-title">账号异常，请验证手机号</p>
        <m-cell-group>
            <m-input
                size="large"
                placeholder="请输入手机号"
                type="tel"
                maxlength="13"
                v-model="phoneNum">
            </m-input>
            <m-input class="btm"
                size="large"
                placeholder="请输入短信验证码"
                maxlength="6"
                v-model="smsCode">
                <a v-if="canGetCode" slot="ft" href="javascript:;" class="smscode" @click="onSendCode">{{getSmsCodeTxt}}</a>
                <span v-else slot="ft" class="smscodeDis">{{getSmsCodeTxt}}</span>
            </m-input>
            <m-cell title="" subTitle="" value=""></m-cell>
        </m-cell-group>
        <m-button :disabled="btnflag" @click="onSave">确认</m-button>
    </div>
</template>
<script>
import { sendCode, saveTel } from 'src/store/modules/rrh'
export default {
    name: 'userInfo',
    data() {
        return {
            token: '',
            setPop: true,
            getSmsCodeTxt: '获取验证码',
            smsCode: '',
            phoneNum: ''
        }
    },
    computed: {
        btnflag () {
            let telReg = /^1\d{10}$/
            if (telReg.test(this.deleteSpace(this.phoneNum)) && this.smsCode.length == 6 && this.token) {
                return false
            } else {
                return true
            }
        },
        canGetCode () {
            if (this.phoneNum && this.setPop) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        phoneNum(curVal, oldVal) {
            this.phoneNum = curVal.replace(/\s/g, '').replace(/(^\w{3})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
        }
    },
    mounted () {
    },
    methods: {
        onSendCode() {
            let time = 60
            let params = {
                telephone: this.deleteSpace(this.phoneNum)
            }
            if(!/^1\d{10}$/.test(params.telephone)){
                this.$_toast('请输入有效手机号')
                return
            }
            sendCode(params).then((data) => {
                if (data.success) {
                    this.token = data.result

                    this.setPop = false
                    var timer = setInterval(() => {
                        time--

                        this.getSmsCodeTxt = `重新获取(${time})`
                        if (time === 0) {
                            this.getSmsCodeTxt = '重发验证码'
                            this.setPop = true

                            clearInterval(timer)
                        }
                    }, 1000)
                } else {
                    this.$_toast(data.resultDes)
                }
            })
        },
        onSave() {
            saveTel({
                telephone: this.deleteSpace(this.phoneNum),
                smsCode: this.smsCode,
                token: this.token
            }).then((res) => {
                if (res.success) {
                    let backUrl = this.$route.query.backUrl
                    if (backUrl) {
                        this.resetHref(backUrl)
                    } else {
                        window.history.back(-1)
                    }
                }
            })
        },
        // 删除空格
        deleteSpace(str) {
            return str.split(' ').join('')
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.relogin-container {
    background: #fff;
    padding: px2rem(60) 0;
    height: 100%;
}
.smscode {
    font-size: px2rem(32);
    color: #4286FF;
}
.smscodeDis {
    font-size: px2rem(32);
    color: #cccccc;
}
.errorTip {
    font-size: px2rem(28);
    color: #ff3e00;
    padding-left: px2rem(206);
    padding-top: px2rem(16);
}
::v-deep .mui-icon {
    color: #4286FF;
}
.relogin-title {
    height: px2rem(67);
    opacity: 1;
    font-size: px2rem(48);
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #1a1a1a;
    line-height: px2rem(67);
    margin: 0 0 px2rem(60) 0;
}
.btm:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid #e6e6e6;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 0.68267rem;
    right: 0.68267rem;
}
</style>
