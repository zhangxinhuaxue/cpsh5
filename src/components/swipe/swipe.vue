<template>
    <section class="swipe-wrapper">
        <ul :class="['swipe-list',{trans : open, transnext: openNext, transpre: openPre}]" :style="{paddingTop:percentHW}">
            <template v-for="(item,index) in swipeData">
                <li :class="['item', {
          pre: index === preIndex && swipeData.length > 2,
          next: index === nextIndex && swipeData.length > 2,
          current: index === swipeIndex}]" :style="translateObj[index]" @touchstart="swipeData.length > 2 && touchStart($event)" @touchmove.prevent="swipeData.length > 2 && touchMove($event)" @touchend="swipeData.length > 2 && touchEnd($event)">
                    <a class="link" :href="item.url">
                        <img class="img" :src="item.img">
                    </a>
                </li>
            </template>
        </ul>
        <div class="bullets" v-if="config.isShowBullets">
            <div v-for="(item, index) in swipeData" :class="'bullet '+ (swipeIndex === index ? 'active' : '')">
            </div>
        </div>
    </section>
</template>
<script>
/* global Image */
export default {
    props: {
        swipeData: {
            type: Array,
            default: () => []
        },
        config: {
            type: Object,
            default: () => {
                return {
                    isAutoPlay: true,
                    speed: 3000,
                    isShowBullets: true
                }
            }
        }
    },
    data() {
        return {
            swipeIndex: 0, // 当前元素的index
            nextIndex: 0, // 后一个元素的序列
            preIndex: 0, // 前一个元素的序列
            timer: 0, // 储存循环的计时器序号
            translateObj: {}, // touch事件时用来记录移动位置并应用到style中
            open: true, // 当前元素的动画开关
            openNext: false, // 后一个元素的动画开关
            openPre: true, // 前一个元素的动画开关
            timeOut: false, // 和setTimeout一起可确保touch事件和之后的小动画完成后再执行自动轮播
            moveOpen: false,
            imgPercentHW: []
        }
    },
    computed: {
        percentHW() {
            return Math.min(...this.imgPercentHW) + '%'
        }
    },
    components: {},
    mounted() {
        this.caculateIndex()
        this.setPercentHW()
        this.autoScroll()
        let length = this.swipeData.length
        for (let i = 0; i < length; i++) {
            this.$set(this.translateObj, i, {})
        }
    },
    watch: {
        /* imgPercentHW() {
            console.log('change----')
        }, */
        'swipeData': function(val) {
            this.caculateIndex()
            let length = val.length
            for (let i = 0; i < length; i++) {
                this.$set(this.translateObj, i, {})
            }
        }
    },
    methods: {
        touchStart(event) {
            if (!this.timeOut) {
                let that = this
                that.startX = event.changedTouches[0].pageX // 初始位置
                this.open = false
                this.openPre = false
                this.openNext = false
                this.moveOpen = true
                clearInterval(this.timer)
            }
        },
        touchMove(event) {
            if (this.moveOpen) {
                this.movingX = event.changedTouches[0].pageX // 移动中的位置
                this.percent = ((this.movingX - this.startX) / this.$el.clientWidth) * 100
                this.percent = Math.trunc(this.percent)

                // 需要响应到style中的transform属性添加，必须要用$set方法，否则不会响应到视图
                this.$set(this.translateObj[this.preIndex], 'transform', 'translate3d(' + (this.percent - 100) + '%, 0, 0)')
                this.$set(this.translateObj[this.nextIndex], 'transform', 'translate3d(' + (this.percent + 100) + '%, 0, 0)')
                this.$set(this.translateObj[this.swipeIndex], 'transform', 'translate3d(' + (this.percent) + '%, 0, 0)')
            }
        },
        touchEnd() {
            if (!this.timeOut) {
                this.moveOpen = false
                this.timeOut = true
                this.open = true
                this.openPre = true
                this.openNext = true
                this.$set(this.translateObj[this.preIndex], 'transform', '')
                this.$set(this.translateObj[this.nextIndex], 'transform', '')
                this.$set(this.translateObj[this.swipeIndex], 'transform', '')
                if (this.percent <= -25) { // 假如向左滑了25%，则向左移动一屏，向左移动一屏需要关掉下一个元素的动画开关，否则后后一屏的元素会飞过去
                    this.swipeChange() // 向右侧滚动（包含最后一个元素时的处理）
                    this.openNext = false
                } else if (this.percent >= 25) { // 假如向右滑了25%，则向右移动一屏，向右移动一屏需要关掉前一个元素的动画开关，否则前前一屏的元素会飞过去
                    if (this.swipeIndex === 0) { // 向左侧滚动（包含第一个元素的处理）
                        this.swipeIndex = this.swipeData.length - 1
                    } else {
                        this.swipeIndex--
                    }
                    this.openPre = false
                    this.caculateIndex()
                }
                setTimeout(() => { // 确保移动后的动画完成，延迟和动画时间设置一致
                    this.autoScroll()
                    this.timeOut = false
                }, 300)
            }
        },
        autoScroll() { // 进行自动轮播
            if (this.config.isAutoPlay) {
                let that = this
                clearInterval(that.timer)
                that.openNext = false
                that.openPre = true
                that.timer = setInterval(that.swipeChange, this.config.speed)
            }
        },
        swipeChange() { // 向右侧滚动
            if (this.swipeIndex === this.swipeData.length - 1) {
                this.swipeIndex = 0
            } else {
                this.swipeIndex++
            }
            this.caculateIndex()
        },

        caculateIndex() { // 计算上一个元素和下一个元素的index
            this.preIndex = this.swipeIndex - 1 < 0 ? this.swipeData.length - 1 : this.swipeIndex - 1
            this.nextIndex = this.swipeIndex + 1 >= this.swipeData.length ? 0 : this.swipeIndex + 1
        },
        setPercentHW() {
            const loadImageAsync = (item) => {
                return new Promise((resolve, reject) => {
                    let image = new Image()
                    image.src = item.img
                    image.onload = function() {
                        let _percent = Math.trunc((image.naturalHeight / image.naturalWidth) * 100)
                        resolve(_percent)
                    }

                    image.onerror = function() {
                        reject()
                    }
                })
            }
            for (let item of this.swipeData) {
                loadImageAsync(item)
                    .then((num) => {
                        this.imgPercentHW.push(num)
                    })
                    .catch((error) => {

                    })
            }
        }
    }
}
</script>
<style lang="scss">
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';
.swipe-wrapper {
    position: relative;
    width: 100%;
}

.swipe-list {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding-top: 46%;
    .item {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        z-index: 10;
        background: #fff;
        user-select: none;
        -webkit-touch-callout: none;
        -webkit-tap-highlight-color: transparent;
    }
    .link {
        display: block;
        width: 100%;
        img {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .current {
        transform: translate3d(0, 0, 0);
        z-index: 20;
    }
    .pre {
        transform: translate3d(-100%, 0, 0);
        z-index: 20;
    }
    .next {
        transform: translate3d(100%, 0, 0);
        z-index: 20;
    }
}

.trans {
    .current {
        transition: transform .3s ease-in-out;
    }
}

.transpre {
    .pre {
        transition: transform .3s ease-in-out;
    }
}

.transnext {
    .next {
        transition: transform .3s ease-in-out;
    }
}

.swipe-btn {
    height: 3px;
    background-color: rgba(255, 255, 255, .8);
    position: relative;
    z-index: 30;
    .btn-item {
        position: absolute;
        top: 0;
        left: 0;
        height: 3px;
        background-color: #e81926;
        border-radius: 1px;
        transition: transform .3s ease-in-out;
    }
}

.bullets {
    position: absolute;
    z-index: 30;
    left: 0;
    bottom: .3rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bullet {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: white;
    margin: 0 4px;
    opacity: .6;
    &.active {
        background-color: $color-primary;
        opacity: .9;
    }
}
</style>
