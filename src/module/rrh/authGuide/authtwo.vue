<template>
    <div class="auth_bg">
        <div class="auth_cont">
            <div class="auth_cont_group"><span>借款本金</span><span>￥{{info.amtLoan | formatMoneyK}}</span></div>
            <div class="auth_cont_group"><span>借款期限</span><span>{{info.period}}期</span></div>
            <div class="auth_cont_group"><span>预计月供</span><span>￥{{info.monthPay | formatMoneyK}}</span></div>
            <div class="auth_cont_group"><span>咨询服务费</span><span>{{info.securityDesc}}</span></div>
            <div class="auth_cont_group"><span>优惠券信息</span><span>{{info.couponDesc}}</span></div>
            <div class="auth_cont_group"><span>收款账户</span><span>{{info.custAccountDesc}}</span></div>
        </div>
        <m-button @click="toSubmit" >确定提交</m-button>
        <constract :oidBiz="oidBiz" :loanProvider="loanProvider" :ischeck="ischeck" type="two" @checkClick="checkClick"></constract>
        <modalvfcode :show="showYzm" @close="showYzm = false" :phone= "info.telphone" :param="param" @complate="complate" @dealWrong="dealWrong"></modalvfcode>
    </div>
</template>
<script>
// 合同
import constract from './components/constract'
import modalvfcode from './components/modalvfcode'
import { authTrial, authUserAuth } from 'src/store/modules/rrh'
import { formatMoneyK } from 'src/libs/util'
export default {
    name: 'authtwo',
    data() {
        return {
            ischeck: true,
            info: {},
            showYzm: false,
            param: {
                cycleId: this.$route.query.cycleId,
                signType: 'AFTER'
            },
            loanProvider: '', // 获取合同协议传参
            oidBiz: '' // 获取合同协议传参
        }
    },
    components: {
        constract,
        modalvfcode
    },
    filters: {
        formatMoneyK
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            authTrial(this.param).then(res => {
                if (res.success) {
                    this.info = res.result
                    this.loanProvider = res.result.loanProvider
                    this.oidBiz = res.result.oidBiz
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        complate(loanId) {
            this.showYzm = false
            this.$router.replace('/pages/rrh/result?type=default&loanId=' + loanId)
        },
        toSubmit() {
            this.log({type: 'button', name: 'acknowledgement-button-submission', desc: '确定提交'})
            if (this.ischeck === false) {
                this.$_toast('请勾选同意协议!')
                return
            }
            if (this.info.isNeedSign) {
                this.showYzm = true
            } else {
                authUserAuth(this.param).then(res => {
                    if (res.success) {
                        this.complate(res.result.secondLoanId)
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
            }
        },
        checkClick() {
            this.ischeck = !this.ischeck
        },
        // 中断授信获取验证码错误特殊处理
        dealWrong(wrongTip) {
            this.showYzm = false
            this.$_alert(wrongTip).then(res => {
                this.$router.replace('/pages/rrh/index')
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.auth_bg {
    height: 100%;
    padding: px2rem(40) px2rem(32);
    background-color: #fff;
}
.auth_cont {
    padding: px2rem(32);
    margin-bottom: px2rem(40);
    background-color: #F8F8F8;
    border-radius: px2rem(12);
    .auth_cont_group {
        display: flex;
        justify-content: space-between;
        font-size: px2rem(28);
        padding: px2rem(16) 0;
        color: #717172;
    }
}
</style>
