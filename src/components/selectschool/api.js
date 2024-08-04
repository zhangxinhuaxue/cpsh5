import { _getPromise, _postPromise } from 'src/store/base'
// 获取学校列表-h5
export const schoolsNew = () => {
    return _getPromise('/common/schoolsNew', null, { showLoading: true })
}
// 学校查询-h5
export const schoolSerach = (param) => {
    return _getPromise('/common/schoolSerach', param, { showLoading: true })
}
// 获取学校列表-app
export const schoolsNewApp = () => {
    return _getPromise('/app/common/schoolsNew', null, { showLoading: true })
}
// 学校查询-app
export const schoolSerachApp = (param) => {
    return _getPromise('/app/common/schoolSerach', param, { showLoading: true })
}
