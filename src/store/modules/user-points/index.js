import { _getPromise, _postPromise } from '../../base'

let domain = window.aixuedai.apiGateway + '/yuny'

// note:积分领取版块
// 当前用户可用积分
export const scoreTotal = (param) => {
    return _getPromise(domain + '/score/user/score?t=' + Date.now(), param, { showLoading: true })
}

// 待领取积分列表
export const scoreUnpickList = (param) => {
    return _getPromise(domain + '/score/user/score/unpick?t=' + Date.now(), param, { showLoading: true })
}

// 领取积分
export const scorePick = (param) => {
    return _postPromise(domain + '/score/user/score/pick', param, { showLoading: true })
}

// note: 签到版块
// 用户签到信息
export const signIn = () => {
    return _postPromise(domain + '/score/signin/record?t=' + Date.now(), null, { showLoading: true, setHeaderUrlencoded: true })
}

// note: 任务版块
// 获取任务列表
export const taskList = (param) => {
    return _postPromise(domain + '/score/task/list', param, { showLoading: true })
}

// 校验任务是否可做
export const taskCheck = (param) => {
    return _postPromise(domain + '/score/task/check', param, { showLoading: true })
}

// 领取任务
export const taskReceive = (param) => {
    return _postPromise(domain + '/score/task/receive', param, { showLoading: true })
}

// 视频任务完成
export const advComplete = (param) => {
    return _postPromise(domain + '/score/task/completeByAdv', param, { showLoading: true })
}

// note: 游戏模块
// 游戏列表
export const gameList = () => {
    return _postPromise(domain + '/score/activity/list', null, { showLoading: true, setHeaderUrlencoded: true })
}

// note: 积分列表页面
// 按月统计积分
export const scoreMonth = (param) => {
    return _getPromise(domain + '/score/user/score/month', param, { showLoading: true })
}

// 积分明细列表
export const scoreList = (param) => {
    return _getPromise(domain + '/score/user/score/list', param, { showLoading: true })
}

// note: 积分兑换页面
// 积分兑换预校验
export const precheck = (param) => {
    return _postPromise(domain + '/score/trade/valid/pre', param, { showLoading: true })
}

// 兑换下单
export const exchange = (param) => {
    return _postPromise(domain + '/score/trade/order/create', param, { showLoading: true })
}

// 可兑换列表
export const exchangeList = (param) => {
    return _postPromise(domain + '/score/product/exchange/list', param, { showLoading: true })
}

// 积分抽奖记录
export const pointsList = (param) => {
    return _postPromise('/lottery/user/award/result', param, { showLoading: true })
}

// 已兑换奖品列表
export const prizeList = (param) => {
    return _postPromise(domain + '/score/trade/order/right/list', param, { showLoading: true })
}

// 已兑换红包列表
export const couponList = (param) => {
    return _postPromise(domain + '/score/trade/order/coupon/list', param, { showLoading: true })
}

// 兑换详情页面
export const exchangeDetail = (param) => {
    return _postPromise(domain + '/score/product/exchange/detail', param, { showLoading: true })
}
