<template>
    <div class="aui-page">
        <axd-loading :show="showLoading" message="加载中..."></axd-loading>
        <div class="page__box">
            <div class="page-hd">
                <platforms v-if="platforms"></platforms>
            </div>
            <div class="page-bd">
                <div class="aui-cells">
                    <div class="aui-cell">
                        <div class="aui-cell__bd">
                            <input type="tel" ref="tel" placeholder="请输入本人手机号注册" class="aui-input" v-model.trim="telphone" maxlength="11">
                        </div>
                        <div class="aui-cell__ft"></div>
                    </div>
                    <vcode :telphone="telphone" :readImgCode="imgCode" smstype="reg">
                        <input slot="smsCode" class="aui-input w600" type="tel" placeholder="请输入验证码" maxlength="6" v-model.trim="checkCode">
                        <input slot="imgCode" class="aui-input w600" type="text" placeholder="请输入图形验证码" maxlength="4" v-model.trim="imgCode">
                    </vcode>
                    <pwd>
                        <input slot="inputClear" type="tel" placeholder="8位以上数字和字母的组合" class="aui-input" v-model.trim="password">
                        <input slot="inputCipher" type="password" placeholder="8位以上数字和字母的组合" class="aui-input" v-model.trim="password">
                    </pwd>
                    <div class="aui-cell" v-show="inviteVisible">
                        <div class="aui-cell__bd">
                            <input ref="inviteEl" type="text" placeholder="输入推荐码" class="aui-input" v-model.trim.lazy="inviteCode" maxlength="10">
                        </div>
                        <div class="aui-cell__ft"></div>
                    </div>
                </div>
                <div class="page-bd__other">
                    <div class="aui-protocol">
                        同意
                        <a :href="regProto">《招集令用户注册协议》</a>
                    </div>
                    <div class="show-invite" @click="toggleInviteLine">
                        {{inviteVisible ? '收起推荐码' : '填写推荐码'}}
                    </div>
                </div>
                <div class="aui-btn aui-btn_primary" @click="submit">注册</div>
            </div>
            <partner></partner>
        </div>
    </div>
</template>
<script>
import axdLoading from 'components/loading/index.vue'
import vcode from '../common/vcode.vue'
import partner from './partner.vue'
import platforms from './platforms.vue'
import pwd from '../common/pwd.vue'
import {
    testTelphone,
    testPwd,
    testImgCode,
    testVcode,
    regProto
} from '../common/common'
import { getCookie } from 'src/libs/util'

import {
    register,
    phoneExists
} from 'src/store/modules/user'
import {
    getEncryptedPsw,
    getDecryptedPsw,
    AXD
} from 'libs/util'
export default {
    name: 'register',
    data() {
        return {
            regProto: regProto,
            telphone: '',
            checkCode: '',
            imgCode: '',
            password: '',
            inviteCode: '',
            inviteVisible: false,
            showLoading: false,
            routeQuery: this.$route.query,
            platforms: this.$route.query.platforms,
            acrCode: this.$route.query.acrCode
        }
    },
    computed: {
        recommendCode() {
            // return this.inviteCode.replace(/<[^>]+>/gi, '')
            return this.inviteCode.replace(/[<>]/gi, '')
        }
    },
    watch: {
        telphone(to, from) {
            if (testTelphone(this.telphone)) {
                phoneExists({
                    cellphone: this.telphone
                }, res => {
                    if (!res.success) {
                        this.$_toast(res.resultDes)
                    }
                })
            }
        }
    },
    created() {},
    mounted() {
        if (this.routeQuery.acrCode) {
            this.inviteCode = this.routeQuery.acrCode
            this.$refs.inviteEl.readOnly = true
        }
        setTimeout(() => {
            this.setUserName()
        }, 0)
        //  this.setCode()
    },
    components: {
        axdLoading,
        vcode,
        partner,
        platforms,
        pwd
    },

    methods: {
        init() {},
        toggleInviteLine() {
            this.inviteVisible = !this.inviteVisible
        },
        submit() {
            if (!testTelphone(this.telphone)) {
                this.telphone ? this.$_toast('手机号输入不正确') : this.$_toast('请输入手机号')
                return
            }
            if (!testPwd(this.password)) {
                this.password ? this.$_toast('请输入8位以上数字字母组合密码') : this.$_toast('请输入密码')

                return
            }
            if (!testVcode(this.checkCode)) {
                this.checkCode ? this.$_toast('验证码输入不正确') : this.$_toast('请输入验证码')
                return
            }
            let param = {
                telphone: this.telphone,
                checkCode: this.checkCode,
                imgCode: this.imgCode,
                password: getEncryptedPsw(this.password), // 加密
                recommendCode: this.recommendCode
            }
            this.showLoading = true
            register(param, res => {
                this.showLoading = false
                if (res.success) {
                    let url = this.routeQuery.url
                    if (!AXD.util.urlIllegal(url)) {
                        window.location.href = url
                    } else {
                        let urlSearch = ''
                        if (this.platforms) {
                            urlSearch = '?platforms=' + encodeURIComponent(this.platforms)
                        }
                        window.location.href = '/pages/auth/index' + urlSearch
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        setUserName() {
            let cookieStr = getCookie('partnerAuth')
            if (cookieStr) {
                let partnerAuth = JSON.parse(getDecryptedPsw(cookieStr))
                if (partnerAuth.partnerInfo && partnerAuth.channel == 'pu') {
                    this.telphone = partnerAuth.partnerInfo
                    this.$refs.tel.readOnly = true
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../var.scss';
@import '../common.scss';
.w340 {
    width: px2rem(340);
}

.w600 {
    width: px2rem(600);
}

.aui-page {
    background-color: #fff
}

.page__box {
    height: auto;
    position: relative;
    padding-bottom: 100px;
    min-height: 100%;
}

.page-bd {
    padding: 0 px2rem(45);
    .aui-cells {
        margin-top: px2rem(0);
        input {
            display: block;
        }
        &:after {
            @include line;
            bottom: 0;
        }
    }
    .cell-ft__pwd {
        width: px2rem(66);
        height: px2rem(66);
    }
    .cell-ft__code {
        width: px2rem(230);
        height: px2rem(80);
    }
    .page-bd__other {
        display: flex;
        justify-content: space-between;
        font-size: px2rem(38);
        line-height: px2rem(140);
        color: #222;
    }
}
</style>
