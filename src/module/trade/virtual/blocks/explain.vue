<!--
 * @Description: 详情页的提示说明
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-01-10 11:15:24
 * @LastEditors: sunxj
 -->
<template>
    <div class="page-explain">
        <span>{{ config.name }}</span>
        <p v-html="config.content"></p>
    </div>
</template>
<script>
export default {
    name: 'explain',
    props: {
        config: Object
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.page-explain {
    padding: px2rem(32);
    color: #ccc;
    span {
        display: block;
        font-size: px2rem(26);
        margin-bottom: px2rem(14);
    }
    p {
        font-size: px2rem(24);
        line-height: 1.2em;
    }
}
</style>
