<template>
    <div v-if="couponList.length">
        <template v-for="(item, index) in couponList">
            <div
                class="coupon-cell"
                :class="[item.color ? 'coupon-cell_' + item.color : '', getDisabled(item.status, status) ? 'coupon-cell_disabled coupon-cell_' + handleStatus(item.status, status) : 'coupon-cell_abled']"
                :key="handleStatus(item.status, status) + index"
            >
                <div class="coupon-cell__hd">
                    <p>{{ item.desc }}</p>
                </div>
                <div class="coupon-cell__bd">
                    <p class="free-tips" v-if="item.category == 'product_free_interest'">购物车合并购买时不可用</p>
                    <m-coupon
                        type="frame"
                        :disabled="getDisabled(item.status, status)"
                        :coupon="{showVip: item.showVip}"
                    >
                        <div
                            v-if="item.type == 'discount'"
                            class="coupon-type coupon-type_discount"
                            slot="left"
                            :sub="item.amount | pointSplit(1) | saveDecimals"
                        >{{ item.amount | pointSplit(0)}}</div>
                        <div
                            v-else
                            class="coupon-type"
                            :class="['coupon-type_' + item.type, formatFs(item.amount || 0)]"
                            slot="left"
                        >{{ item.amount}}</div>
                        <template slot="middle">
                            <h4 class="coupon-title">{{ item.title }}</h4>
                            <p
                                class="coupon-limit"
                                v-for="(limit, index) in item.limit"
                                :key="handleStatus(item.status, status) + index + 'limit'"
                            >{{ limit }}</p>
                        </template>
                        <template slot="bottom">
                            <a
                                v-if="item.url && !getDisabled(item.status, status)"
                                :href="item.url"
                                class="coupon-link"
                            >
                                立即使用
                                <m-icon class="coupon-link-icon" type="back"></m-icon>
                            </a>
                            <p
                                class="coupon-date"
                                :class="{'coupon-link_remind': item.remind}"
                            >{{ item.validPeriod }}</p>
                        </template>
                    </m-coupon>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import { Coupon, Icon } from '@fe/buss-ui'
export default {
    name: 'couponList',
    props: {
        status: {
            type: String,
            default: 'normal',
            validator(value) {
                return ['normal', 'used', 'overdue'].indexOf(value) !== -1
            }
        },
        data: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            couponList: []
        }
    },
    computed: {
        // disabled() {
        //     return this.status !== 'normal'
        // }
    },
    components: {
        mCoupon: Coupon,
        mIcon: Icon
    },
    watch: {
        data(newVal) {
            this.data.length && this.init()
        }
    },
    filters: {
        pointSplit(val, i) {
            return val ? val.toString().split('.')[i] : '0'
        },
        saveDecimals(val) {
            return `.${val}折`
        }
        // formatFs(val) {
        //     if (typeof val != 'string') {
        //         val = val.toString()
        //     }
        //     let fs = 'fs120'
        //     if (val.length == 4) {
        //         fs = 'fs80'
        //     } else if (val.length > 4) {
        //         fs = 'fs50'
        //     }
        //     return fs
        // }
    },
    mounted() {
        this.data.length && this.init()
        console.log(this.couponList.length)
    },
    methods: {
        init() {
            let couponList = this.data.map(item => {
                let category = item.category
                let urlApp = item.urlApp || ''
                let urlH5 = item.urlH5 || ''
                let type = this.getType(category)
                let color = this.getColor(item)
                item.type = type
                item.color = color
                item.url = this.isApp ? urlApp : urlH5
                return item
            })
            this.couponList = couponList
        },
        getType(category) {
            let type
            switch (category) {
                case 'discount':
                    type = 'discount'
                    break
                case 'product_free_interest':
                    type = 'periods'
                    break
                case 'amc_discount':
                    type = 'amcDis'
                    break
                default:
                    type = 'amount'
                    break
            }
            return type
        },
        getColor(item) {
            let { status = '', category } = item
            let color = ''
            if (!this.getDisabled(status, this.status)) {
                switch (category) {
                    case 'discount':
                    case 'free_interest':
                        color = 'orange'
                        break
                    case 'product_free_interest':
                        color = 'aureate'
                        break
                    default:
                        color = 'red'
                        break
                }
            }
            return color
        },
        formatFs(val) {
            console.log(val)
            if (typeof val != 'string') {
                val = val.toString()
            }
            let fs = 'fs120'
            if (val.length == 4) {
                fs = 'fs80'
            } else if (val.length > 4) {
                fs = 'fs50'
            }
            return fs
        },
        handleStatus(itemStatus, status) {
            let state = itemStatus || status
            return state
        },
        getDisabled(itemStatus, status) {
            let state = itemStatus || status
            return state !== 'normal'
        }
    }
}
</script>
<style lang="scss" scoped>
.fs120 {
    font-size: px2rem(120);
}
.fs80 {
    font-size: px2rem(80);
}
.fs50 {
    font-size: px2rem(50);
}
.coupon-cell {
    height: px2rem(260);
    margin: px2rem(30) px2rem(32);
    background-color: #fff;
    border-radius: px2rem(8);
    overflow: hidden;
    display: flex;
    position: relative;
    &__bd {
        flex: 1;
        position: relative;
    }
}
.coupon-cell_used::after {
    content: '';
    position: absolute;
    width: px2rem(152);
    height: px2rem(147);
    background-image: url('./img/coupon_used.png');
    background-size: cover;
    z-index: 1;
    right: 0;
    top: 0;
}
.coupon-cell_overdue::after {
    content: '';
    position: absolute;
    width: px2rem(152);
    height: px2rem(147);
    background-image: url('./img/coupon_expired.png');
    background-size: cover;
    z-index: 1;
    right: 0;
    top: 0;
}
.coupon-cell__hd {
    width: px2rem(60);
    text-align: center;
    font-size: px2rem(26);
    p {
        display: table-cell;
        height: 5.54667rem;
        vertical-align: middle;
        font-size: 0.55467rem;
        padding: 0 px2rem(10);
    }
}
.coupon-cell_aureate {
    .coupon-cell__hd {
        color: #131314;
        background: linear-gradient(#f3e3bf, #dec694);
    }
    .coupon-link,
    .coupon-date,
    .coupon-type {
        color: #9b7d46;
    }
}
.coupon-cell_red {
    .coupon-cell__hd {
        color: #fff;
        background-color: #f66045;
    }
    .coupon-link,
    .coupon-type {
        color: #f66045;
    }
}
.coupon-cell_orange {
    .coupon-cell__hd {
        color: #fff;
        background-color: var(--auiTipsColor);
    }
    .coupon-link,
    .coupon-type {
        color: var(--auiTipsColor);
    }
}

.coupon-cell_disabled {
    .coupon-cell__hd {
        color: #fff;
        background-color: #ccc;
    }
    .free-tips {
        color: #ccc;
    }
}
.coupon-cell_abled {
    .coupon-title {
        color: #424243;
    }
    .coupon-limit {
        color: #717172;
    }
    .free-tips {
        color: #717172;
    }
    .coupon-link_remind {
        color: #f75258;
    }
}
.coupon-type {
    font-weight: 700;
}
.coupon-type_amcDis::after {
    content: '折';
    font-size: px2rem(24);
    font-weight: normal;
    margin-left: px2rem(8);
}
.coupon-type_periods::after {
    content: '期免息';
    font-size: px2rem(24);
    font-weight: normal;
    margin-left: px2rem(8);
}
.coupon-type_amount::before {
    content: '¥';
    font-size: px2rem(30);
    font-weight: normal;
}
.coupon-type_discount {
    font-size: px2rem(90);
    &:after {
        content: attr(sub);
        font-size: px2rem(50);
    }
}
.coupon-title {
    font-size: px2rem(28);
    margin-bottom: px2rem(6);
    width: px2rem(324);
    white-space: nowrap;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
}
.coupon-limit {
    font-size: px2rem(24);
    line-height: 1.2em;
    width: px2rem(324);
    white-space: nowrap;
    font-weight: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    &::before {
        content: '·';
    }
}
.free-tips {
    position: absolute;
    bottom: px2rem(60);
    left: px2rem(284);
    font-size: px2rem(20);
    margin-top: px2rem(6);
    z-index: 1;
}
.coupon-link {
    float: right;
}
.coupon-link-icon {
    font-size: px2rem(24);
    transform: rotate(180deg) scale(0.8);
    color: inherit;
    margin-left: px2rem(-4);
}
</style>
