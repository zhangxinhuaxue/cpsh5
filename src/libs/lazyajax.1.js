/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */

if (!Array.prototype.$remove) {
    Array.prototype.$remove = function(item) {
        if (!this.length) return
        const index = this.indexOf(item)
        if (index > -1) {
            return this.splice(index, 1)
        }
    }
}
export default (Vue, Options = {}) => {
    const Init = {
        preLoad: Options.preLoad || 1.5,
        attempt: Options.attempt || 3,
        scale: Options.scale || window.devicePixelRatio,
        hasbind: false
    }

    const Listeners = []

    const throttle = function(action, delay) {
        let timeout = null
        let lastRun = 0
        return function() {
            if (timeout) {
                return
            }
            let elapsed = +new Date() - lastRun
            let context = this
            let args = arguments
            let runCallback = function() {
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
        if (listener.el.getAttribute('lazy') === 'loaded') {
            return
        }
        let rect = listener.el.getBoundingClientRect()
        if (rect.top < window.innerHeight * Init.preLoad && rect.bottom > 0 && rect.left < window.innerWidth * Init.preLoad && rect.right > 0) {
            render(listener)
        }
    }

    const setElRender = (el, state) => {
        el.setAttribute('lazy', state)
    }

    const render = (item) => {
        if (item.attempt >= Init.attempt) {
            return false
        }
        item.attempt += 1
        loadAjax(item).then(
            () => {
                setElRender(item.el, 'loaded')
                Listeners.$remove(item)
            },
            (error) => {}
        )
    }

    const loadAjax = (item) => {
        return new Promise((resolve, reject) => {
            resolve(item.callback())
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
        if (el.getAttribute('lazy') === 'loaded') {
            return
        }
        if (checkElExist(el)) {
            return
        }

        let parentEl = null
        // let callback = binding.value

        if (binding.modifiers) {
            parentEl = window.document.getElementById(Object.keys(binding.modifiers)[0])
        }

        setElRender(el, 'loading')

        vnode.context.$nextTick(() => {
            Listeners.push({
                bindType: binding.arg,
                attempt: 0,
                parentEl: parentEl,
                el: el,
                callback: binding.value
            })
            lazyLoadHandler()
            if (Listeners.length > 0 && !Init.hasbind) {
                Init.hasbind = true
                if (Options.scrollEl) {
                    setTimeout(() => {
                        let eles = [...document.querySelectorAll(Options.scrollEl)]
                        eles.forEach((el) => {
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
        })
    }

    Vue.directive('lazyajax', {
        bind: addListener,
        update: addListener,
        componentUpdated: lazyLoadHandler,
        unbind: componentWillUnmount
    })
}
