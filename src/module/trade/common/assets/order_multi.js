import {
    getPayParameterByGid,
    gatValidinfos
} from 'src/store/modules/trade/confirm'

import axdAlert from 'components/alert/index'
import {
    isPU
} from 'src/libs/util'
// AXD16154 话费充值失败不跳转
// orderSource 表示来源
let orderSource = ''

export function goBasicAuthV3(gId, tId) {
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
                let jumpUrl = isPU() ? '/pages/auth/chsi?notifyUrl=' : '/pages/auth/index?notifyUrl='
                window.location.href = jumpUrl + notifyUrl
            }
        }
    })
}
// 获取授信方式
export function getAuthInfoV3() {
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
export function goBiopsyBankcardV3(params, gid, tid) {
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
export function getPaymentParamsV3(gid, tid) {

    const _backUrl = this.$route.query.backUrl || `${location.origin}/pages/order/goods`
    const _quitUrl = `${location.origin}/pages/trade/pay-error?backUrl=${encodeURIComponent(_backUrl)}`
    const _returnUrl = `${location.origin}/pages/trade/payResult/${tid}?gid=${gid}`

    const {quitUrl=_quitUrl, returnUrl= _returnUrl} = this.$route.query

    // return
    return new Promise((resolve, reject) => {
        getPayParameterByGid({
            gid,
            quitUrl,
            returnUrl
        }).then(({ success, result, code, resultDes }) => {
            if (success) {
                // 唤起收银台
                resolve({
                    accessToken: result.accessToken,
                    payInfo: result.parameters
                })
                return
            }
            // 获取收银台参数返回false
            if (code === '1006') {
                // 认证
                goBasicAuthV3.call(this, gid, tid)
                return
            }
            resultDes && this.$_toast(resultDes)
        })
    })
}

// 唤起收银台
export function openPaymentV3(params) {
    return new Promise((resolve, reject) => {
        // if (this.isApp) {
        //     axdApp.send({
        //         module: 'payment',
        //         method: 'pay',
        //         params,
        //         callback: (res) => {
        //             resolve(res)
        //         }
        //     })
        // } else {
        // 暂时只支持H5支付宝
        let locationFunc = this.resetHref
        if(this.$route.name === 'virtualConfirm'){
            // 虚拟确认订单页replace => 历史通过vuex传值，后退参数丢失报系统错误
            locationFunc = this.resetReplace
        }
        locationFunc(aixuedai.webCashUrl + '/h5cashier/index?payInfo=' + encodeURIComponent(params.payInfo))
    })
}
// app收银台结果处理
export function paymentResultV3(res, gid, tid) {
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
        // TO DO 非本项目页面，后端判断中转地址
        window.location.href = '/mall/payment/aicai/jump.html?tradeid=' + tid + '&gid=' + gid
        return
    }
    if (data.errorCode === 9512001) {
        // 用户未实名
        goBasicAuthV3.call(this, gid, tid)
        return
    }
    if (data.errorCode === 9512126) {
        // 用户未刷脸绑卡
        this.$_toast({
            txt: data.errorInfo,
            callback: () => {
                getAuthInfoV3.call(this)
                    .then(params => {
                        return goBiopsyBankcardV3.call(this, params, gid, tid)
                    })
            }
        })
        return
    }
    // 新增支付失败页面
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

export var payMixinMulti = {
    methods: {
        createOrder(params, callback) {
            this.comfirmFunction({ params: JSON.stringify(params) }).then((res) => {
                if (res.success) {
                    let tradeid = res.result.tradeIdList && res.result.tradeIdList[0]
                    let gid = res.result.tradeGroupId
                    // 获取收银台参数
                    getPaymentParamsV3.call(this, gid, tradeid)
                        .then(res => {
                            // 唤起收银台
                            return openPaymentV3.call(this, res)
                        }).then(res => {
                            // 支付结果处理,  加上callback 支付结果自行处理
                            callback ? callback(res, gid, tradeid) : paymentResultV3.call(this, res, gid, tradeid)
                        })
                } else {
                    if (res.code === '1012') {
                        this.$_toast(res.resultDes)
                        return
                    }
                    if (res.code === '1000') {
                        this.dialogInfo = {
                            title: '',
                            content: '结算订单中存在无货商品',
                            btn: '回购物车',
                            singleBtn: true
                        }
                        this.showAlert = true
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
