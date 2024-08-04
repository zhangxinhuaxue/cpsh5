<template>
<div class="aui-page">
    <hybrid-header></hybrid-header>
    <div class="aui-content">
        <div v-if="loanList.length">
            <template v-if="tabbarIndex === 0">
                <loan-card v-for="(item, index) in loanList" :content="item" :key="index" @cardClick="showLoanDetail(item)"></loan-card>
            </template>
            <template v-if="tabbarIndex === 1">
                <fee-card v-for="(item, index) in loanList" :content="item" :key="index" @cardClick="showLoanDetail(item)"></fee-card>
            </template>
        </div>
        <div v-else>
            <empty text="暂时还没有借款记录哦"></empty>
        </div>
    </div>
    <m-tabbar
        v-model="tabbarIndex"
        :fixed="false"
        class="tabbar"
        @change="onIndexChange"
    >
        <m-tabbar-item>
            <span slot="label">取现订单</span>
        </m-tabbar-item>
        <m-tabbar-item>
            <span slot="label">其他订单</span>
        </m-tabbar-item>
    </m-tabbar>
    <router-view></router-view>
</div>
</template>
<script>
import { Tabbar as mTabbar, TabbarItem as mTabbarItem } from '@fe/buss-ui'
import { AXD } from 'src/libs/util'
import { getMyLoan } from 'store/modules/rrh'
import loanCard from './loan-card.vue'
import feeCard from './fee-card.vue'
import empty from '../common/empty.vue'
import reloginMixins from 'src/module/rrh/mixins.js'
export default {
    name: 'loanRecords',
    mixins: [reloginMixins],
    data() {
        return {
            tabObj: {
                0: 'loan',
                1: 'security'
            },
            tabbarIndex: 0,
            loanList: []
        }
    },
    components: {
        mTabbar,
        mTabbarItem,
        loanCard,
        feeCard,
        empty
    },
    created() {
        this.getData()
        this.isNeedTeled()
    },
    methods: {
        // tab切换
        onIndexChange(newIndex) {
            this.tabbarIndex = newIndex
            this.getData()
        },
        getData() {
            getMyLoan({
                loanType: this.tabObj[this.tabbarIndex]
            }).then(res => {
                if (res.success) {
                    // 针对'泰和担保费'改成'增信费'
                    res.result.forEach(item => {
                        if (item.oidBiz === '202162') {
                            item.productName = '增信费'
                        }
                    })
                    this.loanList = res.result || []
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
         * 显示账单详情
         * @return {[type]} [description]
         */
        showLoanDetail(loan) {
            this.$router.push({
                name: 'rrhLoanDetails',
                query: {
                    loanId: loan.loanId
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.aui-content {
    margin-top: px2rem(99);
    padding-bottom: px2rem(24);
}
.tabbar {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
}
::v-deep .m-tabbar {
    line-height: px2rem(84);
    padding-top: 0;
    color: #717172;
    .m-tabbar__label {
        font-size: px2rem(32);
    }
    .m-tabbar__item {
        color: #666;
    }
    .m-tabbar__item_on {
        color: #424243;
        font-weight: bold;
        border-bottom: px2rem(4) solid #4286FF;
    }
}
.aym {
    .m-tabbar .m-tabbar__item_on {
        border-bottom: px2rem(4) solid #ffe352;
    }
}
</style>
