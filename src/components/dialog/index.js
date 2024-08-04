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
import _Dialog from './dialog.vue'

const Dialog = Vue.extend(_Dialog)
let modalPool = []

let getAnInstance = () => {
    if (modalPool.length > 0) {
        let instance = modalPool[0]
        modalPool.splice(0, 1)
        return instance
    }
    return new Dialog({
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

let axdDialog = (options) => {
    options = options || {}

    let title, content, buttons

    if (typeof options === 'string') {
        title = '提示'
        content = options
        buttons = [{
            text: '确定',
            onClick: function() {

            }
        }]
    } else {
        title = options.title
        content = options.content || ''
        buttons = options.buttons
    }

    let instance = getAnInstance()

    instance.title = title
    instance.content = content
    instance.buttons = buttons
    instance.show = true

    Vue.nextTick(() => {
        document.body.appendChild(instance.$el)
        returnAnInstance(instance)
    })
}

export default axdDialog
