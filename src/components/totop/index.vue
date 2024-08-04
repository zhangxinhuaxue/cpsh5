<template>
    <transition name="fade">
        <div class="gotop" v-show="show" @click="goTop"></div>
    </transition>
</template>
<script type="text/javascript">
import hub from 'assets/js/hub'
export default {
    replace: true,
    data() {
        return {
            show: false,
            elem: window,
            scrollTop: 0,
            startPos: 0,
            gap: 0
        }
    },
    mounted() {
        let me = this
        this.enventHandler()
    },
    // beforeDestroy() {
    //     document.removeEventListener('touchstart')
    //     document.removeEventListener('touchmove')
    //     document.removeEventListener('touchend')
    //     this.elem.removeEventListener('scroll')
    // },
    methods: {
        enventHandler() {
            let me = this
            document.addEventListener('touchstart', function(event) {
                me.startPos = event.touches[0].pageY
            }, false)

            document.addEventListener('touchmove', function(event) {
                let movePos = event.touches[0].pageY
                me.gap = movePos - me.startPos
            }, false)
            document.addEventListener('touchend', function(event) {
                me.startPos = 0
            }, false)
            this.$nextTick(function() {
                let elem = document.querySelector('.aui-content')
                me.elem = elem == null ? window : elem
                me.elem.addEventListener('scroll', function(event) {
                    me.handleScroll()
                }, false)
            })
        },
        handleScroll() {
            let top = typeof this.elem.scrollTop == 'number' ? this.elem.scrollTop : this.elem.scrollY
            if (top > 200 && this.gap > 0) {
                this.show = true
            } else {
                this.show = false
            }
            this.scrollTop = top
        },
        goTop() {
            if (typeof this.elem.scrollTop == 'number') {
                this.elem.scrollTop = 0
            } else {
                this.elem.scrollTo(0, 0)
            }
            this.show = false
            hub.$emit('toTop')
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';




/*回到顶部*/

.gotop {
    color: #fff;
    width: px2rem(78);
    height: px2rem(78);
    position: fixed;
    right: px2rem(10);
    bottom: px2rem(150);
    z-index: 999;
    text-align: center;
    background: url('https://img.aiyoumi.com/null/2017622/180319528/20170622180319_78x78.png?height=78&width=78') no-repeat center center;
    background-size: 100% auto;
}

.fade-enter-active {
    transition: all .5s ease;
}

.fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.fade-enter,
.fade-leave-active {
    transform: translateY(10px);
    opacity: 0;
}
</style>
