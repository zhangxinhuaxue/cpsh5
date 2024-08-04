<!--
    created: mahui, on 2018/10/22,
    desc: 1. 倒计时组件
          2. 可配置两个时间点，开始时间点和结束时间点，可二选一也可同时勾选
          3. 配置两个时间点其实是开启两段倒计时，即距开始前倒计时和距结束前倒计时，如果只配置了开始时间点和结束时间点则只有一段倒计时，可把当前系统时间作为倒计时开始时间处理,另外的时间点当作结束时间点
          3. 两个时间点都有对应的提示文案及其样式，对应的倒计时时间以及样式，倒计时可分一行或两行展示，倒计时结束后有图片替代，防止页面上滑
-->
<template>
    <div type="countdown" data-name="倒计时模块" :id="countDownId" :class="['countdown', (!config.img && showCountDown) ? 'fixHeight': '']" :style="{'background-color': '#' + config.bgColor}">
        <!-- 背景图，之所以没作为背景显示，是因为产品要求背景图高度不固定 -->
        <axd-image v-if="showCountDown" :src="config.img" :resizeW="750"></axd-image>

        <!-- 倒计时 -->
        <!--  <div class="countdown__panel" :class="[displayModeClass, displayPosClass]"> -->
            <!-- 距离开始 -->
            <!-- <div class="countdown__text" :style="{'color': '#' + config.objExtJson.startPromtTextColor}">距离开始</div>
            <div class="countdown__time" :style="{'color': '#' + config.objExtJson.startCountdownTextColor}">
                <span>2</span>天 <span>18</span>:<span>37</span>:<span>23</span>
            </div> -->

            <!-- 距离结束 -->
            <!-- <div class="countdown__text" :style="{'color': '#' + config.objExtJson.endPromtTextColor}">距离开始</div>
            <div class="countdown__time" :style="{'color': '#' + config.objExtJson.endCountdownTextColor}">
                <span>2</span>天 <span>18</span>:<span>37</span>:<span>23</span>
            </div> -->
        <axd-image v-if="!showCountDown && config.objExtJson.endDefaultImgUrl" :src="config.objExtJson.endDefaultImgUrl"></axd-image>
        <!-- </div> -->
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { getSystime } from 'store/modules/trade/product'
import Seckill from 'src/libs/seckill'
export default {
    name: 'countdown',
    props: {
        config: Object
    },
    data() {
        return {
            showCountDown: true,
            countDown: null
        }
    },
    components: {
        axdImage
    },
    computed: {
        countDownId() {
            return 'countDown' + this.config.id
        },
        // 分一行还是两行展示
        displayModeClass() {
            let displayMode = this.config.objExtJson && this.config.objExtJson.displayMode
            if (displayMode === 'one') {
                return 'one-row'
            } else if (displayMode === 'two') {
                return 'two-row'
            }
        },
        // 倒计时居左居右还是居中展示
        displayPosClass() {
            let displayPosition = this.config.objExtJson && this.config.objExtJson.displayPosition
            if (displayPosition === 'left') {
                return 'left'
            } else if (displayPosition === 'center') {
                return 'center'
            } else if (displayPosition === 'right') {
                return 'right'
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            let objExtJson = this.config.objExtJson

            // 初始化倒计时开始时间点，结束时间点
            let countDownConfig = {
                startTime: '',
                endTime: '',
                startPromtText: '距离开始', // 距开始倒计时文案
                startPromtTextColor: '', // 距开始倒计时文案颜色
                startCountdownTextColor: '', // 距开始倒计时时间颜色
                startCountdownTextBgColor: '', // 距开始倒计时时间背景色
                endPromtText: '', // 距结束倒计时文案
                endPromtTextColor: '', // 距结束倒计时文案颜色
                endCountdownTextColor: '', // 距结束倒计时时间颜色
                endCountdownTextBgColor: '' // 距结束倒计时时间背景色
            }

            if (objExtJson.isStartCountdown && objExtJson.isEndCountdown) {
                // 同时配置了开始时间和结束时间
                Object.assign(countDownConfig, objExtJson, {
                    startTime: objExtJson.startCountdownText,
                    endTime: objExtJson.endCountdownText
                })

                this.goCountDown(countDownConfig)
            } else {
                // 获取当前时间
                if (objExtJson.isStartCountdown) {
                    // 只配置了距开始点倒计时

                    Object.assign(countDownConfig, {
                        startTime: this.config.modifyTime,
                        endTime: objExtJson.startCountdownText,
                        endPromtText: objExtJson.startPromtText,
                        endPromtTextColor: objExtJson.startPromtTextColor,
                        endCountdownTextColor: objExtJson.startCountdownTextColor,
                        endCountdownTextBgColor: objExtJson.startCountdownTextBgColor
                    })
                } else if (objExtJson.isEndCountdown) {
                    // 只配置了距结束点倒计时

                    Object.assign(countDownConfig, objExtJson, {
                        startTime: this.config.modifyTime,
                        endTime: objExtJson.endCountdownText
                    })
                }

                this.goCountDown(countDownConfig)
            }
        },
        goCountDown(countDownConfig) {
            // 生成dom模板，狠复杂的模板，嗯
            let template = this.getTemplate(countDownConfig)
            console.log(this.config.subTime)
            this.countDown = new Seckill({
                el: document.querySelector('#' + this.countDownId),
                during: 1000,
                template: template,
                endTime: countDownConfig.endTime,
                startTime: countDownConfig.startTime,
                pClass: 'countdown__panel ' + this.displayModeClass + ' ' + this.displayPosClass,
                // gap: this.config.subTime,
                getServerTime: () => {
                    return new Promise((resolve, reject) => {
                        getSystime().then(({ success, result }) => {
                            resolve({
                                success,
                                serverTime: result
                            })
                        })
                    })
                },
                beginSeckillCb: () => {
                },
                endSeckillCb: () => {
                    this.showCountDown = false

                    // 销毁倒计时
                    this.countDown.destory()
                }
            })

            this.countDown.init()
        },
        getTemplate(countDownConfig) {
            let template = '$isBefore{<div class="countdown__text" style="color: #' + countDownConfig.startPromtTextColor + '">' + countDownConfig.startPromtText + '</div>' +
            '<div class="countdown__time" id="countDownTime" style="color: #' + countDownConfig.startCountdownTextColor + '">' +
                '<span style="background-color: #' + countDownConfig.startCountdownTextBgColor + '">$D$D</span>天 <span style="background-color: #' + countDownConfig.startCountdownTextBgColor + '">$h$h</span>:<span style="background-color: #' + countDownConfig.startCountdownTextBgColor + '">$m$m</span>:<span style="background-color: #' + countDownConfig.startCountdownTextBgColor + '">$s$s</span>' +
            '</div>}' +
            '$isIng{<div class="countdown__text" style="color: #' + countDownConfig.endPromtTextColor + '">' + countDownConfig.endPromtText + '</div>' +
            '<div class="countdown__time" id="countDownTime" style="color: #' + countDownConfig.endCountdownTextColor + '">' +
                '<span style="background-color: #' + countDownConfig.endCountdownTextBgColor + '">$D$D</span>天 <span style="background-color: #' + countDownConfig.endCountdownTextBgColor + '">$h$h</span>:<span style="background-color: #' + countDownConfig.endCountdownTextBgColor + '">$m$m</span>:<span style="background-color: #' + countDownConfig.endCountdownTextBgColor + '">$s$s</span>' +
            '</div>}' +
                '$isAfter{已结束}'
            return template
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/style.scss';
.countdown {
    position: relative;
    width: 100%;
    &__panel {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        font-size: px2rem(26);
        display: flex;
        display: -webkit-flex;

        span {
            display: inline-block;
            width: px2rem(38);
            height: px2rem(38);
            border-radius: px2rem(3);
            text-align: center;
            line-height: px2rem(38);
            background-color: #ffffff;
            margin: 0 px2rem(2);
            &:first-child {
                margin-right: px2rem(5);
            }
        }
    }

    &__text {
        font-weight: bold;
    }
}
.countdown.fixHeight {
    height: px2rem(90);
}

.countdown__panel.left {
    padding-left: px2rem(20);
}
.countdown__panel.right {
    padding-right: px2rem(20);
}

/* 倒计时一行样式 */
.countdown__panel.one-row {
    align-items: center;
    .countdown__text {
        margin-right: px2rem(21);
    }
}
.countdown__panel.one-row.left {
    justify-content: flex-start;
}
.countdown__panel.one-row.right {
    justify-content: flex-end;
}
.countdown__panel.one-row.center {
    justify-content: center;
}

/* 倒计时两行样式 */
.countdown__panel.two-row {
    flex-direction: column;
    justify-content: center;
}
.countdown__panel.two-row.left {
    align-items: flex-start;
}
.countdown__panel.two-row.right {
    align-items: flex-end;
}
.countdown__panel.two-row.center {
    align-items: center;
}
</style>
