import { _postPromise, _getPromise } from '../../base'

// 查询用户账户状态
export const queryAccountStatus = (param) => {
    return _postPromise('/oscar/loan/queryAccountStatus', param)
}
export const toggleUserAccount = (param) => {
    return _postPromise('/app/loan/operateUserAccount', param)
}
