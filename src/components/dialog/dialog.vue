<template>
    <div>
        <overlay :show="show" :click="overlayClick"></overlay>
        <transition name="modal">
            <div class="aui-dialog" v-show="show">
                <div v-if="title" class="aui-dialog__hd"><strong class="aui-dialog__title">{{title}}</strong></div>
                <div class="aui-dialog__bd">{{content}}</div>
                <div class="aui-dialog__ft">
                    <a v-for="(item, index) in buttons" href="javascript:;" class="aui-dialog__btn" v-bind:class="btnClass(index)" @click="onClick(item)">{{item.text}}</a>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import Overlay from '../overlay/index.vue'
export default {
    name: 'axdDialog',
    data() {
        return {
            main: true
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        title: {
            type: String,
            required: false,
            default: '提示'
        },
        content: {
            type: String,
            required: false,
            default: ''
        },
        buttons: {
            type: Array,
            default: function() {
                return [{
                    text: '确定',
                    onClick: function() {
                        this.show = false
                    }
                }]
            }
        }
    },
    components: {
        Overlay
    },
    computed: {

    },
    methods: {
        close() {
            this.show = false
            return true
        },
        onClick(item) {
            this.show = false
            if (item.onClick) {
                item.onClick()
            }
        },
        overlayClick() {
            if (this.overlayClose) this.show = false
        },
        btnClass(index) {
            let main = (index + 1 == this.buttons.length)
            return {
                'aui-dialog__btn_primary': main,
                'aui-dialog__btn_default': !main
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';
.modal-enter-active {
    opacity: 1;
}

.modal-enter {
    transform: translate3d(-50%, -50%, 0) scale(0.815);
}

.modal-enter,
.modal-leave-active {
    opacity: 0;
}
</style>
