
const SIMCard = () => import(/* webpackChunkName: 'sim_card' */ './detail/index.vue')
const SIMCardAddress = () => import(/* webpackChunkName: 'sim_card_address' */ './address/index.vue')

export default [
    {
        path: '/pages/mall/sim-card',
        component: SIMCard,
        name: 'SIMCard',
        meta: {
            title: '免费领取手机卡'
        },
        children:[{
            path: '/pages/mall/sim-card/address',
            component:SIMCardAddress,
            name:'SIMCardAddress',
            meta: {
                title: '新建地址'
            }
        }]
    }
]
