import {
    querySign
} from 'store/modules/rrh'
export default {
    methods: {
        /**
         * 签约超时处理
         * @return {[type]} [description]
         */
        signTimeoutHandler() {
            let des = this.failTo !== 'rrhIndex' ? '请稍候重试' : '请稍候重试或者选择其他产品'
            querySign({
                loanId: this.loanId,
                showLoading: false,
                bankCardId: this.bankCardId,
                period: this.period,
                changeFlag: this.changeFlag
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result.status === '03') {
                        this.status = 'timeout'
                        this.des = `签约处理中，${des}`
                        this.nextOp(this.failNextHandler)
                    } else if (result.status === '99') {
                        this.status = 'fail'
                        this.des = `签约失败，${des}`
                        this.nextOp(this.failNextHandler)
                    } else if (result.status === '00') {
                        this.successHandler()
                        this.nextOp(() => {
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
                        })
                    }
                } else {
                    this.status = 'fail'
                    this.des = `签约失败，${des}`
                    this.nextOp(this.failNextHandler)
                }
            }).catch(err => {
                this.nextOp(this.failNextHandler)
            })
        }
    }
}
