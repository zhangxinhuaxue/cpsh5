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
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('password')
export default {
    name: 'setpwd',
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
            storeErrorTip: state => state.errorTip
        }),
        type() {
            return this.$route.params.type
        }
    },
    mounted() {
        this.savePwd('')
        this.errorinfo = this.storeErrorTip
    },
    methods: {
        ...mapMutations([
            'savePwd'
        ]),
        inputComplete(code) {
            let encryPwd = getEncryptedPsw(code)
            this.savePwd(encryPwd)
            this.$router.push({
                name: 'confirmpwdcommon',
                params: {
                    type: this.type
                }
            })
        }
    },
    components: {
        inputUi
    }
}
</script>
