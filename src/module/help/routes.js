// 我的收货地址管理页
const contact = () => import(/* webpackChunkName: 'help' */ './contact/index.vue')
const detail = () => import(/* webpackChunkName: 'help' */ './detail/index.vue')
const App = () => import(/* webpackChunkName: 'help' */ 'src/App.vue')

export default [{
    path: '/pages/help',
    component: App,
    children: [{
        path: 'contact',
        component: contact,
        name: 'contact',
        meta: {
            title: '帮助与客服'
        }
    }, {
        path: 'detail',
        component: detail,
        name: 'detail'
    }]
}]
