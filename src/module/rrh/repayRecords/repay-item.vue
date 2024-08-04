<template>
    <div class="repayment" @click="itemClick">
        <div class="repayment_bd">
            <div class="left">
                <p class="status">{{content.repayType | formatRepayTypeDesc}}</p>
                <p class="time">{{content.repayTime | timeYMD2}}</p>
            </div>
            <div class="right">{{content.amtPay | formatMoneyK}}</div>
        </div>
    </div>
</template>
<script>
import {
    formatMoney,
    formatMoneyK,
    timeYMD2
} from 'src/libs/util'
import { formatRepayTypeDesc } from '../common/utils'
export default {
    props: ['content'],
    filters: {
        formatMoneyK,
        timeYMD2,
        formatRepayTypeDesc
    },
    methods: {
        itemClick() {
            this.$emit('itemClick', this.content)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.repayment{
    width: px2rem(750);
    background-color: #ffffff;
    font-size: px2rem(30);
    position: relative;
    color: $auiTextColorImportant;
    &:active{
        background-color: #ececec
    }
    .repayment_bd{
        height: px2rem(140);
        padding: px2rem(20) px2rem(69) px2rem(20) 0;
        margin-left: px2rem(32);
        position: relative;
        border-top: 1px solid #e4e4e4;
        @include flex;
        &:after{
            content: " ";
            display: inline-block;
            height: .62222rem;
            width: .62222rem;
            background-image: url("data:image/svg+xml;base64,PHN2ZyBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0IDQ0Ij48c3R5bGU+LnN0MHtmaWxsOiNjY2N9PC9zdHlsZT48cGF0aCBpZD0iWE1MSURfNF8iIGNsYXNzPSJzdDAiIGQ9Ik0zMyAyMUwxNS4xIDMuMWMtLjYtLjYtMS41LS42LTIuMSAwcy0uNiAxLjUgMCAyLjFsMTYuOSAxNi45TDEzIDM5Yy0uNi42LS42IDEuNSAwIDIuMS4zLjMuNy40IDEuMS40cy44LS4xIDEuMS0uNEwzMyAyMy4yYy4zLS4zLjQtLjcuNC0xLjEuMS0uNC0uMS0uOC0uNC0xLjF6Ii8+PC9zdmc+");
            background-size: cover;
            right: px2rem(30);
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        .left{
            @include flex-item;
            line-height: px2rem(50);
        }
        .right{
            @include flex-item;
            text-align: right;
            line-height: px2rem(100);
            // &:before{
            //     content: '￥'
            // }
        }
        .status{
            font-size: px2rem(30);
        }
        .time{
            font-size: px2rem(26);
            color: $auiTextColorAssistant;
        }
    }
    &:first-child{
        margin-top: px2rem(20);
    }
}
.repayment:first-child .repayment_bd{
    border-top: none;
}
</style>
