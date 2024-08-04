// 获取还款日 '**月**日'
export const getRepayDate = (type) => {
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let repayMonth = (month + 1) % 12 || 12
    let repayYear = month < 12 ? year : year + 1
    let repayDay = day
    switch (repayMonth) {
        case 4:
        case 6:
        case 9:
        case 11:
            if (repayDay === 31) {
                repayDay = 30
            }
            break
        case 2:
            if (repayYear % 400 === 0 || (repayYear % 100 !== 0 && repayYear % 4 === 0)) {
                repayDay = repayDay > 29 ? 29 : repayDay
            } else {
                repayDay = repayDay > 28 ? 28 : repayDay
            }
            break
        default:
            break
    }
    return type === 'd' ? `${repayDay}日` : `${repayMonth}月${repayDay}日`
}
// 获取还款类型描述
export const formatRepayTypeDesc = (type) => {
    let desc = ''
    switch (type) {
        case 'normal':
        case 'normal_repay':
            desc = '正常还款'
            break
        case 'pre_pay':
        case 'advance':
        case 'advance_repay':
            desc = '提前还款'
            break
        case 'partialpay':
        case 'partial_pay':
            desc = '部分还款'
            break
        case 'collection':
            desc = '催收'
            break
        case 'collection_repay':
            desc = '催收还款'
            break
        case 'postpone_repay':
            desc = '逾期还款'
            break
        case 'advance_settle':
            desc = '提前结清'
            break
        case 'renewal_pay':
            desc = '展新贷'
            break
        default:
            break
    }
    return desc
}
// 返回还款日 '每月**日'
export const getRepayDay = (date) => {
    if (date) {
        return `每月${parseInt(date.split('-')[2])}日`
    } else {
        return date
    }
}
// 返回取现订单状态
export const formatStatus = (status, oidBiz) => {
    let des = ''
    switch (status + '') {
        case '1':
            des = '审核中'
            break
        case '8':
            des = '待确认'
            break
        case '2':
        case '4':
        case '12':
            des = '放款中'
            break
        case '3':
        case '6':
        case '9':
            des = '已关闭'
            break
        case '5':
            des = '放款成功'
            break
        case '7':
            des = '已结清'
            break
        case '99':
            des = '已冻结'
            break
        default:
            break
    }
    return des
}
// 返回其他订单状态
export const formatOtherStatus = (status, oidBiz) => {
    let des = ''
    switch (status + '') {
        case '1':
        case '2':
        case '4':
        case '12':
            des = '处理中'
            break
        case '8':
            des = ''
            break
        case '3':
        case '6':
        case '9':
            des = '已关闭'
            break
        case '5':
            des = '待还款'
            break
        case '7':
            des = '已结清'
            break
        case '99':
            des = '已冻结'
            break
        default:
            break
    }
    return des
}
// 返回订单、账单状态
export const getStatusStyle = (status, oidBiz) => {
    let style = ''
    switch (status + '') {
        case '1':
            style = 'auditing'
            break
        case '2':
        case '4':
        case '8':
        case '12':
            if (['202162', '202163', '202164', '202165'].indexOf(oidBiz) > -1) { // 增信费特殊处理，显示‘处理中’
                style = 'dealing'
            } else {
                style = 'putting'
            }
            break
        case '3':
        case '6':
        case '9':
            style = 'closed'
            break
        case '5':
            if (['202162', '202163', '202164', '202165'].indexOf(oidBiz) > -1) { // 增信费特殊处理，显示‘待还款’
                style = 'torepay'
            } else {
                style = 'advance'
            }
            break
        // case '8':
        // case 'DELAY': // 账单已逾期
        //     style = 'overdue'
        //     break
        case '7': // 借款已还清
        case 'DELAYSETTLE': // 账单已还款
        case 'SETTLE': // 账单逾期已还
            style = 'paid'
            break
        default:
            style = 'normal'
            break
    }
    return style
}
// 抱米花产品费用名称（保费、手续费）
export const getFeeName = (oidBiz) => {
    let name = ''
    switch (oidBiz + '') {
        default:
            name = '手续费'
            break
    }
    return name
}
// 返回取现聚合页
export const goHome = () => {
    axdApp.send({
        module: 'navigation',
        method: 'goPage',
        params: {
            page: 'root',
            loginFirst: false,
            closeToRoot: true,
            rootPage: 0
        },
        callback: function() {}
    })
}
export const rateFormat = (rate) => {
    if (rate && rate.indexOf('~') >= 0) {
        return rate.split('~').map(item => {
            return item + '%'
        }).join('~')
    }
}
export const moneyScopeFormat = (scope) => {
    if (scope && scope.indexOf('~') >= 0) {
        return scope.split('~').map(item => {
            return item.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
        }).join('~')
    }
}
export const rateDescFormat = (type) => {
    let desc = ''
    switch (type) {
        case 'day_rate':
            desc = '日费率'
            break
        case 'month_rate':
            desc = '月费率'
            break
        case 'year_rate':
            desc = '年费率'
            break
        default:
            break
    }
    return desc
}
export const closeWebView = () => {
    axdApp.send({
        module: 'webview',
        method: 'close'
    })
}
