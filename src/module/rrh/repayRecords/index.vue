<template>
<div class="aui-page">
    <hybrid-header></hybrid-header>
    <div class="aui-content">
        <div v-if="repaymentList.length">
            <repayment-item v-for="(item, index) in repaymentList" :content="item" :key="index"
                            @itemClick="showRepaymentDetail"></repayment-item>
            <div class="loadding_foot_1" v-if="more" @click="getRecord">
                点击加载更多
                <p class="loadding_bottom"></p>
            </div>
            <div class="loadding_foot" v-else>
                已无更多
                <p class="loadding_bottom"></p>
            </div>
        </div>
        <div v-else>
            <empty text="暂时还没有还款记录哦"></empty>
        </div>
    </div>
    <router-view></router-view>
</div>
</template>
<script>
import { AXD } from 'src/libs/util'
import { getRepayRecord, getRepayRecordCount } from 'src/store/modules/rrh'
import repaymentItem from './repay-item.vue'
import empty from '../common/empty.vue'
export default {
    name: 'repaymentRecords',
    data() {
        return {
            repaymentList: [],
            pageSize: 10,
            pageNo: 1,
            totalNumber: 0
        }
    },
    components: {
        repaymentItem,
        empty
    },
    computed: {
        more() {
            return this.totalNumber && this.totalNumber > this.repaymentList.length
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.getRecordCount()
        },
        getRecord() {
            getRepayRecord({
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }).then(res => {
                if (res.success) {
                    if (res.result && res.result.length) {
                        this.repaymentList = this.repaymentList.concat(res.result)
                        this.pageNo++
                    }
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        getRecordCount() {
            getRepayRecordCount().then(res => {
                if (res.success) {
                    this.totalNumber = parseInt(res.result) || 0
                    if (this.totalNumber) {
                        this.getRecord()
                    }
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
        showRepaymentDetail(item) {
            this.$router.push({
                name: 'rrhRepayDetails',
                query: {
                    id: item.id
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.loadding_foot {
    text-align: center;
    color: #CCCCCC;
    font-size: px2rem(28);
    padding: px2rem(14) px2rem(28);
    .loadding_bottom {
        height:px2rem(20)
    }
}
.loadding_foot_1 {
    color: #222;
    height: px2rem(90);
    text-align: center;
    padding: px2rem(14) px2rem(28);
    font-size: px2rem(28);
}
</style>
