<!--
    Create by sunxj on 10/10/17
 -->
<template>
    <div>
        <div class="aui-cells mt0">
            <router-link :to="{'name': 'topicProducts', params: {'id': tempid}}" class="aui-cell aui-cell_access">
                <div class="aui-cell__bd">
                    <p>{{name}}</p>
                </div>
                <div class="aui-cell__ft">
                </div>
            </router-link>
        </div>
        <productlist v-if="list&& list.length > 0" :dt="list"></productlist>
    </div>
</template>
<script>
import productlist from 'src/module/common/productList/index.vue'
export default {
    name: 'product',
    props: {
        productData: Object
    },
    data() {
        return {
            tempid: this.productData.id,
            name: this.productData.name,
            list: this.productData.productVoList
        }
    },
    created() {},
    components: {
        productlist
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.mt0 {
    margin-top: 0;
}

.mt20 {
    margin-top: px2rem(20);
}
</style>
