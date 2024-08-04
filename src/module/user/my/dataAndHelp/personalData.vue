<template>
    <div class="aui-content">
        <div class="aui-cells">
            <div class="aui-cell">
                <div class="aui-cell__hd">
                    <label class="aui-label">姓名</label>
                </div>
                <div class="aui-cell__bd">
                    <input class="aui-input" type="text" disabled readonly v-model="infos.name">
                </div>
            </div>
            <div class="aui-cell">
                <div class="aui-cell__hd">
                    <label class="aui-label">身份证号</label>
                </div>
                <div class="aui-cell__bd">
                    <input class="aui-input" type="tel" disabled readonly v-model="infos.identifyCard">
                </div>
            </div>
            <div class="aui-cell">
                <div class="aui-cell__hd">
                    <label class="aui-label">手机号</label>
                </div>
                <div class="aui-cell__bd">
                    <input class="aui-input" type="tel" disabled readonly v-model="infos.telephone">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { myInfo } from 'src/store/modules/user'
import { AXD } from 'src/libs/util'
export default {
    name: 'personal',
    data() {
        return {
            infos: {
                name: '',
                identifyCard: '',
                telephone: ''
            }
        }
    },
    mounted() {
        let that = this
        myInfo().then(data => {
            if (data.success) {
                data = data.result
                for (let item in data) {
                    that.infos[item] = data[item] ? data[item] : ''
                }
            } else {
                if (data.code == '-1999' || data.code == '10010') {
                    AXD.util.login()
                } else {
                    this.$_toast(data.resultDes)
                }
            }
        })
    }
}
</script>
<style>
input:disabled,
input[disabled] {
    -webkit-opacity: 1;
    opacity: 1;
}
</style>
