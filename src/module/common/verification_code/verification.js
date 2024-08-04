import inputUi from 'components/input_ui/aym_input.vue'

let verifyCodeMixin = {
    data() {
        return {
            errorinfo: '',
            totalTime: 60,
            timing: '',
            isTiming: false
        }
    },
    computed: {
        codebtn() {
            return this.isTiming ? this.timing + 's后重新发送' : '获取验证码'
        }
    },
    methods: {
        getCode() {
            if (this.isTiming) {
                return false
            }
            // 发送验证码
            this.sendMsgCode()
        },
        countown() {
            this.timing = this.totalTime
            let timer = setInterval(() => {
                if (this.timing <= 0) {
                    clearInterval(timer)
                    this.isTiming = false
                    return
                }
                this.timing -= 1
                this.isTiming = true
            }, 1000)
        },
        inputComplete(code) {
            console.log(code)
            this.errorinfo = ''
            // 校验验证码
            this.executeCheck(code)
        }
    },
    components: {
        inputUi
    }
}
export { verifyCodeMixin }
