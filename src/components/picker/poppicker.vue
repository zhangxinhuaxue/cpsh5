<!--
    created by zhaozhisheng on 06/13/2017
 -->
<template>
    <div class="aui-popup aui-popup_small" :class="randomClass" @touchmove.prevent>
        <transition name="fade">
            <div class="aui-mask" @click="back()" v-show="popshow"></div>
        </transition>
        <transition name="slide-up">
            <div class="aui-popup_content" id="auiContent" v-show="popshow">
                <div class="block_selected">
                </div>
                <div class="aui-popup__hd">
                    {{labels.title}}
                    <a href="javascript:;" class="icon_close_pop" @click="back()">
                        <span class="icon-close1"></span>
                    </a>
                </div>
                <div class="aui-popup__ft">
                    <a href="javascript:;" class="aui-btn_full" @click="selectRecord">确定</a>
                </div>
                <div class="aui-popup__bd" id="auiPopupBd">
                    <cell-picker :pickItemList="objArr" @select="pickData"></cell-picker>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import cellPicker from './cellpicker.vue'
import {
    hideBottomMixin
} from '../popup/hidebottom'
export default {
    mixins: [hideBottomMixin],
    props: {
        labels: {
            title: ''
        },
        objArr: {
            type: Array
        },
        selected: {
            type: String
        },
        popshow: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        objArr(val) {
            this.currentIndex = 0
        },
        popshow(curVal, oldVal) {
            if (curVal && !oldVal) {
                this.hideFixedBar()
            } else if (!curVal && oldVal) {
                this.showFixedBar()
            }
        }
    },
    data() {
        return {
            showPop: false,
            currentIndex: 0
        }
    },
    computed: {},
    components: {
        cellPicker
    },
    mounted() {},
    methods: {
        back(data) {
            this.$emit('back', data)
        },
        selectRecord() {
            let index = this.currentIndex
            let result = {
                index: index,
                content: this.objArr[index]
            }
            this.back(result)
        },
        pickData(data) {
            this.currentIndex = data.index
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';
$designWidth: 750;
#auiContent {
    height: px2rem(600);
}

#auiPopupBd {
    position: absolute;
    margin-bottom: 0;
}

.aui-popup__bd {
    -webkit-mask-box-image: linear-gradient(to top, transparent, transparent 5%, white 20%, white 80%, transparent 95%, transparent);
    overflow: hidden !important;
}

.icon_close_pop {
    position: absolute;
    width: px2rem(90);
    height: px2rem(90);
    left: px2rem(0);
    top: px2rem(0);
    .icon_close1 {
        font-size: px2rem(26);
        line-height: px2rem(90);
    }
}

.aui-cells {
    .aui-cell:hover,
    .aui-cell:visited,
    .aui-cell:link,
    .aui-cell:active {
        background-color: #fff;
    }
}

.icon-close1 {
    font-size: px2rem(32);
}

.block_selected {
    width: 100%;
    height: px2rem(80);
    position: absolute;
    left: 0;
    top: px2rem(260);
    background-color: transparent;
    &:before {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #e4e4e4;
        position: absolute;
        left: 0;
        top: 0;
        transform-origin: 0 0;
        transform: scaleY(0.8);
    }
    &:after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #e4e4e4;
        position: absolute;
        left: 0;
        bottom: 0;
        transform-origin: 0 100%;
        transform: scaleY(0.8);
    }
}

.aui-popup__hd {
    position: relative;
    font-size: px2rem(32);
    text-align: center;
    color: #666;
    line-height: px2rem(100);
    &:after {
        content: '';
        width: 100%;
        height: 1px;
        background-color: #f7f7f7;
        position: absolute;
        left: 0;
        bottom: 0;
        transform: scaleY(0.8);
    }
}

.aui-popup {
    position: fixed;
    // z-index: 100;
}

.aui-cell:first-child:before {
    display: block;
}


/* fade  slide-up */

.fade-in-enter-active {
    transition: all .3s ease;
}

.fade-in-enter {
    opacity: 0;
}

.slide-enter-active {
    transition: all .5s ease;
    -webkit-transform: translate(0, 0);
    transform: translate(0, 0);
}

.slide-enter {
    -webkit-transform: translate(30px, 0);
    transform: translate(30px, 0);
}

.slide-up-enter-active {
    transition: all .3s ease;
}

.slide-up-enter,
.slide-up-leave-active {
    transition: all .3s ease;
    -webkit-transform: translate(0, 100%);
    transform: translate(0, 100%);
}
</style>
