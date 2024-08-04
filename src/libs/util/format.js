import { canUseWebP } from './support'
// 降低默认图片质量参数到75
export function formatImg(url = '//img.aiyoumi.com/cpsImg/20201012184525_640x640.gif', size = '75', w, h) {
    var paramFlag = '?'
    if (url.indexOf('?') !== -1) {
        paramFlag = '&'
    } else {
        paramFlag = '?'
    }
    // ios下，图片webp会产生白边，所以阻止webp化
    let isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

    // 如果是京东的图片 按照京东的规则处理一下
    if (url.indexOf('img13.360buyimg.com') !== -1) {
        return url + '.dpg'
    }
    // 处理指定宽高
    let resizeParam = ''
    if (w) {
        resizeParam = '/resize' + ',w_' + w
    }
    if (h) {
        resizeParam = resizeParam ? resizeParam + ',h_' + h : '/resize' + ',h_' + h
    }
    // 如果支持webp且为阿里云的图片，那么直接用webp格式
    if (canUseWebP() && (url.indexOf('.aliyuncs') !== -1 || url.indexOf('img.aiyoumi.com') !== -1)) {
        if (!isIOS || (isIOS && url.indexOf('.png') === -1)) {
            return url + paramFlag + 'x-oss-process=image/format,webp' + resizeParam
        }
    }
    // 如果是gif图片，则不进行转换
    if (url.indexOf('.gif') === -1 && (!isIOS || (isIOS && url.indexOf('.png') === -1))) {
        if (url.indexOf('img.aiyoumi.com') !== -1) {
            return url + paramFlag + 'x-oss-process=image/format,jpg/interlace,1/quality,Q_' + size + resizeParam
        } else if (url.indexOf('.aliyuncs') !== -1) {
            const imgUrl = url.replace('aixuedaiimg.oss-cn-hangzhou.aliyuncs.com', 'aixuedaiimg.img-cn-hangzhou.aliyuncs.com')
            return imgUrl + paramFlag + 'x-oss-process=image/format,jpg/interlace,1/quality,Q_' + size + resizeParam
        } else {
            return url
        }
    } else {
        return url
    }
}

// 尾号
export function tailNum(value, count = 4) {
    let len = value.length
    return value.substring(len - count)
}

/**
 * [entryNumber 字符串中间替换为星星**]
 * @param  {[type]} value [15036363644]
 * @param  {Number} start [3]
 * @param  {Number} count [4]
 * @return {[type]}       [150****3644]
 */
export function entryNumber(value, start = 3, count = 4) {
    value = value.toString()
    let sub = new Array(count + 1).join('*')
    return value.replace(value.substr(start, count), sub)
}
/**
 *
 * @author:      sunxj
 * @dateTime:    2017-09-05 18:03:47
 * num: 价格值,
 * unit：单位
 * isIntegral 为整数时，是否不保留小数点；true为不保留；false为保留
 *
 */
export function formatNum(num, unit = 100, isIntegral = true) {
    let parseNum = parseFloat(num)
    if (isNaN(parseNum)) {
        return num
    } else if (num === null || num === undefined || num === 0 || num === '') {
        return isIntegral ? '0' : '0.00'
    } else {
        let divideNum = parseNum / unit
        let remainder = parseNum % unit
        if (remainder) {
            return divideNum.toFixed(2)
        } else {
            return isIntegral ? divideNum : divideNum.toFixed(2)
        }
    }
}

export function formatMoney(num) {
    if (isNaN(parseFloat(num))) {
        return num
    } else if (num === null || num === undefined || num === 0 || num === '') {
        return '0.00'
    } else {
        return (parseFloat(num) / 100).toFixed(2)
    }
}

// 金额除以一千
export function formatMoneyK(num, count = 2) {
    if (isNaN(parseFloat(num))) {
        return num
    } else if (num === null || num === undefined || num === 0 || num === '') {
        return '0.00'
    } else {
        return (parseFloat(num) / 1000).toFixed(count)
    }
}
// 金额千分位格式化
export function formatMoneyKByComma(num) {
    let str = num.toString()
    if (str === '0') {
        return '0.00'
    }
    let list = str.split('.')
    let largeNum = list[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
    if (list[1]) {
        largeNum = `${largeNum}.${list[1]}`
    }
    return largeNum
}
// 将1000.00格式化成1000
export function formatInt(num) {
    return parseFloat(num)
}
/* 字符阶段过滤，多出加...
 ** limitLen 字符限制长度
 ** by hity
 */
export function formatLimitString(value, limitLen) {
    let count = 0
    let string = ''
    for (let e of value) {
        // 判断中文或圆角字符
        if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(e) || /[\uFF00-\uFFEF]/.test(e)) {
            count += 2
        } else if (/[A-Z]/.test(e)) {
            count += 2
        } else {
            count += 1
        }
        if (count <= limitLen) {
            string += e
        } else {
            string += '...'
            break
        }
    }
    return string
}

/* value: 价格值
 ** unit: 单位：100 or 1000
 ** isIntegral: 为整数时，是否不保留小数点；true为不保留；false为保留
 ** by hity
 */
export function formatComplexMoney(value, unit = 100, isIntegral = true, isSame) {
    value = parseInt(value)
    if (!(typeof unit == 'number' && unit != 0) || typeof value != 'number') {
        return false
    }
    if (isIntegral && value % unit == 0) {
        return parseInt(value / unit)
    }

    if (isSame) {
        return (value / unit).toFixed(2)
    }
    let tmpValue = (value / unit)
        .toFixed(2)
        .toString()
        .split('.')
    return tmpValue[0] + '<font class="mantissa" style="font-size: 0.512rem;">.' + tmpValue[1] + '</font>'
}

export function formatColor(value) {
    return '#' + value
}

// 计算图片的宽高
// https://img.aiyoumi.com/null/2017315/101112516/20170315101112_750x686.png
export function formatImgWH(url) {
    if (url.indexOf('.gif') === -1) {
        if (url.indexOf('_') !== -1) {
            let temp = url.split('_')[1]
            temp = temp.split('.')[0]
            if (temp.indexOf('x') !== -1) {
                temp = temp.split('x')
                return temp
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

// 手机号码3+4+4空格格式化
export function formatPhone(val) {
    if (val) {
        let matches = /^(\d{3})(\d{4})(\d{4})$/.exec(val)
        if (matches) {
            return matches[1] + ' ' + matches[2] + ' ' + matches[3]
        }
    }
    return val
}

// 手机号 隐藏中间 132****3650
export function PhoneReplace(val) {
    if (val && val.length === 11) {
        return val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
}
// 18位身份证 隐藏中间 331022 ******** 1279
export function IDcardReplace(val) {
    if (val) {
        let n = (val + '').toUpperCase()
        let o = '$1********$2'
        if (n.length === 18) {
            return n.replace(/(\d{6})\d{8}(\d{3})/, o)
            // if (val.indexOf('x') > 0) {
            // } else {
            //     return n.replace(/(\d{6})\d{8}(\d{3})/, o)
            // }
        }
    }
}
// 银行卡号脱敏
export function BankCardIdReplace(val) {
    if (val && val.indexOf('*') < 0 && val.length > 8) {
        let arr = []
        for (let i = 0; i < val.length - 8; i++) {
            arr.push('*')
        }
        return val.substr(0, 4) + arr.join('') + val.substr(val.length - 4)
    } else {
        return val
    }
}
// 姓名脱敏
export function nameReplace(val='') {
    if (val && val.indexOf('*') < 0 && val.length > 1) { 
        const len = val.length  
        const firstStr = len > 2 ? val.charAt(0) : ''
        return firstStr + '*' + val.charAt(len-1)
    } else {
        return val
    }
}
// 时间年.月.日
export function timeYMD(value) {
    if (value.indexOf(' ') !== -1) {
        return value.split(' ')[0].replace(/-/g, '.')
    } else {
        return value
    }
}
// 数字每4位用空格分割
export function numFourReplace(val) {
    return val.replace(/\s/g, '').replace(/(\w{4})(?=\w)/g, '$1 ')
}
// 时间年-月-日替换成年/月/日, 年-月-日格式在IOS下解析错误
export function timeFomater(value) {
    return value.replace(/-/g, '/')
}
// 时间年-月-日
export function timeYMD2(value) {
    if (value.indexOf(' ') !== -1) {
        return value.split(' ')[0]
    } else {
        return value
    }
}
/*
    inputTime 毫秒
    style: 1. yyyy-MM-dd(默认)   2. yyyy-MM-dd HH:mm:ss
    Delimiter: 1  . 分隔符 (默认) 2. - 分隔符
 */
export function formatDateTime(inputTime, style, Delimiter) {
    // IOS真机只支持yyyy/MM/dd这种标准格式，传入'yyyy-MM-dd HH:mm:ss'格式可能为NaN，传入'yyyy-MM-dd'则正常，怪哉
    let date = typeof inputTime === 'object' ? inputTime : typeof inputTime === 'number' ? new Date(inputTime) : new Date(inputTime.replace(/-/g, '/'))
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let minute = date.getMinutes()
    let second = date.getSeconds()
    minute = minute < 10 ? '0' + minute : minute
    second = second < 10 ? '0' + second : second
    Delimiter = Delimiter == undefined ? '.' : Delimiter
    style = style == undefined ? 'yyyy-MM-dd' : style
    if (style === 'yyyy-MM-dd') {
        return y + Delimiter + m + Delimiter + d
    } else if (style === 'yyyy-MM-dd HH:mm:ss') {
        return y + Delimiter + m + Delimiter + d + ' ' + h + ':' + minute + ':' + second
    } else {
        return inputTime
    }
}

/**
 * [格式化日期]
 * @param  dt = dateTime: type string || number || date object
 * @return type string
*/
export function dateFormat(dt, fmt = 'yyyy-MM-dd hh:mm:ss') {
    let newDate = dt
    if (!dt) {
        return ''
    }
    if (typeof dt === 'string') {
        // dt = dt.replace(/-/g, '/') // IOS上只支持yyyy/MM/dd这种标准格式
        dt = /^\d+$/.test(dt) ? parseInt(dt) : dt.replace(/-/g, '/') // 传入的日期可能是个纯数字组成的字符串，如"1511107200000"
    }
    if (dt instanceof Date === false) {
        dt = new Date(dt)
    }
    if (!dt.getTime()) {
        return newDate
    }

    let o = {
        'M+': dt.getMonth() + 1, // 月份
        'd+': dt.getDate(), // 日
        'h+': dt.getHours(), // 小时
        'm+': dt.getMinutes(), // 分
        's+': dt.getSeconds(), // 秒
        'q+': Math.floor((dt.getMonth() + 3) / 3), // 季度
        S: dt.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }

    return fmt
}

/**
 * [格式化时间]
 * @param  dateTime  type number || string
 * @return type number
*/
export function getDateTime(dateTime) {
    if (typeof dateTime === 'number') {
        return dateTime
    } else if (typeof dateTime === 'string') {
        return new Date(dateTime.replace(/-/g, '/')).getTime()
    } else {
        console.log('error 时间无效')
        return 0
    }
}

/**
 * [string的字符填充]
 * @param  在string 头部填充字符
 * @return type string
*/
export function padStart(value, ch, len) {
    if (typeof ch !== 'string' || typeof value !== 'string' || typeof len !== 'number') {
        console.log('输入类型错误')
        return
    }

    if (ch.length !== 1) {
        console.log('输入字符长度错误')
        return
    }

    while (value.length < len) {
        value = ch + value
    }
    return value
}