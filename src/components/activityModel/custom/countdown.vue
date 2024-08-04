<!--
    Modified by limeng on 10/31/17
    1.倒计时模块添加默认高度
    2.可以设置是否使用背景图片
    3.倒计时的默认样式做了适当调整，和预热活动保持一致
-->
<template>
    <section class="countdown-box" v-if="show" :style="getBackgroundStyle">
        <div class="count-down" v-if="show">
            <p :style="titleStyle">{{countdownData.title.text}}</p>
            <section :style="boxStyle">
                <article>
                    <span :style="timeStyle">
                        <b>{{day}}</b>
                    </span>
                    <label :style="labelStyle">天</label>
                    <span :style="timeStyle">
                        <b>{{hour}}</b>
                    </span>
                    <label :style="labelStyle">时</label>
                    <span :style="timeStyle">
                        <b>{{minute}}</b>
                    </span>
                    <label :style="labelStyle">分</label>
                    <span :style="timeStyle">
                        <b>{{second}}</b>
                    </span>
                    <label :style="labelStyle">秒</label>
                </article>
            </section>
        </div>
    </section>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import {formatImg, formatImgWH} from 'src/libs/util'
export default {
    name: 'countdown',
    props: {
        countdownData: Object,
        config: Object
    },
    data() {
        return {
            timeStamp: '',
            day: '',
            hour: '',
            minute: '',
            second: '',
            show: true,
            timer: null,
            titleStyle: {color: '#ffd400'},
            timeStyle: {color: '', background: ''},
            labelStyle: {color: ''},
            boxStyle: {background: '#3a0069'}
        }
    },
    beforeMount() {
        this.init()
    },
    methods: {
        init() {
            let me = this
            let end = me.countdownData.time

            me.titleStyle.color = me.countdownData.title.color
            me.timeStyle.color = me.countdownData.timeColor
            me.timeStyle.background = me.countdownData.bgColor
            me.labelStyle.color = me.countdownData.labelColor
            me.countDown(end)
            me.timer = setInterval(() => {
                me.countDown(end, () => {
                    me.show = false
                    window.clearInterval(me.timer)
                })
            }, 1000)
        },
        countDown(endTime, cb) {
            // 加上系统时间 与当前时间差值
            let me = this
            let cDateTime = +new Date()
            let tDateTime = new Date(endTime)
            let timeDiff = (tDateTime - cDateTime) / 1000

            // 倒计时结束
            if (timeDiff <= 0) {
                me.show = false
                return
            }
            let oneMin = 60
            let oneHour = 60 * 60
            let oneDay = 60 * 60 * 24
            let totalDay = this.getTwoNum(Math.floor(timeDiff / oneDay))
            let totalHour = this.getTwoNum(Math.floor((timeDiff - totalDay * oneDay) / oneHour))
            let totalMin = this.getTwoNum(Math.floor((timeDiff - totalDay * oneDay - totalHour * oneHour) / oneMin))
            let totalSec = this.getTwoNum(Math.floor((timeDiff - totalDay * oneDay - totalHour * oneHour - totalMin * oneMin)))
            let outStr = totalDay + ':' + totalHour + ':' + totalMin + ':' + totalSec + ''

            this.day = totalDay
            this.hour = totalHour
            this.minute = totalMin
            this.second = totalSec

            if (totalDay === '00' && totalHour === '00' && totalMin === '00' && totalSec === '00') {
                // 倒计时结束
                cb && cb()
            }
        },
        getTwoNum(num) {
            return num < 10 ? '0' + num : num
        },
        // 将px转化为rem
        computedSize(px) {
            // $px*320/$designWidth/20 + rem;
            return (px * 320 / 750 / 20) + 'rem'
        }
    },
    computed: {
        getBackgroundStyle() {
            // 设置模块的背景样式
            let imgUrl = this.config.img
            let widthAndHeight = formatImgWH(imgUrl)
            let width = '100%'
            let useBg = true
            let height
            let background

            if (this.countdownData && this.countdownData.useBg) {
                useBg = true
            }

            if (widthAndHeight && widthAndHeight.length > 1) {
                height = this.computedSize(widthAndHeight[1])
            }

            if (this.countdownData && this.countdownData.containerColor) {
                background = this.countdownData.containerColor
            }

            if (this.countdownData && this.countdownData.boxColor) {
                this.boxStyle.background = this.countdownData.boxColor
            }

            if (useBg) {
                return {
                    background
                }
            } else {
                return {
                    width,
                    height,
                    'background-size': '100% 100%',
                    'background-image': 'url(' + formatImg(imgUrl) + ')'
                }
            }
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss">
    @import 'src/assets/styles/vars.scss';
    @import 'src/assets/styles/rem.scss';
    $designWidth: 750;
    $yellow: #ffd400;
    .countdown-box {
        position: relative;
        display: -webkit-box;
        display: -moz-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flex;
        display: flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
        align-items: center;
        min-height: px2rem(137);
    }
    .count-down {
        width: 100%;
        margin: 0 auto;
        font-size: px2rem(22);
        text-align: center;

        p {
            color: $yellow;
            font-size: px2rem(22);
            margin-bottom: px2rem(9);
        }
        section {
            text-align: center;
            font-size: 0;
            width: px2rem(390);
            height: px2rem(70);
            margin: 0 auto;
            background: #3a0069;
            border-radius: px2rem(16);
            display: -webkit-box;
            display: -moz-box;
            display: -webkit-flex;
            display: -moz-flex;
            display: -ms-flex;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
            align-items: center;
        }
        b {
            font-weight: normal;
            position: absolute;
            width: px2rem(46);
            height: px2rem(46);
            left: 0;
            top: 0;
            z-index: 10;
            line-height: px2rem(46);
        }
        span {
            display: inline-block;
            color: #191919;
            font-size: px2rem(32);
            background: $yellow;
            width: px2rem(46);
            height: px2rem(46);
            line-height: px2rem(46);
            border-radius: 3px;
            margin: 0 px2rem(3);
            position: relative;
        }
        span:after {
            content: ' ';
            display: block;
            position: absolute;
            border-top: solid 1px #747476;
            width: px2rem(46);
            height: px2rem(23);
            bottom: -1px;
            left: 0;
            z-index: 5;
        }
        label {
            color: #747474;
            line-height: px2rem(30);
            display: inline-block;
            font-size: px2rem(22);
            width: px2rem(30);
        }
        article {
            margin: 0 auto;
        }
    }
</style>
