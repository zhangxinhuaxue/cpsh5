<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div class="pages">
        <span>拉到底啦</span>
    </div>
</template>
<style lang="scss" scoped>
@import 'src/style.scss';
.pages {
    padding: px2rem(20);
    text-align: center;
    font-size: $auiFontSizeLevel7;
    color: $auiTextColorLight;
    span {
        padding: px2rem(16);
        position: relative;
        // &:before,
        // &:after {
        //     content: "";
        //     border-top: 1px solid $auiTextColorLight;
        //     position: absolute;
        //     top: 50%;
        //     width: px2rem(76);
        //     z-index: 3;
        //     -webkit-transform-origin: 0 0;
        //     transform-origin: 0 0;
        //     -webkit-transform: scaleY(.5);
        //     transform: scaleY(.5);
        // }
        // &:before {
        //     left: px2rem(-76);
        // }
        // &:after {
        //     right: px2rem(-76);
        // }
    }
}
</style>
