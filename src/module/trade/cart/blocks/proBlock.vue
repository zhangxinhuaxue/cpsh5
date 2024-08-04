<template>
    <section>
        <div class="cart_list" v-for="(subList, indexM) in listJson">
            <h2 class="aui-cells_checkbox">
                <label :for="subList.shop.merchantIdStr">
                    <input type="checkbox" class="aui-check" :id="subList.shop.merchantIdStr" :value="subList.shop.merchantIdStr" v-model="selMerchantsArr" @click="nowType('merchant')">
                    <i class="aui-icon-checked"></i>
                </label>
                <a>
                    <i class="cart_icon-shop"></i><div>{{subList.shop.name}}<span class="icon-arrow2"></span></div>
                </a>
                <span @click="getCouponList(subList.carts)" v-if="subList.showCoupon">领券</span>
            </h2>
            <ul>
                <li class="aui-cells_checkbox" v-for="(pro, indexP) in subList.carts">
                    <div class="cartPro__box">
                        <!-- 正常状态模块start -->
                        <label :for="pro.id || pro.skuId">
                            <input type="checkbox" class="aui-check" :id="pro.id || pro.skuId" :value="formatPro(pro)" v-model="saveChoices" @click="nowType('pro')">
                            <i class="aui-icon-checked"></i>
                        </label>
                        <!-- 商品信息模块 -->
                        <a @click="getHref(pro.productId)" class="cartPro_content">
                            <axd-image :src="pro.imgUrl" :resizeW="180" :lazy="true" class="cartPro_imgWid"></axd-image>
                            <div class="cartPro_info" v-if="cartStatus">
                                <h3><span v-if="pro.tags" v-for="tag in formatTags(pro.tags)">{{tag}}</span>{{pro.productName}}</h3>
                                <!-- 商品属性名合集 -->
                                <p class="type">{{pro.skuPropertiesName}}</p>
                                <p class="price">
                                    <span>¥{{pro.price| formatNum}}</span>
                                    <span v-if="pro.originPrice!=0">¥{{pro.originPrice| formatNum}}</span>
                                    <span>X{{formatProNum(pro.num)}}</span>
                                </p>
                            </div>
                            <div class="cartPro_info" v-else>
                                <!-- 加减模块 -->
                                <section class="edit-block">
                                    <span :class="['minus',{'disabled': pro.num <= 1 || (pro.buyMininum&&pro.num <= pro.buyMininum)}]" @click="operateNum(pro,'reduce',indexM,indexP)"></span>
                                    <input type="number" v-model.number="pro.num" max-length="3" @input="operateNum(pro,'blur',indexM,indexP)" />
                                    <span :class="['plus',{'disabled': addDisabled}]" @click="operateNum(pro,'add',indexM,indexP)"></span>
                                </section>
                                <p class="type edit" @click="editSku(pro,indexM,indexP)" v-if="pro.skuPropertiesName">
                                    {{pro.skuPropertiesName}}
                                    <span class="icon-arrow2" v-if="pro.skuPropertiesName"></span>
                                </p>
                            </div>
                        </a>
                        <template v-if="activityInfo">
                            <a @click="activityUrl(pro)" class="cartPro__activity" v-if="showActivityBlock(pro)">
                                <span class="s1">N件任选</span>
                                <span class="s2">【{{activityTxt(pro)}}】</span>
                                <div class="d1">去凑单<span class="icon-arrow2"></span></div>
                            </a>
                        </template>
                    </div>
                </li>
            </ul>
        </div>
        <!-- sku编辑模块 -->
        <sku-pop v-if="skuPopShow" :featureJson="featureJson" :skuJson="skuJson" :instalment="instalment" @updateListOnline="updateListOnline"></sku-pop>
        <!-- sku编辑模块 -->
        <coupon-pop v-if="couponPopShow" :coupons="couponObj"></coupon-pop>
    </section>
</template>
<script>
import axdImage from 'components/image/index.vue'
import skuPop from './skuPop.vue'
import couponPop from './couponPop.vue'
import { getCartCount, batchEdit, getDetail } from 'store/modules/cart/api'
import { getCouponListV3 } from 'store/modules/trade/product'
import { AXD, setLocalStorage } from 'libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    name: 'cartPro',
    components: {
        skuPop,
        couponPop,
        axdImage
    },
    data() {
        return {
            selProSkuId: '', // 单选结账商品id
            choosePro: null, // 选择编辑产品
            addDisabled: false, // 增加驳回判断
            timer: null, // 修改数量节流定时器
            selDelArr: [], // 复选变量
            listJson: null, // 列表克隆体
            featureJson: null,
            skuJson: null,
            instalment: '',
            saveChoices: [],
            selMerchantsArr: [],
            clickFrom: '',
            couponObj: {
                hasVip: false,
                list: []
            },
            nowIndexM: -1,
            nowIndexP: -1
        }
    },
    mounted() {
        // 深度克隆循环
        this.listJson = JSON.parse(JSON.stringify(this.list))
    },
    computed: {
        ...mapState({
            list: state => state.listJson,
            cartStatus: state => state.cartStatus,
            isLogin: state => state.isLogin,
            skuPopShow: state => state.skuPop,
            selProArr: state => state.selProArr,
            couponPopShow: state => state.couponPop,
            clear: state => state.clear,
            activityInfo: state => state.activityInfo
        })
    },
    watch: {
        cartStatus(newVal) {
            if (newVal) {
                this.updateList(this.listJson)
            }
        },
        selProArr(newVal) {
            if (!newVal.length) {
                this.clickFrom = 'footer'
                this.saveChoices = []
                this.selMerchantsArr = []
            } else {
                this.saveChoices = newVal
            }
        },
        list(newVal) {
            this.listJson = JSON.parse(JSON.stringify(newVal))
        },
        saveChoices(newVal, oldVal) {
            // console.log(newVal, '||', oldVal)
            if (JSON.stringify(this.saveChoices) == JSON.stringify(this.selProArr)) {
                return
            }
            if (this.clickFrom == 'merchant' || this.clickFrom == 'footer') {
                return
            }
            if (oldVal.length < newVal.length) {
                let pro = newVal[newVal.length - 1]
                // console.log(pro, '==pro')
                this.updateChoices(pro)
            }
            if (oldVal.length > newVal.length) {
                let pro = oldVal.filter((i, index) => i !== newVal[index])[0]
                this.delChoices(pro)
            }

            this.updateSelProArr()
            // console.log(newVal, '==存储选择')
        },
        selMerchantsArr(newVal, oldVal) {
            // console.log(newVal, this.listJson.length, '===length比对')
            if (newVal.length == this.listJson.length) {
                this.cartInit({
                    clear: 'otherin'
                })
            } else {
                this.cartInit({
                    clear: 'otherout'
                })
            }
            if (this.clickFrom == 'pro' || this.clickFrom == 'footer') {
                return false
            }
            // console.log(newVal, '||', oldVal)
            if (newVal.length > oldVal.length) {
                let merchantId = newVal[newVal.length - 1]
                this.selThisMerchantsAll(merchantId)
            }
            if (newVal.length < oldVal.length) {
                let merchantId = oldVal.filter((i, index) => i !== newVal[index])[0]
                this.delThisMerchantsAll(merchantId)
            }
        },
        clear(newVal) {
            // console.log(newVal, '===proBlock 是否全选')
            this.clickFrom = 'footer'
            if (newVal == 'allin') {
                let newArr = []
                let merArr = []
                this.listJson.map(({ shop, carts }) => {
                    merArr.push(shop.merchantIdStr)
                    let formatCarts = carts.map(({ skuId, merchantId }) => {
                        return { skuId, merchantId }
                    })
                    newArr = [...newArr, ...formatCarts]
                })
                this.selMerchantsArr = merArr
                this.saveChoices = newArr
                // console.log(merArr, '==merArr')
            } else if (newVal == 'allout') {
                this.saveChoices = []
                this.selMerchantsArr = []
            }
            this.updateSelProArr()
        }
    },
    methods: {
        ...mapMutations(['cartInit', 'updateCount', 'updateList', 'updateMerchantsId']),
        getHref(id) {
            // normal商品可点击到详情，编辑状态点击无反应
            if (this.cartStatus) {
                // return 'javascript:;'
                this.$router.push({
                    path: '/pages/mall/product/' + id,
                    query: {
                        _mark: 'cart'
                    }
                })
                // window.location.href = '/pages/mall/product/' + id + '?_mark=cart'
            }
        },
        // 单选 付款
        choose(pro) {
            // radio获取有延时
            setTimeout(() => {
                if (this.selProSkuId) {
                    this.cartInit({
                        price: pro.price * pro.num,
                        selPro: pro
                    })
                }
            }, 10)
        },
        // 操作商品数量
        operateNum(pro, type, indexM, indexP) {
            this.nowIndexM = indexM
            this.nowIndexP = indexP
            // 页面循环的是克隆体，可直接修改
            let { skuId, buyLimit, num } = pro
            // 存储原始数量，如果上传失败，或者数量有异常可恢复
            let originNum = this.list[indexM].carts[indexP].num
            let num2change = pro.num ? parseInt(pro.num) : 0
            this.cartInit({
                canSwitch: true
            })
            if (!num2change && type != 'add') {
                this.cartInit({
                    canSwitch: false
                })
                return
            }
            switch (type) {
                case 'add':
                    num2change += 1
                    break
                case 'reduce':
                    num2change -= 1
                    break
            }

            if (buyLimit > 0 && num2change > buyLimit) { // 是否有限购
                num2change = parseInt(buyLimit)
                this.addDisabled = true
                this.$_toast('亲，本商品限购' + buyLimit + '件哦')
                if (type != 'blur') {
                    return
                }
            } else if (num2change > 999) { // 超出最高购买数量
                this.addDisabled = true
                num2change = 999
                this.$_toast('最多选择999件')
                if (type != 'blur') {
                    return
                }
            } else if (pro.buyMininum > 1 && num2change < pro.buyMininum) {
                // 如果有商品起售限制，则购物车里的数目不能低于起售限制
                num2change = pro.buyMininum
                this.$_toast('该商品' + pro.buyMininum + '件起售哦')
                if (type != 'blur') {
                    return
                }
            } else if (num2change < 1) {
                num2change = 1
                this.$_toast('宝贝不能再减少了')
                if (type != 'blur') {
                    return
                }
            } else {
                this.addDisabled = false
            }

            pro.num = num2change
            this.listJson[indexM].carts[indexP].num = num2change
            // console.log(this.cartStatus)

            // 事件节流
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.updateCartNum(pro, originNum)
            }, 500)
        },
        updateCartNum(pro, num) {
            if (!num) {
                return
            }
            if (this.isLogin) {
                this.updateCartNumOnline(pro, num)
            } else {
                this.updateCartNumLocal(pro)
            }
        },
        // 线上修改数量
        updateCartNumOnline({ id, skuId, num, instalment, activityId }, originNum) {
            let param = {
                cartId: id,
                skuId,
                num,
                activityId
            }
            batchEdit({
                msg: JSON.stringify(param)
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    let { activityId, price } = result
                    Object.assign(this.listJson[this.nowIndexM].carts[this.nowIndexP], {
                        activityId,
                        price
                    })
                } else {
                    this.listJson[this.nowIndexM].carts[this.nowIndexP].num = originNum
                    resultDes && this.$_toast(resultDes)
                }
            })
            this.updateList(this.listJson)
            console.log(this.cartStatus)
            // if (this.cartStatus) {
            // this.cartStatus = true
            // }
        },
        // 本地修改数量
        updateCartNumLocal(pro) {
            this.listJson.forEach(({ carts }) => {
                carts.forEach(({ skuId, num }) => {
                    if (skuId === pro.skuId) {
                        num = pro.num
                    }
                })
            })
            let cartsData = {
                merchants: this.listJson
            }
            setLocalStorage('cartsData', JSON.stringify(cartsData))
            this.updateList(this.listJson)
        },
        // 打开skuPop
        editSku(pro, a, b) {
            // a = 商户index b = 商品index
            // 如果商品没有可选择商品属性，不打开弹窗，并隐藏可点按钮
            if (pro.skuPropertiesName) {
                this.getSkuJson(pro.productId)
                this.choosePro = {
                    info: pro,
                    indexM: a,
                    indexP: b
                }
                this.cartInit({ editPro: this.choosePro })
            }
        },
        getSkuJson(id) {
            getDetail({
                productId: id
            }).then(({ success, result, resultDes }) => {
                if (success && result) {
                    // console.log(JSON.stringify(result))
                    let { skuShowVoesJson, productSkusJson, instalment } = result
                    // 商品属性循环展示对象
                    this.featureJson = skuShowVoesJson
                    // 检出sku的json
                    this.skuJson = productSkusJson
                    this.instalment = instalment
                    this.cartInit({
                        footerShow: false,
                        skuPop: true
                    })
                } else {
                    resultDes && this.$_toast(resultDes)
                }
            })
        },
        updateListOnline() {
            this.$emit('updateListOnline')
        },
        updateDelArr() {
            setTimeout(() => {
                this.cartInit({ delArr: this.selDelArr })
            }, 10)
        },
        getCouponList(carts) {
            if (!this.isLogin) {
                AXD.util.login()
                return
            }
            let proIds = carts.map(({ productId }) => { return productId })
            // console.log(proIds)
            let param = {
                productIds: proIds.join(',')
            }
            getCouponListV3(param).then(({ success, result, code, resultDes }) => {
                if (success && result && result.coupons && result.coupons.length) {
                    Object.assign(this.couponObj, {
                        hasVip: result.hasVip,
                        list: result.coupons
                    })
                    this.cartInit({
                        footerShow: false,
                        couponPop: true
                    })
                } else {
                    this.$_toast(resultDes)
                }
            })
        },
        selThisMerchantsAll(id) {
            // console.log(id, '==新增merchantId')
            // 找到merchantId相同的店铺，追加商铺下全部商品,然后数组去重
            let addArr = this.listJson
                .filter((item) => item.shop.merchantIdStr === id)[0].carts
                .map(({ skuId, merchantId }) => { return { skuId, merchantId } })
            let newArr = [...this.saveChoices, ...addArr]
            newArr = newArr.map(item => {
                return JSON.stringify(item)
            })
            // console.log(newArr)
            // console.log(new Set(newArr))
            newArr = Array.from(new Set(newArr))
            this.saveChoices = newArr.map(item => {
                let { skuId, merchantId } = JSON.parse(item)
                return { skuId, merchantId }
            })
            console.log(this.saveChoices, '===saveChoices')
            this.updateSelProArr()
        },
        delThisMerchantsAll(id) {
            let delArr = this.listJson.filter((item) => item.shop.merchantIdStr === id)[0].carts
            let saveChoicesCopy = JSON.parse(JSON.stringify(this.saveChoices))
            delArr.map(pro => {
                saveChoicesCopy.forEach((item, index) => {
                    if (pro.skuId === item.skuId) {
                        console.log(index)
                        saveChoicesCopy.splice(index, 1)
                        // console.log(saveChoicesCopy, '==saveChoicesCopy')
                    }
                })
            })
            this.saveChoices = saveChoicesCopy
            this.updateSelProArr()
        },
        // 新增选择项之后是否已经选满当前店铺产品
        updateChoices({ merchantId }) {
            let sameCarts = this.listJson.filter((item) => item.shop.merchantIdStr === merchantId)[0].carts
            let proLength = 0
            sameCarts.map(item => {
                this.saveChoices.map((pro) => {
                    if (item.skuId == pro.skuId) {
                        proLength += 1
                    }
                })
            })
            if (proLength == sameCarts.length) {
                this.selMerchantsArr.push(merchantId)
            }
        },
        delChoices(pro) {
            // 如果商品不存在，说明已经是通过商铺按钮点击取消，无需朝下走
            if (!pro) {
                return false
            }
            // 判断这个商品所在的商户是否被选中
            let merchantIndex = this.selMerchantsArr.findIndex((item) => item === pro.merchantId)
            // 如果这个商铺被选中，需要去掉选中状态
            if (merchantIndex != -1) {
                this.selMerchantsArr.splice(merchantIndex, 1)
            }
        },
        updateSelProArr() {
            let updateData = JSON.parse(JSON.stringify(this.saveChoices))
            this.cartInit({ selProArr: updateData })
        },
        nowType(val) {
            this.clickFrom = val
        },
        formatPro(pro) {
            let { skuId, merchantId } = pro
            return { skuId, merchantId }
        },

        formatTags(tags) {
            return tags ? tags.split(',') : []
        },
        formatProNum(val) {
            if (!val || val < 0) {
                return 1
            } else {
                return val
            }
        },
        showActivityBlock({ skuId }) {
            let k = 'skuId' + skuId
            return (typeof this.activityInfo[k] != 'undefined')
        },
        activityUrl({ skuId }) {
            let k = 'skuId' + skuId
            if (this.activityInfo[k]) {
                window.location.href = '/activity/activity-npxe-main/index?activityId=' + this.activityInfo[k].activityId
                // this.$router.push({
                //     path: '/activity/activity-npxe-main/index',
                //     query: {
                //         activityId: this.activityInfo[k].activityId
                //     }
                // })
            }
        },
        activityTxt({ skuId }) {
            let k = 'skuId' + skuId
            if (this.activityInfo[k]) {
                let f = this.$options.filters['formatNum']
                let money = f(this.activityInfo[k].limitPrice)
                return money + '元任选' + this.activityInfo[k].limitNum + '件'
            } else {
                return '暂无规则'
            }
        }
    }
}
</script>
