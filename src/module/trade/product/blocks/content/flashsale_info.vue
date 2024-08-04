<!--
created: mahui, on 10/11/2017
desc: about flashsale info, including price, stock and so on
-->
<template>
    <div class="flashsale-info" :class="{'flashsale-info_disabled': (flashsaleStatus == 'over') }">
        <div class="flashsale-info__price">
            <em>¥</em><span v-html="complexMoney(price, 100, true)"></span>
        </div>
        <div class="flashsale-info__stock">
            <span class="origin-price" v-html="'¥' + complexMoney(originPrice, 100, true)"></span>
            <span class="desc__rest">已售<strong>{{showSumSale || '0'}}</strong>件</span>
            <!-- <p>{{curStock | showFilter(curShowStock, flashsaleStatus)}}</p> -->
        </div>
        <div class="flashsale-info__time" :class="{'flashsale-info__over': flashsaleStatus == 'over'}" >
            <span>{{tipTxt}}</span>
            <p v-if="flashsaleStatus != 'over'" v-html="countDownHtml"></p>
        </div>
    </div>
</template>

<script>
import {getSystime} from 'store/modules/trade/product'
import {timeFomater} from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations } = createNamespacedHelpers('trade/product')

export default {
    name: 'flashsaleInfo',
    data() {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            widthPercent: '0%',
            systemTime: '',
            subTime: 0,
            flashsaleStatus: 'before',
            timer: null
        }
    },
    computed: {
        ...mapState({
            // 显示价格，即最小价格
            minPrice: state => state.initData.trade.minPrice,
            // 原价
            originPrice: state => state.initData.trade.originPrice,
            // 开始时间
            startTime: state => state.initData.limitSeckill.startTime,
            // 结束时间
            endTime: state => state.initData.limitSeckill.endTime,
            // 销量
            showSumSale: state => state.initData.trade.showSumSale
        }),
        ...mapGetters({
            price: 'price',
            // 初始为所有参加限时抢购的sku的库存总和，切换sku则变为具体sku对应库存
            curStock: 'curStock',
            // 显示库存（>=stock），进度条展示用到
            curShowStock: 'curShowStock'
        }),
        countDownHtml() {
            return this.getCount(this.hours) + ':' + this.getCount(this.minutes) + ':' + this.getCount(this.seconds)
        },
        tipTxt() {
            if (this.flashsaleStatus === 'before') {
                return '距开抢还剩:'
            } else if (this.flashsaleStatus === 'selling') {
                return '距结束还剩:'
            } else {
                return '已结束'
            }
        }
    },
    watch: {
        // 等到商品信息过来了,初始化倒计时
        endTime(val) {
            if (val) {
                this.init()
            }
        },
        flashsaleStatus(val) {
            // 改变vuex中限时抢购状态变量
            this.updateInteractData({
                targetKey: 'limitSeckill',
                state: val
            })
        }
    },
    mounted() {
        // 执行倒计时，之所以会放在这，当返回商详页刷新时候，并不会执行watch里的init
        this.init()
    },
    filters: {
        formatTime(num) {
            return num < 10 ? '0' + num : num
        },
        showFilter(stock, showStock, flashsaleStatus) {
            if (flashsaleStatus === 'before' || flashsaleStatus === 'over') {
                return '限量' + showStock + '件'
            } else {
                return stock > 0 ? '仅剩' + stock + '件' : '限量' + showStock + '件'
            }
        }
    },
    methods: {
        ...mapMutations([
            'updateInteractData'
        ]),
        init() {
            let me = this
            let startTime = timeFomater(this.startTime)
            let endTime = timeFomater(this.endTime)

            getSystime().then((data) => {
                if (data.success) {
                    me.systemTime = timeFomater(data.result)
                    me.subTime = new Date(me.systemTime) - (+new Date())

                    // 判断限时抢购状态：未开抢，抢购中和已结束
                    if ((+new Date(me.systemTime)) < (+new Date(startTime))) {
                        me.flashsaleStatus = 'before'
                    } else if ((+new Date(me.systemTime)) > (+new Date(endTime))) {
                        me.flashsaleStatus = 'over'
                    } else {
                        me.flashsaleStatus = 'selling'
                    }

                    // 根据时间状态开始倒计时
                    if (me.flashsaleStatus === 'before') {
                        me.countDown(startTime, me.subTime)
                    } else if (me.flashsaleStatus === 'selling') {
                        me.countDown(endTime, me.subTime)
                    }
                } else {
                    me.$_toast(data.resultDes)
                }
            })
        },
        countDown(targetTime, subTime) {
            targetTime = timeFomater(targetTime)
            let me = this

            // 防止watch里的定时器和mounted里的定时器同时进行
            if (me.timer) {
                clearInterval(me.timer)
            }

            let curTime = new Date(+new Date() + subTime)

            let endTime = new Date(targetTime).getTime()
            let leftTime = endTime - curTime

            if (leftTime <= 0) {
                return
            }

            // me.hours = Math.floor(leftTime / 1000 / 60 / 60 % 24)
            me.hours = Math.floor(leftTime / 1000 / 60 / 60)
            me.minutes = Math.floor(leftTime / 1000 / 60 % 60)
            me.seconds = Math.floor(leftTime / 1000 % 60)

            me.timer = setInterval(() => {
                if (me.seconds >= 1) {
                    me.seconds--
                } else if (me.minutes >= 1) {
                    me.minutes--
                    me.seconds = 59
                } else if (me.hours >= 1) {
                    me.hours--
                    me.minutes = 59
                    me.seconds = 59
                } else {
                    clearInterval(me.timer)

                    // 倒计时结束，页面状态刷新
                    me.refreshStatus()
                }
            }, 1000)
        },
        refreshStatus() {
            if (this.flashsaleStatus === 'before') {
                // 切换至抢购中的状态
                this.flashsaleStatus = 'selling'
                this.countDown(this.endTime, this.subTime)
            } else {
                // 切换至正常商品状态
                this.flashsaleStatus = 'over'
            }
        },
        // 拼接I标签结构
        getCount(val) {
            let left = Math.floor(val / 10)
            let right = val % 10

            return '<i>' + left + '</i><i>' + right + '</i>'
        }
    }
}
</script>

<style lang="scss">
    @import 'src/style.scss';
    .flashsale-info {
        width: 100%;
        height: px2rem(100);
        background-color: #FEF0CE;
        overflow: hidden;
        &__price {
            float: left;
            padding-left: px2rem(32);
            margin-right: px2rem(20);
            line-height: px2rem(100);
            color: #F66045;
            em {
                position: relative;
                top: px2rem(-10);
                font-size: px2rem(32);
                margin-right: px2rem(7);
            }
            span {
                font-size: px2rem(60);
                font-weight: bold;
                .mantissa {
                    font-size: px2rem(40);
                }
            }
        }
        &__stock {
            float: left;
            height: 100%;
            padding: px2rem(47) 0;
            font-size: px2rem(24);
            color: #666666;
            position: relative;
            padding: px2rem(40) 0 0 px2rem(10);
            .origin-price {
                position:  absolute;
                left: px2rem(10);
                top: px2rem(10);
            }
            .desc__rest {
                height: px2rem(34);
                line-height: px2rem(34);
                background: rgba(219,41,41,1);
                border-radius: px2rem(4);
                padding: 0 px2rem(8);
                font-size: px2rem(22);
                line-height: px2rem(44);
                color: #fff;
                em {
                    color: #666;
                }
            }
            span {
                font-size: px2rem(22);
                color: #999999;
            }
            p {
                margin-top: px2rem(-8);
            }
        }
        &__time {
            float: right;
            height: 100%;
            padding: px2rem(15) px2rem(32) px2rem(17) 0;
            color: #666666;
            font-size: px2rem(24);
            p {
                margin-top: px2rem(-4);
            }
            i {
                display: inline-block;
                width: px2rem(26);
                height: px2rem(30);
                line-height: px2rem(30);
                background-color: $auiTextColorGeneral;
                border-radius: px2rem(2);
                color: #ffffff;
                font-style: normal;
                text-align: center;
                margin: 0 px2rem(2);
            }
        }
        &__over {
            float: right;
            height: 100%;
            padding: px2rem(15) px2rem(32) px2rem(17) 0;
            font-size: px2rem(24);
            line-height: px2rem(76);
            color: #666666;
        }
    }
    .flashsale-info_disabled {
        background-color: #E4E4E4;
        .flashsale-info__price {
            color: #666666;
        }
    }
    .origin-price {
        font-size: px2rem(22);
        line-height: px2rem(32);
        color: #999999;
        text-decoration: line-through;
        .mantissa {
            font-size: px2rem(22) !important;
        }
    }
</style>
