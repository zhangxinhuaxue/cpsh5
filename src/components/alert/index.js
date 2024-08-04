/**
 * vue toast
 *
 * @usage:
 *
 * import axdAlert from 'components/modal/index.vue'
 * axdAlert('upload complete')
 *
 * or
 * axdAlert({
    title: 'upload',
    content: 'upload complete',
    okText: 'okok',
    onOk: () => {
        console.log('ok button clicked')
    }
  })
 *
 */

import Vue from 'vue'
import _Alert from './alert.vue'

const Alert = Vue.extend(_Alert)
let modalPool = []

let getAnInstance = () => {
    if (modalPool.length > 0) {
        let instance = modalPool[0]
        modalPool.splice(0, 1)
        return instance
    }
    return new Alert({
        el: document.createElement('div'),
        propsData: {
            show: false
        }
    })
}

let returnAnInstance = (instance) => {
    if (instance) {
        modalPool.push(instance)
    }
}

let axdAlert = (options) => {
    options = options || {}

    let title, content, okText, onOk

    if (typeof options === 'string') {
        title = '提示'
        content = options
        okText = '确定'
    } else {
        title = options.title
        content = options.content || ''
        okText = options.okText || '确定'
        onOk = options.onOk
    }

    let instance = getAnInstance()

    instance.title = title
    instance.content = content
    instance.okText = okText
    instance.onOk = onOk
    instance.show = true

    Vue.nextTick(() => {
        document.body.appendChild(instance.$el)
        returnAnInstance(instance)
    })
}

export default axdAlert
