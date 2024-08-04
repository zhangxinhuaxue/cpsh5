<template>
    <div class="order__box" @click="itemClick">
        <div class="order__bd">
            <div class="order__bd__left">
                <p class="order__bd__title">{{itemData.productDesc}}</p>
                <p
                    class="order__bd__date"
                >{{itemData.orderTime | dateFormat('yyyy-MM-dd')}} {{itemData.stages}}期</p>
                <p class="order__bd__id">订单号:{{itemData.orderId}}</p>
            </div>
            <div class="order__bd__right">
                <span class="order__bd__price">
                    <i class="order__bd__price_symbol">￥</i>
                    {{itemData.loanAmt }}
                </span>
                <m-icon type="arrow2" class="icon-arrow"></m-icon>
                <p
                    class="order__bd__status"
                    :class="itemData.orderStatus|statusItem|statusColor"
                >{{itemData.orderStatus|statusItem|statusText }}</p>
            </div>
        </div>
        <div class="order__ft" v-if="$slots.ft">
            <slot name="ft"></slot>
        </div>
    </div>
</template>
<script>
import { Icon as mIcon, Button as mButton } from '@fe/buss-ui'
export default {
    name: 'cash-item',
    props: {
        itemData: {
            type: Object,
            /* beautify preserve:start */
            default() {
                return {}
            }
            /* beautify preserve:end */
        }
    },
    filters: {
        statusItem(value) {
            const processing = [2, 4, 8, 12]
            const closed = [3, 6, 9]
            const statusObject = {
                1: {
                    colorClass: 'text-blue',
                    label: '审核中'
                },
                5: {
                    colorClass: '',
                    label: '已放款'
                },
                7: {
                    colorClass: '',
                    label: '已还清'
                },
                13: {
                    colorClass: 'text-red',
                    label: '待提现'
                }
            }
            const map = new Map([
                [
                    processing,
                    {
                        colorClass: 'text-blue',
                        label: '处理中'
                    }
                ],
                [
                    closed,
                    {
                        colorClass: 'text-gray',
                        label: '已关闭'
                    }
                ]
            ])
            if (processing.indexOf(+value) > -1) {
                return map.get(processing)
            }
            if (closed.indexOf(+value) > -1) {
                return map.get(closed)
            }
            return statusObject[value] || {}
        },
        statusText(value) {
            return value['label']
        },
        statusColor(value) {
            return value['colorClass']
        }
    },
    data() {
        return {}
    },
    components: {
        mIcon,
        mButton
    },
    mounted() {
        // console.log(this.itemData)
    },
    methods: {
        itemClick() {
            this.$emit('click')
        }
    }
}
</script>
<style lang="scss" scoped>
.order__box {
    padding: px2rem(32);
    // padding-bottom: 0;
    background: #fff;
    border-radius: px2rem(14);
}

.order__bd {
    display: flex;
    align-items: flex-start;
    padding: 0;
}

.order__ft {
    margin-top: px2rem(22);
    margin-bottom: px2rem(-32);
    padding: px2rem(10) 0;
    // line-height: px2rem(80);
    position: relative;

    text-align: right;

    &:after {
        content: '';
        width: 100%;
        height: 1px;
        border-top: solid 1px #ececec;
        position: absolute;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        left: 0;
        top: 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .order__ft_btn {
        display: inline-block;
        width: auto;
        line-height: px2rem(64);
        padding: 0 px2rem(40);
        border-radius: px2rem(32);
    }
}

.order__bd__left {
    flex: 1;
    color: #a1a1a1;

    .order__bd__title {
        font-size: px2rem(32);
        font-weight: bold;
        color: #424243;
    }

    .order__bd__date {
        font-size: px2rem(28);
    }

    .order__bd__id {
        font-size: px2rem(24);
    }
}

.order__bd__right {
    color: #424243;

    .icon-arrow {
        color: #ccc;
        font-size: px2rem(32);
    }
}

.order__bd__price {
    font-size: px2rem(32);

    .order__bd__price_symbol {
        font-size: px2rem(24);
        font-style: normal;
    }
}

.order__bd__status {
    text-align: center;
    font-size: px2rem(24);
}

::v-deep .mui-btn + .mui-btn {
    margin-top: 0;
}

/*status color*/

.text-blue {
    color: #027aff;
}

.text-gray {
    color: #a1a1a1;
}

.text-red {
    color: #ff5547;
}
</style>
