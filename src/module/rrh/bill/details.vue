<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="detail">
            <div class="detail_hd" :class="statusStyle">
                <div class="title">本期应还金额(元)</div>
                <div class="money">{{billInfo.money | formatMoneyK}}</div>
                <div class="assist">还款日: {{payDate}}</div>
            </div>
            <div class="detail_bd">
                <div class="title">本期应还明细</div>
                <div class="detail_item">
                    <div class="label">放款时间</div>
                    <div class="value">{{billInfo.orderTime}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">借款期限</div>
                    <div class="value">{{billInfo.itemTitle || '--'}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">本金</div>
                    <div class="value">{{billInfo.amtCapital | formatMoneyK}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">综合费用<m-icon class="fee-tip" type="attetion" @click.stop="showFeeInfo"></m-icon></div>
                    <div class="value">{{(parseFloat(billInfo.amtFactorage) + parseFloat(billInfo.amtService) + parseFloat(billInfo.amtManager)) | formatMoneyK}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">优惠</div>
                    <div class="value">{{billInfo.amtCoupon | formatMoneyK}}</div>
                </div>
                <div v-if="isOverdue" class="detail_item warn" >
                    <div class="label warn">逾期费</div>
                    <div class="value">{{billInfo.amtPostponeFee | formatMoneyK}}</div>
                </div>
            </div>
        </div>
        <div class="detail" v-if="billInfo.billStatus === 'DELAYSETTLE' || billInfo.billStatus === 'SETTLE'">
            <div class="detail_bd">
                <div class="title">还款记录</div>
                <div class="detail_item">
                    <div class="label">还款时间</div>
                    <div class="value">{{billInfo.actualPayDate}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">还款金额</div>
                    <div class="value">{{billInfo.money | formatMoneyK}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">还款方式</div>
                    <div class="value">{{billInfo.repayType | formatRepayTypeDesc}}</div>
                </div>
            </div>
        </div>
    </div>
    <repayment-op v-if="billInfo.canPay" :data="payInfo" @submit="submit"></repayment-op>
</div>
</template>
<script>
import {
    formatMoney,
    formatMoneyK
} from 'src/libs/util'
import {
    billPayment,
    checkMaintainTime
} from 'store/modules/rrh'
import { resetHeader } from 'components/header/resetHeader'
import repaymentOp from 'src/module/common/bill/repayment-op.vue'
import repay from '../common/repay'
import { getStatusStyle, formatRepayTypeDesc } from '../common/utils'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('rrh')
export default {
    name: 'repaymenDetails',
    mixins: [repay],
    data() {
        return {
            barConfig: {
                leftAction: 'goBack',
                app: {
                    leftbuttonAction: 'goBack'
                }
            },
            billInfo: {},
            payInfo: {
                money: 0
            },
            rrhzx: {}
        }
    },
    components: {
        repaymentOp
    },
    computed: {
        payDate() {
            let year = ''
            let month = ''
            let day = ''
            if (this.billInfo.date) {
                [year, month, day] = this.billInfo.date.split('-')
                month = parseInt(month)
                day = parseInt(day)
            }
            return `${month}月${day}日`
        },
        statusStyle() {
            return getStatusStyle(this.billInfo.billStatus)
        },
        isOverdue() {
            return this.billInfo.billStatus === 'DELAY' || (parseInt(this.billInfo.amtPostponeFee) >= 0 && this.billInfo.postponeDays > 0)
        }
    },
    filters: {
        formatMoney,
        formatMoneyK,
        formatRepayTypeDesc
    },
    created() {
        this.init()
    },
    mounted() {
        window.goBack = () => {
            resetHeader()
            window.localStorage.removeItem('bmhBillInfo')
            window.history.back()
        }
    },
    methods: {
        ...mapActions(['getZjlApplyData']),
        init() {
            this.billInfo = JSON.parse(window.localStorage.getItem('bmhBillInfo')) || {}
            this.payInfo.money = this.billInfo.money
            this.getZjlApplyData().then(data => {
                if (data.success && data.result && data.result.blocks) {
                    this.rrhzx = JSON.parse(data.result.blocks.find(e => e.title === 'rrhzx').objList || '{}')
                }
            })
        },
        showFeeInfo() {
            this.$createDialog({
                type: 'alert',
                content: this.rrhzx.summaryFeeTip,
                confirmBtn: {
                    text: '我知道了'
                }
            }).show()
        },
        async submit() {
            let checkFlag  = await this.checkMaintainTime(this.billInfo)
            if(checkFlag){
                return
            }
            this.payment({
                repayPlanIdStr: this.billInfo.id,
                canThrow: 'y'
            }, billPayment)
        },
        async checkMaintainTime(args = {}){
            const {maintainStartTimeStr = '',maintainEndTimeStr = '',loanProvider = '',isMaintain = false} = args
            if(!isMaintain){
                return false
            }
            let checkFlag= false
            try{
                const data = {
                    loanProvider,
                    businessType:'repay'
                }
                const res = await checkMaintainTime(data)
                if(res.success && res.result){
                    checkFlag = true
                }
            }catch{}
           if(checkFlag){
               this.$createDialog({
                   title: '系统维护公告',
                   content: `<p style="text-align:left;">系统维护期间，暂停还款以及换绑卡业务，请合理安排还款时间，给您带来不便敬请谅解。<br/>维护时间：${maintainStartTimeStr} ~<br/>${maintainEndTimeStr}</p>`,
                   confirmBtn: {
                       text: '我知道了'
                   },
                   onConfirm: ()=>{}
               }).show()
           }
           return checkFlag
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
@mixin icon {
    content: '';
    position: absolute;
    width: px2rem(186);
    height: px2rem(186);
    background-size: 100%;
    right: px2rem(32);
    top: px2rem(32);
}
.auditing::after{
    @include icon;
    @include img2x('../styles/imgs/auditing')
}
.closed::after{
    @include icon;
    @include img2x('../styles/imgs/closed')
}
.dealing::after{
    @include icon;
    @include img2x('../styles/imgs/deal')
}
.overdue::after{
    @include icon;
    @include img2x('../styles/imgs/overdued')
}
.paid::after{
    @include icon;
    @include img2x('../styles/imgs/paid')
}
.block_a {
    display: block;
}
.bank {
    position: relative;
    padding-left: px2rem(40);
}
.bank::before{
    content: "";
    position: absolute;
    width: px2rem(32);
    height: px2rem(32);
    @include img2x('../styles/imgs/bankY');
    left: 0;
    top: px2rem(1);
    background-size: 100%;
}
.fee-tip{
    font-size: 18px;
    color: #999;
    display: inline-block;
    transform: translate(5px, 2px);
}
body.aym {
    .bank::before{
         @include img2x('../styles/imgs_old/bankY');
    }
}
</style>
