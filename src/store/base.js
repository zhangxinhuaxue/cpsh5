import Vue from 'vue'
import VueResource from 'vue-resource'
import textEnum from 'libs/text.enum'
import { Toast } from '@fe/buss-ui'
import _Loading from 'components/loading/index.vue'
import { getStorage } from 'libs/util'
import { accessLogUtil, pageLoadLog, apiAccessLog } from 'src/libs/accessLog'
Vue.use(VueResource)

// 跨域允许传cookie
Vue.http.options.credentials = true
// For the form value to be recognized by the server, we need to have the emulateJSON:true
Vue.http.options.emulateJSON = true

const Loading = Vue.extend(_Loading)
const loadingInstance = new Loading({
    el: document.createElement('div'),
    propsData: {
        show: false,
        message: textEnum.LOADING
    }
})
loadingInstance.$el.id = 'loading'
// 多个ajax请求并行共用一个loadingInstance，第一个请求返回成功之后就会隐藏loadingInstance
// 导致剩余请求返回之前页面没有loading遮罩，造成用户体验不好
// 是否还有其他ajax请求依赖当前loadingInstance
loadingInstance.deps = 0
document.body.appendChild(loadingInstance.$el)

const hideLoading = (extend) => {
    if (extend && extend.showLoading && !loadingInstance.deps) {
        loadingInstance.show = false
        return false
    }
    loadingInstance.deps && loadingInstance.deps--
}

// 接口拦截器
Vue.http.interceptors.push(function(request, next) {
    // 添加跨域允许cookie设置，默认情况下跨域请求不允许携带cookie
    request.credentials = true

    // 页面初始化加载逻辑处理
    pageLoadLog('+')

    // 接口headers添加唯一链路码
    let eventId = accessLogUtil.getEventId('api')
    // 暂时只在相对路径（同域下）接口添加X-TRACE-ID，否则存在跨域问题（后面和后端一起改掉）
    // if (/^\/\w+/.test(request.url) && request.url.indexOf('/access/log') < 0) {
    if (request.url.indexOf('/access/log') < 0) {
        request.headers.set('X-TRACE-ID', eventId)
    }

    // 统计接口响应时间
    let startTime = Date.now()
    next((response) => {
        // 页面初始化加载逻辑处理
        pageLoadLog('-')
        // 接口上报数据处理
        apiAccessLog(request, response, eventId, startTime)
        if (response.status === 0) {
            Toast.show('网络连接失败，请检查网络')
        }
        return response
    })
})


export const formatRet = (data, url) => {
    // const requestUrl = url ? ((url.indexOf('http') === 0 ? '' : window.location.origin) + url) : ''
    const result = data.ret || data
    // try {
    //     let msg = result.resultDes || ''
    //     if(msg === '系统繁忙，请稍后再试' && requestUrl) {
    //         const apiOwnerList = getStorage('apiOwnerList')
    //         let owner = '010'
    //         if (Array.isArray(apiOwnerList) && apiOwnerList.length > 0) {
    //             let ownerItem
    //             if(ownerItem = apiOwnerList.find(e => e.interfaceName === requestUrl)) {
    //                 owner = ownerItem.interfaceDutyCode || '012'
    //             } else {
    //                 owner = '011'
    //             }
    //         }
    //         msg = `系统繁忙，请稍后再试（${owner}）`
    //     }
    //     result.resultDes = msg
    // } catch (error) {
    //     console.log('数据解析异常:' + requestUrl)
    // }
    return result
}

export const _get = (url, data, callback, catchCallback) => {
    Vue.http.get(url, {
        params: data
    }).then(
        (response) => {
            callback(formatRet(response.data, url))
        },
        (response) => {
            if (!catchCallback) {
                console.log(response)
            } else {
                catchCallback()
            }
        }
    )
}

export const _post = (url, data, callback, catchCallback) => {
    Vue.http.post(url, data).then(
        (response) => {
            callback(formatRet(response.data, url))
        },
        (response) => {
            if (!catchCallback) {
                console.log(response)
            } else {
                catchCallback(response)
            }
        }
    )
}

// the promise way of get service data
export const _getPromise = (url, data, extend = {}) => {
    // if (data && typeof data === 'object') {
    //     for (var key of Object.keys(data)) {
    //         data[key] = data[key] || typeof data[key] === 'number' ? data[key] : ''
    //     }
    // }
    let condition = Object.assign(
        {
            showLoading: false, // 是否显示菊花转转
            isShowAllData: false // 是否显示完整data
        },
        extend
    )

    return new Promise((resolve, reject) => {
        if (condition.showLoading) {
            loadingInstance.show ? loadingInstance.deps++ : (loadingInstance.show = true)
        }

        let options = {
            params: data
        }

        if (extend.setHeaderUrlencoded) {
            Object.assign(options, {
                headers: { 'content-type': 'application/x-www-form-urlencoded' }
            })
        }
        Vue.http.get(url, options).then(
            (response) => {
                if (condition.isShowAllData) {
                    resolve(response.data)
                } else {
                    resolve(formatRet(response.data, url))
                }
                hideLoading(extend)
            },
            (response) => {
                if (response.status !== 0) {
                    Toast.show(`系统繁忙，请稍后再试（${response.status}）`)
                }
                hideLoading(extend)
            }
        )
    })
}

// the promise way of post service data
export const _postPromise = (url, data, extend = {}) => {
    if (data && typeof data === 'object') {
        for (var key of Object.keys(data)) {
            data[key] = data[key] || typeof data[key] === 'number' ? data[key] : ''
        }
    }
    return new Promise((resolve, reject) => {
        Vue.http.post(url, data, {
            emulateJSON: extend.json ? false : true,
            before(request) {
                if (extend.showLoading) {
                    loadingInstance.show ? loadingInstance.deps++ : (loadingInstance.show = true)
                    loadingInstance.message = extend.message || textEnum.LOADING
                }
                if (extend.setHeader) {
                    request.headers.set('X-Requested-With', 'XMLHttpRequest')
                }
                if (extend.setHeaderUrlencoded) {
                    request.headers.set('content-type', 'application/x-www-form-urlencoded')
                }
            }
        }).then(
            (response) => {
                resolve(formatRet(response.data, url))
                hideLoading(extend)
            },
            (response) => {
                // 手动埋点接口不做错误处理
                if (url.includes('/access/log') || url.includes('/mointoring') || url === '/aym') {
                    return false
                }
                if (response.status !== 0) {
                    Toast.show(`系统繁忙，请稍后再试（${response.status}）`)
                }
                hideLoading(extend)
            }
        )
    })
}

export const _BaseRequest = (url, data, extend = {}) => {
    let condition = Object.assign(
        {
            showLoading: false, // 是否显示菊花转转
            hideLoadingTime: 300, // 隐藏菊花时间
            isShowAllData: false, // 是否显示完整data
            methods: 'get' // 请求类型 get, jsonp ,post
        },
        extend
    )

    return new Promise((resolve, reject) => {
        if (condition.showLoading) {
            loadingInstance.show ? loadingInstance.deps++ : (loadingInstance.show = true)
        }
        if (data && typeof data === 'object') {
            for (var key of Object.keys(data)) {
                data[key] = data[key] || typeof data[key] === 'number' ? data[key] : ''
            }
        }
        // 成功
        let successFN = (resolve, response) => {
            condition.isShowAllData === true ? resolve(response.data) : resolve(formatRet(response.data, url))
            setTimeout(() => {
                hideLoading(extend)
            }, condition.hideLoadingTime)
        }

        let ajax = (methods, resolve) => {
            //  暂时支持 三种类型
            if (methods === 'get') {
                Vue.http.get(url, data).then(
                    (response) => {
                        successFN(resolve, response)
                    },
                    (response) => {
                        hideLoading(extend)
                    }
                )
            } else if (methods === 'post') {
                Vue.http.post(url, data).then(
                    (response) => {
                        successFN(resolve, response)
                    },
                    (response) => {
                        hideLoading(extend)
                    }
                )
            } else if (methods === 'jsonp') {
                Vue.http.jsonp(url, data).then(
                    (response) => {
                        successFN(resolve, response)
                    },
                    (response) => {
                        hideLoading(extend)
                    }
                )
            }
        }

        // 如果是开发环境那么所有请求都用get方式
        ajax(condition.methods, resolve)
    })
}
