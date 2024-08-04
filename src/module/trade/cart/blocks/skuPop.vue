<template>
    <com-popup :isPop="popShow" @cancel="closePopup">
        <div class="cart_maskContent" slot="content">
            <div class="pro">
                <span class="img-wid">
                    <img :src="formatImg(pro.imgUrl,75,200)">
                </span>
                <h3>
                    <p class="pro_price">￥{{pro.price| formatNum}}</p>
                    <!-- <p class="pro_choice">已选：{{pro.skuPropertiesName|propertiesName}}</p> -->
                    <p class="pro_choice">已选：{{propertiesName|propertiesNameFilter}}</p>
                </h3>
            </div>
            <dl v-for="(kJson,indexK) in featureJson">
                <dt>{{kJson.k}}</dt>
                <dd v-for="(vJson,indexV) in kJson.values" :class="filterClass(indexK,kJson.kid +'_' + vJson.vid)" @click="selFn(kJson,vJson,indexK)">{{vJson.v}}</dd>
            </dl>
            <div class="btn-sure" @click="editCheck">确定</div>
        </div>
    </com-popup>
</template>
<script>
import Vue from 'vue'
import comPopup from 'components/popup/index.vue'
import { AXD, setLocalStorage, formatImg } from 'src/libs/util'
import { getInventory, batchEdit } from 'src/store/modules/cart/api'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    name: 'skuPop',
    components: {
        comPopup
    },
    props: {
        featureJson: Array, // 属性合集
        skuJson: Array, // 商品sku合集
        instalment: String
    },
    data() {
        return {
            judgeArr: null, // 依据数组，根据这个判断属性选择
            firstChoice: null, // 存储初始化选择
            popShow: false,
            propertiesName: [],
            // invalidSku: [],
            validData: new Set(),
            validKvids: []
        }
    },
    filters: {
        // 每次选择property都要更换“已选”内容，如果存储成字符串，每次都要分割拼接，propertiesName存成数据更换方便
        propertiesNameFilter(val) {
            // return val.split(',').map(item => { return item.split(':')[1] }).join(' ')
            return val.join(' ')
        }
    },
    mounted() {
        this.initChoice()
        this.initFilterValidSku()
        // 因为外层v-if，延迟等待dom加载，产生过渡动画
        setTimeout(() => {
            this.popShow = true
        }, 50)
        // console.log(this.pro, '==skuPop')
    },
    computed: {
        ...mapState({
            listJson: state => state.listJson,
            isLogin: state => state.isLogin,
            editPro: state => state.editPro,
            pro: state => state.editPro.info,
            selProArr: state => state.selProArr,
            cartCount: state => state.cartCount
        })
    },
    methods: {
        ...mapMutations(['cartInit', 'updateCount', 'updateEditPro', 'updateList']),
        initChoice() { // 初识化用户默认选择
            // this.propertiesName = ''
            this.judgeArr = this.skuJson.filter(({ id }) => {
                return id === this.pro.skuId
            }).map(({ nameJson }) => {
                return JSON.parse(nameJson)
            })[0].map(({ kid, vid, v }) => {
                this.propertiesName.push(v)
                return kid + '_' + vid
            })
            this.firstChoice = [...this.judgeArr]
        },
        // 初识化有效sku&&kvids
        initFilterValidSku() {
            this.validKvids = this.skuJson
                .filter(({ avail, hold }) => avail > hold)
                .map(({ nameJson }) => { return JSON.parse(nameJson) })
                .map((item) => {
                    return item.map(({ kid, vid }) => {
                        return kid + '_' + vid
                    })
                })
            let finalData = []
            this.validKvids.forEach(item => {
                finalData = [...finalData, ...item]
            })
            if (this.featureJson.length == 1) {
                this.validData = new Set(finalData)
            } else {
                this.filterValidSku()
            }
            // console.log(this.validData, '====this.validData')
        },
        filterClass(index, kvid) {
            return {
                'disabled': !this.validData.has(kvid),
                'selected': this.judgeArr && this.judgeArr[index] === kvid
            }
        },
        // 更新用户选择属性
        selFn(k, v, indexK) {
            let kvid = k.kid + '_' + v.vid
            if (!this.validData.has(kvid)) {
                return false
            }
            let val = (this.judgeArr[indexK] === kvid) ? '0_0' : kvid
            Vue.set(this.judgeArr, indexK, val)
            this.propertiesName[indexK] = v.v
            this.findTheOne((item) => {
                let pro = JSON.parse(JSON.stringify(this.editPro))
                pro.info.price = item.price
                pro.info.skuPropertiesName = item.name
                this.cartInit({
                    editPro: pro
                })
            })
            if (this.featureJson.length != 1) {
                // console.log(this.judgeArr, '===this.judgeArr')
                this.filterValidSku()
            }
        },
        filterValidSku() {
            // 寻找有效kvid
            let newValidData = this.judgeArr.map((kvid) => {
                return this.validKvids.filter(item => {
                    let data = new Set(item)
                    return data.has(kvid)
                })
            })
            let data = []
            newValidData.forEach(item => {
                data = [...data, ...item]
            })
            data = Array.from(new Set(data))
            // console.log(data, '====finalData')
            // console.log(newValidData, '====newValidData')

            // 取交集，数组比对，重复出现两次以上可以存储
            let intersectionArr = data.filter(item0 => {
                let i = 0
                newValidData.map(item1 => {
                    item1.map(item2 => {
                        let a = item0.join('')
                        let b = item2.join('')
                        if (a === b) {
                            i += 1
                        }
                    })
                })
                if (i >= (this.featureJson.length - 1)) {
                    return item0
                }
            })
            // console.log(intersectionArr, '====intersectionArr')
            let finalData = []
            intersectionArr.forEach(item => {
                // console.log(item)
                finalData = [...finalData, ...item]
            })
            // console.log(finalData, '====finalData')
            this.validData = new Set(finalData)
            // console.log(this.validData, '====this.validData')
        },
        // 确认用户选择，查找更新对应sku
        editCheck() {
            if (this.judgeArr.indexOf('0_0') !== -1) {
                this.$_toast('请选择商品属性')
                return false
            }
            this.findSku()
        },
        findTheOne(callback) {
            let finalChoices = this.judgeArr.join(',')
            this.skuJson.forEach((item) => {
                let kvids = []
                let nameJson = JSON.parse(item.nameJson)
                nameJson.forEach(({ kid, vid }) => {
                    kvids.push(kid + '_' + vid)
                })
                kvids = kvids.join(',')
                if (kvids === finalChoices) {
                    callback && callback(item)
                }
            })
        },
        findSku() {
            if (typeof this.firstChoice !== 'string') {
                this.firstChoice = this.firstChoice.join(',')
            }
            let finalChoices = this.judgeArr.join(',')
            if (finalChoices === this.firstChoice) {
                this.cartInit({
                    skuPop: false,
                    footerShow: true
                })
                return false
            }
            this.findTheOne((item) => {
                if (this.isLogin) {
                    this.resetOnline(item)
                } else {
                    this.resetLocal(item)
                }
            })
        },
        resetOnline(pro) {
            let { id, num, activityId } = this.pro
            let param = {
                cartId: id,
                skuId: pro.id,
                num,
                // payType: this.instalment, // 待废弃参数
                activityId
            }
            batchEdit({
                msg: JSON.stringify(param)
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    // 更新选择项
                    this.updateSelPro(pro.id)
                    // 更新价格和规格
                    let list = JSON.parse(JSON.stringify(this.listJson))
                    let indexM = this.editPro.indexM
                    let indexP = this.editPro.indexP
                    list[indexM].carts[indexP].price = pro.price
                    list[indexM].carts[indexP].skuPropertiesName = pro.name
                    list[indexM].carts[indexP].skuId = pro.id
                    this.updateList(list)
                    // this.updateCount(result)
                    this.closePopup()
                } else {
                    // 失败时，不关闭弹窗，不更新数据
                    resultDes && this.$_toast(resultDes)
                    this.updateSelPro()
                }
            })
        },
        resetLocal({ id, price, name }) {
            // 提交成功，修改当前数据展示，不重新获取列表
            let pro = JSON.parse(JSON.stringify(this.pro))
            Object.assign(pro, {
                skuId: id,
                price: price,
                skuPropertiesName: name
            })
            // 更新选择项
            this.updateSelPro(id)
            // 更新当前单独商品数据
            this.updateEditPro(pro)
            this.mergeSameSku()
        },
        // 未登录状态下，编辑商品之后，触发当前所在'商店'商品循环，合并重复sku, 并清空skuPop选择商品
        mergeSameSku() {
            let indexM = this.editPro.indexM
            let list = JSON.parse(JSON.stringify(this.listJson))
            let finalRes = []

            list[indexM].carts.forEach((pro, index) => {
                let canPush = true
                finalRes.forEach((pro1, index1) => {
                    if (pro.skuId === pro1.skuId) {
                        pro.num = parseInt(pro.num)
                        pro1.num = parseInt(pro1.num)
                        pro1.num += pro.num
                        canPush = false
                    }
                })
                canPush && finalRes.push(pro)
            })
            list[indexM].carts = finalRes
            let count = this.cartCount
            let cartsData = { merchants: list }
            setLocalStorage('cartsData', JSON.stringify(cartsData))
            this.updateList(list)
            this.cartInit({
                editPro: null,
                skuPop: false,
                footerShow: true,
                cartCount: count - 1
            })
        },
        updateSelPro(id) {
            if (!id) {
                return
            }
            let originSkuId = this.editPro.info.skuId
            let res = this.selProArr.findIndex(({ skuId }) => skuId == originSkuId)
            let samePro = this.selProArr.find(({ skuId }) => skuId == id)
            let data = JSON.parse(JSON.stringify(this.selProArr))
            if (res == -1) {
                return
            }
            if (samePro) {
                data.splice(res, 1)
                return
            }
            data[res].skuId = id
            console.log(data)
            this.cartInit({
                selProArr: data
            })
            // 线上，后台会处理数据合并，重新获取即可
            this.$emit('updateListOnline')
        },
        closePopup() {
            this.popShow = false
            // 弹窗动画做完，移除弹窗组件
            setTimeout(() => {
                this.cartInit({
                    skuPop: false,
                    footerShow: true
                })
            }, 500)
        }
    }
}
</script>
