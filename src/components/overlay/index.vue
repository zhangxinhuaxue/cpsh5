<template>
    <transition name="overlay">
        <div v-bind:class="'aui-mask ' + (transparent ? 'aui-mask_transparent' : '')" v-if="show" @click="click && click()" @touchmove.prevent></div>
    </transition>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false,
            required: true
        },
        click: {
            type: Function,
            default: undefined
        },
        transparent: {
            type: Boolean,
            default: false
        },
        opacity: {
            type: Number,
            default: 1
        }
    }
}
</script>
<style lang="scss" scoped>
.aui-mask_transparent {
    background-color: transparent;
}

.overlay-enter-active {
    display: block;
    opacity: 1;
}

.overlay-enter,
.overlay-leave-active {
    opacity: 0;
}
</style>