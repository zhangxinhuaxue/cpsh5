<!--
    Created by Doris on 04/2017
-->
<template>
    <div class="aui-page" v-if="!fixedPageHeight"></div>
    <div class="aui-page smslogin" v-else :style="{'height':+fixedPageHeight+'px'}">
        <foot-btn></foot-btn>
        <div class="aui-content">
            <axd-image :src="banner" :lazy="false"></axd-image>
            <div class="page-bd">
                <div class="aui-cells">
                    <telphone ref="tel" v-on:getUserName="getUserName"></telphone>
                    <vcode :telphone="form.username" :readImgCode="form.imgCode" smstype="sms_login">
                        <input slot="smsCode" class="aui-input w600" type="tel" placeholder="请输入验证码" maxlength="6" v-model.trim="form.smsCode" ref="smsCode">
                        <input slot="imgCode" class="aui-input w600" type="text" placeholder="请输入图形验证码" maxlength="4" v-model.trim="form.imgCode">
                    </vcode>
                </div>
                <div class="aui-protocol">
                    同意
                    <a :href="regProto">《招集令用户注册协议》</a>
                </div>
                <div class="aui-btn aui-btn_primary" :class="{'aui-btn_disabled':disable}" @click="submit">登录</div>
                <div class="page-bd__other">
                    <router-link :to="{ name: 'login' }" replace>账号密码登录</router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    smsLogin
} from 'src/store/modules/user'
import {
    testTelphone,
    testVcode,
    testImgCode,
    regProto
} from '../common/common'
import {
    AXD
} from 'libs/util'
import axdImage from 'components/image/index.vue'
import vcode from '../common/vcode.vue'
import telphone from './telphone.vue'
import footBtn from './footbtn.vue'
export default {
    name: 'smslogin',
    data() {
        return {
            banner: require('../img/login_banner.png'),
            closeBtn: require('../img/close.png'),
            regProto: regProto,
            needImgCode: false,
            imgCode: '',
            form: {
                username: '',
                smsCode: ''
            },
            disable: false,
            fixedPageHeight: 0,
            initialBodyHeight: 0
        }
    },
    mounted() {
        this.init()
    },
    components: {
        axdImage,
        vcode,
        footBtn,
        telphone
    },
    methods: {
        init() {
            this.$nextTick(function() {
                this.initPageHeight()
            })
        },
        getUserName(value) {
            this.form.username = value
        },
        submit() {
            if (this.disable) {
                return
            }
            this.$refs.tel.usernameValue()
            let url = this.$route.query.url
            if (this.imgCode) {
                Object.assign(this.form, {
                    imgCode: this.imgCode
                })
            }
            if (this.check(this.form)) {
                this.disable = true
                smsLogin(this.form, res => {
                    if (res.success) {
                        if (res.code == '10050' || res.code == '10051') {
                            window.location.replace(AXD.util.urlIllegal(url) ? aixuedai.returnUrl : url)
                        }
                    } else {
                        this.$_toast(res.resultDes)
                    }
                    this.disable = false
                })
            }
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
        check(form) {
            if (!testTelphone(form.username)) {
                form.username ? this.$_toast('手机号格式输入不正确') : this.$_toast('请输入您的手机号码')
                this.$refs.tel.focusOn()
                return
            }
            if (!testVcode(form.smsCode)) {
                form.smsCode ? this.$_toast('短信验证码格式错误') : this.$_toast('请输入短信验证码')
                this.$refs.smsCode.focus()
                return
            }
            if (this.needImgCode) {
                if (!testImgCode(form.code)) {
                    form.imgCode ? this.$_toast('图形验证码错误') : this.$_toast('请输入图形验证码')
                    return
                }
            }
            return true
        }
    }
}
</script>
<style lang="scss">
@import '../var.scss';
@import '../common.scss';
.w600 {
    width: px2rem(600);
}

.smslogin {
    background-color: #fff;
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
        .aui-btn {
            margin-bottom: px2rem(40);
        }
        .page-bd__other {
            a {
                color: #666;
                display: block;
            }
        }
    }
}
</style>
