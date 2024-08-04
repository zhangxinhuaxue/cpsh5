<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="userinfo">
            <div class="aui-cells">
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">姓名</label>
                    </div>
                    <div class="aui-cell__bd">
                        {{userName | nameReplace}}
                    </div>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">身份证号</label>
                    </div>
                    <div class="aui-cell__bd">
                        {{userId | IDcardReplace}}
                    </div>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">银行卡号</label>
                    </div>
                    <div class="aui-cell__bd">
                        {{userBankCardId | BankCardIdReplace}}
                    </div>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">手机号</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input ref="userphone" class="aui-input" type="tel" maxlength="13" placeholder="请输入银行卡预留手机号" v-model="userPhoneNum">
                    </div>
                </div>
            </div>
            <sms-check @sendSmsCode="sendSmsCode" @reset="countOn=false" @setSmsCode="setSmsCode" :countOn="countOn" :telNum="userPhoneNum"></sms-check>
            <a href="javascript:;" class="aui-btn aui-btn_primary" @click="complete">完成</a>
            <p class="link_banklist">
                <span @click="goBankListPage">
                        支持银行卡列表
                </span>
            </p>
        </div>
    </div>
    <router-view></router-view>
</div>
</template>
<script>
import smsCheck from 'components/smscheck/index.vue'
import {
    AXD,
    PhoneReplace,
    nameReplace,
    BankCardIdReplace,
    IDcardReplace
} from 'src/libs/util'
import {
    modifyReservePhone,
    sendVerifyCode
} from 'store/modules/rrh'
export default {
    name: 'binkCard',
    data() {
        return {
            barConfig: {
                app: {
                    rightBtnShow: false
                }
            },
            userName: this.$route.params.name,
            userId: this.$route.params.personCard,
            userBankCardId: this.$route.params.bankCard,
            loanId: this.$route.params.loanId,
            oidBiz: this.$route.params.oidBiz,
            userPhoneNum: '',
            smscode: '',
            countOn: false,
            token: null
        }
    },
    components: {
        smsCheck
    },
    filters: {
        PhoneReplace,
        nameReplace,
        BankCardIdReplace,
        IDcardReplace
    },
    methods: {
        /**
         * 提交修改手机号操作
         */
        complete() {
            if (!this.userPhoneNum) {
                this.$_toast('请输入银行卡预留手机号')
                return
            }
            if (!this.smscode) {
                this.$_toast('请输入短信验证码')
                return false
            }
            modifyReservePhone({
                telphone: this.userPhoneNum,
                bankcardNo: this.userBankCardId,
                verifyCode: this.smscode,
                token: this.token
            }).then(res => {
                if (res.success) {
                    this.$router.replace({
                        name: 'rrhSign',
                        params: {
                            bankCard: this.userBankCardId,
                            name: this.userName,
                            personCard: this.userId,
                            telphone: this.userPhoneNum,
                            loanId: this.loanId,
                            oidBiz: this.oidBiz
                        }
                    })
                } else {
                    let desc = res.resultDes
                    if (res.code === '1000') {
                        desc = '验证码失效，请重新发送'
                    }
                    this.$_toast(desc)
                }
            })
        },
        /**
         * 发送验证码
         */
        sendSmsCode() {
            if (!this.userPhoneNum) {
                this.$_toast('请输入银行卡预留手机号')
                return
            }
            this.countOn = true
            // 开始绑卡
            sendVerifyCode({
                telphone: this.userPhoneNum,
                bankcardNo: this.userBankCardId
            }).then((res) => {
                if (res.success) {
                    this.token = res.result.token
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else if (res.code == '20905') {
                        this.$_alert('抱歉，该银行暂不支持绑卡，详情请查看“支持银行列表”')
                    } else {
                        this.$_alert(res.resultDes)
                    }
                }
            })
        },
        /**
         * 获取验证码
         */
        setSmsCode(code) {
            this.smscode = code
        },
        /**
         * 查看支持银行卡列表
         * @return {[type]} [description]
         */
        goBankListPage() {
            this.$router.push({
                name: 'rrhMPSupportBankList'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/aui-vars.scss';
.userinfo {
    .aui-btn_primary {
        margin-top: px2rem(40);
    }
}
.link_banklist {
    padding: px2rem(20) px2rem(36);
    text-align: right;
    line-height: px2rem(24);
    span {
        font-size: px2rem(24);
        line-height: px2rem(24);
        color: #2CB5FC;
    }
}
.tip {
    padding: px2rem(18) px2rem(32);
    color: var(--auiTipsColor);
    font-size: px2rem(24);
    line-height: px2rem(32);
    background: url('../styles/imgs/tip.png') px2rem(32) px2rem(24) no-repeat;
    background-size: px2rem(24) px2rem(24);
    text-indent: px2rem(30);
}
.aui-btn_primary {
    border-radius: var(--auiButtonRadiusLarge);
    background-color: var(--auiColorPrimary);
    color: var(--auiButtonTextColor);
}
.aui-btn_disabled {
    background-color: var(--auiColorDisabled);
}
</style>
