<template>
    <div class="aui-fixedbottom">
        <router-link :to="{ name: 'register' }">注册</router-link>
    </div>
</template>
<script>
export default {
    name: 'goRegister',
    data() {
        return {}
    }
}
</script>
<style lang="scss" scoped>
@import '../var.scss';
.aui-fixedbottom {
    border-top: 1px solid #e4e4e4;
    a {
        display: block;
        line-height: px2rem(135);
        text-align: center;
        font-size: px2rem(38);
        color: #666;
    }
}
</style>
