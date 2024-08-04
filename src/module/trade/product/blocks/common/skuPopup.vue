<!--
    Created by hity on 05/15/17
-->
<template>
    <com-popup :isPop="isPopup" @cancel="closePopup">
        <div class="sku" slot="content">
            <div class="aui-popup__hd">
                <div class='sku__header'>
                    <span class="sku__imgIcon" :style="{backgroundImage: 'url(' + imgUrl + ')'}" @click="showSkuImgSwiper"></span>
                    <div>
                        <p class="sku__presaleMoney" v-if="buyType=='presale'">
                            <span>定金￥</span>
                            <span v-html="complexMoney(presale.deposit, 100, true)"></span>
                            <span>预售价￥</span>
                            <span v-html="complexMoney(presalePrice, 100, true)"></span>
                        </p>
                        <p class="sku__money" v-else>
                            <span class="money-icon">¥</span>
                            <span class="sku__money--price" v-html="complexMoney(showPrice, 100, true)"></span>
                            <template v-if="buyType === 'vip' && choosedSku.discountPrice">
                                <span class="money-icon small">¥</span>
                                <span class="sku__money--price small" v-html="complexMoney(choosedSku.discountPrice, 100, true)"></span>
                                <img class="vip-icon" :src="vipCardImg">
                            </template>
                                <span class="aui-tag_border sell-limit-num" v-if="buyMininum > 1">{{buyMininum}}件起售</span>
                        </p>
                        <p v-show="!choosedInfo.join(' ')" class="sku__desc">请选择商品信息</p>
                        <p v-show="choosedInfo.join(' ')" class="sku__desc">已选择：{{choosedInfo.join(' ') | limitString(60)}}</p>
                    </div>
                </div>
            </div>
            <div class="aui-popup__ft">
                <template v-if="!isUndercarriage">
                    <a v-if="popupFrom !== 'hook'" href="javascript:;" class="aui-btn_full" @click="confirm(popupFrom)">确定</a>
                    <template v-if="popupFrom === 'hook'">
                        <!-- 预售 -->
                        <a v-if="buyType === 'presale'" href="javascript:;" class="aui-btn_full" @click="confirm('toBuy')">确定</a>
                        <!-- 状态分为正常、团购、秒杀以及限时抢购四种状态 -->
                        <!-- <div v-else-if="buyType === 'normal'|| buyType === 'npxe'" class="shopping-btn-group">
                            <span v-if="cartStatus" class="to-cart" :class="{'disbaled-cart': isDisabledStock}" @click="confirm('addCart')">加入购物车</span>
                            <span class="to-buy" :class="{'disbaled-buy': isDisabledStock}" @click="confirm('toBuy')">立即购买</span>
                        </div> -->
                        <!-- 限时秒杀 -->
                        <template v-else-if="buyType === 'limitSeckill'">
                            <template v-if="limitSeckillState === 'before'">
                                <a href="javascript:;" class="aui-btn_full disabled-btn">即将开抢</a>
                            </template>
                            <div v-if="limitSeckillState === 'selling'" class="shopping-btn-group">
                                <span v-if="cartStatus" class="to-cart" @click="confirm('addCart')">加入购物车</span>
                                <span class="to-buy" @click="confirm('toBuy')">立即购买</span>
                            </div>
                            <template v-if="limitSeckillState === 'over'">
                                <a href="javascript:;" class="aui-btn_full disabled-btn">已结束</a>
                            </template>
                        </template>
                        <!-- 限时抢购 -->
                        <div v-else-if="buyType === 'limittime'" class="shopping-btn-group">
                            <template v-if="activityState === 'ing'">
                                <span class="to-cart" @click="confirm('toBuy')">立即购买</span>
                            </template>
                            <template v-if="activityState !== 'ing'">
                                <span class="to-cart" @click="confirm('toBuy')">原价购买</span>
                            </template>
                        </div>
                        <!-- 团购，已下线 -->
                        <!--   <template v-if="buyType === 'teambuy'">
                            <a v-if="!teambuyIsOver" href="javascript:;" class="aui-btn_full" @click="confirm('toTeamBuy')">立即购买</a>
                            <a v-if="teambuyIsOver" href="javascript:;" class="aui-btn_full disabled-btn">拼团已结束</a>
                        </template> -->
                        <!-- 秒杀 -->
                        <a v-else-if="buyType === 'seckill'" href="javascript:;" class="aui-btn_full" :class="{'disabled-btn':!canBuy}" @click="confirm('toBuy')">{{btnTxt}}</a>
                        <!-- 其他，包含普通商品，N件任选，砍价活动，A+会员 -->
                        <template v-else>
                            <div class="shopping-btn-group">
                                <span v-if="cartStatus" class="to-cart" :class="{'disbaled-cart': isDisabledStock}" @click="confirm('addCart')">加入购物车</span>
                                <span class="to-buy" :class="{'disbaled-buy': isDisabledStock}" @click="confirm('toBuy')">立即购买</span>
                            </div>
                        </template>
                    </template>
                </template>
                <a v-if="isUndercarriage && buyType !== 'limitSeckill'" href="javascript:;" class="aui-btn_full disabled-btn">商品已下架</a>
                <a v-if="isUndercarriage && buyType === 'limitSeckill'" href="javascript:;" class="aui-btn_full disabled-btn">已抢完</a>
            </div>
            <div class="aui-popup__bd">
                <ol>
                    <li v-for="(item, index) in features" :key="item.kid">
                        <dl>
                            <dt data-id="item.kid">{{item.k}}</dt>
                            <dd v-for="i in item.values" :key="i.vid" data-id="i.vid" v-on:click="choiceSel(index, item.kid + '_' +i.vid, i.v)" :class="filterClass(index, item.kid + '_' +i.vid)">{{i.v}}</dd>
                        </dl>
                    </li>
                </ol>
                <div class="sku__opr">
                    <span class="sku__opr--num">购买数量</span>
                    <div class="sku__opr--num_container">
                        <span class="sku__opr--btn" :class="[isMinusAvail ? '' : 'disabled']" @click="oprNum('minus')">－</span>
                        <div class="sku__opr--input">
                            <input type="text" v-model="inputNum" @focus="checkFocus()" @blur="checkBlur()" @keyup="checkInput('input')">
                        </div>
                        <span class="sku__opr--btn" :class="[isAddAvail ? '' : 'disabled']" @click="oprNum('add')">＋</span>
                    </div>
                    <div class="account_left" v-if="choosedSku.avail">剩余<span>{{choosedSku.avail}}</span>件</div>
                </div>
            </div>
        </div>
    </com-popup>
</template>
<script>
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import comPopup from 'components/popup/index.vue'
import { addCart } from 'store/modules/trade/product'
import { preBuyNow } from 'store/modules/trade/confirm'
import { getlocalCartNum } from './common.js'
import { educationMixin } from 'src/module/trade/common/education'
import _SkuSwiper from './skuImgSwiper.vue'
import { AXD, setLocalStorage, formatImg } from 'src/libs/util'
const { mapGetters, mapState, mapMutations } = createNamespacedHelpers('trade/product')

export default {
    name: 'skuPopup',
    mixins: [educationMixin],
    data() {
        return {
            isPopup: false,
            // sku库
            skuSet: [],
            // 保存选中的kvids
            choosedKvids: [],
            choosedInfo: [],
            // 保存选中的sku
            choosedSku: {},
            // 保存无效kvids
            invalidKvids: new Set(),
            shoppingNum: 1,
            inputNum: 1,
            oldWindowHeight: 0,
            testFocus: false,
            testBlur: false,
            isJD: false,
            isKeybordAvail: false,
            imgUrl: '',
            activeType: this.$route.query.activeType,
            vipCardImg: require('src/assets/images/icon_vip.svg')
        }
    },
    created() {
        this.inputNum = this.buyMininum > 1 ? this.buyMininum : 1
        this.shoppingNum = this.buyMininum > 1 ? this.buyMininum : 1
    },
    mounted() {
        console.log('sku popup', this.mainSkuId)
        this.init()
    },
    watch: {
        testFocus(newValue) {
            let me = this
            setTimeout(function() {
                if (me.isKeybordAvail) {
                    return
                }
                if (!newValue) {
                    me.oprNum('input')
                }
            }, 0)
        },
        // 在关闭sku弹窗是，添加有效skuid
        isPopup(newValue) {
            if (!newValue) {
                if (this.choosedSku.id) {
                    this.updateInteractData({
                        targetKey: 'trade',
                        skuId: this.choosedSku.id
                    })
                } else {
                    this.updateInteractData({
                        targetKey: 'trade',
                        skuId: 0
                    })
                }
            }
        },
        // watch选中的类别变化情况，并得出相应选中的信息，如果全部选中，则确认choosedSku;
        choosedKvids(choosedKvids) {
            let skuSet = this.skuSet
            let features = this.features
            let choosedSku = {}

            if (!features || !features.length) {
                choosedSku = skuSet[0]
            } else {
                // 如果所有特征选择完毕，则找出对应的sku;根据choosedKvids在skuSet中查找对应的sku
                choosedSku = skuSet.filter(({ kvids }) => {
                    return kvids.every((kvid) => {
                        return choosedKvids.indexOf(kvid) != -1
                    })
                })[0]
            }

            // 通过比对选中的kvids及features，找出对应的choosedInfo
            this.choosedInfo = choosedKvids.map((kvid, index) => {
                let value = features[index].values.filter(({ vid, v }) => {
                    return (features[index].kid + '_' + vid) == kvid
                })[0]
                return value ? value.v : ''
            })
            this.choosedSku = !choosedSku ? {} : choosedSku
        },
        choosedSku(newValue) {
            console.log('here')
            this.updateInteractData({
                targetKey: 'trade',
                price: newValue.price,
                discountPrice: newValue.discountPrice
            })
            if (this.buyType == 'presale') {
                let findOne = this.presale.skuPrices.filter((item) => item.skuId == newValue.id)
                let price = (findOne[0] && findOne[0].skuPrice) || this.presale.minPrice
                let originPrice = (findOne[0] && findOne[0].skuOrgPrice) || this.presale.minOrgPrice

                this.updateInteractData({
                    targetKey: 'presale',
                    price,
                    originPrice
                })
            }
            // 如果是限时抢购，则选中sku后切换剩余库存以及进度条
            if (this.buyType === 'limitSeckill') {
                let stock = newValue.avail - newValue.hold
                this.updateInteractData({
                    targetKey: 'limitSeckill',
                    showStock: newValue.showStock,
                    stock: stock >= 0 ? stock : 0,
                    showInfo: newValue.showStock != 0
                })
            }

            if (this.productType == 'JD' && newValue && newValue.id) {
                this.updateInteractData({
                    targetKey: 'trade',
                    skuId: newValue.id
                })
                this.updateInteractData({
                    targetKey: 'jd',
                    skuInfo: this.choosedInfo.join(' ')
                })
            }
        }
    },
    computed: {
        ...mapState({
            productNum: state => state.interactData.trade.productNum,
            skuId: state => state.interactData.trade.skuId,
            popupFrom: state => state.interactData.trade.popupFrom,
            instalment: state => state.initData.trade.instalmentType,
            minPrice: state => state.initData.trade.minPrice,
            buyType: state => state.initData.trade.buyType,
            features: state => state.initData.trade.features,
            storeSkuSet: state => state.initData.trade.skuSet,
            skuImgs: state => state.initData.trade.skuImgs,
            skuImgList: state => state.interactData.trade.skuImgList,
            productId: state => state.initData.desc.productId,
            shop: state => state.initData.shop,
            desc: state => state.initData.desc,
            buyLimit: state => state.initData.trade.buyLimit,
            uid: state => state.initData.user.uid,
            canBuy: state => state.interactData.seckill.canBuy,
            btnTxt: state => state.interactData.seckill.btnTxt,
            productType: state => state.initData.shop.type,
            stockState: state => state.initData.jd.stockState,
            mainSkuId: state => state.initData.jd.mainSkuId,
            area: state => state.interactData.jd.area,
            initTbId: state => state.initData.teambuy.tbId,
            interactTbId: state => state.interactData.teambuy.tbId,
            recordId: state => state.interactData.teambuy.recordId,
            teambuyIsOver: state => state.initData.teambuy.isOver,
            // 限时抢购实时状态：未开抢 || 抢购中 || 已结束
            limitSeckillState: state => state.interactData.limitSeckill.state,
            buyMininum: state => state.initData.trade.buyMininum,
            activityIdNormal: state => state.initData.trade.activityId,
            // activityIdChance: state => state.initData.activity.id,
            // activityIdLimittime: state => state.initData.activity.id,
            activityId: state => state.initData.activity.id,
            activityState: state => state.initData.activity.state,
            cartStatus: state => state.initData.trade.cartStatus,
            presale: state => state.initData.presale,
            presalePrice: state => state.interactData.presale.price,
            activity: state => state.initData.activity
        }),
        ...mapGetters([
            'price',
            'isUndercarriage',
            'discountPrice'
        ]),
        isDisabledStock() {
            return this.productType == 'JD' && this.stockState != '有货'
        },
        isMinusAvail() {
            return this.shoppingNum > (this.buyMininum > 1 ? this.buyMininum : 1)
        },
        isAddAvail() {
            let {
                id,
                avail,
                hold
            } = this.choosedSku
            let availNum = id ? Number(avail) - Number(hold) : 999
            return this.shoppingNum < 999 && this.shoppingNum < availNum
        },
        showPrice() {
            return (this.buyType === 'limittime' && this.activityState === 'ing') ? this.discountPrice : this.price
        }
    },
    components: {
        comPopup
    },
    methods: {
        ...mapMutations([
            'updateInitData',
            'updateInteractData'
        ]),
        init() {
            // 复制、过滤无效sku（无库存）、格式化sku库
            this.skuSet = this._formatSkuSet(this.storeSkuSet)
            // 初始化
            this.choosedKvids = []
            this.imgUrl = this.desc.imgUrl
            this.watchKeybord()
            this._initSku()
        },
        _initSku() {
            let features = this.features
            let skuSet = this.skuSet
            // 保存选中的kvids
            let choosedKvids = []
            // 保存有效的kvids
            let validKvids = []
            let choosedSku = {}

            if (!skuSet || !skuSet.length) {
                this.updateInitData({
                    targetKey: 'trade',
                    stock: 0
                })
            }

            if (this.productType == 'JD') {
                // 寻找主skuId对应sku
                choosedSku = skuSet.filter((skuItem) => {
                    return skuItem.id == this.mainSkuId
                })[0]
                choosedSku = !choosedSku ? {} : choosedSku
                this.updateInteractData({
                    targetKey: 'trade',
                    skuId: choosedSku.id
                })
            } else {
                // 仅一个有效skuid，找到对应的选项
                if (skuSet.length == 1) {
                    choosedSku = skuSet[0]
                }
            }
            // 无特征选项，停止后续操作:包括选中项、无效集、skuimg［展示相关］
            if (!features || !features.length) {
                return
            }
            // 有选中的sku后，找到对应的选项
            if (choosedSku && choosedSku.id) {
                choosedKvids = features.map(({ kid }) => {
                    return choosedSku.kvids.filter((kvid) => {
                        return kvid.indexOf(kid) != -1
                    })[0]
                })
                // 初始化选择sku对应图片
                choosedKvids.map((item) => {
                    if (item) {
                        this.getSkuImg(item)
                    }
                })
            }

            this.choosedKvids = choosedKvids
            validKvids = this._findValidKvids(features, choosedKvids, skuSet)
            this.invalidKvids = new Set(this._findInvalidFromValid(features, validKvids))
        },
        _isChoosedKvidsEmpty(choosedKvids) {
            let vaildkvids = choosedKvids.filter((kvid) => {
                return kvid
            })

            if (vaildkvids.length == 0) {
                return true
            }
            return false
        },
        _isChoosedKvidsFull(choosedKvids) {
            let vaildkvids = choosedKvids.filter((kvid) => {
                return kvid
            })
            if (vaildkvids.length == this.features.length) {
                return true
            }
            return false
        },
        // 从全集kvid与有效kvid的比对中，找出无效kvid
        _findInvalidFromValid(features, validKvids) {
            let wholeKvids = []
            this._findWholeFromFeatures(features).forEach((item) => {
                wholeKvids = [...wholeKvids, ...item]
            })
            return wholeKvids.filter((kvid) => {
                return !validKvids.has(kvid)
            })
        },
        // 从feature中找出全集数组
        _findWholeFromFeatures(features) {
            return features.map(({ kid, values }) => {
                return values.map(({ vid }) => {
                    return kid + '_' + vid
                })
            })
        },
        // 比对wholeKvidsBuff与choosedkvids,查找对应的validKvids
        _findValidKvids(features, choosedKvids, skuSet) {
            let skuStore = skuSet.map(({ kvids }) => kvids)
            let validFeatures = this._filterValidFeaturesBySkuStore(features, skuStore)
            let currChoosedKvids = features.map(item => undefined)

            // 没有选中任何选项时，直接返回所有有效feature
            if (!this._isChoosedKvidsEmpty(choosedKvids)) {
                // sku算法，遍历feature，查找对应的feature是否选中；
                // 在每类feature中（如颜色），如果无选中项，则有效feature不变；
                // 如果无选中项，则遍历该类的有效feature集合，将该类的每个feature放入选中项中，查询sku库，如果不存在，则该feature从有效feature集合中，拿除
                // 如此，最终剩下的有效feature集合，即为有效kvids
                features.forEach((item, index) => {
                    currChoosedKvids[index] = choosedKvids[index]
                    if (choosedKvids[index]) {
                        validFeatures = validFeatures.map((row, rIndex) => {
                            if (rIndex != index) {
                                row = row.map(c => {
                                    let tmpChoosedKvids = this._deepCopy(currChoosedKvids)
                                    tmpChoosedKvids[rIndex] = c
                                    if (!this._isSkuExistByKvids(tmpChoosedKvids, skuStore)) {
                                        c = undefined
                                    }
                                    return c
                                })
                            }
                            return row
                        })
                    }
                })
            }

            let tmpVaildKvids = []
            validFeatures = validFeatures.forEach(item => {
                tmpVaildKvids = [...tmpVaildKvids, ...item]
            })
            return new Set(tmpVaildKvids.filter(item => item))
        },

        // 选中的kvids组合在sku库中是否存在
        _isSkuExistByKvids(choosedKvids, skuStore) {
            return skuStore.some(r => {
                return choosedKvids.every(kvids => {
                    return !kvids || (r.indexOf(kvids) != -1)
                })
            })
        },

        // 通过sku库找出有效的特性
        _filterValidFeaturesBySkuStore(features, skuStore) {
            return features.map(kItem => {
                let tmpArray = []
                skuStore.forEach(column => {
                    column.forEach(row => {
                        if (row.indexOf(kItem.kid + '_') != -1) {
                            tmpArray.push(row)
                        }
                    })
                })
                tmpArray = new Set(tmpArray)
                return [...tmpArray]
            })
        },

        closePopup() {
            this.isPopup = false
            this.updateInteractData({
                targetKey: 'trade',
                isSkuPopOpen: false
            })
        },
        _formatSkuSet(skuSet) {
            let tmpSkuSet = skuSet
            // 深度复制
            tmpSkuSet = this._deepCopy(tmpSkuSet)
            // 去除无效sku数据
            tmpSkuSet = tmpSkuSet.filter(({ avail, hold }) => {
                return avail - hold > 0
            })
            // 格式化sku
            tmpSkuSet.forEach((skuItem) => {
                if (!skuItem.nameJson) {
                    skuItem.kvids = []
                    return
                }
                skuItem.kvids = JSON.parse(skuItem.nameJson).map(({ kid, vid }) => {
                    return kid + '_' + vid
                })
            })
            return tmpSkuSet
        },
        _deepCopy(o) {
            if (o instanceof Array) {
                let n = []
                for (let i = 0; i < o.length; ++i) {
                    n[i] = this._deepCopy(o[i])
                }
                return n
            } else if (o instanceof Object) {
                let n = {}
                for (let i in o) {
                    n[i] = this._deepCopy(o[i])
                }
                return n
            } else {
                return o
            }
        },
        createSkuSwiper() {
            let SkuSwiper = Vue.extend(_SkuSwiper)
            let skuSwiper = new SkuSwiper({
                el: document.createElement('div'),
                store: this.$store
            })
            skuSwiper.$el.id = 'skuSwiper'
            document.querySelector('.aui-page').appendChild(skuSwiper.$el)
        },
        watchKeybord() {
            let me = this
            let oriWinHeight = window.innerHeight
            window.onresize = function() {
                me.isKeybordAvail = true
                let newHeight = window.innerHeight
                // 可以作为虚拟键盘关闭
                if (newHeight - oriWinHeight > 140) {
                    me.oprNum('input')
                }
                oriWinHeight = newHeight
            }
        },
        // 根据用户交互数据，计算active及disabled类
        filterClass(index, kvid) {
            return {
                disabled: this.invalidKvids.has(kvid),
                active: this.choosedKvids[index] == kvid
            }
        },
        choiceSel(index, kvid) {
            this.choose(index, kvid)
            this.getSkuImg(kvid)
        },
        getSkuImg(kvid) {
            let skuImgs = this.skuImgs
            if (skuImgs && skuImgs.length) {
                skuImgs.map((item, index) => {
                    let kv = item.kid + '_' + item.vid
                    if (kvid === kv) {
                        this.imgUrl = item.imgUrl
                    }
                })
            }
        },
        // 用户点击sku信息进行选择
        choose(index, kvid) {
            let validKvids = []
            // 当类型不可点击时，返回
            if (this.invalidKvids.has(kvid)) {
                return
            }

            // 根据用户选择，变更选择的数据
            if (this.choosedKvids[index] && this.choosedKvids[index] == kvid) {
                Vue.set(this.choosedKvids, index, undefined)
            } else {
                Vue.set(this.choosedKvids, index, kvid)
            }
            validKvids = this._findValidKvids(this.features, this.choosedKvids, this.skuSet)
            this.invalidKvids = new Set(this._findInvalidFromValid(this.features, validKvids))

            // 根据用户交互，找出对应有效的kvid
            if (this.choosedSku && this.choosedSku.id) {
                this.oprNum('chooseSku')
            }
        },
        confirm(type) {
            if (type == 'addCart' || type == 'toBuy') {
                if (this.isDisabledStock) {
                    return
                }
            }
            if (this.isUndercarriage) {
                this.$_toast('商品已下架')
                return
            }

            // 如果是秒杀状态，canbuy==false不能购买
            if (this.buyType === 'seckill' && !this.canBuy) {
                return
            }

            // 如果有商品起售限制，且商品库存低于商品起售件数，则不能购买
            if (this.buyMininum > this.choosedSku.avail) {
                this.$_toast('库存不足~')
                return
            }

            // 如果有商品起售限制，且用户修改的商品购买件数低于起售限制，则在确认前应重置购买数量
            if (this.buyMininum > 1 && this.shoppingNum < this.buyMininum) {
                this.$_toast('该商品' + this.buyMininum + '件起售哦~')
                this.shoppingNum = this.buyMininum
            }

            if (this.shoppingNum < 1) {
                this.shoppingNum = 1
            }

            if (this.choosedSku.id) {
                this.updateInteractData({
                    targetKey: 'trade',
                    skuId: this.choosedSku.id,
                    productNum: this.shoppingNum
                })
                // 团购状态，如果链接带recordId参数，为参加推荐团状态
                // if (type === 'toTeamBuy' && this.$route.query.recordId) {
                //     type = 'toTeamReco'
                // }
                switch (type) {
                    case 'addCart':
                        this.addCartProduct()
                        break
                    case 'toBuy':
                        this.normalBuy()
                        break
                        // case 'toTeamBuy':
                        //     this.teamBuy('team')
                        //     break
                        // case 'toTeamReco':
                        //     this.teamBuy('toTeamReco')
                        //     break
                }
            } else {
                this.$_toast('请先选择商品信息')
            }
        },
        checkInput() {
            let skuId = this.choosedSku.id
            if (!skuId) {
                this.$_toast('请先选择商品信息')
                this.inputNum = this.shoppingNum
                return
            }

            // 判断输入是否符合要求
            let patten = new RegExp('^[0-9]*$')
            if (!patten.test(this.inputNum)) {
                this.$_toast('仅支持数字')
                this.inputNum = this.shoppingNum
            } else {
                this.shoppingNum = this.inputNum
            }
        },
        checkBlur() {
            if (this.testFocus) {
                this.testFocus = false
            }
        },
        checkFocus() {
            this.testFocus = true
        },
        oprNum(type) {
            let skuId = this.choosedSku.id
            if (this.isUndercarriage) {
                this.$_toast('商品已下架')
                return
            }
            if (!skuId) {
                if (type != 'chooseSku' && this.isPopup) {
                    this.$_toast('请先选择商品信息')
                }
                this.inputNum = this.shoppingNum
                return
            }
            let userNum = this.shoppingNum
            switch (type) {
                case 'input':
                    // 判断输入是否符合要求
                    let patten = new RegExp('^[0-9]*$')
                    if (!patten.test(this.inputNum)) {
                        this.$_toast('仅支持数字')
                        this.inputNum = this.shoppingNum
                        return
                    }
                    userNum = Number(this.inputNum)
                    break
                case 'minus':
                    userNum = --this.shoppingNum
                    break
                case 'add':
                    userNum = ++this.shoppingNum
                    break
            }

            // 拼团只能选择1件
            // if (this.buyType === 'teambuy' && userNum != 1) {
            //     userNum = 1
            //     this.$_toast('拼团商品只能选择1件')
            // }
            let availedNum = Number(this.choosedSku.avail) - Number(this.choosedSku.hold)
            if (this.buyLimit > 0 && this.shoppingNum > this.buyLimit) {
                this.$_toast('该商品最多可购买' + this.buyLimit + '件哦~')
                userNum = this.buyLimit
            } else if (this.buyMininum > 1 && this.shoppingNum < this.buyMininum) {
                this.$_toast('该商品' + this.buyMininum + '件起售哦~')
                userNum = this.buyMininum
            } else if (userNum < 1 && availedNum != 0) {
                this.$_toast('至少选择1件')
                userNum = 1
            } else if (userNum > availedNum || availedNum == 0) {
                this.$_toast('库存仅剩' + availedNum + '件')
                userNum = availedNum
            } else if (userNum > 999) {
                this.$_toast('最多选择999件')
                userNum = 999
            }

            this.inputNum = userNum
            this.shoppingNum = this.inputNum
        },
        startImgAnimate(animateImgStyle, imgUrl) {
            let Img = Vue.extend({
                template: '<span class="animateImg" :style="animateImgStyle"><span class="imgIcon animation" :style="imgUrl"></span></span>',
                data() {
                    return {
                        animateImgStyle: {},
                        imgUrl
                    }
                }
            })
            let imgInstance = new Img({
                el: document.createElement('div')
            })
            imgInstance.$el.id = 'img-animate'
            document.querySelector('.aui-page').appendChild(imgInstance.$el)
            setTimeout(() => {
                imgInstance.animateImgStyle = animateImgStyle
            }, 0)
            return imgInstance
        },
        endImgAnimate(imgInstance) {
            let el = imgInstance.$el
            if (el) {
                el.parentNode.removeChild(el)
                imgInstance = null
            }
        },
        addCartProduct() {
            let productNum = this.productNum
            let skuId = this.skuId
            let me = this

            // 加购物车功能
            let totalCartNum = this.cartCount + productNum

            // 判断是否超出购物车限制
            this.isOverCartLimit(totalCartNum)

            // 用户已登陆
            if (this.uid) {
                let param = []
                if (getlocalCartNum() > 0) {
                    param = this.parselocalCartInfo()
                }
                param.push({
                    skuId: skuId,
                    num: productNum
                })

                // 批量添加
                addCart({
                    msg: JSON.stringify(param)
                }).then(function(data) {
                    data = data.ret || data
                    if (data.success) {
                        // 添加成功，清除本地缓存
                        me.addSuccess()
                        window.localStorage.removeItem('cartsData')
                    } else if (data.code == '-1999') {
                        if (me.addLocalCart()) {
                            me.addSuccess()
                        }
                    } else {
                        // 添加失败，如果超出购物车，则跳结算（需要后台给状态）
                        me.$_toast(data.resultDes)
                    }
                })
            } else {
                if (me.addLocalCart()) {
                    me.addSuccess()
                }
            }
        },
        addSuccess() {
            this.$_toast('添加购物车成功')
            this.updateInitData({
                targetKey: 'trade',
                cartCount: this.cartCount + this.productNum
            })

            // 购物车动画 后续再添加
            let toPos = {
                top: 0,
                left: document.body.clientWidth
            }
            let fromElem = document.querySelector('.sku__imgIcon')
            let fromPos = this.offset(fromElem)
            let elemSize = {
                width: parseInt(fromElem.offsetWidth / 5),
                height: parseInt(fromElem.offsetHeight * 3 / 4)
            }
            let me = this
            let animateImgStyle = {
                top: fromPos.top + 'px',
                left: fromPos.left + 'px',
                transform: 'translate(' + (toPos.left - fromPos.left - elemSize.width) + 'px, ' + (toPos.top - fromPos.top - elemSize.height) + 'px) scale(.01, .01)'
            }
            let imgElem = this.startImgAnimate(animateImgStyle, 'backgroundImage: url(' + this.imgUrl + ')')
            setTimeout(() => {
                this.closePopup()
                this.endImgAnimate(imgElem)
            }, 1000)
        },
        offset(curElem) {
            let totalLeft = null
            let totalTop = null
            let par = curElem.offsetParent

            // 首先把自己本身的进行累加
            totalLeft += curElem.offsetLeft
            totalTop += curElem.offsetTop

            // 只要没有找到body，我们就把父级参照物的边框和偏移量累加
            while (par) {
                totalLeft += par.clientLeft
                totalTop += par.clientTop

                // 累加父级参照物本身的偏移
                totalLeft += par.offsetLeft
                totalTop += par.offsetTop
                par = par.offsetParent
            }
            return {
                left: totalLeft,
                top: totalTop
            }
        },
        parselocalCartInfo() {
            let param = []
            let localCart = JSON.parse(window.localStorage.getItem('cartsData'))
            let mer = localCart.merchants
            if (!mer) return param
            // 获取缓存中的购物车信息
            for (let i = 0; i < mer.length; i++) {
                for (let j = 0; j < mer[i].carts.length; j++) {
                    let sJson = {
                        skuId: mer[i].carts[j].skuId,
                        num: mer[i].carts[j].num,
                        payType: mer[i].carts[j].instalment,
                        cartId: '',
                        type: 'add'
                    }
                    param.push(sJson)
                }
            }
            return param
        },
        addLocalCart() {
            let productNum = this.productNum
            let skuId = this.skuId
            let choosedSku = this.choosedSku
            let shopId = this.shop.id
            let shopName = this.shop.name
            let buyLimit = this.buyLimit
            let cartData = window.localStorage.cartsData ? JSON.parse(window.localStorage.cartsData) : ''
            let data = {
                merchants: cartData.merchants ? cartData.merchants : []
            }
            let merchantObj = {
                shop: {},
                carts: []
            }
            let dataLen = data.merchants.length
            let cartObj = {
                merchantId: shopId,
                // 通过url过滤
                productId: this.productId,
                productName: this.desc.name,
                skuPropertiesName: choosedSku.name,
                imgUrl: this.imgUrl,
                originPrice: choosedSku.originPrice,
                price: choosedSku.price,
                stock: choosedSku.avail - choosedSku.hold,
                skuId: skuId,
                num: productNum,
                // 已经没有分期信息
                instalment: this.instalment,
                buyLimit: buyLimit ? Number(buyLimit) : 0
            }

            if (dataLen) {
                let shopFlag = true
                for (let i = 0; i < dataLen; i++) {
                    let shop = data.merchants[i].shop
                    let carts = data.merchants[i].carts
                    let len = carts.length
                    if (shop.merchantId === shopId) {
                        let cartFlag = true
                        for (let j = 0; j < len; j++) {
                            if (carts[j].productId == cartObj.productId && carts[j].skuId == cartObj.skuId && carts[j].instalment == cartObj.instalment) {
                                carts[j].num += productNum
                                let popList = data.merchants[i]
                                data.merchants.splice(i, 1)
                                data.merchants.unshift(popList)
                                cartFlag = false
                                break
                            }
                        }
                        shopFlag = false
                        if (cartFlag) {
                            data.merchants[i].carts.unshift(cartObj)
                            let popList = data.merchants[i]
                            data.merchants.splice(i, 1)
                            data.merchants.unshift(popList)
                        }
                        break
                    }
                }
                if (shopFlag) {
                    merchantObj.shop.merchantId = shopId
                    merchantObj.shop.name = shopName
                    merchantObj.carts.unshift(cartObj)
                    data.merchants.unshift(merchantObj)
                }
            } else {
                merchantObj.shop.merchantId = shopId
                merchantObj.shop.name = shopName
                merchantObj.carts.unshift(cartObj)
                data.merchants.unshift(merchantObj)
            }
            if (setLocalStorage('cartsData', JSON.stringify(data))) {
                return true
            } else {
                return false
            }
        },
        isOverCartLimit(cartNum) {
            let cartLimit = 99
            if (cartNum >= 99) {
                this.$_toast('您的购物车已满，请先去结算吧')
                window.location.href = '/pages/cart/list'
            } else {
                return false
            }
        },
        normalBuy() {
            let me = this
            let skuId = this.skuId
            let productNum = this.productNum

            // let activityId = this.activityState == 'ing' ? this.activityId : 0
            // activeType是走普通商品购买流程，但是也需activityId,并且不会冲突价格一期场景
            let productInfo
            // if (this.activityState == 'ing' || this.activeType) {
            // note: 特殊场景和免单activityId
            if (this.activityId || this.activityIdNormal) {
                let activityIds
                // if (this.activeType) {
                //     activityIds = (this.activeType === 'chance') ? this.activityIdChance : this.activityIdNormal
                // } else {
                //     activityIds = this.activityIdLimittime
                // }
                activityIds = this.activityId || this.activityIdNormal
                productInfo = [{
                    merchantId: this.shop.id,
                    skuId,
                    num: productNum,
                    activityIds: activityIds ? [activityIds] : []
                }]

                if (this.buyType === 'vip' && !this.activity.member) {
                    // 只有是A＋会员才需要传activityIds，不是A＋会员则不需要传
                    productInfo = [{
                        merchantId: this.shop.id,
                        skuId,
                        num: productNum
                    }]
                }
            } else {
                productInfo = [{
                    merchantId: this.shop.id,
                    skuId,
                    num: productNum
                }]
            }

            // note: done
            // A+会员新增，和上面逻辑有点重复，上面逻辑牵涉到之前的好几个活动，不敢动，等后台统一，前端再做统一调整，改变activityIds,用于下单流程参数
            // if (this.buyType === 'vip') {
            //     productInfo = [{
            //         merchantId: this.shop.id,
            //         skuId,
            //         num: productNum,
            //         activityIds: this.activity.id
            //     }]
            // }

            preBuyNow({
                // confirmInitV3({
                productInfo: JSON.stringify(productInfo)
            }).then((res) => {
                // data = data.ret || data
                if (res.success || res.code == '8070') {
                    if (this.productType == 'JD') {
                        // 提交时，地址存本地
                        setLocalStorage('area', JSON.stringify(this.area))
                    }
                    this.closePopup()
                    if (res.code == '8070') {
                        let { hitActivityId = '' } = res.result
                        if (this.isApp) {
                            hitActivityId = +hitActivityId
                        }
                        productInfo.forEach(item => {
                            if (item.activityIds && item.activityIds.length && item.activityIds.indexOf(hitActivityId) > -1) {
                                item.activityIds = []
                            }
                        })
                    }
                    setTimeout(() => {
                        me.$router.push({
                            path: '/pages/trade/confirm',
                            query: {
                                data: JSON.stringify(productInfo)
                            }
                        })
                    }, 300)
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                        return
                    }
                    this.$_toast(res.resultDes)
                }
            })
        },
        showSkuImgSwiper() {
            if (!this.skuImgList || !this.skuImgList.length) {
                this.initSkuImgList()
            }

            if (this.skuImgs && this.skuImgs.length) {
                this.skuImgs.filter((item, index) => {
                    if (item.imgUrl == this.imgUrl) {
                        this.updateInteractData({
                            targetKey: 'trade',
                            skuImgIndex: index
                        })
                    }
                })
            }

            this.createSkuSwiper()
        },
        initSkuImgList() {
            let skuImgList = []
            if (this.skuImgs && this.skuImgs.length && this.features) {
                this.skuImgs.forEach(({ kid, vid, imgUrl }) => {
                    this.features.forEach((feature) => {
                        feature.values.forEach((value) => {
                            if (kid == feature.kid && vid == value.vid) {
                                skuImgList.push({
                                    img: formatImg(imgUrl, 75, 200),
                                    skuName: feature.k + value.v
                                })
                            }
                        })
                    })
                })
            } else {
                skuImgList = [{
                    img: formatImg(this.imgUrl, 75, 200),
                    skuName: ''
                }]
            }
            this.updateInteractData({
                targetKey: 'trade',
                skuImgList: skuImgList
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.vip-icon {
    width: px2rem(40);
    height: px2rem(28);
    position: relative;
    top: px2rem(3);
}

.aui-popup {
    position: absolute;
}

.sell-limit-num {
    position: relative;
    top: px2rem(-5);
    margin-left: px2rem(20);
}

.sku__header {
    position: relative;
    height: px2rem(190);
    margin: 0 px2rem(32);

    .sku__imgIcon {
        position: absolute;
        top: px2rem(-50);
        left: 0;
        width: px2rem(200);
        height: px2rem(200);
        background-position: center center;
        background-repeat: no-repeat;
        background-color: #fff;
        background-size: contain;
        border: px2rem(1) solid #E4E4E4;
        border-radius: px2rem(4);
    }

    &>div {
        height: 100%;
        margin-left: px2rem(230);
    }

    .sku__money {
        @include flexbox();
        @include flexVertBase();
        padding: px2rem(30) 0 px2rem(8);
        height: px2rem(46);
        box-sizing: content-box;
        -webkit-box-sizing: content-box;

        &>* {
            flex: none;
        }

        .sku__money--price {
            font-size: px2rem(44);
            color: $auiAttentionColor;
            line-height: px2rem(46);
            font-weight: bold;
        }

        .sku__money--price.small {
            font-size: px2rem(32);

            .mantissa {
                font-size: px2rem(24);
            }

            margin-right: px2rem(10);
        }

        .money-icon {
            color: $auiAttentionColor;
            font-size: $auiFontSizeLevel5;
            line-height: px2rem(46);
            padding-right: px2rem(10);
        }

        .money-icon.small {
            font-size: px2rem(24);
            margin-left: px2rem(35);
            padding-right: px2rem(2);
        }
    }

    .sku__desc {
        width: px2rem(456);
        @include nLineLimit(2);
        text-align: left;
        font-size: $auiFontSizeLevel7;
        color: $auiTextColorGeneral;
        line-height: 125%;
    }
}

.aui-popup__bd {
    height: px2rem(570);
}

ol {
    padding: 0 px2rem(32);

    li {
        margin-bottom: px2rem(40);
    }

    dt {
        font-size: $auiFontSizeLevel5;
        color: $auiTextColorGeneral;
        line-height: 142.86%;
    }

    dd {
        display: inline-block;
        margin: px2rem(20) px2rem(10) 0 0;
        background: #F7F7F7;
        border-radius: px2rem(12);
        padding: px2rem(16) px2rem(30);
        font-size: $auiFontSizeLevel5;
        color: $auiTextColorImportant;
        line-height: 100%;

        &.disabled {
            color: #CCCCCC;
        }

        &.active {
            background: #FFD72D;
        }
    }
}

.sku__opr {
    position: relative;
    margin: 0 px2rem(32);
    height: px2rem(150);
    margin-bottom: px2rem(30);

    .sku__opr--num {
        font-size: $auiFontSizeLevel5;
        color: $auiTextColorGeneral;
        line-height: px2rem(60);
        vertical-align: top;
    }

    .sku__opr--num_container {
        position: absolute;
        top: 0;
        right: 0;
        @include flexbox();

        &>* {
            text-align: center;
        }

        .sku__opr--btn {
            flex: none;
            display: inline-block;
            width: px2rem(60);
            height: px2rem(60);
            font-size: $auiFontSizeLevel7;
            line-height: px2rem(60);
            background: #F7F7F7;
            color: #222;

            &.disabled {
                color: #ccc;
            }
        }

        .sku__opr--btn:nth-child(1) {
            border-top-left-radius: px2rem(12);
            border-bottom-left-radius: px2rem(12);
        }

        .sku__opr--btn:nth-last-child(1) {
            border-top-right-radius: px2rem(12);
            border-bottom-right-radius: px2rem(12);
        }

        .sku__opr--input {
            position: relative;
            width: px2rem(100);
            height: px2rem(60);
            margin: 0 px2rem(2);
            border-width: 0;

            &>* {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            input {
                opacity: 1;
                color: $auiTextColorImportant;
                z-index: 10;
                display: block;
                font-size: $auiFontSizeLevel4;
                line-height: px2rem(60);
                text-align: center;
                border-width: 0;
                border-radius: 0 !important;
                background: #F7F7F7;
            }
        }
    }

    .account_left {
        position: absolute;
        right: 0;
        top: px2rem(70);
        width: px2rem(220);
        text-align: center;
        font-size: px2rem(24);
        color: rgba(153, 153, 153, 1);
        line-height: px2rem(33);
        margin: px2rem(8) 0;

        span {
            font-weight: bold;
        }
    }
}

.shopping-btn-group {
    @include flexbox();
    width: 100%;
    height: px2rem(100);

    &>* {
        @include flex(1);
        display: block;
        text-align: center;
        height: 100%;
    }

    .to-cart {
        background: #FFD72D;
        font-size: $auiFontSizeLevel3;
        color: $auiTextColorImportant;
        line-height: px2rem(100);
    }

    .to-buy {
        background: $auiAttentionColor;
        font-size: $auiFontSizeLevel3;
        color: #FFFFFF;
        line-height: px2rem(100);
    }

    .disbaled-cart {
        background-color: #FFEDA7;
        color: #666666;
    }

    .disbaled-buy {
        background-color: #FFC1C1;
        color: #FFF;
    }
}

.disabled-btn {
    width: 100%;
    height: 100%;
    background: $auiTextColorLight;
    font-size: $auiFontSizeLevel3;
    color: $auiTextColorImportant;
    line-height: px2rem(100);
}

.sku__presaleMoney {
    text-align: left;

    span {
        color: #F66045;

        &:first-child,
        &:nth-child(3) {
            font-size: px2rem(24);
        }

        &:last-child,
        &:nth-child(2) {
            font-size: px2rem(44);
            margin-left: px2rem(-10);
        }

        &:nth-child(2) {
            margin-right: px2rem(28);
        }
    }
}
</style>
