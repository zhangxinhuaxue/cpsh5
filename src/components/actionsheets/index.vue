<!--
    Created by Doris on 02/17
-->
<template>
    <div class="actionsheets">
        <transition name="fade">
            <div class="aui-mask" @click="closePop()" v-show="isPop"></div>
        </transition>
        <transition name="slide-up">
            <div class="aui-actionsheet" v-show="isPop">
                <div class="aui-actionsheet__title">
                    <slot name="title"></slot>
                </div>
                <div class="aui-actionsheet__menu">
                    <slot name="menu"></slot>
                </div>
                <div class="aui-actionsheet__ft">
                    <slot name="btn"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
export default {
    props: {
        isPop: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    data() {
        return {

        }
    },
    methods: {
        closePop() {
            this.$emit('complete')
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../popup/style.scss';
</style>
