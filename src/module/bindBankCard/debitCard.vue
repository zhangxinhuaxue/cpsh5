<template>
    <div class="aui-page banklist">
        <hybrid-header :config="barConfig"></hybrid-header>

        <div class="aui-content">
            <div class="bankcard_list border-up">
                <ul>
                    <!-- 当前选中的银行卡 -->
                    <li v-for="item in this.withholdList" :key="item.cardNo" class="bancard_detail borderDown" :dataid="item.id">
                        <span class="bank_icon">
                            <img :src="item.bankIcon" alt="">
                        </span>
                        <p>
                            <span class="bank_name">{{item.bankName}}</span><span class="card_num">尾号{{item.cardNo|tailNum}}</span>
                        </p>
                        <p class="bank_other">
                            单笔限额{{item.everyLimit / 1000}}元，单日限额{{item.dailyLimit / 1000}}元
                        </p>
                        <span v-if="item.isWithCard" class="selected_label"></span>
                    </li>
                    <!-- 当前可以更换的银行卡卡列表 -->
                    <li v-for="item in this.enabledList" :key="item.cardNo" @click="selectBankCard(item)" class="bancard_detail borderDown" :dataid="item.id">
                        <span class="bank_icon">
                            <img :src="item.bankIcon" alt="">
                        </span>
                        <p>
                            <span class="bank_name">{{item.bankName}}</span><span class="card_num">尾号{{item.cardNo|tailNum}}</span>
                        </p>
                        <p class="bank_other">
                            单笔限额{{item.everyLimit / 1000}}元，单日限额{{item.dailyLimit / 1000}}元
                        </p>
                    </li>
                </ul>
                <div class="addBox">
                    <a class="aui-cell aui-cell_access" href="javascript:;" @click="addBankCard">
                        <div class="aui-cell__hd icon-left">
                        </div>
                        <div class="aui-cell__bd">
                            <p class="fs32">添加新的银行卡</p>
                            <p class="fs24">请添加本人借记卡用于还款</p>
                        </div>
                    </a>
                </div>
            </div>
            <!-- 不可选银行卡列表 -->
            <div class="bankbind-disabled">
                <div class="bankcard_list bankbind-disabled">
                    <ul>
                        <li v-for="item in this.disabledList" :key="item.cardNo" class="bancard_detail borderDown" :dataid="item.id">
                            <span class="bank_icon">
                                <img :src="item.bankIcon" alt="">
                            </span>
                            <p>
                                <span class="bank_name">{{item.bankName}}</span><span class="card_num">尾号{{item.cardNo|tailNum}}</span>
                            </p>
                            <p class="bank_other">
                                该卡不能用于此渠道还款
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import { getDebitCard } from 'store/modules/bankbind/bank'
import { AXD, tailNum } from 'src/libs/util'
import {
    getRepayWithholdBank,
    reapyChangeBank,
    queryRepayChangeBank,
    isNeedSign,
    sign
} from 'store/modules/rrh'
export default {
    filters: {
        tailNum
    },
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            withholdList: [], // 当前绑定的银行卡list
            disabledList: [], // 不可选银行卡list
            enabledList: [], // 可选银行卡list
            selectIndex: null,
            cardId: this.$route.query.cardId,
            toUrl: this.$route.query.toUrl,
            loanId: this.$route.query.loanId
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        bankTitle(item) {
            return (item.bankName||'') + (item.payType === '2' ? '储蓄卡' : '信用卡') + '（' + item.cardNo + '）'
        },
        init() {
            getDebitCard({loanId: this.loanId || ''}).then(res => {
                if (res.success && res.result) {
                    this.withholdList = res.result.withholdList
                    this.disabledList = res.result.disabledList
                    this.enabledList = res.result.enabledList
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else {
                        this.$_toast(res.resultDes)
                    }
                }
            })
        },
        /**
         * 通用签约处理
         */
        commonSign(obj) {
            let signInfo = {
                bankCard: obj.bankCard,
                bankName: obj.bankName,
                name: obj.name,
                personCard: obj.personCard,
                telphone: obj.telphone,
                loanId: this.loanId,
                oidBiz: this.oidBiz,
                bankCardId: obj.bankCardId || (this.mainBank && this.mainBank.id),
                succTo: this.from || 'rrhBill',
                failTo: 'rrhChangeCard',
                changeFlag: obj.changeFlag
            }
            window.sessionStorage.setItem('signInfo', JSON.stringify(signInfo))
            this.$router.replace({
                name: 'rrhSign',
                query: {
                    loanId: this.loanId,
                    oidBiz: this.oidBiz
                }
            })
        },
        selectBankCard(obj) {
            isNeedSign({
                bankCardId: obj.id,
                showLoading: true,
                productType: 'qdh',
                loanId: this.loanId,
                changeFlag: 'Y'
            }).then(res => {
                // let result = res.result
                // result.bankCardId = obj.id
                // result.changeFlag = 'Y'
                // result.bankName = obj.bankName
                // this.commonSign(result)
                // 等调整完删除上面，放开下面
                if (res.success) {
                    let result = res.result
                    if (result.needSign) { // true 需要签约 该卡未在对应资金渠道签约过，则跳转到资方的签约页面“银行卡校验”
                        result.bankCardId = obj.id
                        result.changeFlag = 'Y'
                        this.commonSign(result)
                    } else {
                        this.$createDialog({
                            type: 'confirm',
                            title: '换卡确认',
                            content: '该笔借款的还款卡将更改为： ' + obj.bankName + ' 尾号' + obj.cardNo.substring(obj.cardNo.length - 4),
                            confirmBtn: {
                                text: '确 定'
                            },
                            onMaskClick: (hide) => {
                                hide()
                            },
                            onConfirm: () => {
                                reapyChangeBank({
                                    loanId: this.loanId,
                                    bankCardId: obj.id
                                }).then(res => {
                                    if (res.success && res.result.bindStatus === '1') {
                                        this.$_toast('换绑卡成功', () => {
                                            this.$router.back()
                                        })
                                    } else {
                                        this.$_toast(res.resultDes)
                                    }
                                })
                            },
                            onCancel: () => {}
                        }).show()

                    }
                } else {
                    let dialog = this.$createDialog({
                        content: res.resultDes,
                        confirmBtn: {
                            text: '我知道了'
                        },
                        onConfirm: () => {
                            dialog.hide()
                            this.$router.back()
                        }
                    }).show()
                }
            })

        },
        addBankCard() {
            //  window.location.href = '/pages/bankCard/add'
            this.$router.push({
                path: '/pages/bankCard/add',
                query:{
                    type:'repay',
                    loanProvider: this.$route.query.loanProvider
                }
            })

        }
    }
}
</script>
<style lang="scss" scoped>
@import 'style.scss';
$designWidth: 750;
body {
    background-color: #f3f3f3;
}
.fs32 {
    font-size: px2rem(32);
    color: #333;
}
.fs24 {
    font-size: px2rem(24);
    color: #999;
}
.addBox {
    background: #fff;
    height: px2rem(152);
    padding-top: px2rem(35);
}
.banklist {
    .bankcard_list {
        margin-bottom: px2rem(20);
        &.border-up{
            margin-top: px2rem(20);
        }
        ul {
            list-style: none;
            li {
                position: relative;
                width: 100%;
                overflow: hidden;
                height: px2rem(152);
                padding-top: px2rem(35);
                padding-left: px2rem(30);
                background-color: #fff;
                .bank_icon {
                    display: inline-block;
                    position: absolute;
                    left: px2rem(32);
                    top: px2rem(44);
                    width: px2rem(64);
                    height: px2rem(64);
                }
                p {
                    padding-left: px2rem(80);
                    color: #000;
                    line-height: px2rem(45);
                }
                .bank_other {
                    font-size: px2rem(24);
                    color: #999;
                    line-height: px2rem(33);
                }
                .card_type {
                    // border-right: 1px solid #777;
                    position: relative;
                    padding-right: px2rem(25);
                    &:after {
                        content: '';
                        width: 1px;
                        height: px2rem(30);
                        position: absolute;
                        right: 0;
                        top: px2rem(5);
                        background-color: #ccc;
                        -webkit-transform: scaleX(0.5);
                        transform: scaleX(0.5);
                    }
                }
                .bank_name {
                    font-size: px2rem(32);
                }
                .card_num {
                    margin-left: px2rem(15);
                    color: #666666;
                    font-size: px2rem(24);
                }
                .selected_label {
                    position: absolute;
                    right: px2rem(33);
                    top: px2rem(70);
                    width: px2rem(36);
                    height: px2rem(28);
                    background-color: #fff;
                    background: url(img/newbank_selected.png) center no-repeat;
                    background-size: cover;
                }
            }
        }
    }
    .icon-left {
        display: inline-block;
        width: px2rem(64);
        height: px2rem(64);
        background: url('img/bank_add.png') 0 center no-repeat;
        background-size: cover;
        margin-right: px2rem(20);
        img {
            width: 100%;
        }
    }
}
.bankbind-disabled {
    .bank_name, .card_num, .bank_other {
        color: #ccc !important;
    }
    .bank_icon {
        opacity: 0.2;
    }
}
</style>
