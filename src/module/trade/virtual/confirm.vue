<!--
 * @Description: 话费/游戏/会员充值确认页
 * @Author: sunxj
 * @Date: 2019-01-09 20:15:46
 * @LastEditTime: 2019-03-04 13:15:15
 * @LastEditors: sunxj
 -->
<template>
    <div>
        <div class="aui-page" v-if="!fixedPageHeight"></div>
        <div class="aui-page" v-if="fixedPageHeight" :style="{'height':+fixedPageHeight+'px'}">
            <hybrid-header :config="barConfig"></hybrid-header>
            <div class="aui-fixedbottom">
                <!-- <check-account v-if="typeAppleid"></check-account> -->
                <div class="footer-bar">
                    <div class="footer-bar__account"><span class="fs28">合计: </span><span class="price cc1"><em class="fs28">￥</em><em class="fwb">{{storeCartTotalPrice | formatNum}}</em></span></div>
                    <div class="footer-bar__btn"><a @click.stop.prevent="submit" href="javascript:;" class="aui-btn_full" :class="{'footer-bar__btn_disabled':!confirmBtn}">提交订单</a></div>
                </div>
            </div>
            <div class="aui-content">
                <div class="aui-cells" v-if="storeChargeAcm">
                    <div class="aui-cell account_height">
                        <div class="aui-cell__bd">
                            <p>充值帐号</p>
                        </div>
                        <div class="aui-cell__ft">{{storeChargeAcm}}</div>
                    </div>
                </div>
                <div class="aui-cells">
                    <div class="aui-cell select">
                        <div class="aui-cell__bd">
                            <p>订单信息</p>
                        </div>
                        <div class="aui-cell__ft">{{storeRechargeTitle}}</div>
                    </div>
                    <div class="aui-cell select">
                        <div class="aui-cell__bd">
                            <p>商品金额</p>
                        </div>
                        <div class="aui-cell__ft">¥ {{ confirmProductInfo.price | money(100) }}</div>
                    </div>
                    <coupon-cell @click.native="getCouponList(cpType.shop, 0)" title="商品红包" :coupon="shopCoupon" />
                    <div class="aui-cell select">
                        <div class="aui-cell__bd"></div>
                        <div class="aui-cell__ft">小计:¥{{ shopTotalPrice | formatNum }}</div>
                    </div>
                </div>
                <!-- 红包与分期 -->
                <div class="aui-cells">
                    <coupon-cell @click.native="getCouponList(cpType.cart)" title="平台红包" :coupon="storeWholeCoupon" />
                    <!-- <stages-cell v-if="showStages" @showStage="getStagesInfo" /> -->
                </div>
                <acm-code @back="setAcmCode"></acm-code>
            </div>
            <popup :isPop="isPop" @complete="popSelect" @cancel="popCancel">
                <!-- <keep-alive> -->
                <components slot="content" :is="componentName" :popData="popData" @confirm="popSelect"></components>
                <!-- </keep-alive> -->
            </popup>
        </div>
    </div>
</template>
<script>
import hybridHeader from 'components/header/hybridheader.vue'
import acmCode from '../common/acmCode.vue'
import dialog from '../common/item_dialog/dialog.vue'

// import axdDialog from 'components/dialog/index'
import {
    payMixinMulti
} from '../common/assets/order_multi'
import {
    initMixin,
    popMixin,
    acmMixin
} from '../common/confirm/mixins'
import {
    virtualConfirmInit,
    virtualCouponList,
    virtualCouponChange,
    virtualFQData,
    virtualFQGoodsCode,
    virtualCreateTradeV3,
    getHaswholeCp
} from 'store/modules/trade/virtual'
// import {
//     confirmInit,
//     virualCreate
// } from 'store/modules/trade/confirm'
import { setLocalStorage } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/virtual')

export default {
    name: 'comfirmVirtual',
    mixins: [initMixin, popMixin, acmMixin, payMixinMulti],
    data() {
        return {
            fixedPageHeight: 0,
            initialBodyHeight: 0,
            showDialog: false,
            barConfig: {
                h5: {
                    title: '确认订单', // title
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            confirmBtn: true,
            wholeCpType: 'cart',
            comfirmFunction: virtualCreateTradeV3,
            getHaswholeCpUrl: getHaswholeCp,
            virtualConfirmInitUrl: virtualConfirmInit,
            getCouponListUrl: virtualCouponList,
            couponChangeUrl: virtualCouponChange,
            virtualFQDataUrl: virtualFQData,
            virtualFQGoodsCodeUrl: virtualFQGoodsCode,
            isPageSoureNoStore: false, // 页面来源非本项目
            backUrl: this.$route.query.backUrl // 金融购买会员/通行证
        }
    },
    computed: {
        ...mapState({
            storeRechargeTitle: state => state.rechargeTitle,
            type: state => state.type,
            storeName: state => state.name,
            storeSkus: state => state.skus,
            storeProImg: state => state.proImg,
            storeChargeAcm: state => state.chargeAcm,
            storePasscard: state => state.passcard,
            storeChargegame: state => state.chargegame,
            storeChargeregion: state => state.chargeregion,
            storeChargeserver: state => state.chargeserver,
            storeChargetype: state => state.chargetype,
            storeAcm: state => state.acm,
            storeGoodstype: state => state.goodstype,
            token: state => state.token,
            storeNum: state => state.comfirm.num,
            storeActivityIds: state => state.activityIds,
            storeProductId: state => state.productId,
            storeUid: state => state.uid,
            storeSource: state => state.source,
            storeIsRefresh: state => state.isRefresh
            // storePproductUrl: state => state.productUrl,
            // storeGamesVo: state => state.gamesVo
        }),
        confirmProductInfo() {
            return this.merchantsArr[0].carts[0]
        },
        confirmActivityIds() {
            return this.confirmProductInfo.activityIds
        },
        shopCoupon() {
            return this.storeShopCouponArr[0]
        },
        shopTotalPrice() {
            return this.storeShopTotalPriceArr[0]
        },
        skuId() {
            return this.storeSkus.id
        },
        showStages() {
            return this.storeSource !== 'vipcard' && this.storeSource !== 'passcard'
        }
    },
    watch: {
        storeStageChecked(newVal) {
            if (!newVal) {
                this.resetStageValue()
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        ...mapMutations([
            'saveVirtualData'
        ]),
        init() {
            this.isPageSoureNoStore = this.skuId === null || this.skuId === undefined || this.skuId.length === 0
            if (!this.isPageSoureNoStore && !this.storeIsRefresh) {
                this.$router.go(-1)
                return
            }
            this.getConfirmInfo()
        },
        getInitParams() {
            let params
            if (this.isPageSoureNoStore) {
                // 参数来源于url
                const { activityIds, goodsType, num, skuId, tagSource, tagValue, rechargeTitle } = this.$route.query
                if (skuId && skuId.length !== 0 && tagSource === 'tuishou') {
                    this.saveVirtualData({
                        activityIds: activityIds,
                        isRefresh: 'n', // 确认页刷新isRefresh值丢失返回上一页
                        skuId: skuId,
                        confirm: {
                            num: num
                        },
                        skus: {
                            id: skuId
                        },
                        goodstype: goodsType,
                        rechargeTitle: rechargeTitle,
                        tagSource,
                        tagValue
                    })
                }
                params = {
                    activityIds,
                    goodsType,
                    num,
                    skuId,
                    tagSource,
                    tagValue
                }
            } else {
                params = {
                    activityIds: this.storeActivityIds,
                    goodsType: this.storeGoodstype,
                    num: this.storeNum,
                    skuId: this.skuId
                }
            }
            params = JSON.stringify(params)
            return params
        },
        // 获取红包列表参数
        getCouponListParams() {
            let cpType = this.cpType.current
            let params = {
                activityIds: this.confirmActivityIds,
                cpType,
                goodsType: this.storeGoodstype,
                num: this.storeNum,
                skuId: this.skuId,
                wholeCp: this.storeWholeCoupon.code,
                cpCode: this.shopCoupon.code
            }
            // if (cpType === this.cpType.cart) {
            //     params.wholeCp = this.storeWholeCoupon.code
            // } else if (cpType === this.cpType.shop) {
            //     params.cpCode = this.shopCoupon.code
            // }
            params = JSON.stringify(params)
            return { params }
        },
        // 获取选择红包参数
        getCouponChangeParams() {
            let cpType = this.cpType.current
            let params = {
                activityIds: this.confirmActivityIds,
                goodsType: this.storeGoodstype,
                num: this.storeNum,
                skuId: this.skuId,
                wholeCp: this.storeWholeCoupon.code,
                cpCode: this.shopCoupon.code,
                wholeCpType: this.wholeCpType
            }
            params = JSON.stringify(params)
            return { params }
        },
        // 获取分期列表参数
        getFqListParams() {
            let params = {
                activityIds: this.confirmActivityIds,
                goodsType: this.storeGoodstype,
                num: this.storeNum,
                skuId: this.skuId,
                wholeCp: this.storeWholeCoupon.code,
                cpCode: this.shopCoupon.code,
                wholeCpType: this.wholeCpType
            }
            params = JSON.stringify(params)
            return { params }
        },
        getgetStageDetailParams(item) {
            let params = {
                activityIds: this.confirmActivityIds,
                goodsType: this.storeGoodstype,
                num: this.storeNum,
                skuId: this.skuId,
                wholeCp: this.storeWholeCoupon.code,
                cpCode: this.shopCoupon.code,
                wholeCpType: this.wholeCpType,
                firstpaybal: item.value,
                month: item.month
            }
            params = JSON.stringify(params)
            return { params }
        },
        submit() {
            if (!this.confirmBtn) {
                return
            }
            let { firstpaybal, month, isSelect } = this.storeStagesInfo
            if (this.storeStageChecked && !isSelect) {
                this.$_toast('请选择分期方案')
                return false
            }
            // 设置缓存账号
            if (this.storeSource === 'gameVip') {
                this.setStorageUserAcm()
            }

            let params = {
                activityIds: this.confirmActivityIds || [],
                csrfToken: this.storeCsrfToken,
                firstpaybal,
                goodsType: this.storeGoodstype,
                month,
                num: this.storeNum,
                skuId: this.skuId,
                cpCode: this.shopCoupon.code,
                wholeCp: this.storeWholeCoupon.code,
                wholeCpType: this.wholeCpType,
                skuItemExtVo: {
                    goodsType: this.storeGoodstype,
                    activeCode: '', // 话费充值活动码
                    chargeaccount: this.storeChargeAcm.split(' ').join(''),
                    chargegame: this.storeChargegame,
                    chargeregion: this.storeChargeregion,
                    chargeserver: this.storeChargeserver,
                    chargetype: this.storeChargetype,
                    passcard: this.storePasscard
                }
            }

            if (this.storeGoodstype === 'vipcard') {
                params.skuItemExtVo = null
            }
            if (this.isPageSoureNoStore) {
                const { tagSource, tagValue } = this.$route.query
                params = {
                    ...params,
                    tagSource,
                    tagValue
                }
            }
            // 调用公共创建订单，唤起收银台方法
            if (this.storeSource === 'passcard') {
                params.outOrderId = this.$route.query.loanId
                this.createOrder(params, (res, gid, tid) => {
                    this.orderCallback(res, gid, tid)
                })
            } else {
                this.createOrder(params)
            }
        },
        orderCallback(res, gid, tid) {
            let data = res.data
            if (data.success === 'true') {
                setTimeout(() => {
                    if (this.backUrl) {
                        window.location.replace(this.backUrl)
                    } else {
                        this.$router.replace({
                            name: 'payResult',
                            params: {
                                tradeId: tid
                            },
                            query: {
                                gid
                            }
                        })
                    }
                }, 1500)
                return
            }
            this.$_toast({
                txt: data.errorInfo,
                callback: () => {
                    this.$router.go(-1)
                }
            })
        },
        setStorageUserAcm() {
            let localStorage = window.localStorage
            let arr = JSON.parse(localStorage.getItem('virtualAcmData')) || []
            let acmObj = {
                uid: this.storeUid,
                // virtualType: this.type,
                productId: this.storeProductId,
                chargeaccount: this.storeChargeAcm,
                passcard: this.storePasscard
            }
            if (arr.length) {
                let flag = true
                for (let item of arr) {
                    if (item.uid == acmObj.uid && item.productId == acmObj.productId) {
                        item.chargeaccount = acmObj.chargeaccount
                        item.passcard = acmObj.passcard
                        flag = false
                        break
                    }
                }

                if (flag) {
                    arr.push(acmObj)
                }
            } else {
                arr.push(acmObj)
            }
            let newArr = JSON.stringify(arr)
            setLocalStorage('virtualAcmData', newArr)
        }
    },
    components: {
        hybridHeader,
        acmCode,
        'axd-dialog': dialog

    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-content {
    padding-bottom: px2rem(80);
}

.account_height {
    height: px2rem(152);

    .aui-cell__ft {
        color: rgba(246, 96, 69, 1);
        font-size: px2rem(60);
    }
}

.footer-bar__btn_disabled {
    background: $auiTextColorLight;
}
</style>
