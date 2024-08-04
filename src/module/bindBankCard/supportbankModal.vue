<template>
    <m-modal :isShow="show"
        title="选择银行"
        ref="modal2"
        @close="close"
        @maskClick="close">
        <div slot="content">
            <m-cell-group class="banklist">
                <p class="tipword" v-if="this.$route.query.loanProvider">
                    {{ type === 'repay' ? '该渠道支持银行及限额如下' : '推荐使用的银行卡，放款成功率更高' }}
                </p>
                <m-cell v-for="item in itemList" :key="item.bankCode" @click="selBank(item)">
                    <img slot="icon" :src="item.bankIcon" alt="" >
                    <!-- <p slot="title">{{item.bankName}}</p> -->
                       <template #title>
                        <p >{{item.bankName }}
                            <label class="recommend" v-if="item.recommendFlag === '1'">推荐</label>
                        </p>
                        <p v-if="type === 'repay' &&  item.everyLimit"
                        class="mui-cell__bd_subtitle">
                        <!-- {{option.subTitle}} -->
                        单笔限额{{item.everyLimit|formatMoneyK(0)}}元,
                        单日限额{{item.dailyLimit|formatMoneyK(0)}}元
                        </p>
                    </template>
                    <m-icon type="check" slot="value" v-if="item.bankCode == bankCode"></m-icon>
                </m-cell>
            </m-cell-group>
        </div>
    </m-modal>
</template>
<script>
import { bandListByMsg } from 'store/modules/bankbind/bank'
import { AXD, formatMoneyK } from 'src/libs/util'
export default {
    name: 'supportbankModal',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        bankCode: {
            type: String,
            default: ''
        }
    },
    filters:{
        formatMoneyK
    },
    data() {
        return {
            itemList: [],
            type: this.$route.query.type
        }
    },
    mounted() {
        this.getBankList()
    },
    methods: {
        getBankList() {
            bandListByMsg({
                loanProvider: this.$route.query.loanProvider ,
                type: this.type
            }).then((res) => {
                if (res.success && res.result.length) {
                    this.itemList = res.result
                } else if (res.code === '-1999') {
                    AXD.util.login()
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        close() {
            this.$emit('close')
        },
        selBank(item) {
            this.$emit('choose', item)
        }
    }
}
</script>
<style lang="scss" scoped>
.banklist {
    text-align: left;
    ::v-deep .mui-cell__hd_icon {
        width: px2rem(44);
        height: px2rem(44);
    }
}
.tipword {
    background: #f7f7f7;
    font-size: px2rem(24);
    padding-left: px2rem(32);
    color: #999;
    height: px2rem(78);
    line-height: px2rem(78);
}
.recommend {
    width: px2rem(56);
    height: px2rem(32);
    line-height: px2rem(32);
    background: #ff3e00;
    border-radius: px2rem(16) px2rem(16) px2rem(16) 0;
    font-size: px2rem(20);
    color: #fff;
    text-align: center;
    display: inline-block;
    margin-left: px2rem(24);
}
</style>
