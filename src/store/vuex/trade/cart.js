/**
 *
 * @author:      yangjun
 * @dateTime:    2017-09-08
 */
import * as types from './mutation-types'
import { getCartCount, getCartList, batchEdit } from 'src/store/modules/cart/getdata'
const state = {
    cartStatus: true, // true=常规 false=编辑
    listJson: null,
    selPro: null, // 选择结账商品
    price: 0, // 底部价格
    cartCount: 0, // 购物车数量
    isLogin: false, // 是否登录
    proDisShow: false, // 是否显示失效商品
    delArr: [], // 选中删除商品id或skuId存储，登录=id, 未登录=skuId
    nullShow: false, // 空白页面展示
    editPro: null, // 选择修改的商品信息及index
    skuPop: false,
    couponPop: false,
    footerShow: false,
    selProArr: [],
    clear: 'allout', // allin 点击全选 allout 点击全选取消 otherin 勾选商铺或商品满足 otherout 勾选商铺或商品不满足
    activityInfo: null,
    canSwitch: true,
    switchTip: '请填写正确的商品数量~'
}

// mutations
const mutations = {
    cartInit(state, obj) {
        for (let key in obj) {
            state[key] = obj[key]
        }
    },
    updateCount(state, num) {
        state.cartCount = parseInt(num)
        if (state.cartCount === 0) {
            state.nullShow = true
            state.cartStatus = true
            state.footerShow = false
        } else {
            if (state.listJson) {
                if (state.skuPop) {
                    state.footerShow = false
                } else {
                    state.footerShow = true
                }
            }
        }
    },
    updateList(state, obj) {
        state.listJson = obj
        // if (!obj) {
        //     this.updateCount(state, 0)
        // }
    },
    updateEditPro(state, obj) {
        let { indexM, indexP } = state.editPro
        state.listJson[indexM].carts[indexP] = obj
    },
    updateMerchantsId(state, obj) {
        state.merchantsArr = obj
    }
}
export default {
    namespaced: true,
    state,
    mutations
}
