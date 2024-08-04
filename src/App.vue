<template>
    <transition name="fade">
        <router-view class="view"></router-view>
    </transition>
</template>
<style lang="scss">
@import 'src/style.scss';
@import 'src/assets/styles/transition.scss';
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
