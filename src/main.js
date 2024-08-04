import 'core-js/features/array'
import 'assets/js/base'

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import configRouter from './routes'
import 'src/libs/analytics'
import './filters'
import { initNav } from 'components/bottomnav/init'
import store from 'src/store/index'
import { isAym, isApp } from 'src/libs/util/env'

import 'libs/axdApp.js'
import { includeJs, setStorage, getStorage } from 'src/libs/util'
import { _postPromise } from 'src/store/base'

import Global from './global'
import { install as tradeGlobal } from 'src/module/trade/global'

import { resetHeader } from 'components/header/resetHeader'
import _Loading from 'components/loading/page.loading.vue'
import { accessLogUtil } from 'src/libs/accessLog'

Vue.use(Global)
Vue.use(tradeGlobal)

Vue.use(VueRouter)
const Loading = Vue.extend(_Loading)
const loadingInstance = new Loading({
    el: document.createElement('div'),
    propsData: {
        show: true
    }
})
loadingInstance.$el.id = 'pageloading'
document.body.appendChild(loadingInstance.$el)

try{
    // ios 低版本 返回出错 orign path 错位
    if(window.history && 'replaceState' in window.history){
        window.history.replaceState(null, '', location.href)
    }
}catch(e){}


// 兼容爱又米和召集令的样式
if (isAym) {
    document.body.className += ' aym'
}

// 从APP返回H5的时候会调用此方法，定义一下防止报错，可在业务内部重新定义以覆盖
window.axdBackFunc = () => {}
window.onAxdLogin = () => {}

const router = new VueRouter({
    mode: 'history',
    routes: configRouter,
    linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
    // 跳转页面前开始时间等逻辑处理
    accessLogUtil.beforeRoute()

    document.title = to.meta.title || '招集令'

    loadingInstance.show = true

    let bottomNav = document.querySelector('#bottom-nav')
    if (bottomNav) {
        bottomNav.remove()
    }
    if (to.name == 'my' && !isApp) {
        if (to.query.from === 'bottomnav') {
            initNav(router)
        }
    }

    if (!to.query.url && from.query.url) {
        to.query.url = from.query.url
        to.query.newUrl = from.query.newUrl
    }

    next()
})

router.afterEach((to, from) => {
    // 埋点进入页面后逻辑处理
    accessLogUtil.afterRoute(to, from)
    loadingInstance.show = false
})
router.onError((err) => {
    loadingInstance.show = false
    // window.Sentry && window.Sentry.captureErr({ type: 'DIY', title: 'router error:' + err})
})
// 生产环境
// if (process.env.NODE_ENV === 'production') {
//     // 引入邦盛的二代指纹
//     let today = new Date()
//     let ymd = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate()
//     includeJs('https://acf.aiyoumi.com/public/downloads/frms-fingerprint.js?custID=default&serviceUrl=https://acf.aiyoumi.com/public/generate/jsonp&loadSource=script&type=1&ymd=' + ymd)
// }

new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App)
})

// let apiOwnerList = getStorage('apiOwnerList')
// if (!Array.isArray(apiOwnerList) || apiOwnerList.length === 0) {
//     _postPromise(window.aixuedai.apiGateway + '/monitoring/mointoring/interfaceInfos', {
//         type: 'http'
//     }, {json: true}).then(res => {
//         if(res.success) {
//             setStorage('apiOwnerList',res.data, 360)
//         }
//     }).catch(() => {
//         setStorage('apiOwnerList', null)
//     })
// }