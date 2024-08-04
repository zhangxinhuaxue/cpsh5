<template>
    <div class="carousel">
        <div class="carousel-container">
            <div class="carousel-item" :class="{'animating': item.animating}" v-for="(item, index) in carouselData" :key="index"
            @click="toLink(item.url)"
            :style="{
                width: `${ width }px`,
                msTransform: `translateX(${ item.translateX }px)`,
                webkitTransform: `translateX(${ item.translateX }px)`,
                transform: `translateX(${ item.translateX }px)`
                }">
                {{item.text}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'carousel',
    props: {
        list: {
            type: Array,
            required: true,
            default: () => []
        },
        delay: {
            type: Number,
            default: 5000
        },
        stop: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            width: 0,
            carouselData: [],
            activeIndex: 0,
            timer: null,
            interval: 0
        }
    },
    mounted() {
        let hiddenProperty = ('hidden' in document) ? 'hidden' :
            'webkitHidden' in document ? 'webkitHidden' :
                'mozHidden' in document ? 'mozHidden' :
                    null
        let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange')
        this.width = this.getCarouselWidth()
        document.addEventListener(visibilityChangeEvent, () => {
            if (document[hiddenProperty]) {
                clearTimeout(this.timer)
            } else {
                this.run()
            }
        })
        this.init(this.list.slice(0))
    },
    watch: {
        activeIndex(newValue, oldValue) {
            let length = this.carouselData.length
            if (this.interval) {
                this.carouselData[(oldValue + length - 1) % length].translateX += this.width * length
            }
            this.carouselData.forEach((item, index) => {
                item.animating = index === (newValue + this.carouselData.length - 1) % this.carouselData.length || index === newValue
            })
            this.carouselData.forEach((item, index) => {
                item.translateX = item.translateX - this.width
            })
            this.interval++
        },
        stop(newValue, oldValue) {
            if (newValue) {
                clearTimeout(this.timer)
            }
        },
        list(newValue, oldValue) {
            this.init(newValue)
        }
    },
    methods: {
        init(list) {
            this.carouselData = []
            clearTimeout(this.timer)
            this.activeIndex = 0
            this.interval = 0
            if (list.length === 1) {
                list = [list[0], list[0], list[0]]
            } else if (list.length === 2) {
                list = [...list, ...list]
            }
            list.forEach((item, index) => {
                this.carouselData.push({
                    text: item.text,
                    url: item.url,
                    translateX: 0,
                    animating: false,
                    width: this.getCarouseItemWidth(item.text)
                })
            })
            this.carouselData.forEach((item, index) => {
                // item.translateX = this.carouselData.slice(0, index).reduce((tol, carouselItem) => {
                //     return tol + carouselItem.width
                // }, 0)
                item.translateX = this.width * index
            })
            if (this.carouselData.length > 1) {
                this.run()
            }
        },
        getCarouseItemWidth(text) {
            const tempCarouseItem = document.createElement('div')
            tempCarouseItem.textContent = text
            tempCarouseItem.style.display = 'inline-block'
            tempCarouseItem.style.visibility = 'hidden'
            tempCarouseItem.style.width = 'auto'
            tempCarouseItem.style['white-space'] = 'nowrap'
            document.querySelector('.carousel').parentNode.appendChild(tempCarouseItem)
            let width = tempCarouseItem.offsetWidth < this.width ? this.width : tempCarouseItem.offsetWidth * 1.2
            document.querySelector('.carousel').parentNode.removeChild(tempCarouseItem)
            this.width = this.width > width ? this.width : width
            return width
        },
        getCarouselWidth() {
            let ele = document.querySelector('.carousel')
            if (ele) {
                return ele.offsetWidth
            }
        },
        setActiveItem() {
            if (this.activeIndex < this.carouselData.length - 1) {
                this.activeIndex++
            } else {
                this.activeIndex = 0
            }
        },
        run() {
            let that = this
            clearTimeout(this.timer)
            this.timer = setTimeout(function() {
                that.setActiveItem()
                that.run()
            }, this.delay)
        },
        toLink(url) {
            if (url) {
                window.location.href = url
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.carousel{
    overflow-x:hidden;
    position:relative;
    width: 100%;
    height: 100%;
    // line-height: px2rem(36);
}
.carousel-container{
    position:relative;
    height: 100%;
}
.carousel-item{
    position:absolute;
    width: auto;
    height:100%;
    top:0;
    left:0;
    display:inline-block;
    overflow:hidden;
    z-index:0;
}
.animating{
    -webkit-transition:-webkit-transform 5s linear;
    transition:-webkit-transform 5s linear;
    transition:transform 5s linear;
    transition:transform 5s linear,-webkit-transform 5s linear;
}
</style>
