<!--  created by zhouqing -->
<template>
    <div class="couponForMulti">
        <div class="aui-popup__hd">
            {{popData.title}}
        </div>
        <div class="aui-popup__ft">
            <a href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd">
            <div class="aui-cells aui-cells_radio">
                <label v-for="(item,index) in list" :key="index" class="aui-cell aui-cell_auto  aui-check__label" :for="index" @click="getItem(index,item)">
                    <!-- <div class="aui-cell__bd coupon-item"> -->
                    <!-- <p class="coupon-item__num">¥<em>{{(item.amtCoupon)|money}}</em></p> -->
                    <!-- <p>{{item.useEffect}} {{item.limit|range(item.merchants) }} </p> -->
                    <!-- <p><span v-for="txt in item.tags">{{txt}}</span></p> -->
                    <!-- <p class="coupon-item__date">有效期：{{item.startTime|timeYMD}}-{{item.endTime|timeYMD}}</p> -->
                    <!-- </div> -->
                    <div class="left">
                        <span v-if="!item.groupId"><i>￥</i>{{item.amtCoupon}}</span>
                        <span v-if="!item.groupId">{{item.useRule}}</span>
                        <span v-else>复合红包</span>
                    </div>
                    <div class="middle">
                        <p>{{item.name}}</p>
                        <p class="cart_coupon_date">{{item.startTime|timeYMD}}-{{item.endTime|timeYMD}}</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio" class="aui-check">
                        <!-- <span class="icon-check"></span> -->
                        <span v-show="index === activeIndex" class="icon-check1">
                             <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span v-show="index !== activeIndex" class="icon-uncheck1">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                    </div>
                </label>
                <label v-for="(item,index) in invalidList" :key="index" class="aui-cell aui-cell_auto  aui-check__label invalidCoupon">
                    <div class="left">
                        <span><i>￥</i>{{item.amtCoupon}}</span>
                        <span>{{item.useRule}}</span>
                    </div>
                    <div class="middle">
                        <p>{{item.name}}</p>
                        <p class="cart_coupon_date">{{item.startTime|timeYMD}}-{{item.endTime|timeYMD}}</p>
                    </div>
                    <p class="invalidCoupon-tip">结算商品不符合使用条件</p>
                </label>
                <label class="aui-cell aui-check__label notUseCoupon" for="no">
                    <div class="aui-cell__bd">
                        <p>不使用红包</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio" class="aui-check" id="no" @click="getItem(-1)">
                        <span v-show="-1 === activeIndex" class="icon-check1">
                             <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span v-show="-1 !== activeIndex" class="icon-uncheck1">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>
<script>
import findIndex from 'lodash/findIndex'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('trade/confirm')
export default {
    name: 'coupon_popup',
    props: {
        popData: {
            type: [Array, Object]
        }
    },
    computed: {
        ...mapState({
            storeCreateOrderSku: state => state.createOrderSku,
            storeIndex: state => state.couponForMerchantIndex,
            storeWholeCoupon: state => state.wholeCoupon,
            storeStageChecked: state => state.stageChecked,
            storeStageText: state => state.stageText
        }),
        list() {
            return this.popData.list.availableList || []
        },
        invalidList() {
            return this.popData.list.unavailableList || []
        }
    },
    data() {
        return {
            code: '',
            useEffect: '',
            activeItem: {
                code: '',
                tags: ['不使用红包'],
                price: ''
            },
            activeIndex: ''
        }
    },
    mounted() {
        let cpCode = (this.storeIndex > -1) ?
            this.storeCreateOrderSku[this.storeIndex].cpCode :
            this.storeWholeCoupon.code
        this.activeIndex = this.list.findIndex((o) => {
            return o.code === cpCode
        })
        // console.log(this.activeIndex, '===index')
        if (this.activeIndex !== -1) {
            this.getItem(this.activeIndex, this.list[this.activeIndex])
        } else {
            this.getItem(this.activeIndex)
        }
    },
    methods: {
        ...mapMutations([
            'CONFIRM_INIT',
            'SELECT_COUPON_V3'
        ]),
        getItem(index, item) {
            this.activeIndex = index
            if (item) {
                this.activeItem = item
            } else {
                this.activeItem = {
                    code: '',
                    useEffect: '不使用红包',
                    amt: ''
                }
            }
        },
        confirm() {
            this.SELECT_COUPON_V3({
                code: this.activeItem.code,
                useEffect: this.activeItem.useEffect,
                amt: this.activeItem.price
            })
            this.$emit('confirm', 'coupon')
            this.handleStage()
        },
        // 如果分期，需要重新请求分期信息
        handleStage() {
            if (this.storeStageChecked && this.storeStageText != '') {
                this.CONFIRM_INIT({
                    stageFirstPay: '',
                    stageNum: '',
                    stageText: '',
                    stageDetail: {
                        firstPayAmount: '...',
                        stageAmount: '...',
                        monthPay: '...'
                    }
                })
                this.$_toast('请重新选择分期方案')
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-popup__bd .aui-cells:before {
    display: none;
}

.icon-check1,
.icon-uncheck1 {
    font-size: px2rem(40);
}

.aui-cells {
    margin-top: 0;
}

// .aui-cell_auto {
//     height: auto;
// }
.couponForMulti {
    .aui-popup__hd {
        font-size: px2rem(36);
        color: #222222;
    }

    .aui-popup__bd {
        padding-left: px2rem(32);
        padding-right: px2rem(32);
    }

    label {
        display: block;
        position: relative;
        height: px2rem(120);
        border: px2rem(1) solid #ffe352;
        border-radius: px2rem(10);
        margin-bottom: px2rem(30);
        padding: px2rem(10) 0;

        .left {
            float: left;
            border-right: px2rem(1) dashed #fff1ab;
            padding: 0 px2rem(5);
            width: px2rem(200);
            overflow: hidden;
            text-align: center;

            span {
                display: block;
                line-height: 1.3;

                &:first-child {
                    font-size: px2rem(52);
                    font-weight: 600;

                    i {
                        font-size: px2rem(32);
                        font-weight: normal;
                    }
                }

                &:last-child {
                    font-size: px2rem(22);
                    color: #666;
                }

                &:only-child {
                    font-size: px2rem(32);
                    line-height: px2rem(100);
                }
            }
        }

        .middle {
            float: left;
            padding-left: px2rem(25);
            line-height: 2.0;

            p {
                width: px2rem(290);
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;

                &:first-child {
                    font-size: px2rem(28);
                    color: #222;
                }

                &:last-child {
                    font-size: px2rem(24);
                    color: #666;
                }
            }
        }

        .aui-cell__ft {
            position: absolute;
            right: px2rem(32);
            top: 50%;
            transform: translateY(-50%);
        }

        &.invalidCoupon {
            border-color: #ccc;
            padding: 0;
            height: auto;

            * {
                color: #999 !important;
            }

            .left {
                border-color: #ccc;
            }

            .invalidCoupon-tip {
                clear: both;
                line-height: px2rem(56);
                background-color: #f7f7f7;
                padding-left: px2rem(20);
                font-size: px2rem(24);
                border-top: #ccc dashed px2rem(1);
            }
        }

        &.notUseCoupon {
            .aui-cell__bd p {
                line-height: px2rem(100);
                padding-left: px2rem(20);
            }
        }
    }
}
</style>
