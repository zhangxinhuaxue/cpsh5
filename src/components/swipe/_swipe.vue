<template>
  <div v-bind:class="'slide-wrap '+ (transition && !touching ? 'transition' : '' )">
    <div class="slide-inner" v-bind:style="{ transform: 'translate3d('+translateX+'px, 0, 0)', transitionDuration:transtime}" >
      <slot></slot>
    </div>
    <div class="bullets">
        <div v-bind:class="'bullet '+ (currentPage === i ? 'active' : '')" v-for="i in amount"></div>
    </div>
  </div>
</template>

<script>
/* global DocumentTouch */
import SwipeItem from './swipe-item'

export default {
    props: {
        autoPlay: {
            type: Number,
            default: 0
        },
        lazy: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            currentPage: 1,
            width: 0,
            amount: 0,
            delta: 0,
            touching: false,
            startPos: 0,
            transition: false,
            translateX: 0,
            startTime: null,
            interval: null,
            slides: [],
            transtime: '.3s'
        }
    },
    components: {
        SwipeItem
    },
    methods: {

        _swipeStart(e) {
            this.touching = true
            this.startPos = this._getTouchPos(e)
            this.startTranslateX = this.translateX
            this.startTime = +new Date()

            clearInterval(this.interval)
        },
        _swipeMove(e) {
            if (!this.touching) {
                return false
            }
            e.preventDefault()

            this.delta = this._getTouchPos(e) - this.startPos
            this.translateX = this.startTranslateX + this.delta
            this.touching = true

            if (Math.abs(this.delta) > this.width / 2) {
                this._swipeEnd(e)
            }
        },
        _swipeEnd(e) {
            this.touching = false
            if (Math.abs(this.delta) < 15) {
                return
            }

            let time = +new Date() - this.startTime
            let isQuickAction = time < 200
            if (this.delta < -100 || (isQuickAction && this.delta < -15)) {
                this.next()
            } else if (this.delta > 100 || (isQuickAction && this.delta > 15)) {
                this.prev()
            } else {
                this._revert()
            }
            /* if (Math.abs(this.delta) >= this.width / 2 || // move long
                (Math.abs(this.delta) > 20 && time < 200) // or move shot but fast
            ) {
                if (this.delta < 0 && this.currentPage < this.amount) this.next()
                if (this.delta > 0 && this.currentPage > 0) this.prev()
            } */
            this.delta = 0
            this.transition = true
            this._setAutoPlay()
        },
        _setAutoPlay() {
            if (this.autoPlay <= 0) {
                return
            }
            clearInterval(this.interval)
            this.interval = setInterval(() => {
                this.next()
            }, this.autoPlay)
        },
        next() {
            var page = this.currentPage
            if (page < this.amount) {
                page++
                this.setPage(page)
            } else {
                this._revert(1)
            }
        },
        prev() {
            var page = this.currentPage
            if (page > 1) {
                page--
                this.setPage(page)
            } else {
                this._revert()
            }
        },
        _revert(index) {
            /* if (index) {
                this.currentPage = index
            } */
            if (index) {
                /* let firstSlide = this.slides.shift()
                this.slides.push(firstSlide)
                */
                this.transtime = '0s'
                this.$nextTick(function() {
                    this.translateX = this.$el.clientWidth
                    this.$nextTick(function() {
                        this.transtime = '.2s'
                        this.setPage(index)
                    })
                })
            } else {
                this.transtime = '0s'
                this.$nextTick(function() {
                    this.translateX = -(this.$el.clientWidth * this.slides.length)
                    this.$nextTick(function() {
                        this.transtime = '.3s'
                        this.setPage(this.slides.length)
                    })
                })
                // this.setPage(this.currentPage)
            }
        },
        setPage(page) {
            this.lastPage = this.currentPage
            this.currentPage = page
            // this.translateX = (-this.currentPage * 100 + this.delta/this.width * 100)+'%'
            /* this.translateX = -[].reduce.call(this.slides, function(total, el, i) {
                return i > page - 2 ? total : total + el.$el.clientWidth
            }, 0) */

            this.translateX = -(this.currentPage - 1) * this.$el.clientWidth
            this._onTransitionStart()
        },
        _point(e) {
            if (e.touches) {
                return {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY
                }
            } else {
                return {
                    x: e.pageX,
                    y: e.pageY
                }
            }
        },
        _getTouchPos(e) {
            return this._point(e).x
        },
        _onTransitionStart() {
        },
        _supportTouch() {
            return !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch))
        },
        _attachListner() {
            if (this._supportTouch()) {
                this.$el.addEventListener('touchstart', this._swipeStart)
                this.$el.addEventListener('touchmove', this._swipeMove)
                this.$el.addEventListener('touchend', this._swipeEnd)

                this.$el.addEventListener('mousedown', this._swipeStart)
                this.$el.addEventListener('mousemove', this._swipeMove)
                this.$el.addEventListener('mouseup', this._swipeEnd)
            }
        }
    },
    watch: {
        autoPlay(v, ov) {
            this._setAutoPlay()
        }
    },
    mounted() {
        this.width = this.$el.getBoundingClientRect().width
        this.slides = this.$children
        this.amount = this.slides.length
        this._setAutoPlay()
        this._attachListner()
    }
}
</script>

<style lang="scss" scoped>
    @import './swipe.scss';
</style>
