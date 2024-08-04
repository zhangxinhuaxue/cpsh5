/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
/* global Image */
if (!Array.prototype.$remove) {
    Array.prototype.$remove = function (item) {
        if (!this.length) return
        const index = this.indexOf(item)
        if (index > -1) {
            return this.splice(index, 1)
        }
    }
}

export default (Vue, Options = {}) => {
    const isVueNext = Vue.version.split('.')[0] === '2'

    // 这里设置了一个开关，当transpDefaultImg为true时，默认图片为透明图片
    const DEFAULT_URL = Options.bgImgUrl || (Options.transpDefaultImg ? '//img.aiyoumi.com/null/2018423/101212916/20180423101212_1x1.png?height=1&width=1' : '//img.aiyoumi.com/cpsImg/20201012184525_640x640.gif')

    const Init = {
        preLoad: Options.preLoad || 1.8,
        error: Options.error || DEFAULT_URL,
        loading: Options.loading || DEFAULT_URL,
        attempt: Options.attempt || 3,
        scale: Options.scale || window.devicePixelRatio,
        hasbind: false
    }

    const Listeners = []
    const imageCache = []

    const throttle = function (action, delay) {
        let timeout = null
        let lastRun = 0
        return function () {
            if (timeout) {
                return
            }
            let elapsed = (+new Date()) - lastRun
            let context = this
            let args = arguments
            let runCallback = function () {
                lastRun = +new Date()
                timeout = false
                action.apply(context, args)
            }
            if (elapsed >= delay) {
                runCallback()
            } else {
                timeout = setTimeout(runCallback, delay)
            }
        }
    }

    const _ = {
        on(el, type, func) {
            el.addEventListener(type, func)
        },
        off(el, type, func) {
            el.removeEventListener(type, func)
        }
    }

    const lazyLoadHandler = throttle(() => {
        for (let i = 0, len = Listeners.length; i < len; ++i) {
            checkCanShow(Listeners[i])
        }
    }, 300)

    const onListen = (el, start) => {
        if (start) {
            _.on(el, 'scroll', lazyLoadHandler)
            _.on(el, 'wheel', lazyLoadHandler)
            _.on(el, 'mousewheel', lazyLoadHandler)
            _.on(el, 'resize', lazyLoadHandler)
            _.on(el, 'animationend', lazyLoadHandler)
            _.on(el, 'transitionend', lazyLoadHandler)
        } else {
            Init.hasbind = false
            _.off(el, 'scroll', lazyLoadHandler)
            _.off(el, 'wheel', lazyLoadHandler)
            _.off(el, 'mousewheel', lazyLoadHandler)
            _.off(el, 'resize', lazyLoadHandler)
            _.off(el, 'animationend', lazyLoadHandler)
            _.off(el, 'transitionend', lazyLoadHandler)
        }
    }

    const checkCanShow = (listener) => {

        // if (imageCache.indexOf(listener.src) == -1) {
        if (listener.el.getAttribute('lazy') == 'loading') {
            // return setElRender(listener.el, listener.bindType, listener.src, 'loaded')
            let rect = listener.el.getBoundingClientRect()
            if ((rect.top < window.innerHeight * Init.preLoad && rect.bottom >= 0) && (rect.left < window.innerWidth * Init.preLoad && rect.right >= 0)) {
                render(listener)
            }
        }
    }

    const setElRender = (el, bindType, src, state) => {
        if (!bindType) {
            el.setAttribute('src', src)
            if (el.parentNode) {
                el.parentNode.style.backgroundColor = 'transparent'

                // 解决父盒子高度计算不准确引发的白线问题
                // 应该在image元素状态从loading过渡到loaded以后添加，否则会导致在loading状态的默认背景图片被拉伸
                if (state === 'loaded' && el.getAttribute('class') && el.getAttribute('class').indexOf('img_absolute') > -1) {
                    let parentH = window.getComputedStyle(el.parentNode).height.split('px')[0]

                    el.style.cssText = 'position: static;transform: translateY(0);-webkit-transform: translateY(0);top: 0;height:' + parentH + 'px'
                    el.parentNode.style.height = 'auto'
                }
            }
        } else {
            el.setAttribute('style', bindType + ': url(' + src + ')')
        }

        // 默认会给图片添加有渐显效果的类名
        if (state === 'loaded' && (el.className.indexOf('animation__fade') === -1)) {
            el.className += ' animation__fade'
        }
        el.setAttribute('lazy', state)
    }

    const render = (item) => {
        if (item.attempt >= Init.attempt) {
            return false
        }
        item.attempt += 1
        loadImageAsync(item)
            .then((image) => {
                setElRender(item.el, item.bindType, item.src, 'loaded')
                imageCache.push(item.src)
                Listeners.$remove(item)
            })
            .catch((error) => {
                setElRender(item.el, item.bindType, item.error, 'error')
            })
    }

    const loadImageAsync = (item) => {
        return new Promise((resolve, reject) => {
            let image = new Image()
            image.src = item.src

            image.onload = function () {
                resolve({
                    naturalHeight: image.naturalHeight,
                    naturalWidth: image.naturalWidth,
                    src: item.src
                })
            }

            image.onerror = function () {
                reject()
            }
        })
    }

    const componentWillUnmount = (el, binding, vnode, OldVnode) => {
        if (!el) {
            return
        }

        for (let i = 0, len = Listeners.length; i < len; i++) {
            if (Listeners[i] && Listeners[i].el === el) {
                Listeners.splice(i, 1)
            }
        }

        if (Init.hasbind && Listeners.length === 0) {
            onListen(window, false)
        }
    }

    const checkElExist = (el) => {
        let hasIt = false

        Listeners.forEach((item) => {
            if (item.el === el) hasIt = true
        })

        if (hasIt) {
            return Vue.nextTick(() => {
                lazyLoadHandler()
            })
        }
        return hasIt
    }

    const addListener = (el, binding, vnode) => {
        /* if (el.getAttribute('lazy') === 'loaded') {
            return
        }
        if (checkElExist(el)) {
            return
        } */

        let parentEl = null
        let imageSrc = binding.value
        let imageLoading = Init.loading
        let imageError = Init.error

        if (typeof binding.value !== 'string') {
            imageSrc = binding.value.src
            imageLoading = binding.value.loading || Init.loading
            imageError = binding.value.error || Init.error
        }
        if (binding.modifiers) {
            parentEl = window.document.getElementById(Object.keys(binding.modifiers)[0])
        }

        setElRender(el, binding.arg, imageLoading, 'loading')

        vnode.context.$nextTick(() => {
            Listeners.push({
                bindType: binding.arg,
                attempt: 0,
                parentEl: parentEl,
                el: el,
                error: imageError,
                src: imageSrc
            })

            if (Listeners.length > 0 && !Init.hasbind) {
                Init.hasbind = true
                if (Options.scrollEl) {
                    setTimeout(() => {
                        let eles = [...document.querySelectorAll(Options.scrollEl)]
                        eles.forEach(el => {
                            onListen(el, true)
                        })
                    }, 500)
                } else {
                    onListen(window, true)
                }
            }
            if (parentEl) {
                onListen(parentEl, true)
            }
            lazyLoadHandler()
        })
    }

    if (isVueNext) {
        Vue.directive('lazy', {
            bind: addListener,
            update: addListener,
            componentUpdated: lazyLoadHandler,
            unbind: componentWillUnmount
        })
    } else {
        Vue.directive('lazy', {
            bind: lazyLoadHandler,
            update(newValue, oldValue) {
                addListener(this.el, {
                    modifiers: this.modifiers,
                    arg: this.arg,
                    value: newValue,
                    oldValue: oldValue
                })
            },
            unbind() {
                componentWillUnmount(this.el)
            }
        })
    }
}
