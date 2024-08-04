<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <p class="username">请添加<strong>{{userInfoObj.userName}}</strong>名下银行借记卡</p>
            <cardFourElements :userInfo="userInfoObj" @complete="complete"></cardFourElements>
            <div class="privacy-tip">
                您输入的银行卡号码属于敏感个人信息，点击“确认”（以页面显示为准）代表您充分知悉并同意我们基于身份识别、借款服务、完成支付、银行卡鉴权的目的处理您的上述信息。同时我们将依据法律法规与《隐私协议》严格保护您的信息安全。
            </div>
        </div>
    </div>
</template>
<script>
import {getBindCardUserInfo, bindCardConfirm} from 'store/modules/bankbind/bank'
import cardFourElements from './cardFourElements.vue'
import { AXD } from 'src/libs/util'
export default {
    name: 'add',
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            userInfoObj: {
                userName: '',
                userID: '',
                phoneNum: '',
                cardCode: ''
            }
        }
    },
    computed: {
    },
    components: {
        cardFourElements
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            let toUrl = AXD.util.getUrlParam('toUrl') || ''
            getBindCardUserInfo({
                toUrl
            }).then((res) => {
                if (res.success) {
                    this.userInfoObj.userName = res.result.realname
                    this.userInfoObj.userID = res.result.identifyCard
                    this.userInfoObj.phoneNum = res.result.telphone
                }
            })
        },
        complete(data) {
            // 服务端提供添加银行卡接口保存
            bindCardConfirm({
                token: data.token,
                verifyCode: data.smsCode, // 银行卡号
                source: '9'
            }).then((res) => {
                if (res.success) {
                    let toUrl = ''
                    if (res.result && res.result.toUrl) {
                        toUrl = res.result.toUrl
                    }

                    this.$_toast('绑卡成功', () => {
                        if (toUrl) {
                            window.location.href = this.isApp ? decodeURIComponent(toUrl) : toUrl
                        } else {
                            this.$router.go(-1)
                        }
                    })
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.username {
    font-size: px2rem(24);
    font-weight: 400;
    text-align: left;
    color: #999999;
    padding: px2rem(24) px2rem(32) px2rem(0);
    strong{
        font-weight: bolder;
        color: #666;
    }
}
.privacy-tip {
    color: #aaa;
    font-size: px2rem(24);
    padding: px2rem(36);
}
</style>
