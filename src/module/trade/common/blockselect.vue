<!--
    created by zhaozhisheng on 05/10/2017
 -->
<template>
    <div class="select_picker">
        <div :class="{'aui-cells': labels.needCells }">
            <a :class="['aui-cell', 'aui-cell_access', isDefault]" href="javascript:;" @click="showPopWindow">
                <div class="aui-cell__bd">
                    <p>{{labels.name}}</p>
                </div>
                <div class="aui-cell__ft"> {{contentFinal}}</div>
            </a>
        </div>
        <pop-picker :labels="labels" :objArr="objArr" @back="pickData" :popshow="showPop"></pop-picker>
    </div>
</template>
<script>
import popPicker from 'components/picker/poppicker.vue'
export default {
    props: {
        labels: {
            title: '',
            name: '',
            content: '',
            needCells: true
        },
        objArr: {
            type: Array
        },
        selected: {
            type: String
        }
    },
    watch: {
        objArr(val) {
            // 只有初始跟新数据的时候这里会触发，初始化数据
            this.currentIndex = 0
            this.currentContent = ''
            this.initSelected()
        }
    },
    data() {
        return {
            showPop: false,
            currentIndex: 0,
            currentContent: ''
        }
    },
    computed: {
        contentFinal() {
            return this.currentContent || this.labels.content
        },
        isDefault() {
            if (this.currentContent && this.currentContent != '没有可用选项') {
                return 'select'
            } else {
                return ''
            }
        }
    },
    components: {
        popPicker
    },
    mounted() {
        if (this.selected) {
            this.currentContent = this.selected
        }
        this.initSelected()
    },
    methods: {
        initSelected() {
            if (!this.objArr || !this.objArr.length) {
                this.currentContent = '没有可用选项'
            }
        },
        back(data) {
            this.$emit('back', data)
        },
        showPopWindow() {
            if (!this.objArr || !this.objArr.length) {
                return
            }
            this.showPop = true
        },
        closeCurrentPop() {
            this.showPop = false
        },
        selectRecord() {
            let index = this.currentIndex
            this.currentContent = this.objArr[index].name || this.objArr[index]
            let result = {
                index: this.currentIndex,
                content: this.objArr[index]
            }
            this.back(result)
            this.closeCurrentPop()
        },
        pickData(data) {
            if (data !== undefined) {
                this.currentIndex = data.index
                this.selectRecord()
            } else {
                this.closeCurrentPop()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import 'src/style.scss';
@import './assets/blockselect.scss';
</style>
