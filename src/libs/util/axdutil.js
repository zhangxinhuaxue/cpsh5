import { getShortUrl, getLocationFomApp, aymZjlLogin } from 'store/api'
import { isApp, isMjb, isAym, isZjl } from './env'
import { permissionCheckSupport } from './support'
import { getCookie } from './util'
import { authOrigin, loginOrigin, h5Origin } from '../domain'
import { appDownloadUrl, resetReplace } from './url'
import { _getPromise } from 'store/base'
import { Toast } from '@fe/buss-ui'
import { accessLog } from 'src/libs/accessLog'

// Unexcepted token = 
// 确信使用该包的话，需要将其包含进babel编译中！！否则低版本浏览器会报错
// import CryptoJS from 'crypto-js' 

let AXD = AXD || {}

/**
 * AXD 工具
 * @type {Object}
 */

AXD.util = {
    // app,h5 环境判断
    isapp() {
        return isApp
    },
    // 判断是ios设备
    isiOS() {
        let ua = navigator.userAgent.toLowerCase()
        return !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i)
    },
    // 判断是android设备
    isAndroid() {
        var u = navigator.userAgent
        return !!(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1)
    },
    /**
     * 刷新当前页面
     * @return {[type]} [description]
     */
    reload() {
        setTimeout(function() {
            axdApp.send({
                module: 'webview',
                method: 'refresh',
                params: {
                    joinLoginInfo: false
                }
            })
        }, 300)
    },
    /**
     * 在一个新的浏览器窗口打开URL
     * @param  {[type]} param [description]
     */
    goURL(param) {
        let that = this
        axdApp.send({
            module: 'navigation',
            method: 'goURL',
            params: param,
            callback: function(ret) {}
        })
    },
    /**
     * 前端兼容http(s)形式url'//'在APP和后端不识别，需处理
     */
    autoProtocol(url) {
        return url.replace(/^\/\//, window.location.protocol + '//')
    },
    /** 判断是否登录
     * @autoLogin: 如果没有登录，是否进行登录，默认为true
     * 使用方法： AXD.util.isLogin(false).then(() => {
     *    // 已登录的逻辑
     *  })
     */
    isLogin(autoLogin = true, param) {
        let that = this
        return new Promise(function(resolve, reject) {
            if (isApp) {
                axdApp.send({
                    module: 'user',
                    method: 'isLogin',
                    callback: function(ret) {
                        if (ret.data && ret.data.result == 'true') {
                            resolve()
                        } else {
                            if (autoLogin === true) {
                                that.login(param)
                            } else {
                                reject && reject()
                            }
                        }
                    }
                })
            } else {
                if (window.aixuedai.userId && window.aixuedai.userId != 'null') {
                    resolve()
                } else {
                    if (autoLogin === true) {
                        if (!(param && param.isRent)) {
                            // 非租赁登录
                            that.login(param)
                        }
                    } else {
                        reject && reject()
                    }
                }
            }
        })
    },

    /**
     * 登陆
     * @return {[type]} [description]
     */
    login(param) {
        let that = this
        let method = 'reLogin'
        if (param !== undefined && typeof param !== 'object' && param instanceof Array) {
            console.log('param should be object')
        }
        if (isApp) {
            if (isAym) {
                aymZjlLogin().then((res) => { 
                    if (res.success) {
                        window.location.reload()
                    } else {
                        Toast.show(res.resultDes)
                    }
                })
                return
            }
            if (param && param.hasOwnProperty('isCustomLogin') && 'isCustomLogin' in param) {
                param = null
            }
            accessLog({ type: 'button-link', name: 'login', desc: 'app登陆' })
            axdApp.send({
                repeat: true,
                module: 'user',
                method,
                params: {
                    type: 0
                },
                callback: function(ret) {
                    if (ret.data && ret.data.result == 'true') {
                        if (param) {
                            if (param.isRent) {
                                // 租赁登录 或定义了自定义登录
                                that.reload()
                            } else {
                                // 非租赁登录
                                that.goURL(param)
                            }
                        } else {
                            that.reload()
                        }
                    } else {
                        axdApp.send({
                            module: 'webview',
                            method: 'close'
                        })
                    }
                }
            })
        } else {
            // 自定义h5登录
            if (param && param.isCustomLogin) {
                param.customLogin && param.customLogin()
                return
            }
            // 没有登陆
            // let url = window.location.pathname + window.location.search
            let url = window.location.href

            if (param && param.url) {
                url = param.url
            }
            // 调用统一登录逻辑
            if (getCookie('oauth2_identify') || window.location.search.indexOf('_auth_') !== -1) {
                let authPara = AXD.util.getUrlParam('_auth_') || ''
                window.location.replace('/third/auth/callback?callback=' + encodeURIComponent(url) + '&_auth_=' + authPara)
                return
            }
            if (url.indexOf('http') < 0) {
                url = `${location.protocol}//${location.host + url}`
            }
            // window.location.href = '/pages/user/login?url=' + encodeURIComponent(url)
            accessLog({ type: 'button-link', name: 'login', desc: '普通h5登陆' })
            window.location.href = loginOrigin + '/views/login/index?cbUrl=' + encodeURIComponent(url)
        }
    },
    /**
     * 结清证明登陆
     * @return {[type]} [description]
     */
    clearProofLogin() {
        let that = this
        let method = 'reLogin'
        if (isZjl || isMjb) {
            axdApp.send({
                repeat: true,
                module: 'user',
                method,
                params: {
                    type: 0
                },
                callback: function(ret) {
                    if (ret.data && ret.data.result == 'true') {
                        that.reload()
                    }
                }
            })
        } else {
            // 没有登陆
            let url = window.location.href
            window.location.href = loginOrigin + '/views/login/index?cbUrl=' + encodeURIComponent(url)
        }
    },
    zjlLogin(param) {
        if (isApp) {
            _getPromise(zjlLogin).then((res) => {
                if (res.success) {
                    window.location.reload()
                } else {
                    Toast.show(res.resultDes)
                }
            })
        } else {
            let url = window.location.href
            window.location.href = loginOrigin + '/views/login/smsLogin?cbUrl=' + encodeURIComponent(url)
        }
    },
    /**
     * 快速登陆
     */
    smsLogin(param) {
        let that = this
        let method = 'reLogin'

        if (isApp) {
            axdApp.send({
                repeat: true,
                module: 'user',
                method,
                params: {
                    type: 1
                },
                callback: function(ret) {
                    if (ret.data && ret.data.result == 'true') {
                        if (param) {
                            that.goURL(param)
                        } else {
                            that.reload()
                        }
                    }
                }
            })
        } else {
            // 自定义h5登录
            if (param && param.isCustomLogin) {
                param.customLogin && param.customLogin()
                return
            }

            let url = window.location.href
            if (param && param.url) {
                url = param.url.indexOf('http') > -1 ? param.url : h5Origin + param.url
            }
            window.location.href = loginOrigin + '/views/login/smsLogin?cbUrl=' + encodeURIComponent(url)
        }
    },
    /**
     * 去授信
     */
    goCredit(params, replace = false) {
        let url = `${h5Origin}/pages/credit-system/amount`
        goAuthCredit(url, params, replace)
    },
    /**
     * 去授信提额
     */
    goCreditBasic(params, replace = false) {
        let url = `${h5Origin}/pages/credit-system/basic/aiyoumi`
        goAuthCredit(url, params, replace)
    },
    /**
     * 去组合认证
     */
    goAuthGroup(params, replace = false) {
        let url = `${authOrigin}/views/group`
        goAuthCredit(url, params, replace)
    },
    /**
     * 去单项认证
     */
    goAuth(params, replace = false) {
        let url = `${authOrigin}/views/entry`
        goAuthCredit(url, params, replace)
    },
    /**
     * 取现补充联系人
     */
    goContacts(params, replace = false) {
        let url = `${authOrigin}/views/contacts`
        goAuthCredit(url, params, replace)
    },
    /**
     * 取现补充区域信息
     */
    goAreas(params, replace = false) {
        let url = `${authOrigin}/views/areaCollection`
        goAuthCredit(url, params, replace)
    },
    /**
     * 学历信息认证
     */
    goEducation(params, replace = true) {
        let url = `${authOrigin}/views/eduenter`
        goAuthCredit(url, params, replace)
    },
    /**
     * 完善信息认证
     */
    addBasicInfo(callbackFuncName, url) {
        if (isApp) {
            let callbackUrl = url || window.location.href
            let params = {
                callInfo: ''
            }

            if (callbackFuncName) {
                params.callCode = 2
                params.callbackFunc = callbackFuncName
            } else {
                params.callCode = 1
                params.callbackUrl = callbackUrl
            }

            axdApp.send({
                module: 'credit',
                method: 'showCertification',
                params: params
            })
        } else {
            let url = window.location.pathname + window.location.search

            window.location.href = '/pages/auth/index?auth=true&notifyUrl=' + encodeURIComponent(url)
        }
    },
    /**
     *是否需要刷新
     */
    isRefresh(boolean) {
        if (isApp) {
            axdApp.send({
                module: 'webview',
                method: 'setNativeRefreshEnable',
                params: {
                    enable: boolean || false
                },
                callback: function(data) {}
            })
        }
    },

    isWeixin() {
        let ua = navigator.userAgent.toLowerCase()

        if (/MicroMessenger/i.test(ua)) {
            return true
        } else {
            return false
        }
    },

    isQQBrowser() {
        let ua = navigator.userAgent.toLowerCase()

        if (/QQBrowser/i.test(ua)) {
            return true
        } else {
            return false
        }
    },

    isSafari() {
        let ua = navigator.userAgent.toLowerCase()

        return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0
    },

    //  校验Email的合法性
    isEmail(chars) {
        let re = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
        if (!re.test(chars)) {
            return false
        } else {
            return true
        }
    },
    // QQ验证
    isQQ(chars) {
        let re = /^\d{5,}$/
        if (!re.test(chars)) {
            return false
        } else {
            return true
        }
    },
    // 短信验证码验证
    isMessageCode(chars) {
        let re = /^\d{6}$/
        if (!re.test(chars)) {
            return false
        } else {
            return true
        }
    },
    // 校验身份证的合法性
    isCERT(chars) {
        let re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (chars.match(re) === null) {
            return false
        } else {
            return true
        }
    },
    // isPhoneNumber
    isPhoneNumber(chars) {
        // let re = /^(0|86|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        let re = /^1[0-9]{10}$/
        if (!re.test(chars)) {
            return false
        } else {
            return true
        }
    },
    // 银行卡验证
    isCardNum(chars) {
        let re = /^\d{16}|\d{19}$/
        if (!re.test(chars)) {
            return false
        } else {
            return true
        }
    },
    /**
     * 获取短网址
     * @param  {[type]} url  网址
     * @param  {[type]} type 微信或者新浪（WEIXIN||XINLANG）
     * @return {[type]}      短网址
     */
    shortUrl(url, type, callback) {
        let result = url

        if (AXD.util.isWeixin()) {
            type = 'WEIXIN'
        } else {
            type = 'XINLANG'
        }

        getShortUrl(
            {
                url: url,
                type: type || ''
            },
            (data) => {
                data = data.ret || data
                if (data.success) {
                    result = data.result || url
                    callback && callback(result)
                } else {
                    console.log('getShortUrl fail')
                }
            }
        )
    },

    // html encode
    htmlEncode(str) {
        let s = str

        if (str.length === 0) {
            return ''
        }

        // s = str.replace(/&/g, '&gt;')
        s = s.replace(/</g, '&lt;')
        s = s.replace(/>/g, '&gt;')
        s = s.replace(/ /g, '&nbsp;')
        s = s.replace(/\'/g, '&#39;')
        s = s.replace(/\'/g, '&quot;')
        s = s.replace(/\n/g, '<br>')

        return s
    },
    htmlDecode(str) {
        let s = str

        if (str.length === 0) {
            return ''
        }

        // s = str.replace(/&gt;/g, '&')
        s = s.replace(/&lt;/g, '<')
        s = s.replace(/&gt;/g, '>')
        s = s.replace(/&nbsp;/g, ' ')
        s = s.replace(/&#39;/g, '\'')
        s = s.replace(/&quot;/g, '\'')

        // s = s.replace(/<br>/g, '\n')

        return s
    },
    // 获取参数值
    getUrlParam(paramName) {
        var reg = new RegExp('(^|&)' + paramName + '=([^&]*)(&|$)')
        var r = window.location.search
            .substr(1)
            .replace('%20', '')
            .match(reg)
        if (r != null) {
            return unescape(r[2])
        }
        return null
    },
    // 获取userId
    getUserId() {
        var userId = ''
        if (isApp) {
            var matchRes = navigator.userAgent.match(/"uid":"(\d+)"/)
            userId = matchRes && matchRes[1]
        } else {
            userId = window.aixuedai.userId
        }
        return userId
    },
    // url违规
    urlIllegal(url) {
        return !url || (url.indexOf('http') == 0 && decodeURIComponent(url).indexOf(window.location.origin) != 0)
    },
    // 处理后台返回的number类型；其number类型在h5下会自动转换成string
    stringToNumber(string) {
        if (typeof string === 'string') {
            return Number(string)
        } else if (typeof string === 'number') {
            return string
        } else {
            return 0
        }
    },
    // 下载地址
    goAppDownload() {
        window.location.href = appDownloadUrl
    },
    // encryptLocation(text) {
    //     const key = CryptoJS.enc.Utf8.parse('iadeuxiaqianzhilonglongzhiqianaixuedai')
    //     const iv = CryptoJS.enc.Utf8.parse('katelinn')
    //     //把需要解密的数据从16进制字符串转换成字符byte数组
    //     var encrypted = CryptoJS.TripleDES.encrypt(text, key, {
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.Pkcs7,
    //         iv
    //     })
    //     return encrypted.toString()
    // },
    // decryptLocation(ciphertext) {
    //     const key = CryptoJS.enc.Utf8.parse('iadeuxiaqianzhilonglongzhiqianaixuedai')
    //     const iv = CryptoJS.enc.Utf8.parse('katelinn')
    //     //把需要解密的数据从16进制字符串转换成字符byte数组
    //     const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, key, {
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.Pkcs7,
    //         iv
    //     }).toString(CryptoJS.enc.Utf8)
    //     //以utf-8的形式输出解密过后内容
    //     const locationArray = decrypted.split('|')
    //     if(locationArray.length === 6) {
    //         return {
    //             'address':locationArray[5],
    //             'province':locationArray[2],
    //             'city':locationArray[3],
    //             'district':locationArray[4],
    //             'latitude':locationArray[1],
    //             'longitude':locationArray[0]
    //         }
    //     }
    //     return decrypted
    // },
    getLocationFromServer(desc){
        return  getLocationFomApp().then(res => {
            if(res.result && res.result.longitude) {
                accessLog({ type: 'logic', name: 'getLocationRemoteSuccess', desc,extendData: res.result })
                return JSON.stringify(res.result)
            }
            accessLog({ type: 'logic', name: 'getLocationRemoteFail', desc,extendData: res.result })
            return JSON.stringify({})
        }).catch(e=>{})
    },
    getLocationInfo(desc,next) {
        // 如果不是强依赖定位的，使用getLocationInfo().finally(() => {})
        accessLog({ type: 'logic', name: 'getLocationPending', desc })

        // 延时请求
        const getLocationDelay = ()=>{
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    this.getLocationFromServer(`${desc}补偿`).then(resolve)
                },2000)
            })
        }

        return new Promise((resolve, reject) => {
            if (isApp) {
                // 与app交互超时 尝试从服务端获取
                const jsApiTimeOut = setTimeout(() => {
                    accessLog({ type: 'logic', name: 'getLocationTimeout', desc })
                    this.getLocationFromServer(desc).then((res)=>{
                        resolve(res)
                    })
                }, 3000)
                axdApp.send({
                    module: 'tools',
                    repeat: true,
                    method: 'getLocationStatusInfo',
                    callback: (ret={}) => {
                        clearTimeout(jsApiTimeOut)
                        // 明确拒绝的，reject，否则resolve
                        if (ret && ret.data && ret.data.authorizeStatus === 'restricted') {
                            accessLog({ type: 'logic', name: 'getLocationReject', desc })
                            reject()
                        } else {
                            accessLog({ type: 'logic', name: 'getLocationResolve', desc, extendData: ret.data.locationInfo })
                            resolve(ret.data.locationInfo )
                        }
                    }
                })
            } else {
                accessLog({ type: 'logic', name: 'getLocationIgnore', desc })
                resolve({})
            }
        }).then((res={})=>{

            // 如果需要延迟补偿且地址为空
            const hasLocation = !!(res.longitude)

            if(typeof next === 'function' ){
                next()
                if(!hasLocation){
                    return getLocationDelay()
                }
            }

            return JSON.stringify(res || {})
        }).catch(() => {
            // 拒绝权限仍要走一样的流程
            if(typeof next === 'function' ){
                next()
            }
            return '{}'
        })
    },
    getPermission(type, desc) {
        // type in ['checkContact', 'checkLocation']
        return new Promise((resolve, reject) => {
            if (permissionCheckSupport) {
                accessLog({ type: 'logic', name: type+'-total', desc })
                axdApp.send({
                    module: 'permission',
                    method: type,
                    callback: (ret={}) => {
                        if (ret.data) {
                            if(ret.data.state === '1') {
                                accessLog({ type: 'logic', name: type+'-allow', desc})
                            } else {
                                accessLog({ type: 'logic', name: type+'-refuse', desc})
                            }
                            resolve(ret.data.state)
                        } else {
                            resolve()
                        }
                    }
                })
            } else {
                accessLog({ type: 'logic', name: type+'-notSupport', desc })
                resolve()
            }
        })
    }
}


/**
 * @description: 去认证授信
 * @param {type}
 * @return:
 */
const goAuthCredit = (url, params, replace) => {
    if (params) {
        if (typeof params === 'string') {
            url = params
        } else if (params.constructor === Object && Object.keys(params).length) {
            let list = []
            for (let key in params) {
                if (key !== 'replace') {
                    let str = `${key}=${params[key]}`
                    list.push(str)
                }
            }
            let strJoin = list.join('&')
            url += `?${strJoin}`
        }
    }
    // 测试直接H5跳授信
    if (!isApp) {
        window.location.replace(url)
        return
    }
    if((params && params.replace) || replace){
        resetReplace(url)
        return
    }
    axdApp.send({
        module: 'navigation',
        method: 'goURL',
        params: {
            url,
            closeToRoot: false
        },
        callback: function(ret) {}
    })
}

export { AXD }
