<!--
    Created dongyusi on 07/2018
-->
<template>
    <div class="error">
        <div class="res-error"></div>
        <p class="res-title">{{msg}}</p>
        <m-button size="small" type="plain" @click="resubmit">重试</m-button>
    </div>
</template>
<script>
import {
    testTelphone,
    testChinese
} from 'src/libs/util'
import { appDownloadUrl } from 'libs/util'
export default {
    name: 'credit-error',
    props: {
        msg: '',
        resubmitParam: {
            type: Object
        }
    },
    data() {
        return {
            query: this.$route.query
        }
    },
    methods: {
        resubmit() {
            this.$router.replace({
                name: 'creditNotice',
                query: this.query
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.error {
    text-align: center;
    .res-title {
        width: px2rem(600);
        margin: px2rem(26) auto px2rem(50);
        font-size: $auiFontSizeLevel4;
        color: $auiTextColorAssistant;
    }
}

.res-error {
    width: px2rem(400);
    height: px2rem(340);
    margin: px2rem(250) auto 0;
    background: url('../assets/images/error.png') no-repeat center;
    background-size: 100%;
}
</style>
