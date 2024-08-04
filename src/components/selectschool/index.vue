<template>
    <div class="select-school">
        <search @search="search" @searchSelect="searchSelect"></search>
        <scroll-list v-show="!isSearch" @scrollSelect="scrollSelect"></scroll-list>
    </div>
</template>
<script type="text/javascript">
import search from './search.vue'
import scrollList from './scrolllist.vue'
export default {
    name: 'school',
    data() {
        return {
            isSearch: false
        }
    },
    watch: {},
    created() {},
    beforeMount() {},
    mounted() {},
    methods: {
        search(isSearch) {
            this.isSearch = isSearch
        },
        searchSelect(item) {
            this.$emit('complete', item)
        },
        scrollSelect(item) {
            this.$emit('complete', item)
        }
    },
    components: {
        search,
        scrollList
    }
}
</script>
<style lang="scss" scoped>
@import 'src/assets/styles/rem.scss';
$designWidth: 750;
.select-school {
    width: 100%;
    height: 100%;
}

.select-school .search-wrap~.scroll-list {
    top: px2rem(100);
}
</style>
