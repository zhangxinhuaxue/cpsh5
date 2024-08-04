<!--
    Create by sunxj on 08/30/17
 -->
<template>
    <div>
        <div v-if="mobileList.length" class="aui-cells mt0">
            <router-link v-for="item in mobileList" :to="{name: 'virtualDetail', params: {productId: item.productId}}" class="aui-cell_auto aui-cell_textoverflow" :key="item.productId">
                <div class="aui-cell__hd cell-img_width"><img :src="item.imgThumb" alt=""></div>
                <div class="aui-cell__bd">
                    <p><span class="virtual-title">{{item.name}}</span><span v-if="item.discount && item.discount != 100" class="aui-tag_bgcolor virtual-tag_red">
{{item.discount | formatNum(10)}}折</span></p>
                    <p class="virtual-desc">{{item.content}}</p>
                </div>
            </router-link>
        </div>
        <vir-empty v-else></vir-empty>
    </div>
</template>
<script>
import virEmpty from './empty.vue'
export default {
    name: 'mobileList',
    props: {
        mobileList: Array
    },
    components: {
        virEmpty
    }
}
</script>
