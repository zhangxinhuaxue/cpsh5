/*
 * created by yangjun in May 19, 2017
 * edit by daly in April 25, 2019
 */
/**
 * appim： 调用app原生客服
 * h5im：纯h5im
 * @type {String}
 */
import { AXD , appDownloadUrl} from './util'
import { getImInfo } from 'src/store/modules/help' 

// 核心模块
let core = {
    loadSdk(ji, a, x, i, n, c) {
        ji[n] =
            ji[n] ||
            function() {
                ;(ji[n].n = ji[n].n || []).push(arguments)
            }
        var j = a.createElement(x)
        var s = a.getElementsByTagName(x)[0]
        j.async = true
        if (typeof c === 'function') {
            if (typeof document.attachEvent !== 'object') {
                j.onload = function() {
                    c()
                }
            } else {
                j.onreadystatechange = function() {
                    var r = j.readyState
                    if (r === 'loaded' || r === 'complete') {
                        j.onreadystatechange = null
                        c()
                    }
                }
            }
        }
        j.charset = 'UTF-8'
        j.src = i + '?v=' + new Date().getUTCDate() + '&id=cmm5atznmxduaw&appName=aym936&appChannel=20001'
        s.parentNode.insertBefore(j, s)
    }
}

export const loadInit = (ji, a, x, i, n, c) => {
    core.loadSdk(ji, a, x, i, n, c)
    window._JIAXIN()
}

export const openIm = params => {
    let isApp = AXD.util.isapp()
    if (isApp) {
        axdApp.send({
            module: 'tools',
            method: 'customerService',
            params: {
                refMerchantId: params.merchantId,
                platform: 'aicai', // 是否需要先登录再跳转
                productId: params.productId
            },
            callback: function(data) {
                // 头部bar 关闭后，右边有close按钮，这里需要关闭close按钮
            }
        })
    } else {
        // jiaxinTogglerDiv()
        window.location.href = appDownloadUrl
    }
}

export const newSobotIm = cb => {
    var sobotUrl = 'https://ykf-webchat.7moor.com/wapchat.html?accessId=7e16be20-8ba0-11eb-8300-7de68b1be0e5&fromUrl=https://m.zhaojiling.com/pages/help/contact&urlTitle=召集令&language=ZHCN'

    getImInfo().then(
        res => {
            if (res.success) {
                const { partnerId, nickname } = res.result
                const customField = encodeURIComponent(`{"昵称":"${nickname}","外部ID":"${partnerId}"}`)
                sobotUrl += `&clientId=${partnerId}&otherParams={"nickName":"${nickname+'-'+partnerId}"}&customField=${customField}`
            }
            cb(sobotUrl)
        },
        () => cb(sobotUrl)
    )
}
