<!--
    Created by Zhao ZS on 06/29/17
    props里面的传值用于兼容老版本

    使用说明：
    // 银行卡信息格式
    bankInfo: {
        bankCode: '',
        cardCode: '',
        bankName: '',
        bankIcon: ''
    }
    新版本用法：
    <bind-card :userId="userId"> </bind-card>

    update log:
    2017/11/14 去掉老版本兼容用法，唯一用到的地方-短贷已经更新为新的。
-->
<template>
    <div class="bankcard">
        <m-cell title="收款账户" @click="goSelectOrBindCard" is-link is-select ref="bankCell">
            <div slot="value">
                <div v-if="hasCards">{{cardInfo.bankName}}({{cardInfo.cardCode}})</div>
                <div v-else>添加银行卡</div>
            </div>
        </m-cell>
        <pop-up :isPop="bankListShow" class="aui-popup_large">
            <template slot="content">
                <card-list @chooseCard="chooseCard" :allCardList="allCardList" :curCardCode="cardInfo.cardCode" :loanProvider="loanProvider"></card-list>
            </template>
        </pop-up>
    </div>
</template>
<script>
import popUp from 'src/components/popup/index.vue'
import cardList from './bindcardlist.vue'
import { getBankListNew } from 'store/modules/bankbind/bank'
import { AXD } from 'src/libs/util'
export default {
    name: 'bankcard',
    props: {
        userId: {
            type: String,
            default: ''
        },
        hisBankCardId: {
            type: String,
            default: ''
        },
        enable: {
            type: Boolean,
            default: true
        },
        loanProvider: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            bankAddIcon: require('./img/add.png'),
            hasCards: false,
            cardList: [],
            allCardList: {},
            bankListShow: false,
            cardInfo: {
                cardCode: '',
                cardId: '',
                bankName: '',
                bankIcon: '',
                bankCode: '',
                custName: '',
                custId: '',
                mobile: ''
            },
            forceLogOut: false
        }
    },
    watch: {
        // userId(curVal, oldValue) {
        //     if (curVal) {
        //         this.getBankCards()
        //     }
        // },
        loanProvider(n, o) {
            n && this.getBankCards()
        }
    },
    components: {
        popUp,
        cardList
    },
    mounted() {
        this.getBankCards()
        // 挂载完毕之后把银行卡列表popup页面放在body下，防止遮挡现象
        // let popup = this.$refs.bankCell.parentNode.querySelector('.aui-popup')
        // let pageNode = this.$refs.bankCell.parentNode
        // while (pageNode.className.indexOf('aui-page') < 0 && pageNode.className.indexOf('mui-page') < 0) {
        //     pageNode = pageNode.parentNode
        // }
        // pageNode.appendChild(popup)
    },
    methods: {
        // 获取默认
        getBankCards() {
            if (!this.userId || !this.loanProvider) {
                this.hasCards = false
            } else {
                getBankListNew({loanProvider: this.loanProvider}).then((res) => {
                    if (res.success) {
                        if (res.result.supportBankCard && res.result.supportBankCard.length) {
                            this.hasCards = true
                            this.cardList = res.result.supportBankCard
                            this.allCardList = res.result
                            this.setDefaultCard()
                        } else {
                            this.$emit('complete', this.cardInfo)
                        }
                    } else {
                        if (res.code === '-1999') {
                            // 返回上层，提示账户可能被强制退出
                            this.$emit('complete', null)
                            this.forceLogOut = true
                        }
                    }
                })
            }
        },
        setDefaultCard() {
            let index = 0
            if (this.hisBankCardId) {
                this.cardList.forEach((item, i) => {
                    if (item.id + '' === this.hisBankCardId) {
                        index = i
                        return false
                    }
                })
            }
            this.cardInfo.cardCode = this.cardList[index].cardNo
            this.cardInfo.cardId = this.cardList[index].id
            this.cardInfo.bankName = this.cardList[index].bankName
            this.cardInfo.bankIcon = this.cardList[index].bankIcon
            this.cardInfo.bankCode = this.cardList[index].bankCode
            this.cardInfo.custName = this.cardList[index].realName
            this.cardInfo.custId = this.cardList[index].idNo
            this.cardInfo.mobile = this.cardList[index].mobile
            this.$emit('complete', this.cardInfo)
        },
        // 选择银行卡 或 添加银行卡
        goSelectOrBindCard() {
            if (!this.enable) {
                return false
            }
            if (!this.userId || this.forceLogOut) {
                AXD.util.login()
            } else {
                if (this.hasCards) {
                    this.bankListShow = true
                } else {
                    this.$router.push({
                        path: '/pages/bankCard/add',
                        query: {
                            loanProvider: this.loanProvider
                        }
                    })
                }
            }
        },
        chooseCard(data) {
            if (data !== null) {
                Object.assign(this.cardInfo, data)
                this.$emit('complete', data)
            }

            this.bankListShow = false
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
.add-bank {
    width: px2rem(48);
    height: px2rem(48);
    margin-right: px2rem(24);
}
.bankcard {
    .aui-popup_content {
        background: #F7F7F7;
    }
}
.aui-popup.aui-popup_large .aui-popup_content {
    height: auto;
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
