<!--
 * @Description: 输入的帐号展示提示
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-01-10 11:14:11
 * @LastEditors: sunxj
 -->
<template>
    <div class="page-account__check" :class="{'opacity': account}">{{checkName}}{{ account }}</div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('trade/virtual')
export default {
    name: 'account',
    props: {
        checkName: String
    },
    computed: {
        ...mapState({
            account: state => state.chargeAcm
        })
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page-account__check {
    position: absolute;
    bottom: px2rem(100);
    left: 0;
    height: 0;
    line-height: px2rem(70);
    background-color: #fff5d8;
    text-align: center;
    color: #f99e00;
    font-size: px2rem(28);
    width: 100%;
    padding: 0 px2rem(65);
    white-space: nowrap;
    text-overflow: ellipsis;
    opacity: 0;
    transition: opacity .4s linear .3s;
    overflow: hidden;
}

.opacity {
    opacity: 1;
    height: px2rem(70);
}
</style>
