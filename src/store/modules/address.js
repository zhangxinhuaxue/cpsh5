import { _postPromise, formatRet } from '../base'

// 获取收货地址列表
export const getdeliverList = () => {
    return _postPromise('/mall/deliver/getDeliver', null, { showLoading: true })
}

// 修改收货地址
export const getEdit = (param) => {
    return _postPromise('/mall/deliver/getEdit', param, { showLoading: true })
}

// 保存收货地址
export const saveDeliver = (param) => {
    return _postPromise('/mall/deliver/saveDeliver', param, { showLoading: true })
}

// 删除收货地址
export const deleteDeliver = (param) => {
    return _postPromise('/mall/deliver/deleteDeliver', param, { showLoading: true })
}
