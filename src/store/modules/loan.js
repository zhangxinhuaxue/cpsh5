import {
    _post,
    formatRet,
    _getPromise,
    _postPromise,
    _BaseRequest
} from '../base'

/* ============= loanApply 第1步接口 ============= */

/* 页面初始化数据获取 */
export const loanGetInitData = (callback) => {
    return _postPromise('/mall/loan/getLoanInit', null, { showLoading: true })
}

// 获取取现理由
// export const loanGetCause = (callback) => {
//     return _post('/mall/loan/cause', null, (data) => {
//         callback(formatRet(data))
//     })
// }

/* 初始化弹窗内容 */
export const renderDataForBlockType = (param, callback) => {
    return _postPromise('/cms/renderDataForBlockType', param)
}
export const renderData = (param, callback) => {
    return _postPromise('/cms/renderData', param)
}

/* ============= loanConfirm 第2步接口 ============= */

/* 获取服务费 */
export const loanGetServiceFee = (param, callback) => {
    // return _post('/mall/loan/calJnhRate', param, (data) => {
    return _postPromise('/mall/loan/getLoanMonthPayDetail', param, { showLoading: true })
}

/* 获取免息券列表 */
export const loanGetCoupon = (param, callback) => {
    return _postPromise('/mall/loan/getLoanCouponList', param, { showLoading: true })
}

/* 获取可选分期数 */
export const loanGetPeriods = (param, callback) => {
    return _postPromise('/mall/loan/getPeriods', param, { showLoading: true })
}

// export const loanGetConfirm = (param, callback) => {
//     return _post('/mall/loan/getLoanConfirm', param, (data) => {
//         callback(formatRet(data))
//     })
// }

/* 确认借款 */
export const loanReqOrder = (param, callback) => {
    // return _post('/mall/loan/reqOrder', param, (data) => {
    //     callback(formatRet(data))
    // })
    return _postPromise('/mall/loan/reqOrder', param, { showLoading: true, message: '资金匹配中，请稍候...' })
}
/*  确认是否弹窗界面 请求中回掉请求 不需要 showloadding */
export const checkStatus = (param, callback) => {
    return _postPromise('/mall/loan/isNeedOpenAccount', param)
}
/*  确认是否开户弹窗界面 请求中回掉请求 不需要 showloadding */
export const openAccount = (param, callback) => {
    return _postPromise('/mall/loan/openAccount', param, { showLoading: true })
}

/* =============  贷款签约页面 ============= */

/* 获取指定订单 */
export const specialLoan = (param, callback) => {
    return _BaseRequest('/mall/loan/specialLoanAjax', param, {
        showLoading: true,
        isShowAllData: true,
        methods: 'post'
    })
}

// 获取错配订单的还款计划
export const repayPlanTrial = (param, callback) => {
    return _BaseRequest('/mall/loan/repayPlanTrial', param, {
        showLoading: true,
        isShowAllData: true,
        methods: 'post'
    })
}

/* 确认借款签约 */
export const generateContract = (param, callback) => {
    return _postPromise('/mall/loan/generateContract', param, { showLoading: true })
}

/* =============  支付页面 ============= */

/* 是否设置过支付密码 */
export const hasPayPasswd = (callback) => {
    return _postPromise('/oscar/spend/hasPayPasswd', null, { showLoading: true })
}

/* 验证支付密码  */
export const checkPaypwd = (param, callback) => {
    return _postPromise('/oscar/spend/checkPayPwd', param, { showLoading: true })
}

/* 支付密码 - 取点花回调 */
export const qdhReqConfirm = (param, callback) => {
    return _postPromise('/mall/loan/reqConfirm', param, { showLoading: true })
}

/* 支付密码 - 嗨花回调 */
export const byjReqConfirm = (param, callback) => {
    return _postPromise('/app/graLoan/reqConfirm', param, { showLoading: true })
}
/* 支付密码 - 助学金贷款 */
export const studentReqConfirm = (param, callback) => {
    return _post('/mall/grant/doLoan', param, (data) => {
        callback(formatRet(data))
    })
}
/* 支付密码 - 短贷订单确认 */
export const miniReqConfirm = (param, callback) => {
    return _postPromise('/app/miniLoan/reqConfirm', param, { showLoading: true })
}
/* 支付密码 - 嗨花订单确认 */
export const haihuaReqConfirm = (param, callback) => {
    return _postPromise('/app/original/pay', param, { showLoading: true })
}
/* 支付密码 - 优资贷订单确认 */
export const primeReqConfirm = (param, callback) => {
    return _postPromise('/app/prime/pay', param, { showLoading: true })
}
/* 支付密码 - 成功花 展新贷三期订单确认 */
export const succReqConfirm = (param, callback) => {
    return _postPromise('/app/succ/pay', param, { showLoading: true })
}
// 取点花结果
export const getLoanResult = () => {
    return _postPromise('/mall/loan/getLoanResult', null)
}
/* =============  loanActivity  ================ */

/* 初始化数据 */
export const init = (param, callback) => {
    return _post('/loan/dice/init', param, (data) => {
        callback(formatRet(data))
    })
}

/* 摇色子抽奖 */
export const run = (param, callback) => {
    return _post('/loan/dice/run', param, (data) => {
        callback(formatRet(data))
    })
}

/* 获取分享短连接 */
export const getShareUrl = (param, callback) => {
    return _post('/loan/dice/getShareUrl', param, (data) => {
        callback(formatRet(data))
    })
}

/* 分享页助力接口 */
export const help = (param, callback) => {
    return _post('/loan/dice/help', param, (data) => {
        callback(formatRet(data))
    })
}

/* 获取渠道，合同信息 */
export const getContractList = (param, callback) => {
    return _postPromise('/mall/loan/getContract', param, { showLoading: true })
}
// 嗨花获取渠道、合同信息
export const hhGetContractList = (param, callback) => {
    return _postPromise('/oscar/loan/getContractTemplate', param, { showLoading: true })
}

/* 用户是否需要去浦发开户 */
export const getSpdbStat = (callback) => {
    return _postPromise('/mall/loan/getSpdbStat', null, { showLoading: true })
}

/* 用户去浦发开户 */
export const openSpdbAccount = (callback) => {
    return _postPromise('/mall/loan/openSpdbAccount', null, { showLoading: false })
}
