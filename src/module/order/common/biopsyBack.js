import {
    gatValidinfos
} from 'store/modules/trade/confirm'

export function goBiopsyBankcard(tId, gId) {
    gatValidinfos().then(params => {
        if (params.success && params.result.needCreditValid) {
            axdApp.send({
                module: 'credit',
                method: 'livenessCheck',
                params: {
                    source: 'huotiPost',
                    recordSound: false
                },
                callback: (res) => {
                    if (!res.data.actionFailed && res.data.result.result.data.biopsyStatus == 'success') {
                        this.payOrder(tId, gId)
                    } else if (res.code != -995) {
                        this.$router.push({
                            name: 'biopsyBankcard',
                            query: {
                                tradeId: tId,
                                gId,
                                canApplyBank: params.result.canApplyBank
                            }
                        })
                    }
                }
            })
        } else {
            this.$_toast(params.resultDes)
        }
    })
}
