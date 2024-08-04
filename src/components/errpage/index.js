/**
 * vue errpage
 *
 * @usage:
 *
 * import axdErr from 'components/errpage/index.js'
 *
 * axdErr({
    errDes: 'upload complete', // 描述
    errTip: '出错啦', // 提示
    errTitle: '商品已下架', // title
    showBtn: true // 是否显示刷新按钮
  })
 *
 */

import Vue from 'vue'
import _Err from './errpage.vue'

const Err = Vue.extend(_Err)

let getAnInstance = () => {
    return new Err({
        el: document.createElement('div'),
        propsData: {
            show: false
        }
    })
}

let axdErr = (options) => {
    options = options || {}

    let removeErr = options.remove
    if (removeErr) {
        let errpage = document.getElementsByClassName('err_page')
        if (errpage.length) {
            errpage[0].remove()
        }
    } else {
        let instance = getAnInstance()

        let h5Bar = document.getElementsByClassName('aui-navbar')

        instance.errTitle = options.errTitle || document.title
        instance.errTip = options.errTip || '出错啦'
        instance.errDes = options.errDes || '系统繁忙，请稍后再试'
        instance.reloadOrBack = 'reload'
        instance.hasH5Bar = Boolean(h5Bar.length)
        if (options.showBtn !== undefined) {
            instance.showBtn = options.showBtn
        }

        let errpage = document.getElementsByClassName('err_page')
        if (!errpage.length) {
            Vue.nextTick(() => {
                document.body.appendChild(instance.$el)
            })
        }
    }
}

export default axdErr
