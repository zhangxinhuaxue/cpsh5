<!--
 * @Description: 红包列表
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-01-10 16:40:54
 * @LastEditors: sunxj
 -->
<template>
    <div class="aui-cell aui-cell_access" :class="{'select': coupon.hasCoupon}">
        <div class="aui-cell__bd">
            <p>{{title}}</p>
        </div>
        <div class="aui-cell__ft">{{coupon.useEffect}}</div>
    </div>
</template>
<script>
export default {
    name: 'comfirmConponCell',
    props: {
        title: {
            type: String,
            default: '红包'
        },
        coupon: {
            type: Object
        }
    }

}
</script>

<style>

</style>
