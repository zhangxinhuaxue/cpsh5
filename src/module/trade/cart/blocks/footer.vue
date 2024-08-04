<template>
    <section class="cart_footer">
        <section class="cf__activiy" v-if="activityInfo&&selProArr.length" @click="toActivity()">
            <span class="s1">{{activityContent}}</span>
            <div class="s2">{{activityBtnTxt}} <span class="icon-arrow2"></span></div>
        </section>
        <!-- 常规购买 -->
        <div class="pay-block">
            <div class="detail">
                <div class="aui-cells_checkbox icon-allin">
                    <label for="operateAll">
                        <input type="checkbox" class="aui-check" id="operateAll" v-model="operateAll" @click="operateAllFn">
                        <i class="aui-icon-checked"></i>
                    </label>
                </div>
                <span>全选</span>
                <!-- 删除状态时隐藏 -->
                <p v-if="cartStatus">合计:<i>￥{{totalPrice | formatNum}}</i>
                    <em v-if="discountPrice>0">已优惠:¥{{discountPrice| formatNum(100,false)}}</em>
                </p>
            </div>
            <!-- 结算 -->
            <span v-if="cartStatus" :class="['btn-pay',{'disabled': !selProArr.length}]" @click="payFn">结算({{selProArr.length}})</span>
            <!-- 删除 -->
            <span v-else :class="['btn-pay',{'disabled': !selProArr.length}]" @click="showDialogFn">删除</span>
            <axd-dialog :showDialog="showDialog" :dialogInfo="dialogInfo" @mainClick="delFn" @subClick="closeDialog"></axd-dialog>
        </div>
    </section>
</template>
<script>
/* global  localStorage */
import axdDialog from 'src/module/trade/common/item_dialog/dialog.vue'
import { deletePro, getInventory, caculatePrice } from 'src/store/modules/cart/api'
import { preBuyNow } from 'src/store/modules/trade/confirm'
import { AXD, setLocalStorage } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    name: 'cartFooter',
    components: {
        axdDialog
    },
    data() {
        return {
            showDialog: false,
            dialogInfo: {
                title: '',
                content: '确定要删除宝贝吗？',
                btn: '确认',
                subBtn: '取消',
                singleBtn: false
            },
            operateAll: '', // 是否清空
            listLen: 0, // 所有商品长度
            selArr: [],
            discountPrice: 0,
            totalPrice: 0,
            userClick: false, // 是否是用户触发全选按钮
            selProArrParam: [],
            activityBtnTxt: '去凑单',
            activityContent: '',
            activityInfo: ''
        }
    },
    mounted() {
        // this.getPrice()
    },
    computed: {
        ...mapState({
            cartStatus: state => state.cartStatus,
            listJson: state => state.listJson,
            isLogin: state => state.isLogin,
            price: state => state.price,
            selProArr: state => state.selProArr,
            cartCount: state => state.cartCount,
            clear: state => state.clear,
            couponPop: state => state.couponPop
        })
    },
    watch: {
        cartStatus(newVal) {
            if (newVal) {
                this.formatParam(() => {
                    this.getPrice()
                })
            }
        },
        // listJson(newVal) {
        //     if (newVal) {
        //         this.getProLenAndId()
        //     }
        // },
        operateAll(newVal) {
            // console.log(newVal, '===footer')
            // 如果是用户触发全选按钮，才可以更新数据
            if (!this.userClick) {
                return false
            }
            this.cartInit({
                clear: newVal ? 'allin' : 'allout'
            })
            this.userClick = false
        },
        clear(newVal) {
            if (newVal == 'otherin') {
                this.operateAll = true
            } else if (newVal == 'otherout') {
                this.operateAll = false
            }
        },
        selProArr(newVal, oldVal) {
            if (!newVal.length) {
                this.totalPrice = 0
                this.discountPrice = 0
                return
            }
            if (newVal.length == oldVal.length) {
                return
            }
            this.formatParam(() => {
                this.getPrice()
            })
        }
    },
    methods: {
        ...mapMutations(['cartInit', 'updateCount', 'updateList']),
        getProLenAndId() {
            /* 得到list的长度和id合集，
            字段id存在，说明是线上数据，代表cartId,
            字段id不存在，则是本地数据，取skuId */
            // this.listJson.map(({ carts }) => {
            //     this.selArr = [...this.selArr, ...carts]
            // })
        },
        // 点击按钮，改变变量，证明为用户触发，watch全选值时使用
        operateAllFn() {
            this.userClick = true
            // setTimeout(() => {
            // console.log(this.operateAll, '===operateAllFn')

            // }, 16)
        },
        // 删除
        delFn() {
            this.closeDialog()
            if (this.isLogin) {
                this.delOnline()
            } else {
                this.delLocal()
            }
        },
        // 登录删除
        delOnline() {
            let delCartIds = this.selProArrParam.map(({ cartId }) => { return cartId })
            deletePro({
                cartIds: delCartIds.join(',')
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    if (parseInt(result)) {
                        // 删除之后触发线上数据更新
                        this.$emit('updateListOnline')
                    } else {
                        this.updateList(null)
                    }
                    this.updateCount(result)

                    // 清空当前删除数组存储
                    this.cartInit({ selProArr: [] })
                } else {
                    resultDes && this.$_toast(resultDes)
                }
            })
        },
        // 未登录删除
        delLocal() {
            if (this.operateAll) {
                localStorage.removeItem('cartsData')
                this.updateList(null)
            } else {
                let copyList = JSON.parse(JSON.stringify(this.listJson))
                this.selProArr.forEach((pro) => {
                    copyList.forEach(({ carts }, indexM) => {
                        carts.forEach(({ skuId }, indexP) => {
                            if (skuId == pro.skuId) {
                                carts.splice(indexP, 1)
                                if (carts.length == 0) {
                                    copyList.splice(indexM, 1)
                                }
                            }
                        })
                    })
                })
                let count = copyList.reduce((total, { carts }) => {
                    // console.log(total, carts.length, '==reduce count')
                    return total + carts.length
                }, 0)
                // console.log(count)
                this.updateCount(count)
                // 清空当前删除数组存储
                this.cartInit({ selProArr: [] })
                let localData = { merchants: copyList }
                setLocalStorage('cartsData', JSON.stringify(localData))
                this.updateList(copyList)
            }
        },
        // 支付
        payFn() {
            // selPro为空，说明没有选择购买商品
            if (!this.selProArr.length) {
                this.$_toast('您还没有选择宝贝哦')
                return false
            }
            if (!this.isLogin) {
                AXD.util.login()
            } else { 
                this.buyCheck() // 购买验证
            }
        },
        // 购买校验
        buyCheck() {
            let params = this.selProArrParam.map(({ merchantId, skuId, num, activityId, cartId }) => {
                return {
                    merchantId,
                    skuId,
                    num,
                    cartId,
                    activityIds: activityId ? [activityId] : []
                }
            })
            preBuyNow({
                productInfo: JSON.stringify(params)
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    // if (result) {
                    this.cartInit({ selProArr: [] })
                    this.$router.push({
                        path: '/pages/trade/confirm',
                        query: {
                            data: JSON.stringify(params)
                        }
                    })
                } else {
                    if (code == '-1999' || code == '10010') {
                        AXD.util.login()
                    } else if (code == '8070') {
                        let { hitActivityId } = result
                        if (this.isApp) {
                            hitActivityId = +hitActivityId
                        }
                        params.forEach((item) => {
                            if (item.activityIds.length && item.activityIds.indexOf(hitActivityId) > -1) {
                                item.activityIds = []
                            }
                        })
                        this.cartInit({ selProArr: [] })
                        this.$router.push({
                            path: '/pages/trade/confirm',
                            query: {
                                data: JSON.stringify(params)
                            }
                        })
                    } else {
                        // resultDes && this.$_toast(resultDes)
                        resultDes && this.$_toast({
                            txt: resultDes,
                            time: 3000
                        })
                    }
                }
            })
        },
        showDialogFn() {
            if (this.selProArr.length) {
                this.showDialog = true
            } else {
                this.$_toast('您还没有选择宝贝哦')
            }
        },
        closeDialog() {
            this.showDialog = false
        },
        formatParam(callback) {
            if (!this.listJson && !this.selProArr.length) {
                return []
            }
            let obj = []
            this.selProArr.forEach((pro) => {
                this.listJson.forEach(({ carts }) => {
                    carts.forEach(({ merchantId, skuId, num, activityId, id }) => {
                        if (pro.skuId === skuId) {
                            obj.push({
                                merchantId,
                                skuId,
                                num,
                                activityId,
                                cartId: id || ''
                            })
                        }
                    })
                })
            })
            this.selProArrParam = obj
            callback && callback()
        },
        getPrice() {
            // 编辑状态不计算价格
            if (!this.cartStatus) {
                return
            }
            // 无选中商品不计算价格
            if (!this.selProArr.length) {
                return
            }
            let params = this.selProArrParam.map(({ skuId, num, activityId }) => {
                return {
                    skuId,
                    num,
                    activityIds: activityId ? [activityId] : []
                }
            })
            // console.log(this.selProArrParam, '==selProArrParam')
            caculatePrice({
                productInfo: JSON.stringify(params)
            }).then(({ success, result, code, resultDes }) => {
                if (success) {
                    let { totalPrice, discountPrice, activityInfo } = result
                    this.totalPrice = totalPrice
                    this.discountPrice = discountPrice
                    this.activityInfo = activityInfo
                    console.log(activityInfo, '====in')
                    if (activityInfo) {
                        let f = this.$options.filters['formatNum']
                        let { diffNum, limitNum, limitPrice, discountPrice } = activityInfo
                        if (diffNum <= 0) {
                            this.activityContent = '已享总价' + f(limitPrice) + '元，已减' + f(discountPrice) + '元'
                            this.activityBtnTxt = '再逛逛'
                        } else {
                            this.activityContent = '再购' + diffNum + '件立享【' + f(limitPrice) + '元任选' + limitNum + '件】'
                            this.activityBtnTxt = '去凑单'
                        }
                    }
                } else {
                    if (code == '-1999' || code == '10010') {
                        AXD.util.login()
                    } else {
                        resultDes && this.$_toast(resultDes)
                    }
                }
            })
        },
        toActivity() {
            window.location.href = '/activity/activity-npxe-main/index?activityId=' + this.activityInfo.activityId
        }
    }
}
</script>
