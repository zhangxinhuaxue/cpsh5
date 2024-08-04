import {
    _getPromise,
    _postPromise,
    _BaseRequest
} from '../../base'
import debounce from 'lodash/debounce'
// 获取红包优惠券列表
export const getCouponList = (param) => {
    return _postPromise('/coupon/loanCoupon', param, { showLoading: false })
}
// 是否符合领取红包的用户和领取红包同一个接口
export const getCouponReceive = (param) => {
    return _postPromise('/oscar/spend/couponReceive', param, { showLoading: false })
}

// 自动提额
export const increaseCredit = (param) => {
    return _postPromise('/oscar/spend/increaseCredit', param, { showLoading: true })
}

// 日日花申请
export const getApply = (param) => {
    return _postPromise('/oscar/spend/getApply', param, { showLoading: true })
}

// 根据借款金额获取分期数
export const getPeriodsByAmy = (param, config = {showLoading:true}) => {
    return _postPromise('/oscar/spend/getPeriodsByAmt', param, config)
}
// 费率计算及月供详情
export const calRate = (param,  config = {showLoading:true}) => {
    return _postPromise('/oscar/spend/trial', param, config)
}
// 获取用户是否需要完善信息数据
export const getUserSupplement = (param) => {
    return _getPromise('/mall/loan/userSupplement', param, { showLoading: false })
}
// 下单
export const reqOrder = (param) => {
    return _postPromise('/oscar/spend/reqOrder', param, { showLoading: false })
}

// 获取Tab展示状态
export const getTabStatus = () => {
    return _getPromise('/app/sys/isView', null, { showLoading: false })
}
// 获取资金渠道
export const getProducts = (param) => {
    return _postPromise('/oscar/spend/matchProducts', param, { showLoading: false })
}
// 开户
export const openAccount = (param) => {}
// 签约页面初始化
export const loanDetail = (param) => {
    return _postPromise('/oscar/spend/loanDetail', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 签约页面获取合同
export const getContract = (param) => {
    return _postPromise('/mall/loan/getContract', param, { showLoading: true })
}
// 订单确认
export const reqConfirm = (param) => {
    return _postPromise('/app/spend/reqConfirm', param, { showLoading: true })
}
// 借款记录查询
export const getMyLoan = (param) => {
    return _getPromise('/oscar/spend/myLoan', param, { showLoading: true })
}
// 借款记录详情
export const getOrderDetail = (param) => {
    return _getPromise('/oscar/spend/getOrderDetail', param, { showLoading: true })
}
// 借款记录还款详情接口
export const getRepayDetail = (param) => {
    return _getPromise('/oscar/spend/getRepayDetail', param, { showLoading: true })
}
// 借款详情页面获取合同
export const getMiniLoanContract = (param) => {
    return _postPromise('/oscar/spend/getMiniLoanContract', param, { showLoading: true })
}
// 获取账单月份
export const getAccountMonths = (param) => {
    return _postPromise('/oscar/bill/accountPeriod', param, { showLoading: true })
}
// 获取当期账单
export const getBillList = (param) => {
    return _postPromise('/oscar/bill/homePage', param, { showLoading: true })
}
// 账单部分还款
export const billPayment = (param) => {
    return _postPromise('/oscar/bill/repay/partial', param, { showLoading: true })
}
// 提前还款账单
export const advancePayment = (param) => {
    return _postPromise('/oscar/bill/advancePage', param, { showLoading: true })
}
// 提前还款试算接口
export const billAdvanceCal = (param) => {
    return _postPromise('/oscar/bill/calculate/advance', param, { showLoading: true })
}
// 提前结清代扣接口
export const billAdvanceSettle = (param) => {
    return _postPromise('/oscar/bill/apply/advSettle', param, { showLoading: true })
}
// 提前结清主动还款接口
export const backRepayAdvSettle = (param) => {
    return _postPromise('/oscar/bill/repay/advance', param, { showLoading: true })
}
// 提前还款代扣接口
export const billAdvancePay = (param) => {
    return _postPromise('/oscar/bill/apply/advpay', param, { showLoading: true, message: '申请已提交，请稍候...' })
}
// 逾期还款试算接口
export const delayCal = (param) => {
    return _postPromise('/oscar/bill/calculate/single', param, { showLoading: true })
}
// 逾期还款代扣接口
export const delaySettle = (param) => {
    return _postPromise('/oscar/bill/apply/delay', param, { showLoading: true })
}
// 还款时判断是否需要重新签约
export const checkSign = (param) => {
    return _postPromise('/oscar/bill/checkSign', param, { showLoading: true })
}
// 还款记录
export const getRepayRecord = (param) => {
    return _postPromise('/app/bill/rrhFront/repayReocrd', param, { showLoading: true })
}
// 获取还款记录数
export const getRepayRecordCount = (param) => {
    return _postPromise('/oscar/bill/repayReocrdCount', param, { showLoading: true })
}
// 还款记录详情
export const getRepayRecordDetail = (param) => {
    return _postPromise('/app/bill/rrhFront/repayReocrdDetail', param, { showLoading: true })
}
// 换手机号发送验证码
export const sendVerifyCode = (param) => {
    return _postPromise('/mall/loan/sendVerifyCode', param, { showLoading: true })
}
// 换手机号确认
export const modifyReservePhone = (param) => {
    return _postPromise('/mall/loan/modifyReservePhone', param, { showLoading: true })
}
// 是否预授信
export const isPreCredit = (param) => {
    return _postPromise('/oscar/spend/isHasPreCreditFlag', param, { showLoading: true })
}
// 判断是否需要区域补录
export const isNeedLocalReplenish = (param) => {
    return _postPromise('/oscar/spend/fundInput', param, { showLoading: false })
}
// 判断是否需要签约
export const isNeedSign = (param) => {
    return _postPromise('/oscar/spend/isNeedSign', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 查询签约是否成功
export const querySign = (param) => {
    return _postPromise('/oscar/spend/querySign', param, { showLoading: param.showLoading })
}
// 签约
export const sign = (param) => {
    return _postPromise('/oscar/spend/sign', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 发送验证码
export const getSignVerifyCode = (param) => {
    return _postPromise('/oscar/spend/getSignVerifyCode', param, { showLoading: param.showLoading })
}

// 获取CBD授信额度
export const getCreditInfo = (param) => {
    return _postPromise('/oscar/spend/getCreditInfo', param, { showLoading: true })
}
// 撞库
export const repeatUserVerify = (param) => {
    return _postPromise('/oscar/spend/repeatUserVerify', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 获取分期信息接口
export const getStagingInfo = (param) => {
    return _postPromise('/mall/v3/trade/virtual/ensure/stage', param, { showLoading: true })
}
// 换手机号接口
export const changeTelPhone = (param) => {
    return _postPromise('/app/spend/changeTelPhone', param, { showLoading: true })
}
// 换银行卡接口
export const changeBank = (param) => {
    return _postPromise('/oscar/spend/changeBank', param, { showLoading: true })
}
// 查询换银行卡状态
export const queryChangeBank = (param) => {
    return _postPromise('/oscar/spend/queryChangeBank', param, { showLoading: true })
}
// 是否需要补充通讯录
export const isExistPhoneBook = (param) => {
    return _postPromise('/oscar/spend/isExistPhoneBook', param, { showLoading: false })
}
// 查询代扣银行卡
export const getRepayWithholdBank = (param) => {
    return _postPromise('/oscar/spend/getRepayWithholdBank', param, { showLoading: true })
}
// 换绑卡
export const reapyChangeBank = (param) => {
    return _postPromise('/oscar/spend/repayChangeBank', param, { showLoading: true })
}
// 查询换绑卡状态
export const queryRepayChangeBank = (param) => {
    return _postPromise('/oscar/spend/queryRepayChangeBank', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 苏宁获取合同
export const queryContractTemplates = (param) => {
    return _postPromise('/oscar/spend/queryContractTemplates', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 苏宁借款支用校验
export const checkLoanApply = (param) => {
    return _postPromise('/oscar/spend/checkLoanApply', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 苏宁发送验证码
export const sendVericationCode = (param) => {
    return _postPromise('/oscar/spend/sendVericationCode', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 苏宁验证码校验
export const verification = (param) => {
    return _postPromise('/oscar/spend/verification', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 用户是否完成刷脸
export const authResult = (param) => {
    return _postPromise('/common/h5/vivo/auth/result', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 真人校验接口
export const verificationHuman = (param) => {
    return _postPromise('/oscar/spend/verificationHuman', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 强制刷脸判断接口
export const huotiCheck = (param) => {
    return _postPromise('/oscar/spend/checkNeedFaceScan', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 召集令取现外放发送验证码
export const wfVeriCode = (param) => {
    return _postPromise('/oscar/spend/sendSmsCode', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}

export const getcontract = () => {
    return _getPromise('/h5/user/contract/viewTemplate/ruiyin')
}
// 获取是否展示包含：信用评分、招财卡权益等字样
export const getCreditSub = (param) => {
    return _postPromise('/rights/isGiveAplus', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 判断挽留弹窗的配置项
export const detentStatus = () => {
    return _getPromise('/syao/sys/user/status')
}
// 挽留弹窗的状态回调
export const detentStatusCallback = () => {
    return _getPromise('/syao/sys/user/statusCallBack')
}
// 授权页-初始化接口
export const authTrial = (param) => {
    return _postPromise('/oscar/cycle/trial', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 授权页-发送验证码
export const authSignApply = (param) => {
    return _postPromise('/oscar/cycle/signApply', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 授权页-校验验证码
export const authSign = (param) => {
    return _postPromise('/oscar/cycle/sign', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 授权页-用户授权
export const authUserAuth = (param) => {
    return _postPromise('/oscar/cycle/userAuth', param, { showLoading: param.showLoading === undefined ? true : param.showLoading })
}
// 授权页-查找路由记录
export const authFindCycle = () => {
    return _getPromise('/oscar/cycle/findCycle', null, { showLoading: true })
}
// 授权页-用户放弃授权
export const authGiveup = (param) => {
    return _postPromise('/oscar/cycle/giveUp', param, { showLoading: true })
}

// 授权页-是否有还款记录
export const isExistRepay = () => {
    return _getPromise('/oscar/spend/isExistRepay', null, { showLoading: true })
}

// 授信提额APP弹窗-获取数据
export const userAmount = () => {
    return _getPromise('/syao/sys/user/userAmount', null, { showLoading: true })
}

// 是否需要招财卡
export const loanPassCardCheck = (param) => {
    return _postPromise('/oscar/spend/loanPassCardCheck', param, { showLoading: true })
}
// 剩余未还
export const repayTaskList = (param) => {
    return _postPromise('/oscar/bill/repayTaskList', param, { showLoading: true })
}
// 还款
export const repayTask = (param) => {
    return _postPromise('/oscar/bill/repay/task', param, { showLoading: true })
}

/* 支付密码 - 日日花订单确认 */
export const rrhReqConfirm = (param) => {
    return _postPromise('/oscar/spend/pay', param, { showLoading: true })
}

/* 绑卡改版：银行卡管理页面获取用户所绑银行卡列表*/
export const getUserBankList = (callback) => {
    return _postPromise('/oscar/bindcard/getUserBankList', null, { showLoading: true })
}
// 发送验证码
export const sendCode = (param) => {
    return _postPromise('/app/syao/afterLoan/sendSms', param, { showLoading: true })
}
// 保存手机号
export const saveTel = (param) => {
    return _postPromise('/app/syao/afterLoan/saveTel', param, { showLoading: true })
}
// 是否需要去验证异常账号
export const isNeedTel = (param) => {
    return _postPromise('/app/syao/afterLoan/isNeedTel', param, { showLoading: true })
}
// 根据alias获取CMS全部数据
export const renderDataCms = (param) => {
    return _postPromise('/cms/renderData', param, { showLoading: true })
}
// 宝呗卡详情
export const rightsDetail = (param) => {
    return _getPromise('/api/mall/rights/package/detail', param, { showLoading: true })
}
// 生成订单
export const createOrder = (param,config = {showLoading:true}) => {
    return _postPromise('/api/mall/rights/package/createOrder', param, config)
}
// 获取收银台参数
export const getPayParameterByGid = debounce((param) => {
    return _postPromise('/mall/payment/v3/getPayParameterByGid', param)
}, 600, { leading: true, trailing: false })
// 获取权益包列表
export const getRightPackages = (param) =>{
    return _getPromise('/api/mall/rights/package/myOrders', param , {showLoading:true})
}
// 获取权益包详情
export const getRightPackageDetail = (param) =>{
    return _getPromise('/api/mall/rights/package/myDetail',param, {showLoading:true})
}
// 获取权益包退款金额
export const refundMoney = (param,config = {showLoading:true}) =>{
    return _getPromise('/api/mall/rights/package/showRefund',param, config)
}
// 获取权益包退款金额
export const refundDetail = (param) =>{
    return _postPromise('/api/mall/rights/package/refund',param, { showLoading:true })
}

// 获取权益包退款金额
export const rightsPackageRisk = (param) =>{
    return _postPromise('/api/mall/rights/package/risk',param, { showLoading:true })
}

// 校验资金渠道是否在维护期
export const checkMaintainTime = (param)=>{
    return _postPromise('/oscar/bill/isChannelMaintainTime',param, { showLoading:true })
}
