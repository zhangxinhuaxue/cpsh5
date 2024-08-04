// 登录
const App = () => import(/* webpackChunkName: 'points_app' */ './App.vue')
const index = () => import(/* webpackChunkName: 'user_login' */ './pages/index.vue')
const exchangeDetail = () => import(/* webpackChunkName: 'user_smslogin' */ './pages/exchange-detail.vue')
const exchangeList = () => import(/* webpackChunkName: 'user_smslogin' */ './pages/exchange-list.vue')
const pointsDetail = () => import(/* webpackChunkName: 'user_smslogin' */ './pages/points-detail.vue')
const prizeMine = () => import(/* webpackChunkName: 'user_smslogin' */ './pages/prize-mine.vue')
const taskHistory = () => import(/* webpackChunkName: 'user_smslogin' */ './pages/task-history.vue')
const pointsRecord = () => import(/* webpackChunkName: 'pointsRecord' */ './pages/pointsRecord.vue')
const advTask = () => import(/* webpackChunkName: 'advTask' */ './pages/advTask.vue')

export default [{
    path: '/pages/points/',
    component: App,
    children: [{
        path: 'index',
        component: index,
        name: 'pointsIndex',
        meta: {
            title: '积分中心'
        }
    }, {
        path: 'exchange-detail',
        component: exchangeDetail,
        name: 'pointsExchangeDetail',
        meta: {
            title: '兑换奖品'
        }
    }, {
        path: 'exchange-list',
        component: exchangeList,
        name: 'pointsExchangeList',
        meta: {
            title: '积分兑换奖品'
        }
    }, {
        path: 'points-detail',
        component: pointsDetail,
        name: 'pointsDetail',
        meta: {
            title: '积分明细'
        }
    }, {
        path: 'prize-mine',
        component: prizeMine,
        name: 'pointsPrizeMine',
        meta: {
            title: '我兑换的奖品'
        }
    }, {
        path: 'task-history',
        component: taskHistory,
        name: 'taskHistory',
        meta: {
            title: '历史任务'
        }
    }, {
        path: 'pointsRecord',
        component: pointsRecord,
        name: 'pointsRecord',
        meta: {
            title: '抽奖记录'
        }
    }, {
        path: 'advTask',
        component: advTask,
        name: 'advTask',
        meta: {
            title: '视频活动'
        }
    }]
}]
