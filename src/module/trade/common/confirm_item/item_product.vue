<!--  created by yangjun -->
<!-- 实物商品专用 -->
<template>
    <div class="confirm_fq">
        <div class="aui-cells aui-sells_format pb20">
            <a class="aui-cell aui-cell_access select" href="javascript:;" @click="showCoupon(-1)">
                <div class="aui-cell__bd">
                    <p>满减红包</p>
                </div>
                <div class="aui-cell__ft">{{storeCoupon.useEffect}}</div>
            </a>
        </div>
        <!--   <div class="aui-cells aui-sells_format pb20" v-if="!$_isCheck">
            <div class="aui-cell_auto aui-cell_switch aui-cell--before-show" v-show="switchUse">
                <div class="aui-cell__bd">
                    <p>
                        <span class="pro4">选择分期</span>
                        <span class="aui-tag_bgcolor" v-if="stageLabel.stageFreeStr">免息</span>

                    </p>
                </div>
                <div class="aui-cell__ft button-box">
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
            <detail v-show="storeStageText" :info="storeStageDetail" :showMianxi="showMianxi" :checkedProductFreeInterestCode="checkedProductFreeInterestCode"></detail>
        </div> -->
        <popup :isPop="isPop" @complete="popSelect" @cancel="popCancel">
            <components slot="content" :is="componentName" :popData="popData" @confirm="popSelect"></components>
        </popup>
    </div>
</template>
<script>
// 只有虚拟确认页和实物商详页有 stageCorner stageDesc
import { createNamespacedHelpers } from 'vuex'
import popup from 'components/popup/index.vue'
/* self */
import detail from 'module/trade/common/item_staging/detail.vue'
import {
    wholeCouponMixin,
    popMixin
} from 'module/trade/common/assets/pop_multi'
const { mapState, mapMutations } = createNamespacedHelpers('trade/confirm')

export default {
    name: 'itemForPhysicalgoods',
    mixins: [wholeCouponMixin, popMixin],
    components: {
        popup,
        detail
    },
    computed: {
        ...mapState({
            storeHasCoupon: state => state.hasWholeCoupon,
            showMianxi: state => state.showMianxi,
            checkedProductFreeInterestCode: state => state.checkedProductFreeInterestCode
        })
    },
    methods: {
        ...mapMutations([
            // 'changeBottomTips',
            // 'CONFIRM_UPDATE_DATA',
            'CONFIRM_INIT'
        ]),
        showCoupon(i) {
            // console.log(this.storeHasCoupon, '====show')
            // if (!this.storeHasCoupon) {
            //     return
            // }
            // console.log('全场红包点击')
            this.CONFIRM_INIT({
                couponForMerchantIndex: i
            })
            this.showCouponPop()
        }
    }
}
</script>
<style lang="scss">
@import 'src/style.scss';

.confirm_fq {
    background-color: #f2f2f2;
    padding-top: px2rem(20);
}

.button-box {
    position: relative;
}

.maskblock {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
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

.aui-cells.aui-sells_format.pb20 {
    padding-bottom: px2rem(20);
    margin-top: 0;
    background-color: #f7f7f7;

    .aui-cell,
    .aui-cell_auto {
        background-color: #fff;
    }
}
</style>
