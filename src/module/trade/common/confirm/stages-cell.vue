<!--
 * @Description: 选择分期 cell
 * @Author: sunxj
 * @Date: 2019-01-08 21:28:21
 * @LastEditTime: 2019-01-10 10:51:21
 * @LastEditors: Please set LastEditors
 -->
<template>
    <div v-if="!$_isCheck && switchUse">
        <div class="aui-cell_auto aui-cell_switch aui-cell--before-show">
            <div class="aui-cell__bd">
                <p>
                    <span class="pro4">选择分期</span>
                    <span class="aui-tag_bgcolor" v-if="storeStages.stageFreeStr">免息</span>
                    <!-- 只有虚拟确认页和实物商详页有 stageCorner stageDesc 注释 -->
                    <!-- <span class="aui-tag_img" v-if="stageLabel.stageCorner" :style="{backgroundImage: 'url(' + stageLabel.stageCorner + ')'}"></span> -->
                </p>
                <!-- <p class="stage-label" v-if="stageLabel.stageDesc">{{stageLabel.stageDesc}}</p> -->
            </div>
            <div class="aui-cell__ft button-box">
                <!-- @click="switchStage" v-show="!disableStage"  aui-switch-->
                <input class="aui-switch" type="checkbox" v-model="stageChecked">
                <span v-show="!stageChecked" class="maskblock " @click="showStage('btn')"></span>
            </div>
        </div>
        <a v-show="stageChecked" class="aui-cell aui-cell_access" :class="{select: storeStages.isSelect}" href="javascript:;" @click="showStage('pop')">
        <div class="aui-cell__bd">
            <p>分期方案</p>
        </div>
        <div class="aui-cell__ft">{{stagesText}}</div>
    </a>
        <stages-detail v-show="storeStages.isSelect" :info="storeStages.detail"></stages-detail>
    </div>
</template>
<script>
import stagesDetail from 'module/trade/common/item_staging/detail.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapStateCommon, mapMutations: mapMutationsCommon } = createNamespacedHelpers('trade/common')
export default {
    name: 'confirmStagesCell',
    props: {
        switchUse: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            ischeked: false,
            disableStage: true
        }
    },
    computed: {
        ...mapStateCommon({
            storeStageChecked: state => state.stageChecked,
            storeStages: state => state.stages
        }),
        stageChecked: {
            get() {
                return this.storeStageChecked
            },
            set(val) {
                this.SAVE_STAGECHECKED(val)
            }
        },
        stagesText() {
            return this.storeStages.isSelect ? `${this.storeStages.firstpayName}首付，分${this.storeStages.month}期` : '请选择分期方案'
        }
    },
    components: {
        stagesDetail
    },
    methods: {
        ...mapMutationsCommon([
            'SAVE_STAGECHECKED'
        ]),
        showStage(type) {
            this.$emit('showStage', type)
        }
    }
}
</script>
<style lang="scss" scoped>
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
