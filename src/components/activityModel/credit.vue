<template>
    <div :class="hashName">
        <div class="creditContain" @click="onBound">
            <axd-image :src="config.bgImg"></axd-image>
        </div>
        <lotteryDialog :dialogObj="dialogObj" v-show="yes" @onClose="onClose"></lotteryDialog>
        <img :src="this.config.successImg" v-show="disnone">
        <img :src="this.config.notAccountImg" v-show="disnone">
        <img :src="this.config.overdueImg" v-show="disnone">
        <img :src="this.config.unsatisfiedImg" v-show="disnone">
    </div>
</template>

<script>
import Vue from 'vue'
import axdImage from 'src/components/image/index.vue'
import { AXD } from 'libs/util'
import lotteryDialog from 'src/components/lottery/dialog.vue'
import axdToast from 'components/toast/index'
import { getCreditInfo, actReceiveCoupon } from 'src/store/modules/activity'
import { accessLog } from 'src/libs/accessLog'
export default {
    name: 'activity_credit',
    props: ['config', 'alias'],
    components: {
        axdImage,
        lotteryDialog
    },
    data() {
        return {
            yes: false,
            disnone: false,
            dialogObj: {
                btn: []
            },
            hashName: '_' + (new Date().getTime().toString())
        }
    },
    created() {
        // this.styleReady()
    },
    methods: {
        getDialogObj(code, money) {
            switch (code) {
                // 提额成功用户
                case '8000':
                    this.dialogObj = {
                        containClass: 'diy',
                        diyImg: this.config.successImg,
                        desc: this.config.successPopText.replace(/%/, ~~(money / 1000)),
                        btn: [{
                            title: this.config.successLeftButtonText || '取消',
                            func: () => {
                                this.yes = false
                            }
                        }, {
                            title: this.config.successRightButtonText || '立即前往',
                            func: () => {
                                accessLog({type: 'logic', name: '8000', desc: this.config.successPopText, extendData: this.config.successJumpUrl + '+' + this.alias})
                                window.location.href = this.config.successJumpUrl
                            }
                        }]
                    }
                    break
                // 非信用账户正常的用户
                case '8003':
                    this.dialogObj = {
                        containClass: 'diy',
                        diyImg: this.config.notAccountImg,
                        desc: this.config.notAccountPopText,
                        btn: [{
                            title: this.config.notAccountLeftButtonText || '取消',
                            func: () => {
                                this.yes = false
                            }
                        }, {
                            title: this.config.notAccountRightButtonText || '立即前往',
                            func: () => {
                                accessLog({type: 'logic', name: '8003', desc: this.config.notAccountPopText, extendData: this.config.notAccountJumpUrl + '+' + this.alias})
                                window.location.href = this.config.notAccountJumpUrl
                            }
                        }]
                    }
                    break
                // 逾期状态中的用户
                case '8004':
                    this.dialogObj = {
                        containClass: 'diy',
                        diyImg: this.config.overdueImg,
                        desc: this.config.overduePopText || '账单逾期',
                        btn: [{
                            title: this.config.overdueLeftButtonText || '取消',
                            func: () => {
                                this.yes = false
                            }
                        }, {
                            title: this.config.overdueRightButtonText || '立即前往',
                            func: () => {
                                accessLog({type: 'logic', name: '8004', desc: this.config.overduePopText, extendData: this.config.overdueJumpUrl + '+' + this.alias})
                                window.location.href = this.config.overdueJumpUrl
                            }
                        }]
                    }
                    break
                // 不在提额用户池的用户
                case '8007':
                    this.dialogObj = {
                        containClass: 'diy',
                        diyImg: this.config.unsatisfiedImg,
                        desc: this.config.unsatisfiedPopText || '不在提额池中的用户',
                        btn: [{
                            title: this.config.unsatisfiedLeftButtonText || '取消',
                            func: () => {
                                this.yes = false
                            }
                        }, {
                            title: this.config.unsatisfiedRightButtonText || '立即前往',
                            func: () => {
                                accessLog({type: 'logic', name: '8007', desc: this.config.unsatisfiedPopText, extendData: this.config.unsatisfiedJumpUrl + '+' + this.alias})
                                window.location.href = this.config.unsatisfiedJumpUrl
                            }
                        }]
                    }
                    break
                case '8002':
                    this.dialogObj = {
                        containClass: 'no-prize',
                        desc: '抱歉～您还没有完成授信，无法提额',
                        btn: [{
                            title: this.config.successLeftButtonText || '取消',
                            func: () => {
                                this.yes = false
                            }
                        }, {
                            title: '立即前往',
                            func: () => {
                                accessLog({type: 'logic', name: '8002', desc: '没有完成授信，无法提额', extendData: 'https://m.zhaojiling.com/pages/credit-system/amount+' + this.alias})
                                // window.location.href = 'https://m.zhaojiling.com/pages/credit-system/amount'
                                // window.location.href = 'http://m.syao1.zhaojiling.com:8000/pages/credit-system/amount'
                                // 去授信
                                window.location.href = '/pages/credit-system/amount'
                            }
                        }]
                    }
                    break
                case '8011':
                case '8005':
                    this.dialogObj = {
                        containClass: 'no-prize',
                        desc: '您已经提额过啦，快去使用额度吧',
                        btn: [{
                            title: '取消',
                            func: () => {
                                this.yes = false
                            }
                        }, {
                            title: '立即前往',
                            func: () => {
                                accessLog({type: 'logic', name: '8005', desc: '您已经提额过啦，快去使用额度吧', extendData: 'https://m.zhaojiling.com/pages/rrh/loan?oidBiz=202260&name=%E4%BA%B2%E5%91%97Q1+' + this.alias})
                                window.location.href = 'https://m.zhaojiling.com/pages/rrh/loan?oidBiz=202260&name=%E4%BA%B2%E5%91%97Q1'
                            }
                        }]
                    }
                    break
                case '8006':
                    this.dialogObj = {
                        containClass: 'no-prize',
                        desc: '服务超时，请重新点击按钮',
                        btn: [{
                            title: '取消',
                            func: () => {
                                this.yes = false
                            }
                        }]
                    }
                    break
            }
            this.yes = true
        },
        goReceiveCoupon(serialNo, couponId){
            actReceiveCoupon({serialNo, couponId}).then((res) => {
                console.log(res)
                if (res.success) {
                    axdToast('优惠劵已成功领取')
                } else {
                    res.resultDes && axdToast(res.resultDes)
                }
            })
        },
        onBound() {
            getCreditInfo({
                alias: this.alias
            }).then((res) => {
                // 根据code码,并且render接口4种情况都有返回红包id，就去走领取红包接口，参数serialNo  couponId
                // success 为true，拿result里面的code，success为false 拿同级code
                if (res.success) {
                    let code = res.result.code
                    this.getDialogObj(code, res.result.amount || 0)

                    if (code === '8000') {
                        this.config.successCouponId && this.goReceiveCoupon(res.result.serialNo, this.config.successCouponId)
                    } else if (code === '8003') {
                        this.config.notAccountCouponId && this.goReceiveCoupon(res.result.serialNo, this.config.notAccountCouponId)
                    } else if (code === '8004') {
                        this.config.overdueCouponId && this.goReceiveCoupon(res.result.serialNo, this.config.overdueCouponId)
                    } else if (code === '8007') {
                        this.config.unsatisfiedCouponId && this.goReceiveCoupon(res.result.serialNo, this.config.unsatisfiedCouponId)
                    }
                } else {
                    if (res.code == '-1999' || res.code == '10010') {
                        AXD.util.smsLogin()
                    } else {
                        res.resultDes && axdToast(res.resultDes)
                    }
                }
            })
        },
        // styleReady() {
        //     let styleElem = document.createElement('style')
        //     let styleArray = [
        //         '.' + this.hashName + ', .' + this.hashName + ' * {margin: 0; padding: 0; list-style: none; }',
        //         '.' + this.hashName + ' .creditContain { width: 100%; height: 100%;'
        //     ]

        //     let node = document.createTextNode(styleArray.join(' '))
        //     styleElem.appendChild(node)
        //     document.getElementsByTagName('head')[0].appendChild(styleElem)
        // },

        // 转盘内size换算
        _px2remAndO2N(oldPx) {
            return (oldPx * 320 / this.newDesignWidth / 20) * (this.config.lotteryWidth / 750) + 'rem'
        },

        // 非转盘内size换算
        _px2rem(px) {
            return (px * 320 / this.newDesignWidth / 20) + 'rem'
        },
        onClose() {
            this.yes = false
        }
    }
}
</script>
