<template>
    <section class="lottery-area" v-bind:class="hashName">
        <div class="lottery-box">
            <span class="btn" :class="[isDisabled?'disabled-btn':'start-btn']" v-on:click="startLottery"></span>
            <div class="lottery-bg" :style="animationStyle"></div>
        </div>
        <!-- <p class="remain-count" :style="chanceStyle">剩余次数：{{chanceCount}}</p> -->
        <p class="remain-count" :style="chanceStyle" v-html="remainCountText"></p>
    </section>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            newDesignWidth: 750,
            hashName: '_' + (new Date().getTime().toString()),
            lotteryCircle: 4,
            during: 3000,
            totalDegrees: 0,
            animationStyle: undefined
        }
    },
    props: ['initInfo', 'chanceCount', 'pointsRunNum', 'isDisabledState', 'prizeInfo', 'toDoLottery'],
    created() {
        this.styleReady()
    },
    computed: {
        lotteryState() {
            return this.toDoLottery
        },
        isDisabled() {
            return this.isDisabledState
        },
        chanceStyle() {
            let { objExts: { wordColor, wordSize } } = this.initInfo
            return {
                color: '#' + wordColor,
                'font-size': window.hotcss.px2rem(wordSize, 750) + 'rem'
            }
        },
        remainCountText() {
            if (this.chanceCount && Number(this.chanceCount)) {
                return `您有${this.chanceCount}次免费抽奖机会`
            } else if (this.initInfo.pointsConsume && this.pointsRunNum && Number(this.pointsRunNum)) {
                return `${this.initInfo.pointsConsume}积分/次`
            } else {
                return '今日抽奖次数已用完'
            }
        }
    },
    watch: {
        lotteryState(newValue) {
            let self = this
            if (!newValue) {
                return
            }

            let perDegree = 360 / this.initInfo.prizeCount
            this.totalDegrees = parseInt(this.lotteryCircle * 360 + (this.prizeInfo.position - 1) * perDegree)
            this.animationStyle = {
                transform: 'rotate(-' + this.totalDegrees + 'deg)',
                transition: 'transform ' + this.during + 'ms'
            }
            var movement = setTimeout(function() {
                clearInterval(movement)
                self.animationStyle = {
                    transform: 'rotate(-' + (self.totalDegrees % 360) + 'deg)',
                    transition: 'transform 0ms'
                }
                // 抽奖结束
                self.$emit('afterLottery')
            }, this.during)
        }
    },
    methods: {
        // 默认style
        styleReady() {
            let styleElem = document.createElement('style')

            let styleArray = [
                '.' + this.hashName + ', .' + this.hashName + ' * {margin: 0; padding: 0; list-style: none; }',
                '.' + this.hashName + ' { position: relative;  width: 100%; height: ' + this._px2rem(this.initInfo.blockHeight) + ';background-image:url(' + this.initInfo.blockBg + '); background-repeat: no-repeat; background-position: center top; background-size: auto 100%; }',
                '.' + this.hashName + ' .remain-count { position: absolute; bottom:' + this._px2remAndO2N(20) + '; text-align:center; width: 100%;}',
                '.' + this.hashName + ' .lottery-box { position: relative; top:' + this._px2rem(this.initInfo.top) + '; margin:auto; width: ' + this._px2remAndO2N(714) + '; height: ' + this._px2remAndO2N(714) + '; overflow: hidden; }',
                '.' + this.hashName + ' .lottery-box .lottery-bg{ position: absolute; top:0; left:0; width: 100%; height: 100%; background-image:url(' + this.initInfo.lotterySubBg + '); background-repeat: no-repeat; background-position: center; background-size: 100% auto; }',
                '.' + this.hashName + ' .lottery-box .btn{z-index:10; position: relative; display: block; width:' + this._px2remAndO2N(224) + '; height:' + this._px2remAndO2N(269) + ';top:' + this._px2remAndO2N(200) + '; background-repeat: no-repeat; background-position: center; background-size: 100% auto; margin: auto;}',
                '.' + this.hashName + ' .lottery-box .start-btn {background-image:url(' + this.initInfo.startUrl + ');}',
                '.' + this.hashName + ' .lottery-box .disabled-btn { background-image:url(' + this.initInfo.disabledUrl + ');}'
            ]

            let node = document.createTextNode(styleArray.join(' '))
            styleElem.appendChild(node)
            document.getElementsByTagName('head')[0].appendChild(styleElem)
        },

        // 转盘内size换算
        _px2remAndO2N(oldPx) {
            return (oldPx * 320 / this.newDesignWidth / 20) * (this.initInfo.lotteryWidth / 750) + 'rem'
        },

        // 非转盘内size换算
        _px2rem(px) {
            return (px * 320 / this.newDesignWidth / 20) + 'rem'
        },
        startLottery() {
            console.log('startLotterystartLotterystartLotterystartLotterystartLotterystartLottery' + this.isDisabled)
            if (this.isDisabled) {
                return
            }
            // 抽奖前的处理逻辑
            this.$emit('beforeLottery', this.isDisabled)
        }
    }
}
</script>
