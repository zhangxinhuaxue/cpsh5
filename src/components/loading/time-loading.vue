<template>
<div>
    <div v-if="show" :transparent="true" class="aui-mask_transparent"></div>
    <div class="aui-toast aui-icon_toast" v-if="show">
        <div class="aui-toast_area">
            <div class="aui-time">{{countdown}}</div>
            <div class="aui-loading"></div>
        </div>
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
        stop: {
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
        },
        during: {
            type: Number,
            default: 5
        }
    },
    data() {
        return {
            countdown: 0,
            interVal: null
        }
    },
    watch: {
        show(newValue, oldValue) {
            if (newValue) {
                this.countdown = this.during
                this.interval = setInterval(() => {
                    this.countdown--
                    if (!this.countdown) {
                        clearInterval(this.interval)
                        this.$emit('callback')
                    }
                }, 1000)
            }
        },
        stop(newValue, oldValue) {
            if (newValue && this.interval) {
                this.countdown = this.during
                clearInterval(this.interval)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.aui-toast_area{
    position: absolute;
    top: 0.46667rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2.83467rem;
    height: 2.83467rem;
}
.aui-icon_toast .aui-toast_area .aui-time{
    font-size: .53733rem;
    margin-top: 0.96667rem;
}
.aui-icon_toast .aui-toast_area .aui-loading {
    position: absolute;
    margin: 0;
    top: 0;
    left: 0;
    width: 2.83467rem;
    height: 2.83467rem;
}
.aui-toast .aui-toast__content {
    margin-top: 3.43467rem;
}
</style>
