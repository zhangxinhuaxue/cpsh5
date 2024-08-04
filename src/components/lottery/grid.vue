<template>
    <section class="lottery-area" v-bind:class="hashName">
        <div class="lottery-box">
            <ul>
                <li class="pos-5" :class="[isDisabled?'disabled-btn':'start-btn']" v-on:click="startLottery"></li>
                <li class="pos-1" :class="{active:activeId==0}" data-prize-id="1"></li>
                <li class="pos-2" :class="{active:activeId==1}" data-prize-id="2"></li>
                <li class="pos-3" :class="{active:activeId==2}" data-prize-id="3"></li>
                <li class="pos-6" :class="{active:activeId==3}" data-prize-id="4"></li>
                <li class="pos-9" :class="{active:activeId==4}" data-prize-id="5"></li>
                <li class="pos-8" :class="{active:activeId==5}" data-prize-id="6"></li>
                <li class="pos-7" :class="{active:activeId==6}" data-prize-id="7"></li>
                <li class="pos-4" :class="{active:activeId==7}" data-prize-id="8"></li>
            </ul>
        </div>
        <!-- <p class="remain-count" :style="chanceStyle">剩余次数：{{chanceCount}}</p> -->
        <p class="remain-count" :style="chanceStyle" v-html="remainCountText"></p>
    </section>
</template>
<script type="text/javascript">
export default {
    data() {
        return {
            during: 100,
            lotteryCircle: 4,
            newDesignWidth: 750,
            hashName: '_' + (new Date().getTime().toString()),
            activeId: -1
        }
    },
    props: ['initInfo', 'chanceCount', 'pointsRunNum', 'isDisabledState', 'prizeInfo', 'toDoLottery'],
    created: function() {
        this.styleReady()
    },
    computed: {
        lotteryState: function() {
            return this.toDoLottery
        },
        isDisabled: function() {
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
        lotteryState: function(newValue) {
            let self = this
            if (!newValue) {
                return
            }
            let steps = this.initInfo.prizeCount * this.lotteryCircle + (this.initInfo.prizeCount - this.activeId + (this.prizeInfo.position - 1))
            var movement = setInterval(function() {
                if (steps == 0) {
                    clearInterval(movement)
                    // 抽奖结束
                    self.$emit('afterLottery')
                    return
                }
                steps--
                self.activeId = (self.activeId + 1) % self.initInfo.prizeCount
            }, self.during)
        }
    },
    methods: {
        // 默认style
        styleReady: function() {
            let styleElem = document.createElement('style')
            let styleArray = [
                '.' + this.hashName + ', .' + this.hashName + ' * {margin: 0; padding: 0; list-style: none; }',
                '.' + this.hashName + ' { position: relative;  width: 100%; height: ' + this._px2rem(this.initInfo.blockHeight) + ';background-image:url(' + this.initInfo.blockBg + '); background-repeat: no-repeat; background-position: center top; background-size: auto 100%; }',
                '.' + this.hashName + ' .lottery-box { position: relative; top:' + this._px2rem(this.initInfo.top) + '; margin:auto; width: ' + this._px2remAndO2N(750) + '; height: ' + this._px2remAndO2N(750) + '; overflow: hidden; }',
                '.' + this.hashName + ' .lottery-box ul { position: relative; display: block; margin-top: ' + this._px2remAndO2N(12) + '; margin-left: ' + this._px2remAndO2N(12) + ';}',
                '.' + this.hashName + ' .lottery-box li {display: block; position: absolute; width: ' + this._px2remAndO2N(206) + '; height: ' + this._px2remAndO2N(206) + '; margin: ' + this._px2remAndO2N(18) + '; background-repeat: no-repeat; background-position: center; background-size: 100% auto; }',
                '.' + this.hashName + ' .lottery-box .active:after { content: " "; position: absolute; top: ' + this._px2remAndO2N(-9) + '; left: ' + this._px2remAndO2N(-9) + '; width: ' + this._px2remAndO2N(223) + '; height: ' + this._px2remAndO2N(223) + '; background-image:url(' + this.initInfo.lotterySubBg + '); background-size: 100% auto; background-repeat:no-repeat; background-position:center center; }',
                '.' + this.hashName + ' .lottery-box .start-btn { background-image:url(' + this.initInfo.startUrl + ');}',
                '.' + this.hashName + ' .lottery-box .disabled-btn { background-image:url(' + this.initInfo.disabledUrl + ');}',
                '.' + this.hashName + ' .remain-count { position: absolute; bottom:' + this._px2remAndO2N(20) + '; text-align:center; width: 100%;}'
            ]

            // lottery-box itempos style
            let itemSpace = 206 + 36
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    let pos = r * 3 + (c + 1)
                    let left = this._px2remAndO2N(itemSpace * c)
                    let top = this._px2remAndO2N(itemSpace * r)

                    styleArray.push('.' + this.hashName + ' .lottery-box .pos-' + pos + '{ left:' + left + '; top: ' + top + ';}')
                }
            }

            let prizeList = this.initInfo.prizeList
            for (let i = 0; i < prizeList.length; i++) {
                styleArray.push('.' + this.hashName + ' .lottery-box [data-prize-id=\'' + prizeList[i].position + '\'] { background-image:url(' + prizeList[i].imgUrl + ');}')
            }
            let node = document.createTextNode(styleArray.join(' '))
            styleElem.appendChild(node)
            document.getElementsByTagName('head')[0].appendChild(styleElem)
        },

        // 转盘内size换算
        _px2remAndO2N: function(oldPx) {
            return (oldPx * 320 / this.newDesignWidth / 20) * (this.initInfo.lotteryWidth / 750) + 'rem'
        },

        // 非转盘内size换算
        _px2rem: function(px) {
            return (px * 320 / this.newDesignWidth / 20) + 'rem'
        },
        startLottery: function() {
            if (this.isDisabled) {
                return
            }
            // 抽奖前的处理逻辑
            this.$emit('beforeLottery', this.isDisabled)
        }

    }

}
</script>
