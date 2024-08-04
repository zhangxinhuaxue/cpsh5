const checkMsgCode = () => import('./views/check_msgcode.vue')
const checkcard = () => import('./views/checkcard.vue')
const setpwd = () => import('./views/setpwd.vue')
const confirmpwd = () => import('./views/confirmpwd.vue')
const App = () => import('./App.vue')

export default [{
    path: '/pages',
    component: App,
    children: [{
        path: 'checkmsg',
        component: checkMsgCode,
        name: 'payForgetPwd',
        meta: {
            title: '输入短信验证码'
        }
    }, {
        path: 'checkcard/:type', // forget=> 忘记密码. new  => 第一次设置
        component: checkcard,
        name: 'paySetPwdCommon',
        meta: {
            title: '设置支付密码'
        }
    }, {
        path: 'setpwd/:type',
        component: setpwd,
        name: 'setpwdcommon',
        meta: {
            title: '设置支付密码'
        }
    }, {
        path: 'confirmpwd/:type',
        component: confirmpwd,
        name: 'confirmpwdcommon',
        meta: {
            title: '确认支付密码'
        }
    }]
}]
