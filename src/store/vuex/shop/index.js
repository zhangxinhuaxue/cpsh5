/**
 *
 * @author:      sunxj
 * @dateTime:    2017-09-29 16:11:26
 * @description:
 */
import {
    getShopInfo,
    collectShop
} from 'store/modules/shop/index'

export default {
    namespaced: true,
    strict: process.env.NODE_ENV !== 'production',
    state: {
        initShopData: {
            uid: '', // 用户ID
            shopId: '', // 店铺ID
            shopName: '', // 店铺名称
            backgroundImgUrl: '', // 店招图
            favorited: undefined, // 是否已收藏
            favoriteNum: '', // 收藏数量
            logoImgUrl: '', // 店铺Logo
            productNum: '', // 商品数量
            merchantId: '', // 商家ID
            address: '', // 商家地址
            desc: '', // 商家介绍
            clientPhone: '', // 招集令电话
            merchantPhone: '', // 商家电话
            mainFocusContent: '', // 首页下橱窗url或ID
            mainFocusImgUrl: '', // 首页下橱窗图片
            mainFocusType: '' // 首页下橱窗类型
        },
        mainTabIndex: 0
    },
    getter: {},
    mutations: {
        initShopInfo(state, data) {
            let {
                uid,
                id,
                shopId,
                logoImgUrl,
                backgroundImgUrl,
                mainFocusContent,
                mainFocusImgUrl,
                mainFocusType,
                baseInfo: {
                    name,
                    favorited,
                    favoriteNum,
                    productNum
                },
                supportPageVo: {
                    merchantIdStr,
                    address,
                    desc,
                    clientphone,
                    telephone
                }
            } = data
            Object.assign(state.initShopData, {
                uid,
                id,
                shopId,
                shopName: name,
                backgroundImgUrl: backgroundImgUrl || '',
                favorited,
                favoriteNum,
                logoImgUrl: logoImgUrl || 'https://img.aiyoumi.com/static/img/201709/27110458046.png',
                productNum,
                merchantId: merchantIdStr,
                address,
                desc,
                clientPhone: clientphone || '',
                merchantPhone: telephone || '',
                mainFocusContent,
                mainFocusImgUrl: mainFocusImgUrl || 'https://img.aiyoumi.com/static/img/201709/27161648258.png',
                mainFocusType
            })
        },
        saveFavorited(state, val) {
            state.initShopData.favorited = val
        },
        saveMainTabIndex(state, val) {
            state.mainTabIndex = val
        }
    },
    actions: {
        initHomeData({
            commit
        }, params) {
            return new Promise((resolve, reject) => {
                getShopInfo(params).then((res) => {
                    if (res.success && res.result) {
                        commit('initShopInfo', res.result)
                        resolve()
                    } else {
                        reject()
                    }
                })
            })
        }
    }
}
