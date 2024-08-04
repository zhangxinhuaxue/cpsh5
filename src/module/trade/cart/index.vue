<template>
    <div class="cart_page aui-page" :class="className">
        <cart-header></cart-header>
        <!-- 登录引导框 -->
        <p :class="['cart_loginTip',{'h5': !isApp}]" v-if="loginTipShow">
            登录后，即可同步购物车中的商品
            <a @click="doLogin">登录</a>
        </p>
        <div class="cart_main" :class="{'notLogged': !isLogin&&cartStatus}">
            <!-- 常规&&编辑模块 包含skuPop -->
            <cart-normal v-if="listJson" @updateListOnline="fetchDataOnline"></cart-normal>
            <!-- 失效商品模块 -->
            <cart-dis :list="proDisList" v-if="proDisShow" @showDialog="showDialogFn"></cart-dis>
        </div>
        <cart-footer v-show="footerShow" @updateListOnline="fetchDataOnline"></cart-footer>
        <cart-null v-if="nullShow"></cart-null>
        <!-- 清楚失效商品提示框 -->
        <axd-dialog :showDialog="showDialog" :dialogInfo="dialogInfo" @mainClick="mainClick" @subClick="showDialogFn"></axd-dialog>
    </div>
</template>
<script>
// 本地存储只有获取和移除，无需setLocalStorage
/* global localStorage */
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import cartHeader from './blocks/header.vue'
import cartNormal from './blocks/proBlock.vue'
import cartDis from './blocks/proDis.vue'
import cartFooter from './blocks/footer.vue'
import cartNull from './blocks/nullPage.vue'
import axdDialog from 'src/module/trade/common/item_dialog/dialog.vue'
import { getCartCount, getCartList, showReceiveCp, batchEdit, deletePro, addProToOnline, joinActivity } from 'src/store/modules/cart/api'
import {
    AXD
} from 'libs/util'
import { resetHeader } from 'components/header/resetHeader'
const { mapState, mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    data() {
        return {
            loginTipShow: false,
            localCart: null, // 本地购物车数据
            proDisList: null, // 失效商品列表
            showDialog: false, // 删除商品询问弹窗
            dialogInfo: { // 弹窗配置
                title: '',
                content: '清空后将无法恢复，确定要清空吗？',
                btn: '确认',
                subBtn: '取消',
                singleBtn: false
            },
            hasGetMerchantCouponData: false
        }
    },
    beforeRouteLeave(to, from, next) {
        // resetHeader()
        this.cartInit({
            cartStatus: true, // true=常规 false=编辑
            skuPop: false,
            couponPop: false
        })
        next()
    },
    components: {
        cartHeader,
        cartNormal,
        cartDis,
        cartFooter,
        cartNull,
        axdDialog
    },
    beforeMount() {
        // 从订单确认页返回需要重置头部刷新页面，在确认订单页调起收银台时需要清空
        // 否则安卓下会先执行此函数，回退到购物车 20171115
        window.axdBackFunc = function() {
            axdApp.refresh()
        }
        this.initData()
    },
    computed: {
        ...mapState({
            listJson: state => state.listJson,
            cartStatus: state => state.cartStatus,
            nullShow: state => state.nullShow,
            isLogin: state => state.isLogin,
            cartCount: state => state.cartCount,
            proDisShow: state => state.proDisShow,
            footerShow: state => state.footerShow
        }),
        className() {
            return window.aixuedai.isUavoApp === 'n' ? 'h5-page' : ''
        }
    },
    watch: {
        cartStatus(newVal) {
            // 未登录状态下，正常状态登录提示框显示，编辑状态隐藏
            if (!this.isLogin) {
                this.loginTipShow = newVal
            }
            // 失效商品只在登录情况常规状态下展示
            if (this.proDisList && this.isLogin && newVal) {
                this.cartInit({ proDisShow: true })
            } else {
                this.cartInit({ proDisShow: false })
            }
        }
    },
    methods: {
        ...mapMutations(['cartInit', 'updateCount', 'updateList']),
        initData() {
            this.cartInit({
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
                footerShow: false
            })
            this.cartCountAndLogin()
        },
        // 获取购物车数量及登录状态
        cartCountAndLogin() {
            // 根据返回结果判断加载本地还是线上数据
            getCartCount().then(({ success, result }) => {
                if (success) {
                    if (typeof result !== 'undefined') {
                        this.cartInit({ isLogin: true })
                        this.loginTipShow = false
                        // 登录成功的情况下，更新购物车数量&&提交本地数据
                        this.updateCount(result)
                        this.updateLocalData()
                    } else {
                        this.$_toast('网络错误，请重试')
                        this.cartInit({ nullShow: true })
                    }
                } else {
                    this.cartInit({ isLogin: false })
                    // 登录提示框展示
                    this.loginTipShow = true
                    // 未登录情况下，本地有数据取本地数据展示，无数据展示'无数据提示页'
                    this.fetchDataLocal()
                }
            })
        },
        // 登录情况下，上传本地数据
        updateLocalData() {
            // console.log(localStorage.getItem('cartsData'))
            this.localCart = JSON.parse(localStorage.getItem('cartsData'))
            // 本地有数据，上传
            if (this.localCart) {
                // 循环本地数据，按照格式组合param
                let updateParam = []
                let merchants = this.localCart.merchants
                merchants.forEach(({ carts }) => { // 循环商铺
                    carts.forEach(({ skuId, num, instalment }) => { // 循环商铺下商品
                        let proParam = {
                            skuId: skuId,
                            num: num
                        }
                        updateParam.push(proParam)
                    })
                })

                // 请求接口，上传本地本地商品数据=>成功后获取线上最新数据=>清空本地数据
                addProToOnline({
                    msg: JSON.stringify(updateParam)
                }).then(({ success, result, resultDes }) => {
                    if (success) {
                        if (typeof result !== 'undefined') {
                            this.fetchDataOnline()
                            localStorage.removeItem('cartsData')
                            this.updateCount(result)
                        } else {
                            this.$_toast('网络错误，请重试')
                            this.cartInit({ nullShow: true })
                        }
                    } else {
                        resultDes && this.$_toast(resultDes)
                    }
                })
            } else {
                // 本地无数据 直接获取线上数据
                this.fetchDataOnline()
            }
        },
        // 获取线上数据
        fetchDataOnline() {
            getCartList().then(({ success, result, resultDes }) => {
                if (success) {
                    if (result) {
                        let { merchants, uneffectiveCarts } = result
                        // 常规商品列表，result字段存在，merchants字段一定存在
                        // 当没有常规商品时，会移除result字段，不会出现merchants为空数组的情况
                        merchants.forEach(item => {
                            item.carts.forEach(pro => {
                                Vue.set(pro, 'merchantId', item.shop.merchantIdStr)
                                let { num, buyMininum, buyLimit } = pro
                                num = parseInt(num)
                                buyMininum = parseInt(buyMininum)
                                buyLimit = parseInt(buyLimit)

                                if (buyMininum && num < buyMininum) {
                                    pro.num = buyMininum
                                }
                                if (buyLimit && num > buyLimit) {
                                    pro.num = buyLimit
                                }

                                // console.log(pro.num, buyMininum, buyLimit)
                                // Q:会不会存在buyLimt<buyMininum的究极情况呢？
                            })
                        })
                        this.updateList(merchants)
                        if (merchants.length) {
                            this.hasGetMerchantCouponData = false
                            this.getMerchantCoupon()
                        }
                        this.cartInit({
                            nullShow: false,
                            footerShow: true
                        })

                        // 失效商品
                        if (uneffectiveCarts.length) {
                            // 切换模板时需要隐藏失效商品
                            // 如果还在编辑状态失效商品不展示
                            this.cartStatus && this.cartInit({ proDisShow: true })
                            this.proDisList = uneffectiveCarts
                        }

                        // 本地测试存储数据，线上注释
                        // localStorage.setItem('cartsData', JSON.stringify(result))

                        this.getActivityInfo()
                    } else {
                        // result 字段不存在，提示页面展示
                        this.updateCount(0)
                    }
                } else {
                    this.updateCount(0)
                    resultDes && this.$_toast(resultDes)
                }
            })
        },
        // 去本地数据，更新数量
        fetchDataLocal() {
            // console.log(11)
            this.localCart = JSON.parse(localStorage.getItem('cartsData'))
            if (this.localCart) {
                let { merchants } = this.localCart
                // 填充列表
                this.updateList(merchants)
                this.getMerchantCoupon()

                // 循环，获取本地购物车数量
                let count = merchants.reduce((total, { carts }) => {
                    // console.log(total, carts.length, '==reduce count')
                    return total + carts.length
                }, 0)
                // this.localCart.merchants.forEach(({ carts }) => { // 循环商铺
                //     count += carts.length
                // })
                this.updateCount(count)
            } else {
                // 本地无数据，提示页面展示
                this.updateCount(0)
            }
        },
        doLogin() {
            // 对外授信登陆需求添加
            if (!this.uid) {
                AXD.util.login()
            }
        },
        showDialogFn() {
            this.showDialog = !this.showDialog
        },
        mainClick() {
            // 循环失效商品id,全部删除  TO DO 待校验
            let cartId = []
            this.proDisList.reduce((preValue, { id }) => {
                return cartId.push(id)
            }, cartId)
            cartId = cartId.join(',')
            deletePro({
                cartIds: cartId
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    // 隐藏失效模块，重置购物车数量
                    this.cartInit({ proDisShow: false })
                    this.updateCount(result)
                    this.proDisList = null
                } else {
                    // 登录失效和未登录
                    if (code == '-1999' || code == '10010') {
                        this.doLogin()
                    } else {
                        resultDes && this.$_toast(resultDes)
                    }
                }
                this.showDialogFn()
            })
        },
        getMerchantCoupon() {
            if (this.hasGetMerchantCouponData) {
                return
            }

            let params = this.listJson.map(({ shop, carts }) => {
                let productIds = carts.map(({ productId }) => {
                    return productId
                })
                return {
                    merchantId: shop.merchantIdStr,
                    productIds
                }
            })
            // console.log(params, '====coupon param ')

            showReceiveCp({ msg: JSON.stringify(params) }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    let data = JSON.parse(JSON.stringify(this.listJson))
                    this.hasGetMerchantCouponData = true
                    result.forEach((item, index) => {
                        let mId = data[index].shop.merchantIdStr
                        // console.log(mId, item.merchantIdStr, showReceiveCp)
                        data[index].showCoupon = (mId == item.merchantIdStr) ? item.showReceiveCp : false
                    })
                    this.updateList(data)
                } else {
                    if (code == -1999 || code == 10010) {
                        let data = JSON.parse(JSON.stringify(this.listJson))
                        data.forEach(item => {
                            item.showCoupon = true
                        })
                        this.updateList(data)
                        return
                    }
                    resultDes && this.$_toast(resultDes)
                }
            })
        },
        getActivityInfo() {
            joinActivity().then(({ success, result, code, resultDes }) => {
                if (success) {
                    this.cartInit({
                        activityInfo: result.activityInfo
                    })
                } else {
                    // 登录失效和未登录
                    if (code == '-1999' || code == '10010') {
                        this.doLogin()
                    } else {
                        resultDes && this.$_toast(resultDes)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss">
@import './style/cart.scss';
</style>
