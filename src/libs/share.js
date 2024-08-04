/* location */
import { wxSign, getShareChannel } from '../store/api'
import { AXD } from './util'
import WX from 'weixin-js-sdk'
import hub from 'assets/js/hub'
const initShare = (data) => {
    let debugMode = false
    // appid 根据是否是线上环境更改，线上appId:测试环境appId 阿里云1wx88e96a742e71daef
    // let appId = (window.location.host.indexOf('m.aiyoumi.com') > -1) ? 'wx8f80f16be5b594a3' : data.appid
    let appId = data.appid

    WX.config({
        debug: debugMode,
        appId: appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
            // 所有要调用的 API 都要加到这个列表中
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideAllNonBaseMenuItem',
            'showMenuItems'
        ]
    })
    var imgUrl = 'http://img.aiyoumi.com/null/201601220/205329861/20161220205329.png'
    var shareConf = Object.assign(
        {
            title: '招集令－深受欢迎的年轻人信用分期平台',
            info: '年轻人分期购物首选网站、专门服务年轻人的分期消费品牌',
            url: window.location.href,
            img: imgUrl
        },
        window.AXDShareConfig
    )

    WX.ready(function() {
        // 分享到朋友圈
        WX.onMenuShareTimeline({
            title: shareConf.title, // 分享标题
            link: shareConf.url, // 分享链接
            imgUrl: shareConf.img, // 分享图标
            success() {},
            cancel() {
                // 用户取消分享后执行的回调函数
            },
            fail(res) {}
        })

        // 发送给好友
        WX.onMenuShareAppMessage({
            title: shareConf.title, // 分享标题
            desc: shareConf.info, // 分享描述
            link: shareConf.url, // 分享链接
            imgUrl: shareConf.img, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success() {},
            cancel() {
                // 用户取消分享后执行的回调函数
            },
            fail(res) {}
        })

        WX.onMenuShareQQ({
            title: shareConf.title, // 分享标题
            desc: shareConf.info, // 分享描述
            link: shareConf.url, // 分享链接
            imgUrl: shareConf.img, // 分享图标
            success() {
                // 用户确认分享后执行的回调函数
            },
            cancel() {
                // 用户取消分享后执行的回调函数
            }
        })
        if (window.onlyShowWxShare) {
            WX.hideAllNonBaseMenuItem({
                success: () => {
                    // alert('已隐藏所有非基本菜单项')
                },
                fail: (res) => {
                    // alert('hide, ' + JSON.stringify(res));
                }
            })
            WX.showMenuItems({
                menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'],
                success: (res) => {
                    // alert('已显示');
                },
                fail: (res) => {
                    // alert('show ' + JSON.stringify(res));
                }
            })
        }
    })

    WX.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        if (window.alog && window.alog.behavior) {
            window.alog.behavior('wx-error: ' + JSON.stringify(res) + JSON.stringify(data))
        }
        window.Sentry && window.Sentry.captureErr({ type: 'BIZ', title: '微信分享验证失败', res })
    })
}

/**
 * 微信分享初始化配置, 在页面中设置window.AXDShareConfig = {title:'',info:'', img: ''}
 * 再调用函数$.AXD.util.weixinShareConf()初始化即可
 */
export const weixinShareConf = () => {
    wxSign(
        {
            ticket: 'jsapi_ticket',
            url: encodeURIComponent(encodeURIComponent(location.href.split('#')[0]))
        },
        (data) => {
            if (data.success) {
                initShare(data.result)

                // 此处使用了非父子组件之间的传值，用以标记微信签名已拿到
                hub.$emit('wxSignReady')
            } else {
                // 微信签名失败
                hub.$emit('wxSignFail')
            }
        }
    )
}

export const getShareList = (data) => {
    return new Promise((resolve, reject) => {
        getShareChannel(data).then((res) => {
            // resolve(res)
            if (res && res.success && res.result && res.result.channels) {
                resolve(res.result.channels)
            } else {
                resolve([])
            }
        })
    })
}

const sharePair = {
    ShareT_SinaWeibo: 'shareSinaWeibo',
    ShareT_QZone: 'shareQZone',
    ShareT_QQ: 'shareQQ',
    ShareT_WxSession: 'shareWxSession',
    ShareT_WxTimeline: 'shareWxTimeline',
    ShareT_SMS: 'shareSMS'
}
// 分享
export const appShare = (notToH5, toCallback) => {
    let imgUrl = 'http://img.aiyoumi.com/null/201601220/205329861/20161220205329.png'
    let shareConf = Object.assign(
        {
            title: '招集令－深受欢迎的年轻人信用分期平台',
            info: '年轻人分期购物首选网站、专门服务年轻人的分期消费品牌',
            url: window.location.href,
            img: imgUrl,
            channel: []
        },
        window.AXDShareConfig
    )

    let img = shareConf.img
    let url = shareConf.url

    // 替换成h5的页面,当传参数为n时不进行url替换
    if (!(notToH5 && notToH5 === 'n')) {
        url = url.replace('://app', '://m')
    }

    // 去除用户信息
    url = url.replace(/([\&|\?])(\uid=\w+\&sign=\w+)/, '')
    AXD.util.shortUrl(url, '', (result) => {
        shareConf.url = result
        getShareList({ url }).then((res) => {
            let channels = res
            let method = 'share'
            if (channels.length === 1 && channels[0] !== 'ShareT_QRCode') {
                let channel = channels[0]
                method = sharePair[channel]
            } else if (channels.length > 0) {
                shareConf.channel = res
                method = 'shareWithChannels'
            }
            axdApp.send({
                module: 'tools',
                method: method, // shareQQ ,share
                params: shareConf,
                repeat: true,
                callback: function(ret) {
                    if (toCallback && typeof toCallback === 'function') {
                        toCallback(ret)
                    } else {
                        if (ret.data.result === 'true') {
                            if (ret.data.shareChannel !== 'ShareT_QRCode') {
                                this.$_toast('分享成功')
                            }
                        } else if (ret.data.result === 'false') {
                            this.$_toast('分享失败')
                        } else {
                            this.$_toast('已取消分享')
                        }
                    }
                }
            })
        })
    })
}
