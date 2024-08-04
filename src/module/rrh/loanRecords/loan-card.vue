<template>
<div class="card">
    <div class="card_bd" @click="cardClick">
        <div class="main-info">
            <div class="main-info_left">
                <img v-if="content.logo" class="icon" :src="content.logo" alt="" />
                <span style="vertical-align:top;">{{content.productName}}</span>
            </div>
            <div class="main-info_right">{{content.status}}</div>
        </div>
        <div class="assist-info">
            <div class="assist-info_left">金额：￥{{content.amtLoan | formatMoneyK}}</div>
            <div class="assist-info_right">期数：{{content.period}}期</div>
        </div>
    </div>
    <div class="card_ft">
        <div class="card_ft_left">申请时间：{{content.applyDate}}</div>
        <div class="btn" v-if="content.buttonStatus === 'LOAN_AGAIN'" @click="toLoanAgain">再借一笔</div>
        <div class="btn1" v-if="content.buttonStatus === 'WAIT_CHECK'" @click="toWaitCheck">立即确认</div>
    </div>
</div>
</template>
<script>
import { formatMoneyK } from 'src/libs/util'
export default {
    name: 'loancard',
    props: ['content'],
    filters: {
        formatMoneyK
    },
    data() {
        return {}
    },
    methods: {
        // 再借一笔
        toLoanAgain() {
            this.$router.push('/pages/rrh/auto?oidBiz=202263&name=贷呗')
        },
        // 立即确认
        toWaitCheck() {
            this.$router.push('/pages/rrh/authtwo?cycleId=' + this.content.cycleId)
        },
        cardClick() {
            this.$emit('cardClick', this.content)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.card{
    background-color: #ffffff;
    margin: px2rem(24) px2rem(32) 0;
    padding: px2rem(32) px2rem(32) px2rem(20);
    font-size: px2rem(28);
    color: $auiTextColorImportant;
    &:active{
        background-color: #ececec
    }
    .card_bd{
        height: px2rem(125);
        padding-bottom: px2rem(20);
        position: relative;
        &:after{
            content: " ";
            display: inline-block;
            height: .62222rem;
            width: .62222rem;
            background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0IDQ0Ij48c3R5bGU+LnN0MHtmaWxsOiNjY2N9PC9zdHlsZT48cGF0aCBpZD0iWE1MSURfNF8iIGNsYXNzPSJzdDAiIGQ9Ik0zMyAyMUwxNS4xIDMuMWMtLjYtLjYtMS41LS42LTIuMSAwcy0uNiAxLjUgMCAyLjFsMTYuOSAxNi45TDEzIDM5Yy0uNi42LS42IDEuNSAwIDIuMS4zLjMuNy40IDEuMS40cy44LS4xIDEuMS0uNEwzMyAyMy4yYy4zLS4zLjQtLjcuNC0xLjEuMS0uNC0uMS0uOC0uNC0xLjF6Ii8+PC9zdmc+");
            background-size: cover;
            right: 0;
            position: absolute;
            bottom: px2rem(20);
        }
        .main-info{
            height: px2rem(42);
            line-height: px2rem(42);
            margin-bottom: px2rem(32);
            @include flex;
            .main-info_left{
                @include flex-item;
                font-size: px2rem(32);
            }
            .main-info_right{
                @include flex-item;
                text-align: right;
                color: #999;
            }
        }
        .assist-info{
            margin: px2rem(5) px2rem(50) 0 0;
            height: px2rem(38);
            line-height: px2rem(38);
            font-size: px2rem(28);
            color: #666;
            @include flex;
            .assist-info_left{
                @include flex-item;
            }
            .assist-info_right{
                @include flex-item;
                text-align: right;
            }
        }
    }
    .card_ft{
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #EfEfEf;
        padding-top: px2rem(20);
        align-items: center;
        .card_ft_left {
            font-size: px2rem(24);
            color: #666;
        }
        .btn,.btn1{
            display: inline-block;
            padding: px2rem(10) px2rem(24);
            text-align: center;
            border-radius: px2rem(5);
        }
        .btn {
            border: 1px solid #4286FF;
            color: #4286FF;
        }
        .btn1 {
            background-color: #4286FF;
            color: #fff;
        }
    }

}
.icon{
    display: inline-block;
    width: px2rem(42);
    height: px2rem(42);
    margin: 0 px2rem(15) 0 0;
}
</style>
