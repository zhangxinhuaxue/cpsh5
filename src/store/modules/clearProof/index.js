import {
    _getPromise,
    _postPromise,
    _BaseRequest
} from '../../base'
// 结清证明 - 判断是否结清
export const isCanOpenProof = (param) => {
    return _postPromise('/oscar/settleProof/isCanOpenProof', param, { showLoading: true })
}
// 结清证明 - 生成证明
export const openProof = (param) => {
    return _postPromise('/oscar/settleProof/openProof', param, { showLoading: true })
}
// 结清证明 - 证明列表
export const queryRecords = (param) => {
    return _postPromise('/oscar/settleProof/queryRecords', param, { showLoading: true })
}
// 结清证明 - 下载证明
export const downloadProof = (param) => {
    return _postPromise('/oscar/settleProof/downloadProof', param, { showLoading: true })
}
// // 结清证明 - 下载证明
export const downloadUrl = (param) => {
    return _postPromise('/oscar/settleProof/downloadUrl', param, { showLoading: true })
}
