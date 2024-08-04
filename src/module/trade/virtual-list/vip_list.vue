<!--
    Create by sunxj on 08/30/17
 -->
<template>
    <div>
        <div v-if="vipList.length" class="aui-cells mt0">
            <router-link class="aui-cell_auto aui-cell_access select aui-cell_textoverflow" v-for="item in vipList" :to="{name: 'virtualDetail', params: {productId: item.productId}}" :key="item.productId">
                <div class="aui-cell__hd cell-img_width"><img :src="item.imgThumb"></div>
                <div class="aui-cell__bd">
                    <p><span class="virtual-title">{{item.name}}</span><span v-if="item.discount && item.discount != 100" class="aui-tag_bgcolor virtual-tag_red">
{{item.discount | formatNum(10)}}折</span></p>
                    <p class="virtual-desc">{{item.content}}</p>
                </div>
                <div class="aui-cell__ft cc6">{{item.vprice | vPrice}}元/月</div>
            </router-link>
        </div>
        <vir-empty v-else></vir-empty>
    </div>
</template>
<script>
import virEmpty from './empty.vue'
import { formatComplexMoney } from 'src/libs/util'
export default {
    name: 'vipList',
    props: {
        vipList: Array
    },
    filters: {
        vPrice(price) {
            return formatComplexMoney(price)
        }
    },
    components: {
        virEmpty
    }
}
</script>
