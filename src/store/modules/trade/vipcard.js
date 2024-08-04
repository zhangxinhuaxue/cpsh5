import { _getPromise, _postPromise } from '../../base'

// 米卡落地页
export const getSkuInfo = (param) => {
    return _getPromise('/rights/memberSkuList', param, { showLoading: true })
}


export const getCardList = (param) => {
    return _getPromise('/api/aplus/preOrder', param, { showLoading: true })
}

export const getOrderList = (param) => {
    return _getPromise('/api/aplus/refund/lastItem', param, { showLoading: true })
}

export const returnCard = (param) => {
    return _postPromise('/api/aplus/refund/apply', param, { showLoading: true })
}
