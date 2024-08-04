<template>
    <div class="order-cell">
        <div class="order-cell__hd"><span>{{orderInfo[0].statusName}}</span><span>{{orderInfo[0].tradeIdOrDate}}</span></div>
        <div class="order-cell__bd">
            <product-info v-for="item in orderInfo" :key="item.id" :productInfo="item" @click.native="handlerJump(item.orderOptions)"></product-info>
            <slot></slot>
        </div>
        <actionsheets-list :list="selectList" @complete="choosePop" :isPop="isPop" :isShowBtn="true"></actionsheets-list>
    </div>
</template>
<script>
import productInfo from './product-info.vue'
import actionsheetsList from 'components/actionsheets/list.vue'

export default {
    name: 'orderList',
    props: {
        orderInfo: Array
    },
    components: {
        productInfo,
        actionsheetsList
    },
    data() {
        return {
            isPop: false,
            selectList: {}
        }
    },
    methods: {
        choosePop(item, index) {
            this.isPop = false
            if (item !== undefined) {
                this.goDetail(item.orderId)
            }
        },
        getActionSheetList(list) {
            return list.map(({ optionName, orderId }) => ({
                name: optionName,
                orderId
            }))
        },
        goDetail(orderId) {
            this.$router.push({
                name: 'refundOrderDetail',
                query: {
                    orderId
                }
            })
        },
        handlerJump(obj) {
            if (obj.length === 1) {
                this.goDetail(obj[0].orderId)
                return
            }

            let detailList = this.getActionSheetList(obj)
            this.selectList = {
                title: '',
                list: detailList
            }
            this.isPop = true
        }
    }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
.order-cell {
    background-color: #fff;
    border-radius: px2rem(10);
    overflow: hidden;
    margin-bottom: px2rem(40);
}

.order-cell__hd {
    background-color: #EBEBEB;
    height: px2rem(70);
    line-height: px2rem(70);
    padding: 0 px2rem(20);
    span:first-child {
        font-size: $auiFontSizeLevel4;
        float: left;
    }
    span:last-child {
        color: $auiTextColorGeneral;
        float: right;
    }
}

.order-cell__bd {
    padding: 0 px2rem(20);
}

.order-info__sub,
.order__btns {
    padding: px2rem(30) 0;
    text-align: right;
    color: $auiTextColorGeneral;
}

.order__btns {
    .aui-btn_small,
    .aui-btn_small-bg {
        height: px2rem(50);
        line-height: px2rem(50); // border-radius: px2rem(26);
        padding: 0 px2rem(30);
        font-size: $auiFontSizeLevel5;
        vertical-align: middle;
        margin-left: px2rem(20);
        &:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            width: 0;
            height: 100%;
            margin-top: 3px;
        }
    }
    .aui-btn_small {
        &.gray {
            border-color: $auiTextColorAssistant;
            color: $auiTextColorAssistant;
        }
    }
}
</style>
