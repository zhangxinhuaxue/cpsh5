import { _getPromise, _postPromise } from '../../base'

/* 初始化白名单url */
export const renderDataForWhite = (param) => {
    return _postPromise('/cms/renderDataForBlockType', param)
}