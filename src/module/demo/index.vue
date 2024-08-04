<template>
    <div>
        <h1>Demo List!</h1>
        <router-link :to="{name:'toast'}" append>toast</router-link>
        <br>
        <router-link :to="{name:'picker1'}" append>picker by pinuts</router-link>
        <br>
        <router-link :to="{name:'multypicker'}" append>multypicker</router-link>
        <br>
        <router-link :to="{name:'pwd_dot'}" append>pwd_dot</router-link>
        <br>
        <router-link :to="{name:'pwd_text'}" append>pwd_text</router-link>
        <br>
        <router-link :to="{name:'pwd_demo'}" append>设置密码></router-link>
        <br>
        <router-link :to="{name:'callapp'}" append>app方法示例></router-link>
        <br>
    </div>
</template>
<script>
export default {
    name: 'app',
    filters: {},
    data() {
        return {}
    },
    computed: {},
    components: {},
    created() {},
    mounted() {

    },
    watch: {},
    methods: {}
}
</script>
<style lang="scss">
</style>
