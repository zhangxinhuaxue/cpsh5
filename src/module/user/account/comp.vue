<template>
    <div class="result">
        <img class="result__image" :src="imgUrl" alt />
        <div class="result__title">{{title}}</div>
        <div class="result__subtitle" v-html="subTitle"></div>
        <div class="result__desc">{{desc}}</div>
        <m-button @click="$emit('click')">{{btnText}}</m-button>
    </div>
</template>
<script>
import { Button as mButton } from '@fe/buss-ui'

export default {
    name: 'account-comp',
    props: {
        imgUrl: String,
        title: String,
        subTitle: String,
        desc: String,
        btnText: String
    },
    data() {
        return {}
    },
    components: {
        mButton
    }
}
</script>
<style lang="scss" scoped>
.result {
    text-align: center;
    padding: px2rem(80) px2rem(32);
}

.result__image {
    display: inline-block;
    // width: auto;
}

.result__title {
    font-size: px2rem(36);
    font-weight: 600;
    color: #333;
    margin-bottom: px2rem(20);
}

.result__subtitle {
    font-size: px2rem(28);
    color: #333;
    margin-bottom: px2rem(80);
}

.result__desc {
    font-size: px2rem(28);
    color: #666;
    margin-bottom: px2rem(64);
}
</style>
