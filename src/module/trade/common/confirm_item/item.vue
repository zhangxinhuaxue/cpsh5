<template>
    <div>
        <div class="aui-cells aui-sells_format">
            <a class="aui-cell aui-cell_access" :class="{select:storeHasCoupon}" href="javascript:;" @click="showCouponPop">
                <div class="aui-cell__bd">
                    <p>红包</p>
                </div>
                <div class="aui-cell__ft">{{storeCouponText}}</div>
            </a>
            <template v-if="!$_isCheck">
                <div class="aui-cell_auto aui-cell_switch aui-cell--before-show" v-show="switchUse">
                    <div class="aui-cell__bd">
                        <p>
                            <span class="pro4">爱又米分期</span>
                            <span class="aui-tag_bgcolor" v-if="stageLabel.stageFreeStr">免息</span>
                            <span class="aui-tag_img" v-if="stageLabel.stageCorner" :style="{backgroundImage: 'url(' + stageLabel.stageCorner + ')'}"></span>
                        </p>
                        <p class="stage-label" v-if="stageLabel.stageDesc">{{stageLabel.stageDesc}}</p>
                    </div>
                    <div class="aui-cell__ft button-box">
                        <!-- @click="switchStage" v-show="!disableStage"  aui-switch-->
                        <input class="aui-switch" type="checkbox" v-model="storeStageChecked">
                        <span v-show="disableStage" class="maskblock " @click="getStageData('btn')"></span>
                    </div>
                </div>
                <a v-show="storeStageChecked" class="aui-cell aui-cell_access" :class="{select:storeStageText}" href="javascript:;" @click="showStagePop">
                <div class="aui-cell__bd">
                    <p>分期方案</p>
                </div>
                <div class="aui-cell__ft">{{storeStageText|stageTextFormat}}</div>
            </a>
                <detail v-show="storeStageText" :info="storeStageDetail"></detail>
            </template>
        </div>
        <popup :isPop="isPop" @complete="popSelect" @cancel="popCancel">
            <!-- <keep-alive> -->
            <components slot="content" :is="componentName" :popData="popData" @confirm="popSelect"></components>
            <!-- </keep-alive> -->
        </popup>
    </div>
</template>
<script>
// 只有虚拟确认页和实物商详页有 stageCorner stageDesc

import popup from 'components/popup/index.vue'
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex'

/* self */
import detail from 'module/trade/common/item_staging/detail.vue'
import {
    popMixin,
    couponMixin
} from 'module/trade/common/assets/pop'

export default {
    name: 'item',
    mixins: [popMixin, couponMixin],
    components: {
        popup,
        detail
    },
    methods: {
        ...mapMutations('trade/confirm', [
            'changeBottomTips',
            'CONFIRM_UPDATE_DATA'
        ])
        // popSelect(data) {
        //     this.popReset()
        //     if (data === 'coupon') {
        //         if (this.storeStageChecked) {
        //             this.getStageData('coupon')
        //             this.resetStageValue('coupon')
        //         } else if (this.finalPay === 0) {
        //             this.disableStage = true
        //         }
        //     }
        // }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

.button-box {
    position: relative;
}

.maskblock {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0; // opacity: 0.3;
    width: 2.176rem;
    height: 1.32267rem;
}

.stage-label {
    color: $auiAttentionColor;
    font-size: $auiFontSizeLevel7;
}

.aui-tag_img {
    display: inline-block;
    width: px2rem(300);
    height: px2rem(32);
    background-repeat: no-repeat;
    background-size: auto 100%;
    vertical-align: middle;
}

.pro4 {
    position: relative;
    top: px2rem(4);
}
</style>
