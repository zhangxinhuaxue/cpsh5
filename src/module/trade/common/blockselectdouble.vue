<!--
    created by zhaozhisheng on 05/10/2017
 -->
<template>
    <div class="select_picker" :class="randomClass">
        <div :class="{'aui-cells': labels.needCells }">
            <a :class="['aui-cell', 'aui-cell_access', isDefault]" href="javascript:;" @click="showPopWindow">
                <div class="aui-cell__bd">
                    <p>{{labels.name}}</p>
                </div>
                <div class="aui-cell__ft"> {{contentFinal}}</div>
            </a>
        </div>
        <div class="aui-popup aui-popup_small" @touchmove.prevent>
            <transition name="fade">
                <div class="aui-mask" @click="closeCurrentPop" v-show="showPop"></div>
            </transition>
            <transition name="slide-up">
                <div class="aui-popup_content" id="auiContent" v-show="showPop">
                    <div class="block_selected">
                    </div>
                    <div class="aui-popup__hd">
                        {{labels.title}}
                        <a href="javascript:;" class="icon_close_pop" @click="closeCurrentPop">
                            <span class="icon-close1"></span>
                        </a>
                    </div>
                    <div class="aui-popup__ft">
                        <a href="javascript:;" class="aui-btn_full" @click="selectRecord">确定</a>
                    </div>
                    <div class="aui-popup__bd">
                        <aui-picker :flexNum="'flex2'" :pickItemList="formatedMainList" @select="pickDataLeft"></aui-picker>
                        <aui-picker :flexNum="'flex2'" :pickItemList="formatedSubList" @select="pickDataRight"></aui-picker>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<script>
import {
    hideBottomMixin
} from 'components/popup/hidebottom'
// import auiPicker from './auipicker'
import auiPicker from 'components/picker/cellpicker'
export default {
    mixins: [hideBottomMixin],
    props: {
        labels: {
            title: '',
            name: '',
            content: '',
            needCells: true,
            showMainBlock: true
        },
        selected: {
            name: '',
            subName: ''
        },
        ObjList: {
            type: Array
        }
    },
    watch: {
        ObjList(val) {
            // 只有初始跟新数据的时候这里会触发，初始化数据
            this.currentIndex = {
                left: 0,
                right: 0
            }
            this.currentContent = {
                name: '',
                subName: ''
            }
        }
    },
    data() {
        return {
            showPop: false,
            currentIndex: {
                left: 0,
                right: 0
            },
            currentContent: {
                name: '',
                subName: ''
            },
            formatedWholeArr: [],
            formatedSubList: [],
            formatedMainList: []
        }
    },
    computed: {
        contentFinal() {
            return ((this.labels.showMainBlock ? this.currentContent.name : '') + this.currentContent.subName) || this.labels.content
        },
        isDefault() {
            return this.currentContent.subName ? 'select' : ''
        }
    },
    components: {
        auiPicker
    },
    mounted() {
        if (this.ObjList && this.ObjList.length) {
            this.initDataList()
        }
        if (this.selected && (this.selected.name || this.selected.subName)) {
            this.currentContent.name = this.selected.name || ''
            this.currentContent.subName = this.selected.subName || ''
        }
    },
    methods: {
        back(data) {
            this.$emit('back', data)
        },
        initDataList() {
            let mainPro = ''
            let subPro = ''
            if (this.ObjList[0]) {
                for (var pro in this.ObjList[0]) {
                    if (typeof this.ObjList[0][pro] == 'string') {
                        mainPro = pro
                    } else {
                        subPro = pro
                    }
                }
            }

            let arr = []
            if (mainPro == 'name' && subPro == 'subName') {
                for (let i = 0; i < this.ObjList.length; i++) {
                    arr.push(this.ObjList[i][mainPro])
                }
                this.formatedWholeArr = this.ObjList
            } else {
                for (let i = 0; i < this.ObjList.length; i++) {
                    arr.push(this.ObjList[i][mainPro])

                    this.formatedWholeArr.push({
                        name: this.ObjList[i][mainPro],
                        subName: this.ObjList[i][subPro]
                    })
                }
            }
            if (!this.formatedWholeArr || !this.formatedWholeArr.length) {
                this.currentContent.subName = '没有可用选项'
                this.currentContent.name = ''
            }
            this.formatedMainList = arr
            this.formatedSubList = this.formatedWholeArr[this.currentIndex['left']].subName
        },
        showPopWindow() {
            if (!this.formatedWholeArr || !this.formatedWholeArr.length) {
                return
            }
            this.hideFixedBar()
            this.showPop = true
        },
        closeCurrentPop() {
            this.showFixedBar()
            this.showPop = false
        },
        selectRecord() {
            this.currentContent.name = this.formatedWholeArr[this.currentIndex['left']].name
            this.currentContent.subName = this.formatedWholeArr[this.currentIndex['left']].subName[this.currentIndex['right']]
            if (this.labels.showMainBlock) {
                this.back(this.currentContent)
            } else {
                this.back(this.currentContent.subName)
            }
            this.closeCurrentPop()
        },
        pickDataLeft(data) {
            let index = data.index
            this.currentIndex['left'] = index
            this.currentIndex['right'] = 0
            this.formatedSubList = this.formatedWholeArr[index].subName
        },
        pickDataRight(data) {
            console.log(data)
            let index = data.index
            this.currentIndex['right'] = index
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import './assets/blockselect.scss';
</style>
