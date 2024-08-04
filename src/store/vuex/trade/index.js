/**
 *
 * @author:      zhouqing
 * @dateTime:    2017-05-15 19:34:15
 * @description:
 */
import confirm from './confirm'
import virtual from './virtual'
import product from './product'
import cart from './cart'
import qmmConfirm from './confirm-qmm'
import common from './common'

const debug = process.env.NODE_ENV !== 'production'

export default {
    strict: debug,
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    modules: {
        confirm: confirm,
        virtual: virtual,
        product: product,
        cart: cart,
        qmmConfirm,
        common
    }
}
