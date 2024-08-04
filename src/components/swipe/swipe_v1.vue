<!--
    在原组件基础上进行了修改：
    a、将banner图的img自适应，改成了按宽度居中自适应；
    b、bullet样式发生了变化；
    c、轮播组件的size，由父容器size或者config内的width,height参数决定。
    d、单图不轮播
    e、解决两张图片情况下，播放操作错乱
    参数说明：
        1、单图情况：不能轮播
        2、多图情况：轮播，显示bullet
        swipeData: item list
        config:
            isAutoPlay: 是否自动播放，false时，禁止自动播放；true时，自动播放
            speed：单图自动播放时间间隔（包含图片动画时间）
            isShowBullets: 是否显示bullet, false时，不显示；
            width: 设置swiper的宽；未设置时，默认取父容器的宽
            height: 设置swiper的高；未设置时，默认取父容器的高
-->
<template>
    <div :class="['swiper-container', otherName]">
        <div class="swiper-wrapper">
            <template v-for="(item, index) in swipeData">
                <a class="swiper-slide" :href="item.url" :style="{backgroundImage: 'url(' + item.img + ')'}"></a>
            </template>
        </div>
        <!-- 如果需要分页器 -->
        <div class="swiper-pagination"></div>
    </div>
</template>
<script>
import swiper from 'src/libs/swiper.js'
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
                    speed: 2500,
                    isShowBullets: true
                }
            }
        },
        otherName: {
            type: String,
            default: () => ''
        },
        useDefault: {
            type: Boolean,
            default: () => true
        }
    },
    data() {
        return {
            oneSlideConfig: {
                loop: false,
                autoplay: 0
            },
            moreSlideConfig: {
                direction: 'horizontal',
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                autoplay: 2000,
                autoplayDisableOnInteraction: false,
                speed: 500, // 多长时间完成一屏
                watchSlidesProgress: true,
                watchSlidesVisibility: true, // 决定点是否可见
                touchRatio: 1
            }
        }
    },
    mounted() {
        this.handleSwiperConfig()
    },
    methods: {
        handleSwiperConfig() {
            let newValue = this.swipeData
            let slideConfig = this.oneSlideConfig
            if (newValue && newValue.length > 0) {
                if (newValue.length > 1) {
                    slideConfig = this.moreSlideConfig

                    // 兼容老版本参数
                    if (!this.config.isAutoPlay) {
                        slideConfig.autoplay = 0
                    } else {
                        slideConfig.autoplay = this.config.speed - slideConfig.speed
                    }

                    if (!this.config.isShowBullets) {
                        slideConfig.pagination = ''
                    }
                }
                if (this.config.width) {
                    slideConfig.width = this.config.width
                }
                if (this.config.height) {
                    slideConfig.height = this.config.height
                }
                this.$nextTick(function() {
                    if (!this.useDefault) {
                        new window.Swiper('.' + this.otherName, this.config)
                    } else {
                        new window.Swiper('.swiper-container', slideConfig)
                    }
                })
            }
        }
    }
}
</script>
<style lang="scss">
@import 'src/assets/styles/vars.scss';
@import 'src/assets/styles/rem.scss';
@import 'src/assets/styles/mixins.scss';

/** swiper组件原始css，有删减 */

.swiper-container {
    margin-left: auto;
    margin-right: auto;
    position: relative;
    overflow: hidden;
    /* Fix of Webkit flickering */
    z-index: 1;
}

.swiper-container-no-flexbox .swiper-slide {
    float: left;
}

.swiper-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-transition-property: -webkit-transform;
    -moz-transition-property: -moz-transform;
    -o-transition-property: -o-transform;
    -ms-transition-property: -ms-transform;
    transition-property: transform;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
}

.swiper-container-android .swiper-slide,
.swiper-wrapper {
    -webkit-transform: translate3d(0px, 0, 0);
    -moz-transform: translate3d(0px, 0, 0);
    -o-transform: translate(0px, 0px);
    -ms-transform: translate3d(0px, 0, 0);
    transform: translate3d(0px, 0, 0);
}

.swiper-container-multirow > .swiper-wrapper {
    -webkit-box-lines: multiple;
    -moz-box-lines: multiple;
    -ms-flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
}

.swiper-container-free-mode > .swiper-wrapper {
    -webkit-transition-timing-function: ease-out;
    -moz-transition-timing-function: ease-out;
    -ms-transition-timing-function: ease-out;
    -o-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
    margin: 0 auto;
}

.swiper-slide {
    -webkit-flex-shrink: 0;
    -ms-flex: 0 0 auto;
    flex-shrink: 0;
    width: 100%;
    height: 100%;
    position: relative;
}


/* Auto Height */

.swiper-container-autoheight,
.swiper-container-autoheight .swiper-slide {
    height: auto;
}

.swiper-container-autoheight .swiper-wrapper {
    -webkit-box-align: start;
    -ms-flex-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    -webkit-transition-property: -webkit-transform, height;
    -moz-transition-property: -moz-transform;
    -o-transition-property: -o-transform;
    -ms-transition-property: -ms-transform;
    transition-property: transform, height;
}


/* a11y */

.swiper-container .swiper-notification {
    position: absolute;
    left: 0;
    top: 0;
    pointer-events: none;
    opacity: 0;
    z-index: -1000;
}


/* IE10 Windows Phone 8 Fixes */

.swiper-wp8-horizontal {
    -ms-touch-action: pan-y;
    touch-action: pan-y;
}


/* Pagination Styles */

.swiper-pagination {
    position: absolute;
    text-align: center;
    -webkit-transition: 300ms;
    -moz-transition: 300ms;
    -o-transition: 300ms;
    transition: 300ms;
    -webkit-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    -o-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    z-index: 10;
}

.swiper-pagination.swiper-pagination-hidden {
    opacity: 0;
}


/* Common Styles */

.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-container-horizontal > .swiper-pagination-bullets {
    bottom: 10px;
    left: 0;
    width: 100%;
}


/* Bullets */

.swiper-pagination-bullet {
    width: 8px;
    height: 8px;
    display: inline-block;
    border-radius: 100%;
    background: #000;
    opacity: 0.2;
}

button.swiper-pagination-bullet {
    border: none;
    margin: 0;
    padding: 0;
    box-shadow: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -webkit-appearance: none;
    appearance: none;
}

.swiper-pagination-clickable .swiper-pagination-bullet {
    cursor: pointer;
}

.swiper-pagination-white .swiper-pagination-bullet {
    background: #fff;
}

.swiper-pagination-bullet-active {
    opacity: 1;
    background: #007aff;
}

.swiper-pagination-white .swiper-pagination-bullet-active {
    background: #fff;
}

.swiper-pagination-black .swiper-pagination-bullet-active {
    background: #000;
}

.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
    margin: 0 5px;
}


/* Progress */

.swiper-pagination-progress {
    background: rgba(0, 0, 0, 0.25);
    position: absolute;
}

.swiper-pagination-progress .swiper-pagination-progressbar {
    background: #007aff;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-transform: scale(0);
    -ms-transform: scale(0);
    -o-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: left top;
    -moz-transform-origin: left top;
    -ms-transform-origin: left top;
    -o-transform-origin: left top;
    transform-origin: left top;
}

.swiper-container-horizontal > .swiper-pagination-progress {
    width: 100%;
    height: 4px;
    left: 0;
    top: 0;
}

.swiper-container-vertical > .swiper-pagination-progress {
    width: 4px;
    height: 100%;
    left: 0;
    top: 0;
}

.swiper-pagination-progress.swiper-pagination-white {
    background: rgba(255, 255, 255, 0.5);
}

.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar {
    background: #fff;
}

.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar {
    background: #000;
}


/* Coverflow */

.swiper-container-coverflow .swiper-wrapper,
.swiper-container-flip .swiper-wrapper {
    /* Windows 8 IE 10 fix */
    -ms-perspective: 1200px;
}


/* Fade */

.swiper-container-fade.swiper-container-free-mode .swiper-slide {
    -webkit-transition-timing-function: ease-out;
    -moz-transition-timing-function: ease-out;
    -ms-transition-timing-function: ease-out;
    -o-transition-timing-function: ease-out;
    transition-timing-function: ease-out;
}

.swiper-container-fade .swiper-slide {
    pointer-events: none;
    -webkit-transition-property: opacity;
    -moz-transition-property: opacity;
    -o-transition-property: opacity;
    transition-property: opacity;
}

.swiper-container-fade .swiper-slide .swiper-slide {
    pointer-events: none;
}

.swiper-container-fade .swiper-slide-active,
.swiper-container-fade .swiper-slide-active .swiper-slide-active {
    pointer-events: auto;
}

.swiper-zoom-container {
    width: 100%;
    height: 100%;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    text-align: center;
}

.swiper-zoom-container > img,
.swiper-zoom-container > svg,
.swiper-zoom-container > canvas {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

@-webkit-keyframes swiper-preloader-spin {
    100% {
        -webkit-transform: rotate(360deg);
    }
}

@keyframes swiper-preloader-spin {
    100% {
        transform: rotate(360deg);
    }
}


/* 自定义样式*/

.swiper-container {
    width: 100%;
    height: 100%;
    .swiper-slide {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
    }
    .swiper-pagination-bullets {
        position: absolute;
        z-index: 30;
        left: 0;
        bottom: px2rem(30);
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .swiper-pagination-bullet {
            width: px2rem(10);
            height: px2rem(10);
            border-radius: px2rem(10);
            background: #000;
            margin: 0 px2rem(8);
            opacity: .4;
        }
        .swiper-pagination-bullet-active {
            width: px2rem(20);
            background-color: #FFD72D;
            border-radius: px2rem(8);
            opacity: 1;
        }
    }
}
</style>
