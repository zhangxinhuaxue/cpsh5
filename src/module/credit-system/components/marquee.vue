<template>
    <div class="m-marquee">
        <ul class="m-marquee-box"
            ref="box"
            :style="{transform: `translate3d(0,${currenTranslateY}px,0)`, transition: `transform ${noAnimate ? 0 : duration}ms`}">
            <slot></slot>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'credit-marquee',
    props: {
        interval: {
            type: Number,
            default: 2000
        },
        duration: {
            type: Number,
            default: 300
        },
        direction: {
            type: String,
            default: 'up'
        },
        itemHeight: Number
    },
    data() {
        return {
            currenTranslateY: 0,
            height: '',
            length: 0,
            currentIndex: 0,
            noAnimate: false
        }
    },
    beforeDestroy() {
        this.destroy()
    },
    destroyed() {
        // console.log('destroyed')
    },
    methods: {
        destroy() {
            this.timer && clearInterval(this.timer)
        },
        init() {
            this.destroy()
            if (this.cloneNode) {
                this.$refs.box.removeChild(this.cloneNode)
            }

            this.cloneNode = null
            let firstItem = this.$refs.box.firstElementChild
            if (!firstItem) {
                return false
            }
            this.length = this.$refs.box.children.length
            this.height = this.itemHeight || firstItem.offsetHeight

            if (this.direction === 'up') {
                this.cloneNode = firstItem.cloneNode(true)
                this.$refs.box.appendChild(this.cloneNode)
            } else {
                this.cloneNode = this.$refs.box.lastElementChild.cloneNode(true)
                this.$refs.box.insertBefore(this.cloneNode, firstItem)
            }
            return true
        },
        start() {
            if (this.direction === 'down') this.go(false)
            this.timer = setInterval(() => {
                if (this.direction === 'up') {
                    this.currentIndex += 1
                    this.currenTranslateY = -this.currentIndex * this.height
                } else {
                    this.currentIndex -= 1
                    this.currenTranslateY = -(this.currentIndex + 1) * this.height
                }
                if (this.currentIndex === this.length) {
                    setTimeout(() => {
                        this.go(true)
                    }, this.duration)
                } else if (this.currentIndex === -1) {
                    setTimeout(() => {
                        this.go(false)
                    }, this.duration)
                } else {
                    this.noAnimate = false
                }
                this.$emit('notice', this.currentIndex)
            }, this.interval + this.duration)
        },
        go(toFirst) {
            this.noAnimate = true
            if (toFirst) {
                this.currentIndex = 0
                this.currenTranslateY = 0
            } else {
                this.currentIndex = this.length - 1
                this.currenTranslateY = -(this.currentIndex + 1) * this.height
            }
        }
    }
}
</script>
