<!--  created by zhouqing -->
<template>
    <div class="aui-page">
        <!-- <div class="aui-popup__hd">
            {{popData.title}}
        </div>-->
        <div class="aui-popup__ft">
            <a
                v-if="isShouldTie"
                href="javascript:;"
                class="aui-btn_full"
                @click="confirmTie"
            >额度不够，去提额</a>
            <a v-else href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd">
            <div class="aui-cells">
                <div class="aui-cell_auto">
                    <div class="aui-cell__bd">
                        <div class="pop-cells">
                            <div class="pop-cells__title">首付比例</div>
                            <div class="pop-cells__content">
                                <ul class="option-list">
                                    <li
                                        v-for="(item,index) in levelOne"
                                        :key="item.name"
                                        :class="{ 'active': levelOneActiveIndex === index }"
                                        @click="levelOneEvent(index)"
                                    >
                                        <!-- {{item.firstPay|percent}} -->
                                        {{item.name}}
                                        <template v-if="item.value===0">首付</template>
                                        <span
                                            class="aui-tag_bgcolor active-tag tag-tie"
                                            v-if="item.type==='increase'"
                                        >提额</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="pop-cells__title">分期数</div>
                            <div class="pop-cells__content">
                                <ul class="option-list">
                                    <li
                                        v-for="(item,index) in levelTwo"
                                        :key="item"
                                        :class="{ 'active': levelTwoActiveIndex === index }"
                                        @click="levelTwoEvent(index)"
                                    >
                                        {{item}}期
                                        <span
                                            class="aui-tag_bgcolor active-tag"
                                            v-if="freeArr.indexOf(item)!==-1"
                                        >免息</span>
                                    </li>
                                </ul>
                            </div>
                            <!-- A+会员新增选择商品免息券盒子 -->
                            <div
                                v-if="skuId"
                                class="aui-cell vip-tips"
                                :class="{'grey': isInterestTitleGrey}"
                                @click="goCheckVipCoupon"
                            >
                                <img :src="iconImg" />
                                <div class="aui-cell__bd">商品免息券</div>
                                <div class="aui-cell__ft">{{preferInterestTitle}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <detail
                    :info="stageDetail"
                    :showMianxi="showMianxi"
                    :checkedProductFreeInterestCode="checkedProductFreeInterestCode"
                ></detail>
            </div>
        </div>
        <!-- A+免息券增加商品免息券弹层popup -->
        <popup :isPop="popVipCoupon" @cancel="popCancel" v-if="productFreeInterestList">
            <template slot="content">
                <div class="aui-popup__hd">商品免息券</div>
                <div class="aui-popup__bd">
                    <template v-for="(item, index) in productFreeInterestList">
                        <m-coupon bg="white" :coupon="item" :key="index" :disabled="!item.canUsed">
                            <m-icon
                                v-if="item.canUsed"
                                slot="right"
                                class="m-icon_checked"
                                :type="index===curIndex ? 'checkbox_checked':'checkbox_unchecked'"
                                @click.native="selectVipCoupon(index)"
                            ></m-icon>
                            <p slot="bottom">购物车合并购买时不可用</p>
                        </m-coupon>
                    </template>
                    <div class="mui-coupon_white mui-coupon_base mui-coupon_abled coupon-nouse">
                        <p>有钱不使用红包</p>
                        <m-icon
                            class="m-icon_checked"
                            :type="-1===curIndex ? 'checkbox_checked':'checkbox_unchecked'"
                            @click.native="curIndex=-1"
                        ></m-icon>
                    </div>
                </div>
                <div class="aui-popup__ft">
                    <a href="javascript:;" class="aui-btn_full" @click="checkVipCoupon">确定</a>
                </div>
            </template>
        </popup>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import popup from 'components/popup/index.vue'
import { getStageDetailV3, checkProductFreeInterest } from 'store/modules/trade/confirm'
import detail from './detail.vue'
import findIndex from 'lodash/findIndex'
import { AXD } from 'src/libs/util'
import { Coupon, Icon } from '@fe/buss-ui'
import store from 'src/store/vuex/trade'
const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers('trade/confirm')
export default {
    name: 'stage_popup',
    // props: {
    //     popData: {
    //         type: [Array, Object]
    //     }
    // },
    data() {
        return {
            levelOneActiveIndex: 0,
            levelTwoActiveIndex: '',
            stageDetail: {
                loading: true,
                firstPayAmount: '',
                stageAmount: '',
                monthPay: ''
            },
            requesting: false,
            iconImg: require('src/assets/images/icon_vip.svg'),
            popVipCoupon: false,
            curIndex: 0,
            productFreeInterestList: null, // 商品免息券列表
            interestStatus: '', // 区分是否有可用免息券不同状态
            skuId: '', // 用于请求分期免息券接口使用
            isInterestTitleGrey: true // 商品免息券名称是否置灰
        }
    },
    components: {
        detail,
        popup,
        mCoupon: Coupon,
        mIcon: Icon
    },
    beforeRouteEnter(to, from, next) {
        // 防止用户在当前页面刷新无数据，刷新则回到上级页面
        if (!(store.state.popData && store.state.popData.content) && !from.name) {
            // next({
            //     path: '/pages/trade/confirm',
            //     query: to.query,
            //     replace: true
            // })
            window.history.back()
        } else {
            next()
        }
    },
    filters: {
        percent(value) {
            return value * 100 === 0 ? '0首付' : value * 100 + '%'
        }
    },
    computed: {
        ...mapState({
            // storeCouponCode: state => state.couponCode,
            // storeProductId: state => state.productId,
            storeFirstPay: state => state.stageFirstPay,
            storeNum: state => state.stageNum,
            storeDetail: state => state.stageDetail,
            // storeProductNum: state => state.productNum,
            // storeSkuId: state => state.skuId,
            storeCouponParam: state => state.createOrderSku,
            storeCoupon: state => state.wholeCoupon,
            popData: state => state.stageData,
            storeProductFreeInterestCode: state => state.checkedProductFreeInterestCode
        }),
        ...mapGetters(['skuIdAndNum']),
        // finalPay() {
        //     return this.popData.content.payAmt
        // },
        levelOne() {
            return (this.popData.content && this.popData.content.showStages) || []
        },
        levelOneName() {
            return this.levelOne[this.levelOneActiveIndex].name
        },
        levelOneValue() {
            return this.levelOne[this.levelOneActiveIndex] && this.levelOne[this.levelOneActiveIndex].value
        },
        levelTwo() {
            // let twoArr = this.levelOne[this.levelOneActiveIndex].num
            // let freeArr = this.content.freeStageInfo

            return (this.levelOne[this.levelOneActiveIndex] && this.levelOne[this.levelOneActiveIndex].stages) || []
        },
        levelTwoValue() {
            return this.levelTwo[this.levelTwoActiveIndex]
        },
        isShouldTie() {
            return this.levelOne[this.levelOneActiveIndex] && this.levelOne[this.levelOneActiveIndex].type === 'increase'
        },
        stageText() {
            // return (this.levelOneValue * 100 === 0 ? '0首付' : this.levelOneValue * 100 + '%首付') + ',分' + this.levelTwoValue + '期'
            return this.levelOneName + '首付,分' + this.levelTwoValue + '期'
        },
        freeArr() {
            return (this.popData.content && this.popData.content.freeStageInfo) || []
        },
        stageObj() {
            return {
                firstPay: this.levelOneValue,
                num: this.levelTwoValue,
                stageText: this.stageText
            }
        },
        preferInterestTitle() {
            // 推荐最优商品免息券名称
            if (this.levelTwoValue) {
                if (this.interestStatus === 'other') {
                    // 其他场次有可用
                    return '其他期次有可用免息券'
                } else if (this.interestStatus === 'none') {
                    // 全部无可用
                    return '无可用'
                } else {
                    // 当前选中红包 类型包括single和max
                    let interest = this.checkedProductFreeInterest
                    if (!interest.titleType) {
                        return '有钱不使用红包'
                    } else {
                        return interest.titleType === 'single' ? interest.amount + '期免息>' : '最高' + interest.amount + '期免息>'
                        // return this.checkedProductFreeInterest.title
                    }
                }
            } else {
                return '请选择分期数'
            }
        },
        showMianxi() {
            // 当前选中分期是否显示免息
            return this.freeArr.indexOf(this.levelTwoValue) !== -1
        },
        checkedProductFreeInterest() {
            // 选中的商品免息券
            if (this.productFreeInterestList && this.productFreeInterestList.length && this.curIndex >= 0) {
                return this.productFreeInterestList[this.curIndex]
            } else {
                return {}
            }
        },
        checkedProductFreeInterestCode() {
            // 选中的商品免息券code码
            return this.checkedProductFreeInterest.code ? this.checkedProductFreeInterest.code : ''
        }
    },
    watch: {},
    mounted() {
        // 从链接中获取参数skuId
        let data = this.$route.query.data
        if (JSON.parse(data).length === 1) {
            this.skuId = JSON.parse(data)[0].skuId
        }

        let oneIndex = findIndex(this.levelOne, o => {
            return o.value === this.storeFirstPay
        })
        let twoIndex = findIndex(this.levelTwo, o => {
            return o === this.storeNum
        })
        if (oneIndex === -1 || twoIndex === -1) {
            let availableOneIndex = findIndex(this.levelOne, o => {
                return o.type === 'pay'
            })
            // console.log(availableOneIndex)
            this.levelOneEvent(availableOneIndex, 'first')
        } else {
            this.levelOneActiveIndex = oneIndex
            this.levelTwoActiveIndex = twoIndex
            this.stageDetail = this.storeDetail
        }
    },
    activated() {
        this.getStageDetailV3()
    },
    methods: {
        ...mapMutations(['SELECT_STAGE', 'CONFIRM_INIT', 'checkProductFreeInterest', 'initShowMianxi', 'saveAccidentInsuranceInfo']),
        selectVipCoupon(index) {
            this.curIndex = index
        },
        handleproductFreeInterestList(list) {
            this.productFreeInterestList = Array.from(list, (item, index) => {
                let {
                    amount,
                    canUsed,
                    category,
                    code,
                    desc,
                    limit,
                    showVip,
                    title,
                    validPeriod,
                    type // single ,max
                } = item
                return {
                    code: code || '',
                    showVip,
                    titleType: type, // single ,max
                    type: 'periods', // amount：现金, multi: 复合红包, periods: 分期免息, discount: 折扣
                    amount: amount || '',
                    desc: desc || '',
                    title: title || '',
                    limit: [...limit, validPeriod] || [],
                    canUsed
                }
            })
        },
        goCheckVipCoupon() {
            // A+会员新增选取商品免息券
            if (this.productFreeInterestList && this.productFreeInterestList.length) {
                this.popVipCoupon = true
            }
        },
        popCancel() {
            this.popVipCoupon = false
        },
        checkVipCoupon() {
            // 选择商品免息券点击确定
            if (this.storeProductFreeInterestCode !== this.checkedProductFreeInterestCode) {
                // 重新提交到vuex中
                console.log('选中的商品免息券code:' + this.checkedProductFreeInterestCode)

                // 重新计算费率等
                this.getStageDetailV3()

                // 记录分期详情状态
                this.initShowMianxi(this.showMianxi)
            }

            this.popVipCoupon = false
        },
        levelOneEvent(index, type) {
            // if (this.levelOneActiveIndex === index) {
            //     return
            // }
            this.levelOneActiveIndex = index

            if (type === 'first') {
                let levelTwoLastIndex = this.levelOne[index].stages.length - 1
                this.levelTwoEvent(levelTwoLastIndex)
            } else {
                this.levelTwoActiveIndex = ''
                // this.stageDetail.loading = true

                // this.$set(this.stageDetail, 'loading', true)
                this.stageDetail = {
                    loading: true,
                    firstPayAmount: '',
                    stageAmount: '',
                    monthPay: ''
                }
                console.log(this.stageDetail)
            }
        },
        async levelTwoEvent(index) {
            // 修复线上问题，快速切换分期，然后点击确定，数据没有更新过去
            if (this.requesting) {
                this.$_toast('操作太快，慢一点吧~')
                return
            }
            this.requesting = true

            this.levelTwoActiveIndex = index
            // 根据分期数筛选商品免息券
            // 只有选择一个商品才会调用，多个商品暂不支持调用该接口
            if (this.levelTwoValue && this.storeDetail && this.skuId) {
                let { result, success, code } = await checkProductFreeInterest({
                    installment: this.levelTwoValue, // 用户选择分期数
                    installmentPrice: this.popData.content.payAmt, // 待分期金额
                    skuId: this.skuId
                })
                if (success && result) {
                    let { hit, productFreeInterestList } = result
                    if (hit && productFreeInterestList && productFreeInterestList.length) {
                        // 当前选中场次有可用免息券
                        this.handleproductFreeInterestList(productFreeInterestList)
                        this.interestStatus = 'check'

                        // 文案置灰取消
                        this.isInterestTitleGrey = false
                    } else if (!hit && productFreeInterestList && productFreeInterestList.length) {
                        // 当前选中场次无可用免息券，其他场次有
                        this.productFreeInterestList = []
                        this.interestStatus = 'other'
                    } else if (!hit && !productFreeInterestList.length) {
                        // 无免息券
                        this.productFreeInterestList = []
                        this.interestStatus = 'none'
                    }
                } else {
                    this.$_toast('请求商品免息券列表失败，请稍后再试')
                }
            }

            this.getStageDetailV3()
        },
        getStageDetailV3() {
            // 获取费率
            getStageDetailV3({
                wholeCp: this.storeCoupon.code,
                firstpaybal: this.levelOneValue,
                month: this.levelTwoValue,
                msg: JSON.stringify(this.storeCouponParam),
                payCode: this.checkedProductFreeInterestCode
            }).then(res => {
                if (res.success) {
                    this.stageDetail = {
                        loading: false,
                        firstPayAmount: res.result.firstPay,
                        stageAmount: res.result.fenqiPay,
                        monthPay: res.result.monthPay,
                        stageNum: res.result.month
                    }

                    // 首付金额 firstPayAmount =》firstTotalPay
                    // 分期金额 stageAmount =>
                    // 每期应还（包含服务费）monthPay=>
                } else {
                    this.CONFIRM_INIT({
                        stageChecked: false
                    })
                    this.$_toast(res.resultDes)
                }
                setTimeout(() => {
                    this.requesting = false
                }, 500)
            })
        },
        confirmTie() {
            // 1:加入购物车 -- 又不加购物车了。。
            // 2: 跳转到提额页面
            let msg = this.$route.query.data
            AXD.util.goCredit(this.levelOne[this.levelOneActiveIndex].creditUrl)
            // window.location.href = this.levelOne[this.levelOneActiveIndex].creditUrl
            // addCartBeforeCredit({msg}).then(res => {
            //     if (res.success) {
            //         window.location.href = this.levelOne[this.levelOneActiveIndex].creditUrl
            //     } else {
            //         this.$_toast(res.resultDes)
            //     }
            // })
        },
        buyInsuranceCheck() {
            let skuIds = []
            this.storeCouponParam.forEach((item, index) => {
                if (item.type !== 'accidentInsurance') {
                    item.skuItemVos.forEach((subItem, index) => {
                        skuIds.push(subItem.skuId)
                    })
                }
            })
            // 判断是否可以购买借款人意外险
            this.saveAccidentInsuranceInfo({
                isShow: false
            })
        },
        confirm() {
            if (!this.levelTwoValue) {
                this.$_toast('请选择分期数')
                return
            }
            if (this.requesting) {
                this.$_toast('数据加载中...')
                return
            }
            this.SELECT_STAGE({
                detail: this.stageDetail,
                ...this.stageObj
            })
            this.buyInsuranceCheck()
            // this.$emit('confirm')

            // 提交到vuex中payCode，A+会员卡新增逻辑
            this.checkProductFreeInterest(this.checkedProductFreeInterestCode)

            this.$router.go(-1)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import '../assets/pop.scss';

.aui-cells:before,
.aui-cells:after {
    display: none;
}
.coupon-nouse {
    display: flex;
    vertical-align: middle;
    align-items: center;
    height: px2rem(58);
    line-height: px2rem(58);
    padding-left: px2rem(32);
    font-size: px2rem(22);
    color: #222222;
    p {
        width: px2rem(570);
    }
}
.aui-popup__bd {
    ::v-deep .mui-coupon__right {
        padding-left: px2rem(80);
    }
}
.aui-popup__ft {
    z-index: 9;
}

.option-list {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-top: px2rem(20);

    li {
        position: relative;
        width: px2rem(154);
        height: px2rem(60);
        line-height: px2rem(66); // margin-bottom: px2rem(20);
        margin: 0 px2rem(20) px2rem(20) 0;
        text-align: center;
        background: #f7f7f7;
        border-radius: px2rem(12);

        &.active {
            background: #ffd72d;
        }

        &:nth-child(4n) {
            margin-right: 0;
        }
    }
}

.active-tag {
    position: absolute;
    top: px2rem(-15);
    right: px2rem(-10);

    &:before {
        content: '';
        width: 0;
        height: 0;
        border-top: px2rem(5) solid $auiTipsColor;
        border-right: px2rem(8) solid transparent;
        position: absolute;
        top: 100%;
        left: px2rem(10);
    }

    &.tag-tie {
        top: px2rem(-20);
        background: #ff515a;
        border-radius: px2rem(14) px2rem(14) px2rem(14) 0;

        &:before {
            display: none;
        }

        padding: px2rem(6) px2rem(8);
    }
}

.aui-cells {
    margin-top: 0;
}

.aui-popup__bd {
    // height: px2rem(800);
    padding-bottom: px2rem(98);
}
.aui-popup__ft {
    width: 100%;
    position: fixed;
    bottom: 0;
}

.vip-tips {
    height: px2rem(88);
    padding: px2rem(26) px2rem(16);
    background-color: #f7f7f7;
    border-radius: px2rem(8);
    &:before {
        border: none;
    }

    img {
        display: inline-block;
        width: px2rem(40);
        height: px2rem(28);
        margin-right: px2rem(10);
    }
    .aui-cell__bd {
        font-size: px2rem(28);
        color: #272727;
        font-weight: bold;
    }
    .aui-cell__ft {
        color: #272727;
    }
}
.vip-tips.grey {
    .aui-cell__ft {
        color: #d0d0d0;
    }
}
</style>
