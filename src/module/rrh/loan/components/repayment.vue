<template>
    <m-cell-group class='repayment-block'>
        <m-cell title="借多久" is-select is-link class="view fee" :class="{'view-expand': isShowPeriod}" :value="currentPeriod+'个月'" @click="toggleShowPeriod"></m-cell>
        <div v-show="isShowPeriod" class="period">
            <span
                v-for="(item, index) in periods"
                :key="index"
                :class="{on: index == activePeriod}" @click="selectPerild(index)">
                {{item}}期
            </span>
        </div>
        <m-cell title="还款计划" class="right-align fee" is-link is-select :value="'平均月供'+value" @click="showRepaymentDetail">
            <span slot="icon" class="fee-tip tip-spec1" @click.stop="showRepayInfo"></span>
        </m-cell>
        <!-- 月供详情 -->
        <popup :isPop="isShowRepaymentDetail" @cancel="closeRepaymentDetail">
            <template slot="content">
                <repayment-list :config="repayDetail" @repaymentClose="closeRepaymentDetail" :rrhzx="rrhzx" show-fee>
                    <!-- <div class="tip" slot="tip">{{tipInfo}}</div> -->
                    <div class="tipInfoBox" slot="tip">
                        <p class="p1" v-if="yealServiceRate">预计综合年化利率{{yealServiceRate}}</p>
                        <p class="p2">具体以放款后实际还款计划为准</p>
                    </div>
                </repayment-list>
            </template>
        </popup>
    </m-cell-group>
</template>

<script>
import repaymentList from './repayment-list.vue'
import popup from 'components/popup/index.vue'
import { formatMoneyK, formatDateTime } from 'src/libs/util'
import { getRepayDate } from '../../common/utils'

export default {
    name: 'repayment-block',
    props: ['value', 'oidBiz', 'details', 'rrhzx', 'periods', 'currentPeriod', 'activePeriod', 'yealServiceRate' ],
    components: {
        repaymentList,
        popup
    },
    data() {
        return {
            // 还款日
            firstRepayDate: '',
            // 是否显示分期数
            isShowPeriod: false,
            // 是否显示月供详情
            isShowRepaymentDetail: false,
            // 不同的借款金额、分期对应的还款计划
            repayDetail: {
                title: '还款计划',
                dataList: []
            }
        }
    },
    methods: {
        // 切换显示分期数
        toggleShowPeriod() {
            this.isShowPeriod = !this.isShowPeriod
        },
        // 还款计划说明
        showRepayInfo() {
            this.$createDialog({
                type: 'alert',
                content: this.rrhzx.repaymentTip,
                confirmBtn: {
                    text: '知道了'
                }
            }).show()
        },
        selectPerild(index) {
            this.$emit('selectPerild', index)
        },
        /**
         * 关闭月供详情
         * @return {[type]} [description]
         */
        closeRepaymentDetail() {
            this.isShowRepaymentDetail = false
        },
        /**
         * 显示月供详情
         * @return {[type]} [description]
         */
        showRepaymentDetail() {
            this.isShowRepaymentDetail = true
            this.repayDetail.dataList = []
            let feeName = '手续费'
            this.details.forEach((item, index) => {
                this.repayDetail.dataList.push({
                    repayDate: item.repayDate,
                    actualPay: formatMoneyK(parseFloat(item.monthPay) + (index===0 ? parseFloat(item.handlerService) : 0)),
                    // detail: `含本金和综合费用：${formatMoneyK(item.monthPay)}` + (index===0 && item.handlerService!=='0' ? `+${feeName}：${formatMoneyK(item.handlerService)}` : ''),
                    detail: `含本金和综合费用：${formatMoneyK(parseFloat(item.monthPay) + (index===0 ? parseFloat(item.handlerService) : 0))}`
                })
            })
        }
    }
}
</script>
<style lang='scss' scoped>
@import 'src/style.scss';
.repayment-block ::v-deep {
    // padding-top: px2rem(20);
    // background: #fff;
    .period {
        display: flex;
        flex-flow: wrap;
        width: 100%;
        height: auto;
        padding: 0 px2rem(30) px2rem(20);
        background: #fff;
        span {
            background-color: #ffffff;
            width: px2rem(146);
            height: px2rem(64);
            line-height: px2rem(64);
            border-radius: var(--auiButtonRadiusLarge);
            text-align: center;
            color: #424243;
            font-size: px2rem(28);
            margin-bottom: px2rem(20);
            margin-left: 0;
            margin-right: px2rem(20);
            border: 1px solid #d0d0d0;

            &:last-child,
            &:nth-child(4n+0) {
                margin-right: 0;
            }

            &.on {
                background-color: var(--auiColorSubmit);
                border: none;
                color: #ffffff;
            }
        }
    }
}
.fee-tip{
    position: absolute;
    width: px2rem(30);
    height: px2rem(30);
    top: 50%;
    transform: translateY(-50%);
    left: px2rem(130);
    @include img2x('../../styles/imgs/explain');
    background-size: 100%;
}
.tip-spec1 {
    left: px2rem(170);
}
.tip {
    line-height: px2rem(24);
    font-size: px2rem(24);
    color: #A1A1A1;
    padding: px2rem(5) 0 px2rem(20) px2rem(32);
}
.tipInfoBox {
    padding: px2rem(24) px2rem(40);
    opacity: 1;
    background: #dbe8ff;
    .p1 {
        color: #333;
        font-size: px2rem(32);
        height: px2rem(45);
        line-height: px2rem(45);
    }
    .p2 {
        margin-top: px2rem(8);
        color: #999;
        font-size: px2rem(24);
        height: px2rem(33);
        line-height: px2rem(33);
    }
}
::v-deep .aui-popup__bd {
    padding-top: 0 !important;
}
</style>
