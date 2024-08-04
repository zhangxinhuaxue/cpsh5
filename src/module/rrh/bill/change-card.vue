<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <div class="bank" v-for="item in bankList" :key="item.id">
                <img class="icon" :src="item.bankIcon"/>
                <div class="name">{{item.bankName}}</div>
                <div class="type">{{item.payType | bankType}}</div>
                <div class="card">{{item.cardNo | cardNo}}</div>
                <div class="op" @click="edit(item)">{{item.mark ? '还款卡' : '管理'}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { resetHeader } from 'components/header/resetHeader'
import { getUserBankList } from 'store/modules/rrh' 
import { tailNum } from 'src/libs/util'
import {
    getRepayWithholdBank,
    reapyChangeBank,
    queryRepayChangeBank,
    isNeedSign,
    sign
} from 'store/modules/rrh'
export default {
    name: 'changeCard',
    data() {
        return {
            loanId: this.$route.query.loanId,
            oidBiz: this.$route.query.oidBiz,
            from: this.$route.query.from,
            bankList: [],
            mainBank: null,
            barConfig: {
                action: 'addBank', // 右侧按钮点击事件， 必须是window变量
                h5: {
                    icon: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201907/15160923391.png'
                },
                app: {
                    rightBtnShow: true,
                    leftbuttonAction: '',
                    rightBtn: 'custom', // 右侧按钮close share custom
                    rightBtnInfo: { // 当导航栏右按钮为custom按钮时的按钮信息
                        showType: 'IMAGE', // TEXT:文字 IMAGE:图片
                        imageUrl: 'https://aicaistatic.oss-cn-hangzhou.aliyuncs.com/s/img/201907/15160923391.png'
                    }
                }
            }
        }
    },
    beforeRouteEnter(to, from, next) {
        if (!to.query.oidBiz || !to.query.loanId) {
            next({
                name: to.query.from || from.name || 'rrhBill'
            })
        } else {
            next()
        }
    },
    filters: {
        bankType(value = '') {
            return value === '2' ? '储蓄卡' : '信用卡'
        },
        cardNo(value) {
            let len = value.length
            let arr = []
            if (len) {
                for (let i = 1; i <= 12; i++) {
                    arr.push('*')
                    if (i % 4 === 0) {
                        arr.push(' ')
                    }
                }
                return arr.join('') + ' ' + value.substring(len - 4)
            } else {
                return value
            }
        }
    },
    created() {
        this.getBankList()
    },
    mounted() {
        window.addBank = () => {
            this.addBank()
        }
    },
    methods: {
        /**
         * 获取银行卡列表
         */
        getBankList() {
            getUserBankList().then(res => {
                if (res.success) {
                    let bankList = (res.result.length && res.result) || []
                    if (bankList.length) {
                        getRepayWithholdBank({
                            loanId: this.loanId
                        }).then(res => {
                            if (res.success) {
                                if (res.result && res.result.bankCardId) {
                                    bankList.forEach((item, index) => {
                                        if (item.id == res.result.bankCardId) {
                                            item.mark = true
                                            this.mainBank = item
                                        }
                                    })
                                    bankList.sort((next, pre) => {
                                        return next.mark ? -1 : 1
                                    })
                                }
                                this.bankList = bankList
                            } else {
                                if (res.code === '1003') {
                                    this.bankList = bankList
                                    let dialog = this.$createDialog({
                                        content: '您当前未绑定代扣银行卡，为保证能正常还款，请添加原代扣银行卡或设置新代扣银行卡',
                                        confirmBtn: {
                                            text: '我知道了'
                                        },
                                        onConfirm: () => {
                                            dialog.hide()
                                        }
                                    }).show()
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
                            }
                        })
                    } else {
                        let dialog = this.$createDialog({
                            content: '您当前未绑定代扣银行卡，为保证能正常还款，请添加原代扣银行卡或设置新代扣银行卡',
                            confirmBtn: {
                                text: '我知道了'
                            },
                            onConfirm: () => {
                                dialog.hide()
                            }
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
        /**
         * 将选中的银行卡设置为代扣银行卡
         */
        edit(obj) {
            if (obj.mark) return
            let actionsheet = this.$createActionSheet({
                data: ['设为默认还款卡'],
                onSelect: (item, index) => {
                    this.jinshangEdit(obj)
                }
            }).show()
        },
        /**
         * 晋商换绑卡
         * @param obj 待更换的银行卡信息
         */
        jinshangEdit(obj) {
            isNeedSign({
                bankCardId: obj.id,
                showLoading: true,
                productType: 'qdh',
                loanId: this.loanId,
                changeFlag: 'Y'
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result.needSign) {
                        result.bankCardId = obj.id
                        result.changeFlag = 'Y'
                        this.commonSign(result)
                    } else {
                        reapyChangeBank({
                            loanId: this.loanId,
                            bankCardId: obj.id
                        }).then(res => {
                            if (res.success && res.result.bindStatus === '1') {
                                this.$_toast('换绑卡成功', () => {
                                    this.$router.back()
                                })
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
        /**
         * 新增银行卡
         */
        addBank() {
            this.$router.push({
                path: '/pages/bankbind/addBankCard'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.bank {
    background: linear-gradient(270deg, #4286FF 0%, #8FB7FF 100%);
    border-radius: px2rem(12);
    width:px2rem(686);
    margin: px2rem(28) auto 0;
    padding: px2rem(30);
    color: #ffffff;
    position: relative;
    .card {
        margin-top: px2rem(39);
        text-align: right;
        font-size: px2rem(38);
        line-height: px2rem(53);
    }
    .name {
        margin: px2rem(5) 0 0 px2rem(100);
        font-size: px2rem(32);
        line-height: px2rem(45);
    }
    .type {
        margin: px2rem(10) 0 0 px2rem(100);
        font-size: px2rem(26);
        line-height: px2rem(37);
    }
    .icon {
        position: absolute;
        width: px2rem(70);
        height: px2rem(70);
        top: px2rem(42);
    }
    .op {
        position: absolute;
        width: px2rem(90);
        height: px2rem(36);
        line-height: px2rem(36);
        border-radius: px2rem(10);
        background:rgba(255,255,255,0.2);
        font-size: px2rem(24);
        text-align: center;
        top: px2rem(45);
        right: px2rem(30);
    }
}
body.aym {
    .bank {
        background: #EF4E48;
    }
}
</style>
