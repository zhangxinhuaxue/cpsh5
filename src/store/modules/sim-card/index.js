import {
    _getPromise,
    _postPromise
} from '../../base'


// 展示购卡页面
export const getSIMcardList = (param) => {
    return _postPromise('/api/area/phone/render', param, { showLoading: true })
}

//创建区域手机号码订单
export const createOrderSIMcard = (param) => {
    return _postPromise('/api/area/phone/order/create', param, { showLoading: true })
}

//选择区域省市区
export const getAreaPhoneZone = (param) => {
    return _getPromise('/api/area/phone/zone', param, { showLoading: true })
}
