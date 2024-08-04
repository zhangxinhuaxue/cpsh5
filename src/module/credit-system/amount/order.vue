<!--
 * @Author: dongyusi on 08/2018
 * @LastEditors: sunxj
 * @Description: 带单授信已废弃
 * @Date: 2019-03-21 18:13:31
 * @LastEditTime: 2019-08-29 12:08:45
 -->
<template>
    <m-page class="page">
        <div class="page-hd">
            <p class="limit-title">本次订单所需提高额度</p>
            <p class="limit-money"><span>¥ </span>{{needMoney}}</p>
            <p class="limit-des">订单金额共{{loanMoney}}元，当前可用{{config.money}}元</p>
            <m-button @click="goPay" :disabled="disabled">去支付</m-button>
        </div>
        <auth-cells v-if="showQuickList" :data="config.quickList" :accountIsNormal="config.accountIsNormal"  @back="goAmount"></auth-cells>
        <template v-if="isApp">
        <auth-cells class="credit-cells" :data="config.dataList" :taobaoIsFirst="config.taobaoIsFirst" :accountIsNormal="config.accountIsNormal"  @back="goAmount"></auth-cells>
        <!-- <m-cell-group>
            <m-cell v-for="(item, index) in dataList" :key="index">
                <div slot="icon" class="icon-bg" :class="'icon-' + item.type"></div>
                <div slot="title">
                    <p>{{item.name}}</p>
                    <p>{{item.dese}}</p>
                </div>
                <m-button slot="value"
                    size="small"
                    @click="goAmount(item.type)"
                    :class="[getClassName(item.status)]"
                    :disabled="itemStatus(item.status)">{{item.button}}</m-button>
            </m-cell>
        </m-cell-group> -->
        <div v-if="!config.dataList.length && !config.quickList.length" class="limit-wait">
            <img :src="waitImg" alt="">
            <p class="item-des">更多提额项开放中</p>
        </div>
        </template>
        <h5Footer v-else></h5Footer>
    </m-page>
</template>
<script>
import authCells from '../components/auth-cells.vue'
import h5Footer from './blocks/h5-footer.vue'
import { formatNum } from 'src/libs/util'
import { resetHeader } from '../common/setHeader'
// import axdDialog from 'components/dialog/index'
export default {
    name: 'credit-order',
    props: {
        config: {
            type: Object,
            default: () => {
                return {
                    quickList: [],
                    dataList: [],
                    money: '0',
                    taobaoIsFirst: false, // taobaoIsFirst（表示优先级）: false => 已进行淘宝认证 ； ture => 未进行淘宝认证
                    accountIsNormal: true // 信用帐号是否正常
                }
            }
        }
    },
    data() {
        let query = this.$route.query
        return {
            loanMoney: '',
            needMoney: '',
            query,
            waitImg: require('../assets/images/wait.png')
        }
    },
    components: {
        authCells,
        h5Footer
    },
    computed: {
        // dataList() {
        //     return [...this.config.quickList, ...this.config.dataList]
        // },
        disabled() {
            return parseFloat(this.needAmount) < parseFloat(this.config.money)
        },
        showQuickList() {
            let list = this.config.quickList
            if (!list.length) {
                return false
            }
            return list[0].type == '1' || this.isApp
        }
    },
    mounted() {
        document.title = '我要提额'
        this.init()
    },
    methods: {
        init() {
            this.loanMoney = this.query.loanMoney
            this.needMoney = this.formatMoney(this.query.needMoney - this.config.money)
        },
        goAmount(type) {
            // if (!(type === '9' || type === '1') && this.config.taobaoIsFirst) {
            //     this.taobaoDialog()
            //     return
            // }
            this.$emit('goAmountItem', type)
        },
        goPay() {
            resetHeader(() => {
                window.location.href = this.query.creditBackUrl
            })
        },
        formatMoney(num) {
            return num > 0 ? formatNum(num, 1, true) : 0
        }
        // getClassName(status) {
        //     // 1.未申请，2.授信中，3.授信通过，4.授信驳回，5.授信关闭(5-1关闭中，5-2关闭时间已过)，99.不可点击
        //     if (['2', '3', '5_2', '99'].indexOf(status) > -1) {
        //         return 'btn-status_disable'
        //     }
        //     if (['4'].indexOf(status) > -1) {
        //         return 'btn-status_passable'
        //     }
        // },
        // itemStatus(status) {
        //     return ['2', '3', '5_2', '99'].indexOf(status) > -1
        // },
        // taobaoDialog() {
        //     let me = this
        //     axdDialog({
        //         content: '为了更好评估你的信用，请先完成淘宝认证，淘宝认证的额度更高哦',
        //         buttons: [{
        //             text: '取消'
        //         }, {
        //             text: '去淘宝认证',
        //             onClick: function() {
        //                 me.goAmount('9')
        //             }
        //         }]
        //     })
        // }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page {
    background-color: #fff;
}
.page-hd {
    padding: px2rem(60) 0 px2rem(50);
    text-align: center;
    font-size: $auiFontSizeLevel5;
    box-shadow: 0px 3px 20px 0px rgba(227,227,227,0.5);
    margin-bottom: px2rem(20);
}
.credit-cells ::v-deep.mui-cell:first-child:before {
    display: block;
}
.icon-bg {
    width: px2rem(60);
    height: px2rem(60);
    margin-right: px2rem(40);
    background-size: px2rem(260) px2rem(260);
}
.limit-title {
    color: $auiTextColorGeneral;
}
.limit-money {
    line-height: px2rem(117);
    font-size: px2rem(64);
    margin: px2rem(10) 0 px2rem(20);
    span {
        font-size: px2rem(32);
    }
}
.limit-des {
    color: $auiTextColorAssistant;
    margin-bottom: px2rem(66);
}
</style>
