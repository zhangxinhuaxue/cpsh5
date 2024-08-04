
const SyhList = () => import(/* webpackChunkName: 'syh_list' */ './list/index')

export default [
    {
        path: '/pages/syh/list',
        component: SyhList,
        name: 'syhList',
        meta: {
            title: '精选借款'
        }
    }
]