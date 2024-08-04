<!--
    Create by sunxj on 08/30/17
 -->
<template>
    <div class="virtual_empty">
        <empty-ui name="empty">
            <p slot="title" class="page-empty_title">暂时没有您搜索的物品</p>
        </empty-ui>
    </div>
</template>
<script>
import emptyUi from 'components/empty_ui/index.vue'
export default {
    name: 'virEmpty',
    data() {
        return {}
    },
    components: {
        emptyUi
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
.virtual_empty {
    padding-top: px2rem(200);
}
</style>
