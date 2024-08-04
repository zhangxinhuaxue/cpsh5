// prefix: 父页面前缀
// part: 父页面所在模块
const addressList = () => import(/* webpackChunkName: 'address_list' */ './list.vue')
const addressAdd = () => import(/* webpackChunkName: 'address_add' */ './add.vue')
const App = () => import(/* webpackChunkName: 'address_app' */ './App.vue')
export const routesProduct = (prefix = '/pages/address', part = 'address.vue') => {
    return [{
        path: prefix,
        component: App,
        children: [{
            path: 'list',
            component: addressList,
            name: part + 'List',
            meta: {
                title: '收货地址管理'
            }
        }, {
            path: 'add',
            component: addressAdd,
            name: part + 'Add',
            meta: {
                title: '新建地址'
            }
        }, {
            path: 'edit',
            component: addressAdd,
            name: part + 'Edit',
            meta: {
                title: '修改地址'
            }
        }]
    }]
}
