import { _getPromise, _postPromise } from 'src/store/base'
// 获取小浮标配置
export const tradeShareConfig = (param) => {
    return _postPromise('/mall/trade/v3/tradeShareConfig', param, { showLoading: true })
}
