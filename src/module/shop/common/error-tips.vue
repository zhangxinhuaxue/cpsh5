<template>
    <div class="mt200">
        <error-tip name="nonetwork">
            <p slot="title" class="page-empty_title">很抱歉，页面出错了</p>
        </error-tip>
    </div>
</template>
<script>
import errorTip from 'components/empty_ui/index.vue'
export default {
    name: 'error',
    components: {
        errorTip
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.mt200 {
    margin-top: px2rem(200);
}
</style>
