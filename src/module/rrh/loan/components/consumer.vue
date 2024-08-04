<template>
    <div class="consumer-block">
        <m-cell title="消费用途" is-link is-select :value="value" @click="showLoanReasonList"></m-cell>
        <popup-select :isShow="isShowLoanReasonList" :reasonList="loanReasonList" @chooseReason="selectLoanReason" @popupSelectClose="closeLoanReaonList"></popup-select>
    </div>
</template>

<script>
import popupSelect from 'src/module/common/popup-select/index.vue'
import { formatMoneyK } from 'src/libs/util'

export default {
    props: ['value', 'loanReasonList'],
    components: {
        popupSelect
    },
    data() {
        return {
            // 是否显示借款用途
            isShowLoanReasonList: false
        }
    },
    methods: {
        /**
         * 显示借款用途列表
         * @return {[type]} [description]
         */
        showLoanReasonList() {
            if (this.isChangeBalance) {
                return false
            }
            this.isShowLoanReasonList = true
        },
        /**
         * 选择借款用途
         * @param  {[type]} reason [description]
         * @return {[type]}        [description]
         */
        selectLoanReason(reason) {
            this.$emit('complete', reason)
            this.isShowLoanReasonList = false
        },
        /**
         * 关闭借款用途列表
         * @return {[type]} [description]
         */
        closeLoanReaonList() {
            this.isShowLoanReasonList = false
        }
    }
}
</script>
<style lang='scss' scoped>
.consumer-block{
    background: #ff0;
     ::v-deep {
        .mui-cell{
            &:after {
                content: " ";
                position: absolute;
                top: 0;
                height: 1px;
                background-color: #e4e4e4;
                -webkit-transform-origin: 0 0;
                transform-origin: 0 0;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                left: 0.68267rem;
                right: 0.68267rem;
            }
        }
    }
}
</style>