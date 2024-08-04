<template>
    <div class="picker" :class="randomClass" @touchmove.prevent>
        <transition name="fade">
            <div class="aui-mask" v-show="isShow" @click="handleClose"></div>
        </transition>
        <transition name="slide-up">
            <div class="aui-picker" v-show="isShow">
                <div class="aui-picker__hd">
                    <a class="close" href="javascript:;" @click="handleClose">
                        <span class="icon-close1"></span>
                    </a>
                    <h3 v-text="title"></h3>
                </div>
                <div id="picker_p" class="aui-picker__bd" @mousedown="eventTransformer($event, 'touchStart')" @mousemove.prevent="eventTransformer($event, 'touchMove')" @mouseup="eventTransformer($event, 'touchEnd')" @touchstart="touchStart($event)" @touchmove.prevent="touchMove($event)" @touchend="touchEnd($event)">
                    <div class="aui-picker__group" v-for="(group,index) in groups" ref="groupArr">
                        <div class="aui-picker__mask"></div>
                        <div class="aui-picker__indicator" ref="indicator"></div>
                        <div class="aui-picker__content" ref="contentArr">
                            <div v-for="(item, index) in group.dataList" v-bind:class="index == 0 ? 'aui-picker__item_select' : ''" class="aui-picker__item">{{item | showName(group.name)}}</div>
                        </div>
                    </div>
                </div>
                <div class="aui-picker__ft">
                    <a href="javascript:;" class="aui-btn_full" @click="handleConfirm">确定</a>
                </div>
            </div>
        </transition>
    </div>
</template>
<script type="text/javascript">
import {
    hideBottomMixin
} from '../popup/hidebottom'
export default {
    name: 'picker',
    mixins: [hideBottomMixin],
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'picker'
        },
        contentTopvalue: {
            // content元素节点position top 值
            type: Number,
            default: -1
        },
        groups: {
            type: Array,
            default: () => {
                return []
            }
        },
        indexList: {
            type: Array,
            default: () => {
                return []
            }
        }
    },
    filters: {
        showName(item, name) {
            return typeof item === 'object' && item[name] ? item[name] : item
        }
    },
    data() {
        return {
            // contentHeightArr: content高度列表
            contentHeightArr: [],
            // content位置列表
            contentPosArr: [],
            // 滑动的时候,Y轴滑动距离
            moveDisY: 0,
            // 起始滑动的Y坐标
            startY: 0,
            // 当前活动的组
            curGroup: null,
            // 当前活动组索引
            curGroupIndex: 0,
            // 当前选中项索引列表
            selectItemsIndex: [],
            selectItemsStartIndex: [],
            // 当前活动list
            activeItemList: null,
            // content 可滑动最小距离列表
            endTopArr: [],
            // selectDataList: 选中的数据列表
            selectDataList: [],
            itemHeight: 0,
            isMouseDown: false
        }
    },
    watch: {
        isShow(to) {
            if (to) {
                this.hideFixedBar()
                this.$emit('init')
            } else {
                this.showFixedBar()
            }
        },
        groups(val, oldVal) {
            this.selectItemsIndex.forEach((item, index) => {
                let d = this.groups[index].dataList[item] || {}
                this.selectDataList.splice(index, 1, d)
            })
        },
        selectItemsIndex: {
            handler(curVal) {
                curVal.forEach((item, index) => {
                    if (item === 0) {
                        if (this.contentArr[index]) {
                            this.contentArr[index].style.top = 0 + 'px'
                            this.addClass(this.contentArr[index].children[0])
                        }
                    }
                })
            },
            deep: true
        },
        indexList: {
            handler(curVal) {
                this.selectItemsIndex = curVal.slice(0)
                this.initPosition(this.selectItemsIndex)
            },
            deep: true
        }
    },
    computed: {
        getItemHeight: function() {
            let i = this.getItem(this.$el.querySelectorAll('.aui-picker__item'))
            if (i !== null) {
                return parseFloat(this.getStyle(i, 'height'))
            } else {
                return 0
            }
        },
        selectHeight: function() {
            return parseFloat(this.getStyle(this.$el.querySelector('.aui-picker__item_select'), 'height'))
        },
        contentPaddingTop: function() {
            return parseFloat(this.getStyle(this.contentArr[0], 'paddingTop'))
        },
        // groupArr: 组列表
        groupArr: function() {
            return this.$refs.groupArr
        },
        // content列表
        contentArr: function() {
            return this.$refs.contentArr
        },
        indicatorStratLine: function() {
            return parseFloat(this.getStyle(this.$refs.indicator[0], 'top'))
        },
        selectPaddingTop: function() {
            return parseFloat(this.getStyle(this.groupArr[0].querySelector('.aui-picker__item_select'), 'paddingTop'))
        }

    },
    mounted() {
        this.$once('init', function() {
            if (this.contentArr) {
                this.contentArr.forEach(item => {
                    this.contentPosArr.push(0)
                })
            }
            this.$nextTick(() => {
                // 获取item高度
                this.itemHeight = this.getItemHeight
                if (this.indexList.length == 0) {
                    this.groups.forEach((item, index) => {
                        // 初始选中第一项
                        this.selectDataList.push(item.dataList[0])

                        // 初始选中项索引为0
                        this.selectItemsIndex.push(0)
                    })
                } else {
                    this.selectItemsIndex = this.indexList
                    this.initPosition(this.selectItemsIndex)
                }
            })
        })
    },
    methods: {
        eventTransformer(event, eventType) {
            if (!this.isMouseDown && (eventType === 'touchMove' || eventType === 'touchEnd')) {
                return
            }
            event.touches = [{
                pageY: event.clientY
            }]
            if (eventType === 'touchStart') {
                console.log('start')
                if (!this.isMouseDown) {
                    this.isMouseDown = true
                }
                this.touchStart(event)
            } else if (eventType === 'touchMove') {
                console.log('moving')
                this.touchMove(event)
            } else if (eventType === 'touchEnd') {
                console.log('over')
                this.touchEnd(event)
                this.isMouseDown = false
            }
        },
        initPosition(indexs) {
            for (let i = 0, len = indexs.length; i < len; i++) {
                let curPos = -this.itemHeight * indexs[i]
                this.contentArr[i].style.top = curPos + 'px'
                this.addClass(this.contentArr[i].children[indexs[i]])
                // debugger
            }
        },
        touchStart(e) {
            this.startY = e.touches[0].pageY
            this.curGroup = e.target.parentNode
            this.activeItemList = this.curGroup.querySelectorAll('.aui-picker__item')
            this.curGroupIndex = [].indexOf.call(this.curGroup.parentNode.children, this.curGroup)
            this.groupArr.forEach((item, index) => {
                let content = item.querySelector('.aui-picker__content')
                this.contentHeightArr[index] = parseFloat(this.getStyle(content, 'height'))
            })
            this.contentHeightArr.forEach((i, index) => {
                this.endTopArr[index] = -(i - this.selectHeight - this.contentPaddingTop)
            })

            // 获取item高度
            // this.itemHeight = this.getItemHeight
            this.contentPosArr.splice(this.curGroupIndex, 1, parseFloat(this.getStyle(this.contentArr[this.curGroupIndex], 'top')))
            this.selectItemsIndex.forEach((item, index) => {
                this.selectItemsStartIndex[index] = item
            })
        },
        touchMove(e) {
            this.moveDisY = e.touches[0].pageY - this.startY

            // 当前活动content位置
            let activeContentPos = this.contentPosArr[this.curGroupIndex] + this.moveDisY

            // 更新选中项索引
            this.selectItemsIndex[this.curGroupIndex] = Math.round(-activeContentPos / this.itemHeight)
            if (activeContentPos >= 0) {
                this.selectItemsIndex[this.curGroupIndex] = 0
            }
            if (activeContentPos <= this.endTopArr[this.curGroupIndex]) {
                this.selectItemsIndex[this.curGroupIndex] = this.activeItemList.length - 1
            }
            this.contentArr[this.curGroupIndex].style.top = activeContentPos + 'px'

            // 添加当前选中类名
            this.addClass(this.activeItemList[this.selectItemsIndex[this.curGroupIndex]])
        },
        touchEnd(e) {
            let activeContent = this.contentArr[this.curGroupIndex]
            let end = () => {
                // 触发更新数据, 通知父组件选择了哪一列的哪一项
                let selectData = this.groups[this.curGroupIndex].dataList[this.selectItemsIndex[this.curGroupIndex]]

                // 更新之前, 先清空当前列后面列的数据;  清空后的选中项索引为0
                for (let i = this.curGroupIndex, len = this.groups.length; i < len; i++) {
                    if (i <= this.curGroupIndex) {
                        continue
                    }
                    this.$set(this.selectItemsIndex, i, 0)
                }
                if (this.selectItemsStartIndex[this.curGroupIndex] !== this.selectItemsIndex[this.curGroupIndex]) {
                    this.$emit('update', {
                        'groupIndex': this.curGroupIndex,
                        'selectItemsIndex': this.selectItemsIndex[this.curGroupIndex],
                        'selectData': selectData
                    })
                }
            }
            if (this.selectItemsIndex[this.curGroupIndex] == 0) {
                this.animate(activeContent, 0, end)
            } else if (this.selectItemsIndex[this.curGroupIndex] == this.activeItemList.length - 1) {
                this.animate(activeContent, this.endTopArr[this.curGroupIndex], end)
            } else {
                this.animate(activeContent, -this.itemHeight * this.selectItemsIndex[this.curGroupIndex], end)
            }
        },
        animate(obj, endDis, callback) {
            // 动画执行时间给300ms
            let count = parseInt(300 / 30)
            let cur = parseFloat(this.getStyle(obj, 'top'))
            let startPis = cur
            let dis = endDis - cur

            // 每次执行move时 , startPis和dis 会被清空 , 保存startPis和dis的值
            obj.startPis = startPis
            obj.dis = dis
            obj.n = 0
            if (!obj.timer) {
                obj.timer = setInterval(() => {
                    obj.n += 1
                    let a = 1 - Math.pow(1 - obj.n / count, 3)
                    let cur = obj.dis * a + obj.startPis
                    obj.style.top = cur + 'px'
                    if (obj.n == count) {
                        clearInterval(obj.timer)

                        // 清空定时器，以便执行下次动画
                        obj.timer = null
                        callback && callback()
                    }
                }, 30)
            }
        },
        getStyle(obj, name) {
            if (obj) {
                if (obj.currentStyle) {
                    return obj.currentStyle[name]
                } else {
                    return window.getComputedStyle(obj, false)[name]
                }
            }
        },
        addClass(ele) {
            if (!ele) {
                return
            }
            let items = ele.parentNode.children
            for (let i = 0, len = items.length; i < len; i++) {
                items[i].className = 'aui-picker__item'
            }
            ele.className = 'aui-picker__item aui-picker__item_select'
        },
        getItem(nodeList) {
            let e = null
            for (let i = 0, l = nodeList.length; i < l; i++) {
                if (nodeList[i].className == 'aui-picker__item') {
                    e = nodeList[i]
                }
            }
            return e
        },
        handleClose(evt) {
            this.contentTop(this.contentTopvalue)
            this.$emit('close')
        },
        contentTop(value) {
            //  content TOP值全部为0
            if (this.contentTopvalue >= 0) {
                this.contentArr.forEach((item, index) => {
                    this.contentArr[index].style.top = 0 + 'px'
                    /**
                     * 将 .aui-picker__item_select
                     *  添加到 .aui-picker__content 的子节点
                     */
                    this.addClass(this.contentArr[index].children[0])
                    // 将 当前选中项索引列表 设置为 0
                    this.selectItemsIndex[index] = 0
                })
            }
        },
        handleConfirm(evt) {
            let selectDataList = []
            this.selectItemsIndex.forEach((item, index) => {
                if (this.groups[index]) {
                    let d = this.groups[index].dataList[item] || {}
                    // d.index = item
                    selectDataList.push(d)
                }
            })
            this.handleClose()
            this.$emit('confirm', selectDataList)
        }
    },
    components: {

    }
}
</script>
