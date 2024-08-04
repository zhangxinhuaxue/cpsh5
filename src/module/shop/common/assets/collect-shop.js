/**
 *
 * @author:      sunxj
 * @dateTime:    2017-11-14 10:43:35
 * @description: 首页和联系客服页收藏店铺
 */
import axdToast from 'components/toast/index'
import {
    collectShop
} from 'store/modules/shop/index'
import { AXD, formatImg } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations } = createNamespacedHelpers('shop')

let collectSpopMixin = {
    name: 'collectShop',
    computed: {
        ...mapState({
            uid: state => state.initShopData.uid,
            shopId: state => state.initShopData.shopId,
            shopName: state => state.initShopData.shopName,
            backgroundImgUrl: state => state.initShopData.backgroundImgUrl,
            favorited: state => state.initShopData.favorited,
            favoriteNum: state => state.initShopData.favoriteNum,
            logoImgUrl: state => formatImg(state.initShopData.logoImgUrl),
            productNum: state => state.initShopData.productNum,
            merchantId: state => state.initShopData.merchantId,
            address: state => state.initShopData.address,
            desc: state => state.initShopData.desc,
            clientPhone: state => state.initShopData.clientPhone,
            merchantPhone: state => state.initShopData.merchantPhone
        })
    },
    methods: {
        ...mapMutations([
            'saveFavorited'
        ]),
        collectShop() {
            if (!this.uid) {
                AXD.util.login()
                return false
            }
            let add = !this.favorited
            let params = {
                shopId: this.shopId,
                add
            }
            collectShop(params).then((res) => {
                if (res.success) {
                    this.saveFavorited(add)
                    let desc = add ? '收藏成功，可在我的收藏中查看哦' : '已取消收藏'

                    axdToast(desc)
                } else {
                    axdToast('操作失败')
                }
            })
        }
    }
}

export {
    collectSpopMixin
}
