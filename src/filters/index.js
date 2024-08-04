import Vue from 'vue'

Vue.filter('toRMB', function(data, precision = 1000) {
    return data ? parseFloat(data / precision).toFixed(2) : '0.00'
})

Vue.filter('dateFormat', function(dt, fmt = 'yyyy-MM-dd hh:mm:ss') {
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
})

Vue.filter('formatNum', function(num, unit = 100, isIntegral = true) {
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
})
