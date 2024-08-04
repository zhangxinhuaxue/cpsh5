<template>
    <div class="aui-page">
        <hybrid-header></hybrid-header>
        <div class="aui-content">
            <div v-if="needPayBillList.length">
                <bill-item v-for="item in needPayBillList" :data="item" :key="item.id"
                    @showDetail="showBillDetail(item)" @select="selectBill">
                </bill-item>
            </div>
            <empty v-else text="暂时还没有账单哦"></empty>
        </div>
        <repayment-op v-if="needPayBillList.length" show="true" :data="totalBills"
            @select="selectBills" @submit="submit"></repayment-op>
        <popup-detail :show="isShowBillDetail" :data="billDetail" @close="closeBillDetail"></popup-detail>
    </div>
</template>
<script>
import { advancePayment, billAdvancePay } from 'store/modules/rrh'
import billItem from 'src/module/common/bill/bill-item2.vue'
import repaymentOp from 'src/module/common/bill/repayment-op.vue'
import popupDetail from '../common/popup-detail.vue'
import repay from '../common/repay'
import empty from '../common/empty.vue'
import { formatMoneyK, formatDateTime } from 'src/libs/util'
import { getRepayDay } from '../common/utils'
export default {
    name: 'billDetails',
    data() {
        return {
            needPayBillList: [],
            // 选中的需要支付的账单信息
            totalBills: {
                checked: false,
                btnDisabled: false,
                checkedList: [],
                money: 0
            },
            isShowBillDetail: false,
            billDetail: {}
        }
    },
    mixins: [repay],
    components: {
        billItem,
        repaymentOp,
        popupDetail,
        empty
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            advancePayment().then(res => {
                if (res.success) {
                    let result = res.result
                    if (result && result.itemList) {
                        result.itemList.forEach((item, index) => {
                            this.needPayBillList.push({
                                checked: true,
                                title: `${item.itemTitle} · ${(parseInt(item.periodNum) - parseInt(item.period) + 1)}/${item.periodNum}期`,
                                money: parseInt(item.amtTotal),
                                benefit: item.amtCoupon,
                                id: item.instalmentIdStr,
                                date: getRepayDay(formatDateTime(parseInt(item.payDate), 'yyyy-MM-dd', '-')),
                                billStatus: item.billStatus,
                                payStatus: item.payStatus,
                                details: [{label: '本金', value: formatMoneyK(item.amtCapital), show: true},
                                    {label: '平台服务费', value: formatMoneyK(item.amtService), show: true},
                                    {label: '资金管理费', value: formatMoneyK(item.amtManager), show: true},
                                    {label: '手续费', value: formatMoneyK(item.amtFactorage), show: true},
                                    {label: '逾期费', value: formatMoneyK(item.amtPostponeFee), warn: true, show: item.billStatus === 'DELAY'},
                                    {label: '优惠', value: formatMoneyK(item.amtCoupon), show: true},
                                    {label: '剩余期数', value: `${(parseInt(item.periodNum) - parseInt(item.period) + 1)}/${item.periodNum}期`, show: true}]
                            })
                        })
                        this.calTotal()
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        showBillDetail(item) {
            this.isShowBillDetail = true
            this.billDetail = {
                money: item.money,
                details: item.details
            }
        },
        closeBillDetail() {
            this.isShowBillDetail = false
        },
        submit() {
            if (!this.totalBills.checkedList.length) {
                this.$_toast('请至少选择一笔账单进行还款')
                return false
            }
            this.payment({
                instalmentIdStr: this.totalBills.checkedList.join(','),
                canThrow: 'y'
            }, billAdvancePay)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.aui-page .aui-content{
    margin-bottom: px2rem(100);
}
.popup-select__hd {
    display: flex;
    height: px2rem(96);
    line-height: px2rem(96);
    padding: 0 px2rem(32);
    position: relative;
    text-align: center;
    background-color: #fff;
    .close {
        display: inline-block;
        width: px2rem(96);
        line-height: px2rem(96);
        position: absolute;
        left: 0;
        top: 0;
        span {
            font-size: px2rem(32);
        }
    }
    & h3 {
        width: 100%;
        line-height: px2rem(96);
        text-align: center;
        font-weight: normal;
        font-size: px2rem(32);
        color: #666;
    }
    &:after {
        @include hairline(bottom);
    }
}
</style>
