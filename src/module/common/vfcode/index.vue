<template>
    <div>
        <input-ui @complete="complete" :tips="errorInfo" type="visible">
            <p slot="title">
                <slot name="title">
                    <h1 class="main-title">输入验证码</h1>
                    <div>已发送验证码至{{phone}}</div>
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
            type: String
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
            des: '获取验证码'
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
                            this.des = `重新发送(${time})`
                            if (!time) {
                                clearInterval(this.interval)
                                this.des = '获取验证码'
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
            this.pending = true
            this.$emit('getCode')
        }
    },
    components: {
        inputUi
    }
}
</script>
<style scoped lang="scss">
.main-title {
    color: #222222;
    font-size: px2rem(48);
    margin-bottom: px2rem(16);
}
</style>