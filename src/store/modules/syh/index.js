import {
    _getPromise,
    _postPromise
} from '../../base'
// 获取随意花列表
export const getTrafficList = (param) => {
    return _postPromise('/app/traffic/list', param, { showLoading: true })
}

export const getTrafficUrl = (param) => {
    return _postPromise('/app/traffic/click', param, { showLoading: true })
}
