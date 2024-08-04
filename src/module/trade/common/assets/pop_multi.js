/**
 *
 * @author:      yangjun
 * @dateTime:    2018-05-02 14:48:32
 * @description:
 */
import productCouponPop from '../item_coupon/popup_multi.vue'
import { getStageV3, getWholeCoupon, getShopCpList, isCanBuyInsurance } from 'store/modules/trade/confirm'
import { AXD } from 'src/libs/util'
import uploadUserContract from './upload-user-contract'
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapGetters, mapState, mapMutations } = createNamespacedHelpers('trade/confirm')
var commonMixin = {
    data() {
        return {
            popData: {},
            isPop: false,
            componentName: '' // stagePop | couponPop
        }
    },
    methods: {
        popSelect(data) {
            this.popReset()
        },
        popCancel() {
            this.popReset()
        },
        popReset() {
            this.isPop = false
            setTimeout(() => {
                this.componentName = ''
            }, 300)
        }
    }
}

var productCouponMixin = {
    mixins: [commonMixin],
    data() {
        return {
            code: '',
            useEffect: '',
            couponPopData: {
                title: '红包'
            }
        }
    },
    computed: {
        ...mapState({
            storeCreateOrderSku: (state) => state.createOrderSku,
            storeCouponParam: (state) => state.createOrderSku,
            // storeCouponParam: state => state.commonCouponParam,
            storeIndex: (state) => state.couponForMerchantIndex
        })
    },
    methods: {
        getCouponData(merchantId) {
            getShopCpList({
                productInfo: JSON.stringify(this.storeCouponParam),
                merchantId
            }).then(({ success, result, resultDes }) => {
                if (success && result) {
                    this.$set(this.couponPopData, 'title', '红包')
                    this.$set(this.couponPopData, 'list', result)
                    this.setCouponPop()
                } else {
                    this.$_toast(resultDes)
                }
            })
        },
        showCouponPop(i, merchantId) {
            // let code = this.storeCreateOrderSku[this.storeIndex].cpCode
            // if (typeof code == 'undefined') {
            //     return
            // }
            // console.log(this.couponPopData.list, '===商铺红包列表')
            // if (this.couponPopData.list && this.storeCreateOrderSku.length === 1) {
            //     this.setCouponPop()
            // } else {
            // }
            // 因为联动的原因，红包随时会有变化，不在存储缓存
            this.getCouponData(merchantId)
        },
        setCouponPop() {
            this.popData = this.couponPopData
            this.componentName = productCouponPop
            this.isPop = true
        }
    },
    components: {
        productCouponPop
    }
}

var wholeCouponMixin = {
    mixins: [commonMixin],
    data() {
        return {
            code: '',
            useEffect: '',
            couponPopData: {
                title: '满减红包'
            }
        }
    },
    computed: {
        ...mapState({
            storeHasCoupon: (state) => state.hasWholeCoupon,
            storeCouponParam: (state) => state.createOrderSku,
            storeCoupon: (state) => state.wholeCoupon
        })
    },
    methods: {
        getCouponData() {
            getWholeCoupon({
                msg: JSON.stringify(this.storeCouponParam)
            }).then(({ success, result, resultDes }) => {
                if (success) {
                    this.$set(this.couponPopData, 'title', '满减红包')
                    this.$set(this.couponPopData, 'list', result)
                    this.setCouponPop()
                } else {
                    this.$_toast(resultDes)
                }
            })
        },
        showCouponPop(index) {
            // console.log('全场红包列表')
            // if (this.couponPopData.list) {
            //     this.setCouponPop()
            // } else {
            // }
            this.getCouponData()
        },
        setCouponPop() {
            this.popData = this.couponPopData
            // console.log(this.popData)
            this.componentName = productCouponPop
            this.isPop = true
        }
    },
    components: {
        productCouponPop
    }
}

var popMixin = {
    mixins: [commonMixin],
    filters: {
        stageTextFormat(value) {
            return value || '请选择分期方案'
        }
    },
    data() {
        return {
            //
            //  : false,
            disableStage: true,
            stagePopData: {}
        }
    },
    props: {
        switchUse: {
            type: Boolean,
            default: true
        },
        stageLabel: {
            type: Object,
            default: () => {
                return {
                    stageFreeStr: '',
                    stageCorner: '',
                    stageDesc: ''
                }
            }
        }
    },
    computed: {
        ...mapState({
            storeStageText: (state) => state.stageText,
            storeStageDetail: (state) => state.stageDetail,
            stageChecked: (state) => state.stageChecked,
            productInstalment: (state) => state.productInstalment,
            storeCouponParam: (state) => state.createOrderSku,
            storeCoupon: (state) => state.wholeCoupon,
            totalAmount: (state) => state.totalAmount,
            stageNum: (state) => state.stageNum,
            productId: (state) => state.productId
        }),
        ...mapGetters([
            'skuIdAndNum'
            // ,
            // 'finalPay'
        ]),
        storeStageChecked: {
            get() {
                return this.stageChecked
            },
            set(value) {
                this.CONFIRM_UPDATE_DATA({
                    name: 'stageChecked',
                    value: value
                })
            }
        }
    },
    watch: {
        storeStageChecked(to, from) {
            if (to) {
                this.switchUse && this.showStagePop()
            } else {
                this.resetStageValue()
            }
        },
        storeCouponCode(to, from) {
            this.stagePopData = {}
            if (this.totalAmount == 0) {
                this.switchUse && (this.storeStageChecked = false)
                this.disableStage = true
                return
            }
            this.resetStageValue()
            if (this.storeStageChecked || !this.switchUse) {
                this.$_toast('红包已经更改，请重新选择分期方案')
            }
        }
    },
    mounted() {
        // 重置 分期信息
        this.storeStageChecked = false
        if (this.switchUse === false) {
            this.getStageData('btn')
        }
    },
    methods: {
        ...mapMutations(['CONFIRM_UPDATE_DATA', 'SELECT_STAGE', 'SAVE_STAGE_DATA']),
        resetStageValue(type) {
            this.SELECT_STAGE({
                firstPay: '',
                num: '',
                detail: {
                    firstPayAmount: '...',
                    stageAmount: '...',
                    monthPay: '...'
                },
                stageText: ''
            })
        },
        getStageData(type) {
            // 1. 上传通讯录
            // 2. 获取分期信息
            const getData = () => {
                getStageV3({
                    msg: JSON.stringify(this.storeCouponParam),
                    wholeCp: this.storeCoupon.code
                }).then((res) => {
                    // if (res.success && res.result.stageInfo && res.result.stageInfo.length) {
                    if (res.success) {
                        this.SAVE_STAGE_DATA({
                            content: res.result
                        })

                        let vitrue = true
                        if (type === 'btn') {
                            this.disableStage = false
                            this.storeStageChecked = true
                            vitrue = this.switchUse
                        }
                        vitrue && this.setStagePop()
                    } else {
                        if (res.code == 416) {
                            this.$_confirm({
                                content: res.resultDes,
                                confirmBtn: '去提额',
                                onConfirm() {
                                    let {
                                        result: { showStages = [{}] }
                                    } = res
                                    AXD.util.goCredit(showStages[0].creditUrl)
                                }
                            })
                            return
                        }

                        this.$_toast(res.resultDes)
                    }
                })
            }
            // 如果合计小于等于0 ，不能选择分期
            if (this.totalAmount == 0) {
                this.$_toast('当前金额无法分期')
                return
            }
            if (type === 'btn') {
                uploadUserContract.call(this).then(getData)
            } else {
                getData()
            }
        },
        showStagePop() {
            // if (this.stagePopData.content) {
            //     this.setStagePop()
            // } else {
            // }
            this.getStageData('show')
        },
        setStagePop() {
            this.$router.push({
                name: 'stage',
                query: this.$route.query
            })
            // this.popData = this.stagePopData
            // this.componentName = stagePop
            // this.isPop = true
        }
    },
    components: {
        // stagePop
    }
}

export { popMixin, wholeCouponMixin, productCouponMixin }
