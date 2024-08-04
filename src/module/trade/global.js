/**
 *
 * @author:      zhouqing
 * @dateTime:    2017-05-17 16:05:02
 * @description:
 */
import axdErr from 'components/errpage/index'
import { formatNum, formatMoneyK, formatMoney, formatComplexMoney, formatLimitString, timeYMD, formatImg } from 'src/libs/util'

function IsNum(s) {
    if (s !== null && s !== '') {
        return !isNaN(s)
    }
    return false
}

const install = (Vue, config = {}) => {
    Vue.prototype.axdErr = axdErr

    Vue.filter('limitString', formatLimitString)
    Vue.prototype.complexMoney = formatComplexMoney
    Vue.prototype.formatImg = formatImg
    Vue.filter('moneyK', function (value) {
        if (IsNum(value)) {
            return formatMoneyK(value)
        } else {
            return value
        }
    })

    // 2014-21-21
    Vue.filter('timeYMD', timeYMD)
    Vue.filter('money', function (value) {
        if (IsNum(value)) {
            return formatMoney(value)
        } else {
            return value
        }
    })
    Vue.filter('formatNum', (value, unit, isIntegral) => {
        return formatNum(value, unit, isIntegral)
    })
    Vue.filter('moneySplitL', function (value) {
        if (value) {
            return value.split('.')[0]
        }
    })
    Vue.filter('moneySplitR', function (value) {
        if (value) {
            return value.split('.')[1]
        }
    })
}

export { install }
