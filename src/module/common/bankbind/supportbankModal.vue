<template>
    <m-modal :isShow="show"
        title="银行列表"
        ref="modal2"
        @close="close">
        <div slot="content">
            <m-cell-group class="banklist">
                <p class="tipword">推荐使用的银行卡，放款成功率更高</p>
                <m-cell v-for="item in itemList" :key="item.bankCode" @click="selBank(item)">
                    <img slot="icon" :src="item.bankIcon" alt="" >
                    <p slot="title">{{item.bankName}}<label class="recommend" v-if="item.recommendFlag === '1'">推荐</label></p>
                    <m-icon type="check" slot="value" v-if="item.bankCode == bankCode"></m-icon>
                </m-cell>
            </m-cell-group>
        </div>
    </m-modal>
</template>
<script>
import { bandListByMsg } from 'store/modules/bankbind/bank'
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
    data() {
        return {
            itemList: []
        }
    },
    mounted() {
        this.getBankList()
    },
    methods: {
        getBankList() {
            bandListByMsg({ loanProvider: this.$route.query.loanProvider || '' }).then((res) => {
                if (res.success && res.result.length) {
                    this.itemList = res.result
                } else {
                    this.$_toast(res.result.message)
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
