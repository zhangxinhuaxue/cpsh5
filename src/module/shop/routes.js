const App = () => import(/* webpackChunkName: 'shop_App' */ './App.vue')
const home = () => import(/* webpackChunkName: 'shop_index' */ './home/index.vue')
const groupList = () => import(/* webpackChunkName: 'shop_groupList' */ './group/index.vue')
const groupProducts = () => import(/* webpackChunkName: 'shop_group_roducts' */ './group/products.vue')
const customProducts = () => import(/* webpackChunkName: 'shop_custom_products' */ './custom/index.vue')
const topicProducts = () => import(/* webpackChunkName: 'shop_topic_products' */ './topic/index.vue')
const contact = () => import(/* webpackChunkName: 'shop_contact' */ './contact/index.vue')
const license = () => import(/* webpackChunkName: 'shop_license' */ './contact/license.vue')
const collection = () => import(/* webpackChunkName: 'shop_collection' */ './collection/index.vue')

export default [{
    path: '/pages/shop',
    component: App,
    children: [{
        path: 'index/:shopId(\\d+)',
        component: home,
        name: 'shopHome',
        meta: {
            title: ' ',
            keepAlive: true
        }
    }, {
        path: 'group/list/:shopId(\\d+)',
        component: groupList,
        name: 'groupList',
        meta: {
            title: '商品分类',
            keepAlive: true
        }
    }, {
        path: 'group/products/:groupId(\\d+)',
        component: groupProducts,
        name: 'groupProducts',
        meta: {
            title: '...'
        }
    }, {
        path: 'custom/:id(\\d+)',
        component: customProducts,
        name: 'customProducts',
        meta: {
            title: '...',
            keepAlive: true
        }
    }, {
        path: 'topic/:id(\\d+)',
        component: topicProducts,
        name: 'topicProducts',
        meta: {
            title: ' '
        }
    }, {
        path: 'contact/:shopId(\\d+)',
        component: contact,
        name: 'shopContact',
        meta: {
            title: ' '
        }
    }, {
        path: 'license/:shopId(\\d+)',
        component: license,
        name: 'shopLicense',
        meta: {
            title: '工商执照'
        }
    }, {
        path: 'myCollection',
        component: collection,
        name: 'myCollection',
        meta: {
            title: '店铺收藏'
        }
    }]
}]
