/*
    cbd对接的部分金融产品，在取现下单、账单还款的时候，可能需要去进行支付签约操作， 此时需要引导用户去做相应的操作。

    晋商(202262)
        取现下单： 支付签约

    光大信托(202066)
        取现下单： 支付签约
 */
import {
    isNeedLocalReplenish,
    isNeedSign
} from 'store/modules/rrh'
import { AXD } from 'src/libs/util'
import { isObject } from 'lodash'
function paramsFilter(obj) {
    let params = {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] !== 'function') {
            params[key] = obj[key]
            if (key === 'orderId' && !params.loanId) {
                params.loanId = obj[key]
            }
            if (key === 'loanId' && !params.orderId) {
                params.orderId = obj[key]
            }
        }
    }
    return params
}
export default {
    methods: {
        /**
         * cbd 对接第三方渠道需要进行的签约操作
         * @param {*} obj 签约操作需要的参数:loanId、oidBiz等
         * @param {*} succTo 处理成功以后的跳转页面
         * @param {*} failTo 处理失败以后的跳转页面
         */
        loanProductsHandler(obj, succTo, failTo) {
            let params = paramsFilter(obj)
            params.productType = params.productType || 'qdh'
            isNeedSign(params).then(res => {
                if (obj.closeLoading) {
                    obj.closeLoading()
                }
                if (res.success) {
                    let result = res.result
                    if (result.needSign) {
                        let signInfo = {
                            bankCard: result.bankCard,
                            bankName: result.bankName,
                            name: result.name,
                            bankCardId: params.bankCardId,
                            period: params.period,
                            personCard: result.personCard,
                            telphone: result.telphone,
                            loanId: params.loanId,
                            oidBiz: params.oidBiz,
                            succTo,
                            failTo,
                            during: this.openAccountConfigInfo && this.openAccountConfigInfo[params.oidBiz] && this.openAccountConfigInfo[params.oidBiz]['during'],
                            polling: this.openAccountConfigInfo && this.openAccountConfigInfo[params.oidBiz] && this.openAccountConfigInfo[params.oidBiz]['polling']
                        }
                        window.sessionStorage.setItem('signInfo', JSON.stringify(signInfo))
                        // 签约跳转
                        const route = {
                            name: 'rrhSign',
                            query: {
                                oidBiz: params.oidBiz,
                                succTo,
                                failTo
                            }
                        }
                        if(this.$route.path.indexOf('replenishVerify') > -1) {
                            this.$router.replace(route)
                        } else {
                            this.$router.push(route)
                        }
                    } else {
                        console.log('succCallback')
                        if (obj.succCallback) {
                            obj.succCallback.call(this)
                        }
                    }
                } else {
                    this.$_alert(res.resultDes)
                }
            })
        },
        localReplenish(obj, succTo, failTo){
            isNeedLocalReplenish({
                oidBiz: obj.oidBiz,
                loanId: obj.loanId,
                bankCardId: obj.bankCardId
            }).then(res => {
                if (res.success) {
                    let result = res.result
                    if (result.needAreaMakeUp) {
                        // 跳转区域补录
                        const path = `/pages/rrh/replenishVerify?oidBiz=${obj.oidBiz}&loanId=${obj.loanId}&bankCardId=${obj.bankCardId}`
                        AXD.util.goAreas({
                            backUrl: encodeURIComponent(window.location.origin + path),
                            taskId: res.result.taskId
                        })
                        return false
                    } else {
                        this.loanProductsHandler(obj, succTo, failTo)
                    }
                } else {
                    this.$_alert(res.resultDes).then(res => {
                        this.$router.replace('/pages/rrh/index')
                    })
                }
            })
        }
    }
}
