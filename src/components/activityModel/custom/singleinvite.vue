<template>
    <div>
        <ul class="support-form">
            <li>
                <input type="tel" name="telphone" placeholder="输入手机号" v-model="telphone">
            </li>
            <li v-if="showImgCode">
                <input type="text" name="code" placeholder="输入图形验证码" v-model="imgCode">
                <img v-bind:src="imgCodeSrc" class="img-code" @click="getImgCode">
            </li>
            <li>
                <input type="tel" name="code" placeholder="输入验证码" v-model="code">
                <button @click="getCode" v-bind:class="{'btn-code': true, 'disabled': codeDisabled}">{{btnCodeText}}</button>
            </li>
            <li>
                <button @click="receive" v-bind:class="{'btn-go': true, 'disabled': goDisabled}">{{config.btnTitle}}</button>
            </li>
        </ul>
    </div>
</template>

<script>
    import axdToast from 'components/toast/index'
    import {_post, formatRet} from 'store/base'
    import {
        sendCodeMsg,
        smsLogin
    } from 'src/store/modules/user'

    export default {
        name: 'singleinvite',
        props: {
            config: Object
        },
        data() {
            return {
                code: '',
                imgCode: '',
                telphone: '',
                goDisabled: false,
                showImgCode: false,
                codeDisabled: false,
                btnCodeText: '获得验证码',
                sendCodeMsg: '/common/sendCodeMsg',
                imgCodeSrc: '/vcode?time=' + Date.parse(new Date())
            }
        },
        methods: {
            // 立即领取
            receive() {
                let me = this
                if (!me.goDisabled && me.checkInput()) {
                    if (me.code) {
                        // let param = {
                        //     'inviteId': window.shareDataObj.inviteId,
                        //     'telphone': window.shareDataObj.telphone,
                        //     'signkey': window.shareDataObj.signkey,
                        //     'regTelPhone': me.telphone,
                        //     'smsCode': me.code
                        // }

                        smsLogin({
                            username: me.telphone,
                            smsCode: me.code,
                            imgCode: me.imgCode
                        }, (res) => {
                            me.goDisabled = false
                            if (res.success) {
                                if (res.code == '10050' || res.code == '10051') {
                                    me.config.event()
                                }
                            } else {
                                axdToast(res.resultDes)
                            }
                        })
                    } else {
                        axdToast('验证码不能为空')
                    }
                }
            },
            // 获取验证码
            getCode() {
                let me = this
                let time = 60
                let param = {
                    smstype: 'sms_login',
                    telphone: me.telphone,
                    imgCode: me.imgCode
                }
                if (!me.codeDisabled && me.checkInput()) {
                    _post(me.sendCodeMsg, param, (data) => {
                        data = formatRet(data)
                        if (data.success) {
                            if (data.result.uuidcache) {
                                axdToast(data.resultDes)
                            }

                            me.codeDisabled = true
                            let timer = setInterval(function() {
                                time--
                                me.btnCodeText = time + '秒后重新获取'
                                if (time === 0) {
                                    me.btnCodeText = '重发验证码'
                                    me.codeDisabled = false
                                    clearInterval(timer)
                                }
                            }, 1000)
                        } else {
                            axdToast(data.resultDes)
                            me.showImgCode = true

                            // 重绘图形验证码
                            me.getImgCode()
                        }
                    })
                }
            },
            // 重新获取图形验证码
            getImgCode() {
                this.imgCodeSrc = '/vcode?time=' + Date.parse(new Date())
            },
            checkInput() {
                let me = this
                if (/^1\d{10}$/.test(me.telphone)) {
                    if (me.showImgCode) {
                        if (me.imgCode) {
                            return true
                        } else {
                            axdToast('图形验证码不能为空')
                            return false
                        }
                    } else {
                        return true
                    }
                } else {
                    axdToast('请输入正确的手机号码')
                    return false
                }
            }
        }
    }
</script>

<style lang="scss">
    @import 'src/assets/styles/style.scss';
    $designWidth: 750;
    .support-form{
        width: px2rem(640);
        margin: 0 auto px2rem(50);
        li{
            position: relative;
            margin: px2rem(46) 0 0;
        }
        input, button{
            border-radius: 30px;
            -webkit-border-radius: 30px;
            -moz-border-radius: 30px;
            outline: none;
        }
        input{
            width: 100%;
            margin: 0 auto;
            color: #fff;
            background: #321c67;
            height: px2rem(88);
            font-size: px2rem(30);
            line-height: px2rem(88);
            padding-left: px2rem(50);
            border: solid px2rem(2) #ffe300;
        }

        .btn-go{
            border: none;
            color: #27105f;
            display: block;
            font-size: px2rem(35);
            height: px2rem(93);
            width: 100%;
            background: -webkit-gradient(linear, left top, left bottom, from(#ffef00), color-stop(0.5, #ffc800), to(#ffc800));
        }
        .btn-code{
            position: absolute;
            right: px2rem(20);
            bottom: px2rem(10);
            height: px2rem(71);
            background-color: #ffe300;
            color: #27105f;
            border: none;
            font-size: px2rem(28);
            min-width: px2rem(193);
        }
        .disabled{
            background: #d2bea0;
            color: #fff;
        }
        .img-code{
            width: px2rem(193);
            height: px2rem(71);
            position: absolute;
            right: px2rem(20);
            bottom: px2rem(10);
        }
    }
</style>
