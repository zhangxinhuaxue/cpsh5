/**
 *   Created by limeng on 04/02/18
 *   在浏览器下打开活动页面的时候，尝试唤醒招集令App，在App中打开当前页面
 *   H5，非微信并且非QQ浏览器情况下，尝试在app中打开当前的页面
 **/
import { AXD } from './util'

(function() {
    if (!AXD.util.isapp() && !AXD.util.isWeixin() && !AXD.util.isQQBrowser()) {
        let iframe = document.createElement('iframe')
        let h5Url = window.location.href 
        // let openUrl = encodeURIComponent(h5Url.replace(h5WebUrl, appUrl)) + '&needlogin=false'
        let openUrl = 'zjl://go?url=' + encodeURIComponent(h5Url) + '&needlogin=false'

        let ua = navigator.userAgent.toLowerCase()

        setTimeout(() => {
            if (/android/.test(ua)) {
                _openAppAndroid()
            } else if (/iphone|ipod|ipad/.test(ua)) {
                _openAppiOS()
            }
        }, 1000)

        function _openAppiOS() {
            window.location.href = openUrl
            // axdApp.send({
            //     module: 'navigation',
            //     method: 'goURL',
            //     params: {
            //         url: openUrl,
            //         rootPage: 0
            //     },
            //     callback() {}
            // })
        }

        function _openAppAndroid() {
            let timeout
            let t = 1000
            let hasApp = true
            setTimeout(() => {
                document.body.removeChild(ifr)
                return hasApp
            }, 1000)

            let t1 = Date.now()
            let ifr = document.createElement('iframe')
            ifr.setAttribute('src', openUrl)
            ifr.setAttribute('style', 'display:none')
            document.body.appendChild(ifr)
            timeout = setTimeout(() => {
                let t2 = Date.now()
                if (!t1 || t2 - t1 < t + 100) {
                    hasApp = false
                }
            }, t)
        }
    }
})()
