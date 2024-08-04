<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <input-ui @complete="inputComplete" type="dot" :tips="errorinfo">
                <p slot="title">请设置新的支付密码，用于支付验证</p>
            </input-ui>
        </div>
    </div>
</template>
<script>
import inputUi from 'components/input_ui/aym_input.vue'
// import store from 'src/store/vuex/password/index'
import {
    getEncryptedPsw
} from 'libs/util'
import { setPaypwd, resetPaypwd } from 'store/modules/password'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('password')

export default {
    name: 'confirmpwd',
    data() {
        return {
            barConfig: {
                h5: {
                    rightBtnShow: false
                },
                app: {
                    rightBtnShow: false
                }
            },
            errorinfo: ''
        }
    },
    computed: {
        ...mapState({
            storePwd: state => state.pwd
        }),
        type() {
            return this.$route.params.type
        },
        confirmPaypwd() {
            if (this.type === 'forget') {
                return resetPaypwd
            } else {
                return setPaypwd
            }
        }
    },
    mounted() {
        if (!this.storePwd) {
            this.goBack()
        }
        // clear tips
        this.saveErrorTip('')
    },
    methods: {
        ...mapMutations([
            'saveErrorTip'
        ]),
        inputComplete(code) {
            this.errorinfo = ''
            let encryPwdTwo = getEncryptedPsw(code)
            // 两次密码不同返回第一次密码输入
            if (encryPwdTwo != this.storePwd) {
                this.saveErrorTip('两次密码不同，请重新输入')
                this.goBack()
                return false
            }

            let params = {}
            if (this.type === 'forget') {
                params.newPwd = encryPwdTwo
            } else {
                params.pwd = encryPwdTwo
            }
            this.confirmPaypwd(params).then((res) => {
                if (res.success) {
                    this.$emit('pwdComplete', encryPwdTwo)
                } else {
                    this.errorinfo = res.resultDes
                    // code "7106","请不要出现身份证中的连续数字"
                    // code "7107","请不要使用连续或相同数字"
                    if (res.code === '7106' || res.code === '7107') {
                        setTimeout(() => {
                            this.goBack()
                        }, 2000)
                    }
                }
            })
        },
        goBack() {
            this.$router.go(-1)
        }
    },
    components: {
        inputUi
    }
}
</script>
