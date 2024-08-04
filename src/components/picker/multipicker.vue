<!--
    created by zhaozhisheng on 06/13/2017
    考虑到移动端展示区域有限，组件最多支持三列picker。如需要更多，可以用cell-picker自行组装
    使用方法：
    <m-picker :slots="slots" :pickerTitle="pickerTitle" @closePicker="closePicker" @back="getData" @change="resetData" :popshow="dialogInfo.singleBtn"></m-picker>
    参数说明
    1、slots：传入的几列数据
    格式：
    this.slots = [{
        valueKey: 'provinceName', // 显示的key值
        dataList: provinces // 对象数组
    }, {
        valueKey: 'city',
        dataList: citys
    }, {
        valueKey: 'district',
        dataList: districts
    }]
    2、pickerTitle: picker头部文案
    3、@back：点击确定后返回的数据处理函数
    返回数据格式：
    {
        left: 0,  // 传入数组的index
        middle: 0,//
        right: 0  //
    }
    4、@change：每一列拖动停止时返回的数据处理函数
    返回数据格式：
    {
        index:2 // 当前停在的那一列的index
        slotIndex:0 //第几列
    }
    5、@popshow: 是否显示picker
    6、@closePicker：关闭picker
 -->
<template>
    <div class="aui-popup aui-popup_small" :class="randomClass">
        <transition name="fade">
            <div class="aui-mask" @click="close()" v-show="popshow"></div>
        </transition>
        <transition name="slide-up">
            <div class="aui-popup_content" id="auiContent" v-show="popshow">
                <div class="block_selected">
                </div>
                <div class="aui-popup__hd">
                    {{pickerTitle}}
                    <a href="javascript:;" class="icon_close_pop" @click="close()">
                        <span class="icon-close1"></span>
                    </a>
                </div>
                <div class="aui-popup__ft">
                    <a href="javascript:;" class="aui-btn_full" @click="selectRecord">确定</a>
                </div>
                <div class="aui-popup__bd" id="auiPopupBd">
                    <template v-for="(slot, index) in slots">
                        <cell-picker :slotIndex="index" :valueKey="slot.valueKey" :flexNum="flexNum" :pickItemList="slot.dataList" @select="pickData"></cell-picker>
                    </template>
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
        pickerTitle: {
            type: String,
            default: '请选择'
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
        },
        slots: {
            type: Array
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
        },
        slots(curVal) {
            console.log(curVal)
        }
    },
    data() {
        return {
            showPop: false,
            currentIndex: {
                left: 0,
                middle: 0,
                right: 0
            }
        }
    },
    computed: {
        flexNum() {
            let flexclass = 'flex'
            if (this.slots.length !== 1) {
                flexclass += this.slots.length
            }
            return flexclass
        }
    },
    components: {
        cellPicker
    },
    mounted() {},
    methods: {
        close() {
            this.$emit('closePicker')
        },
        selectRecord() {
            this.$emit('back', this.currentIndex)
        },
        pickData(data) {
            if (data.slotIndex == 0) {
                this.currentIndex.left = data.index
            } else if (data.slotIndex == 1) {
                this.currentIndex.middle = data.index
            } else if (data.slotIndex == 2) {
                this.currentIndex.right = data.index
            }
            this.$emit('change', data)
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
