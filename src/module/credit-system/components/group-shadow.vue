<template>
    <div class="cells_shadow">
        <slot></slot>
    </div>
</template>
<style lang="scss" scoped>
@import 'src/style.scss';
.cells_shadow {
    box-shadow:0px 4px 28px 0px rgba(222,224,232,0.5);
    border-radius: px2rem(20);
    overflow: hidden;
    background-color: #fff;
}
</style>
