// import userStatusChoose from './userStatusChoose'
// import userInfoSupp from './userInfoSupp'
// import selectSchool from './selectSchool'
const userStatusChoose = () => import(/* webpackChunkName: 'user_status_choose' */ './userStatusChoose.vue')
const userInfoSupp = () => import(/* webpackChunkName: 'user_info_supp' */ './userInfoSupp.vue')
const selectSchool = () => import(/* webpackChunkName: 'select_school' */ './selectSchool.vue')

export default [{
    path: 'userStatusChoose',
    component: userStatusChoose,
    meta: {
        title: '请选择身份'
    }
}, {
    path: 'userInfoSupp',
    component: userInfoSupp,
    meta: {
        title: '身份信息补充'
    },
    children: [{
        path: 'selectSchool',
        component: selectSchool,
        meta: {
            title: '选择学校'
        }
    }]
}]
