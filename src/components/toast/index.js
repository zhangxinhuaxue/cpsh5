/**
 * vue toast
 *
 * @usage:
 *
 * import axdToast from 'components/toast/index.js'
 * axdToast('upload complete')
 *
 * or
 * axdToast({
    message: 'upload complete',
    position: 'bottom',
    iconClass: 'icon-success',
    duration: 3000
  })
 *
 */

import Vue from 'vue'
import _Toast from './toast.vue'

const Toast = Vue.extend(_Toast)
let toastPool = []

let getAnInstance = () => {
    if (toastPool.length > 0) {
        let instance = toastPool[0]
        toastPool.splice(0, 1)
        return instance
    }
    return new Toast({
        el: document.createElement('div'),
        propsData: {
            show: false
        }
    })
}

/* let returnAnInstance = (instance) => {
    if (instance) {
        toastPool.push(instance)
    }
} */

let axdToast = (options) => {
    options = options || {}

    let message, position, duration, className, iconClass, overlay, callback

    if (typeof options === 'string') {
        message = options
        duration = 2000
        position = 'middle'
        className = ''
        iconClass = ''
        overlay = true
    } else {
        message = options.message
        duration = options.duration || 2000
        position = options.position || 'middle'
        className = options.className || ''
        iconClass = options.iconClass || ''
        callback = options.callback || null
        overlay = options.overlay === false ? options.overlay : true
    }

    let instance = getAnInstance()

    instance.message = message
    instance.position = position
    instance.className = className
    instance.iconClass = iconClass
    instance.callback = callback
    instance.duration = duration
    instance.overlay = overlay
    instance.show = true

    Vue.nextTick(() => {
        document.body.appendChild(instance.$el)
        setTimeout(() => {
            // instance.$el.remove()
            instance.$el.parentNode.removeChild(instance.$el)
            instance.show = false
            instance.$destroy()
            instance.callback && instance.callback()

            // returnAnInstance(instance)
        }, duration)
    })
}

export default axdToast
