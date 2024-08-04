import { _getPromise, _postPromise } from 'src/store/base'
const domain = window.aixuedai.activityWebH5 || ''
// 发红包
export const createShareByItemId = (param) => {
    return _postPromise(domain + '/share/createShareByItemId', param, { showLoading: true, setHeader: true })
}
