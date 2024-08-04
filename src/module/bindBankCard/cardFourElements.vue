<template>
    <div class="userinfo">
        <m-cell-group>
            <m-cell is-link
                size="middle"
                title="银行"
                :value="bankName"
                placeholder="选择银行"
                @click="modalBankShow = true">
            </m-cell>
            <m-input title="卡号"
                size="middle"
                placeholder="请输入本人银行借记卡卡号"
                type="tel"
                ref="inputVal"
                minlength="19"
                maxlength="26"
                @focus="checkName"
                v-model="cardNumber">
            </m-input>
            <p class="errorTip">{{errorMsg}}</p>
        </m-cell-group>
        <m-cell-group>
            <m-input title="手机号"
                size="middle"
                placeholder="请输入银行卡预留手机号"
                type="tel"
                maxlength="13"
                @click="checkElement"
                v-model="phoneNum">
            </m-input>
            <m-input title="验证码"
                size="middle"
                placeholder="请输入短信验证码"
                 maxlength="6"
                v-model="smsCode">
                <a v-if="canGetCode" slot="ft" href="javascript:;" class="smscode" @click="onSendCode">{{getSmsCodeTxt}}</a>
                <span v-else slot="ft" class="smscodeDis">{{getSmsCodeTxt}}</span>
            </m-input>
        </m-cell-group>
        <m-button :disabled="btnflag" class="confirmBtn" @click="complete">确认</m-button>
        <slot name="other"></slot>
        <supportbank :show="modalBankShow" :bankCode="bankCode" :oidBiz="oidBiz" @close="modalBankShow = false" @choose="chooseBank"></supportbank>
    </div>
</template>
<script>
import supportbank from './supportbankModal'
import {bindCardValidate, sendCode} from 'store/modules/bankbind/bank'
import { AXD } from 'src/libs/util'

export default {
    name: 'userInfo',
    data() {
        return {
            isPass: false,
            token: '',
            setPop: true,
            getSmsCodeTxt: '获取验证码',
            errorMsg: '',
            bankNameFlag: true, // 当银行选择过才可输入
            elementFlag: true, // 当银行和卡号都输入过才可以输入
            smsCode: '',
            oidBiz: '',
            phoneNum: '',
            bankName: '',
            bankCode: '',
            cardNumber: '',
            modalBankShow: false
        }
    },
    props: {
        userInfo: {
            type: Object
        }
    },
    components: {
        supportbank
    },
    computed: {
        btnflag () {
            let telReg = /^1\d{10}$/
            if (this.bankName && this.regCheckCardCode(this.cardNumber) && telReg.test(this.deleteSpace(this.phoneNum)) && this.smsCode.length == 6 && this.token) {
                return false
            } else {
                return true
            }
        },
        canGetCode () {
            if (this.bankName && this.cardNumber && this.phoneNum && this.setPop) {
                return true
            } else {
                return false
            }
        }
    },
    watch: {
        userInfo: {
            handler(curVal, oldValue) {
                // this.resetForm()
            },
            deep: true
        },
        phoneNum(curVal, oldVal) {
            this.phoneNum = curVal.replace(/\s/g, '').replace(/(^\w{3})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
        },
        cardNumber(curVal, oldVal) {
            this.cardNumber = curVal.replace(/\s/g, '').replace(/(^\w{4})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
            if (curVal.length >= 7 && curVal.substring(0, 7) !== oldVal.substring(0, 7)) {
                this.checkBin()
            }
            if (!curVal) {
                this.errorMsg = ''
            }
        }
    },
    methods: {
        checkBin() {
            // 当卡号大于等于6位时去做卡bin校验
            let bankcardNo = this.cardNumber.replace(/\s*/g,'')
            if (bankcardNo.length < 6){
                return
            }
            this.errorMsg = ''
            bindCardValidate({
                bankcardNo,
                bankCode: this.bankCode
            }).then((res) => {
                if (res.success) {
                    this.isPass = res.result.isPass
                } else {
                    if (res.code == '-1999') {
                        AXD.util.login()
                    } else if (res.code == '20905') {
                        this.errorMsg = '抱歉，该银行暂不支持绑卡，详情请查看【支持银行列表】'
                    } else {
                        this.errorMsg = res.resultDes
                    }
                    this.isPass = false
                }
            })
        },
        checkName() {
            if (!this.bankName) {
                this.$_toast('请选择银行')
                return false
            }
            this.bankNameFlag = false
            this.$refs.inputVal.focus()
        },
        checkElement() {
            if (!this.bankName) {
                this.$_toast('请选择银行')
            } else if (!this.cardNumber) {
                this.$_toast('请输入银行卡号')
            } else {
                this.elementFlag = false
            }
        },
        onSendCode() {
            if (!this.regCheckCardCode(this.cardNumber)) {
                this.$_toast('请检查银行卡号后重新输入')
                return
            } else {
                if (!this.isPass) {
                    this.checkBin()
                } else {
                    let time = 60
                    let params = {
                        telephone: this.deleteSpace(this.phoneNum),
                        bankcardNo: this.deleteSpace(this.cardNumber),
                        source: '9'
                    }
                    if(!/^1\d{10}$/.test(params.telephone)){
                        this.$_toast('请输入有效手机号')
                        return
                    }
                    sendCode(params).then((data) => {
                        if (data.success) {
                            this.token = data.result.token

                            this.setPop = false
                            var timer = setInterval(() => {
                                time--

                                this.getSmsCodeTxt = `重新获取(${time})`
                                if (time === 0) {
                                    this.getSmsCodeTxt = '重发验证码'
                                    this.setPop = true

                                    clearInterval(timer)
                                }
                            }, 1000)
                        } else {
                            this.$_toast(data.resultDes)
                        }
                    })
                }
            }
        },
        // 当更换手机号页面时，银行卡信息赋值
        resetForm() {
            if (this.userInfo && this.userInfo.phoneNum) {
                this.phoneNum = this.parseStr(this.userInfo.phoneNum)
            }

            if (this.userInfo && this.userInfo.cardCode) {
                this.cardNumber = this.parseStr(this.userInfo.cardCode)
            }
        },
        complete() {
            let result = {
                bankName: this.bankName,
                cardCode: this.deleteSpace(this.cardNumber),
                phoneNum: this.deleteSpace(this.phoneNum),
                smsCode: this.smsCode,
                token: this.token
            }
            this.$emit('complete', result)
        },
        // 转成字符串，以便后面的处理
        parseStr(str) {
            return typeof str === 'number' ? str.toString() : str
        },
        // 删除空格
        deleteSpace(str) {
            return str.split(' ').join('')
        },
        // 校验电话号
        regCheckTelNum(telNum) {
            telNum = this.deleteSpace(telNum)
            if (!(/^1\d{10}$/.test(telNum))) {
                return false
            }

            return true
        },
        // 校验银行卡号，银行卡号最短16位，最长21位纯数字
        regCheckCardCode(cardCode) {
            let temp = this.deleteSpace(cardCode)
            if (!(/^\d{16,21}$/.test(temp))) {
                return false
            }
            return true
        },

        // 选中银行
        chooseBank(item) {
            this.modalBankShow = false
            this.bankName = item.bankName
            this.bankCode = item.bankCode
            this.checkBin()
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.confirmBtn {
    margin-top: px2rem(100);

}
.smscode {
    font-size: px2rem(32);
    color: #4286FF;
}
.smscodeDis {
    font-size: px2rem(32);
    color: #cccccc;
}
.errorTip {
    font-size: px2rem(28);
    color: #ff3e00;
    padding-left: px2rem(206);
    padding-top: px2rem(16);
}
::v-deep .mui-icon {
    color: #4286FF;
}
</style>
