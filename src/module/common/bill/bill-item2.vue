<template>
<div class="bill">
    <div class="bill_body" flex>
        <div class="checkbox" :class="{'dischecked':!data.checked}" @click.stop="selectBill"></div>
        <div style="flex: 1;">
            <div class="main-info" flex>
                <div class="main-info_left">{{data.title}}</div>
                <div class="main-info_right">剩余：{{data.money | formatMoneyK}}</div>
            </div>
            <div class="assist-info" flex>
                <div class="assist-info_left">
                    还款日：{{data.date}}
                    <span v-if="data.billStatus && data.billStatus=='DELAY'" class="aui-tag_bgcolor warn ml5">已逾期</span>
                </div>
                <div class="assist-info_right">优惠：{{data.benefit | formatMoneyK}}</div>
            </div>
        </div>
        <div class="detail" @click.stop="showDetail"></div>
    </div>
</div>
</template>
<script>
import { formatMoneyK } from 'src/libs/util'
export default {
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    filters: {
        formatMoneyK
    },
    methods: {
        showDetail() {
            this.$emit('showDetail')
        },
        /**
         * 选择账单
         * @return {[type]} [description]
         */
        selectBill() {
            this.$emit('select', this.data)
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
    height: px2rem(140);
    padding: 0 px2rem(33);
    .bill_body{
        height: 100%;
        padding: px2rem(26) 0;
        border-bottom: 1px solid #e4e4e4;
        position: relative;
        .checkbox{
            width: px2rem(40);
            height: px2rem(40);
            margin-right: px2rem(32);
            margin-top: px2rem(24);
            @include img2x('./imgs/checked');
            background-size: 100% 100%;
            &.dischecked{
                @include img2x('./imgs/dischecked');
            }
        }
        .detail{
            height: px2rem(36);
            width: px2rem(36);
            margin-left: px2rem(15);
            margin-top: px2rem(26);
            @include img2x('./imgs/info');
            background-size: 100% 100%;
        }
        .main-info{
            height: px2rem(42);
            line-height: px2rem(42);
            .main-info_left{
                flex: 1;
            }
            .main-info_right{
                flex: 1;
                text-align: right;
            }
        }
        .assist-info{
            margin-top: px2rem(5);
            height: px2rem(38);
            line-height: px2rem(38);
            font-size: px2rem(26);
            color: $auiTextColorAssistant;
            .assist-info_left{
                flex: 2;
            }
            .assist-info_right{
                flex: 1;
                text-align: right;
            }
        }
    }
    &:first-child{
        margin-top: px2rem(20);
    }
}
.bill:last-child .bill_body{
    border-bottom: none;
}
.warn{
    background-color: #ff6161
}
</style>
