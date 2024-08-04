<template>
<div class="bill">
    <div class="bill_body"  @click="showDetail">
        <div class="title" >
            <img   v-if="data.productImg" class="icon" :src="data.productImg" alt=""/>
        </div>

        <div class="bill_body__100">
            <div class="bill_body__main">
                <div class="left">
                    <div>
                        <span>{{data.title}}</span><span v-if="data.isMaintain" class="maintain-tip" @click.stop="openMaintain"></span>
                    </div>
                    <div class="assist">
                        还款日：{{data.date}}
                        <span v-if="data.billStatus && data.billStatus=='DELAY'" class="aui-tag_bgcolor warn ml5">已逾期</span>
                    </div>
                    <div class="assist" v-if="!data.isCashier && data.mobile">
                        银行卡手机号：({{data.mobile}})
                    </div>
                    <div v-if="!data.isCashier && data.card && data.bankName" class="assist">
                        还款卡：{{data.bankName | bankName}}({{data.card || '已解绑'}}) <span class="edit" @click.stop="changeCard">更换</span>
                    </div>

                </div>
                <div class="right"><span>{{data.money | formatMoneyK}}</span></div>
            </div>
            <div v-if="data.creditor === 'zklz' && ['SETTLE','DELAYSETTLE'].indexOf(data.billStatus) === -1" class="bill__tips">
                <m-icon type="attetion" class="bill__tips__icon"></m-icon>此借款扣款成功后次日15点销账！
            </div>
            <!-- <div v-if="data.creditor === 'puanqishang'" class="bill__tips" >
                <m-icon type="attetion" class="bill__tips__icon"></m-icon>此借款还款成功后第三日9点销账。
            </div> -->
            <div v-if="data.creditor === 'jinshanglh'" class="bill__tips" >
                <m-icon type="attetion" class="bill__tips__icon"></m-icon>此借款还款成功后次日14点销账。
            </div>
        </div>
    </div>

    <div class="bill_op">
        <div v-if="data.canPayAll" class="bill_opBtn" @click.stop="goAdvancePayAll">提前结清</div>
        <div v-if="data.canAdvPay || data.canPay || data.canPayDelay" class="bill_opBtn" @click.stop="payment">还款</div>
    </div>
</div>
</template>
<script>
import {
    formatMoney,
    formatMoneyK
} from 'src/libs/util'
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        },
        type: {
            type: Number,
            default: 0
        }
    },
    filters: {
        formatMoney,
        formatMoneyK,
        bankName(name) {
            if (name && name.length > 6) {
                return name.replace(/银行/, '')
            } else {
                return name
            }
        }
    },
    methods: {
        showDetail() {
            this.$emit('showDetail')
        },

        // 选择账单
        selectBill() {
            if (this.data.billStatus && this.data.billStatus === 'DELAY') {
                this.$_toast('您需先还逾期账单')
                return false
            }
            this.$emit('select', this.data)
        },

        // 提前结清
        goAdvancePayAll() {
            this.log({type: 'button', name: 'bill-button-prepayment', desc: '提前结清'})
            this.$emit('goAdvancePayAll', this.data, this.type)
        },

        // 还款/提前还款/逾期还款
        payment() {
            this.log({type: 'button', name: 'bill-button-reimbursement', desc: '还款'})
            if (this.data.canAdvPay) { // 提前还款
                this.$emit('advancePay', this.data)
            } else if (this.data.canPay) { // 还款
                this.$emit('payment', this.data, this.type)
            } else if (this.data.canPayDelay) { // 逾期还款
                this.$emit('goDelayPay', this.data)
            }
        },
        // 换绑卡
        changeCard() {
            this.log({type: 'button', name: 'bill-button-bank', desc: '更换'})
            this.$emit('goChangeCard', this.data)
        },
        // 打开维护期弹框
        openMaintain(){
            this.log({type: 'button', name: 'bill-button-maintain', desc: '维护提醒'})
            this.$emit('openMaintain', this.data)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';

.bill{
    background-color: #ffffff;
    font-size: px2rem(30);
    position: relative;
    color: $auiTextColorImportant;
    padding-left: px2rem(33);
    padding: px2rem(28) px2rem(32);

    &::before{
            content: " ";
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height: 1px;
            border-top: 1px solid #e6e6e6;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            -webkit-transform: scaleY(.5);
            transform: scaleY(.5);
            left: px2rem(32);
            right: 0;
    }

    .bill__tips{
        background: linear-gradient(270deg,#fffcee, #fff9db);
        border-radius: px2rem(4);
        color:#FF3E00;
        margin-top:px2rem(12);
        // margin-right:px2rem(32) ;
        padding:0 px2rem(28);
        line-height: px2rem(56);
        font-size: px2rem(24);
        .bill__tips__icon{
            // color: #FF3E00;
            font-size: px2rem(24);
            margin-right: px2rem(8);
        }
    }
    .bill_body{
        display: flex;
        align-items: flex-start;
        height: 100%;
        // padding: px2rem(26) px2rem(32) 0 px2rem(0);

        position: relative;


        .bill_body__100{
            flex:1;
        }
        .bill_body__main{
            display: flex;
            align-items: flex-start;
            &:after{
                content: " ";
                display: inline-block;
                height: .62222rem;
                width: .62222rem;
                background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0IDQ0Ij48c3R5bGU+LnN0MHtmaWxsOiNjY2N9PC9zdHlsZT48cGF0aCBpZD0iWE1MSURfNF8iIGNsYXNzPSJzdDAiIGQ9Ik0zMyAyMUwxNS4xIDMuMWMtLjYtLjYtMS41LS42LTIuMSAwcy0uNiAxLjUgMCAyLjFsMTYuOSAxNi45TDEzIDM5Yy0uNi42LS42IDEuNSAwIDIuMS4zLjMuNy40IDEuMS40cy44LS4xIDEuMS0uNEwzMyAyMy4yYy4zLS4zLjQtLjcuNC0xLjEuMS0uNC0uMS0uOC0uNC0xLjF6Ii8+PC9zdmc+");
                background-size: cover;
                margin-top: px2rem(4);
                margin-left:px2rem(20) ;
            }
        }
        .left{
            flex: 1;
            line-height: px2rem(50);
            &>div:first-child {
                display: flex;
                align-items: center;
            }
        }
        .right{
            // flex: 1;
            text-align: right;
            font-size: px2rem(28);
            position: relative;
        }
        .title{
            // height: px2rem(42);
            // line-height: px2rem(42);
            .icon{
                width: px2rem(40);
                height: px2rem(40);
                margin-right: px2rem(20);
                margin-top: px2rem(4);
            }
            .name{
                overflow:hidden;
            }

        }
        .assist{
            margin-top: px2rem(12);
            height: px2rem(32);
            line-height: px2rem(32);
            font-size: px2rem(26);
            color: $auiTextColorAssistant;
            .edit {
                color: #61c9ff;
                margin-left: px2rem(20);
            }
        }
        .maintain-tip{
           display: inline-block;
           height: px2rem(32);
           width: px2rem(132);
           background: #FFF9DC url(../styles/imgs/maintain@2x.png) no-repeat;
           background-size:contain;
           margin-left: px2rem(16);
        }
    }
    &_op{
        text-align: right;
        margin-top: px2rem(20);
        .bill_opBtn{
            display: inline-block;
            width: px2rem(200);
            height: px2rem(60);
            line-height: px2rem(60);
            text-align: center;
            border: 1px solid #e4e4e4;
            border-radius: px2rem(100);
            margin-right: px2rem(40);
            // margin-bottom: px2rem(20);
            &:last-child{
                margin-right: 0;
            }
        }

    }
}
.bill:first-child .bill_body{
    border-top: none;
}
.warn{
    background-color: #FF3E00;
}
</style>
