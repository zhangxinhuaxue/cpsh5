<!--
    created by zhaozhisheng on 06/09/2017
 -->
<template>
    <div class="picker-cell" :class="flexNum">
        <div ref="pickerMask" class="picker-mask"
            @mousedown="eventTransformer($event, 'touchStart')"
            @mousemove.prevent="eventTransformer($event, 'touchMove')"
            @mouseup="eventTransformer($event, 'touchEnd')"
            @touchmove.prevent="touchMove($event)"
            @touchstart.prevent="touchStart($event)"
            @touchend.prevent="touchEnd($event)"></div>
        <div ref="pickerWrapper" :class="['picker-wrapper',{'picker-item_draging':isDraging}]" :style="{'transition-timing-function': 'ease-out', 'transform': 'translate(0px, ' + curMoveDistance  + 'px) translateZ(0px)'}">
            <template v-for="(item,index) in pickItemList">
                <div ref="pickerItem" :class="['picker-item', alignClass, {'picker-item_active' : index == currentIndex}]">
                    {{item | showItem(valueKey)}}
                </div>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        pickItemList: {
            type: Array
        },
        selectedItem: {
            type: String,
            default: ''
        },
        valueKey: {
            type: String,
            default: 'name'
        },
        flexNum: {
            type: String,
            default: 'flex' // flex flex2 flex3
        },
        align: {
            type: String,
            default: 'center' // left center right
        },
        slotIndex: {
            type: Number,
            default: 1
        }
    },
    filters: {
        showItem(item, valueKey) {
            return typeof item === 'object' && item[valueKey] ? item[valueKey] : item
        }
    },
    watch: {
        pickItemList(val) {
            this.currentIndex = 0
            this.startY = 0
            this.startTime = 0
            this.startIndex = 0
            this.curMoveDistance = 0
            this.startMoveDistance = 0
        }
    },
    data() {
        return {
            currentIndex: 0,
            startY: 0,
            startTime: 0,
            startIndex: 0,
            curMoveDistance: 0,
            startMoveDistance: 0,
            isDraging: false,
            isMouseDown: false
        }
    },
    computed: {
        heightParams() {
            let a = this.pickItemList
            let unitRecords = this.$refs.pickerItem
            let uHeight = 0

            // 这里length一定大于0，小于0的时候不会弹出popup
            if (unitRecords.length === 1) {
                uHeight = unitRecords[0].offsetHeight
            } else if (unitRecords.length === 2) {
                uHeight = Math.min(unitRecords[0].offsetHeight, unitRecords[1].offsetHeight)
            } else {
                uHeight = Math.min(Math.min(unitRecords[0].offsetHeight, unitRecords[1].offsetHeight), unitRecords[2].offsetHeight)
            }

            return {
                unitHeight: uHeight,
                wrapperHeight: this.$refs.pickerWrapper.offsetHeight,
                maskHeight: this.$refs.pickerMask.offsetHeight
            }
        },
        alignClass() {
            return 'text_' + this.align
        }
    },
    components: {},
    mounted() {},
    methods: {
        eventTransformer(event, eventType) {
            if (!this.isMouseDown && (eventType === 'touchMove' || eventType === 'touchEnd')) {
                return
            }
            event.touches = [{
                pageY: event.clientY
            }]
            event.changedTouches = [{
                pageY: event.clientY
            }]
            if (eventType === 'touchStart') {
                if (!this.isMouseDown) {
                    this.isMouseDown = true
                }
                this.touchStart(event)
            } else if (eventType === 'touchMove') {
                this.touchMove(event)
            } else if (eventType === 'touchEnd') {
                this.touchEnd(event)
                this.isMouseDown = false
            }
        },
        touchStart(e) {
            this.startY = e.touches[0].pageY
            this.isDraging = true
            this.startTime = new Date().getTime()
            this.startIndex = this.currentIndex
        },
        touchMove(e) {
            // 边界限制，最上或最下位置不可拖动
            let tempDice = this.startMoveDistance + e.touches[0].pageY - this.startY
            let limitMin = this.heightParams.maskHeight - this.heightParams.wrapperHeight
            if (tempDice > 0) {
                tempDice = 0
            } else if (tempDice < limitMin) {
                tempDice = limitMin
            }
            this.curMoveDistance = tempDice

            // 更新currentIndex
            let tempIndex = Math.round((-this.curMoveDistance) / (this.heightParams.unitHeight))
            this.currentIndex = this.formateIndex(tempIndex)
        },
        touchEnd(e) {
            this.isDraging = false
            let endTime = new Date().getTime()
            if ((endTime - this.startTime) < 300) {
                let endY = e.changedTouches[0].pageY
                let distance = endY - this.startY
                let newIndex = Math.round((-distance / this.heightParams.unitHeight) * 3) + this.startIndex

                this.currentIndex = this.formateIndex(newIndex)
            }

            this.curMoveDistance = -(this.currentIndex * this.heightParams.unitHeight)
            this.startMoveDistance = this.curMoveDistance
            let returndata = {
                index: this.currentIndex,
                content: this.pickItemList[this.currentIndex],
                slotIndex: this.slotIndex
            }

            this.$emit('select', returndata)
        },
        formateIndex(curIndex) {
            return curIndex < 0 ? 0 : curIndex >= this.pickItemList.length ? (this.pickItemList.length - 1) : curIndex
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/vars.scss';
@import '../../assets/styles/rem.scss';
$designWidth: 750;
.picker-cell {
    float: left;
    position: relative;
    height: 100%;
    .picker-mask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
    }
    .picker-item {
        font-size: px2rem(26);
        line-height: px2rem(60);
        color: #999999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .picker-item_active {
        line-height: px2rem(106);
        font-size: px2rem(30);
        color: #222222;
    }
    .picker-wrapper {
        padding-top: px2rem(147);
        padding-bottom: px2rem(147);
        transition-duration: 0.3s;
    }
    .picker-item_draging {
        transition-duration: 0s;
    }
}

.flex {
    width: px2rem(750);
}

.flex2 {
    width: px2rem(375);
}

.flex3 {
    width: px2rem(250);
}

.text_left {
    text-align: left;
}

.text_center {
    text-align: center;
}

.text_right {
    text-align: right;
}
</style>
