import rrhRouter from './module/rrh/routes' // 抱米花
import bankCardRouter from './module/bindBankCard/routes'
import syhRouter from './module/syh/routes' // 随意花花
import creditSystemRouter from './module/credit-system/routes' // 授信（新）
import bankbindRouter from './module/common/bankbind/routes' // 银行卡捆绑路由
import transitionRouter from './module/common/transition/routes' // 等待结果页
import userRouter from './module/user/routes' // 用户
import tradeRouter from './module/trade/routes' // 交易
import { addressRouter } from './module/address/routes' // 地址模块
import helpRouter from './module/help/routes' // 帮助
import shopRouter from './module/shop/routes' // 店铺
import orderRouter from './module/order/routes' // 我的订单
import contractRouter from './module/contract/routes' // 合同
import forgetPwdRouter from './module/common/setpwd/routes' // 忘记密码
import deomRouter from './module/demo/routes' // 忘记密码
import SIMCard from './module/sim-card/routes' // sim 卡购买
import clearProofRouter from './module/common/clearProof/routes' // 结清证明
import pointsRouter from './module/user-points/routes' // 积分系统

const App = () => import('./App.vue')
const paypwdpage = () => import('./module/common/pwdpage/index.vue') // 密码
const mallIndex = () => import('./module/mall/index.vue') // CMS商城
const NotFound = () => import('./module/404.vue') // 404
const PageError = () => import('./module/error.vue') // error


let otherRouter = [
    {
        path: '/pages',
        component: App,
        children: [
            {
                path: 'common/password/pay',
                component: paypwdpage,
                name: 'commonPwdpage',
                meta: {
                    title: '支付密码',
                    code: '210015209'
                }
            },
            {
                path: 'put/index',
                component: mallIndex,
                name: 'mallIndex',
                meta: {
                    title: '商城'
                }
            }
        ]
    },
    {
        path: '/pages/error',
        component: PageError,
        name: 'pageError',
        meta: {
            title: ' '
        }
    },
    {
        path: '*',
        component: NotFound,
        name: 'notfound',
        meta: {
            title: '404-页面不存在-招集令APP'
        }
    }
]

let result = [
    ...creditSystemRouter,
    ...bankbindRouter,
    ...rrhRouter,
    ...bankCardRouter,
    ...syhRouter,
    ...transitionRouter,
    ...otherRouter,
    ...contractRouter,
    ...forgetPwdRouter,
    ...userRouter,
    ...tradeRouter,
    ...addressRouter,
    ...helpRouter,
    ...shopRouter,
    ...deomRouter,
    ...SIMCard,
    ...clearProofRouter,
    ...pointsRouter,
    ...orderRouter
]

export default result
