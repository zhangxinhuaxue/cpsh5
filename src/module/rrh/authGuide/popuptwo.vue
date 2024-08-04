<template>
    <div class="pageOut">
        <div class="tipTitle">您有一笔借款申请待确认</div>
        <div class="tipInfo">
            <p>借款金额：<span>￥{{info.amtLoan | formatMoneyK}}</span></p>
            <p>借款期限：<span>{{info.period}}期</span></p>
            <p>收款账户：<span>{{info.custAccountDesc}}</span></p>
        </div>
        <div class="tipBtns">
            <m-button @click="toSubmit">确定继续</m-button>
            <div class="btn2" @click="toCancel">放弃，重新申请</div>
        </div>
    </div>
</template>
<script>
import { authTrial, authGiveup } from 'store/modules/rrh'
import { formatMoneyK } from 'src/libs/util'
export default {
    props: {
        cycleId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            info: {}
        }
    },
    created() {
        this.init()
    },
    filters: {
        formatMoneyK
    },
    watch: {
        cycleId(n) {
            if (n) {
                this.init()
            }
        }
    },
    methods: {
        init() {
            if (this.cycleId) {
                authTrial({
                    cycleId: this.cycleId,
                    signType: 'AFTER'
                }).then(res => {
                    if (res.success) {
                        this.info = res.result
                    } else {
                        this.$_toast(res.resultDes)
                    }
                })
            }
        },
        // 确定继续
        toSubmit() {
            let url = '/pages/rrh/authtwo?cycleId=' + this.cycleId
            this.log({type: 'button-link', name: 'upwindow-button-surecontinue', desc: '确定继续', extendData: url})
            this.$parent.showAuth = false
            this.$router.push(url)
        },
        // 放弃，重新申请
        toCancel() {
            authGiveup({ cycleId: this.cycleId }).then(res => {
                if (res.success && res.result) {
                    let url = '/pages/rrh/loan?oidBiz=202263&name=贷呗&balance=' + this.info.amtLoan + '&activePeriodVal=' + this.info.period
                    this.log({type: 'button', name: 'upwindow-button-reapply', desc: '放弃，重新申请', extendData: url})
                    this.$parent.showAuth = false
                    this.$router.push(url)
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.pageOut {
    padding-bottom: px2rem(40);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-image: linear-gradient(#E3EDFF 0%, #fff 20%, #fff 60%);
}
.tipTitle {
    padding: px2rem(80) 0 px2rem(50);
    font-size: px2rem(36);
    text-align: center;
    color: #333;
    font-weight: bold;
}
.tipInfo{
    padding: 0 px2rem(50) px2rem(30);
    flex: auto;
    font-size: px2rem(28);
    color: #666;
    p {
        padding-bottom: 0.5em;
        text-indent: -5em;
        padding-left: 5em;
    }
    span {
        color: #4f4f4f;
        font-weight: bold;
    }
}
.tipBtns {
    margin: 0 px2rem(32);
}
.btn2 {
    text-align: center;
    height: px2rem(88);
    line-height: px2rem(88);
    font-size: px2rem(26);
    color: #999;
    border-radius: px2rem(4);
}
</style>
