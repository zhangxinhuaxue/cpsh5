<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <input-ui @complete="inputComplete" :code="false" :cardSize="cardSize" :tips="errorinfo">
                <p slot="title">请输入您的身份证以校验身份</p>
            </input-ui>
            <a href="javascript:;" class="aui-btn aui-btn_primary" @click="ckeckCard">下一步</a>
        </div>
    </div>
</template>
<script>
import inputUi from 'components/input_ui/aym_input.vue'
import { checkValidateCardLastFour, checkValidateID } from 'store/modules/password'
export default {
    name: 'IDcard',
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
            errorinfo: '',
            card: ''
        }
    },
    computed: {
        type() {
            return this.$route.params.type
        },
        checkCard() {
            if (this.type === 'forget') {
                return checkValidateID
            } else if (this.type === 'new') {
                return checkValidateCardLastFour
            }
            return false
        },
        cardSize() {
            if (this.type === 'forget') {
                return 20
            } else if (this.type === 'new') {
                return 4
            }
            return false
        }
    },
    mounted() {},
    methods: {
        inputComplete(data) {
            this.card = data.split(' ').join('')
        },
        ckeckCard() {
            this.errorinfo = ''
            let cardReg

            if (this.cardSize === 4) {
                cardReg = /^[A-Za-z\d]{4}$/
            } else {
                cardReg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
            }

            if (!this.card) {
                if (this.cardSize === 4) {
                    setTimeout(() => {
                        this.errorinfo = '请输入身份证号后4位'
                    }, 0)
                    return false
                } else {
                    setTimeout(() => {
                        this.errorinfo = '请输入身份证号'
                    }, 0)
                    return false
                }
            } else {
                if (!cardReg.test(this.card)) {
                    setTimeout(() => {
                        this.errorinfo = '身份证号码错误，请重新输入'
                    }, 0)
                    return false
                }
            }
            let params = {
                card: this.card
            }
            if (this.type === 'forget') {
                params.source = 'modifypaypwd'
            } else if (this.type === 'new') {
                params.source = 'setpaypwd'
            }
            this.checkCard(params).then((res) => {
                if (res.success) {
                    this.$router.replace({
                        name: 'setpwdcommon',
                        params: {
                            type: this.type
                        }
                    })
                } else {
                    this.errorinfo = res.resultDes
                }
            })
        }
    },
    components: {
        inputUi
    }
}
</script>
