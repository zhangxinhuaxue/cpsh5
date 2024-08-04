<template>
    <div>
        <ul class="support-form">
            <li>
                <input type="tel" name="telphone" placeholder="请输入您的手机号码" v-model="telphone">
            </li>
            <li v-if="showImgCode">
                <input type="text" name="code" placeholder="请输入图形验证码" v-model="imgCode">
                <img v-bind:src="imgCodeSrc" class="img-code" @click="getImgCode">
            </li>
            <li>
                <input type="tel" name="code" placeholder="请输入验证码" v-model="code">
                <button @click="getCode" v-bind:class="{'btn-code': true, 'disabled': codeDisabled}">{{btnCodeText}}</button>
            </li>
            <li>
                <button @click="receive" v-bind:class="{'btn-go': true, 'disabled': goDisabled}">立即领取</button>
            </li>
        </ul>
        <div class="dialog-bg" v-if="dialogConfig.show">
            <button @click="close"></button>
            <div class="bg">
                <span>{{dialogConfig.title}}</span>
                <h1>{{dialogConfig.h1}}</h1>
                <p>{{dialogConfig.desc}}</p>

                <a @click="dialogConfig.btnLeft.event"
                    v-if="dialogConfig.btnLeft.show">{{dialogConfig.btnLeft.title}}</a>
                <a @click="dialogConfig.btnRight.event"
                    v-if="dialogConfig.btnRight.show">{{dialogConfig.btnRight.title}}</a>
            </div>
            <div class="bg-star" v-if="dialogConfig.showStar"></div>
        </div>
    </div>
</template>

<script>
    import axdToast from 'components/toast/index'
    import {_post, formatRet} from 'src/store/base'

    export default {
        name: 'invite',
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
                imgCodeSrc: '/vcode?time=' + Date.parse(new Date()),
                graduateRegisterSaveAPI: '/graduate/active/graduateRegisterSave',
                dialogConfig: {
                    show: false,
                    showStar: false,
                    title: '邀好友',
                    h1: '没有可拆的福袋',
                    desc: '速去邀请好友获得福袋',
                    btnLeft: {
                        show: true,
                        title: '查看福袋',
                        event() {}
                    },
                    btnRight: {
                        show: true,
                        title: '继续领福袋',
                        event() {}
                    }
                }
            }
        },
        methods: {
            // 立即领取
            receive() {
                let me = this
                if (!me.goDisabled && me.checkInput()) {
                    if (me.code) {
                        let param = {
                            'inviteId': window.shareDataObj.inviteId,
                            'telphone': window.shareDataObj.telphone,
                            'signkey': window.shareDataObj.signkey,
                            'regTelPhone': me.telphone,
                            'smsCode': me.code
                        }
                        me.goDisabled = true
                        _post(me.graduateRegisterSaveAPI, param, (data) => {
                            data = formatRet(data, me.graduateRegisterSaveAPI)
                            me.goDisabled = false
                            if (data.success) {
                                // 拆福袋成功
                                me.dialogConfig.show = true
                                me.dialogConfig.showStar = true
                                me.dialogConfig.title = '恭喜'
                                me.dialogConfig.h1 = '你的礼品是30元现金'
                                me.dialogConfig.desc = '您提取嗨花≥5000元时可领取。来自' + window.shareDataObj.telphone + '的邀请'
                                me.dialogConfig.btnLeft.show = true
                                me.dialogConfig.btnLeft.title = '查看福袋'
                                me.dialogConfig.btnLeft.event = () => {
                                    window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.aixuedai.axd'
                                }
                                me.dialogConfig.btnRight.show = false
                            } else {
                                if (data.code == '10054') {
                                    // 老用户
                                    me.dialogConfig.show = true
                                    me.dialogConfig.showStar = false
                                    me.dialogConfig.title = '邀好友'
                                    me.dialogConfig.h1 = '你已是招集令老用户'
                                    me.dialogConfig.desc = '不能拆开新人福袋。你可以邀请好友申请嗨花，来获得福袋'
                                    me.dialogConfig.btnLeft.show = true
                                    me.dialogConfig.btnLeft.title = '邀请好友'
                                    me.dialogConfig.btnLeft.event = () => {
                                        window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.aixuedai.axd'
                                    }
                                    me.dialogConfig.btnRight.show = false
                                } else if (data.code == '10053') {
                                    // 被邀请过
                                    me.dialogConfig.show = true
                                    me.dialogConfig.showStar = false
                                    me.dialogConfig.title = '已拆过'
                                    me.dialogConfig.h1 = '你已拆开过福袋，不能重复拆开'
                                    me.dialogConfig.desc = '成功提取嗨花后，即可提现哦'
                                    me.dialogConfig.btnLeft.show = true
                                    me.dialogConfig.btnLeft.title = '查看福袋'
                                    me.dialogConfig.btnLeft.event = () => {
                                        window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.aixuedai.axd'
                                    }
                                    me.dialogConfig.btnRight.show = false
                                } else {
                                    axdToast(data.resultDes)
                                }
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
                        data = formatRet(data, me.sendCodeMsg)
                        if (data.success) {
                            if (data.result.uuidcache) {
                                axdToast(data.resultDes)
                            }

                            me.codeDisabled = true
                            let timer = setInterval(function() {
                                time--
                                me.btnCodeText = time + '秒后重发'
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
            },
            close() {
                this.dialogConfig.show = false
            }
        }
    }
</script>

<style scoped lang="scss">
    @import 'src/assets/styles/style.scss';
    $designWidth: 750;
    ::-webkit-input-placeholder{
        color: #bdbbbb;
    }
    ::-moz-placeholder{
        color: #bdbbbb;
    }
    ::-ms-input-placeholder{
        color: #bdbbbb;
    }
    .support-form{
        width: px2rem(564);
        margin: 0 auto px2rem(50);
        li{
            position: relative;
            margin: px2rem(46) 0 0;
        }
        input, button{
            border-radius: 10px;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            outline: none;
        }
        input{
            width: px2rem(564);
            margin: 0 auto;
            color: #000;
            background: #fff;
            height: px2rem(91);
            font-size: px2rem(28);
            line-height: px2rem(91);
            padding-left: px2rem(15);
        }

        .btn-go{
            border: none;
            color: #fe4747;
            display: block;
            font-size: px2rem(42);
            height: px2rem(91);
            width: px2rem(564);
            background: -webkit-gradient(linear, left top, left bottom, from(#ffef00), color-stop(0.5, #ffc800), to(#ffc800));
        }
        .btn-code{
            position: absolute;
            right: px2rem(20);
            bottom: px2rem(10);
            height: px2rem(71);
            background-color: #ffdd21;
            color: #fe4747;
            border: none;
            font-size: px2rem(28);
            width: px2rem(193);
        }
        .disabled{
            background-color: #c6c2c2;
        }
        .img-code{
            width: px2rem(193);
            height: px2rem(71);
            position: absolute;
            right: px2rem(20);
            bottom: px2rem(10);
        }
    }
    .dialog-bg {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 99;

        button {
            width: px2rem(70);
            height: px2rem(70);
            border: none;
            background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAMAAABHPGVmAAAA5FBMVEUAAAD+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv+LUv/////l6b+Lkz/mKf/+/z+M1D/7fD+cof/9PX/1tz+Olb/+Pn/9/j/2+D/vcf/o7D+eYz+bYL+Vm7/3eL/09n/zdT/xs7/tL7/rLj+aH7+ZXv+XnX+UGn/5en+SmX+gZP+R2JqCQhHAAAAKnRSTlMA7xQn8yLcpuPhazrLyfv3sZyalW5kNCwaAdi/inNcQ5CnB5HAhF1FCAZbMNQ2AAADXUlEQVRo3s3a6VLiQBSG4dMNYRsQRERFUdz1i4wbIgrihuvc//1MhsK0zqTpPknI+P626ilKqovuc8g2uVFrVUoZkQbSIlOqtGobkuLMKWTzCCifLTjxCKndDKaU2U1FFWShBGOlgozyIaplWFWupsIS2Tasa2fDMHJhDqzmFiSTWFkUYCcWVziGs4pQrTr2xrpAyMS6JbE1jwjNb9kYy0VEqrhsNpbyiFh+yWT8EIic+GEw0oih9FSlroxoSl1vLAnElND+X5ZziK2c5jt2WEKMlQ4DkXnE2nzgWYKYCzhhHIGYE84/Z/sqYm/175N/ETNo8ashBWaQkF+QBcykhc9Gag4zaS5FqixmVFYZqTYCO+tddkYw1h9edgYIrK0+SlVjuF7HfRg6cv+kUaofhiwjsJ47Vs5sDLeDwMpygjQR3LGrFJPhdhFcc4I0ENzQnSgDs+EOEVyDxtWh6d39UEZGw+1DU32MrEHXtTup+2QyfkLX2hjJQFfbVy6fwhrIkJcD6JVHX3lmGirHQwqwUs6fQxooeMgmpioPvnITzsCmh+TAUfgGckQSMChX7qTTG46hkrQBUydKeQljYJ9q4Cl8AzVqwUK595U3voEWVcBSXt/YBipUhJVy5yu/uAaKlAdTOecayJOAXRe3roplQFAaIZUj2JYmwFrp8AwVA8FFL5wBSsO+a984vYB9aRKw7shV3TIUQXmuwVfyVOQZqrsTWFakCtfgKxVqcY3rV3fSvaWyTTWmcYS3U6ZSow2uAbz4ypWVsk+Sa/AVSZRjG8CNUtowlVM/iTiGp/gH/oNR2fSQAs/gKwUPcTiG6tlXHg2KQ14ZlqGUSzslo64ObAN48pVrpeiuDnWmoZSur0Bfffp1Dv1AQzU6die9Q1fDcDHFUBnBDT6UIXQ1DVdsdA0GcDZRjqGpLA2PBegow6D0oKlqfPYYGA2gP1bOYHz2oCw0Sqfb62N6I+9vdAayiTxFJfGolsjzYBIPnYk82Sbx+JzAM/pewgMB1VYJMVbcSmZIk/y4iT+cM4/nkhgB/v9hZjxj2e8xYCY6iDYqP5j90H+PrHN2EKod57stYoRcKfmeyzHsNZ/wyWYDxhpNSRGrr01fvVqrx7ZElkNAOfYSmXkdbvvzOtw2Yx3uN31UCrwybrLaAAAAAElFTkSuQmCC) no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: px2rem(70);
            top: px2rem(300);
            z-index: 30;
        }

        .bg {
            span {
                font-size: px2rem(56);
                color: #dea767;
                display: block;
                width: 100%;
                margin-top: px2rem(189);
            }
            h1 {
                font-size: px2rem(30);
                color: #fff;
                margin-top: px2rem(147);
            }
            p {
                font-size: px2rem(27);
                color: #fff;
            }
            a {
                width: px2rem(163);
                height: px2rem(62);
                display: inline-block;
                color: #fe2d4b;
                background: #ffd93b;
                text-align: center;
                font-size: px2rem(25);
                line-height: px2rem(62);
                border-radius: 15px;
                margin-top: px2rem(20);
            }
            width: px2rem(440);
            height: px2rem(655);
            margin: px2rem(200) auto 0;
            overflow: hidden;
            text-align: center;
            background: url(data:image/png;base64,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) no-repeat;
            background-size: 100% 100%;
        }

        .bg-star {
            background: url(data:image/png;base64,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) no-repeat top;
            position: absolute;
            top: px2rem(160);
            left: 0;
            width: 100%;
            height: px2rem(400);
            z-index: 10;
        }
    }
</style>
