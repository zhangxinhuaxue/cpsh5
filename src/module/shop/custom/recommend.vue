<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div>
        <a @click="goUrl(remConfig.url0)">
            <axd-image :src="remConfig.imgUrl0"></axd-image>
        </a>
        <div class="rec-product">
            <a @click="goUrl(remConfig.url1)">
                <axd-image :src="remConfig.imgUrl1"></axd-image>
            </a>
            <a @click="goUrl(remConfig.url2)">
                <axd-image :src="remConfig.imgUrl2"></axd-image>
            </a>
            <a @click="goUrl(remConfig.url3)">
                <axd-image :src="remConfig.imgUrl3"></axd-image>
            </a>
        </div>
    </div>
</template>
<script>
import axdImage from 'src/components/image/index.vue'
import { getProductUrl } from 'src/libs/util'
export default {
    name: 'recProduct',
    props: {
        remConfig: Object
    },
    data() {
        return {
            // parentsName: '.aui-content'
        }
    },
    methods: {
        goUrl(id) {
            if (id) {
                window.location.href = getProductUrl(id)
            }
        }
    },
    components: {
        axdImage
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import 'src/assets/styles/flex.scss';

.rec-product {
    margin-top: px2rem(20);
    @include flexbox();
    a {
        @include flex(1);
        margin-left: px2rem(10);
        background-color: #fff;
        &:first-child {
            margin-left: 0;
        }
    }
}
</style>
