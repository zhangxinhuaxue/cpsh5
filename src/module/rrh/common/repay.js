export default {
    methods: {
        /**
         * 勾选/取消单笔账单
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
        selectBill(data) {
            for (let item of this.needPayBillList) {
                if (item.id === data.id) {
                    item.checked = !item.checked
                }
            }
            this.calTotal()
        },
        /**
         * 计算勾选账单金额
         * @return {[type]} [description]
         */
        calTotal() {
            let total = 0
            this.totalBills.checkedList = []
            for (let item of this.needPayBillList) {
                if (item.checked) {
                    total += item.money
                    this.totalBills.checkedList.push(item.id)
                }
            }
            this.totalBills.money = total
            this.totalBills.checked = this.totalBills.checkedList.length && this.totalBills.checkedList.length === this.needPayBillList.length
            this.totalBills.btnDisabled = !this.totalBills.checkedList.length
        },
        /**
         * 勾选/不勾选全部账单
         * @return {[type]} [description]
         */
        selectBills(checked) {
            this.needPayBillList.forEach((item, index) => {
                if (!item.mustChecked) {
                    item.checked = checked
                }
            })
            this.calTotal()
        },
        /**
         * 发起部分还款
         * @return {[type]} [description]
         */
        payment(params, func, notCallPay, callback) {
            func &&
                func(params).then((res) => {
                    if (res.success) {
                        if (callback) {
                            callback()
                        }
                        if (!notCallPay) {
                            this.callPayment(res.result.accessToken, res.result.parameters)
                        }
                    } else {
                        if (res.code === '6153') {
                            let dialog = this.$createDialog({
                                type: 'confirm',
                                title: '',
                                content: res.resultDes || '您的还款已提交，银行处理中，是否要进行再次还款？',
                                confirmBtn: {
                                    text: '再次还款'
                                },
                                onConfirm: () => {
                                    dialog.hide()
                                    this.paymentAgain(params, func)
                                },
                                onCancel: () => {
                                    dialog.hide()
                                }
                            }).show()
                        } else {
                            this.$_alert(res.resultDes)
                        }
                    }
                })
        },
        /**
         * 再次发起部分还款
         * @return {[type]} [description]
         */
        paymentAgain(params, func) {
            func(params).then((res) => {
                if (res.success) {
                    this.callPayment(res.result.accessToken, res.result.parameters)
                } else {
                    this.$_alert(res.resultDes)
                }
            })
        },
        /**
         * 唤起收银台
         * @param  {[type]} token [description]
         * @param  {[type]} pms   [description]
         * @return {[type]}       [description]
         */
        callPayment(token, pms) {
            // H5收银台
            let h5cashierUrl = aixuedai.webCashUrl + '/h5cashier/repay?payInfo=' + encodeURIComponent(pms)
            this.log({ type: 'button-logic-link', name: 'repay-cash-h5', desc: '还款调用h5收银台', extendData: h5cashierUrl })
            this.resetHref(h5cashierUrl)
        }
    }
}
