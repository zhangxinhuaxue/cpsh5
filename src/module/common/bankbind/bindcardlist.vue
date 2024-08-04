<template>
    <div class="bankbind">
        <div class="aui-popup__hd">
            <a class="close" href="javascript:;">
                <span class="icon-close1" @click="close"></span>
            </a>
            <h3>收款账户</h3>
        </div>
        <div class="aui-popup__bd" id="auiPopupBd">
            <!-- <p class="title">请选择或添加一张本人的银行卡，用于放款和还款</p> -->
            <p class="title">推荐使用的银行卡，放款成功率更高</p>
            <m-cell-group>
                <m-cell v-for="item in allCardList.supportBankCard" :key="item.id" @click="chooseBack(item)">
                    <img slot="icon" :src="item.bankIcon" alt="" >
                    <p slot="title">{{bankTitle(item)}}<label class="recommend" v-if="item.recommendFlag === '1'">推荐</label></p>
                    <m-icon type="check1" slot="value" v-if="item.cardNo == curCardCode"></m-icon>
                </m-cell>
                <m-cell is-link title="添加银行卡" @click="goBindCard">
                    <img slot="icon" :src="bankAddIcon" alt="" >
                </m-cell>
            </m-cell-group>
            <m-cell-group class="bankbind-disabled">
                <m-cell :title="bankTitle(item)" subTitle="该产品暂不支持此银行卡作为放款卡" v-for="item in allCardList.unsupportBankCard" :key="item.cardId"></m-cell>
            </m-cell-group>
        </div>
    </div>
</template>
<script>
import { AXD } from 'src/libs/util'
export default {
    name: 'bankbind',
    props: {
        allCardList: {
            type: Object
        },
        curCardCode: {
            type: String
        },
        loanProvider: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            bankAddIcon: require('./img/add.png')
        }
    },
    computed: {},
    methods: {
        bankTitle(item) {
            return (item.bankName||'') + (item.payType === '2' ? '储蓄卡' : '信用卡') + '（' + item.cardNo + '）'
        },
        chooseBack(item) {
            let obj = {
                cardCode: item.cardNo,
                cardId: item.id,
                bankName: item.bankName,
                bankIcon: item.bankIcon,
                bankCode: item.bankCode,
                custName: item.realName,
                custId: item.idNo,
                mobile: item.mobile
            }

            this.$emit('chooseCard', obj)
        },
        close() {
            this.$emit('chooseCard', null)
        },
        goBindCard() {
            this.close()
            if (AXD.util.isiOS()) {
                this.$router.push({
                    path: '/pages/bankCard/add',
                    query: {
                        oidBiz: this.$route.query.oidBiz,
                        loanProvider: this.loanProvider,
                        type: 'loan'
                    }
                })
            } else {
                window.location.href = '/pages/bankCard/add?oidBiz=' + this.$route.query.oidBiz + '&loanProvider=' + this.loanProvider + '&type=loan'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.bankbind {
    p.title {
        padding: px2rem(24) px2rem(32);
        line-height: px2rem(25);
        font-size: $auiFontSizeLevel7;
        color: $auiTextColorAssistant;
        background-color: #F4F4F4;
    }
    .mui-cells {
        margin-top: 0;
        position: static;
        .mui-cell {
            position: static;
            &:last-child {
                border-bottom: none;
            }
        }
    }
    ::v-deep .mui-cell__hd_icon {
        width: px2rem(44);
        height: px2rem(44);
    }
    .bankbind-disabled {
        border-top: px2rem(20) solid #F4F4F4;
        color: #ccc;
        ::v-deep .mui-cell__bd_subtitle {
            color: #ccc;
        }
    }
}
.aui-popup__hd {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    line-height: 2.048rem;
    padding: 0 .68267rem;
    position: relative;
    text-align: center;
    .close {
        display: inline-block;
        width: 2.048rem;
        line-height: 2.048rem;
        position: absolute;
        left: 0;
        top: 0;
        span {
            font-size: .68267rem;
        }
    }
    h3 {
        width: 100%;
        text-align: center;
        font-weight: 400;
        color: #666;
        font-size: .68267rem;
        line-height: 2.048rem;
    }
}
.aui-popup__hd:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e4e4e4;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
}
.aui-popup .aui-popup_content .aui-popup__bd {
    margin-bottom: 0;
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
