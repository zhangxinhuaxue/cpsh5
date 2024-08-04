<template>
    <div class="aui-page">
        <hybrid-header :config="barConfig"></hybrid-header>
        <div class="aui-content">
            <div class="myStyle">
                <m-cell-group>
                    <m-input title="银行" readonly v-model="cardInfo.bankName" class="col_grey"></m-input>
                    <m-input title="卡号" type="tel" readonly v-model="cardInfo.cardNo" class="col_grey"></m-input>
                    <p class="tip">请确认您已在银行完成预留手机号变更</p>
                </m-cell-group>
                <m-cell-group>
                    <m-input title="手机号" placeholder="请输入银行卡预留手机号" type="tel" maxlength="13" v-model="goldForm.telephone">
                    </m-input>
                    <m-input title="验证码"

                        placeholder="请输入短信验证码"
                        maxlength="6"
                        v-model="goldForm.verifyCode">
                        <a v-if="canGetCode" slot="ft" href="javascript:;" class="smscode" @click="sendCode">{{getSmsCodeTxt}}</a>
                        <span v-else slot="ft" class="smscodeDis">{{getSmsCodeTxt}}</span>
                    </m-input>
                </m-cell-group>
                <m-button :disabled="btnflag" class="confirmBtn" @click="onSave">确认</m-button>
            </div>
        </div>
    </div>
</template>
<script>
import {getInfoByCardId, changeSendCode, saveChangeMobile} from 'store/modules/bankbind/bank'
export default {
    name: 'changePhone',
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
            setPop: true,
            getSmsCodeTxt: '获取验证码',
            goldForm: {
                bankcardId: '',
                telephone: '',
                token: '',
                verifyCode: ''
            },
            cardInfo: {}
        }
    },
    computed: {
        btnflag () {
            if (this.goldForm.telephone && this.goldForm.verifyCode && this.goldForm.verifyCode.length === 6) {
                return false
            } else {
                return true
            }
        },
        canGetCode () {
            // let telReg = /^1\d{10}$/
            // if (telReg.test(this.deleteSpace(this.goldForm.telephone)) && this.setPop) {
            //     return true
            // } else {
            //     return false
            // }
            return this.deleteSpace(this.goldForm.telephone).length && this.setPop
        }
    },
    watch: {
        'goldForm.telephone'(curVal, oldVal) {
            this.goldForm.telephone = curVal.replace(/\s/g, '').replace(/(^\w{3})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
        }
    },
    created (){
        this.getInfoByCardId()
    },
    methods: {
        getInfoByCardId() {
            getInfoByCardId({bankCardId: this.$route.query.bankCardId}).then(res => {  // 新接口待联调
                if (res.success) {
                    this.cardInfo = res.result
                    this.goldForm.bankcardId = res.result.id

                } else if (res.code === '-1999') {
                    AXD.util.login()
                }
            })
        },
        onSave() {
            if (this.goldForm.token) {
                let param = {
                    ...this.goldForm
                }
                param.telephone = this.deleteSpace(param.telephone)
                saveChangeMobile(param).then((res) => {
                    if (res.success) {
                        // 问产品更改手机号成功后的操作
                        this.$_toast('更换手机号成功', () => {
                            this.$router.go(-1)
                        })
                    } else {
                        if (res.code == '-1999') {
                            AXD.util.login()
                        } else { 
                            this.$_toast(res.resultDes)
                        }
                    }
                })
            } else {
                this.$_toast('请先获取验证码')
            }
        },
        sendCode() {
            let telReg = /^1\d{10}$/
            if (this.goldForm.telephone === '') {
                this.$_toast('请输入您的手机号码')
                return
            } else if (!this.regCheckTelNum(this.goldForm.telephone)) {
                this.$_toast('请输入有效手机号')
                return
            }
            let params = {
                bankcardId: this.cardInfo.id,
                telephone: this.deleteSpace(this.goldForm.telephone)
            }

            let time = 60

            changeSendCode(params).then((data) => {
                if (data.success) {
                    this.goldForm.token = data.result.token

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
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.tip {
    font-size: px2rem(24);
    color: #999999;
    padding: px2rem(24) 0 0 px2rem(32);
}
.smscode {
    font-size: px2rem(32);
    color: #4286FF;
}
.confirmBtn {
    margin-top: px2rem(100);

}
.col_grey {
    input {
        color: #ccc;
    }
}
.smscodeDis {
    font-size: px2rem(32);
    color: #cccccc;
}
// .myStyle {
//     .mui-btn_large.mui-btn_round {
//         border-radius: px2rem(4);
//     }
//     .mui-btn_primary {
//         border: none;
//         color: #fff;
//     }
//     .mui-btn_primary:active {
//         border: none;
//         color: #fff;
//     }
// }
</style>
