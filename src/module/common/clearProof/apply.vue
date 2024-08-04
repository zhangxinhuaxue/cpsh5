<template>
    <div class="aui-page">
        <hybrid-header></hybrid-header>
        <div class="aui-content">
            <div class="content">
                <div class="rule">
                    <div class="title">申请结清证明规则</div>
                    <p class="rule-item">1、 需结清在招集令平台全部的账单欠款;</p>
                    <p class="rule-item">2、 每天只能申请一次结清证明;</p>
                    <p class="rule-item">3、 本证明仅作结清证明, 不做他用。</p>
                </div>
                <div class="template">
                    <div class="title">结清证明(模板)</div>
                    <p class="template-item main">
                        用户方<span class="template-write"> 张三 </span>，身份证号<span class="template-write"> 330101198812121424 </span>，接收我方提供的消费/现金服务，并签订了分期服务合同。截止<span class="template-write"> 2020 </span>年<span class="template-write"> 10 </span>月<span class="template-write"> 11 </span>日，用户方已支付本金和平台服务费共计<span class="template-write"> 100.00 </span>元（大写：<span class="template-write"> 壹佰元整 </span>），现所有款项已全部结清。
                    </p>
                    <p class="template-item indent">本证明仅作结清证明，不做他用。</p>
                    <p class="template-item">特此证明</p>
                    <p class="template-item mt-50 right">数钥网络技术(杭州)有限公司</p>
                    <p class="template-item right">(公章)</p>
                    <p class="template-item right">2020 年 10 月 11 日</p>
                    <div class="cachet"></div>
                </div>
            </div>
            <div class="submit" @click="apply">立即申请</div>
        </div>
    </div>
</template>
<script>
import { AXD } from 'src/libs/util'
import { isCanOpenProof, openProof } from 'store/modules/clearProof'
import axdDialog from 'components/dialog/index'
export default {
    name: 'index',
    data() {
        return {}
    },
    methods: {
        apply() {
            isCanOpenProof().then(res => {
                if (res.success) {
                    axdDialog({
                        title: '温馨提示',
                        content: '确定申请，提交后不可撤回',
                        buttons: [{
                            text: '点错了'
                        }, {
                            text: '确认申请',
                            onClick: () => {
                                return openProof().then(res => {
                                    if (res.success) {
                                        this.$router.replace({
                                            name: 'clearProofResult'
                                        })
                                        return
                                    }
                                    this.resultHandle(res)
                                })
                            }
                        }]
                    })
                    return
                }
                if (res.code === '-1999') {
                    AXD.util.clearProofLogin()
                    return
                }
                this.resultHandle(res)
            })
        },
        resultHandle(res){
            const codeHandle = {
                'R0001': [{// msg = '您今日已申请过结清证明，暂不能申请，请耐心等待'
                    text: '查看申请',
                    onClick: () => {
                        this.$router.back()
                    }
                }],
                'R0002': [{// msg = '您无借款记录，暂不能开结清证明'
                    text: '确认',
                    onClick: () => {
                        this.$router.back()
                    }
                }],
                'R0003': [{// msg = '由于您有账单尚未结清，请结清后再申请结清证明'
                    text: '先不申请',
                    onClick: () => {
                        this.$router.back()
                    }
                }, {
                    text: '立即还款',
                    onClick: () => {
                        this.$router.push({
                            name: 'rrhBill'
                        })
                    }
                }],
                'R0004': [{// msg = '您有未完成放款的订单，请稍后再尝试'
                    text: '暂不申请',
                    onClick: () => {
                        this.$router.back()
                    }
                }, {
                    text: '查看订单',
                    onClick: () => {// 跳转招集令取现订单列表
                        this.$router.push({
                            name: 'rrhLoanRecords'
                        })
                    }
                }],
                'R0005': [{// msg = '您申请的结清证明正在努力生成中，请稍候查看'
                    text: '返回'
                }],
                '1000': [{// msg = '系统繁忙，请稍后再试'
                    text: '确认'
                }]
            }
            if (res.code) {
                axdDialog({
                    title: '温馨提示',
                    content: res.resultDes,
                    buttons: codeHandle[res.code]
                })
                return
            }
            this.$_toast(res.resultDes)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.content{
    background-color: #ffffff;
    margin: px2rem(20);
}
.title{
    height: px2rem(42);
    line-height: px2rem(42);
    font-size: px2rem(30);
    text-align: center;
    color: #222222;
    margin-bottom: px2rem(30);
}
.rule{
    padding: px2rem(26) px2rem(36) px2rem(40);
    position: relative;
    &::after{
        position: absolute;
        content: '';
        width: px2rem(686);
        height: 1px;
        bottom: 0;
        left: px2rem(12);
        background-color: #e4e4e4;
    }
    .rule-item{
        font-size: px2rem(26);
        height: px2rem(40);
        line-height: px2rem(40);
        color: #999999;
    }
}
.template{
    position: relative;
    padding: px2rem(60) px2rem(36) px2rem(40);
    &-item{
        font-size: px2rem(26);
        color:#999999;
        line-height: px2rem(40);
    }
    .main{

        margin-bottom: px2rem(20);
    }
    .indent {
        text-indent: px2rem(52);
    }
    .right {
        text-align: right;
    }
    .mt-50{
        margin-top: px2rem(50);
    }
    &-write{
        text-decoration:underline;
        padding: 0 px2rem(5);
    }
}
.cachet{
    width: px2rem(200);
    height: px2rem(200);
    position: absolute;
    right: px2rem(21);
    bottom: px2rem(20);
    @include img2x('./styles/imgs/cachet');
    background-size: 100%;
}
.submit{
    position: fixed;
    bottom: px2rem(60);
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: px2rem(686);
    height: px2rem(90);
    line-height: px2rem(90);
    font-size: px2rem(36);
    background-color: var(--auiColorPrimary);
    border-radius: px2rem(100);
}
</style>
