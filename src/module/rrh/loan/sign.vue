<template>
    <div class="aui-page">
        <hybrid-header></hybrid-header>
        <div class="aui-content">
            <div class="userinfo">
                <p class="username">请确认<strong>{{userName | nameReplace}}</strong>名下银行借记卡信息</p>
                <div class="aui-cells">
                    <div class="aui-cell">
                        <div class="aui-cell__hd">
                            <label class="aui-label">银行</label>
                        </div>
                        <div class="aui-cell__bd">
                            {{bankName}}
                        </div>
                    </div>
                    <!-- <div class="aui-cell">
                        <div class="aui-cell__hd">
                            <label class="aui-label">身份证号</label>
                        </div>
                        <div class="aui-cell__bd">
                            {{userId | IDcardReplace}}
                        </div>
                    </div> -->
                    <div class="aui-cell">
                        <div class="aui-cell__hd">
                            <label class="aui-label">卡号</label>
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
                            {{userPhoneNum | PhoneReplace}}
                        </div>
                    </div>
                </div>
                <sms-check @sendSmsCode="sendSmsCode" @reset="countOn=false" @setSmsCode="setSmsCode" :countOn="countOn" :telNum="userPhoneNum">
                    <span slot="tip" class="tip" @click="modifyPhone">更改手机号</span>
                </sms-check>
                <div v-if="contract" class="protocol-box">
                    <i :class="styleAgree" @click="isAgree = !isAgree"></i> 我同意
                    <a href="javascript:;" class="color-tips" @click="showConstract">{{contract.tempName}}</a>
                </div>
                <!-- <a href="javascript:;" class="aui-btn aui-btn_primary" @click="complete">确认</a> -->
                <m-button :disabled="btnflag" class="confirmBtn mt100" @click="complete">确认</m-button>
                <!-- <p class="link_banklist">
                    <span @click="goBankListPage">
                        支持银行卡列表
                    </span>
                </p> -->
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>
<script>
import { AXD, isZjl, PhoneReplace, nameReplace, BankCardIdReplace, IDcardReplace } from 'src/libs/util'
import smsCheck from 'components/smscheck/index.vue'
import { resetHeader } from 'components/header/resetHeader'
import {
    reapyChangeBank,
    getSignVerifyCode,
    sign
} from 'store/modules/rrh'
import {getInfoByCardId } from 'store/modules/bankbind/bank'

import { closeWebView } from '../common/utils'
export default {
    name: 'binkCard',
    data() {
        return {
            // 用户名称
            userName: '',
            // 用户身份证号
            userId: '',
            // 银行名
            bankName: '',
            // 用户银行卡号
            userBankCardId: '',
            // 用户手机号
            userPhoneNum: '',
            // 订单ID
            loanId: '',
            // 产品编码
            oidBiz: '',
            // 签约成功以后的跳转页面，放款流程跳转贷款签约页面， 还款流程跳转账单页面
            succTo: '',
            // 签约失败以后的跳转页面，放款流程跳转抱米花产品列表页， 还款流程跳转账单页面
            failTo: '',
            polling: 2000,
            during: 8,
            // 验证码
            smscode: '',
            // 是否获取验证码
            getSmsCode: false,
            // 获取验证码倒计时
            countOn: false,
            // 绑卡ID， 微贷还款签约使用
            bankCardId: '',
            // 分期数， 微贷还款签约使用
            period: '',
            isAgree: true,
            // 苏宁合同
            contract: null,
            // 苏宁使用参数
            quickAuthId: '',
            // 晋商换绑卡需要参数
            changeFlag: '',
            serialNo: '',
            btnflag: true
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
    computed: {
        styleAgree() {
            return this.isAgree ? 'icon-agree' : 'icon-disagree'
        }
    },
    mounted() {
        window.goBack = () => {
            // 重置原生head
            // resetHeader()
            this.isApp ? closeWebView() : window.history.back()
        }
        this.init()
        this.getInfoByCardId()
    },
    beforeRouteEnter(to, from, next) {
        if (['rrhLoan', 'rrhChangeCard', 'rrhBill', 'billIndex', 'replenishVerify', 'debitCard'].indexOf(from.name) >= 0) {
            // 光大、亲家、湖北消金， 从 借款页面/还款换绑卡页面 进入签约页面时， 会调用isNeedSign接口
            // 如果需要签约， 三方会发送验证码， 此时页面需要开始倒计时， 并且标注已获取验证码
            // 20201210 by wangxiaoxiang: isNeedSign接口和发送验证码分开，进入签约页单独发送验证码
            next(vm => {
                // vm.countOn = true
                // vm.getSmsCode = true
                vm.sendSmsCode()
            })
        } else {
            next()
        }
    },
    beforeDestory() {
        window.sessionStorage.removeItem('signInfo')
    },
    methods: {
        getInfoByCardId() {
            getInfoByCardId({bankCardId: this.bankCardId}).then(res => {  // 新接口待联调
                if (res.success) {
                    const { bankName, cardNo, mobile } = res.result
                    this.bankName = bankName
                    this.userBankCardId = cardNo // 银行卡号
                    this.userPhoneNum = mobile // 用户手机号

                } else if (res.code === '-1999') {
                    AXD.util.login()
                }
            })
        },
        init() {
            // 获取签约所需信息,判断如果有传参对象合并
            let signInfo = {
                ...JSON.parse(window.sessionStorage.getItem('signInfo')),
                ...this.$route.params.telphone ? this.$route.params : {}
            }
            if (signInfo) {
                // this.bankName = signInfo.bankName
                this.userName = signInfo.name // 用户名称
                // this.userId = signInfo.personCard // 用户身份证号
                // this.userBankCardId = signInfo.bankCard // 银行卡号
                // this.userPhoneNum = signInfo.telphone // 用户手机号

                this.loanId = signInfo.loanId // 订单ID
                this.oidBiz = signInfo.oidBiz // 产品编码
                this.during = signInfo.during || 10
                this.polling = signInfo.polling || 2000
                this.period = signInfo.period // 分期数， 微贷还款签约需要
                this.bankCardId = signInfo.bankCardId // 绑卡ID， 微贷还款签约需要
                this.succTo = signInfo.succTo // 签约成功以后的跳转页面， 放款流程跳转贷款签约页面， 还款流程跳转账单页面
                this.failTo = signInfo.failTo // 签约失败以后的跳转页面， 放款流程跳转抱米花产品列表页， 还款流程跳转账单页面
                this.quickAuthId = signInfo.quickAuthId // 苏宁金融签约需要的参数
                this.changeFlag = signInfo.changeFlag // 晋商签约换绑卡需要的参数
            }
        },
        /**
         * 提交签约
         */
        complete() {
            window.scroll(0, 0)
            if (!this.getSmsCode) {
                this.$_toast('请先点击获取验证码')
                return false
            }
            if (!this.smscode) {
                this.$_toast('请输入短信验证码')
                return false
            }
            if (!this.isAgree) {
                this.$_toast('请同意并阅读相关协议')
                return false
            }
            this.log({type: 'button', name: 'zfbankcard-button-submit', desc: '完成'})
            sign({
                loanId: this.loanId,
                verifyCode: this.smscode,
                productType: 'qdh',
                showLoading: true,
                bankCardId: this.bankCardId,
                period: this.period,
                quickAuthId: this.quickAuthId,
                changeFlag: this.changeFlag,
                serialNo: this.serialNo
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result.status === '03') { // 处理中， 跳转过渡页面， 轮序签约结果
                        window.sessionStorage.setItem('userOpInfo', JSON.stringify({
                            loanId: this.loanId,
                            oidBiz: this.oidBiz,
                            type: 'sign',
                            productType: 'rrh',
                            during: this.during,
                            polling: this.polling,
                            bankCardId: this.bankCardId,
                            period: this.period,
                            succTo: this.succTo,
                            failTo: this.failTo,
                            changeFlag: this.changeFlag
                        }))
                        this.$router.replace({
                            name: 'loanTransition'
                        })
                    } else if (result.status === '99') { // 失败
                        if (result.message && result.message.indexOf('验证码') >= 0) {
                            this.$_toast(result.message)
                        } else {
                            this.$_alert(result.message).then(res => {
                                if (this.failTo === 'rrhChangeCard') {
                                    this.$router.replace({
                                        name: this.failTo
                                    })
                                } else {
                                    this.$router.back()
                                }
                            })
                        }
                    } else {
                        this.$_toast('签约成功', () => {
                            if(this.succTo==='password') {
                                this.toPassword()
                            } else {
                                this.bindCard()
                            }
                        })
                    }
                } else {
                    this.$_toast(res.resultDes)
                    // this.$_alert(res.resultDes).then(res => {
                    //     this.$router.replace({
                    //         name: this.failTo
                    //     })
                    // })
                }
            })
        },
        toPassword() {
            // 召集令取现外放用验证码，召集令APP内部调用用密码
            if (isZjl) {
                this.$router.replace({
                    name: 'commonPwdpage',
                    query: { source: 'rrh', id: this.loanId }
                })
            } else {
                this.$router.replace({
                    name: 'rrhVfCode',
                    query: {
                        key: 'wf',
                        id: this.loanId
                    }
                })
            }
        },
        // 绑卡
        bindCard() {
            reapyChangeBank({
                loanId: this.loanId,
                bankCardId: this.bankCardId
            }).then(res => {
                if (res.success && res.result.bindStatus === '1') {
                    this.$_toast('换绑卡成功', () => {
                        this.$router.back()
                    })
                } else {
                    let dialog = this.$createDialog({
                        content: res.resultDes,
                        confirmBtn: {
                            text: '我知道了'
                        },
                        onConfirm: () => {
                            dialog.hide()
                            this.$router.back()
                        }
                    }).show()
                }
            })
        },
        /**
         * 获取验证码
         * @return {[type]} [description]
         */
        sendSmsCode() {
            getSignVerifyCode({
                loanId: this.loanId,
                bankCardId: this.bankCardId,
                productType: 'qdh',
                changeFlag: this.changeFlag,
                showLoading: true
            }).then(res => {
                if (res.success) {
                    this.serialNo = res.result.serialNo
                    this.getSmsCode = true
                    this.countOn = true
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        setSmsCode(code) {
            this.smscode = code
            if (this.getSmsCode && this.smscode && this.smscode.length === 6) {
                this.btnflag = false
            } else {
                this.btnflag = true
            }
        },
        /**
         * 修改手机号
         * @return {[type]} [description]
         */
        modifyPhone() {
            this.$router.push({
                path: '/pages/bankCard/changePhone',
                query: {
                    bankCardId: this.bankCardId
                }
            })
            // this.$router.replace({
            //     name: 'rrhModifyPhone',
            //     params: {
            //         bankCard: this.userBankCardId,
            //         name: this.userName,
            //         personCard: this.userId,
            //         telphone: this.userPhoneNum,
            //         loanId: this.loanId,
            //         oidBiz: this.oidBiz
            //     }
            // })
        },
        /**
         * 查看支持银行卡列表
         * @return {[type]} [description]
         */
        goBankListPage() {
            this.$router.push({
                name: 'rrhSupportBankList'
            })
        },
        /**
         * 显示合同
         */
        showConstract() {
            window.location.href = this.contract.viewUrl
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/aui-vars.scss';
@import 'src/style.scss';
$gray: #777;
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
    color: var(--auiTipsColor);
}

.aui-btn_disabled {
    background-color: var(--auiColorDisabled);
}

.aui-btn_primary {
    background-color: var(--auiColorPrimary);
    color:var(--auiButtonTextColor);
}
.protocol-box {
    padding: 0 px2rem(32);
    font-size: px2rem(28);
    line-height: px2rem(38);
    height: px2rem(110);
    margin: px2rem(20) 0 px2rem(50);
    &>div:nth-child(1) {
        float: left;
        color: $gray;
        line-height: inherit;
        a {
            display: inline;
        }
    }
    .color-tips{
        color:#4ca9ff;
    }
}
.icon-agree {
    display: inline-block;
    width: px2rem(24);
    height: px2rem(24);
    @include img2x('../styles/imgs/checked');
    background-size: 100%;
}

.icon-disagree {
    display: inline-block;
    width: px2rem(24);
    height: px2rem(24);
    @include img2x('../styles/imgs/dischecked');
    background-size: 100%;
}
body.aym {
    .icon-agree {
        @include img2x('../styles/imgs_old/checked');
    }
}
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
.aui-cell {
    height: px2rem(128);
    line-height: px2rem(128);
}
.aui-cell__bd {
    color: #ccc;
}
::v-deep .aui-vcode-btn {
    color: #4286FF;
}
.aui-cells {
    font-size: px2rem(32);
}
.mt100 {
    margin-top: px2rem(100);
}
</style>
