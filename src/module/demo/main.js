import Vue from 'vue'
import VueRouter from 'vue-router'
import Activity from './App'
import routerConfig from './routes'
import {
    install as Global
} from './global'

Vue.use(VueRouter)
Vue.use(Global)

const router = new VueRouter({
    mode: 'history',
    base: __dirname,
    routes: routerConfig
})
Vue.config.devtools = (process.env.NODE_ENV !== 'production')
new Vue({
    el: '#app',
    router,
    render: h => h(Activity)
})
