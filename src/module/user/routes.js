/* beautify preserve:start */
// 登录
const login = () => import(/* webpackChunkName: 'user_login' */ './login/login.vue')
const smslogin = () => import(/* webpackChunkName: 'user_smslogin' */ './login/smslogin.vue')
// 注册
const register = () => import(/* webpackChunkName: 'user_register' */ './register/index.vue')
const forgetpwd = () => import(/* webpackChunkName: 'user_forgetpwd' */ './forgetpwd/index.vue')

// 商城我的
const my = () => import(/* webpackChunkName: 'user_my_index' */ './my/index.vue')
const noopen = () => import(/* webpackChunkName: 'user_my_noopen' */ './my/noopen.vue')
const personal = () => import(/* webpackChunkName: 'user_my_personal' */ './my/dataAndHelp/personalData.vue')
const help = () => import(/* webpackChunkName: 'user_my_help' */ './my/dataAndHelp/help.vue')
const choose = () => import(/* webpackChunkName: 'user_my_choose' */ './my/dataAndHelp/dataChoose.vue')

// 账户解冻冻结
const accountStatus = () => import(/* webpackChunkName: 'account_status' */ './account/status.vue')
const accountResult = () => import(/* webpackChunkName: 'account_result' */ './account/result.vue')
const App = () => import(/* webpackChunkName: 'user_app' */ './App.vue')
/* beautify preserve:end */

export default [{
    path: '/pages/user/',
    component: App,
    redirect: 'login',
    children: [{
        path: 'login',
        component: login,
        name: 'login',
        meta: {
            title: '招集令账户登录'
        }
    }, {
        path: 'smslogin',
        component: smslogin,
        name: 'smslogin',
        meta: {
            title: '快速登录/注册'
        }
    }, {
        path: 'register',
        component: register,
        name: 'register',
        meta: {
            title: '注册'
        }
    }, {
        path: 'forgetpwd',
        component: forgetpwd,
        name: 'forgetpwd',
        meta: {
            title: '找回登录密码'
        }
    }]
}, {
    path: '/pages/put',
    component: App,
    children: [{
        // 商城我的
        path: 'my',
        component: my,
        name: 'my',
        meta: {
            title: '我的'
        },
        children: [{
            path: 'noopen',
            component: noopen,
            name: 'noopen',
            meta: {
                title: '更新提示'
            }
        }, {
            path: 'help',
            component: help,
            name: 'help',
            meta: {
                title: '帮助'
            }
        }, {
            path: 'choose',
            component: choose,
            name: 'choose',
            meta: {
                title: '个人资料'
            },
            children: [{
                path: 'personal',
                component: personal,
                name: 'personal',
                meta: {
                    title: '个人资料'
                }
            }]
        }]
    }]
}, {
    path: '/pages/account/status', // 状态
    component: accountStatus,
    name: 'accountStatus',
    meta: {
        title: '信用账户管理'
    }
}, {
    path: '/pages/account/result', // 结果
    component: accountResult,
    name: 'accountResult',
    meta: {
        title: '信用账户管理'
    }
}]
