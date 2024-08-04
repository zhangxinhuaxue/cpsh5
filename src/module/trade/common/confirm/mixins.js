/*
 * @Description: 虚拟确认页公共初始化接口/红包模块/分期模块集合
 * @Author: sunxj
 * @Date: 2019-01-09 18:08:48
 * @LastEditTime: 2019-02-21 11:56:48
 * @LastEditors: sunxj
 */
import popup from 'components/popup/index.vue'
import couponCell from './coupon-cell.vue'
import stagesCell from './stages-cell.vue'
import couponPop from './coupon-pop.vue'
import stagesPop from './stages-pop.vue'
import axdDialog from 'components/dialog/index'
import { AXD } from 'src/libs/util'
import uploadUserContract from '../assets/upload-user-contract'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapStateCommon, mapGetters: mapGettersCommon, mapMutations: mapMutationsCommon, mapActions: mapActionsCommon } = createNamespacedHelpers('trade/common')

const couponMixin = {
    data() {
        return {
            curCpShopIndex: 0,
            cpType: {
                current: 'shop',
                shop: 'shop', // 店铺红包
                cart: 'cart', // 全场红包
                trade: 'trade' // 交易红包(店铺+全场)
            }
        }
    },
    computed: {
        ...mapStateCommon({
            storeShopCouponArr: state => state.shopCouponArr,
            storeWholeCoupon: state => state.wholeCouponVo,
            storeCartTotalPrice: state => state.cartTotalPrice,
            storeCsrfToken: state => state.csrfToken,
            merchantsArr: state => state.merchantsArr,
            storeShopTotalPriceArr: state => state.shopTotalPriceArr
        }),
        isShopCp() {
            return this.cpType.current === this.cpType.shop
        }
    },
    methods: {
        ...mapMutationsCommon([
            'SAVE_CARTTOTALPRICE',
            'SAVE_SHOPTOTALPRICE',
            'SAVE_WHOLECOUPON',
            'SAVE_SHOPCOUPON'
        ]),
        getHaswholeCpFun() {
            let params = this.getCouponListParams()
            this.getHaswholeCpUrl(params).then(({ success, result }) => {
                if (success) {
                    let existWholeCode = ~~result.existWholeCode
                    let wholeCouponVo = {
                        amt: '',
                        hasCoupon: !!existWholeCode,
                        useEffect: existWholeCode ? '不使用红包' : '无可用红包',
                        code: ''
                    }
                    this.SAVE_WHOLECOUPON(wholeCouponVo)
                }
            })
        },
        getCouponList(cpType, shopIndex) {
            this.curCpShopIndex = shopIndex
            this.cpType.current = cpType
            if (cpType !== this.cpType.shop) {
                this.wholeCpType = cpType
            }
            let params = this.getCouponListParams()

            this.getCouponListUrl(params).then(({ success, result }) => {
                if (success) {
                    let title = ({
                        shop: '商品红包',
                        cart: '平台红包',
                        trade: '平台红包'
                    })[this.cpType.current]
                    let code = (cpType === this.cpType.shop) ? this.storeShopCouponArr[shopIndex].code : this.storeWholeCoupon.code
                    let couponObj = {
                        title,
                        type: 'coupon',
                        couponCodeSelect: code,
                        couponList: result
                    }
                    // this.popData.type = 'coupon'
                    // this.$set(this.popData, 'couponCodeSelect', code)
                    // this.$set(this.popData, 'couponList', result)
                    this.showPop(couponObj, couponPop)
                }
            })
        },
        couponSelect(item) {
            // let i = ~~this.curCpShopIndex
            // let code = item.code
            // let curType = this.cpType.current
            // let shopType = this.cpType.shop
            // let cartType = this.cpType.cart
            // let tradeType = this.cpType.trade
            // let shopCode = this.storeShopCouponArr[i].code
            // let wholeCode = this.storeWholeCoupon.code

            // if ((curType === shopType && code === shopCode) || ((curType === cartType || curType === tradeType) && code === wholeCode)) {
            //     return
            // }
            this.couponSave(item)
            this.couponChange()
        },
        couponSave(item) {
            let { code, useEffect, amt, hasCoupon = true } = item
            let couponItem = {
                code,
                useEffect,
                amt,
                hasCoupon
            }
            if (this.isShopCp) {
                this.SAVE_SHOPCOUPON({
                    shopCoupon: couponItem,
                    index: this.curCpShopIndex
                })
            } else {
                this.SAVE_WHOLECOUPON(couponItem)
            }
        },
        couponChange() {
            let params = this.getCouponChangeParams()
            this.couponChangeUrl(params).then(({ success, result }) => {
                if (success) {
                    let {
                        confirmVo: {
                            merchants,
                            cartTotalPrice
                        },
                        wholeCouponVo = {}
                    } = result
                    if (this.isShopCp) {
                        this.SAVE_SHOPTOTALPRICE({
                            shopPrice: merchants[0].shopTotalPrice,
                            index: this.curCpShopIndex
                        })
                        let hasWholeCp = this.storeWholeCoupon.hasCoupon
                        let { amtCoupon = '', useEffect = hasWholeCp ? '不使用红包' : '无可用红包', code = '', hasCoupon = hasWholeCp } = wholeCouponVo
                        let finalWholeCouponObj = {
                            amt: amtCoupon,
                            code,
                            useEffect,
                            hasCoupon
                        }
                        this.SAVE_WHOLECOUPON(finalWholeCouponObj)
                    }
                    this.SAVE_CARTTOTALPRICE(cartTotalPrice)
                    // 重选分期
                    if (this.storeStageChecked) {
                        this.$_toast('红包已经更改，请重新选择分期方案')
                        this.resetStageValue()
                    }
                }
            })
        }
    },
    components: {
        couponCell,
        couponPop
    }
}
const stagesMixin = {
    data() {
        return {
            stagesTemporary: null
        }
    },
    computed: {
        ...mapStateCommon({
            storeStagesInfo: state => state.stages,
            storeStageChecked: state => state.stageChecked
            // price: state => state.merchantsArr[0].carts[0].price
        })
    },
    watch: {
        storeStageChecked(newVal) {
            if (!newVal) {
                this.resetStageValue()
            }
        }
    },
    methods: {
        ...mapMutationsCommon([
            'SAVE_STAGECHECKED',
            'SAVE_STAGES'
        ]),
        getStagesInfo(type) {
            if (~~this.storeCartTotalPrice === 0) {
                this.$_toast('当前金额无法分期')
                return
            }
            let params = this.getFqListParams()
            const getData = () => {
                this.virtualFQDataUrl(params).then(({ success, result, code, resultDes }) => {
                    if (!success) {
                        if (code == 416) {
                            axdDialog({
                                content: resultDes,
                                buttons: [{
                                    text: '取消'
                                }, {
                                    text: '去提额',
                                    onClick: function() {
                                        let {
                                            showStages = [{}]
                                        } = result
                                        AXD.util.goCredit(showStages[0].creditUrl)
                                        // window.location.href = showStages[0].creditUrl
                                    }
                                }]
                            })
                            return
                        }
                        this.$_toast(resultDes)
                        return
                    }
                    let stagesObj = {
                        title: '分期方案',
                        type: 'stages',
                        content: result,
                        stages: this.storeStagesInfo
                    }
                    this.showPop(stagesObj, stagesPop)
                    if (type === 'btn') {
                        this.SAVE_STAGECHECKED(true)
                    }
                })
            }
            if (type === 'btn') {
                uploadUserContract.call(this).then(getData)
            } else {
                getData()
            }
        },
        getStageDetail(item) {
            if (!item && this.stagesTemporary) {
                Object.assign(this.stagesTemporary, { isSelect: true })
                this.SAVE_STAGES(this.stagesTemporary)
                this.popReset()
                return
            }
            let params = this.getgetStageDetailParams(item)
            this.virtualFQGoodsCodeUrl(params).then(({ success, result }) => {
                if (success) {
                    let { fenqiPay, firstPay, monthPay, month } = result
                    let stages = {
                        firstpaybal: item.value,
                        firstpayName: item.name,
                        month: item.month,
                        // requesting: false,
                        detail: {
                            loading: false,
                            firstPayAmount: firstPay,
                            stageAmount: fenqiPay,
                            monthPay,
                            stageNum: month
                        }
                    }
                    this.stagesTemporary = stages
                    Object.assign(this.popData, { stages })
                }
            })
        },
        resetStageValue() {
            this.SAVE_STAGES({
                isSelect: false, // 是否确定选了分期
                firstpaybal: '', // 首付比例
                firstpayName: '', // 首付比例名称
                month: '', // 分期月数
                requesting: false, // 是否请求中、、
                detail: {
                    loading: true,
                    firstPayAmount: '',
                    stageAmount: '',
                    monthPay: '',
                    stageNum: ''
                }
            })
        }
    },
    components: {
        stagesCell,
        stagesPop
    }
}
const commonMixin = {
    data() {
        return {
            popData: {
                title: '',
                type: '' // 红包：coppon | 分期：stages
            },
            isPop: false,
            componentName: '' // stagePop | couponPop
        }
    },
    computed: {},
    methods: {
        popSelect(popType, item) {
            switch (popType) {
                case 'coupon':
                    this.couponSelect(item)
                    this.popReset()
                    break
                case 'stages':
                    this.getStageDetail(item)
                    break
            }
        },
        showPop(data, complete) {
            this.popData = data
            this.componentName = complete
            this.isPop = true
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
    },
    components: {
        popup
    }
}
const popMixin = {
    mixins: [commonMixin, couponMixin, stagesMixin]
}

const initMixin = {
    methods: {
        ...mapActionsCommon([
            'confirmInfoInit'
        ]),
        getConfirmInfo(getHasCp = true) {
            let params = this.getInitParams()
            let obj = {
                url: this.virtualConfirmInitUrl,
                data: {
                    params
                }
            }
            this.confirmInfoInit(obj).then((result) => {
                setTimeout(() => {
                    this.initPageHeight()
                }, 0)
                if (result && !result.wholeCouponVo && getHasCp) {
                    this.getHaswholeCpFun()
                }
            }, ({ code, resultDes }) => {
                if (code === '-1999') {
                    AXD.util.login()
                    return
                }
                this.$_toast(resultDes)
            })
        },
        /* 初始化page容器高度，避免数字键盘弹出后，最下按钮飘上来 */
        initPageHeight() {
            let pHeight = document.getElementsByClassName('aui-page')[0].offsetHeight
            if (pHeight == 0) {
                setTimeout(this.initPageHeight, 100)
            } else {
                this.fixedPageHeight = pHeight
                this.initialBodyHeight = pHeight

                // 处理H5浏览器下向上滚动 浏览器头部会自动收起 导致页面高度变化 底部按钮悬空的问题
                let that = this
                window.onresize = () => {
                    return (() => {
                        let screenHeight = document.body.clientHeight
                        if (screenHeight >= that.initialBodyHeight) {
                            that.fixedPageHeight = screenHeight
                        }
                    })()
                }
            }
        }
    }
}
const acmMixin = {
    computed: {
        ...mapStateCommon({
            storeAcm: state => state.invitationCode
        })
    },
    methods: {
        ...mapMutationsCommon([
            'SAVE_ACM'
        ]),
        setAcmCode(val) {
            this.SAVE_ACM(val)
        }
    }
}
export { initMixin, popMixin, acmMixin }
