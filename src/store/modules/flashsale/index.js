import { _getPromise, _postPromise } from '../../base'

// 爱抢购--获取限时抢购所有场次列表以及全部配置信息
export const getLimitSeckillEntryList = (param) => {
    return _postPromise('/newlimit/getLimitSeckillEntryList', param, {showLoading: true})
}

// 爱抢购--根据场次ID查询所有商品信息列表
export const getLimitSeckillProductList = (param) => {
    return _postPromise('/newlimit/getLimitSeckillProductList', param, {showLoading: true})
}

// 爱抢购--点击提醒
export const setRemindDetail = (param) => {
    return _postPromise('/newlimit/setRemindDetail', param)
}

// cms限时抢购--根据cms模块生成的ID查询场次列表信息
export const getLimitSeckillEntryListById = (param) => {
    return _postPromise('/app/limitTimeSeckill/getSeckillEntryList', param, {showLoading: true})
}

// cms限时抢购--根据场次ID查询所有商品信息列表
export const getCMSLimitSeckillProductList = (param) => {
    return _postPromise('/app/limitTimeSeckill/getLimitSeckillProductList', param, {showLoading: true})
}

// cms限时抢购--点击提醒
export const setCMSRemindDetail = (param) => {
    return _postPromise('/app/limitTimeSeckill/setRemindDetail', param)
}
