<!--  created by zhouqing -->
<template>
    <div>
        <div class="aui-popup__hd">
            {{popData.title}}
        </div>
        <div class="aui-popup__ft">
            <a href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd">
            <div class="aui-cells aui-cells_radio">
                <label v-for="(item,index) in list" class="aui-cell aui-cell_auto  aui-check__label" :key="index" @click="getItem(index,item)">
                    <div class="aui-cell__bd coupon-item">
                        <p class="coupon-item__num">¥<em>{{item.amtCoupon|money}}</em></p>
                        <p>{{item.useEffect}} {{item.limit|range(item.merchants) }} </p>
                        <p class="coupon-item__date">有效期：{{item.startTime|timeYMD}}-{{item.endTime|timeYMD}}</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio" class="aui-check"  >
                        <!-- <span class="icon-check"></span> -->
                        <span v-show="index === activeIndex" class="icon-check1">
                             <span class="path1"></span><span class="path2"></span>
                        </span>
                        <span v-show="index !== activeIndex" class="icon-uncheck1">
                            <span class="path1"></span><span class="path2"></span>
                        </span>
                    </div>
                </label>
                <label class="aui-cell aui-check__label" for="no">
                    <div class="aui-cell__bd">
                        <p>不使用红包</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio"  class="aui-check" id="no" @click="getItem(-1)">
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
    filters: {
        range(limit, merchants) {
            if (limit === 'all' && (typeof merchants === 'undefined' || merchants == -1)) {
                return '全场适用'
            } else {
                return '指定商品适用'
            }
        }
    },
    computed: {
        ...mapState({
            storeCouponCode: state => state.couponCode
        }),
        list() {
            return this.popData.list
        }
    },
    data() {
        return {
            code: '',
            useEffect: '',
            activeItem: {
                code: '',
                useEffect: '不使用红包',
                amtCoupon: ''
            },
            activeIndex: ''
        }
    },
    mounted() {
        this.activeIndex = findIndex(this.list, (o) => {
            return o.code === this.storeCouponCode
        })
        if (this.activeIndex !== -1) {
            this.getItem(this.activeIndex, this.list[this.activeIndex])
        } else {
            this.getItem(this.activeIndex)
        }
    },
    methods: {
        ...mapMutations([
            'SELECT_COUPON'
        ]),
        getItem(index, item) {
            this.activeIndex = index
            if (item) {
                this.activeItem = item
            } else {
                this.activeItem = {
                    code: '',
                    useEffect: '不使用红包',
                    amtCoupon: ''
                }
            }
        },
        confirm() {
            this.SELECT_COUPON({
                code: this.activeItem.code,
                text: this.activeItem.useEffect,
                money: this.activeItem.amtCoupon
            })
            this.$emit('confirm', 'coupon')
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
</style>
