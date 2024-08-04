<!--
    Created by hity on 05/15/17
-->
<template>
    <com-popup :isPop="isPopup" @cancel="closePopup">
        <template slot="content">
            <div class="aui-popup__hd">{{config.title}}</div>
            <div class="aui-popup__ft">
                <a v-if="!(exObj && exObj.txt)" href="javascript:;" class="aui-btn_full" @click="closePopup">确定</a>
                <a v-if="exObj && exObj.txt" href="javascript:;" class="aui-btn_full" @click="exObj.func">{{exObj.txt}}</a>
            </div>
            <div class="aui-popup__bd">
                <div class="config-container" v-if="config.contentHtml" v-html="config.contentHtml"></div>
                <components v-if="!config.contentHtml" :is="componentName" @closePopup="closePopup"></components>
            </div>
        </template>
    </com-popup>
</template>
<script>
import comPopup from 'components/popup/index.vue'
import axdSellPointPopup from '../content/sellPointPopup.vue'
import axdCouponPopup from '../content/attach/couponPopup.vue'
import axdInstalmentPopup from '../content/attach/instalmentPopup.vue'
import axdSpecPopup from '../content/specPopup.vue'
import axdAreaListPopup from '../content/areaListPopup.vue'

export default {
    props: ['config', 'exObj'],
    data() {
        return {
            isPopup: false
        }
    },
    components: {
        comPopup,
        axdSellPointPopup,
        axdInstalmentPopup,
        axdCouponPopup,
        axdSpecPopup,
        axdAreaListPopup
    },
    computed: {
        componentName() {
            let string = this.config.type
            string = string.substring(0, 1).toUpperCase() + string.substring(1)
            return 'axd' + string + 'Popup'
        }
    },
    methods: {
        closePopup() {
            this.isPopup = false
        }
    }
}
</script>
<style lang="scss" scoped>
    @import 'src/style.scss';
    .config-container {
        padding: px2rem(8) px2rem(32);
    }
</style>
