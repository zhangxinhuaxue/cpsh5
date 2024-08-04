<!--
    created by yangjun in May 11, 2017
-->
<template>
    <div class="seckill" :class="{'seckill--isGray': end}">
        <div class="seckill__price">
            <span class="seckill__priceBox">
                <i>￥</i>
                <span v-html="complexMoney(minPrice, 100, true)"></span>
            </span>
            <span class="seckill__leftNum">总共<i>{{seckill.displaySeckillNum}}</i>件</span>
        </div>
        <div class="seckill__time" v-if="!end">
            <p>{{timeTxt}}</p>
            <p class="seckill__timeBox" v-html="timeHTML"></p>
        </div>
        <div class="seckill__end" v-if="end">
            已结束
        </div>
    </div>
</template>
<script>
import { getSystime } from 'store/modules/trade/product'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'seckillPart',
    data() {
        return {
            quantity: 60,
            timeTxt: '距离开抢仅剩：',
            end: false,
            timeDiff: 0,
            timeHTML: '<i>-</i><i>-</i>:<i>-</i><i>-</i>:<i>-</i><i>-</i>',
            systemTime: '',
            subTime: 0,
            endDate: ''
        }
    },
    mounted() {
        getSystime().then((data) => {
            if (data.success) {
                this.systemTime = data.result
                let secInfo = this.seckill

                this.subTime = new Date(this.systemTime.replace(/-/g, '/')) - (+new Date())

                if (secInfo.isEnd || !this.stock) {
                    this.end = true
                    return
                }
                if (secInfo.isSeckillFlag) {
                    this.timeTxt = '距离结束仅剩：'
                    this.endDate = secInfo.endDate.replace(/-/g, '/')
                } else {
                    this.end = false
                    this.timeTxt = '距离开始仅剩：'
                    this.endDate = secInfo.startDate.replace(/-/g, '/')
                }
                this.countdown(this.endDate, this.subTime)
            } else {
                this.$_toast(data.resultDes)
            }
        })
    },
    computed: {
        ...mapState('trade/product', {
            minPrice: state => state.initData.trade.minPrice,
            seckill: state => state.initData.seckill,
            stock: state => state.initData.trade.stock
        })
    },
    methods: {
        ...mapMutations('trade/product', [
            'updateInteractData',
            'updateInitData'
        ]),
        countdown(endTime, subTime) {
            let that = this
            let nowDate = new Date(+new Date() + subTime)
            let endDate = new Date(endTime)
            let timeDiff = (endDate - nowDate) / 1000
            if (timeDiff <= 0) { // 倒计时结束
                let secInfo = this.seckill
                if (!secInfo.isSeckillFlag) {
                    this.updateInitData({
                        targetKey: 'seckill',
                        isSeckillFlag: true
                    })
                    this.updateInteractData({
                        targetKey: 'seckill',
                        canBuy: true,
                        btnTxt: '立即购买'
                    })
                    this.timeTxt = '距离结束仅剩：'
                    this.endDate = secInfo.endDate.replace(/\-/g, '\/')
                    this.countdown(this.endDate, this.subTime)
                } else {
                    this.updateInteractData({
                        targetKey: 'seckill',
                        canBuy: false,
                        btnTxt: '立即购买'
                    })
                    that.end = true
                }
                return
            }

            let oneMin = 60
            let oneHour = 60 * 60
            let oneDay = 60 * 60 * 24
            let totalHour = that.getTwoNum(Math.floor(timeDiff / oneHour))
            let totalMin = that.getTwoNum(Math.floor((timeDiff - totalHour * oneHour) / oneMin))
            let totalSec = that.getTwoNum(Math.floor((timeDiff - totalHour * oneHour - totalMin * oneMin)))
            let a = that.splitTime(totalHour)
            let b = that.splitTime(totalMin)
            let c = that.splitTime(totalSec)
            let outStr0 = ''
            a.forEach(item => {
                let oStr = '<i>' + item + '</i>'
                outStr0 += oStr
            })
            let outStr1 = ':<i>' + b[0] + '</i><i>' + b[1] + '</i>'
            let outStr2 = ':<i>' + c[0] + '</i><i>' + c[1] + '</i>'
            this.timeHTML = outStr0 + outStr1 + outStr2
            setTimeout(function() {
                that.countdown(that.endDate, that.subTime)
            }, 1000)
        },
        getTwoNum(num) {
            if (num < 10) {
                return '0' + num
            } else {
                return num
            }
        },
        splitTime(num) {
            num = num + ''
            num = num.split('')
            return num
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
i {
    font-style: normal;
}

.seckill {
    background-color: #FFF0CF;
    height: px2rem(100);
    overflow: hidden;
    &__price {
        float: left; // width: 50%;
        font-size: px2rem(60);
        padding-left: px2rem(32);
        &Box {
            color: $auiAttentionColor;
            font-weight: 600;
            display: inline-block;
            line-height: px2rem(100);
            i {
                font-size: $auiFontSizeLevel3;
            }
        }
    }
    &__leftNum {
        font-size: $auiFontSizeLevel7;
        color: $auiTextColorGeneral;
        i {
            color: #101010;
        }
    }
    &__time {
        float: right; // width: px2rem(230);
        padding-top: px2rem(17);
        padding-right: px2rem(37);
        p:first-child {
            color: $auiTextColorGeneral;
            font-size: $auiFontSizeLevel7;
            line-height: px2rem(33); // margin-bottom: px2rem(10);
        }
        &Box {
            font-size: $auiFontSizeLevel7;
            i {
                display: inline-block;
                width: px2rem(26);
                height: px2rem(30);
                line-height: px2rem(34);
                background-color: $auiTextColorGeneral;
                color: #fff;
                margin: 0 px2rem(4);
                text-align: center;
            }
        }
    }
    &--isGray {
        background: #E4E4E4;
        * {
            color: $auiTextColorAssistant!important;
        }
    }
    &__end {
        float: right;
        font-size: $auiFontSizeLevel7;
        line-height: px2rem(100);
        text-align: right;
        padding-right: px2rem(30);
    }
    &Btn__buyBtn {
        background-color: $auiColorPrimary!important;
        color: $auiTextColorImportant!important;
    }
    &Btn__buyBtn--isGray {
        background-color: #ccc!important;
        color: $auiTextColorImportant!important;
    }
}
</style>
