import setpwdRouter from 'module/common/setpwd/routes'

/* beautify preserve:start */

const demolist = resolve => require(['./index.vue'], resolve)
const toast = resolve => require(['./list/toast.vue'], resolve)
const picker1 = resolve => require(['./list/picker1.vue'], resolve)
const pickerExam = resolve => require(['./list/pickerExam.vue'], resolve)
const pwdDot = resolve => require(['./pwd_input/dot.vue'], resolve)
const pwdText = resolve => require(['./pwd_input/clear_text.vue'], resolve)
const pwdDemo = resolve => require(['./pwdpage/index.vue'], resolve)
const creditDemo = resolve => require(['./credit-system/index.vue'], resolve)

const callapp = () => import(/* webpackChunkName: 'callapp' */ './callapp/index.vue')
const App = resolve => require(['./App.vue'], resolve)
/* beautify preserve:end */
const routes = [{
    path: '/demo',
    component: App,
    children: [{
        path: '/',
        component: demolist,
        name: 'demolist',
        meta: {
            title: 'demolist'
        }
    }, {
        path: 'toast',
        component: toast,
        name: 'toast',
        meta: {
            title: 'demo toast'
        }
    }, {
        path: 'picker1',
        component: picker1,
        name: 'picker1',
        meta: {
            title: 'demo picker by pinuts'
        }
    }, {
        path: 'multypicker',
        component: pickerExam,
        name: 'multypicker',
        meta: {
            title: 'demo multypicker'
        }
    }, {
        path: 'pwd_dot',
        component: pwdDot,
        name: 'pwd_dot',
        meta: {
            title: 'demo pwd_dot'
        }
    }, {
        path: 'pwd_text',
        component: pwdText,
        name: 'pwd_text',
        meta: {
            title: 'demo pwd_text'
        }
    }, {
        path: 'pwd_demo',
        component: pwdDemo,
        name: 'pwd_demo',
        meta: {
            title: 'demo pwd_set'
        },
        children: setpwdRouter
    }, {
        path: 'callapp',
        component: callapp,
        name: 'callapp',
        meta: {
            title: 'demo app'
        }
    }, {
        path: 'credit',
        component: creditDemo,
        name: 'credit_demo',
        meta: {
            title: 'demo credit'
        }
    }]
}]
let _routers = [{
    path: '/pages/demo',
    component: App,
    children: [{
        path: 'callapp',
        component: callapp,
        name: 'callapp',
        meta: {
            title: 'demo app'
        }
    }]
}]

// if (process.env.NODE_ENV !== 'production') {
//     _routers = routes
// }
export default _routers
