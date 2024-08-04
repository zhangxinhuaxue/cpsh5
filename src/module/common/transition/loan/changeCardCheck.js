import {
    queryChangeBank,
    isNeedSign,
    sign
} from 'store/modules/rrh'
export default {
    methods: {
        /**
         * 换卡成功检查
         * @return {[type]} [description]
         */
        changeCardCheck() {
            this.interval = setInterval(() => {
                queryChangeBank({
                    outOrderId: this.loanId,
                    productType: 'qdh',
                    type: '1',
                    bankCardId: this.bankCardId,
                    loanProvider: this.loanProvider
                }).then(res => {
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
                    }
                })
            }, this.polling)
        }
    }
}
