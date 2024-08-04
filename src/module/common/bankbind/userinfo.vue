<template>
    <div class="userinfo">
        <m-cell-group>
            <m-input title="姓名"
                size="middle"
                placeholder="请输入姓名"
                disabled="!nameEditable"
                v-model="editName">
            </m-input>
            <m-input title="身份证号"
                size="middle"
                placeholder="请输入身份证号"
                disabled="!userIDEditable"
                v-model="editUserID">
            </m-input>
            <m-cell is-link
                size="middle"
                title="银行"
                :value="bankName"
                placeholder="请选择银行"
                @click="modalBankShow = true">
            </m-cell>
            <m-input title="卡号"
                size="middle"
                placeholder="请填写银行卡号"
                type="tel"
                minlength="19"
                maxlength="26"
                v-model="editCardCode">
            </m-input>
        </m-cell-group>
        <m-cell-group>
            <m-input title="预留手机"
                size="middle"
                placeholder="请填写银行预留手机号"
                type="tel"
                 maxlength="13"
                v-model="editPhoneNum">
            </m-input>
        </m-cell-group>
        <m-button class="mt40" @click="complete">完成</m-button>
        <slot name="other"></slot>
        <supportbank :show="modalBankShow" :bankCode="bankCode" :oidBiz="oidBiz" @close="modalBankShow = false" @choose="chooseBank"></supportbank>
    </div>
</template>
<script>
import supportbank from './supportbankModal.vue'
export default {
    name: 'userInfo',
    data() {
        return {
            oidBiz: '',
            editName: '',
            editUserID: '',
            editPhoneNum: '',
            bankName: '',
            bankCode: '',
            editCardCode: '',
            nameEditable: true,
            userIDEditable: true,
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
    watch: {
        userInfo: {
            handler(curVal, oldValue) {
                this.resetForm()
            },
            deep: true
        },
        editUserID(curVal, oldVal) {
            if (curVal.length == 18 && oldVal.length == 17) {
                if (!this.regCheckID(curVal)) {
                    this.$_toast('请输入有效身份证号')
                }
            }
        },
        editPhoneNum(curVal, oldVal) {
            this.editPhoneNum = curVal.replace(/\s/g, '').replace(/(^\w{3})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')

            if (curVal.length == 13 && oldVal.length == 12) {
                if (!this.regCheckTelNum(curVal)) {
                    this.$_toast('请输入有效手机号')
                }
            }
        },
        editCardCode(curVal, oldVal) {
            this.editCardCode = curVal.replace(/\s/g, '').replace(/(^\w{4})(?=\w)/g, '$1 ').replace(/(\w{4})(?=\w)/g, '$1 ')
        }
    },
    mounted() {
        this.resetForm()
    },
    methods: {
        resetForm() {
            if (this.userInfo && this.userInfo.userName) {
                this.editName = this.userInfo.userName
                this.nameEditable = false
            }

            if (this.userInfo && this.userInfo.userID) {
                this.editUserID = this.parseStr(this.userInfo.userID)
                this.userIDEditable = false
            }

            if (this.userInfo && this.userInfo.phoneNum) {
                this.editPhoneNum = this.parseStr(this.userInfo.phoneNum)
            }

            if (this.userInfo && this.userInfo.cardCode) {
                this.editCardCode = this.parseStr(this.userInfo.cardCode)
            }
        },
        complete() {
            if (!this.editName) {
                this.$_toast('请输入用户名')
                return
            }

            if (!this.editUserID) {
                this.$_toast('请输入身份证号')
                return
            } else if (this.userIDEditable && !this.regCheckID(this.editUserID)) {
                this.$_toast('请输入有效身份证号')
                return
            }

            if (!this.editPhoneNum) {
                this.$_toast('请输入手机号')
                return
            } else if (!this.regCheckTelNum(this.editPhoneNum)) {
                this.$_toast('请输入有效手机号')
                return
            }

            if (!this.editCardCode) {
                this.$_toast('请输入银行卡号')
                return
            } else if (!this.regCheckCardCode(this.editCardCode)) {
                this.$_toast('请输入有效银行卡号')
                return
            }

            if (!this.bankName) {
                this.$_toast('请选择银行')
                return
            }

            let result = {
                userName: this.editName,
                userID: this.editUserID,
                phoneNum: this.deleteSpace(this.editPhoneNum),
                cardCode: this.deleteSpace(this.editCardCode)
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
        // 校验身份证号
        regCheckID(userID) {
            if (!(/(^\d{17}([0-9]|x)$)/.test(userID.toLowerCase()))) {
                return false
            }
            return true
        },
        // 选中银行
        chooseBank(item) {
            this.modalBankShow = false
            this.bankName = item.bankName
            this.bankCode = item.bankCode
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
// .userinfo {
//     .aui-btn_primary {
//         margin-top: px2rem(40);
//     }
//     .aui-cells_form {
//         margin-top: px2rem(20);
//     }
// }
.mt40 {
    margin-top: px2rem(40);
}
</style>
