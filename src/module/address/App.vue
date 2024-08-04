<!--
    Created by Doris on 05/09/17
-->
<template>
    <transition name="fade">
    	<keep-alive>
        	<router-view class="view"></router-view>
        </keep-alive>
    </transition>
</template>
<script>
export default {
    name: 'app'
}
</script>
<style lang="scss">
@import 'src/style.scss';
</style>
