<template>
    <transition name="fade">
        <div>
            <router-view @pwdComplete="resetOver" class="view"></router-view>
        </div>
    </transition>
</template>
<script>
export default {
    name: 'setpwdBox',
    data() {
        return {}
    },
    computed: {},
    mounted() {},
    methods: {
        resetOver() {
            this.$router.go(-2)
        }
    }
}
</script>
<style lang="scss">
body {
    width: 16rem;
}
</style>
