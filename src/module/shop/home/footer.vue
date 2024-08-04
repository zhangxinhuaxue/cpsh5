<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <transition name="fade">
        <div class="aui-fixedbottom" v-if="show">
            <div class="footer-btn">
                <router-link :to="{name: 'groupList', params: {shopId}}"><span class="ico-group"></span>商品分类</router-link>
                <router-link :to="{name: 'shopContact', params: {shopId}}"><span class="ico-contact"></span>联系客服</router-link>
            </div>
        </div>
    </transition>
</template>
<script>
import { throttle } from '../common/assets/throttle'
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('shop')
export default {
    name: 'shopFooter',
    data() {
        return {
            elem: window,
            show: true,
            startPos: 0,
            diffPos: 0
        }
    },
    computed: {
        ...mapState({
            shopId: state => state.initShopData.shopId
        })
        // shopId() {
        //     return this.$store.state.initShopData.shopId
        // }
    },
    mounted() {
        this.eventHandler()
    },
    methods: {
        eventHandler() {
            let me = this
            document.addEventListener('touchstart', (e) => {
                me.startPos = e.touches[0].pageY
            }, false)
            document.addEventListener('touchmove', (e) => {
                let movePos = e.touches[0].pageY
                me.diffPos = movePos - me.startPos
            }, false)
            document.addEventListener('touchend', (e) => {
                me.startPos = 0
            }, false)
            this.$nextTick(function() {
                let elem = document.querySelector('.aui-content')
                me.elem = elem || window
                me.elem.addEventListener('scroll', throttle((e) => {
                    me.show = me.diffPos >= 0
                    // if (me.diffPos >= 0) {
                    //     me.show = true
                    // } else {
                    //     me.show = false
                    // }
                }, 100), false)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';

.footer-btn {
    @include flexbox();
    a {
        @include flex(1);
        text-align: center;
        position: relative;
        font-size: 0.68267rem;
        line-height: px2rem(100);
        color: $auiTextColorImportant;
        &:first-child:after {
            content: '';
            width: 1px;
            height: px2rem(48);
            position: absolute;
            right: 0;
            display: inline-block;
            border-right: 1px solid #e4e4e4;
            -webkit-transform-origin: 100% 100%;
            transform-origin: 100% 100%;
            -webkit-transform: scaleX(.5);
            transform: scaleX(.5);
            top: 50%;
            margin-top: px2rem(-24);
        }
    }
    span {
        display: inline-block;
        width: px2rem(42);
        height: px2rem(42);
        background-size: 100% auto;
        background-repeat: no-repeat;
        vertical-align: middle;
        margin-right: px2rem(14);
        &.ico-group {
            @include img2x('./img/icon-group');
        }
        &.ico-contact {
            @include img2x('./img/icon-contact');
        }
    }
}

.fade-enter-active {
    transition: all .1s ease;
}

.fade-leave-active {
    transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.fade-enter,
.fade-leave-active {
    transform: translateY(10px);
    opacity: 0;
}
</style>
