<!--
    Created by Doris on 04/2017
-->
<template>
    <div class="aui-page" v-if="!fixedPageHeight"></div>
    <div class="aui-page" v-else :style="{'height':+fixedPageHeight+'px'}">
        <foot-btn></foot-btn>
        <div class="aui-content">
            <axd-image :src="banner" :lazy="false"></axd-image>
            <div class="page-bd">
                <div class="aui-cells">
                    <telphone ref="tel" v-on:getUserName="getUserName"></telphone>
                    <pwd>
                        <input slot="inputClear" type="text" placeholder="请输入密码" class="aui-input" v-model.trim="pwd" id="pwdInput">
                        <input slot="inputCipher" type="password" placeholder="请输入密码" class="aui-input" v-model.trim="pwd" id="pwdInput">
                    </pwd>
                    <div class="aui-cell">
                        <div class="aui-cell__bd">
                            <input type="text" placeholder="请输入图形验证码" class="aui-input" maxlength="4" v-model.trim="form.code" id="imgCode">
                        </div>
                        <div class="aui-cell__ft">
                            <img :src="codeSrc" alt="" @click="setCode()" class="cell-ft__code">
                        </div>
                    </div>
                </div>
                <div class="aui-btn aui-btn_primary" :class="{'aui-btn_disabled':disable}" @click="submit">登录</div>
                <div class="page-bd__other">
                    <router-link :to="{ name: 'smslogin', query: {url: form.url } }" replace>短信快捷登录</router-link>
                    <router-link :to="{ name: 'forgetpwd' }">忘记密码</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    login
} from 'src/store/modules/user'
import {
    getEncryptedPsw,
    AXD
} from 'libs/util'
import {
    testTelphone,
    testPwd,
    testNumPwd,
    testImgCode
} from '../common/common'
import axdImage from 'components/image/index.vue'
import pwd from '../common/pwd.vue'
import telphone from './telphone.vue'
import footBtn from './footbtn.vue'

export default {
    name: 'pwdlogin',
    data() {
        return {
            banner: require('../img/login_banner.png'),
            closeBtn: require('../img/close.png'),
            pwd: '',
            form: {
                username: '',
                password: '',
                code: '',
                url: this.$route.query.url
            },
            codeSrc: '',
            disable: false,
            fixedPageHeight: 0,
            initialBodyHeight: 0
        }
    },
    created() {},
    mounted() {
        this.init()
    },
    components: {
        axdImage,
        pwd,
        footBtn,
        telphone
    },
    methods: {
        init() {
            this.setCode()
            this.$nextTick(() => {
                this.initPageHeight()
            })
        },
        initPageHeight() {
            let pHeight = document.getElementsByClassName('aui-page')[0].offsetHeight
            if (pHeight == 0) {
                setTimeout(this.initPageHeight, 100)
            } else {
                this.fixedPageHeight = pHeight
                this.initialBodyHeight = pHeight

                // 处理H5浏览器下向上滚动 浏览器头部会自动收起 导致页面高度变化 底部按钮悬空的问题
                let that = this
                window.onresize = () => {
                    return (() => {
                        let screenHeight = document.body.clientHeight
                        if (screenHeight >= that.initialBodyHeight) {
                            that.fixedPageHeight = screenHeight
                        }
                    })()
                }
            }
        },
        setCode() {
            this.codeSrc = '/vcode?time=' + new Date().getTime()
            this.form.code = ''
        },
        getUserName(value) {
            this.form.username = value
        },
        submit() {
            if (this.disable) {
                return
            }
            this.$refs.tel.usernameValue()
            this.form.password = getEncryptedPsw(this.pwd)
            let url = this.$route.query.url
            if (this.check(this.form)) {
                this.disable = true
                login(this.form, res => {
                    if (res.success) {
                        window.location.replace(AXD.util.urlIllegal(url) ? aixuedai.returnUrl : url)
                    } else {
                        this.$_toast(res.resultDes)
                        this.setCode()
                        this.disable = false
                    }
                })
            }
        },
        check(form) {
            if (!testTelphone(form.username)) {
                form.username ? this.$_toast('手机号格式输入不正确') : this.$_toast('请输入您的手机号码')
                this.$refs.tel.focusOn()
                return
            }
            if (!testPwd(this.pwd) && !testNumPwd(this.pwd)) {
                this.pwd ? this.$_toast('密码格式输入不正确') : this.$_toast('请输入密码')
                document.getElementById('pwdInput').focus()
                return
            }
            if (!testImgCode(form.code)) {
                form.code ? this.$_toast('验证码错误') : this.$_toast('请输入验证码')
                return
            }
            return true
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../var.scss';
@import '../common.scss';
.aui-page {
    background-color: #fff;
}

.page-bd {
    padding: 0 px2rem(45);
    min-height: px2rem(660);
    .aui-cells {
        margin-top: px2rem(0);
        &:before {
            content: none;
        }
        &:after {
            @include line;
            bottom: 0;
        }
    }
    .aui-cell {
        padding: 0 px2rem(21) 0 px2rem(10);
        &:before {
            left: 0;
        }
    }
    .aui-cell__close {
        width: px2rem(43);
    }
    .cell-ft__code {
        width: px2rem(230);
        height: px2rem(80);
    }
    .aui-btn {
        margin: px2rem(40) auto;
    }
    .page-bd__other {
        a {
            color: #666;
            display: block;
        }
        a:last-child {
            text-decoration: underline;
        }
    }
}
</style>
