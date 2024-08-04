<template>
    <transition name="fade">
        <router-view class="view"></router-view>
    </transition>
</template>
<script>
export default {
    name: 'app'
}
</script>
<style lang="scss">
.cc22 {
    color: #222;
}

.cc33 {
    color: #333;
}

.cccc {
    color: #ccc;
}

.mt45 {
    margin-top: px2rem(45);
}

.mb45 {
    margin-bottom: px2rem(45);
}

.mtb45 {
    margin: px2rem(45) auto;
}

img {
    border: 0;
    width: 100%;
    height: auto;
    display: block;
}

html,
body {
    height: 100%;
}

body {
    width: 16rem;
    margin: 0 auto;
    position: relative;
}

.segmentation {
    padding: px2rem(48) px2rem(45) px2rem(24);
    font-size: px2rem(34);
    color: #999;
}

.aui-protocol {
    font-size: px2rem(38);
    line-height: px2rem(140);
    padding-left: px2rem(60);
    color: #222;
    a {
        color: #76d0ff;
    }
}
</style>
