import { _postPromise, _getPromise, formatRet } from '../../base'
import debounce from 'lodash/debounce'

/* ================学信网认证================= */
let devProtocol = 'https://'
let devPrefix = 'credit-server'
let devPort = '1445'
// let curDomain = 'app.aiyoumi.com'
let curDomain = window.location.hostname.replace('aixuedai', 'aiyoumi')
let targetDomain = devProtocol + curDomain.replace(/^(m|app)/, devPrefix)
if (/^(m|app)\-/.test(curDomain)) {
    targetDomain = targetDomain + ':' + devPort
}
if (process.env.NODE_ENV !== 'production') {
    // targetDomain = devProtocol + devPrefix + '-aliyun1.aiyoumi.com:' + devPort
    targetDomain = ''
}

export const getChsiEntry = (param) => {
    return _postPromise(targetDomain + '/xxw/url/get', param, { showLoading: false })
}

export const getChsiResult = (param) => {
    return _postPromise(targetDomain + '/xxw/result/get', param, { showLoading: true })
}
