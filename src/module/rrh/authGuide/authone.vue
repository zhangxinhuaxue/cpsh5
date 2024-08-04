<template>
    <div class="auth_bg">
        <div class="auth_title">
            <p >超80%的用户同意授权申请</p>
            <p class="auth_title--em">成功提升取现成功率90%+</p>
        </div>
      
        <div class="auth_cont">
            <p class="auth_cont_text">若当前申请失败后，系统帮您推荐申请以下产品</p>
            <div class="auth_cont_group"><span>借款本金</span><span>￥{{info.amtLoan | formatMoneyK}}</span></div>
            <div class="auth_cont_group"><span>借款期限</span><span>{{info.period}}期</span></div>
            <div class="auth_cont_group"><span>预计月供</span><span>￥{{info.monthPay | formatMoneyK}}</span></div>
            <div class="auth_cont_group"><span>咨询服务费</span><span>{{info.securityDesc}}</span></div>
            <div class="auth_cont_group"><span>优惠券信息</span><span>{{info.couponDesc}}</span></div>
        </div>
        <m-button @click="toSubmit" :disabled="disabled">{{disabled ? '已同意授权申请' : '同意授权申请'}}</m-button>
        <constract :oidBiz="oidBiz" :loanProvider="loanProvider" :ischeck="ischeck" type="one" @checkClick="checkClick"></constract>
        <modalvfcode :show="showYzm" @close="showYzm = false" :phone= "info.telphone" :param="param" @complate="complate"></modalvfcode>
    </div>
</template>
<script>
import constract from './components/constract'
import modalvfcode from './components/modalvfcode'
import { setHeader } from 'components/header/resetHeader'
import { authTrial, authUserAuth } from 'src/store/modules/rrh'
import { formatMoneyK } from 'src/libs/util'

export default {
    name: 'authone',
    components: {
        constract,
        modalvfcode
    },
    data() {
        return {
            query: this.$route.query,
            ischeck: true,
            type: this.$route.query.type || 'first',
            info: {},
            showYzm: false,
            param: {
                cycleId: this.$route.query.cycleId,
                signType: 'PAY'
            },
            disabled: false, // 控制按钮可否点击
            loanProvider: '', // 获取合同协议传参
            oidBiz: '' // 获取合同协议传参
        }
    },
    filters: {
        formatMoneyK
    },
    created() {
        // 根据type值设置头部
        if (this.type === 'first') {
            setHeader({
                leftbuttonVisible: false,
                rightbuttonVisible: true,
                rightbutton: 'custom',
                rightbuttonInfo: {
                    showType: 'TEXT',
                    textColor: '#333',
                    text: '跳过',
                    action: 'toJump'
                }
            })
            window.toJump = () => {
                this.log({type: 'button-link', name: 'authorizationguide-button-skip', desc: '跳过'})
                this.resetReplace('/pages/rrh/result?type=routeundone&loanId=' + this.info.firstLoanId + '&cycleId=' + this.query.cycleId)
                // window.location.replace('/pages/rrh/result?type=routeundone&loanId=' + this.info.firstLoanId + '&cycleId=' + this.query.cycleId)
            }
        }
        // document.title = ''
        this.init()
    },
    methods: {
        init() {
            authTrial(this.param).then(res => {
                if (res.success) {
                    this.info = res.result
                    if ((this.query.type === 'view') || this.info.isAuth) {
                        this.disabled = true
                    } else {
                        this.disabled = false
                    }
                    this.loanProvider = res.result.loanProvider
                    this.oidBiz = res.result.oidBiz
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        complate() {
            this.showYzm = false
            this.$router.replace('/pages/rrh/result?type=routedone&loanId=' + this.info.firstLoanId + '&cycleId=' + this.query.cycleId)
        },
        toSubmit() {
            this.log({type: 'button', name: 'authorizationguide-button-promote', desc: '同意授权申请'})
            if (this.ischeck === false) {
                this.$_toast('请勾选同意协议!')
                return
            }
            if (this.info.isNeedSign) {
                this.showYzm = true
            } else {
                authUserAuth(this.param).then(res => {
                    if (res.success) {
                        this.complate()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
            }
        },
        checkClick() {
            this.ischeck = !this.ischeck
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.auth_bg {
    height: 100%;
    background-image: linear-gradient(#E3EDFF, #fff, #fff);
}
.aym .auth_bg {
    background-image: linear-gradient(#FFF7CE, #fff, #fff);
}
.auth_title {
    font-size: px2rem(40);
    padding: px2rem(52) px2rem(32);
    text-align: center;
    color: #333;
    &--em{
        font-size: px2rem(48);
        font-weight: bold;
    }
}
.auth_cont {
    margin: 0 px2rem(32);
    padding: px2rem(32);
    background-color: #fff;
    border-radius: px2rem(12);
    .auth_cont_text {
        font-size: px2rem(28);
        color: #333;
        text-align: center;
        padding: px2rem(16) 0;
    }
    .auth_cont_group {
        display: flex;
        justify-content: space-between;
        font-size: px2rem(28);
        padding: px2rem(16) 0;
        color: #717172;
    }
}
</style>
