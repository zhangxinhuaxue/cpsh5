import {
    queryChangeBank,
    isNeedSign,
    sign
} from 'store/modules/rrh'
export default {
    methods: {
        /**
         * 换绑卡超时处理
         * @return {[type]} [description]
         */
        changeCardTimeoutHandler() {
            switch (this.oidBiz) {
                case '202061': // 玛瑙湾
                    this.mnwChangeCardTimeoutHandler()
                    break
                default:
                    break
            }
        },
        /**
         * 玛瑙湾换绑卡超时处理
         * @return {[type]} [description]
         */
        mnwChangeCardTimeoutHandler() {
            let des = this.failTo !== 'rrhIndex' ? '请稍候重试' : '请稍候重试或者选择其他产品'
            queryChangeBank({
                outOrderId: this.loanId,
                productType: 'qdh',
                type: '1',
                bankCardId: this.bankCardId,
                loanProvider: this.loanProvider
            }).then(res => {
                if (!res.success) {
                    this.status = 'fail'
                    this.des = '换绑卡未完成，请稍候重试或者选择其他产品'
                    this.nextOp(this.failNextHandler)
                }
                if (res.result.status === '00') {
                    this.successHandler()
                    isNeedSign({
                        bankCardId: this.bankCardId,
                        period: this.period,
                        loanId: this.loanId,
                        showLoading: false
                    }).then(res => {
                        if (res.success) {
                            let result = res.result
                            if (result.needSign) {
                                sign({
                                    loanId: this.loanId,
                                    productType: 'qdh',
                                    showLoading: false,
                                    bankCardId: this.bankCardId,
                                    returnUrl: window.location.origin + '/pages/loan/transition?mark=1'
                                }).then(res => {
                                    if (res.success) {
                                        let result = res.result
                                        if (result.url) {
                                            window.sessionStorage.setItem('userOpInfo', JSON.stringify({
                                                loanId: this.loanId,
                                                oidBiz: this.oidBiz,
                                                type: 'sign',
                                                productType: 'qdh',
                                                succTo: this.succTo,
                                                failTo: this.failTo
                                            }))
                                            window.location.href = result.url
                                        } else {
                                            this.nextOp(this.failNextHandler)
                                        }
                                    } else {
                                        this.nextOp(this.failNextHandler)
                                    }
                                })
                            } else {
                                if (this.succTo === 'rrhBill' && !this.mark) {
                                    this.$router.back()
                                } else if(this.succTo==='password') {
                                    this.toPassword()
                                } else {
                                    this.$router.replace({
                                        name: this.succTo,
                                        query: {
                                            loanId: this.loanId,
                                            oidBiz: this.oidBiz,
                                            mark: this.mark
                                        }
                                    })
                                }
                            }
                        } else {
                            this.nextOp(this.failNextHandler)
                        }
                    })
                } else if (res.result.statue === '03') {
                    this.status = 'timeout'
                    this.des = `换绑卡处理中，${des}`
                    this.nextOp(this.failNextHandler)
                } else {
                    this.status = 'fail'
                    this.des = `换绑卡失败，${des}`
                    this.nextOp(this.failNextHandler)
                }
            })
        }
    }
}
