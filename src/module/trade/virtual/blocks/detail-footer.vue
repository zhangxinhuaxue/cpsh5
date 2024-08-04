<!--
 * @Description: 详情页公共footer
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-02-21 17:21:07
 * @LastEditors: sunxj
 -->
<template>
    <div class="aui-fixedbottom">
        <check-account :checkName="checkName"></check-account>
        <button class="aui-btn aui-btn_primary aui-btn_full" :class="{ 'disabled': disabled }" :disabled="disabled">立即充值</button>
    </div>
</template>
<script>
import checkAccount from './check-account.vue'
import { AXD } from 'src/libs/util'

export default {
    name: 'detail-footer',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        checkName: String
    },
    components: {
        checkAccount
    },
    methods: {}
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.disabled {
    color: #887323;
}
</style>
