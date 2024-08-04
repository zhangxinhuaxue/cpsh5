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
                <label v-for="(item,index) in list" :key="index" class="aui-cell aui-cell_auto  aui-check__label" :for="index" @change="getItem(index,item)">
                    <div class="aui-cell__bd coupon-item">
                        <!-- 折扣券 -->
                        <template v-if="item.category==='discount'">
                            <p class="coupon-item__num"><em>
                        {{ item.discount|discount(0) }}</em>.{{ item.discount|discount(1) }}折
                            </p>
                            <p>{{item.name}}
                                <template v-if="item.amtCoupon">
                                    最高{{item.amtCoupon|moneyK}}
                                </template>
                            </p>
                            <p class="coupon-item__desc">
                                {{item.conditions.join(' ')}}
                            </p>
                        </template>
                        <!-- 免息券 -->
                        <!--   <template v-else-if="item.category==='free_interest'">
                            <p class="coupon-item__num">¥<em>
                        {{item.amtCoupon|money}}
                        </em></p>
                            <p>{{item.name}}
                            </p>
                            <p class="coupon-item__desc">
                                {{item.conditions.join(' ')}}
                            </p>
                        </template> -->
                        <!-- 商品红包 -->
                        <template v-else>
                            <p class="coupon-item__num">¥<em>
                        {{item.amtCoupon|money}}
                        </em></p>
                            <p>{{item.useEffect}} {{item.limit|range(item.merchants) }} </p>
                        </template>
                        <p class="coupon-item__date">有效期：{{item.startTime|timeYMD}}-{{item.endTime|timeYMD}}</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio" class="aui-check" name="radio1" :id="index">
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
                        <p>{{notUseText}}</p>
                    </div>
                    <div class="aui-cell__ft">
                        <input type="radio" name="radio1" class="aui-check" id="no" @change="getItem(-1)">
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
export default {
    name: 'coupon_popup',
    props: {
        popData: {
            type: [Array, Object]
        },
        isShow: {
            type: Boolean,
            default: false
        }
    },
    filters: {
        discount(value, index) {
            let str = value ? (value * 10).toFixed(1) : '0.0'
            return str.split('.')[index]
        },
        range(limit, merchants) {
            if (limit === 'all' && (typeof merchants === 'undefined' || merchants == -1)) {
                return '全场适用'
            } else {
                return '指定商品适用'
            }
        }
    },
    computed: {
        list() {
            return this.popData.list
        },
        notUseText() {
            return this.popData.notUseText || this.defaultNotUseText
        }
    },
    data() {
        return {
            defaultNotUseText: '不使用红包',
            code: '',
            useEffect: '',
            activeItem: {
                code: '',
                useEffect: '不使用红包',
                amtCoupon: ''
            },
            activeIndex: 0
        }
    },
    watch: {
        isShow(to, from) {
            if (to) {
                this.init()
            }
        }
    },
    mounted() {},
    methods: {
        init() {
            if (!this.list.length) {
                return
            }
            if (this.popData.hasOwnProperty('activeIndex')) {
                this.activeIndex = this.popData.activeIndex
            }
            // this.activeIndex = findIndex(this.list, (o) => {
            //     return o.code === this.storeCouponCode
            // })
            if (this.activeIndex !== -1) {
                this.getItem(this.activeIndex, this.list[this.activeIndex])
            } else {
                this.getItem(this.activeIndex)
            }
        },
        getItem(index, item) {
            this.activeIndex = index
            if (index !== -1) {
                this.activeItem = item
            } else {
                this.activeItem = {
                    code: '',
                    useEffect: this.notUseText,
                    name: this.notUseText,
                    amtCoupon: '',
                    index: -1
                }
            }
        },
        confirm() {
            let obj = this.activeIndex !== -1 ? this.list[this.activeIndex] : this.activeItem
            this.$emit('confirm', obj)
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
em,
i {
    font-style: normal;
}

.aui-popup__hd {
    font-size: $auiFontSizeLevel3;
    text-align: center;
    color: #666;
    line-height: px2rem(100);
}

.coupon-item {
    font-size: $auiFontSizeLevel7;
    &__num {
        color: $auiTipsColor;
        font-size: $auiFontSizeLevel5;
        em {
            font-size: $auiFontSizeLevel1;
        }
    } // &__desc {
    //     color: $auiTipsColor;
    // }
    &__date,
    &__desc {
        color: $auiTextColorAssistant;
    }
}

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
