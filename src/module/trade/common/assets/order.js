import {
    getPayParameterByGidV3,
    gatValidinfos
} from 'store/modules/trade/confirm'
import { AXD } from 'src/libs/util'
import axdAlert from 'components/alert/index'

// AXD16154 话费充值失败不跳转
// orderSource 表示来源
let orderSource = ''

export function goBasicAuth(gId, tId) {
    axdAlert({
        title: '实名认证',
        content: '您需要完成实名认证，才可继续支付',
        okText: '去认证',
        onOk: () => {
            if (this.isApp) {
                axdApp.send({
                    module: 'credit',
                    method: 'showCertification',
                    params: {
                        callInfo: '', // 提示信息
                        callCode: 1, // 1：完成后跳转 url（callbackUrl）; 2: 完成后直接返回浏览器视图并且回调JS函数（callbackFunc）
                        callbackUrl: window.location.origin + '/pages/auth/result?type=trade&gid=' + gId + '&tid=' + tId, // 完成后跳转的url
                        callbackFunc: '' // 完成后返回浏览器视图回调的函数名
                    }
                })
            } else {
                let notifyUrl = encodeURIComponent('/pages/auth/result?type=trade&gid=' + gId + '&tid=' + tId)
                window.location.href = '/pages/auth/index?notifyUrl=' + notifyUrl
            }
        }
    })
}
// 获取授信方式
export function getAuthInfo() {
    return new Promise((resolve, reject) => {
        gatValidinfos().then(res => {
            if (res.success && res.result.needCreditValid) {
                resolve(res)
            } else {
                reject()
            }
        })
    })
}
// 授信
export function goBiopsyBankcard(params, gid, tid) {
    axdApp.send({
        module: 'credit',
        method: 'livenessCheck',
        params: {
            source: 'huotiPost',
            recordSound: false
        },
        callback: (res) => {
            if (res.code == -995) {
                window.location.href = '/pages/order/goods'
                return
            }
            if (!res.data.actionFailed && res.data.result.result.data.biopsyStatus == 'success') {
                this.$router.replace({
                    name: 'orderGoods'
                })
            } else {
                this.$router.replace({
                    name: 'biopsyBankcard',
                    query: {
                        tradeId: tid,
                        gid,
                        canApplyBank: params.result.canApplyBank
                    }
                })
            }
        }
    })
}

// 获取收银台参数
export function getPaymentParams(params, tid) {
    return new Promise((resolve, reject) => {
        getPayParameterByGidV3(params).then(res => {
            if (res.success) {
                // 唤起收银台
                resolve({
                    accessToken: res.result.accessToken,
                    payInfo: res.result.parameters
                })
                return
            }
            // 获取收银台参数返回false
            if (res.code === '1006') {
                // 认证
                goBasicAuth.call(this, params.gid, tid)
                return
            }
            this.$_toast(res.resultDes)
        })
    })
}
// 唤起收银台
export function openPayment(params) {
    return new Promise((resolve, reject) => {
        if (this.isApp) {
            axdApp.send({
                module: 'payment',
                method: 'pay',
                params,
                callback: (res) => {
                    resolve(res)
                }
            })
        } else {
            window.location.href = aixuedai.webCashUrl + '/h5cashier/index?payInfo=' + encodeURIComponent(params.payInfo)
        }
    })
}
// app收银台结果处理
export function paymentResult(res, gid, tid) {
    let data = res.data
    if (data.success === 'true') {
        this.$router.replace({
            name: 'payResult',
            params: {
                tradeId: tid
            },
            query: {
                gid
            }
        })
        return
    }
    if (data.errorCode === 9512000) {
        // 带单授信
        window.location.href = '/mall/payment/aicai/jump.html?tradeid=' + tid + '&gid=' + gid
        return
    }
    if (data.errorCode === 9512001) {
        // 用户未实名
        goBasicAuth.call(this, gid, tid)
        return
    }
    if (data.errorCode === 9512126) {
        // 用户未刷脸绑卡
        this.$_toast({
            txt: data.errorInfo,
            callback: () => {
                getAuthInfo.call(this)
                    .then(params => {
                        return goBiopsyBankcard.call(this, params, gid, tid)
                    })
            }
        })
        return
    }
    // 其他情况提示错误信息，跳转失败页面
    this.$_toast({
        txt: data.errorInfo,
        callback: () => {
            this.$router.replace({
                name: 'payResult',
                params: {
                    tradeId: tid
                },
                query: {
                    gid,
                    errorCode: data.errorCode
                }
            })
        }
    })
}

export var payMixin = {
    methods: {
        createOrder(params, from = '') {
            orderSource = from
            this.comfirmFunction(params).then((res) => {
                if (res.success) {
                    let tradeid = res.result.tradeIdList[0]
                    let gid = res.result.tradeGroupId
                    let params = {
                        gid
                    }
                    // 获取收银台参数
                    getPaymentParams.call(this, params, tradeid)
                        .then(res => {
                            // 唤起收银台
                            return openPayment.call(this, res)
                        }).then(res => {
                            // 支付结果处理
                            paymentResult.call(this, res, gid, tradeid)
                        })
                } else {
                    if (res.code === '-1999') {
                        AXD.util.login()
                        return
                    }
                    // 只有在token失效时按钮置灰
                    if (res.code === '-2001') {
                        this.confirmBtn = false
                    }
                    this.$_toast(res.resultDes)
                }
            })
        }
    }
}
