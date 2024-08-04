import axdAlert from 'components/alert/index'
var educationMixin = {
    methods: {
        goBasicAuth(backUrl) {
            console.log('yeps-1')

            axdAlert({
                title: '实名认证',
                content: '此类商品为教育专享优惠商品，您需要先通过认证后才有机会购买',
                okText: '去认证',
                onOk: () => {
                    if (this.isApp) {
                        console.log('app')
                        axdApp.send({
                            module: 'credit',
                            method: 'showCertification',
                            params: {
                                callInfo: '', // 提示信息
                                callCode: 1, // 1：完成后跳转 url（callbackUrl）; 2: 完成后直接返回浏览器视图并且回调JS函数（callbackFunc）
                                callbackUrl: backUrl, // 完成后跳转的url
                                // callbackUrl: window.location.origin + '/pages/mall/product/' + productId, // 完成后跳转的url
                                callbackFunc: '' // 完成后返回浏览器视图回调的函数名
                            }
                        })
                    } else {
                        window.location.href = '/pages/auth/index?notifyUrl=' + backUrl
                        // window.location.href = '/pages/auth/index?notifyUrl=/pages/mall/product/' + productId
                    }
                }
            })
        }
    }
}

export { educationMixin }
