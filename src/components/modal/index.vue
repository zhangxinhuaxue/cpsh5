<template>
    <div @touchmove.prevent>
        <overlay :show="show" :click="overlayClick"></overlay>
        <transition name="modal">
            <div :class="'aui-dialog ' + classes" v-if="show">
                <div class="aui-dialog__hd">
                    <strong class="aui-dialog__title">
                        <slot name="title"></slot>
                    </strong>
                </div>
                <div class="aui-dialog__bd">
                    <slot name="content"></slot>
                </div>
                <slot name="buttons"></slot>
            </div>
        </transition>
    </div>
</template>
<script>
import Overlay from '../overlay/index.vue'

export default {
    components: {
        Overlay
    },
    props: {
        show: {
            type: Boolean,
            required: true
        },
        classes: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        overlayClose: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        overlayClick() {
            if (this.overlayClose) this.show = false
        }
    }
}
</script>
<style lang="scss" scoped>
@import "modal.scss";
</style>
