<!--
    Created by daly on 10/11/18
-->
<template>
    <div v-if="buyType=='npxe'&&list.length" class="on-sale aui-cell" @click="toNpxeActivity()">
        <span class="aui-tag_border">{{list[0].type}}</span>
        {{list[0].describe|limitString(40)}}
        <span class="com-more-icon more"></span>
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState('trade', {
            buyType: state => state.product.initData.trade.buyType,
            activityId: state => state.product.initData.activity.id,
            list: state => state.product.initData.activity.list
        })
    },
    methods: {
        toNpxeActivity() {
            window.location.href = '/activity/activity-npxe-main/index?activityId=' + this.activityId
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';

.on-sale {
    width: 100%;
    @include flexbox();
    @include flexVert();
    font-size: $auiFontSizeLevel5;
    color: $auiTextColorGeneral;

    .aui-tag_border {
        border-color: $auiAttentionColor;
        color: $auiAttentionColor;
        margin-right: px2rem(10);
    }
}
</style>
