<template>
    <modal :show='show'>
        <div slot="title">{{title}}</div>
        <div slot="content">{{content}}</div>
        <div slot="buttons" class="aui-dialog__ft">
            <span class="aui-dialog__btn aui-dialog__btn_primary" v-on:click="onClick()">{{okText}}</span>
        </div>
    </modal>
</template>
<script>
import Modal from '../modal/index.vue'

export default {
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        title: {
            type: String,
            required: false,
            default: 'Alert'
        },
        content: {
            type: String,
            required: false,
            default: ''
        },
        okText: {
            type: String,
            required: false,
            default: 'OK'
        },
        onOk: {
            type: Function,
            required: false
        }
    },
    components: {
        Modal
    },
    methods: {
        onClick() {
            this.show = false
            if (this.onOk) {
                this.onOk()
            }
        }
    }
}
</script>
