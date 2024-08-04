<template>
    <div class="aui-toast aui-icon_loading" v-if="show">
        <i class="aui-loading"></i>
        <p class="aui-toast__content">{{message}}</p>
    </div>
</template>
<script>
export default {
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
        }
    }
}
</script>
