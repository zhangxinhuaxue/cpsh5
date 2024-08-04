<template>
    <div>
        <input-ui @complete="complete" :tips="errorInfo" type="visible" @focusInput="focusInput">
            <p slot="title">
                <slot name="title">
                    <div class="title_text">请输入短信验证码，完成借款申请</div>
                    <div v-if="phone" class="title_tel">发送短信至{{phone}}</div>
                </slot>
            </p>
            <a href="javascript:;" @click="getCode">{{des}}</a>
        </input-ui>
    </div>
</template>
<script>
import inputUi from 'components/input_ui/aym_input.vue'
export default {
    props: {
        phone: {
            type: String,
            default: ''
        },
        waitTime: {
            type: Number,
            default: 60
        }
    },
    data() {
        return {
            errorInfo: '',
            pending: false,
            des: '未收到？重新获取'
        }
    },
    watch: {
        pending: {
            immediate: true,
            handler(newValue, oldValue) {
                if (newValue) {
                    let time = this.waitTime
                    this.interval = setInterval(() => {
                        if (time) {
                            time--
                            this.des = `${time}秒重新获取`
                            if (!time) {
                                clearInterval(this.interval)
                                this.des = '未收到？重新获取'
                                this.pending = false
                            }
                        }
                    }, 1000)
                }
            }
        }
    },
    created() {
        this.getCode()
    },
    beforeDestory() {
        clearInterval(this.interval)
    },
    methods: {
        /**
         * 提交验证码
         */
        complete(code) {
            this.$emit('complete', code)
        },
        /**
         * 获取验证码
         */
        getCode() {
            if (this.pending) {
                return false
            }
            this.$emit('getCode', (res) => {
                if (res) {
                    this.pending = true
                }
            })
        },
        focusInput() {
            this.$emit('focusInput')
        }
    },
    components: {
        inputUi
    }
}
</script>
<style lang="scss" scoped>
.title_text {
    font-size: px2rem(32);
    color: #333;
}
.title_tel {
    font-size: px2rem(28);
    color: #666;
}
</style>