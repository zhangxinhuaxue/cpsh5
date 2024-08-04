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
@import './var.scss';
html,
body {
    height: 100%;
}

body {
    width: 16rem;
    margin: 0 auto;
    position: relative;
}
</style>
