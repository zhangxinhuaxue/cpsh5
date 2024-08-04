<template>
<div>
    <div v-if="show" :transparent="true" class="aui-mask_transparent"></div>
    <div class="aui-toast aui-icon_toast" v-if="show">
        <i class="aui-loading"></i>
        <p class="aui-toast__content">{{message}}</p>
    </div>
</div>
</template>
<script>
export default {
    name: 'aui-loading',
    props: {
        show: {
            type: Boolean,
            default: false,
            required: true
        },
        message: {
            type: String,
            required: false,
            default: '加载中...'
        },
        overlay: {
            type: Boolean,
            default: false
        }
    }
}
</script>
