<template>
    <div class="sub-title">{{title}}</div>
</template>
<script>
export default {
    props: ['title']
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.sub-title{
    height: px2rem(78);
    font-size: px2rem(24);
    color: #999999;
    letter-spacing: 0;
    text-align: left;
    line-height: px2rem(78);
    padding-left: px2rem(32);
}

</style>
