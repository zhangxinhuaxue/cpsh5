<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content" v-if="visible">
        <div class="detail">
            <div class="detail_hd" :class="statusClass">
                <div class="title">借款金额(元)</div>
                <div class="money">{{amtLoan | formatMoneyK}}</div>
                <div class="assist" v-if="repayDay">还款日：{{'每月' + repayDay + '日'}}</div>
                <div class="assist-1" v-if="repayDay">具体还款日，以短信通知/账单的还款计划为准</div>
            </div>
            <div class="detail_bd">
                <div class="title">
                    <div class="label">借款明细</div>
                </div>
                <div class="detail_item">
                    <div class="label">产品名称</div>
                    <div class="value">
                        <img v-if="logo" class="icon" :src="logo" alt=""/>
                        <span style="vertical-align:top;">{{productName}}</span>
                    </div>
                </div>
                <div class="detail_item">
                    <div class="label">借款申请时间</div>
                    <div class="value">{{createTime | timeYMD2}}</div>
                </div>
                <div class="detail_item" v-if="withdrawTime">
                    <div class="label">放款时间</div>
                    <div class="value">{{withdrawTime | timeYMD2}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">借款期限</div>
                    <div class="value">{{periods}}期</div>
                </div>
                <div class="detail_item" v-if="(handlerMoney && handlerMoney !== '0') && notSecurity">
                    <div class="label">{{oidBiz | getFeeName}}</div>
                    <div class="value">{{handlerMoney | formatMoneyK}}</div>
                </div>
                <div class="detail_item" v-if="notSecurity">
                    <div class="label">平均月供</div>
                    <div class="value">{{monthPay | formatMoneyK}}</div>
                </div>
                <div class="detail_item" v-if="notSecurity">
                    <div class="label">借款用途</div>
                    <div class="value">{{loanReason}}</div>
                </div>
                <div class="detail_item" v-if="couponFlag">
                    <div class="label">优惠券</div>
                    <div class="value">{{couponName}}（{{toCouponUse(status)}}）</div>
                </div>
                <div v-if="amtDepositStatus && amtDepositStatus !== '0'" class="detail_item" >
                    <div class="label">还款金（{{ amtStatusText }}）</div>
                    <div class="value">{{(parseFloat(amtDeposit) / 1000).toFixed(2)}}</div>
                </div>
                <div v-if="shwoContractLink" class="detail_item">
                    <div class="label">借款合同</div>
                    <div class="value view" @click="viewContract">查看</div>
                </div>
                <div v-if="amtDepositStatus && amtDepositStatus !== '0' && amtDepositStatus !== '3'" class="tips">还款金预计在偿还完第3期取现账单后 T+5个工作内日返回，请保持按时还款哦</div>
            </div>
            <div class="detail_bd sub" v-if="hasRepayRecord">
                <div class="title">
                    <div class="label">还款记录</div>
<!--                     <div class="value view" @click="viewRepayRecords">查看</div> -->
                </div>
                <div class="detail_item">
                    <div class="label">已还期数</div>
                    <div class="value">{{period}}/{{periods}}期</div>
                </div>
                <div class="detail_item">
                    <div class="label">已还本金</div>
                    <div class="value">{{amtPay | formatMoneyK}}</div>
                </div>
            </div>
        </div>
    </div>
    <action-sheets :isPop="listShow" :list="contractList" @complete="listShow = false">
        <div slot="menu">
            <template v-for="(item, index) in contractList">
                <a @click="showContractDetail(item)" class="aui-actionsheet__cell block_a" :key="index">{{item.tempName}}</a>
            </template>
        </div>
        <div slot="btn">
            <a href="javascript:;" class="aui-actionsheet_default" @click="listShow = false">取消</a>
        </div>
    </action-sheets>
</div>
</template>
<script>
import {
    getOrderDetail,
    getMiniLoanContract,
    getRepayDetail
} from 'store/modules/rrh'
import {
    AXD,
    formatMoney,
    formatMoneyK,
    timeYMD2
} from 'src/libs/util'
import actionSheets from 'components/actionsheets/index.vue'
import { getFeeName } from '../common/utils'
export default {
    name: 'loanDetails',
    data() {
        return {
            statusClass: '',
            couponFlag: false,
            // 是否是增信费订单
            notSecurity: true,
            // 借款金额
            amtLoan: 0,
            // 借款用途
            loanReason: '--',
            couponName: '',
            // 借款分期数
            periods: '',
            // 借款ID
            loanId: this.$route.query.loanId,
            // 借款订单状态
            status: '',
            // 借款订单创建时间
            createTime: '--',
            // 手续费
            handlerMoney: 0,
            // 月供
            monthPay: 0,
            // 放款时间
            withdrawTime: '',
            // 合同列表
            contractList: [],
            listShow: false,
            // 产品名称
            productName: '',
            // 产品图标地址
            logo: '',
            // 产品编码
            oidBiz: '',
            repayDay: '以实际放款时间为准',
            barConfig: {
                action: '', // 右侧按钮点击事件， 必须是window变量
                leftAction: '',
                h5: {
                    rightBtnShow: false,
                    enforce: true
                },
                app: {
                    visible: false,
                    rightbuttonVisible: false,
                    rightBtnShow: false,
                    leftbuttonAction: ''
                }
            },
            // 已还本金
            amtPay: 0,
            // 已还期数
            period: 0,
            visible: false,
            amtDepositStatus: '0',
            amtDeposit: ''
        }
    },
    components: {
        actionSheets
    },
    computed: {
        shwoContractLink() {
            return this.contractList.length && (this.status == 5 || this.status == 7) && this.oidBiz
        },
        hasRepayRecord() {
            return this.amtPay && this.periods && this.period
        },
        amtStatusText() {
            switch (this.amtDepositStatus) {
                case '1':
                    return '成功代扣'
                case '2':
                    return '代扣中'
                case '3':
                    return '代扣失败'
                case '4':
                    return '返还中'
                case '5':
                    return '已返还'
                case '6':
                    return '返还失败'
                default:
                    return ''
            }
        }
    },
    created() {
        this.init()
    },
    filters: {
        formatMoney,
        formatMoneyK,
        timeYMD2,
        getFeeName
    },
    methods: {
        getStatusClass(statusText) {
            let status = ''
            switch (statusText) {
                case '审核中':
                    status = 'auditing'
                    break
                case '已关闭':
                    status = 'closed'
                    break
                case '放款中':
                    status = 'putting'
                    break
                case '处理中':
                    status = 'deal'
                    break
                case '待还款':
                    status = 'torepay'
                    break
                case '放款成功':
                    status = 'loansuccess'
                    break
                case '已结清':
                    status = 'settlement'
                    break
                case '待确认':
                    status = 'toconfirm'
                    break
            }
            return status
        },
        init() {
            getOrderDetail({
                loanId: this.loanId
            }).then(res => {
                if (res.result) {
                    this.visible = true
                    let result = res.result
                    this.amtLoan = result.amtLoan || 0
                    this.loanReason = result.loanReason || '--'
                    this.couponName = result.couponName || ''
                    this.periods = result.stags || '--'
                    this.status = result.status || ''
                    this.createTime = result.createTime || '--'
                    this.withdrawTime = result.withdrawTime || ''
                    this.handlerMoney = result.handlerMoney || 0
                    this.monthPay = result.monthPay || 0
                    this.couponFlag = result.couponFlag || false
                    this.productName = result.productName
                    this.oidBiz = result.oidBiz
                    this.logo = result.logo
                    this.amtDepositStatus = result.amtDepositStatus
                    this.amtDeposit = result.amtDeposit
                    // 是否是增信费
                    if (result.loanType && result.loanType === 'security') {
                        this.notSecurity = false
                    }
                    this.repayDay = result.repayDate
                    this.statusClass = this.getStatusClass(result.statusText)
                    if (['loansuccess', 'settlement'].indexOf(this.statusClass) > -1) {
                        this.getContractList()
                        this.getRepayDetail()
                    }
                } else {
                    if (res.code === '-1999') {
                        this.$_toast('登录已失效，请重新登录', () => {
                            AXD.util.login()
                        })
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        },
        /**
         * 获取合同列表
         * @return {[type]} [description]
         */
        getContractList() {
            getMiniLoanContract({
                loanId: this.loanId
            }).then((res) => {
                if (res.success && res.result && res.result.length) {
                    this.contractList = res.result
                }
            })
        },
        getRepayDetail() {
            getRepayDetail({
                loanId: this.loanId
            }).then(res => {
                if (res.success) {
                    this.amtPay = parseInt(res.result && res.result.amtPay) || 0
                    this.period = parseInt(res.result && res.result.period) || 0
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        /**
         * 查看合同列表
         * @return {[type]} [description]
         */
        viewContract() {
            if (this.contractList.length) {
                if (this.contractList.length > 1) {
                    this.listShow = true
                } else if (this.contractList.length === 1) {
                    window.location.href = this.contractList[0].viewUrl
                }
            }
        },
        /**
         * 查看还款记录
         * @return {[type]} [description]
         */
        viewRepayRecords() {
            this.$router.push({
                name: 'rrhRepayRecords'
            })
        },
        /**
         * 查看合同详情
         * @param  {[type]} constract [description]
         * @return {[type]}           [description]
         */
        showContractDetail(constract) {
            this.listShow = false
            window.location.href = constract.viewUrl
        },
        toCouponUse(status) {
            if (~~status === 6) {
                return '已退回'
            }
            if (~~status === 4) {
                return '处理中'
            }
            if (~~status === 5 || ~~status === 7) {
                return '已使用'
            }
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
    top: px2rem(13);
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
.putting::after{
    @include icon;
    background-image: url('../styles/imgs/putting.png');
}
.advance::after{
    @include icon;
    background-image: url('../styles/imgs/advance@2x.png');
}
.overdue::after{
    @include icon;
    @include img2x('../styles/imgs/overdued')
}
.paid::after{
    @include icon;
    @include img2x('../styles/imgs/paid')
}
.torepay::after{
    @include icon;
    @include img2x('../styles/imgs/torepay')
}
.loansuccess::after{
    @include icon;
    @include img2x('../styles/imgs/loansuccess')
}
.settlement::after{
    @include icon;
    @include img2x('../styles/imgs/settlement')
}
.toconfirm::after{
    @include icon;
    @include img2x('../styles/imgs/toconfirm')
}
.block_a {
    display: block;
}
.icon{
    display: inline-block;
    width: px2rem(42);
    height: px2rem(42);
    margin: 0 px2rem(20) 0 0;
}
.tips {
    font-size: px2rem(18);
    color: red;
    padding: px2rem(10) px2rem(30);
}
.assist-1 {
    height: px2rem(28);
    line-height: px2rem(28);
    margin-top: px2rem(12);
    font-size: px2rem(24);
    color: #A1A1A1;
}
</style>
