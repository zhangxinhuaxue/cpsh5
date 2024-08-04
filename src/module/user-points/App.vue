<template>
    <transition name="fade">
        <keep-alive include="pointsIndex,pointsExchangeList">
            <router-view class="view"></router-view>
        </keep-alive>
    </transition>
</template>
<script>
import { setEnvCookie } from 'libs/util'
export default {
    name: 'points',
    created() {
        setEnvCookie()
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';
$designWidth: 750;
@import './css/common.scss';

html,
body {
    height: auto;
}
body {
    width: 16rem;
    margin: 0 auto;
    background-color: #F8F8F8;
}
</style>
