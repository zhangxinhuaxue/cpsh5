<template>
    <div class="aui-popup" :class="randomClass" @touchstart="getStartPos($event)" @touchmove.prevent="stopScroll($event)">
        <transition name="fade">
            <div class="aui-mask" @click="closePop()" v-show="isPop"></div>
        </transition>
        <transition name="slide-up">
            <div class="aui-popup_content" v-show="isPop">
                <slot name="content"></slot>
            </div>
        </transition>
    </div>
</template>
<script>
import {
    hideBottomMixin
} from '../popup/hidebottom'
import {
    modalPopup
} from './modalPopup'
export default {
    mixins: [hideBottomMixin, modalPopup],
    props: {
        isPop: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    data() {
        return {
            delayPop: false,
            page: ''
        }
    },
    watch: {
        isPop(to) {
            if (to) {
                this.hideFixedBar()
            } else {
                this.showFixedBar()
            }
        }
    },
    methods: {
        closePop() {
            this.$emit('cancel')
        },
        confirm() {
            this.$emit('complete')
        }

    }
}
</script>
<style lang="scss">
@import 'style.scss';
</style>
