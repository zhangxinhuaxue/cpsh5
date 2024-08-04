/**
 *
 * @author:      zhouqing
 * @dateTime:    2017-05-15 14:48:32
 * @description:
 */
import couponPop from '../item_coupon/popup.vue'
import stagePop from '../item_staging/popup.vue'
import { toCredit } from 'libs/userstatus'
import { getCoupon, getStage } from 'store/modules/trade/confirm'
import axdAlert from 'components/alert/index'
import axdDialog from 'components/dialog/index'
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

var couponMixin = {
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
            storeHasCoupon: (state) => state.hasCoupon,
            storeCouponText: (state) => state.couponText,
            storeSkuId: (state) => state.skuId,
            storeProductNum: (state) => state.productNum
        })
    },
    methods: {
        getCouponData() {
            getCoupon({
                skuId: this.storeSkuId,
                size: this.storeProductNum
            }).then((res) => {
                if (res.success && res.result.length) {
                    this.$set(this.couponPopData, 'title', '红包')
                    this.$set(this.couponPopData, 'list', res.result)
                    this.setCouponPop()
                } else {
                    this.$_toast(res.resultDes)
                }
            })
        },
        showCouponPop() {
            if (!this.storeHasCoupon) {
                return
            }
            if (this.couponPopData.list) {
                // this.popData = Object.assign({}, this.popData, this.stagePopData)
                this.setCouponPop()
            } else {
                this.getCouponData()
            }
        },
        setCouponPop() {
            this.popData = this.couponPopData
            this.componentName = couponPop
            this.isPop = true
        }
    },
    components: {
        couponPop
    }
}
var popMixin = {
    mixins: [couponMixin, commonMixin],
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
        goodsType: {
            type: String,
            default: ''
        },
        stageLabel: {
            type: Object,
            default: function() {
                return {
                    stageFreeStr: '',
                    stageCorner: '',
                    stageDesc: ''
                }
            }
        }
    }, // 'stageCorner', 'stageDesc'
    computed: {
        ...mapState({
            storeStageText: (state) => state.stageText,
            storeStageDetail: (state) => state.stageDetail,
            storeCouponCode: (state) => state.couponCode,
            stageChecked: (state) => state.stageChecked,
            productInstalment: (state) => state.productInstalment
        }),
        ...mapGetters(['skuIdAndNum', 'finalPay']),
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
            if (this.finalPay === 0) {
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
    activated() {
        // // 重置 分期信息
        // this.storeStageChecked = false
        // this.getStageData()
    },
    mounted() {
        console.log('item-mounted')
        // 重置 分期信息
        this.storeStageChecked = false
        if (this.switchUse === false) {
            this.storeStageChecked = true
            // this.getStageData('btn')
        }
    },
    methods: {
        ...mapMutations(['CONFIRM_UPDATE_DATA', 'SELECT_STAGE', 'SELECT_COUPON']),
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
            // productInstalment
            if (this.productInstalment === 'CASH_BILL') {
                // this.$_toast('抱歉，当前商品暂不支持分期，可在支付时选择使用信用额度支付后分期')
                this.$_toast('此商品暂不支持分期，可使用信用额度支付')
                return
            }
            // 如果合计小于等于0 ，不能选择分期
            if (this.finalPay === 0) {
                this.$_toast('当前金额无法分期')

                //  this.storeStageChecked = false
                return
            }

            let activityId = this.$route.query.activityId
            let activityState = this.$route.query.activityState
            activityId = activityState == 'ing' ? activityId : 0
            // 选择完红包后 reset 分期信息
            const getData = () => {
                getStage(
                    Object.assign(
                        {
                            goodsType: this.goodsType,
                            code: this.storeCouponCode,
                            params: this.skuIdAndNum
                        },
                        !activityId ? {} : { activityId }
                    )
                ).then((res) => {
                    if (res.success && res.result.stageInfo && res.result.stageInfo.length) {
                        this.$set(this.stagePopData, 'title', '分期方案')
                        this.$set(this.stagePopData, 'content', res.result)
                        let vitrue = true
                        if (type === 'btn') {
                            this.disableStage = false
                            this.storeStageChecked = true
                            vitrue = this.switchUse
                        }
                        vitrue && this.setStagePop()
                    } else {
                        if (res.code == 416) {
                            axdDialog({
                                content: res.resultDes,
                                buttons: [
                                    {
                                        text: '取消'
                                    },
                                    {
                                        text: '去提额',
                                        onClick: function() {
                                            let {
                                                result: { showStages = [{}] }
                                            } = res
                                            AXD.util.goCredit(showStages[0].creditUrl)
                                            // window.location.href = showStages[0].creditUrl
                                        }
                                    }
                                ]
                            })
                            return
                        }
                        this.$_toast(res.resultDes)
                    }
                })
            }
            if (type === 'btn') {
                uploadUserContract.call(this).then(getData)
            } else {
                getData()
            }
        },
        showStagePop() {
            if (this.stagePopData.content) {
                this.setStagePop()
            } else {
                this.getStageData('show')
            }
        },
        setStagePop() {
            this.popData = this.stagePopData
            this.componentName = stagePop
            this.isPop = true
        }
    },
    components: {
        stagePop
    }
}
export { popMixin, couponMixin }
