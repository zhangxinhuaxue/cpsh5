<template>
    <div>
        <div class="aui-cell aui-cell--before-show">
            <div class="aui-cell__hd" v-if="needTop">
                <label class="aui-label">短信验证码</label>
            </div>
            <div class="aui-cell__bd">
                <!-- <input class="aui-input w340" type="tel" placeholder="请输入验证码" v-model.trim="smsCode"> -->
                <slot name='smsCode'></slot>
                <div class="code-btn" @click="getCode" :style="{color:isTiming?'#f99e00':'#ffd72d'}">{{codeBtn}}</div>
            </div>
        </div>
        <div class="aui-cell" v-if="imgCodeVisible">
            <div class="aui-cell__hd" v-if="needTop">
                <label class="aui-label">图形证码</label>
            </div>
            <div class="aui-cell__bd">
                <slot name='imgCode'></slot>
            </div>
            <div class="aui-cell__ft">
                <img @click="getImgCode" :src="imgCodeSrc" alt="" class="cell-ft__code">
            </div>
        </div>
    </div>
</template>
<script>
import {
    sendCodeMsg
} from 'src/store/modules/user'
import {
    testTelphone,
    testImgCode
} from './common'
export default {
    name: 'vcode',
    props: {
        telphone: {
            type: [String, Number],
            required: true
        },
        readImgCode: {
            default: ''
        },
        smstype: {
            default: 'normal'
        },
        needTop: {
            default: false
        }
    },
    data() {
        return {
            totalTime: 60, // 60
            timing: '',
            isTiming: false,
            imgCodeVisible: false,
            imgCodeSrc: '/vcode'
        }
    },
    computed: {
        codeBtn() {
            return this.isTiming ? this.timing + '秒后重发' : '获取验证码'
        },
        imgCode() {
            return this.readImgCode
        }
        // ,
        // imgCodeVisible() {
        //     return this.codeCount >= 3
        // }
    },
    methods: {
        getCode() {
            if (!testTelphone(this.telphone)) {
                this.telphone ? this.$_toast('手机号输入不正确') : this.$_toast('请输入手机号')
                return
            }
            if (this.imgCodeVisible && !testImgCode(this.imgCode)) {
                if (this.imgCode === '') {
                    this.$_toast('请输入图形验证码')
                } else {
                    this.$_toast('图形验证码输入不正确')
                }
                return
            }

            if (this.isTiming) {
                return
            }

            sendCodeMsg({
                smstype: this.smstype,
                telphone: this.telphone,
                imgCode: this.imgCode
            }, res => {
                if (res.success) {
                    this.timing = this.totalTime
                    let timer = setInterval(() => {
                        if (this.timing <= 0) {
                            clearInterval(timer)
                            this.isTiming = false
                            return
                        }
                        this.timing -= 1
                    }, 1000)
                    this.isTiming = true
                } else {
                    if (!this.imgCodeVisible) {
                        this.imgCodeVisible = true
                    }
                    this.getImgCode()
                    this.$_toast(res.resultDes)
                }
            })
        },
        getImgCode() {
            this.imgCodeSrc = '/vcode?time=' + +new Date()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
$designWidth: 1080;
.w340 {
    width: px2rem(340);
}

.aui-cell--before-show:before {
    display: block;
}

.aui-cell__bd {
    position: relative;
    .code-btn {
        width: px2rem(240);
        height: px2rem(90);
        //padding-left: px2rem(40);
        line-height: px2rem(90);
        position: absolute;
        right: 0;
        top: px2rem(-15);
        font-size: px2rem(38);
        // color: #ffd72d;
        text-align: right;
        border-left: 1px solid #e4e4e4;
    }
}

.cell-ft__code {
    width: px2rem(230);
    height: px2rem(80);
}

.c-999 {
    color: #999;
}
</style>
