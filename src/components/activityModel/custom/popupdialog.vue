<template>
    <div class="dialog-bg" v-if="dialogConfig.show">
        <button v-on:click="close"></button>
        <div class="bg">
            <span>{{dialogConfig.title}}</span>
            <h1>{{dialogConfig.h1}}</h1>
            <p>{{dialogConfig.desc}}</p>

            <a v-on:click="dialogConfig.btnLeft.event"
                v-if="dialogConfig.btnLeft.show">{{dialogConfig.btnLeft.title}}</a>
            <a v-on:click="dialogConfig.btnRight.event"
                v-if="dialogConfig.btnRight.show">{{dialogConfig.btnRight.title}}</a>
        </div>
        <div class="bg-star" v-if="dialogConfig.showStar"></div>
    </div>
</template>

<script>
    export default {
        name: 'popup',
        props: {
            dialogConfig: Object
        },
        data() {
            return {
                dialogConfig: {
                    show: false,
                    showStar: false,
                    title: '邀好友',
                    h1: '没有可拆的福袋',
                    desc: '速去邀请好友获得福袋',
                    btnLeft: {
                        show: true,
                        title: '查看福袋',
                        event() {}
                    },
                    btnRight: {
                        show: true,
                        title: '继续领福袋',
                        event() {}
                    }
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
