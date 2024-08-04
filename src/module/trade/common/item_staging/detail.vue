<!--  created by zhouqing -->
<template>
    <div class="aui-cell_auto">
        <div class="aui-cell__bd detail">
            <p>分期详情</p>
            <p class="mt10">
                <label>
                    首付金额：
                </label>
                <span class="detial__none" v-show="info.loading">...</span>
                <span class="detail__em" v-show="!info.loading"><em class="fs24">¥ </em>{{info.firstPayAmount|money}}</span>
            </p>
            <p>
                <label>
                    分期金额：
                </label>
                <span class="detial__none" v-show="info.loading">...</span>
                <span class="detail__em" v-show="!info.loading"><em class="fs24">¥ </em>{{info.stageAmount|money}}</span>
            </p>
            <p>
                <label>
                    每期应还：
                </label>
                <span class="detial__none" v-show="info.loading">...</span>
                <span class="detail__em detail__em--black" v-show="!info.loading">
                     <em class="fs24">¥ </em>{{info.monthPay|money}}X{{info.stageNum}}<em class="detail__em--small" v-if="showMianxi || checkedProductFreeInterestCode">免息</em><img v-if="checkedProductFreeInterestCode" :src="iconImg"> <!-- <span class="aui-tag_border">分{{info.stageNum}}期</span> -->
                </span>
            </p>
        </div>
    </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('trade/confirm')
export default {

    name: 'detail',
    props: ['info', 'showMianxi', 'checkedProductFreeInterestCode'],
    data() {
        return {
            iconImg: require('src/assets/images/icon_vip.svg')
        }
    },
    computed: {
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
em {
    font-style: normal;
}

.mt10 {
    margin-top: px2rem(10);
}

.fs24 {
    font-size: $auiFontSizeLevel7;
}

label {
    color: $auiTextColorAssistant;
}

.detial__none {
    font-size: px2rem(32);
    color: $auiTextColorAssistant;
}

.detail__em {
    color: $auiAttentionColor;
    font-size: px2rem(32);
    img {
        position: relative;
        top: px2rem(4);
        display: inline-block;
        width: px2rem(40);
        height: px2rem(28);
        margin-left: px2rem(4);
    }
}

.detail__em--black {
    color: #101010;
}

.detail__em--small {
    font-size: px2rem(24);
    margin: 0 px2rem(5) 0 px2rem(13);
}
</style>
