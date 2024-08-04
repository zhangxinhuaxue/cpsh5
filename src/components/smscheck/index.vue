<template>
    <div class="sms_check">
        <!-- <p class="title">请输入手机{{ telNum | formaPhone }}收到的验证码</p> -->
        <p class="title" id="telnum" :data-num="telNum">银行预留手机号有误？
            <slot name="tip"></slot>
        </p>
        <div class="aui-cells aui-cells_form">
            <div class="aui-cell aui-cell_vcode">
                <div class="aui-cell__hd">
                    <label class="aui-label">验证码</label>
                </div>
                <div class="aui-cell__bd">
                    <input @input="uploadValue" @focus="focus" @blur="blur" class="aui-input" maxlength="6" type="tel" placeholder="请输入短信验证码" v-model="smscode">
                </div>
                <div class="aui-cell__ft">
                    <button class="aui-vcode-btn" @click="getSmsCode">{{btnTxt}}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    PhoneReplace,
    isIOS
} from 'src/libs/util'
export default {
    name: 'sms_check',
    props: {
        telNum: {
            type: String,
            default: ''
        },
        countOn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            smscode: '',
            btnTxt: '获取验证码',
            canClick: true,
            scrollTop: 0
        }
    },
    filters: {
        formaPhone(num) {
            return PhoneReplace(num)
        }
    },
    watch: {
        countOn(curVal, oldVal) {
            if (curVal) {
                this.setTimerTxt()
            }
        }
    },
    mounted() {},
    methods: {
        getSmsCode() {
            if (this.canClick) {
                this.$emit('sendSmsCode')
            }
        },
        uploadValue() {
            this.$emit('setSmsCode', this.smscode)
        },
        setTimerTxt() {
            let _this = this
            let count = 60

            _this.canClick = false
            let timer = setInterval(() => {
                count -= 1
                if (count < 0) {
                    clearInterval(timer)
                    _this.btnTxt = '获取验证码'
                    _this.canClick = true
                    _this.$emit('reset')
                    return
                }
                this.btnTxt = '' + count + '秒后重发'
            }, 1000)
        },
        focus() {
            if (isIOS) {
                this.scrollTop = document.body.scrollTop
            }
        },
        blur() {
            if (isIOS) {
                document.body.scrollTop = this.scrollTop
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/assets/styles/rem.scss';
@import 'src/assets/styles/mixins.scss';
$designWidth: 750;
.sms_check {
    p.title {
        height: px2rem(84);
        line-height: px2rem(84);
        font-size: $auiFontSizeLevel7;
        color: $auiTextColorAssistant;
        margin-bottom: px2rem(20);
        text-align: right;
        padding: 0 px2rem(31);
    }
    .aui-cells_form {
        margin: 0 auto;
    }
}
.aui-vcode-btn:before {
    border-left: 0;
    font-size: px2rem(32);
}
.aui-cell {
    height: px2rem(128);
    line-height: px2rem(128);
    font-size: px2rem(32);
}
</style>
