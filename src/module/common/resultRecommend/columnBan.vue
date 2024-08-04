<!--
    Create by sunxj on 08/09/17
 -->
<template>
    <div class="rec-product2" v-if="columnArr">
        <a v-for="item in columnArr" @click.stop.prevent="goUrl(item.url, $event)">
            <axd-image :src="item.img" :lazyParents="parentsName"></axd-image>
        </a>
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import {resetHeader} from 'components/header/resetHeader'
export default {
    name: 'column-ban',
    props: {
        columnArr: {
            type: Array
        }
    },
    data() {
        return {
            config: {
                useHeight: true
            },
            parentsName: '.aui-content'
        }
    },
    methods: {
        goUrl(url) {
            resetHeader()
            window.location.href = url
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import './style.scss';
.rec-product2 {
    a {
        display: block;
        margin-top: px2rem(20);
    }
}
</style>
