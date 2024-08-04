<template>
    <div class="contract">
        <span @click="$emit('change', !isAgree)">
        <span class="icon-check1" v-if="isAgree">
            <span class="path1"></span><span class="path2"></span>
        </span>
        <span class="icon-uncheck1" v-else></span>
        </span>我同意<a :href="contractUrl">《定金不退预售协议》</a>
    </div>
</template>
<script>
export default {

    name: 'presale-contract',
    model: {
        prop: 'isAgree',
        event: 'change'
    },
    props: {
        isAgree: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {}
    },
    computed: {
        contractUrl() {
            let env = this.isApp ? '/app' : '/h5'
            return env + '/user/contract/viewTemplate/CT181009691'
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.contract {
    font-size: px2rem(24);
    padding: 0 px2rem(30) px2rem(30);
    color: #999;
    a {
        color: #2CB5FC;
    }
}

.icon-check1 {
    span {
        font-size: px2rem(32);
    }
}

.icon-check1,
.icon-uncheck1 {
    margin-right: px2rem(8);
    font-size: px2rem(32);
    vertical-align: text-bottom;
}
</style>
