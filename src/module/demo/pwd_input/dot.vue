<template>
    <div class="aui-page">
        <div class="aui-content">
            <inputUi @complete="inputComplete" type="dot" :tips="errorinfo">
                <p slot="title">
                    已向 *** 发送哟啦啦啦啦
                </p>
                <a href="javascript:;">忘记密码</a>
            </inputUi>
        </div>
    </div>
</template>
<script>
import inputUi from 'components/input_ui/aym_input.vue'
export default {

    name: 'pwd_input',

    data() {
        return {
            errorinfo: ''
        }
    },
    components: {
        inputUi
    },
    methods: {
        inputComplete(code) {
            console.log(code)
            this.errorinfo = ''
            setTimeout(() => {
                this.errorinfo = +new Date() + ''
            }, 500)
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

</style>
