import { isApp } from 'src/libs/util'
let setHeader = function(config, fn) {
    let cb = fn && typeof fn === 'function' ? fn : () => {}
    let params = Object.assign({
        visible: true,
        color: '#ffffff',
        leftbuttonVisible: true,
        rightbuttonVisible: false
    }, config||{})
    if (isApp) {
        axdApp.send({
            module: 'webview',
            method: 'configNavigationBar',
            repeat: true,
            params: params,
            callback: function(data) {
                cb()
            }
        })
        return
    }
    cb()
}

let resetHeader = function(fn) {
    let cb = fn && typeof fn === 'function' ? fn : () => {}
    if (isApp) {
        axdApp.send({
            module: 'webview',
            method: 'configNavigationBar',
            repeat: true,
            params: {
                visible: true,
                color: '#ffffff',
                leftbuttonVisible: true,
                rightbuttonVisible: false
            },
            callback: function(data) {
                cb()
            }
        })
        return
    }
    cb()
}

let hideHeader = function(fn) {
    let cb = fn && typeof fn === 'function' ? fn : () => {}
    if (isApp) {
        axdApp.send({
            module: 'webview',
            method: 'configNavigationBar',
            repeat: true,
            params: {
                visible: false
            },
            callback: function(data) {
                cb()
            }
        })
        return
    }
    cb()
}

export { setHeader, resetHeader, hideHeader }
