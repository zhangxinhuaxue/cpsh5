import CryptoJS from 'libs/encrypt'

/**
 * [全局唯一编码生成(UUID)]
 * @param  {[string]} len   [uuid生成长度]
 * @param  {[string]} radix [基数: 2、10、16进制]
 * @return {[string]}       [生成uuid]
 */
export function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    var uuid = [],
            i
    radix = radix || chars.length

    if (len) {
        for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
    } else {
        var r

        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'

        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | (Math.random() * 16)
                uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
            }
        }
    }

    return uuid.join('')
}

/**
 * [密码加密]
 * @param  {[string]} password [密码]
 * @return {[string]}          [加密后的密码]
 */
export const getEncryptedPsw = (password) => {
    var aixuedaiAeskey = 'YWl4dWVkYWk0MDAtODY3MQ==' // aixuedai400-8671
    let key = CryptoJS.enc.Base64.parse(aixuedaiAeskey)
    let iv = CryptoJS.enc.Base64.parse(aixuedaiAeskey)

    return CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString()
}

/**
 * [密码解密]
 * @param  {[string]} password [加密后的密码]
 * @return {[string]}          [密码]
 */
export const getDecryptedPsw = (word) => {
    var aixuedaiAeskey = 'YWl4dWVkYWk0MDAtODY3MQ==' // aixuedai400-8671
    let key = CryptoJS.enc.Base64.parse(aixuedaiAeskey)
    let iv = CryptoJS.enc.Base64.parse(aixuedaiAeskey)

    return CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
    }).toString(CryptoJS.enc.Utf8)
}

/**
 * [浏览器参数分割]
 * @param  {[string]} str [浏览器search]
 * @return {[object]}     [{key:value}]
 */
export const parseQuery = (query = location.search) => {
    var res = {}
    query = query.trim().replace(/^(\?|#|&)/, '')
    if (!query) {
        return res
    }
    query.split('&').forEach(function(param) {
        var parts = param.replace(/\+/g, ' ').split('=')
        var key = decodeURIComponent(parts.shift())
        var val = parts.length > 0 ? decodeURIComponent(parts.join('=')) : null

        if (res[key] === undefined) {
            res[key] = val
        } else if (Array.isArray(res[key])) {
            res[key].push(val)
        } else {
            res[key] = [res[key], val]
        }
    })
    return res
}

/**
 * [js引用]
 * @param  {[string]} cookieName [cookie名称]
 * @return {[string]}            [cookie值]
 */
export function includeJs(filename) {
    var head = document.getElementsByTagName('head')[0]

    var script = document.createElement('script')
    script.src = filename
    script.type = 'text/javascript'

    head.appendChild(script)
}

/**
 * [css引用]
 * @param  {[string]} filename [filename]
 */
export function includeCss(filename) {
    var head = document.getElementsByTagName('head')[0]

    var link = document.createElement('link')
    link.href = filename
    link.rel = 'stylesheet'

    head.appendChild(link)
}

/**
 * [cookie值设置]
 * @param  {[string]} name [cookie名称]
 * @param  {[string]} value [cookie值]
 * @param  {[string]} expiredays [cookie过期时间]
 * @param  {[string]} tarDomain [cookie域名]
 */
export function setCookie(name, value, expiredays, tarDomain = window.location.hostname) {
    if (!name || !value) {
        return
    }
    let exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = name + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString()) + ';path=/;domain=' + tarDomain
}

/**
 * [cookie值获取]
 * @param  {[string]} cookieName [cookie名称]
 * @return {[string]}            [cookie值]
 */
export function getCookie(cookieName) {
    let cookieStart = document.cookie.indexOf(cookieName)
    let cookieValue = null
    if (cookieStart > -1) {
        let cookieEnd = document.cookie.indexOf(';', cookieStart)
        if (cookieEnd == -1) {
            cookieEnd = document.cookie.length
        }
        cookieValue = document.cookie.substring(cookieStart + cookieName.length + 1, cookieEnd)
    }
    return cookieValue
}

/**
 * [localstorage值设置]
 * @param  {[string]} name [名称]
 * @param  {[string|object]} value [值]
 * @param  {[number]} minutes [过期时间，分钟]
 * @param  {[boolean]} clearTomorrow [是否隔天过期]
 */
export function setStorage(name, value, minutes = 0, clearTomorrow = false) {
    if(!name || !value) {
        return false
    }
    if(minutes && typeof minutes === 'number') {
        let expires
        const expiresTime = new Date().getTime() + minutes * 60000
        if(clearTomorrow) {
            const tomorrowTime = new Date(new Date().toLocaleDateString()).getTime() + 1440 * 60000
            expires = Math.min(tomorrowTime, expiresTime)
        } else {
            expires = expiresTime
        }
        window.localStorage.setItem(name, JSON.stringify({expires, value}))
    } else {
        window.localStorage.setItem(name, JSON.stringify({value}))
    }
}

export function getStorage(name) {
    if(!name) {
        return null
    }
    const JsonData = window.localStorage.getItem(name)
    try {
        let data = JSON.parse(JsonData)
        if(data.expires) {
            if(data.expires >= new Date().getTime()) {
                return data.value
            } else {
                window.localStorage.removeItem(name)
                return null
            }
        } else {
            return data.value
        }
    } catch (error) {
        return JsonData
    }
}

/**
 * [getUA description]
 * @date   2019-08-27
 * @param  {[type]}   key [description]
 * @return {[type]}   value[description]
 */
export function getUA(key) {
    const aym = navigator.userAgent.match(/aym=({.*})/)
    if (aym) {
        const result = JSON.parse(aym[1])
        return result[key]
    }
    return ''
}
export const closeWebView = () => {
    axdApp.send({
        module: 'webview',
        method: 'close'
    })
}


/**
 * [getProductUrl description]
 * @param  {[type]} productId [description]
 * @return {[type]}           [description]
*/
export function getProductUrl(productId, statisticsString) {
    return window.location.origin + '/pages/mall/product/' + productId + (statisticsString ? '?' + statisticsString : '')
}
