<template>
    <popup :isPop="show" @cancel="close">
        <div class="aui-popup_content" slot="content">
            <div class="popup-select__hd">
                <a class="close" href="javascript:;" @click="close">
                    <span class="icon-close1"></span>
                </a>
                <h3>详情</h3>
            </div>
            <div class="detail">
                <div class="detail_hd">
                    <div class="title">合计应还(元)</div>
                    <div class="money">{{data.money | formatMoneyK}}</div>
                </div>
                <div class="detail_bd">
                    <template v-for="(item, index) in data.details">
                        <div :key="index" v-if="item.show" class="detail_item" :class="{warn: item.warn}">
                            <div class="label" :class="{warn: item.warn}">
                                {{item.label}}
                                <m-icon v-if="item.label === '综合费用'" class="fee-tip" type="attetion" @click.stop="showFeeInfo"></m-icon>
                            </div>
                            <div class="value">{{item.value}}</div>
                        </div>
                    </template>
                </div>
            </div>
            <p v-if="!data.canPay" class="tip">注意：单笔订单当天仅允许还款3次。在申请前，请您确保您的还款银行卡内资金充足，以免因还款资金不足导致还款失败。</p>
            <div v-if="true" class="submit" :class="{'disabled':!allowApply}" @click="submit">{{btnText}}</div>
        </div>
    </popup>
</template>
<script>
import { formatMoneyK } from 'src/libs/util'
import popup from 'components/popup/index.vue'
export default {
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        rrhzx: {
            type: Object,
            default: () => {}
        },
    },
    components: {
        popup
    },
    filters: {
        formatMoneyK
    },
    computed: {
        allowApply() {
            return this.data.status == 2
        },
        btnText() {
            return this.data.status == 2 ? '立即申请' : '已提交'
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        submit() {
            this.$emit('submit', this.data)
        },
        showFeeInfo() {
            this.$createDialog({
                type: 'alert',
                content: this.rrhzx.summaryFeeTip,
                confirmBtn: {
                    text: '我知道了'
                }
            }).show()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../styles/common.scss';
.popup-select__hd {
    display: flex;
    height: px2rem(96);
    line-height: px2rem(96);
    padding: 0 px2rem(32);
    position: relative;
    text-align: center;
    background-color: #fff;
    border-bottom: px2rem(1) solid #e4e4e4;
    .close {
        display: inline-block;
        width: px2rem(96);
        line-height: px2rem(96);
        position: absolute;
        left: 0;
        top: 0;
        span {
            font-size: px2rem(32);
        }
    }
    & h3 {
        width: 100%;
        line-height: px2rem(96);
        text-align: center;
        font-weight: normal;
        font-size: px2rem(32);
        color: #666;
    }
}
.fee-tip{
    font-size: 18px;
    color: #999;
    display: inline-block;
    transform: translate(5px, 2px);
}
.detail .detail_bd{
    padding: px2rem(22) px2rem(43);
}
.submit{
    // margin-top: px2rem(60);
    height: px2rem(90);
    line-height: px2rem(90);
    background-color: var(--auiColorPrimary);
    color:var(--auiButtonTextColor);
    font-size: px2rem(36);
    text-align: center;
}

.disabled{
    color: #666;
    background-color: #ccc
}
.tip {
    padding: px2rem(18) px2rem(32);
    color: #F99E00;
    font-size: px2rem(24);
    line-height: px2rem(32);
    background: url('../styles/imgs/tip.png') px2rem(32) px2rem(24) no-repeat;
    background-size: px2rem(24) px2rem(24);
    text-indent: px2rem(30);
}
</style>
