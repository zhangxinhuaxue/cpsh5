<!--
    微信授权登录--绑定手机号登录部分
    使用demo：
    <loginSdk
        :openId="openId"              - 微信授权页面返回的openid
        :visible="visible"            - 需要开始流程时，置true，类似dialog的显示控制
        :phoneInfo="phoneInfo"        - 输入手机号弹窗title和按钮文案，如
                                        {
                                            title: '请输入手机号进行登录', // 请输入手机号进行登录
                                            btnTxt: '确认'
                                        }
        :smsTitleInfo="smsTitleInfo"  - 输入sms验证啊弹窗title
        :imgTitleInfo="imgTitleInfo"  - 输入img验证啊弹窗title
        @hideDialog="hideDialog"      - 流程结束返回，置false，类似dialog的关闭控制
        :isAutoFn="false">            - 登录成功后，刷新是否添加自执行函数标记, 默认false, 不添加
    </loginSdk>
-->
<template>
    <div id="sdk_login" v-if="visible">
        <div class="mask" v-if="showFlag !== 'none'"></div>
        <!-- 手机号 -->
        <div class="dialog_login part_phone" v-if="showFlag == 'showPhone'">
            <div class="btn_close" @click="terminateProcess"></div>
            <div class="dialog_login__hd">
                <p class="title">{{phoneInfo.title}}</p>
                <p :class="['title_sub', phoneWarn ? 'color_warn': '']">{{phoneWarn}}</p>
            </div>
            <div class="dialog_login__bd">
                <input
                    class="input_no"
                    type="tel"
                    maxlength="11"
                    placeholder="输入手机号"
                    v-model="phoneNo"
                />
                <span class="icon_delete" v-show="phoneNo.length" @click="clearVal('phoneNo')"></span>
            </div>
            <div class="dialog_login__ft">
                <a href="javascript:;" class="btn_submit" @click="sendSmsCode">{{phoneInfo.btnTxt}}</a>
                <p class="text_protocol">
                    我已阅读并同意
                    <a :href="protocolUrl">《用户注册协议》</a>
                </p>
            </div>
        </div>
        <!-- 短信验证码 -->
        <div class="dialog_login part_sms" v-if="showFlag == 'showSms'">
            <div class="btn_close" @click="terminateProcess"></div>
            <div class="dialog_login__hd">
                <p class="title">{{smsTitleInfo}}</p>
                <p :class="['title_sub', smsWarn ? 'color_warn': '']">{{smsWarn || smsTxt}}</p>
            </div>
            <div class="dialog_login__bd">
                <div class="part_input">
                    <input
                        type="tel"
                        maxlength="6"
                        class="input_hidden"
                        ref="realInput"
                        v-model.trim="smsCode"
                    />
                    <ul class="input_fake" @click="focusOnInput">
                        <li v-for="(n, index) in 6" :key="index">{{smsCodeArr[n-1] | numFilter}}</li>
                    </ul>
                </div>
            </div>
            <div class="dialog_login__ft">
                <p class="btn_right">
                    <span @click="resendSmsCode">{{countDownTxt}}</span>
                </p>
            </div>
        </div>
        <!-- 图形验证码 -->
        <div class="dialog_login part_imgcode" v-if="showFlag == 'showImg'">
            <div class="btn_close" @click="terminateProcess"></div>
            <div class="dialog_login__hd">
                <p class="title">{{imgTitleInfo}}</p>
                <p :class="['title_sub', imgWarn ? 'color_warn': '']">{{imgWarn}}</p>
            </div>
            <div class="dialog_login__bd">
                <input
                    v-model="imgCode"
                    class="input_img"
                    type="text"
                    maxlength="4"
                    placeholder="请输入图形验证码"
                />
                <img class="img_code" :src="imgCodeSrc" alt @click="setImgCode" />
            </div>
            <div class="dialog_login__ft">
                <a href="javascript:;" class="btn_submit mt25" @click="submitImgCode">确认</a>
            </div>
        </div>
    </div>
</template>
<script>
import { urlHandler } from 'src/libs/domain'
import configMixin from './config'
import { goAuth } from './api'
const bindLogin = urlHandler('/login/weChat/bindLogin')
const smsLogin = urlHandler('/login/doSmsLogin')
const sendCodeMsg = urlHandler('/login/common/sendCodeMsg')

export default {
    name: 'sdk_demo',
    mixins: [configMixin],
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        phoneInfo: {
            type: Object,
            default: () => {
                return {
                    title: '请输入手机号进行登录', // 请输入手机号进行登录
                    btnTxt: '确认'
                }
            }
        },
        smsTitleInfo: {
            type: String,
            default: '输入验证码'
        },
        imgTitleInfo: {
            type: String,
            default: '输入校验码'
        },
        isAutoFn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            showFlag: 'showPhone',
            /* content value */
            imgCode: '',
            imgCodeSrc: '',
            smsCode: '',
            phoneNo: '',
            /* waring txt */
            phoneWarn: '',
            smsWarn: '',
            imgWarn: '',
            /* count down */
            isCounting: false,
            currentCount: 60,
            countDownTxt: '重新发送',
            /* btn disabled */
            sendCodeDisabled: false
        }
    },
    computed: {
        smsCodeArr() {
            return this.smsCode.split('')
        },
        smsTxt() {
            return '已发送验证码至' + this.phoneNo
        },
        protocolUrl() {
            let url = ''
            if (aixuedai.isUavoApp === 'n') {
                url = aixuedai.h5WebUrl + '/h5/user/contract/viewPublicTemplate/CT190516452'
            } else {
                url = aixuedai.appUrl + '/app/user/contract/viewPublicTemplate/CT190516452'
            }
            return url
        }
    },
    watch: {
        /* warn watch */
        phoneNo(curVal, oldVal) {
            if (!curVal || !oldVal) {
                this.phoneWarn = ''
            }
        },
        smsCode(curVal, oldVal) {
            if (curVal.length === 6) {
                if (!/^\d{6}$/.test(curVal)) {
                    this.warn('sms', '请输入6位数字验证码')
                    return
                }
                this.smsWarn = ''
                this.doLogin()
            }
        },
        imgCode(curVal, oldVal) {
            if (!curVal || !oldVal) {
                this.imgWarn = ''
            }
        }
    },
    filters: {
        numFilter(val) {
            if (!val) {
                return ''
            } else {
                return val
            }
        }
    },
    mounted() {
        this.initSecurityFile()
    },
    methods: {
        // 加载反欺诈css文件
        initSecurityFile() {
            this.includeCss(urlHandler('/login/themes/view.css'))
        },
        // 副标题警告提示
        warn(type, info) {
            this[type + 'Warn'] = info
        },
        // 手机号校验、发送验证码
        sendSmsCode() {
            if (this.sendCodeDisabled) {
                return
            }

            if (!/^1\d{10}/.test(this.phoneNo)) {
                this.phoneNo ? this.warn('phone', '请输入11位有效手机号') : this.warn('phone', '手机号不可为空')
                return
            }

            this.sendCode()
        },
        // 倒计时
        countDown() {
            if (!this.isCounting) {
                this.isCounting = true
            }

            setTimeout(() => {
                if (this.currentCount) {
                    /* beautify preserve:start */
                    this.currentCount--
                    this.countDownTxt = '重新发送 (' + this.currentCount + 's)'
                    /* beautify preserve:end */
                    this.countDown()
                } else {
                    this.currentCount = 60
                    this.countDownTxt = '重新发送'
                    this.isCounting = false
                }
            }, 1000)
        },
        // 重发验证码
        resendSmsCode() {
            if (!this.isCounting) {
                this.sendCode()
            }
        },
        // 提交imgCode获取短信验证码
        submitImgCode() {
            if (this.sendCodeDisabled) {
                return
            }

            if (!/^[A-Za-z\d]{4}$/.test(this.imgCode)) {
                this.imgCode ? this.warn('img', '请输入4位有效图形验证码') : this.warn('img', '验证码不可为空')
                return
            }

            this.sendCode()
        },
        // 发码SMS
        sendCode() {
            this.sendCodeDisabled = true
            this.postPromise(sendCodeMsg, {
                telphone: this.phoneNo,
                imgCode: this.imgCode,
                smstype: 'reg'
            }).then(res => {
                this.sendCodeDisabled = false
                if (res.success) {
                    this.showFlag = 'showSms'
                    this.countDown()
                } else {
                    if (res.code === '1003' || res.resultDes === '请输入图形验证码') {
                        this.setImgCode()
                        this.showFlag = 'showImg'
                    } else if (res.code === '1005' || res.resultDes === '图形验证码错误') {
                        this.imgWarn = '请输入正确的图形验证码'
                        this.showFlag = 'showImg'
                    } else {
                        this.warn('sms', res.resultDes)
                    }
                }
            })
        },
        // 聚焦输入框
        focusOnInput() {
            let inputObj = this.$refs.realInput
            inputObj.focus()
        },
        // 绑定登录
        doLogin() {
            let openId = this.getCookie('fopid')
            if (!openId && this.isWeixin()) {
                goAuth()
                return
            }

            let ajaxUrl = this.isWeixin() ? bindLogin : smsLogin

            this.postPromise(ajaxUrl, {
                username: this.phoneNo,
                telphone: this.phoneNo,
                imgCode: this.imgCode,
                smsCode: this.smsCode,
                channel: this.$route.query.channel,
                _spm_: this.$route.query._spm_,
                openid: openId,
                smstype: 'reg'
            }).then(res => {
                if (res.success) {
                    this.showFlag = 'showPhone'
                    // 置空变量
                    this.clearVal('phoneNo', 'smsCode', 'imgCode')
                    // 成功后刷新页面,部分安卓机器微信浏览器reload方法失效
                    // window.location.reload(true)
                    // 当前页面如果有参数如?abc=xxx, 后面再跟?time=1527936291268，就会有问题
                    let _url = window.location.href
                    let param = _url.split('?')[1]
                    let timestamp = new Date().getTime()
                    let uchar = '?'
                    uchar = param ? '&' : '?'
                    if (this.isAutoFn) {
                        _url = _url + uchar + 'isAutoFn=true&time=' + timestamp
                    } else {
                        _url = _url + uchar + 'time=' + timestamp
                    }
                    window.location.href = _url
                    // this.$emit('hideDialog')
                } else {
                    this.warn('sms', res.resultDes)
                }
            })
        },
        // 设置图片验证码，清空imgCode
        setImgCode() {
            this.imgCodeSrc = urlHandler('/login/vcode?time=' + new Date())
            this.imgCode = ''
        },
        // clear val
        clearVal() {
            let keysArr = [...new Set(arguments)]
            keysArr.forEach(item => {
                this[item] = ''
            })
        },
        // 终止登录流程
        terminateProcess() {
            this.showFlag = 'showPhone'
            this.clearVal('phoneNo', 'smsCode', 'imgCode')
            this.$emit('hideDialog')
        }
    }
}
</script>
<style lang="scss" scoped>
.mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
}

.dialog_login {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -65%);
    -webkit-transform: translate(-50%, -65%);
    width: 13.86667rem;
    padding: 1.49333rem 1.36533rem 0; // 1.49333rem
    background-color: #fff;
    border-radius: 0.21333rem;
    z-index: 1010;
    overflow: hidden;
    .btn_close {
        position: absolute;
        right: 0.5rem;
        top: 0.5rem;
        width: 0.8rem;
        height: 0.8rem;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAkCAMAAAA96dOpAAAAV1BMVEUAAACZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZkABlXAAAAAHHRSTlMABa0fCd5+vr3IVw7239i3momCeHFmThSkjTsrEvHFrwAAAMFJREFUOMuN0lkOgzAMBFBDaCn7Uujq+5+zKBBZ1WTSzldGenIiOeKTZfJH7rm2E5HN+ryF86Bb8ih0J1Udj3GqBpFtee+jNUDC9Lj5QWBgrdt7cTEYYbqIIER29hUhMg6RIQTGIDAGgcXh0BlLQmAIkXGIDGEV2CypuE5hM+RbAqQMITKEnM0lhd+rLwymmAAkDCBjCJEhpAwhMg6b3lgcXn1djBFY+TYaI7D0ZTVGYO3PWR6eEINTX9WhvGonP/IBXLcxgJyxxSIAAAAASUVORK5CYII=')
            0 center no-repeat;
        background-size: cover;
        opacity: 0.3;
    }
}

.dialog_login__hd {
    font-size: 0.768rem;
    line-height: 0.768rem;
    text-align: center;
    color: #333333;
}

.dialog_login__bd {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.btn_submit {
    position: relative;
    display: block;
    width: 100%;
    height: 1.87733rem;
    padding-left: 0.29867rem;
    padding-right: 0.29867rem;
    margin: 1.1rem auto 0;
    font-size: 0.768rem;
    line-height: 1.87733rem;
    text-align: center;
    text-decoration: none;
    color: #474747;
    background-color: #ffe352;
    border-radius: 0.21333rem;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
}

.title {
    font-size: 0.768rem;
    line-height: 1.49333rem;
    color: #333333;
}

.title_sub {
    font-size: 0.59733rem;
    color: #666666;
}

.color_warn {
    color: #ff6161;
}

/* 手机号 */

.part_phone {
    padding-bottom: 1.49333rem;
    .dialog_login__bd {
        border-bottom: 1px solid #ececec;
    }
    .input_no {
        display: block;
        width: 100%;
        height: 1.70667rem;
        line-height: 1.70667rem;
        font-size: 0.64rem;
        border-style: none; // border-bottom: 1px solid #ececec;
        margin-top: 1.49333rem;
    }
    .icon_delete {
        width: 0.85333rem;
        height: 0.85333rem;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoBAMAAAB+0KVeAAAAMFBMVEUAAADNzc3Nzc3V1dXZ2dnMzMzMzMzNzc3MzMzMzMzNzc3Nzc3Nzc339/f////09PRTI10MAAAADHRSTlMA85YYBuPZx7+CRy3zedm4AAAAvklEQVQoz2OgIfDSSBRrWoIqZiRzBggOKiOLeQLFwKJTEGLMNWeg4LgBXHDrGTiIhiuMQQgehSl1P4MESqCCc5AFT0J1yyALHoToZwIyz/85AyMVwIKOIO5bkOA9kKAIWHANmH/nzJmzYJlTYEEdIAsoAJYAgkNgwZ4zEKUQhWdOgAVzzkCUQhSeOQYWhLro3luom3AJYmrHZRGmk3A5HtObuAMEM+gwAxl3dGBGHGYU40sMmMkGM4FhJkXaAQBJkjrUzU/niwAAAABJRU5ErkJggg==')
            0 center no-repeat;
        background-size: cover;
        margin-top: 1.49333rem;
    }
    .text_protocol {
        font-size: 0.512rem;
        line-height: 0.512rem;
        color: #999999;
        margin-top: 0.64rem;
        a {
            display: inline-block;
            color: #fdb53a;
        }
    }
}

/* 短信验证码 */

.part_sms {
    padding-bottom: 1.28rem;
    .part_input {
        position: relative;
        margin: 0.64rem auto 0.8rem;
        width: 100%;
    }

    .input_hidden {
        position: absolute;
        left: 0;
        top: 0;
        height: 1px;
        opacity: 0;
        text-indent: -999rem; // 隐藏input文字
        margin-left: -100%; // 隐藏input光标
        width: 200%; // 保留inputDOM在页面可视区域内
    }

    .input_fake {
        display: flex;
        justify-content: space-between;
        li {
            width: 1.49333rem;
            height: 1.49333rem;
            line-height: 1.49333rem;
            border-bottom: 1px solid #e4e4e4;
            text-align: center;
        }
    }
    .btn_right {
        text-align: right;
        color: #fdb53a;
        font-size: 0.512rem;
    }
}

/* 图形验证码 */

.part_imgcode {
    padding-bottom: 0.64rem;
    .img_code {
        width: 3.41333rem;
        height: 1.28rem;
        margin-top: 1.49333rem;
    }
    .input_img {
        display: inline-block;
        width: 6.93333rem;
        height: 1.70667rem;
        line-height: 1.70667rem;
        font-size: 0.64rem;
        border-style: none;
        border-bottom: 1px solid #ececec;
        margin-top: 1.49333rem;
        text-align: center;
    }
    .mt25 {
        margin-top: 0.53333rem;
    }
}
</style>
