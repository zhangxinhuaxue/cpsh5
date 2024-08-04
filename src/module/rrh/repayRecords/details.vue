<template>
<div class="aui-page">
    <hybrid-header :config="barConfig"></hybrid-header>
    <div class="aui-content">
        <div class="detail">
            <div class="detail_hd normal">
                <div class="title">还款金额(元)</div>
                <div class="money">{{repayMoney | formatMoneyK}}</div>
                <div class="assist">已还<span class="count">{{num}}笔</span>借款</div>
            </div>
            <div class="detail_bd">
                <div class="title">还款记录</div>
                <div class="detail_item">
                    <div class="label">还款时间</div>
                    <div class="value">{{repayTime | timeYMD2}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">付款方式</div>
                    <div class="value">{{repayBankInfo}}</div>
                </div>
                <div class="detail_item">
                    <div class="label">还款方式</div>
                    <div class="value">{{repayType | formatRepayTypeDesc}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import { getRepayRecordDetail } from 'store/modules/rrh'
import { AXD, formatMoneyK, timeYMD2 } from 'src/libs/util'
import { formatRepayTypeDesc } from '../common/utils'
export default {
    name: 'repaymenDetails',
    data() {
        return {
            barConfig: {
                app: {
                    rightBtnShow: false
                }
            },
            id: this.$route.query.id,
            num: 0,
            repayMoney: 0,
            repayType: '',
            repayTime: '',
            repayBankInfo: ''
        }
    },
    filters: {
        formatMoneyK,
        formatRepayTypeDesc,
        timeYMD2
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            getRepayRecordDetail({
                recordId: this.id
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    this.repayMoney = result.amtPay || 0
                    this.repayTime = result.repayTime || '--'
                    this.repayType = result.repayType || ''
                    this.repayBankInfo = `${result.bankName || ''}${result.cardNo ? ('(' + result.cardNo + ')') : ''}`
                    this.num = result.num || 0
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
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.count{
    color: #F99E00;
}
</style>
