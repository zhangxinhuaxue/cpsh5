<!--  created by zhouqing -->
<template>
    <div>
        <div class="aui-popup__hd">
            {{popData.title}}
        </div>
        <div class="aui-popup__ft">
            <a v-if="isShouldTie" href="javascript:;" class="aui-btn_full" @click="confirmTie">额度不够，去提额</a>
            <a v-else href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd">
            <div class="aui-cells">
                <div class="aui-cell_auto">
                    <div class="aui-cell__bd">
                        <div class="pop-cells">
                            <div class="pop-cells__title">
                                首付比例
                            </div>
                            <div class="pop-cells__content">
                                <ul class="option-list">
                                    <li v-for="(item,index) in levelOne" :key="item.name" :class="{ 'active': levelOneActiveIndex === index }" @click="levelOneEvent(index)">
                                        <!-- {{item.firstPay|percent}} -->
                                        {{item.name}}
                                        <template v-if="item.value===0">首付</template>
                                        <span class="aui-tag_bgcolor active-tag tag-tie" v-if="item.type==='increase'">提额</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="pop-cells__title">
                                分期数
                            </div>
                            <div class="pop-cells__content">
                                <ul class="option-list">
                                    <li v-for="(item,index) in levelTwo" :key="item" :class="{ 'active': levelTwoActiveIndex === index }" @click="levelTwoEvent(index)">
                                        {{item}}期
                                        <span class="aui-tag_bgcolor active-tag" v-if="freeArr.indexOf(item)!==-1">免息</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <detail :info="stageDetail"></detail>
            </div>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import {
    getStageDetail
} from 'store/modules/trade/confirm'
import detail from './detail.vue'
import findIndex from 'lodash/findIndex'
import { AXD } from 'src/libs/util'

const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/confirm')

export default {
    name: 'stage_popup',
    props: {
        popData: {
            type: [Array, Object]
        }
    },
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
            requesting: false
        }
    },
    filters: {
        percent(value) {
            return value * 100 === 0 ? '0首付' : value * 100 + '%'
        }
    },
    computed: {
        ...mapState({
            storeCouponCode: state => state.couponCode,
            storeProductId: state => state.productId,
            storeFirstPay: state => state.stageFirstPay,
            storeNum: state => state.stageNum,
            storeDetail: state => state.stageDetail,
            storeProductNum: state => state.productNum,
            storeSkuId: state => state.skuId
        }),
        ...mapGetters([
            'skuIdAndNum'
        ]),
        // finalPay() {
        //     return this.popData.content.payAmt
        // },
        levelOne() {
            return this.popData.content.showStages
        },
        levelOneName() {
            return this.levelOne[this.levelOneActiveIndex].name
        },
        levelOneValue() {
            return this.levelOne[this.levelOneActiveIndex].value
        },
        levelTwo() {
            // let twoArr = this.levelOne[this.levelOneActiveIndex].num
            // let freeArr = this.content.freeStageInfo

            return this.levelOne[this.levelOneActiveIndex].stages
        },
        levelTwoValue() {
            return this.levelTwo[this.levelTwoActiveIndex]
        },
        isShouldTie() {
            return this.levelOne[this.levelOneActiveIndex].type === 'increase'
        },
        stageText() {
            // return (this.levelOneValue * 100 === 0 ? '0首付' : this.levelOneValue * 100 + '%首付') + ',分' + this.levelTwoValue + '期'
            return this.levelOneName + '首付,分' + this.levelTwoValue + '期'
        },
        freeArr() {
            return this.popData.content.freeStageInfo || []
        },
        stageObj() {
            return {
                firstPay: this.levelOneValue,
                num: this.levelTwoValue,
                stageText: this.stageText
            }
        }
    },
    components: {
        detail
    },
    mounted() {
        let oneIndex = findIndex(this.levelOne, (o) => {
            return o.value === this.storeFirstPay
        })
        let twoIndex = findIndex(this.levelTwo, (o) => {
            return o === this.storeNum
        })
        if (oneIndex === -1 || twoIndex === -1) {
            let availableOneIndex = findIndex(this.levelOne, (o) => {
                return o.type === 'pay'
            })
            this.levelOneEvent(availableOneIndex, 'first')
        } else {
            this.levelOneActiveIndex = oneIndex
            this.levelTwoActiveIndex = twoIndex
            this.stageDetail = this.storeDetail
        }
    },
    methods: {
        ...mapMutations([
            'SELECT_STAGE'
        ]),
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
            }
        },
        levelTwoEvent(index) {
            // 修复线上问题，快速切换分期，然后点击确定，数据没有更新过去
            if (this.requesting) {
                this.$_toast('操作太快，慢一点吧~')
                return
            }
            this.requesting = true
            this.levelTwoActiveIndex = index
            // this.stageDetail.loading = true
            let activityId = this.$route.query.activityId
            let activityState = this.$route.query.activityState
            activityId = activityState == 'ing' ? activityId : 0
            getStageDetail(Object.assign({
                cpCode: this.storeCouponCode,
                firstpaybal: this.levelOneValue,
                month: this.levelTwoValue,
                skuId: this.storeSkuId,
                num: this.storeProductNum
            }, !activityId ? {} : { activityId })).then(res => {
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
        confirm() {
            if (!this.levelTwoValue) {
                this.$_toast('请选择分期数')
                return
            }
            this.SELECT_STAGE({
                detail: this.stageDetail,
                ...this.stageObj
            })
            this.$emit('confirm')
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/pop.scss';

.aui-cells:before,
.aui-cells:after {
    display: none;
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
        content: "";
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
        background: #FF515A;
        border-radius: px2rem(14) px2rem(14) px2rem(14) 0;

        &:before {
            display: none;
        }

        padding:px2rem(6) px2rem(8);
    }
}

.aui-cells {
    margin-top: 0;
}

.aui-popup__bd {
    height: px2rem(800);
}
</style>
