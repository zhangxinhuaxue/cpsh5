<template>
    <div class="desc__box">
        <div class="desc__left">
            <slot name="left">
                {{leftText}}
            </slot>
        </div>
        <div class="desc__right">
            <slot name="right">
                {{rightText}}
            </slot>
        </div>
    </div>
</template>
<script>
export default {

    name: 'infoDesc',
    props: {
        leftText: [String, Number],
        rightText: [String, Number]
    },
    data() {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.desc__box {
    display: flex; // padding: px2rem(5) px2rem(32);
    font-size: px2rem(26);
    line-height: px2rem(37);
}

.desc__left {
    color: #999;
    flex: 1;
}

.desc__right {
    color: #222;
}
</style>
