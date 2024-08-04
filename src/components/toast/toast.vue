<template>
<div class="toast">
    <overlay :show="show" :transparent="true" v-if="overlay"></overlay>
    <transition name="toast-pop">
    <div v-bind:class="'aui-toast '+customClass" v-if="show">
        <i v-bind:class="'toast-icon '+iconClass" v-if="iconClass !== ''"></i>
        <div class="aui-toast_txt" v-html="message"></div>
    </div>
    </transition>
</div>
</template>

<script type="text/babel">
import Overlay from '../overlay/index.vue'

export default {
    components: {
        Overlay
    },
    props: {
        message: String,
        className: {
            type: String,
            default: ''
        },
        position: {
            type: String,
            default: 'middle'
        },
        iconClass: {
            type: String,
            default: ''
        },
        overlay: {
            type: Boolean,
            default: true
        },
        duration: {
            type: Number,
            default: 3000
        },
        show: {
            type: Boolean,
            default: false,
            required: true
        }
    },
    methods: {
        click() {
            this.show = false
        }
    },
    computed: {
        customClass() {
            var classes = []
            switch (this.position) {
                case 'top':
                    classes.push('placetop')
                    break
                case 'bottom':
                    classes.push('placebottom')
                    break
                default:
                    classes.push('placemiddle')
            }
            classes.push(this.className)
            return classes.join(' ')
        }
    }
}
</script>

<style lang="scss" scoped>
   @import "toast.scss"
</style>
