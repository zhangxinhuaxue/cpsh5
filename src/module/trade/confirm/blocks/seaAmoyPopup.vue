<!--
    Created by hity on 09/06/17
-->
<template>
    <div>
        <div class="aui-popup__hd">
            <span class="icon-close1" @click="closePopup"></span>身份信息
        </div>
        <div class="aui-popup__ft">
            <a href="javascript:;" class="aui-btn_full" @click="confirm">确定</a>
        </div>
        <div class="aui-popup__bd">
            <div class="aui-cells">
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">姓名</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="text" placeholder="请输入姓名" v-model="recvName" maxlength="30" />
                    </div>
                </div>
                <div class="aui-cell">
                    <div class="aui-cell__hd">
                        <label class="aui-label">身份证号</label>
                    </div>
                    <div class="aui-cell__bd">
                        <input class="aui-input" type="text" placeholder="请输入身份证号" v-model="cardNumber" maxlength="18" />
                    </div>
                </div>
            </div>
            <p class="tips">请提供真实身份信息，否则无法清关，将导致下单失败</p>
        </div>
    </div>
</template>
<script>
import { addIdCard } from 'store/modules/trade/confirm'
import { AXD, testIdNum, testName } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('address')

export default {
    props: ['idCard'],
    data() {
        return {
            recvName: '',
            cardNumber: ''
        }
    },
    computed: {
        ...mapState({
            addrId: state => state.addrSelected.id,
            name: state => state.addrSelected.name
        })
    },
    watch: {
        name(newValue) {
            this.recvName = newValue
        }
    },
    mounted() {
        this.cardNumber = this.idCard
        this.recvName = this.name
    },
    methods: {
        ...mapMutations([
            'saveAddressItem'
        ]),
        closePopup() {
            this.$emit('cancel')
        },
        confirm() {
            if (!testName(this.recvName)) {
                this.$_toast('请输入正确的用户姓名')
                return false
            }
            if (!testIdNum(this.cardNumber)) {
                this.$_toast('请输入正确的身份证信息')
                return false
            }
            // 验证身份证
            addIdCard({
                recvName: this.recvName,
                deliverId: this.addrId,
                receIdentifyCard: this.cardNumber
            }).then(({ success, code, resultDes }) => {
                if (success) {
                    this.$emit('confirm')
                    this.$_toast('身份证验证成功')
                } else {
                    if (code === '-1999') {
                        AXD.util.login()
                        return
                    }
                    this.$_toast(resultDes)
                    if (code === '-2000') {
                        return
                    }
                }
                this.saveAddressItem({
                    name: this.recvName
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.aui-popup__bd {
    height: px2rem(593);
    background: #F7F7F7;

    .aui-cells {
        margin: 0 auto;
    }
}

.icon-close1 {
    position: absolute;
    top: px2rem(30);
    left: px2rem(32);
    font-size: px2rem(26);
    line-height: 120%;
}

.tips {
    text-align: center;
    margin-top: px2rem(50);
    font-size: px2rem(26);
    color: #F99E00;
    line-height: 120%;
}
</style>
