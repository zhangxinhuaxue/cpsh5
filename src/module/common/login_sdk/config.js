/*
 * 部分公用方法不再重写，直接调用所在项目中的方法。如果没有的话，在这里重写一下吧
 */

import {
    _postPromise
} from 'src/store/base'
import { Toast } from '@fe/buss-ui'
import {
    includeCss,
    getCookie,
    AXD
} from 'src/libs/util'

const configMixin = {
    data() {
        return {}
    },
    methods: {
        postPromise(reqUrl, data) {
            return _postPromise(reqUrl, data)
        },
        toast(message) {
            return Toast.show(message)
        },
        includeCss(cssUrl) {
            return includeCss(cssUrl)
        },
        getCookie(name) {
            return getCookie(name)
        },
        isWeixin() {
            return AXD.util.isWeixin()
        }
    }
}

export default configMixin
