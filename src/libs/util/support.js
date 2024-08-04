import { Toast } from '@fe/buss-ui'
import { getUA } from './util'
import { isZjl, isAndroid, isMjb } from './env'

export const appVersion = getUA('version')

export  const newerVersionThan = (verison) => {
    if (!verison) return false
    const curr = appVersion.split('.')
    const target = verison.split('.')
    for (let i = 0; i < curr.length; i++) {
        if (~~curr[i] < ~~target[i]) {
            return false
        }
        if (~~curr[i] > ~~target[i]) {
            return true
        }
    }
    return true
}

export const entireSupport = true
export const supportShareChannels = true
export const permissionCheckSupport = isZjl && isAndroid ? newerVersionThan('1.3.4') : isMjb

export function isSupportStorage(storage, str) {
    try {
        storage.setItem(str, '1')
        storage.removeItem(str)
        return true
    } catch (error) {
        return false
    }
}
// 浏览器是否支持 localstorage
export function isSupportLocalStorage() {
    try{
        var storage = window.localStorage
        return isSupportStorage(storage, 'testLocal')
    }catch(e){
        return false
    }

}

export function isSupportSessionStorage() {
    try{
        var storage = window.sessionStorage
        return isSupportStorage(storage, 'testSession')
    }catch(e){
        return false
    }
}

export function setLocalStorage(key, value) {
    if (isSupportLocalStorage()) {
        localStorage.setItem(key, value)
        return true
    } else {
        Toast.show('请取消浏览器无痕浏览模式，或取消cookie禁用')
        return false
    }
}
export function setSessionStorage(key, value) {
    if (isSupportSessionStorage()) {
        sessionStorage.setItem(key, value)
        return true
    } else {
        Toast.show('请取消浏览器无痕浏览模式，或取消cookie禁用')
        return false
    }
}
export function  getLocalStorage(key = '') {
    if(isSupportLocalStorage()){
        return localStorage.getItem(key)
    }else{
        return ''
    }
}
export function removeLocalStorage(key = '') {
    if(isSupportLocalStorage()){
        localStorage.removeItem(key)
        return true
    }else{
        return false
    }
}
// can use webp?
export function canUseWebP() {
    if (isSupportLocalStorage() && window.localStorage.getItem('webpsupport') !== null) {
        var val = window.localStorage.getItem('webpsupport')
        return val === 'true'
    }

    var elem = document.createElement('canvas')
    var isSupport = false
    if (elem.getContext && elem.getContext('2d')) {
        // was able or not to get WebP representation
        isSupport = elem.toDataURL('image/webp').indexOf('data:image/webp') == 0
    } else {
        // very old browser like IE 8, canvas not supported
        isSupport = false
    }
    if (isSupportLocalStorage()) {
        window.localStorage.setItem('webpsupport', isSupport.toString())
    }
    return isSupport
}
