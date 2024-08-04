<!--  created by zhouqing -->
<template>
    <div class="confirm-container">
        <div v-if="initDone" class="aui-page">
            <div class="aui-fixedbottom">
                <div class="footer-bar">
                    <div class="footer-bar__account">
                        <span class="fs28">合计: </span>
                        <span class="price cc1">{{finalTotalAmount}}</span>
                    </div>
                    <div class="footer-bar__btn"><a @click="confirm" href="javascript:;" class="aui-btn_full" :class="{'footer-bar__btn_disabled':!btnEnable}">去付款</a></div>
                </div>
            </div>
            <div class="aui-content" :style="tipsStyle">
                <!-- 快递邮寄提示 -->
                <p class="express-tips" v-once>{{expressTxt}}</p>
                <!-- 收货地址 尾款不能修改地址 -->
                <div @click.capture.stop="" v-if="isEndPay">
                    <p class="address-tips">已下定金，收货地址不可变更</p>
                    <axd-address></axd-address>
                </div>
                <axd-address v-else class="mt0"></axd-address>
                <!-- 收货地址 end-->
                <!-- 商铺 -->
                <merchant-more :isEndPay="isEndPay" :info="detailInfo" :productPresetData="productPresetData" :stageLabel="stageLabel"></merchant-more>
                <acm-code @back="setAcmCode"></acm-code>
                <presale-contract v-if="isFrontMoney" v-model="isAgree"></presale-contract>
                <axd-sea-amoy v-if="seaAmoyShow" @IdSuccess="isIdSuccess=true" @IdFail="isIdSuccess=false"></axd-sea-amoy>
                <p v-show="showStockTips" class="warning stockTips">{{stockTxt}}</p>
                <p v-show="fouthAddrTipsState" class="warning addrTips">{{updateTxt}}</p>
            </div>
        </div>
        <!-- router-slid -->
        <transition name="router-slide">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </transition>
        <axd-dialog v-if="showAlert" :showDialog="showAlert" :dialogInfo="dialogInfo" @subClick="closeDialog" @mainClick="addNewAddr"></axd-dialog>
    </div>
</template>
<script>

import { createNamespacedHelpers } from 'vuex'
import { AXD, formatNum } from 'src/libs/util'
// /* self */
import acmCode from '../common/acmCode.vue'
import presaleContract from './blocks/presale-contract.vue'
import merchantMore from './blocks/merchant_more.vue'
import { payMixinMulti } from '../common/assets/order_multi'
// /* address */
import axdAddress from 'module/address/address.vue'
import axdSeaAmoy from './blocks/seaAmoy.vue'
import { confirmInitV3, getPresaleInfo, confirmCommitV3, confirmPinCommit, getFinalPrice } from 'src/store/modules/trade/confirm'
import { getStreets } from 'src/store/api'
import axdDialog from '../common/item_dialog/dialog.vue'
const { mapActions, mapGetters, mapState, mapMutations } = createNamespacedHelpers('trade/confirm')
const { mapState: mapStateAddress, mapMutations: mapMutationsAddress } = createNamespacedHelpers('address')
const { mapState: mapStateJobInfo } = createNamespacedHelpers('jobInfo')

export default {
    name: 'product_confirm',
    mixins: [payMixinMulti],
    data() {
        return {
            expressTxt: '【安全提示】近期有不法分子冒充我司用“刷单”名义引诱用户扫码付款，进行诈骗。请保护个人财产，以免损失。',
            initDone: false,
            productInfo: {},
            couponData: {},
            cpCode: '',
            acm: '',
            buyerMessage: '',
            confirmBtn: true,
            stageLabel: {
                stageFreeStr: false
            },
            showUpdateAddrTips: false,
            updateTxt: '爱又米地址库升级了，请完善街道信息，否则无法配送',
            stockTxt: '已选商品参数暂时无货，请更换其他商品参数',
            showStockTips: false,
            dialogInfo: {},
            showAlert: false,
            seaAmoyShow: false, // 是否展示海淘身份验证
            isIdSuccess: true,
            tipsStyle: '',
            queryParams: JSON.parse(this.$route.query.data),
            detailInfo: {},
            totalAmount: 0,
            fouthAddrTipsState: false, // 四级地址展示,
            productPresetData: null,
            isAgree: false,
            isPresale: false
        }
    },
    components: {
        acmCode,
        presaleContract,
        axdAddress,
        axdDialog,
        axdSeaAmoy,
        merchantMore
    },
    computed: {
        ...mapState({
            storeState: state => state,
            storeCoupon: state => state.wholeCoupon,
            storeStageChecked: state => state.stageChecked,
            storeStageFirstPay: state => state.stageFirstPay,
            storeStageNum: state => state.stageNum,
            storeCsrfToken: state => state.csrfToken,
            storePin: state => state.pin,
            storeCouponInfo: state => state.couponInfo,
            storeMerIndex: state => state.couponForMerchantIndex,
            storeCreateOrderSku: state => state.createOrderSku,
            storeHasWholeCoupon: state => state.hasWholeCoupon,
            checkedProductFreeInterestCode: state => state.checkedProductFreeInterestCode,
            accidentInsuranceState: state => state.accidentInsurance
        }),
        ...mapStateAddress({
            storeDeliverId: state => state.addrSelected.id,
            storeStreetCode: state => state.addrSelected.streetCode,
            storeDistrictCode: state => state.addrSelected.districtCode
        }),
        ...mapStateJobInfo({
            jobInfo: state => state.jobInfo
        }),
        ...mapGetters([
            'idCardTipsState'
        ]),
        type() {
            return this.queryParams[0].createTeambuy ? 'pin' : 'normal' // 拼团商品or普通商品
        },
        isEndPay() { // 是否是尾款
            return this.queryParams[0].goodsType === 'ENDPAY'
        },
        isFrontMoney() { // 是否是定金
            return this.isPresale && !this.isEndPay
        },
        comfirmFunction() {
            if (this.type === 'pin') {
                return confirmPinCommit
            } else {
                return confirmCommitV3
            }
        },
        btnEnable() {
            return this.confirmBtn
        },
        // 通过三级或者四级地址的联合code，判断地址的变化
        addressChangeFlag() {
            return this.storeDistrictCode + '_' + this.storeStreetCode
        },
        isTipsShow() {
            return this.showStockTips || this.fouthAddrTipsState || this.idCardTipsState
        },
        finalTotalAmount() {
            let insurance = this.accidentInsuranceState
            return insurance && insurance.isChosed && insurance.insuranceInfo && insurance.insuranceInfo.payment ? `￥${formatNum(this.totalAmount)} + ￥${insurance.insuranceInfo.payment}` : `￥${formatNum(this.totalAmount)}`
        }
    },
    watch: {
        addressChangeFlag(newValue) {
            if (this.productType != 'JD') {
                return
            }
            // 京东商品，进行地址升级、库存校验
            this.checkUpdateAddr()
            this.checkStockState()
        },
        isTipsShow(newValue) {
            if (newValue) {
                this.tipsStyle = 'padding-bottom:' + window.hotcss.px2rem(112, 750) + 'rem'
            } else {
                this.tipsStyle = 'padding-bottom: 0rem'
            }
        },
        storeCouponInfo(newVal) {
            if (this.storeMerIndex > -1) {
                this.detailInfo.confirmVo.merchants[this.storeMerIndex].couponVo = newVal
                let copyArr = JSON.parse(JSON.stringify(this.storeCreateOrderSku))
                copyArr[this.storeMerIndex].cpCode = newVal.code
                this.EDIT_SKUPARAM(copyArr)
            } else {
                this.detailInfo.wholeCouponVo = newVal
                this.CONFIRM_INIT({
                    wholeCoupon: newVal
                })
            }
            this.getPriceAfterChangeCoupon()
        },
        storeStageNum(newValue) {
            if (!newValue) {
                this.resetAccidentInsuranceInfo()
            }
        }
    },
    beforeMount() {
        // 重置购物车的回退 安卓端会导致任何交互的回调都刷新页面
        window.axdBackFunc = function() {}
    },
    mounted() {
        if (typeof this.$store === 'undefined') {
            return
        }
        this.init()
        this.preSaleInit()
        if (this.type === 'pin') {
            this.pinParamsInit()
        }
        // console.log(this.queryParams)
    },
    methods: {
        ...mapMutations([
            'CONFIRM_INIT',
            'changeBottomTips',
            'CONFIRM_UPDATE_DATA',
            'EDIT_SKUPARAM',
            'resetAccidentInsuranceInfo'
        ]),
        ...mapMutationsAddress([
            'saveAddress'
        ]),
        pinParamsInit() {
            let { recordId, tbId, createTeambuy } = this.queryParams[0]
            this.CONFIRM_INIT({
                pin: {
                    recordId,
                    tbId,
                    createTeambuy
                }
            })
        },
        preSaleInit() {
            if (this.queryParams.length !== 1) {
                return
            }
            let { skuId, goodsType, outOrderId: orderId, num } = this.queryParams[0]
            getPresaleInfo({ skuId, goodsType, orderId, num }).then(({ success, result }) => {
                if (success && result) {
                    this.productPresetData = result
                }
            })
        },
        init() {
            confirmInitV3({
                productInfo: JSON.stringify(this.queryParams)
            }).then(({ success, result, code, resultDes }) => {
                if (!success) {
                    if (code === '-1999') {
                        AXD.util.login()
                        return
                    }
                    this.$_toast(resultDes)
                    return
                }
                if(!result) {
                    return
                }

                let { wholeCouponVo, confirmVo, csrfToken } = result

                // V3合并支付  全场红包 hasWholeCoupon调取红包弹窗是判断使用
                let wholeCoupon
                let hasWholeCoupon
                if (wholeCouponVo) {
                    wholeCoupon = wholeCouponVo
                    hasWholeCoupon = true
                } else {
                    wholeCoupon = {
                        useEffect: '无可使用红包',
                        code: ''
                    }
                    hasWholeCoupon = false
                }

                // console.log(this.seaAmoyShow, '===seaAmoy')
                // 详细信息
                this.detailInfo = result
                // 默认下发总价
                this.totalAmount = confirmVo.cartTotalPrice

                this.saveAddress(result.deliver)

                // 重组信息存储公用入参
                let createOrderSku = confirmVo.merchants.map(({ carts, couponVo, shop }, index) => {
                    // 无红包需要给默认信息，code值不要修改，undefined状态不会调起红包面板┐(￣ヮ￣)┌
                    if (!couponVo) {
                        confirmVo.merchants[index].couponVo = {
                            useEffect: '无可使用红包',
                            code: undefined
                        }
                    }

                    let { merchantId } = shop

                    let data = carts.map(({ skuId, num, activityIds, cartId, productType, isSeaAmoy, storageMode }, i) => {
                        // 是否有海淘商品
                        if (isSeaAmoy == 'y' && !this.isEndPay) {
                            this.seaAmoyShow = true
                        }
                        if (storageMode == 2) { // 是否预售商品
                            this.isPresale = true
                        }
                        let { goodsType, outOrderId } = this.queryParams[i] || {}
                        return { merchantId, skuId, cartId, num, activityIds: activityIds || [], goodsType, outOrderId }
                    })
                    return {
                        cpCode: confirmVo.merchants[index].couponVo.code,
                        buyerMessage: '',
                        skuItemVos: data
                    }
                })
                this.CONFIRM_INIT({
                    totalAmount: this.totalAmount,
                    csrfToken,
                    createOrderSku,
                    hasWholeCoupon,
                    wholeCoupon
                })

                // 是否有活动免息 TO DO
                // 是否还有用
                this.stageLabel.stageFreeStr = result.mxMark
                this.initDone = true
            })
        },
        setAcmCode(data) {
            this.acm = data
        },
        confirm() {
            if (!this.btnEnable) {
                return
            }
            if (!this.storeDeliverId) {
                this.$_toast('请添加收货地址')
                return
            }
            if (this.storeStageChecked && !this.storeStageNum) {
                this.$_toast('请选择分期方案')
                return
            }
            if (this.seaAmoyShow && this.idCardTipsState) {
                this.$_toast('请填写收件人身份信息，否则无法发货')
                return
            }
            if (!this.isAgree && this.isFrontMoney) {
                this.$_toast('您还未同意《定金不退预售协议》')
                return
            }

            if (this.accidentInsuranceState && this.accidentInsuranceState.isChosed && !this.jobInfo.id) {
                this.$_toast('请确认，您已经选择职业信息')
                return
            }
            if (this.accidentInsuranceState && this.accidentInsuranceState.isChosed && !this.accidentInsuranceState.isAgreed) {
                this.$_toast('请确认，您已经勾选投保须知')
                return
            }
            let params = {
                acm: this.acm,
                firstpaybal: this.storeStageFirstPay,
                month: this.storeStageNum,
                cpCode: this.storeCoupon.code,
                deliverId: this.storeDeliverId,
                csrfToken: this.storeCsrfToken, // 唯一性验证，防止重复提交
                // stageId: this.stageId, // 一元夺宝批次号 V3 无此业务注释
                orderItmeVos: this.storeCreateOrderSku,
                payCode: this.checkedProductFreeInterestCode
            }
            if (this.type === 'pin') {
                Object.assign(params, this.storePin)
            }
            this.createOrder(params)
        },
        // check地址是否需要升级
        checkUpdateAddr(oprType) {
            if (!this.storeStreetCode) {
                if (this.storeDistrictCode) {
                    getStreets({
                        districtCode: this.storeDistrictCode
                    }, (data) => {
                        if (data.success) {
                            if (data.result && data.result.length) {
                                // 存在四级地址，提示升级
                                this.fouthAddrTipsState = true
                            } else {
                                this.fouthAddrTipsState = false
                            }
                        } else {
                            if (data.resultDes) {
                                this.$_toast(data.resultDes)
                            }
                        }
                        // this.changeBottomTips({
                        //     fouthAddr: this.showUpdateAddrTips
                        // })
                    })
                } else {
                    this.fouthAddrTipsState = false
                }
            } else {
                // 记得改为false  TO DO
                this.fouthAddrTipsState = false
            }
            console.log(this.fouthAddrTipsState, '===地址tip')
            this.changeBottomTips({
                fouthAddr: this.fouthAddrTipsState
            })
            if (this.fouthAddrTipsState) {
                this.dialogInfo = {
                    title: '',
                    content: '爱又米地址库升级了，请完善街道信息，否则无法配送',
                    btn: '去完善',
                    subBtn: '取消',
                    singleBtn: false
                }
                this.showAlert = true
            }
        },
        // 该地区是否有货
        checkStockState() {
            if (this.showStockTips) {
                this.dialogInfo = {
                    title: '',
                    content: '已选商品参数暂时无货，请更换其他商品参数',
                    btn: '我知道了',
                    singleBtn: true
                }
                this.showAlert = true
            }
        },
        closeDialog() {
            this.showAlert = false
        },
        addNewAddr() {
            this.showAlert = false
            let id = -1
            if (this.dialogInfo.btn == '去完善') {
                id = this.storeDeliverId
                this.$router.push({
                    path: this.$route.path + '/address/list',
                    query: {
                        id,
                        isFromTrade: 'true'
                    }
                })
            } else if (this.dialogInfo.btn == '回购物车') {
                this.$router.push({
                    path: '/pages/cart/list'
                })
            } else if (this.dialogInfo.btn != '我知道了') {
                this.$router.push({
                    // name: 'addressAdd',
                    name: 'confirmAdd',
                    query: {
                        id: id,
                        isFromTrade: true
                    }
                })
            }
        },
        getPriceAfterChangeCoupon() {
            getFinalPrice({
                msg: JSON.stringify(this.storeCreateOrderSku),
                wholeCp: this.storeCoupon.code
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    let { cartTotalPrice, merchants } = result.confirmVo
                    this.detailInfo.confirmVo.cartTotalPrice = cartTotalPrice
                    this.detailInfo.confirmVo.merchants.map((item, index) => {
                        return Object.assign(item, {
                            shopTotalPrice: merchants[index].shopTotalPrice
                        })
                    })
                    this.totalAmount = cartTotalPrice
                    let wholeCoupon
                    let hasWholeCoupon
                    if (result && result.wholeCouponVo) {
                        let { useEffect, code } = result.wholeCouponVo
                        wholeCoupon = { useEffect, code }
                        hasWholeCoupon = true
                    } else {
                        // 提交的时候有全场红包，但是下发的时候没有全场红包，说明是店铺修改了红包，并导致全场红包无任何可用
                        if (this.storeCoupon.code) {
                            wholeCoupon = {
                                useEffect: '无可使用红包',
                                code: ''
                            }
                            hasWholeCoupon = false
                        } else {
                            if (this.storeHasWholeCoupon) {
                                wholeCoupon = {
                                    useEffect: '不使用红包',
                                    code: ''
                                }
                            } else {
                                wholeCoupon = {
                                    useEffect: '无可使用红包',
                                    code: ''
                                }
                            }
                        }
                    }
                    this.CONFIRM_INIT({
                        totalAmount: cartTotalPrice,
                        wholeCoupon,
                        hasWholeCoupon
                    })
                } else {
                    this.$_toast(resultDes)
                }
            })
        }
        // ,
        // getWholeCouponFn() {
        //     getWholeCoupon({
        //         msg: JSON.stringify(this.storeCreateOrderSku)
        //     }).then(({ success, result, resultDes }) => {
        //         if (success) {
        //             if (!result) {
        //                 return
        //             }
        //             let { code, useEffect } = result
        //             this.CONFIRM_INIT({
        //                 wholeCoupon: { code, useEffect },
        //                 hasWholeCoupon: true
        //             })
        //         } else {
        //             resultDes && this.$_toast(resultDes)
        //         }
        //     })
        // }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.footer-bar__btn_disabled {
    background: $auiTextColorLight;
}

.aui-btn_full {
    font-size: px2rem(34);
}

.mt0 {
    margin-top: 0;
}

.express-tips {
    margin-top: px2rem(20);
    padding: px2rem(10) px2rem(30);
    font-size: $auiFontSizeLevel6;
    color: #F99E00;
    background: #FFFAE1;
}

.address-tips {
    padding: px2rem(16) px2rem(30);
    color: #999;
    font-size: px2rem(26);
    margin-bottom: px2rem(-20);
}

.warning {
    position: fixed;
    bottom: px2rem(100);
    width: 100%;
    font-size: px2rem(28);
    line-height: px2rem(70);
    color: #F99E00;
    background: #FFFAE1;
    text-align: center;
}

.confirm-container {
    .footer-bar {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        height: 100%;
        overflow: hidden;

        &__account {
            width: px2rem(460);
            padding: px2rem(38) 0 0 px2rem(32);
            font-size: $auiFontSizeLevel7;
            line-height: 100%;
            text-align: right;

            .price {
                font-size: px2rem(32);
                margin-right: px2rem(22);
            }

            .fs28 {
                font-size: $auiFontSizeLevel5;
            }

            .fs36 {
                font-size: $auiFontSizeLevel2;
            }

            .cc1 {
                color: #E31436;
            }

            .fwb {
                // font-weight: 700;
                font-size: px2rem(32);
            }
        }

        &__btn {
            -webkit-box-flex: 1;
            -moz-box-flex: 1;
            box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            background-color: #FFE352;
            color: #474747;

            &_disabled {
                background: $auiTextColorLight
            }
        }
    }
}
</style>
