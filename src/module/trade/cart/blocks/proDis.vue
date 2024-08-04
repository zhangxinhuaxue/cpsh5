<!--
    失效均不可点，状态删除，展示商品详细信息
    edited by daly on 04/08/2018
 -->
<template>
    <div class="cart_proDis cart_list">
        <ul>
            <li v-for="pro in list">
                <span class="icon-disabled">失效</span>
                <a class="cartPro_content">
                    <axd-image :src="pro.imgUrl" :resizeW="180" :lazy="true" class="cartPro_imgWid"></axd-image>
                    <div class="cartPro_info">
                        <h3>{{pro.productName}}</h3>
                        <p class="type">{{pro.skuPropertiesName|filterDesc}}</p>
                        <p class="price">
                            <span>¥{{pro.price| formatNum}}</span>
                            <span>X{{pro.num}}</span>
                        </p>
                    </div>
                </a>
            </li>
        </ul>
        <div class="cart_proDis_btn">
            <span @click="showModal">清空失效宝贝</span>
        </div>
    </div>
</template>
<script>
import axdImage from 'components/image/index.vue'
import { AXD } from 'src/libs/util'
import { createNamespacedHelpers } from 'vuex'
const { mapMutations } = createNamespacedHelpers('trade/cart')
export default {
    name: 'cartDisabled',
    props: {
        list: Array
    },
    filters: {
        filterDesc(val) {
            if (!val) {
                return ''
            }
            return val.split(':')[1]
        }
    },
    methods: {
        getHref(id) {
            return '/pages/mall/product/' + id + '?_mark=cart'
        },
        showModal() {
            this.$emit('showDialog')
        }
    },
    components: {
        axdImage
    }
}
</script>
